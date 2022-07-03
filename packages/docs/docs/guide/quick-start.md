# 快速开始

本文会帮助你快速开始使用 mini-zvm

## 使用 npm 安装

```cmd
npm install mini-zvm
```

在项目中引入

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

## 使用 cdn 加载

你也可以直接使用 mini-zvm 的 cdn 加载，这样就不需要安装了

请直接复制下面的代码到一个 HTML 文件中，并在浏览器中打开它：

```html
<script src="https://unpkg.com/mini-zvm"></script>

<div id="app">
  <button z-on:click="handleClick">Count is: {{ count }}</button>
</div>

<script>
  const { createApp } = ZVM;
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
</script>
```
