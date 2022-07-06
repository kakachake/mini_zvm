import Sfc from "./sfc.vue";

import { createApp } from "mini-zvm";
const app = createApp({
  components: {
    Sfc,
  },
  template: "#app",
  data() {
    return {
      count: 1,
    };
  },
  methods: {
    add() {
      this.count++;
    },
  },
});

app.mount("#app");
