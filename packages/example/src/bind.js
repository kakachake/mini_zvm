import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      data: "这是绑定的值",
      isDisable: false,
    };
  },
  methods: {
    handleBtnClick() {
      this.isDisable = !this.isDisable;
    },
  },
});

app.mount("#app");
