# 快速开始

本文会帮助你快速开始使用 mini-zvm

## 使用构建工具

构建工具让我们能使用 Zvm 单文件组件 (SFC)。

```cmd
> npx zvm-cli create <your-project-name>
```

这一指令将会执行 zvm 项目脚手架工具。在项目被创建后，通过以下步骤安装依赖并启动开发服务器：

```cmd
> cd <your-project-name>
> npm install
> npm run dev
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
