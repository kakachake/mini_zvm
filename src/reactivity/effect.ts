import { EffectFn, EffectOptions } from "./type";
// 当前活动的effect函数
let activeEffectFn: EffectFn;
// 存储副作用函数的map
const bucket: WeakMap<any, Map<any, Set<EffectFn>>> = new WeakMap();

// effect函数栈
const effectFnStack: Array<EffectFn> = [];

/**
 * 注册副作用函数，只要fn中存在代理对象/computed对象，则会把当前的副作用函数添加到响应式对象的deps中
 * @param fn getter函数
 * @param options effect函数的配置
 * @returns 返回副作用函数
 */
export function effect(fn: () => void, options: EffectOptions = {}) {
  const effectFn = () => {
    // 移除上次的依赖集合
    cleanUp(effectFn);

    activeEffectFn = effectFn;

    // 将当前的副作用函数推入栈中，嵌套effect的情况
    effectFnStack.push(effectFn);
    const res = fn();
    effectFnStack.pop();
    activeEffectFn = effectFnStack[effectFnStack.length - 1];

    // 返回函数的结果
    return res;
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

export function track(target, key) {
  if (!activeEffectFn) return;
  const depsMap =
    bucket.get(target) || bucket.set(target, new Map()).get(target);
  const deps = depsMap!.get(key) || depsMap!.set(key, new Set()).get(key);
  deps!.add(activeEffectFn);
  activeEffectFn.deps
    ? activeEffectFn.deps.push(deps!)
    : (activeEffectFn.deps = [] as Set<() => void>[]).push(deps!);
}

export function trigger(
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
