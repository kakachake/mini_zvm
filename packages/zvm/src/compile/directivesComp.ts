import { effect, watch } from "../main";
import { App, propsType, VM } from "../zvm/type";
import { CompileComp } from "./compileComp";
import { render } from "./render";
import { CustomDirective, CustomDirectiveFn } from "./type";
import { getValueByPath, runInScope, setValueByPath } from "./util";

const customDirectives: CustomDirective = {};

export function registerDirective(name: string, fn: CustomDirectiveFn) {
  customDirectives[name.toLowerCase()] = fn;
}

export function parseDirective(directive: string) {
  const directiveReg = /^z-(\w+)\s*(:(\w*))?$/;

  const matchDirective = directive.match(directiveReg);

  if (!matchDirective) return {};

  const name = matchDirective[1];
  const arg = matchDirective[3];
  return {
    name,
    arg,
  };
}

export function triggerCompDirective(
  node: Node,
  vm: VM,
  directive: string,
  expression: string,
  apps: Set<App>
) {
  const { name, arg } = parseDirective(directive);
  if (!name || !arg) return;
  console.log("triggerCompDirective", name, arg);

  if (compDirectives[name]) {
    compDirectives[name](node, vm, directive, expression, apps);
  }
}

export const compDirectives = {
  on(
    node: Element,
    vm: VM,
    directive: string,
    expression: string,
    apps: Set<App>
  ) {
    // z-on:click -> click
    // 函数调用
    console.log("on", directive, expression);

    const methodReg = /^(\w+)?/;
    expression = expression.replace(/\s/g, "");
    const matchMethod = expression.match(methodReg);
    console.log("matchMethod", matchMethod);

    if (!matchMethod) return;

    const method = matchMethod[1];

    const eventType = directive.split(":")[1];

    const fn = vm && vm[method];
    if (eventType && fn) {
      const eventHandler = (...args: any[]) => {
        fn.apply(vm, args);
      };
      const undsubscribe = vm.pubsub?.subscribe(eventType, eventHandler);
      apps.forEach((app) => {
        app.vm.$emit = (eventType, ...args) => {
          vm.pubsub?.publish(eventType, ...args);
        };
        app.vm._unsubscribes.add(undsubscribe!);
      });
    }
  },

  model(node: HTMLInputElement, vm: VM, directive: string, expression: string) {
    // TODO bind input

    this.text(node, vm, directive, expression);

    // 如果是input
    if (
      (node.tagName === "INPUT" && node.type === "text") ||
      node.tagName === "TEXTAREA"
    ) {
      node.addEventListener("input", (e: Event) => {
        setValueByPath(
          vm.$data,
          expression,
          (e.target as HTMLInputElement).value
        );
        e.preventDefault();
      });
    }
    // 如果是checkbox
    if (node.tagName === "INPUT" && node.type === "checkbox") {
      node.addEventListener("change", (e: Event) => {
        setValueByPath(
          vm.$data,
          expression,
          (e.target as HTMLInputElement).checked
        );
      });
    }
    //如果是radio
    if (node.tagName === "INPUT" && node.type === "radio") {
      node.addEventListener("change", (e: Event) => {
        setValueByPath(
          vm.$data,
          expression,
          (e.target as HTMLInputElement).value
        );
      });
    }
  },

  // 通用函数，既适用z-text，也适用{{text}}
  text(
    node: Node,
    vm: VM,
    _directive: string,
    expression: string,
    replace = ""
  ) {
    const renderFn = render["textRender"];

    if (renderFn) {
      watch(
        () => {
          return runInScope(vm, "scope", expression);
        },
        (newValue) => {
          renderFn && renderFn(node, newValue, replace);
        },
        {
          immediate: true,
        }
      );
    }
  },

  if(
    node: HTMLElement,
    vm: VM,
    _directive: string,
    expression: string,
    compileComp: CompileComp // 编译组件实例
  ) {
    // const next = node.nextElementSibling;

    // TODO z-else
    // let elseNode: HTMLElement | null = null;
    // if (next && next.getAttribute("z-else") !== undefined) {
    //   elseNode = next as HTMLElement;
    // }
    let app: App;
    const updated = (newvalue: boolean) => {
      if (newvalue) {
        app = compileComp.createCompApp();

        compileComp.mounted(app);

        // elseNode && (elseNode.style.display = "none");
      } else {
        compileComp.unmounted(app);
        // elseNode && (elseNode.style.display = "block");
      }
    };
    watch(
      () => {
        return !!runInScope(vm, "scope", expression);
      },
      updated,
      {
        immediate: true,
      }
    );
  },

  for(node: HTMLElement, vm: VM, _directive: string, expression: string) {
    //去除空格
    expression = expression.replace(/\s/g, "");
    const REF_LIST_FOR = /([(](\w+(,\w+)?)[)]|(\w+))in(\w+)/;
    const forMatch = expression.match(REF_LIST_FOR);

    if (forMatch) {
      const [, , values, , , list] = forMatch;
      let value = forMatch[1];
      let index: string | undefined;
      if (values) {
        // 去左右括号
        [value, index] = values.split(",");
      }

      const renderFor = render.forRender(node);
      effect(() => {
        renderFor(value, index, runInScope(vm, "scope", list), vm);
      });
    }
  },

  bind(
    node: Node,
    vm: VM,
    directive: string,
    expression: string,
    {
      props,
      attrs,
    }: {
      props: propsType;
      attrs: object;
    }
  ) {
    const dirSplit = directive.split(":");

    const dir = dirSplit.length > 1 ? dirSplit[1] : directive;
    console.log(props);

    if (props.hasOwnProperty(dir)) {
      const value = runInScope(vm, "scope", expression);
      console.log(value);

      if (Object(value) instanceof props[dir].type) {
        Object.defineProperty(props[dir], "default", {
          enumerable: true,
          configurable: true,
          get() {
            return runInScope(vm, "scope", expression);
          },
        });
      } else {
        console.warn(`${dir} is not a ${props[dir].type.name}`);
      }
    } else {
      Object.defineProperty(attrs, dir, {
        enumerable: true,
        configurable: true,
        get() {
          return runInScope(vm, "scope", expression);
        },
      });
    }

    // let renderFn = render[dir + "Render"];
    // if (!renderFn) {
    //   renderFn = render.attrRender(dir);
    // }
    // if (renderFn) {
    //   effect(() => {
    //     renderFn(node, runInScope(vm, "scope", expression));
    //   });
    // }
  },
};
