import { VM } from "../zvm/type";
import { createVM } from "../zvm/zvm";
import { Compile } from "./compile";
import { insertAfter } from "./dom";

export const render = {
  textRender: (node: Node, text: string, replace: string) => {
    if (!Object.hasOwn(node, "_textContent")) {
      Object.defineProperty(node, "_textContent", {
        value: node.textContent,
      });
    }
    const originText = (node as any)._textContent;
    replace
      ? (node.textContent = originText.replace(replace, text) || "")
      : (node.textContent = typeof text == "undefined" ? "" : text);
  },
  classRender: (node: HTMLElement, value: object, replace: string) => {
    for (const key in value) {
      if (value[key]) {
        node.classList.add(key);
      } else {
        node.classList.remove(key);
      }
    }
  },
  attrRender: (attr: string) => (node: HTMLElement, value, replace: string) => {
    if (value === true) node.setAttribute(attr, "");
    else if (value === false) node.removeAttribute(attr);
    else {
      node.setAttribute(attr, value);
    }
  },
  forRender: (node: HTMLElement) => {
    // 利用闭包保存一个原始节点
    // 私有数据，不更改
    const _cloneNode = node.cloneNode(true);
    const _parentNode = node.parentNode;
    const _previousNode: Node | null = node.previousSibling;
    const forNodes: Node[] = [];
    _parentNode?.removeChild(node);
    function clearNodes() {
      forNodes.forEach((node) => {
        _parentNode?.removeChild(node);
      });
      forNodes.length = 0;
    }
    return (value, index, items, vm: VM) => {
      clearNodes();
      let lastNode: Node | null = _previousNode;
      // node.parentNode?.removeChild(node);
      for (let i = 0; i < items.length; i++) {
        if (!items[i]) continue;
        const cloneNode = _cloneNode.cloneNode(true);

        // node.appendChild(frag);
        // TODO
        (cloneNode as Element).removeAttribute("z-for");

        if (lastNode) {
          insertAfter(cloneNode, lastNode);
        } else {
          _parentNode?.appendChild(cloneNode);
        }
        lastNode = cloneNode;
        forNodes.push(cloneNode);
        const childVm = createVM(
          {
            data: {
              [value]: items[i],
              [index]: i,
            },
          },
          vm
        );
        console.log(childVm);

        // debugger;
        Object.setPrototypeOf(childVm, vm);

        // console.log(childVm);

        new Compile(cloneNode, childVm).mount();
        lastNode = cloneNode;
      }
    };
  },
};