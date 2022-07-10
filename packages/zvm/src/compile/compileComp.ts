import { createApp } from "../main";
import { App, propsType, VM, ZvmOptions } from "../zvm/type";
import { DIR_BIND_REG, DIR_FOR_REG, DIR_IF_REG, DIR_REG } from "./constant";

import { compDirectives, triggerCompDirective } from "./directivesComp";

// 编译模板中的组件
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
  }

  createCompApp() {
    const app = createApp(this.component!);
    // 预编译组件
    app.vm._runCompile();
    this.apps.add(app);
    // return app;

    return app;
  }

  mounted(app: App) {
    this.compileDirectives();
    app.vm.compile?.mount(this.node, true);
  }

  unmounted(app: App) {
    if (!app) return;
    app.destroy && app.destroy();
    this.apps.delete(app);
    this.node.parentNode?.replaceChild(this.comment!, this.node);
  }

  // 初始化组件,这里需要对组件上的z-if和z-for进行预处理
  initApp() {
    const componentProps = this.component!.props;
    const attrs = this.component!.attrs;
    this.attrs.forEach((value, key) => {
      // 在组件渲染前先对z-bind进行处理
      if (DIR_BIND_REG.test(key)) {
        compDirectives.bind(this.node, this.parentVm, key, value, {
          props: componentProps || {},
          attrs: attrs || {},
        });
        this.attrs.delete(key);
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
    } else {
      // 没有if，直接创建并挂载
      const app = this.createCompApp();
      this.mounted(app);
    }
  }

  // 将组件上属性都存储到attrs中，方便后续使用
  initAttrs() {
    Array.from((this.node as Element).attributes).forEach((attr: Attr) => {
      // attr.nodeName不区分大小写
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
