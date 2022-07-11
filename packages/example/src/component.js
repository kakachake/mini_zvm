import { createApp } from "mini-zvm";
const app = createApp({
  template: "#app",
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    add() {
      this.count++;
      console.log(this.count);
    },
  },
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
      this.$emit("addCount");
    },
  },
  render(h) {
    return h(`
    <div>
      <button z-on:click="add" >
        You clicked me {{ count }} times.
      </button>
      {{propcount}}
    </div>
    `);
  },
});

app.mount("#app");
