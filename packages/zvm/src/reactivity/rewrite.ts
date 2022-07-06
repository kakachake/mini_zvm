import { ITERATE_KEY, MAP_KEY_ITERATE_KEY, RAW_KEY } from "./constant";
import { track, trigger } from "./effect";
import { reactive } from "./reactive";
import { proxyObjType, TriggerType } from "./type";

// 重写Set、Map中的方法，使其可以监听数据变化
export const mutableInstrumentations = {
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
    const target = this[RAW_KEY];
    track(target, ITERATE_KEY);

    return target.forEach(
      (v, k, m) => callbackfn(wrap(v), wrap(k), m),
      thisArg
    );
  },

  [Symbol.iterator](
    this: (Map<any, any> | Set<any>) & proxyObjType<Map<any, any> | Set<any>>
  ) {
    const target = this[RAW_KEY];
    track(target, ITERATE_KEY);
    const itr = target[Symbol.iterator]();

    return {
      next() {
        const { value, done } = itr.next();
        return {
          value: value ? [wrap(value[0]), wrap(value[1])] : value,
          done,
        };
      },
      // 迭代函数如for...of迭代一个可迭代对象时，会先执行迭代器的Symbol.iterator方法，然后再执行next方法
      // 所以返回的对象必须含有Symbol.iterator方法
      [Symbol.iterator]() {
        return this;
      },
    };
  },

  entries(
    this: (Map<any, any> | Set<any>) & proxyObjType<Map<any, any> | Set<any>>
  ) {
    return this[Symbol.iterator]();
  },

  values: valueIterationMethod,

  keys: keyIterationMethod,
};

function valueIterationMethod(
  this: (Map<any, any> | Set<any>) & proxyObjType<Map<any, any> | Set<any>>
) {
  const target = this[RAW_KEY];
  const itr = target.values();
  track(target, ITERATE_KEY);
  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: value ? wrap(value) : value,
        done,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

function keyIterationMethod(
  this: (Map<any, any> | Set<any>) & proxyObjType<Map<any, any> | Set<any>>
) {
  const target = this[RAW_KEY];
  const itr = target.keys();
  track(target, MAP_KEY_ITERATE_KEY);
  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: value ? wrap(value) : value,
        done,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

const wrap = (val: any) => (typeof val === "object" ? reactive(val) : val);
