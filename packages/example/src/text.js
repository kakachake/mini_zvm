import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      text: "这是z-text文字,点击它试试",
    };
  },
  methods: {
    handleClick() {
      this.text = "他变了";
    },
  },
});

app.mount("#app");
