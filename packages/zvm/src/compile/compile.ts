import { VM } from "../zvm/type";
import { directives, triggerDirective } from "./directives";
const DIR_REG = /^z-/;
const DIR_FOR_REG = /^z-for/;
export class Compile {
  node: Node;
  vm: VM;
  // 设置标记变量，对于v-for的子元素，不需要继续深度遍历
  needDeepCompile = true;
  frag: DocumentFragment;
  options: any;
  constructor(node: Node, vm: VM, options = { compileRoot: false }) {
    this.node = node;
    this.vm = vm;
    this.options = options;
    this.frag = this.nodeToFragment(this.node);

    // 解决z-for的节点未编译的问题
    options.compileRoot && this.compileNode(this.node, this.vm);
    this.compileFrag(this.frag, this.vm);
    // this.node.appendChild(this.frag);
  }

  // 挂载节点，如果传入el，则挂载到el，否则挂载到node
  mount(el?: string) {
    if (el) {
      const element = document.querySelector(el);
      element && element.appendChild(this.frag);
    } else {
      this.node.appendChild(this.frag);
    }
    this.vm.pubsub?.publish("mounted");
  }

  // 节点转换成fragment
  nodeToFragment(node: Node) {
    const frag = document.createDocumentFragment();
    let child: ChildNode | null;

    while ((child = node.firstChild)) {
      frag.appendChild(child);
    }
    return frag;
  }

  // 编译入口
  compileFrag(frag: DocumentFragment | HTMLElement | Node, vm: VM) {
    const childNodes = frag.childNodes;

    Array.from(childNodes).forEach((node: Node) => {
      this.compileNode(node, vm);
      // 如果有子节点且needDeepCompile为true，则继续深度遍历
      if (node.childNodes && node.childNodes.length && this.needDeepCompile) {
        this.compileFrag(node as HTMLElement, vm);
      }
      this.needDeepCompile = true;
    });
  }

  // 编译节点
  compileNode(node: Node, vm: VM) {
    if (node.nodeType === 1) {
      //元素节点
      this.compileElement(node as HTMLElement, vm);
    } else if (node.nodeType === 3) {
      this.compileText(node as Text, vm);
    }
  }

  // 编译文本节点
  compileText(node: Text, vm: VM) {
    const text = node.textContent;
    if (!text) return;
    const reg = /\{\{(.*)\}\}/;
    const res = reg.exec(text);
    if (res !== null) {
      console.log(directives);

      directives["text"](node, vm, "text", res[1], res[0]);
    }
  }

  // 编译元素节点
  compileElement(node: HTMLElement, vm: VM) {
    const attr = Array.from(node.attributes);

    const isZFor = attr.findIndex((attr: Attr) => {
      return DIR_FOR_REG.test(attr.nodeName);
    });
    // 如果是v-for，则不需要继续深度遍历，只需要编译z-for，其他的指令在z-for内部进行编译
    if (!!~isZFor) {
      this.needDeepCompile = false;
      this.compileDirective(node, vm, attr[isZFor]);
      return;
    }

    Array.from(node.attributes).forEach((attr: Attr) => {
      this.compileDirective(node, vm, attr);
    });
  }

  // 编译指令
  compileDirective(node: HTMLElement, vm: VM, attr: Attr) {
    const directive = attr.nodeName;
    const expression = attr.nodeValue || "";
    if (DIR_REG.test(directive)) {
      // 寻找该指令

      triggerDirective(node, vm, directive, expression);

      node.removeAttribute(directive);
    }
  }
}
