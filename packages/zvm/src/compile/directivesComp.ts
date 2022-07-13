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
  app: App
) {
  const { name, arg } = parseDirective(directive);
  if (!name || !arg) return;

  if (compDirectives[name]) {
    compDirectives[name](node, vm, directive, expression, app);
  }
}

export const compDirectives = {
  on(node: Element, vm: VM, directive: string, expression: string, app: App) {
    // z-on:click -> click
    // 函数调用

    const methodReg = /^(\w+)?/;
    expression = expression.replace(/\s/g, "");
    const matchMethod = expression.match(methodReg);

    if (!matchMethod) return;

    const method = matchMethod[1];

    const eventType = directive.split(":")[1];

    const fn = vm && vm[method];
    if (eventType && fn) {
      const undsubscribe = vm.pubsub?.subscribe(eventType + app.vm.id, fn);
      app.vm.$emit = (eventType, ...args) => {
        vm.pubsub?.publish(eventType.toLowerCase() + app.vm.id, ...args);
      };
      app.vm._unsubscribes.add(undsubscribe!);
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
    let app: App;
    const updated = (newvalue: boolean) => {
      if (newvalue) {
        app = compileComp.createCompApp();

        compileComp.mount(app);
      } else {
        compileComp.unmounted(app);
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

  for(
    node: HTMLElement,
    vm: VM,
    _directive: string,
    expression: string,
    compileComp: CompileComp // 编译组件实例
  ) {
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
      const render = compileComp.createCompApps(value, index);
      effect(() => {
        render(runInScope(vm, "scope", list));
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
      componentProps,
    }: {
      props: propsType;
      attrs: object;
      componentProps: propsType;
    }
  ) {
    const dirSplit = directive.split(":");

    const dir = dirSplit.length > 1 ? dirSplit[1] : directive;

    if (componentProps.hasOwnProperty(dir)) {
      const value = runInScope(vm, "scope", expression);

      if (Object(value) instanceof componentProps[dir].type) {
        Object.defineProperty(props, dir, {
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
  },
};
