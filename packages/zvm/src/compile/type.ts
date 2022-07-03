export interface CustomDirectiveFn {
  (node: Node, binding: { arg: string; value: any }): void;
}

export type CustomDirective = {
  [key: string]: CustomDirectiveFn;
};
