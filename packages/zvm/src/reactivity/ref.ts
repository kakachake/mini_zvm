import { reactive } from "../main";

export function ref(value: any) {
  const refObj = {
    value,
  };
  Object.defineProperty(refObj, "__v_isRef", {
    value: true,
  });
  return reactive(refObj);
}

// 原始值是没法响应的，故这里返回一个getter，每次都向
// obj[key]获取值，从而达到响应式
export function toRef(obj: object, key: string) {
  const refObj = {
    get value() {
      return obj[key];
    },
    set value(newValue) {
      obj[key] = newValue;
    },
  };
  Object.defineProperty(refObj, "__v_isRef", {
    value: true,
  });
  return refObj;
}

export function toRefs(obj: object) {
  const res = {};
  Object.keys(obj).forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      res[key] = toRef(obj, key);
    }
  });
  return res;
}
