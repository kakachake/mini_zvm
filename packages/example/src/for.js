import { createApp } from "mini-zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      parentData: "外层data",
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
    handleClick(index) {
      console.log("点击了第" + index + "项");
    },
    handleAddItem() {
      this.parentData += "1";
      this.items.push({
        msg: "新增的数据",
      });
    },
    handleDelClick(index) {
      console.log(index);
      this.items.splice(index, 1);
    },
  },
});

app.mount("#app");
