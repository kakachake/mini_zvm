// 存储副作用函数的map
const bucket: WeakMap<any, Map<string, Set<() => void>>> = new WeakMap();
const RAW_KEY = Symbol("raw_key");
let activeEffect: () => void;

/**
 * 创建一个响应式对象
 * @param obj 对象
 * @param isShallow 是否浅拷贝
 * @param isReadonly 是否只读
 * @returns
 */
export function createReactive(
  obj: any,
  isShallow = false,
  isReadonly = false
) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 代理对象可以通过RAW_KEY获取到原始数据
      if (key === RAW_KEY) {
        return target;
      }

      if (!isReadonly && typeof key !== "symbol") {
        // 如果不是只读，并且key不是symbol，则添加副作用函数
        track(target, key);
      }

      const res = Reflect.get(target, key, receiver);
      if (isShallow) {
        return res;
      }
    },
  });
}

function track(target, key) {
  if (!activeEffect) return;
  const depsMap =
    bucket.get(target) || bucket.set(target, new Map()).get(target);
  const deps = depsMap!.get(key) || depsMap!.set(key, new Set()).get(key);
  deps!.add(activeEffect);
}

export {};
