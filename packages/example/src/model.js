import { createApp } from "mini-zvm";
import "./assets/styles.css";
const app = createApp({
  template: "#app",
  data() {
    return {
      data: "",
      checked: "",
      picked: "",
    };
  },
});

app.mount("#app");
