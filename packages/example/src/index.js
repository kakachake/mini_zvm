import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      parentData: "外层的数据",
      a: 1,
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
      href: "http://www.baidu.com",
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
    handleClick(msg) {
      console.log(msg);
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

      console.log(this);

      this.items.splice(index, 1);
    },
    handleChangeUrl() {
      setTimeout(() => {
        this.href = "http://www.bilibili.com";
      }, 1000);
    },
  },
});

app.mount("#app");
