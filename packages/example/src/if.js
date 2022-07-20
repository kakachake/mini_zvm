import { createApp } from "mini-zvm";
import "./assets/styles.css";
const app = createApp({
  template: "#app",
  data() {
    return {
      isShow: true,
    };
  },
  methods: {
    handleBtnClick() {
      this.isShow = !this.isShow;
    },
  },
});

app.mount("#app");
