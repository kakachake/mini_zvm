# 单文件组件

## 介绍

zvm 的单文件组件 (即 \*.vue **这里为了使用编辑器高亮，故使用 vue 后缀，因为 zvm 与 vue 的语法在一定程度上是相似的** 文件，简称 SFC) 是一种特殊的文件格式，使我们能够将一个 zvm 组件的模板、逻辑封装在单个文件中。下面是一个单文件组件的示例：

```javascript
<template>
  <div>
    <p>{{ foo }}</p>
    <button z-on:click="inc">{{ count }}</button>
    <button z-on:click="emitClick">
      使用emit向父组件响应，可以传参，父组件的count+= {{ count }}
    </button>
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
    emitClick() {
      console.log(111);
      this.$emit("sfcclick", this.count);
    },
  },
};
</script>
```

如你所见，zvm 的单文件组件是 HTML、~~CSS~~ 和 JavaScript 三种元素的自然延伸。`<template>`、`<script>` 和 ~~`<style>`~~ 三个块在同一个文件中封装、组合了组件的视图、逻辑和样式。

## 如何使用？

### 使用脚手架

这里提供了脚手架工具，可以轻松创建一个 zvm 项目：

[使用构建工具](/guide/quick-start.html#使用构建工具)

### 使用 zvm-loader

zvm Loader 是一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 zvm 组件：

npm 地址：
[zvm-loader](https://www.npmjs.com/package/zvm-loader)
