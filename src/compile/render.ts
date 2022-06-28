export const render = {
  textRender: (node: HTMLElement, text: string, replace: string) => {
    if (!Object.hasOwn(node, "_textContent")) {
      Object.defineProperty(node, "_textContent", {
        value: node.textContent,
      });
    }
    const originText = (node as any)._textContent;
    node.textContent = originText.replace(replace, text) || "";
    // node.textContent = typeof text == "undefined" ? "" : text;
  },
};
