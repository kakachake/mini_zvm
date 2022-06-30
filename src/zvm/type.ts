export interface ZvmOptions {
  template?: string;
  data?: () => object;
  computed?: object;
  methods?: object;
}

export interface VM {
  $el?: HTMLElement;
  $data?: any;
  $options: ZvmOptions;
  mount?: (el: string) => void;
}

export interface App {
  vm: VM;
  mount: (el: string) => void;
}
