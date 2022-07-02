import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    countPlus() {
      console.log("=====================================");
      console.log("这是computed，每次count改变他只执行一次");
      console.log("=====================================");
      return this.count + 1;
    },
  },
  methods: {
    handleClick() {
      this.count++;
    },
    countP(count) {
      console.log("这是method，每次count改变他执行多次");
      return this.count + count;
    },
  },
});

app.mount("#app");
