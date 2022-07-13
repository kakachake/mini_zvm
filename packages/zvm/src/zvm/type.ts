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
    value?: any;
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
  $emit: (name: string, ...args: any[]) => void;
  id: string;
  mount?: (el: string) => void;
  pubsub?: PubSub;
  compile?: Compile;
  // 存储自定义事件的取消订阅函数
  _unsubscribes: Set<() => void>;
  _runCompile: (...args: any[]) => void;
}

export interface App {
  vm: VM;
  mount: (el: string) => void;
  directive: (name: string, fn: CustomDirectiveFn) => void;
  destroy?: () => void;
  component: (name: string, options: ZvmOptions) => void;
}
