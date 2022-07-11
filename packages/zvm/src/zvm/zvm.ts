import { Compile } from "../compile/compile";
import { PubSub } from "../pubsub/pubsub";
import { reactive } from "../reactivity/reactive";
import { App, VM, ZvmOptions } from "./type";
import { computed } from "../main";
import { registerDirective } from "../compile/directives";
import { getRandomId } from "../utils";

// 初始化vm
export function createVM(
  options: ZvmOptions,
  parentVM = {},
  needProxy = true
): VM {
  const vm: VM = Object.create(parentVM);
  vm.id = getRandomId();
  if (options.template || options.render) {
    if (options.template) {
      vm.$el =
        typeof options.template === "string"
          ? document.querySelector(options.template)!
          : options.template;
    } else if (options.render) {
      vm.$el = options.render.call(vm, createElementByString);
    }
  } else {
    throw new Error("template or render not found");
  }

  // 初始化props
  if (options.props) {
    vm.$props = options.props;
    // 将props代理到vm上
    proxyProps(vm);
  }

  // 挂载data
  if (options.data) {
    vm.$data =
      typeof options.data === "function"
        ? needProxy
          ? reactive(options.data())
          : options.data()
        : needProxy
        ? reactive(options.data)
        : options.data;

    // 将data中的属性代理到vm上
    proxyData(vm);
  }

  // 挂载components
  if (options.components) {
    Object.keys(options.components).map((key) => {
      vm.$components = {
        ...vm.$components,
        [key.toLowerCase()]: options.components![key],
      };
    });
  }

  vm.$options = options;
  vm.pubsub = new PubSub();
  console.log(vm.pubsub);

  vm._unsubscribes = new Set();

  // 初始化生命周期
  initLiftcycle(vm, options);

  //将method挂载到vm上
  if (options.methods) {
    Object.keys(options.methods).forEach((key) => {
      proxyMethod(vm, key);
    });
  }

  // 挂载computed
  if (options.computed) {
    initComputed(vm, options.computed);
  }

  // 挂载directives
  if (options.directives) {
    initDrirectives(vm, options.directives);
  }
  return vm;
}

export function createApp(options: ZvmOptions): App {
  const vm = createVM(options);
  vm.pubsub?.publish("created");

  vm._runCompile = (options) => {
    vm.compile = new Compile(vm.$el!, vm, options);
  };

  const mount = (el: string) => {
    vm._runCompile();
    vm.compile!.mount(el);
  };

  const destroy = () => {
    vm.compile?.unmounted();
    vm._unsubscribes.forEach((fn) => {
      fn();
    });
  };

  const registerComponent = createRegisterComponentFactory(vm);

  return {
    vm,
    mount,
    directive: registerDirective,
    destroy,
    component: registerComponent,
  };
}

function proxyProps(context: VM) {
  Object.keys(context.$props).forEach((key) => {
    Object.defineProperty(context, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        return context.$props[key].default;
      },
    });
  });
}

function proxyData(context: VM) {
  Object.keys(context.$data).forEach((key) => {
    Object.defineProperty(context, key, {
      configurable: false,
      enumerable: true,
      get: () => {
        return context.$data[key];
      },
      set: (newVal) => {
        context.$data[key] = newVal;
      },
    });
  });
}

function initLiftcycle(context: VM, options: ZvmOptions) {
  if (options.created) {
    context.pubsub?.subscribe("created", options.created.bind(context));
  }
  if (options.mounted) {
    context.pubsub?.subscribe("mounted", options.mounted.bind(context));
  }
}

function initDrirectives(_context: VM, directives: object) {
  if (typeof directives === "object") {
    Object.keys(directives).forEach((key) => {
      registerDirective(key, directives[key]);
    });
  }
}

function proxyMethod(context: VM, key: string) {
  Object.defineProperty(context, key, {
    configurable: false,
    enumerable: true,
    get: () => {
      return context.$options?.methods?.[key].bind(context);
    },
  });
}

function initComputed(context: VM, computedFns: object) {
  if (typeof computedFns === "object") {
    Object.keys(computedFns).forEach((key) => {
      const getter = computed(computedFns[key].bind(context));
      Object.defineProperty(context, key, {
        // 如果是函数，直接就作为get，否则可能是一个对象，使用对象的get
        // value: computed(computedFns[key].bind(context)),
        get: () => getter.value,
      });
    });
  }
}

function createElementByString(str: string): Element {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div as Element;
}

function createRegisterComponentFactory(vm: VM) {
  return (name: string, component: any) => {
    vm.$components = {
      ...vm.$components,
      [name.toLowerCase()]: component,
    };
  };
}
