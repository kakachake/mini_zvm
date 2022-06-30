import { effect } from "./effect";

interface WatchOptions {
  deep?: boolean;
  immediate?: boolean;
  flush?: "post";
}

export function watch(
  getter: object | (() => void),
  fn: (newVal, oldVal, onInvalidate) => void,
  options: WatchOptions = {
    immediate: false,
  }
) {
  let oldVal: any, newVal: any;

  // 存储过期回调
  let cleanUp: (() => void) | null;

  function onInvalidate(fn) {
    cleanUp = fn;
  }

  function job() {
    cleanUp && cleanUp();
    cleanUp = null;
    newVal = effectFn();
    fn(newVal, oldVal, onInvalidate);
    oldVal = newVal;
  }

  const effectFn = effect(
    () => {
      if (typeof getter === "function") {
        return getter();
      } else if (typeof getter === "object") {
        return traverse(getter);
      }
    },
    {
      lazy: true,
      scheduler: () => {
        if (options.flush === "post") {
          Promise.resolve().then(job);
        } else {
          job();
        }
      },
    }
  );

  // 立即执行则调用job
  if (options.immediate) {
    job();
  } else {
    // 由于设置了lazy:true，故需要手动调用effectFn进行依赖收集
    effectFn();
  }
}

/**
 * 递归读取value
 * @param value
 * @param seen 用来存储已经读取过的值，避免发生死循环
 * @returns
 */
function traverse(value: object, seen = new Set()) {
  if (typeof value != "object" || value === null || seen.has(value))
    return value;
  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
