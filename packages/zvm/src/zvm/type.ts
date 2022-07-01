import { PubSub } from "../pubsub/pubsub";

export interface ZvmOptions {
  template?: string;
  data?: () => object;
  computed?: object;
  methods?: object;
  created?: () => void;
  mounted?: () => void;
}

export interface VM {
  $el?: HTMLElement;
  $data?: any;
  $options: ZvmOptions;
  mount?: (el: string) => void;
  pubsub?: PubSub;
}

export interface App {
  vm: VM;
  mount: (el: string) => void;
}
