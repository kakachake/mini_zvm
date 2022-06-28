export type EffectFn = {
  (): void;
  deps?: Array<Set<() => void>>;
  options?: {
    scheduler?: (effectFn: EffectFn) => void;
  };
};
