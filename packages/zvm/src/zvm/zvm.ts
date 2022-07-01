import { Compile } from "../compile/compile";
import { PubSub } from "../pubsub/pubsub";
import { reactive } from "../reactivity/reactive";
import { App, VM, ZvmOptions } from "./type";

// 初始化vm
export function createVM(options, parentVM = {}, needProxy = true): VM {
  const vm: VM = Object.create(parentVM);
  vm.$el = document.querySelector(options.template);
  vm.$data =
    typeof options.data === "function"
      ? needProxy
        ? reactive(options.data())
        : options.data()
      : needProxy
      ? reactive(options.data)
      : options.data;

  vm.$options = options;
  vm.pubsub = new PubSub();
  initLiftcycle(vm, options);
  Object.keys(vm.$data).forEach((key) => {
    proxyData(vm, key);
  });
  //将method挂载到vm上
  if (options.methods) {
    Object.keys(options.methods).forEach((key) => {
      proxyMethod(vm, key);
    });
  }
  initComputed(vm, options.computed);
  return vm;
}

export function createApp(this, options: ZvmOptions): App {
  const vm = createVM(options, this);
  vm.pubsub?.publish("created");
  const compile = new Compile(vm.$el!, vm);
  return { vm, mount: compile.mount.bind(compile) };
}

function proxyData(obj, key) {
  Object.defineProperty(obj, key, {
    configurable: false,
    enumerable: true,
    get: () => {
      return obj.$data[key];
    },
    set: (newVal) => {
      obj.$data[key] = newVal;
    },
  });
}

function initLiftcycle(context: VM, options: ZvmOptions) {
  if (options.created) {
    context.pubsub?.subscribe("created", options.created.bind(context));
  }
}

function proxyMethod(context: VM, key: string) {
  Object.defineProperty(context, key, {
    configurable: false,
    enumerable: true,
    get: () => {
      return context.$options?.methods?.[key];
    },
  });
}

function initComputed(context: VM, computed: object) {
  if (typeof computed === "object") {
    Object.keys(computed).forEach((key) => {
      Object.defineProperty(context, key, {
        // 如果是函数，直接就作为get，否则可能是一个对象，使用对象的get
        get: computed[key],
      });
    });
  }
}
