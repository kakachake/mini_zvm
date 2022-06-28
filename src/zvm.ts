import { Compile } from "./compile/compile";
import { reactive } from "./reactivity/reactive";
import { VM } from "./type";

export function createApp(this, options) {
  const vm: VM = {
    $options: {},
  };
  vm.$el = document.querySelector(options.el);
  vm.$data =
    typeof options.data === "function"
      ? reactive(options.data())
      : reactive(options.data);
  vm.$options = options;
  Object.keys(vm.$data).forEach((key) => {
    proxyData(vm, key);
  });

  initComputed(vm, options.computed);

  new Compile(vm.$el!, vm);
}

function proxyData(obj, key) {
  Object.defineProperty(obj, key, {
    configurable: false,
    enumerable: true,
    get: function proxyGetter() {
      return this.$data[key];
    },
    set: function proxySetter(newVal) {
      this.$data[key] = newVal;
    },
  });
}

function initComputed(context, computed) {
  if (typeof computed === "object") {
    Object.keys(computed).forEach((key) => {
      Object.defineProperty(context, key, {
        // 如果是函数，直接就作为get，否则可能是一个对象，使用对象的get
        get: computed[key],
      });
    });
  }
}
