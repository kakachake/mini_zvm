import { createApp } from "mini-zvm";

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
