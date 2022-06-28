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
