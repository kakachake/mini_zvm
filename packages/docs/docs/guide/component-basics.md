# 组件基础

## 基本示例

这是一个 zvm 组件的示例：

```javascript
// 定义一个名为 button-counter 的新全局组件
app.component("button-counter", {
  data() {
    return {
      count: 5,
    };
  },
  methods: {
    add() {
      this.count++;
    },
  },
  // 使用渲染函数编写组件的模板
  render(h) {
    return h(`
    <button z-on:click="add" >
      You clicked me {{ count }} times.
    </button>`);
  },
});
```

组件是带有名称的可复用实例，在这个例子中是 `<button-counter>`。我们可以把这个组件作为一个根实例中的自定义元素来使用：

```html
<div id="app">
  <button-counter></button-counter>
</div>
```

```javascript
import { createApp } from "mini-zvm";
const app = createApp({
  template: "#app",
});
app.mount("#app");
```

## 组件的复用

你可以将组件进行任意次数的复用：

```html
<div id="app">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

正如你所想的，他们之间互不干扰。

## 通过 Prop 向子组件传递数据

Prop 是你可以在组件上注册的一些自定义 attribute。为了给`button-counter`传递初始化数据，我们可以用`props`选项将其包含在该组件可接受的 `prop` 列表中：

```javascript
app.component("button-counter", {
  props: {
    propcount: {
      type: Number,
      default: 0,
    },
  },
  //...
  created() {
    console.log("button-counter created");
    // 组件的count属性将会被初始化为propcount的值
    this.count = this.propcount;
  },
  //...
});
```

```html
<div id="app">
  <button-counter z-bind:propcount="1"></button-counter>
  <button-counter z-bind:propcount="2"></button-counter>
  <button-counter z-bind:propcount="3"></button-counter>
  <button-counter z-bind:propcount="4"></button-counter>
</div>
```

当一个值被传递给一个 prop attribute 时，它就成为该组件实例中的一个 property。该 property 的值可以在模板中访问，就像任何其他组件 property 一样。

## 监听子组件事件

在开发子组件时，我们可能需要与父组件进行沟通，比如，当子组件发出一个事件时，父组件可以做出响应：

子组件：

```javascript
app.component("button-counter", {
  // ...
  methods: {
    add() {
      this.count++;
      // 发送一个事件给父组件，功能是让父组件的count++,这里可以传递参数
      this.$emit("addCount", ...args);
    },
  },
  // ...
});
```

父组件：

```html
<div id="app">
  <!-- 通过z-on绑定事件 -->
  <button-counter z-on:addCount="add" z-bind:propcount="count"></button-counter>
</div>
```

```javascript
  methods: {
    // ...
    data() {
      return {
        count: 0,
      };
    },
    // 子组件可以触发到这个函数,args可以接收子组件传递回来的参数
    add(...args) {
      this.count++;
    },
    // ...
  },
```
