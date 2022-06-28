import { EffectFn } from "./type";

// 存储副作用函数的map
const bucket: WeakMap<any, Map<any, Set<EffectFn>>> = new WeakMap();
const RAW_KEY = Symbol("raw_key");

// 创建一个map来记录已经被代理的对象，避免重复代理
const reactiveMap = new Map();
let activeEffectFn: EffectFn;
const effectFnStack: Array<EffectFn> = [];

// enum TriggerType {
//   SET,
//   ADD,
//   DELETE,
// }

/**
 * 创建一个响应式对象
 * @param obj 对象
 * @param isShallow 是否浅拷贝
 * @param isReadonly 是否只读
 * @returns
 */
function createReactive(obj: any, { isShallow = false }) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 代理对象可以通过RAW_KEY获取到原始数据
      if (key === RAW_KEY) {
        return target;
      }

      if (typeof key !== "symbol") {
        // 如果不是只读，并且key不是symbol，则添加副作用函数
        track(target, key);
      }

      const res = Reflect.get(target, key, receiver);

      // 如果为浅响应，则不对值进行响应式化
      if (isShallow) {
        return res;
      }

      // 如果是深响应，则递归响应式化值
      if (typeof res === "object" && res !== null) {
        return reactive(res);
      }

      return res;
    },
    set(target, key, newVal, receiver) {
      const oldVal = target[key];
      const res = Reflect.set(target, key, newVal, receiver);
      if (oldVal !== newVal) {
        trigger(
          target,
          key
          //   {
          //   type: TriggerType.SET,
          //   oldValue: oldVal,
          //   newValue: newVal,
          // }
        );
      }
      return res;
    },
  });
}

function track(target, key) {
  if (!activeEffectFn) return;
  const depsMap =
    bucket.get(target) || bucket.set(target, new Map()).get(target);
  const deps = depsMap!.get(key) || depsMap!.set(key, new Set()).get(key);
  deps!.add(activeEffectFn);
  activeEffectFn.deps
    ? activeEffectFn.deps.push(deps!)
    : (activeEffectFn.deps = [] as Set<() => void>[]).push(deps!);
}

function trigger(
  target,
  key: string | symbol
  // info: {
  //   type: TriggerType;
  //   oldValue?: any;
  //   newValue?: any;
  // }
) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effectsToRun = new Set<EffectFn>();
  const deps = depsMap.get(key);
  deps &&
    deps.forEach((effectFn) => {
      effectsToRun.add(effectFn);
    });

  effectsToRun.forEach((effectFn) => {
    // 避免循环触发
    if (activeEffectFn !== effectFn) {
      if (effectFn.options && effectFn.options.scheduler) {
        effectFn.options.scheduler(effectFn);
      } else {
        effectFn();
      }
    }
  });
}

// 默认reactive函数, 深响应式化
function reactive(obj) {
  // 先查找当前对象是否已经代理过
  const existProxy = reactiveMap.get(obj);
  if (existProxy) {
    // 存在则直接返回
    return existProxy;
  }

  // 否则创建代理对象
  const proxy = createReactive(obj, {});
  reactiveMap.set(obj, proxy);
  return proxy;
}

function shallowReactive(obj) {
  return createReactive(obj, { isShallow: true });
}

interface EffectOptions {
  lazy?: boolean;
  scheduler?: (effect: EffectFn) => void;
}

function effect(fn: () => void, options: EffectOptions = {}) {
  const effectFn = () => {
    // 移除上次的依赖集合
    cleanUp(effectFn);

    activeEffectFn = effectFn;

    // 将当前的副作用函数推入栈中，嵌套effect的情况
    effectFnStack.push(effectFn);
    fn();
    effectFnStack.pop();
    activeEffectFn = effectFnStack[effectFnStack.length - 1];
  };

  effectFn.options = options;

  if (!options.lazy) {
    effectFn();
  }

  return effectFn;
}

function cleanUp(effectFn: EffectFn) {
  if (!effectFn.deps) return;
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    // 将当前的effctFn从deps中移除
    deps.delete(effectFn);
  }
  // 重置effectFn的deps
  effectFn.deps.length = 0;
}

export { reactive, shallowReactive, effect };
