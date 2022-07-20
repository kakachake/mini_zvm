import { createApp } from "mini-zvm";
import "./assets/styles.css";
const app = createApp({
  template: "#app",
  data() {
    return {
      show: false,
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
    toggle() {
      this.show = !this.show;
      console.log(this.show);
    },
    addItem() {
      console.log("addItem");
      this.items.push({
        msg: "444",
      });
      console.log(this.items);
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
        msg: 456,
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
