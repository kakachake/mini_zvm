import { ITERATE_KEY, track, trigger } from "./effect";
import { proxyObjType, TriggerType } from "./type";
import { getType } from "../utils/index";
export const RAW_KEY = Symbol("raw_key");

// 创建一个map来记录已经被代理的对象，避免重复代理

//TODO
export const shoudTrack = true;

const reactiveMap = new Map();

// 重写Set、Map中的方法，使其可以监听数据变化
const mutableInstrumentations = {
  add(this: Set<any> & proxyObjType<Set<any>>, value: any) {
    // 获取原对象
    const target = this[RAW_KEY];

    const hasValue = target.has(value);
    // 获取原对象， 防止污染原始数据
    const newVal = value[RAW_KEY] || value;
    const res = target.add(newVal);
    if (!hasValue) {
      trigger(target, value, {
        type: TriggerType.ADD,
      });
    }
    return res;
  },

  delete(
    this: (Map<any, any> | Set<any>) & proxyObjType<Map<any, any> | Set<any>>,
    key: any
  ) {
    const target = this[RAW_KEY];
    const hasKey = target.has(key);
    const res = target.delete(key);

    if (hasKey) {
      trigger(target, key, {
        type: TriggerType.DELETE,
      });
    }
    return res;
  },

  get(this: Map<any, any> & proxyObjType<Map<any, any>>, key: any): any {
    const target = this[RAW_KEY];
    const hasKey = target.has(key);
    track(target, key);
    if (hasKey) {
      const res = target.get(key);
      return typeof res === "object" ? reactive(res) : res;
    }
    return undefined;
  },

  set(this: Map<any, any> & proxyObjType<Map<any, any>>, key: any, value: any) {
    const target = this[RAW_KEY];
    const hasKey = target.has(key);
    const oldVal = target.get(key);
    // 获取原对象， 防止污染原始数据
    const newVal = value[RAW_KEY] || value;
    const res = target.set(key, newVal);
    // 这里要区分是否是新增的key，新增的key需要触发ADD事件，而不是SET事件

    if (!hasKey) {
      trigger(target, key, {
        type: TriggerType.ADD,
      });
    } else if (oldVal !== value || (oldVal === oldVal && value === value)) {
      trigger(target, key, {
        type: TriggerType.SET,
      });
    }
    return res;
  },
  forEach(
    this: (Map<any, any> | Set<any>) & proxyObjType<Map<any, any> | Set<any>>,
    callbackfn: ((
      value: any,
      key: any,
      map: Map<any, any> | Set<any>
    ) => void) &
      ((value: any, value2: any, set: Set<any>) => void),
    thisArg: any
  ) {
    // 和get方法一样，一旦我们要获取一个值，我们需要考虑下是否需要触发代理
    const wrap = (val: any) => (typeof val === "object" ? reactive(val) : val);
    const target = this[RAW_KEY];
    track(target, ITERATE_KEY);

    return target.forEach(
      (v, k, m) => callbackfn(wrap(v), wrap(k), m),
      thisArg
    );
  },
};

/**
 * 创建一个响应式对象
 * @param obj 对象
 * @param isShallow 是否浅拷贝
 * @param isReadonly 是否只读
 * @returns
 */
function createReactive<T extends object>(
  obj: T,
  { isShallow = false }
): T & {
  [RAW_KEY]: T;
  __isProxy__: boolean;
} {
  const proxyObjType = getType(obj);

  return new Proxy(obj, {
    get(target: T, key: string | symbol, receiver: object): any {
      // 用来判断该对象是否被代理
      if (key === "__isProxy__") {
        return true;
      }
      // 代理对象可以通过RAW_KEY获取到原始数据
      if (key === RAW_KEY) {
        return target;
      }

      // map类型 | set类型 需要特殊处理，代理里面的方法来监听数据变化
      if (proxyObjType === "set" || proxyObjType === "map") {
        if (key === "size") {
          track(target, ITERATE_KEY);
          return Reflect.get(target, key, target);
        } else {
          if (!!mutableInstrumentations[key]) {
            return mutableInstrumentations[key];
          }
          return target[key].bind(target);
        }
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

    set(target: T, key: string | symbol, newVal: any, receiver: object) {
      const oldVal = target[key];

      const type = Array.isArray(target)
        ? // 如果是数组且key值小于长度，则认为是set，否则是插入新元素
          Number(key) < target.length
          ? TriggerType.SET
          : TriggerType.ADD
        : // 如果对象含有key属性，则认为是set，否则是新增属性
        Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerType.SET
        : TriggerType.ADD;
      const res = Reflect.set(target, key, newVal, receiver);

      if (oldVal !== newVal) {
        trigger(target, key, {
          type: type,
        });
      }
      return res;
    },

    has(target: object, key: string | symbol) {
      track(target, key);
      return Reflect.has(target, key);
    },

    ownKeys(target: object) {
      track(target, Array.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    },

    deleteProperty(target: object, key: string | symbol) {
      const hasKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);
      if (hasKey && res) {
        Array.isArray(target)
          ? trigger(target, key, {
              type: TriggerType.SET,
            })
          : trigger(target, key, {
              type: TriggerType.DELETE,
            });
      }
      return res;
    },
  }) as any;
}

// 默认reactive函数, 深响应式化
function reactive(obj: object) {
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

function shallowReactive<T extends object>(obj: T) {
  return createReactive(obj, { isShallow: true });
}

export { reactive, shallowReactive };
