import { createApp } from "mini-zvm";
import "./assets/styles.css";
const app = createApp({
  template: "#app",
  data() {
    return {
      data: "这是绑定的值",
      isDisable: true,
      classNae: "red",
    };
  },
  methods: {
    handleBtnClick() {
      this.isDisable = !this.isDisable;
    },
  },
});

app.mount("#app");
