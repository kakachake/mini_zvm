# ZVM

简单的 MVVM 框架实现

## 简介

zvm 是一个简单的 MVVM 框架，支持响应式，单向绑定，双向绑定，参考 vue 原理实现。
支持的指令有：`z-model`、`z-on`、`z-bind`、`z-for`、`z-if`、`z-else`

下面是一个最基本的示例：

```javascript
import { createApp } from "mini-zvm";

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

## 安装

### CDN

```javascript
<script src="https://unpkg.com/mini-zvm"></script>
```

[CDN 引入示例地址](https://mini-vue3.vercel.app/cdn.html)

### npm

推荐使用 npm 安装

```cmd
npm install mini-zvm
```

## 示例

这里提供了在线编辑器，可以在线编辑器中编辑示例代码，然后在线上运行。

[在线编辑器](https://mini-vue3.vercel.app/editor.html)

以下是一些示例功能及其代码：
[示例地址](https://mini-vue3.vercel.app/)

[示例代码](https://github.com/kakachake/mini-zvm-example)
