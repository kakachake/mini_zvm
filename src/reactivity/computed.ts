import { effect, track, trigger } from "./effect";

export function computed(getter: () => any) {
  let value: any;
  // 设置标志位，dirty表示数据发生改变，需要更新，实现computed惰性求值
  let dirty = true;
  const effectFn = effect(getter, {
    // 设置lazy为true，表示不会立即执行effectFn，而是在调用computed的时候才执行，实现computed惰性求值
    lazy: true,
    scheduler() {
      if (!dirty) {
        // 将dirty设为true，表示数据发生改变，需要更新
        dirty = true;
        // 调用trigger，告知computed的依赖发生变化让他们重新执行
        trigger(obj, "value");
      }
    },
  });

  // computed要返回的对象，通过obj.value获取到computed返回的值
  const obj = {
    get value() {
      // 如果dirty为true，表示数据发生改变，需要更新
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      // 收集依赖
      track(obj, "value");
      return value;
    },
  };
  return obj;
}
