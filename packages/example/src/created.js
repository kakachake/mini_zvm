import { createApp } from "mini-zvm";
import "./assets/styles.css";
import request from "./request";
const app = createApp({
  template: "#app",
  data() {
    return {
      isLoading: true,
      songHotList: [],
    };
  },
  created() {
    this.isLoading = true;
    setTimeout(() => {
      request
        .get("/search/hot", {
          headers: {},
          responseType: "json",
        })
        .then((e) => {
          console.log(e);
          this.songHotList = e.data.result.hots;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }, 500);
  },
});

app.mount("#app");
