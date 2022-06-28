import { watch } from "../main";
import { VM } from "../type";
import { render } from "./render";
import { getValueByPath, setValueByPath } from "./util";

function on(node: Element, vm: VM, directive, expression) {
  // z-on:click -> click
  console.log(directive);
  const eventType = directive.split(":")[1];

  const fn = vm.$options.methods && vm.$options.methods[expression];
  console.log(vm.$options.methods);
  console.log(fn);

  console.log(node);
  console.log(eventType);

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

function text(node: Text, vm: VM, directive, expression, replace) {
  bind(node, vm, "text", expression, replace);
}

function bind(
  node: Node,
  vm: VM,
  dir: string,
  expression: string,
  replace: string
) {
  const value = getValueByPath(vm.$data, expression);
  const renderFn = render[dir + "Render"];
  renderFn && renderFn(node, value, replace);

  watch(
    () => {
      return getValueByPath(vm.$data, expression);
    },
    (newValue) => {
      renderFn && renderFn(node, newValue, replace);
    }
  );
}

export default { on, model, text };
