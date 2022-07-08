<template>
  <div>
    <p>{{ foo }}</p>
    <button z-on:click="inc">{{ count }}</button>
    <div>props:{{ baz }}</div>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    baz: {
      type: Number,
      default: 5,
    },
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
  },
  data() {
    return {
      foo: "foobar",
      count: 0,
    };
  },
  methods: {
    inc() {
      console.log(111);
      this.count++;
    },
  },
};
</script>
