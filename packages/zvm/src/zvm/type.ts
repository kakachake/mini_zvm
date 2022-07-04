import { CustomDirectiveFn } from "../compile/type";
import { PubSub } from "../pubsub/pubsub";

export interface ZvmOptions {
  template: string | Element;
  data?: (() => object) | object;
  computed?: object;
  methods?: object;
  created?: () => void;
  mounted?: (this: any) => void;
  directives?: CustomDirectiveFn[];
}

export interface VM {
  $el: Element;
  $data?: any;
  $options: ZvmOptions;
  mount?: (el: string) => void;
  pubsub?: PubSub;
}

export interface App {
  vm: VM;
  mount: (el: string) => void;
  directive: (name: string, fn: CustomDirectiveFn) => void;
}
