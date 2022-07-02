# 模板语法

## 文本插值

### 文本

和 vue 相同，最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)：

```html
<span>Count: {{ count }}</span>
```

### JavaScript 表达式

支持 JavaScript 表达式绑定，你可以调用函数获得返回值

```html
<span>Count: {{ countA + countB }}</span>
<div>{{ isDisabled?"yes":"no" }}</div>
<div>{{ message.split('').reverse().join('') }}</div>
<div>{{ yourMethod() }}</div>
<div>{{ yourMethod('arg', countA) }}</div>
```

### Attr 绑定

```html
<div z-bind:data-zvm="a"></div>
```

### 布尔型 Attribute

`布尔型 attribute` 依据 true / false 值来决定 attribute 是否应该存在于该元素上。disabled 就是最常见的例子之一。

```html
<button z-bind:disabled="isDisable"></button>
```

## 指令

指令是带有 `z-` 前缀的特殊 attribute。指令的预期值是 JavaScript 表达式，它可以调用函数，获取返回值，或者直接访问属性(`z-for`和`z-on`例外)。

### 参数

某些指令会需要一个“参数”，在指令名后通过一个冒号隔开做标识。例如用`z-bind`指令来响应式地更新一个 HTML attribute：

```html
<div z-bind:class="{active: isActive}"></div>
```

这里的 class 响应式的绑定了一个对象，当 isActive 为 True 时，class 的值为 active，否则为空。

`z-on` 也有参数，用于响应式地绑定一个事件：

```html
<button z-on:click="yourmethod"></button>
```
