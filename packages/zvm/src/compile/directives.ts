import { effect, watch } from "../main";
import { VM } from "../zvm/type";
import { render } from "./render";
import { CustomDirective, CustomDirectiveFn } from "./type";
import { getValueByPath, runInScope, setValueByPath } from "./util";

const customDirectives: CustomDirective = {};

export function registerDirective(name: string, fn: CustomDirectiveFn) {
  customDirectives[name.toLowerCase()] = fn;
}

export function triggerDirective(
  node: Node,
  vm: VM,
  directive: string,
  expression: string
) {
  const directiveReg = /^z-(\w+)\s*(:(\w*))?$/;

  const matchDirective = directive.match(directiveReg);

  if (!matchDirective) return;

  const name = matchDirective[1];
  const arg = matchDirective[3];

  if (directives[name]) {
    directives[name](node, vm, directive, expression);
  } else if (customDirectives[name]) {
    vm.pubsub?.subscribe("mounted", () => {
      watch(
        () => {
          return runInScope(vm, "scope", expression);
        },
        (newVal: any) => {
          customDirectives[name](node, { arg, value: newVal });
        },
        {
          immediate: true,
        }
      );
    });
  }
}
export const directives = {
  on(node: Element, vm: VM, directive: string, expression: string) {
    // z-on:click -> click
    // 函数调用

    const methodReg = /^(\w+)([(]((,?[$'\w']+)+)[)])?/;
    expression = expression.replace(/\s/g, "");
    const matchMethod = expression.match(methodReg);

    if (!matchMethod) return;

    const method = matchMethod[1];
    const methodArgs: any[] = [];

    const singleReg = /^'(.*)'$/;
    const $eventReg = /(\$event)$/;
    // 如果能查到$event就把位置记下来
    let $eventIdx = -1;
    if (matchMethod && matchMethod[3]) {
      // 去除括号

      const args = matchMethod[3].split(",");
      args.forEach((arg) => {
        // 匹配到单引号就是普通的字符串
        if (singleReg.test(arg)) {
          // 去除单引号
          methodArgs.push(arg.replace(singleReg, "$1"));
        } else if ($eventReg.test(arg)) {
          methodArgs.push(arg);
          $eventIdx = methodArgs.length - 1;
        } else {
          methodArgs.push(getValueByPath(vm.$data, arg));
        }
      });
    }
    const eventType = directive.split(":")[1];

    const fn = vm && vm[method];
    if (eventType && fn) {
      node.addEventListener(eventType, (e) => {
        if (!!~$eventIdx) {
          methodArgs.splice($eventIdx, 1, e);
        }
        if (!methodArgs.length) {
          methodArgs.push(e);
        }
        return fn.call(vm, ...methodArgs);
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

  if(node: HTMLElement, vm: VM, _directives, expression) {
    const next = node.nextElementSibling;

    let elseNode: HTMLElement | null = null;
    if (next && next.getAttribute("z-else") !== undefined) {
      elseNode = next as HTMLElement;
    }

    const updated = (newvalue) => {
      if (newvalue) {
        node.style.display = "block";
        elseNode && (elseNode.style.display = "none");
      } else {
        node.style.display = "none";
        elseNode && (elseNode.style.display = "block");
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

  for(node: HTMLElement, vm: VM, _directive, expression: string) {
    //去除空格
    expression = expression.replace(/\s/g, "");
    const REF_LIST_FOR = /([(](\w+(,\w+)?)[)]|(\w+))in(\w+)/;
    const forMatch = expression.match(REF_LIST_FOR);

    if (forMatch) {
      const [, , values, , , list] = forMatch;
      let value = forMatch[1];
      let index;
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

  bind(node: Node, vm: VM, directive, expression: string) {
    const dirSplit = directive.split(":");

    const dir = dirSplit.length > 1 ? dirSplit[1] : directive;
    console.log(dir);

    let renderFn = render[dir + "Render"];
    if (!renderFn) {
      renderFn = render.attrRender(dir);
    }
    if (renderFn) {
      effect(() => {
        renderFn(node, runInScope(vm, "scope", expression));
      });
    }
  },
};
