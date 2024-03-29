import { VM } from "../zvm/type";
import { CompileComp } from "./compileComp";
import { DIR_FOR_REG, DIR_REG } from "./constant";
import { directives, triggerDirective } from "./directives";

/**
 * 指令解析器
 */
export class Compile {
  node: Node;
  vm: VM;
  // 设置标记变量，对于v-for的子元素，不需要继续深度遍历
  needDeepCompile = true;
  frag: DocumentFragment;
  options: any;
  mountType: "append" | "replace" | undefined;
  mountNode: Node | Element | undefined;
  parentNode: Node | undefined;

  /**
   * 编译构造入口
   * @param node 元素节点
   * @param vm vm实例
   * @param options 编译参数
   */
  constructor(node: Node, vm: VM, options = { compileRoot: false }) {
    this.vm = vm;
    this.options = options;

    // 将节点转换成fragment
    this.frag = this.nodeToFragment(node);
    // 需要挂载的结点
    this.mountNode = node;

    // 编译节点的顶层节点，针对组件类型做的处理
    this.node = this.frag.children[0];
    options.compileRoot && this.compileNode(node, this.vm);
    // 解决z-for的节点未编译的问题
    this.compileFrag(this.frag, this.vm);
  }

  /**
   * 挂载节点，如果传入el，则挂载到el，否则挂载到node
   * @param el 元素节点
   * @param replace  是否替换
   * @returns 返回挂载的节点
   */
  mount(el?: string | Node | Element | DocumentFragment, replace?: boolean) {
    if (!el || typeof el === "boolean") {
      this.mountNode!.appendChild(this.frag);

      this.vm.pubsub?.publish("mounted");
      return this.frag;
    }
    if (typeof el === "string") {
      el = document.querySelector(el) || "";
    }
    if (typeof el === "string") return void 0;
    if (el && replace) {
      this.parentNode = el.parentNode as Node;

      this.parentNode?.replaceChild(this.frag, el);
    } else {
      el && el.appendChild(this.frag);
    }
    this.mountNode = el;
    this.mountType = replace ? "replace" : "append";
    this.vm.pubsub?.publish("mounted");
    return this.node;
  }

  /**
   * 卸载节点
   */
  unmounted() {
    try {
      if (this.mountType === "append") {
        this.mountNode?.removeChild(this.node);
      } else {
        this.parentNode?.replaceChild(this.mountNode!, this.node);
      }
      this.vm.pubsub?.publish("unmounted");
    } catch (error) {}
  }

  /**
   * 移除子节点
   * @param node 元素节点
   */
  removeChilds(node: Node) {
    while (node.firstChild) {
      if (node.firstChild.childNodes.length) {
        this.removeChilds(node.firstChild);
      }
      node.removeChild(node.firstChild);
    }
  }

  /**
   * 返回当前fragment
   * @returns 当前fragment
   */
  getFragment() {
    return this.frag;
  }

  /**
   * 节点转换成fragment
   * @param node 元素节点
   * @returns 返回fragment
   */
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
    // 如果是组件，则进入组件编译
    if (vm.$components && vm.$components[node.nodeName.toLowerCase()]) {
      new CompileComp(node as Element, vm);
      return;
    }
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
      directives["text"](node, vm, "text", res[1], res[0]);
    }
  }

  // 编译元素节点
  compileElement(node: HTMLElement, vm: VM) {
    const attrs = Array.from(node.attributes);

    const isZFor = attrs.findIndex((attr: Attr) => {
      return DIR_FOR_REG.test(attr.nodeName);
    });
    // 如果是v-for，则不需要继续深度遍历，只需要编译z-for，其他的指令在z-for内部进行编译
    if (!!~isZFor) {
      this.needDeepCompile = false;
      this.compileDirective(node, vm, attrs[isZFor]);
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
