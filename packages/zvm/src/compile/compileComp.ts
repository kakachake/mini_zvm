import { createApp, createVM } from "../main";
import { App, VM, ZvmOptions } from "../zvm/type";
import { DIR_BIND_REG, DIR_REG } from "./constant";

import { compDirectives, triggerCompDirective } from "./directivesComp";

// 编译模板中的组件
export class CompileComp {
  componentName: string;
  node: Node;
  parentVm: VM;
  comment: Node | undefined;
  // 可能有多个子组件(for循环的情况)
  apps: Set<
    App & {
      node?: Node;
    }
  > = new Set();
  attrs: Map<any, string> = new Map();
  props: object = {};
  componentOptions: ZvmOptions | undefined;
  constructor(node: Element, parentVm: VM) {
    this.node = node;
    this.parentVm = parentVm;
    this.componentName = node.nodeName.toLowerCase();
    // this.compileNode(node, vm);
    // 获取组件options
    this.componentOptions = this.parentVm.$components?.[this.componentName];

    if (!this.componentOptions) {
      throw new Error(`component ${this.componentName} not found`);
    }
    this.initAttrs();

    this.initApp();
  }

  createCompApp(): App {
    const app = createApp(this.componentOptions!);
    // 预编译组件

    this.apps.add(app);
    // return app;

    return app;
  }

  createCompApps(value: string, index?: string) {
    return (list: any[]) => {
      const fragment = document.createDocumentFragment();
      let i = 0;
      const size = this.apps.size;
      this.apps.forEach((app) => {
        this.unmounted(app, {
          node: app.node,
          remove: i != size - 1,
        });
        i++;
      });
      list.forEach((item, i) => {
        const app: App & {
          node?: Node;
        } = this.createCompApp();
        const newVm = createVM(
          {
            template: this.comment as Element,
            data: index
              ? {
                  [value]: item,
                  [index]: i,
                }
              : {
                  [value]: item,
                },
          },
          this.parentVm
        );

        app.node = this.mount(app, fragment, false, newVm);
      });
      this.node.parentNode?.replaceChild(fragment, this.node!);
    };
  }

  mount(app: App, node?: Node, replace = true, newVm?: VM) {
    this.compileDirectives(app, newVm || this.parentVm);
    app.vm._runCompile();
    return app.vm.compile?.mount(node || this.node, replace);
  }

  unmounted(
    app: App,
    options?: {
      node?: Node;
      remove?: boolean;
    }
  ) {
    if (!app) return;
    app.destroy && app.destroy();
    this.apps.delete(app);
    if (options?.node) {
      if (options.remove) {
        options.node.parentNode?.removeChild(options.node);
      } else {
        options.node.parentNode?.replaceChild(this.node, options.node);
      }
    } else {
      this.node.parentNode?.replaceChild(this.comment!, this.node);
      this.node = this.comment as Element;
    }
  }

  // 初始化组件,这里需要对组件上的z-if和z-for进行预处理
  initApp() {
    if (this.attrs.get("z-if")) {
      // 创建注释结点, 用来显示隐藏的时候做替换
      this.comment = document.createComment("z-if");
      this.node.parentNode?.replaceChild(this.comment, this.node);
      this.node = this.comment;
      compDirectives["if"](
        this.parentVm,
        "if",
        this.attrs.get("z-if") || "",
        this
      );
      this.attrs.delete("z-if");
    } else if (this.attrs.get("z-for")) {
      // for循环的情况
      // 创建注释结点, 用来做替换
      this.comment = document.createComment("z-for");

      this.node.parentNode?.replaceChild(this.comment, this.node);
      this.node = this.comment;

      compDirectives["for"](
        this.parentVm,
        "for",
        this.attrs.get("z-for") || "",
        this
      );
      this.attrs.delete("z-for");
    } else {
      // 没有if，直接创建并挂载
      const app = this.createCompApp();
      this.mount(app);
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

  compileDirectives(app: App, vm: VM) {
    const props = app.vm!.$props;
    const attrs = app.vm!.$attrs;
    const componentProps = app.vm!.$options.props;
    this.attrs.forEach((value, key) => {
      if (DIR_BIND_REG.test(key)) {
        compDirectives.bind(vm, key, value, {
          props: props || {},
          attrs: attrs || {},
          componentProps: componentProps || {},
        });
        // this.attrs.delete(key);
      } else if (DIR_REG.test(key)) {
        const directive = key;
        const expression = value;
        triggerCompDirective(this.parentVm, directive, expression, app);
        // (this.node as Element).removeAttribute(directive);
      } else {
        // attrs
        app.vm.$attrs[key] = value;
      }
    });
  }
}
