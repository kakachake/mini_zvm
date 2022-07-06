import { Compile } from "../compile/compile";
import { CustomDirectiveFn } from "../compile/type";
import { PubSub } from "../pubsub/pubsub";

export interface ZvmOptions {
  name?: string;
  template?: string | Element;
  data?: (() => object) | object;
  computed?: object;
  methods?: object;
  created?: () => void;
  mounted?: (this: any) => void;
  directives?: CustomDirectiveFn[];
  components?: {
    [key: string]: ZvmOptions;
  };
  render?: (this: any, h: (str: string) => Element) => Element;
}

export interface VM {
  $el: Element;
  $data?: any;
  $options: ZvmOptions;
  $components?: {
    [key: string]: ZvmOptions;
  };
  mount?: (el: string) => void;
  pubsub?: PubSub;
  compile?: Compile;
}

export interface App {
  vm: VM;
  mount: (el: string) => void;
  directive: (name: string, fn: CustomDirectiveFn) => void;
}
