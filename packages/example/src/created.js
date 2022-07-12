import { createApp } from "mini-zvm";
import axios from "axios";
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
      axios
        .get("/api/search/hot", {
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
