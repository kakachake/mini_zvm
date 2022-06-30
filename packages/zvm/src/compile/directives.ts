import { effect, watch } from "../main";
import { VM } from "../zvm/type";
import { render } from "./render";
import { getValueByPath, runInScope, setValueByPath } from "./util";

function on(node: Element, vm: VM, directive: string, expression: string) {
  // z-on:click -> click
  // 函数调用

  const methodReg = /^(\w+)([(](['\w']+)[)])?/;
  const matchMethod = expression.match(methodReg);

  if (!matchMethod) return;

  const method = matchMethod[1];
  const methodArgs: any = [];
  console.log(matchMethod);

  const singleReg = /^'(.*)'$/;
  if (matchMethod && matchMethod[3]) {
    const args = matchMethod[3].split(",");
    args.forEach((arg) => {
      // 单引号正则

      if (singleReg.test(arg)) {
        methodArgs.push(arg.replace(singleReg, "$1"));
      } else {
        methodArgs.push(getValueByPath(vm.$data, arg));
      }
    });
  }
  const eventType = directive.split(":")[1];

  const fn = vm && vm[method];
  if (eventType && fn) {
    node.addEventListener(eventType, fn.bind(vm, ...methodArgs));
  }
}

function model(
  node: HTMLInputElement,
  vm: VM,
  directive: string,
  expression: string
) {
  // TODO bind input
  const value = vm.$data[expression];
  node.value = value;

  node.addEventListener("input", (e: Event) => {
    setValueByPath(vm.$data, expression, (e.target as HTMLInputElement).value);
  });
}

// 通用函数，既适用z-text，也适用{{text}}
function text(
  node: Text,
  vm: VM,
  directive: string,
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
}

function _if(node: HTMLElement, vm: VM, directives, expression) {
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
}

function _for(node: HTMLElement, vm: VM, directive, expression: string) {
  //去除空格
  expression = expression.replace(/\s/g, "");
  const REF_LIST_FOR = /[(](\w+)(,(\w+))[)]in(\w+)/;
  const forMatch = expression.match(REF_LIST_FOR);

  if (forMatch && forMatch[4]) {
    const [, value, , index, list] = forMatch;

    const renderFor = render.forRender(node);
    effect(() => {
      renderFor(value, index, runInScope(vm, "scope", list), vm);
    });
  }
}

function bind(node: Node, vm: VM, directive, expression: string) {
  const dirSplit = directive.split(":");

  const dir = dirSplit.length > 1 ? dirSplit[1] : directive;

  let renderFn = render[dir + "Render"];
  if (!renderFn) {
    renderFn = render.attrRender(dir);
  }
  if (renderFn) {
    effect(() => {
      renderFn(node, runInScope(vm, "scope", expression));
    });
  }
}

export default { on, model, text, if: _if, bind, for: _for };
