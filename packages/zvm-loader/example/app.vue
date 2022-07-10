<template>
  <div>
    {{ count }}
    <button z-on:click="add">click</button>
    <button z-on:click="handleClick">show</button>
    <Sfc z-if="show" z-on:sfcClick="add" z-bind:baz="count"></Sfc>

    <!--  -->
  </div>
</template>

<script>
import Sfc from "./sfc.vue";

export default {
  components: {
    Sfc,
  },
  data() {
    return {
      count: 1,
      show: true,
    };
  },
  methods: {
    add(count) {
      count >= 0 ? (this.count += count) : this.count++;
    },
    handleClick() {
      this.show = !this.show;
    },
  },
};
</script>
