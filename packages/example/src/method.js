import { createApp } from "mini-zvm";
import "./assets/styles.css";
const app = createApp({
  template: "#app",
  data() {
    return {
      count: 0,
      message: "hello",
      obj: {
        count: 0,
      },
    };
  },

  methods: {
    handleClick() {
      this.count++;
    },
    countP(count) {
      return this.count + count;
    },
  },
});

app.mount("#app");
