import { createApp } from "mini-zvm";
const app = createApp({
  template: "#app",
  data() {
    return {
      count: 0,
      items: [
        {
          msg: "111",
        },
        {
          msg: "222",
        },
        {
          msg: "333",
        },
      ],
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
    item: {
      type: Object,
      default: {
        msg: 123,
      },
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  created() {
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
      <div>{{item.msg}}</div>
      {{propcount}}
    </div>
    `);
  },
});

app.mount("#app");
