<template>
  <p>{{ foo }}</p>
  <button z-on:click="inc">{{ count }}</button>
</template>

<script>
export default {
  name: "Button",
  data() {
    return {
      foo: "foobar",
      count: 0,
    };
  },
  methods: {
    inc() {
      this.count++;
    },
  },
};
</script>
