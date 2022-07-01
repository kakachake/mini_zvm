import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      parentData: "外层的数据",
      a: 111,
      b: "",
      isShow: true,
      active: false,
      class: {
        active: true,
        default: true,
      },
      obj: {
        name: 123,
      },
      isActive: true,
      isDisabled: false,
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
    handleClick(...args) {
      console.log("点击了：", args[1].target);
      console.log(args);
      this.a++;
      this.class.active = !this.class.active;
    },
    handleBtnClick() {
      this.isShow = !this.isShow;
    },
    handleClassClick() {
      this.isActive = !this.isActive;
    },
    handleDisabled() {
      this.isDisabled = !this.isDisabled;
    },
    handleAddItem() {
      this.items.push({
        msg: "新增的数据" + this.a++,
      });
    },
    handleDelClick(index) {
      console.log(index);

      this.items.splice(index, 1);
    },
  },
});

app.mount("#app");
