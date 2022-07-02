import { createApp } from "mini-zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      data: 1,
      class: {
        active: false,
        default: true,
      },
    };
  },
  methods: {
    handleClick(...args) {
      console.log("点击了：", args[1].target);
      console.log(args);
      this.data++;
      this.class.active = !this.class.active;
    },
    handleClick2(e) {
      console.log(e);
    },
  },
});

app.mount("#app");
