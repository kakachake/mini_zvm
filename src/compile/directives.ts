import { effect, watch } from "../main";
import { VM } from "../type";
import { render } from "./render";
import { getValueByPath, runInScope, setValueByPath } from "./util";

function on(node: Element, vm: VM, directive: string, expression: string) {
  // z-on:click -> click

  const eventType = directive.split(":")[1];

  const fn = vm.$options.methods && vm.$options.methods[expression];

  if (eventType && fn) {
    node.addEventListener(eventType, fn.bind(vm));
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
        return runInScope(vm.$data, "scope", expression);
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
      return !!getValueByPath(vm.$data, expression);
    },
    updated,
    {
      immediate: true,
    }
  );
}

function bind(
  node: Node,
  vm: VM,
  directive,
  expression: string,
  replace: string
) {
  const dirSplit = directive.split(":");
  const dir = dirSplit.length > 1 ? dirSplit[1] : directive;

  const value = runInScope(vm.$data, "scope", expression);

  const renderFn = render[dir + "Render"];

  if (renderFn) {
    effect(() => {
      renderFn(node, value);
    });
  }
}

export default { on, model, text, if: _if, bind };
