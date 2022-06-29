import { EffectFn, EffectOptions, TriggerType } from "./type";
// 当前活动的effect函数
let activeEffectFn: EffectFn;
// 存储副作用函数的map
const bucket: WeakMap<any, Map<any, Set<EffectFn>>> = new WeakMap();

// 迭代器key
export const ITERATE_KEY = Symbol("iterate");

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
  key: string | symbol,
  {
    type,
    newValue,
    oldValue,
  }: {
    type: TriggerType;
    oldValue?: any;
    newValue?: any;
  }
) {
  const depsMap = bucket.get(target);
  console.log(target, key, type);

  if (!depsMap) return;

  const effectsToRun = new Set<EffectFn>();
  const deps = depsMap.get(key);

  const iterateEffects = depsMap.get(ITERATE_KEY);

  deps &&
    deps.forEach((effectFn) => {
      effectsToRun.add(effectFn);
    });

  // 只有添加和删除操作才会改变对象的keys，故此时需要触发iterateEffects
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn != activeEffectFn) {
          effectsToRun.add(effectFn);
        }
      });
  }

  // 如果TriggerType === ADD, 并且target是数组，说明数组的长度发生变化，则需要把数组的length也触发
  if (type === TriggerType.ADD && Array.isArray(target)) {
    const lengthEffects = depsMap.get("length");
    lengthEffects &&
      lengthEffects.forEach((effectFn) => {
        if (effectFn != activeEffectFn) {
          effectsToRun.add(effectFn);
        }
      });
  }

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
