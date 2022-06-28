import { track, trigger } from "./effect";

const RAW_KEY = Symbol("raw_key");

// 创建一个map来记录已经被代理的对象，避免重复代理
const reactiveMap = new Map();

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

export { reactive, shallowReactive };
