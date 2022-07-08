import { Compile } from "../compile/compile";
import { CustomDirectiveFn } from "../compile/type";
import { PubSub } from "../pubsub/pubsub";

export interface propsType {
  [key: string]: {
    type:
      | typeof String
      | typeof Number
      | typeof Boolean
      | typeof Object
      | typeof Array;
    default?: any;
  };
}

export interface ZvmOptions {
  name?: string;
  template?: string | Element;
  data?: (() => object) | object;
  computed?: object;
  props?: propsType;
  methods?: {
    [key: string]: (...args: any[]) => any;
  };
  created?: () => void;
  mounted?: (this: any) => void;
  directives?: CustomDirectiveFn[];
  components?: {
    [key: string]: ZvmOptions;
  };
  render?: (this: any, h: (str: string) => Element) => Element;
  attrs?: object;
}

export interface VM {
  $el: Element;
  $data?: any;
  $options: ZvmOptions;
  $components?: {
    [key: string]: ZvmOptions;
  };
  $props: propsType;
  $attrs: object;
  mount?: (el: string) => void;
  pubsub?: PubSub;
  compile?: Compile;
}

export interface App {
  vm: VM;
  mount: (el: string) => void;
  directive: (name: string, fn: CustomDirectiveFn) => void;
  destroy?: () => void;
}
