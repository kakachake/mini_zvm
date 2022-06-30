import { VM } from "../zvm/type";
import directives from "./directives";

export class Compile {
  node: Node;
  vm: VM;
  // 设置标记变量，对于v-for的子元素，不需要继续深度遍历
  needDeepCompile = true;
  frag: DocumentFragment;
  constructor(node: Node, vm: VM) {
    this.node = node;
    this.vm = vm;
    this.frag = this.nodeToFragment(this.node);

    this.compile(this.frag, this.vm);
    // this.node.appendChild(this.frag);
  }

  mount(el?: string) {
    if (el) {
      const element = document.querySelector(el);
      element && element.appendChild(this.frag);
    } else {
      this.node.appendChild(this.frag);
    }
  }

  nodeToFragment(node: Node) {
    const frag = document.createDocumentFragment();
    let child: ChildNode | null;
    while ((child = node.firstChild)) {
      frag.appendChild(child);
    }
    return frag;
  }

  compile(node: DocumentFragment | HTMLElement, vm: VM) {
    const childNodes = node.childNodes;

    Array.from(childNodes).forEach((node: Node) => {
      if (node.nodeType === 1) {
        //元素节点
        this.compileElement(node as HTMLElement, vm);
      } else if (node.nodeType === 3) {
        this.compileText(node as Text, vm);
      }

      if (node.childNodes && node.childNodes.length && this.needDeepCompile) {
        this.compile(node as HTMLElement, vm);
      }
      this.needDeepCompile = true;
    });
  }

  compileText(node: Text, vm: VM) {
    const text = node.textContent;
    if (!text) return;
    const reg = /\{\{(.*)\}\}/;
    const res = reg.exec(text);
    if (res !== null) {
      directives["text"](node, vm, "text", res[1], res[0]);
    }
  }

  compileElement(node: HTMLElement, vm: VM) {
    Array.from(node.attributes).forEach((attr: Attr) => {
      this.compileDirective(node, vm, attr);
    });
  }

  compileDirective(node: HTMLElement, vm: VM, attr: Attr) {
    const DIR_REG = /^z-/;
    const DIR_FOR_REG = /^z-for/;
    const directive = attr.nodeName;
    const expression = attr.nodeValue;
    if (DIR_REG.test(directive)) {
      // 例如 v-on:click，截取v-on
      const dir = directive.substring(2).split(":")[0];
      if (DIR_FOR_REG.test(directive)) {
        this.needDeepCompile = false;
      }
      // 寻找该指令
      directives[dir] && directives[dir](node, vm, directive, expression);

      node.removeAttribute(directive);
    }
  }
}