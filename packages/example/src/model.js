import { createApp } from "zvm";

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
