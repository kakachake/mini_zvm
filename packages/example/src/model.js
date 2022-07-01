import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      data: "",
    };
  },
});

app.mount("#app");
