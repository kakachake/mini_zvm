import { createApp } from "mini-zvm";
import "./assets/styles.css";
const app = createApp({
  template: "#app",
  data() {
    return {
      text: "这是z-text文字,点击它试试",
      count: 0,
      message: "hello",
    };
  },
  methods: {
    handleClick() {
      this.text = "他变了";
    },
    handleBtnClick() {
      this.count++;
    },
    countP(count) {
      return this.count + count;
    },
  },
});

app.mount("#app");
