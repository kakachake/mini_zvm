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
    console.log(value);
    for (const key in value) {
      if (value[key]) {
        node.classList.add(key);
      } else {
        node.classList.remove(key);
      }
    }
  },
};
