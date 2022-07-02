import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      count: 0,
      message: "hello",
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
