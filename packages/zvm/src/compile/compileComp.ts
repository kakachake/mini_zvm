import { createApp } from "../main";
import { App, propsType, VM, ZvmOptions } from "../zvm/type";
import { DIR_BIND_REG, DIR_FOR_REG, DIR_IF_REG, DIR_REG } from "./constant";

import { compDirectives, triggerCompDirective } from "./directivesComp";

export class CompileComp {
  componentName: string;
  node: Node;
  parentVm: VM;
  comment: Node | undefined;
  // 可能有多个子组件(for循环的情况)
  apps: Set<App> = new Set();
  attrs: Map<any, string> = new Map();
  props: object = {};
  component: ZvmOptions | undefined;
  constructor(node: Element, parentVm: VM) {
    this.node = node;
    this.parentVm = parentVm;
    this.componentName = node.nodeName.toLowerCase();
    // this.compileNode(node, vm);
    this.component = this.parentVm.$components?.[this.componentName];
    if (!this.component) {
      throw new Error(`component ${this.componentName} not found`);
    }
    this.initAttrs();

    this.initApp();
    // this.compileDirectives();
  }

  createCompApp() {
    const app = createApp(this.component!);
    this.apps.add(app);
    // return app;

    return app;
  }

  mounted(app: App) {
    app.vm.compile?.mount(this.node, true);
  }

  unmounted(app: App) {
    app.destroy && app.destroy();
    this.apps.delete(app);
    this.node.parentNode?.replaceChild(this.comment!, this.node);
  }

  combineProps(props: object, componentProps: propsType) {
    Object.keys(componentProps).forEach((key) => {
      if (!props[key]) {
        props[key] = componentProps[key];
      }
    });
  }

  // 初始化组件,这里需要对组件上的z-if和z-for进行预处理
  initApp() {
    const componentProps = this.component!.props;
    const attrs = this.component!.attrs;
    this.attrs.forEach((value, key) => {
      if (DIR_BIND_REG.test(key)) {
        compDirectives.bind(this.node, this.parentVm, key, value, {
          props: componentProps || {},
          attrs: attrs || {},
        });
      }
    });

    if (this.attrs.get("z-if")) {
      // 创建注释结点, 用来显示隐藏的时候做替换
      this.comment = document.createComment("z-if");
      this.node.parentNode?.replaceChild(this.comment, this.node);
      this.node = this.comment;
      compDirectives["if"](
        this.node as HTMLElement,
        this.parentVm,
        "if",
        this.attrs.get("z-if") || "",
        this
      );
      this.attrs.delete("z-if");
    }
  }

  initAttrs() {
    Array.from((this.node as Element).attributes).forEach((attr: Attr) => {
      const directive = attr.nodeName;
      const expression = attr.nodeValue || "";
      this.attrs.set(directive, expression);
    });
  }

  compileDirectives() {
    this.attrs.forEach((value, key) => {
      if (DIR_REG.test(key)) {
        const directive = key;
        const expression = value;

        triggerCompDirective(
          this.node,
          this.parentVm,
          directive,
          expression,
          this.apps
        );
        // (this.node as Element).removeAttribute(directive);
      } else {
        // attrs
        this.apps.forEach((app) => {
          app.vm.$attrs[key] = value;
        });
      }
    });
  }
}
