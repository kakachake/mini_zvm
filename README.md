<div align="center">
  <a target="_blank" href="https://github.com/kakachake/mini_zvm">
    <img src="https://github.com/kakachake/mini_zvm/blob/master/assets/logo.png" alt="logo" width="150px"/>
  </a>
  <h1>ZVM</h1>
  <p>简单的 MVVM 框架实现</p>
</div>

[文档地址](https://mini-zvm-doc.vercel.app/)

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

## 基础

### 创建应用实例

```javascript
import { createApp } from "zvm";

const app = createApp({
  /* 根组件选项 */
  el: "#app",
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

### 模板语法

#### 文本插值

和 vue 相同，最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)：

```html
<span>Count: {{ count }}</span>
```

也可以是表达式:

```html
<span>Count: {{ countA + countB }}</span>
<div>{{isDisabled?"yes":"no"}}</div>
```

#### Attr 绑定

```html
<div z-bind:data-zvm="a">普通attr,打开控制台查看</div>
```

#### 布尔型 Attribute

`布尔型 attribute` 依据 true / false 值来决定 attribute 是否应该存在于该元素上。disabled 就是最常见的例子之一。

```html
<button z-bind:disabled="isDisable"></button>
```

#### 指令

指令是带有 `z-` 前缀的特殊 attribute。

##### 参数

某些指令会需要一个“参数”，在指令名后通过一个冒号隔开做标识。例如用`z-bind`指令来响应式地更新一个 HTML attribute：

```html
<div z-bind:class="{active: isActive}"></div>
```

这里的 class 响应式的绑定了一个对象，当 isActive 为 True 时，class 的值为 active，否则为空。

`z-on` 也有参数，用于响应式地绑定一个事件：

```html
<button z-on:click="yourmethod"></button>
```

## 各个指令介绍

### z-bind

上述已经介绍过了，这里不再重复介绍。

### z-model 双向绑定

`z-model`可以将 input 框的内容自动同步给 JavaScript 中的变量，且是响应式的

基本用法：

#### 文本

```html
<input type="text" z-model="text" />
<p>text is: {{ text }}</p>
```

#### 多行文本

```html
<textarea z-model="text"></textarea>
```

#### 复选框

```html
<input type="checkbox" id="checkbox" z-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

#### 单选

```html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" z-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" z-model="picked" />
<label for="two">Two</label>
```

### z-on 监听事件

你可以使用 `z-on` 指令 来监听 DOM 事件和运行 JavaScript 代码
事件处理器的值为一个函数名

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

#### 传递参数

```html
<div id="app">
  <button z-on:click="handleClick('test')">Count is: {{ count }}</button>
</div>
```

#### 访问原生事件参数

有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 `$event` 变量

```javascript
<div z-bind:class="class" z-on:click="handleClick('test', $event, a)"></div>
```

```javascript
handleClick(arg1, $event, arg2) {
  console.log("点击了：",  $event.target);
},
```

### z-for

#### 基本使用

我们可以使用 `z-for` 指令基于一个数组来渲染一个列表。`z-for` 指令需要一种特殊的语法形式 item in items，其中 items 是源数据的数组，而 item 是迭代项的别名。如果你需要使用索引，可以在 item 后面添加一个索引变量，例如 (item,index) in items。

```javascript
  data(){
    return {
      parentData:"parentData",
      items: [
        {
          msg: "111",
        },
        {
          msg: "222",
        },
        {
          msg: "333",
        },
      ],
    }
  }
```

```html
<li z-for="(item,index) in items">
  <div>{{item.msg}}</div>
  <div>{{index}}</div>
  <div>{{ parentData }}</div>
</li>
```

#### 事件绑定

你可以在 `z-for` 的**内部元素**使用 `z-on` 指令来绑定事件，例如：

```html
<li z-for="(item,index) in items">
  <div>{{item.msg}}</div>
  <div>{{index}}</div>
  <div>{{ parentData }}</div>
  <button z-on:click="handleDelClick(index)">删除</button>
</li>
```

```javascript
handleDelClick(index) {
  this.items.splice(index, 1);
},
```

### z-if、z-else 条件渲染

`z-if` 指令被用于按条件渲染一个区块。这个区块只会在指令的表达式为真时才被渲染。

`z-else`仅当 `z-if` 的表达式为假时才会被渲染。

**一个`z-else`元素必须跟在一个 z-if 或者 z-else-if 元素后面，否则将不会识别它。**

简单示例：

```html
<button z-on:click="handleBtnClick">显示/隐藏</button>
<div z-if="isShow">z-if</div>
<div z-else>else</div>
```

```javascript
import { createApp } from "zvm";

const app = createApp({
  template: "#app",
  data() {
    return {
      isShow: true,
    };
  },
  methods: {
    handleBtnClick() {
      this.isShow = !this.isShow;
    },
  },
});

app.mount("#app");
```

## 构建

```cmd

pnpm i
cd packages/zvm
pnpm run build
//手动打开根目录下的 zvm.html 即可查看效果

```
