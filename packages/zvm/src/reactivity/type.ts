import { RAW_KEY } from "./reactive";

export type EffectFn = {
  (): void;
  deps?: Array<Set<() => void>>;
  options?: {
    scheduler?: (effectFn: EffectFn) => void;
  };
};
export interface EffectOptions {
  lazy?: boolean;
  scheduler?: (effect: EffectFn) => void;
}
export enum TriggerType {
  SET,
  ADD,
  DELETE,
}

export type proxyObjType<T> = {
  [RAW_KEY]: T;
};
