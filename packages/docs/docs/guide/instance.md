# 创建应用实例

## 创建一个应用实例

```javascript
import { createApp } from "mini-zvm";

const app = createApp({
  /* 根组件选项 */
  template: "#app",
  /* 数据 */
  data() {
    return {
      // ...
    };
  },
  methods: {
    // ...
  },
});
```

## 挂载到 DOM

```javascript
app.$mount("#app");
```

## 生命周期钩子

实例在创建时需要设置数据监听、模板编译、挂载的过程，这里定义了两个生命周期钩子`created`和`mounted`，分别在实例创建时和挂载时被调用。

```javascript
createApp({
  template: "#app",
  created() {
    // ...
  },
  mounted() {
    // ...
  },
});
```
