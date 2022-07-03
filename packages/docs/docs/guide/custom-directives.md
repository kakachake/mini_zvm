# 自定义指令

除了默认的指令，我们还可以定义自己的指令：

```javascript
app.directive("yourDirective", (el, binding) => {
  console.log(el, binding);
});
```

## 指令参数

- `el`: 绑定指令的元素
- `binding`: 一个对象，包含一下两个元素：
  - `value`: 绑定的值
  - `arg`: 绑定的参数

比如

```html
<img class="img" z-example:foo="bar" alt="" />
```

`binding` 参数会是一个这样的对象：

```javascript
{
  arg:"foo",
  value:"bar"
}
```

## 示例

### 元素聚焦

```javascript
import { createApp } from "mini-zvm";

const app = createApp({
  //...
});
app.directive("focus", (el) => {
  console.log(el);
  el.focus();
});
app.mount("#app");
```

```html
<input z-focus />
```

假设你还未点击页面中的其他地方，那么上面这个 input 元素应该会被自动聚焦。

### 图片懒加载

点击链接查看：[http://101.43.155.53/front_end_baidu/mini_mvvm/directive.html](http://101.43.155.53/front_end_baidu/mini_mvvm/directive.html)
源码在：[https://github.com/kakachake/mini_vue3/blob/master/packages/example/src/directive.js](https://github.com/kakachake/mini_vue3/blob/master/packages/example/src/directive.js)
