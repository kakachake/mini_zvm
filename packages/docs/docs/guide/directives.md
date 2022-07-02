# 各个指令介绍

## z-bind

上述已经介绍过了，这里不再重复介绍。

## z-model 双向绑定

`z-model`可以将 input 框的内容自动同步给 JavaScript 中的变量，且是响应式的

基本用法：

### 文本

```html
<input type="text" z-model="text" />
<p>text is: {{ text }}</p>
```

### 多行文本

```html
<textarea z-model="text"></textarea>
```

### 复选框

```html
<input type="checkbox" id="checkbox" z-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

### 单选

```html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" z-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" z-model="picked" />
<label for="two">Two</label>
```

## z-on 监听事件

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

### 传递参数

```html
<div id="app">
  <button z-on:click="handleClick('test')">Count is: {{ count }}</button>
</div>
```

### 访问原生事件参数

有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 `$event` 变量

```javascript
<div z-bind:class="class" z-on:click="handleClick('test', $event, a)"></div>
```

```javascript
handleClick(arg1, $event, arg2) {
  console.log("点击了：",  $event.target);
},
```

## z-for

### 基本使用

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

### 事件绑定

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

## z-if、z-else 条件渲染

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
