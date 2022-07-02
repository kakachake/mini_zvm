# ZVM

简单的 MVVM 框架实现

## 简介

zvm 是一个简单的 MVVM 框架，支持响应式，单向绑定，双向绑定，参考 vue 原理实现。
支持的指令有：`z-model`、`z-on`、`z-bind`、`z-for`、`z-if`、`z-else`

下面是一个最基本的示例：

```javascript
import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      count: 1,
    };
  },
  methods: {
    handleClick() {
      this.count++;
    },
  },
});

app.mount("#app");
```

```html
<div id="app">
  <button z-on:click="handleClick">Count is: {{ count }}</button>
</div>
```

## 示例

```

pnpm i
pnpm run dev:example
//打开 http://localhost:8080/查看效果

```

[展示地址](https://mini-vue3.vercel.app/)
