import { VM } from "../zvm/type";
import { createVM } from "../zvm/zvm";
import { Compile } from "./compile";
import { insertAfter } from "./dom";

export const render = {
  textRender: (node: Node, text: string, replace: string) => {
    if (node.nodeName === "INPUT") {
      const inputType = (node as HTMLInputElement).getAttribute("type");

      // radio不是设置value，而是判断是否选中
      if (inputType === "radio") {
        const value = (node as HTMLInputElement).value;
        (node as HTMLInputElement).checked = text === value;
        return;
      }
      if (inputType === "checkbox") {
        (node as HTMLInputElement).checked = !!text;
        return;
      }
      (node as HTMLInputElement).value = text;
      return;
    }
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

  classRender: (node: HTMLElement, value: object) => {
    for (const key in value) {
      if (value[key]) {
        node.classList.add(key);
      } else {
        node.classList.remove(key);
      }
    }
  },

  attrRender:
    (attr: string) => (node: HTMLElement, value: string | boolean) => {
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
    return (
      value: string,
      index: string | undefined,
      items: string,
      vm: VM
    ) => {
      clearNodes();
      let lastNode: Node | null = _previousNode;
      // node.parentNode?.removeChild(node);
      for (let i = 0; i < items.length; i++) {
        if (!items[i]) continue;
        const cloneNode = _cloneNode.cloneNode(true);

        // node.appendChild(frag);

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
            template: cloneNode as Element,
            data: index
              ? {
                  [value]: items[i],
                  [index]: i,
                }
              : {
                  [value]: items[i],
                },
          },
          vm
        );

        new Compile(cloneNode, childVm, {
          compileRoot: true,
        }).mount();
        lastNode = cloneNode;
      }
    };
  },
};
