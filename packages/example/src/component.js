import { createApp } from "mini-zvm";
const app = createApp({
  template: "#app",
});

// 定义一个名为 button-counter 的新全局组件
app.component("button-counter", {
  props: {
    propcount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  created() {
    console.log("button-counter created");
    this.count = this.propcount;
  },
  methods: {
    add() {
      this.count++;
    },
  },
  render(h) {
    return h(`
    <button z-on:click="add" >
      You clicked me {{ count }} times.
    </button>`);
  },
});

app.mount("#app");
