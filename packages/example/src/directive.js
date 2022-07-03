import { createApp } from "mini-zvm";
import axios from "axios";
const app = createApp({
  template: "#app",
  created() {
    axios.get("http://101.43.155.53:9001/banner?type=2").then((res) => {
      this.imgList = res.data.banners.map((item) => {
        return item.pic;
      });
    });
  },
  data() {
    return {
      imgList: [],
    };
  },
});

app.directive("lazyImg", (el, binding) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        el.src = `https://sdfsdf.dev/${el.clientWidth}x${el.clientHeight}.png`;
        if (entry.isIntersecting) {
          console.log(el);
          // 创建预加载img,加载完成后将src赋值到el
          const imgNode = new Image();
          imgNode.src = binding.value;
          // 图片懒加载
          imgNode.onerror = () => {
            el.src = `https://sdfsdf.dev/${el.clientWidth}x${el.clientHeight}.png`;
          };
          imgNode.onload = () => {
            el.src = binding.value;
          };

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.01 }
  );
  observer.observe(el);
});

app.directive("focus", (node) => {
  console.log(node);
  node.focus();
});

app.mount("#app");