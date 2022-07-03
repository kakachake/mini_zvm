import "./index.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import "monaco-editor/esm/vs/basic-languages/html/html.js";
import { createApp } from "mini-zvm";
const initVal = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://unpkg.com/mini-zvm"></script>
  </head>
  <body>
    <div id="app">
    <button z-on:click="handleClick">Count is: {{ count }}</button>
    <ul>
      <li z-on:click="handleClick(index)" z-for="(item,index) in items">
        <span>{{item.msg}}</span>
        <span>{{index}}</span>
        <span>{{parentData}}</span>
        <button z-on:click="handleDelClick(index)">删除</button>
      </li>
      <button z-on:click="handleAddItem">addItem</button>
    </ul>
    </div>
  </body>
  <script>
    const { createApp } = ZVM;
    const app = createApp({
      template: "#app",
      data() {
        return {
          count: 1,
          parentData: "外层data",
          items: [
            {
              msg: "这是for循环的数据",
            },
          ],
        };
      },
      methods: {
        handleClick() {
          this.count++;
        },
        handleAddItem() {
          this.items.push({
            msg: "新增的数据",
          });
        },
        handleDelClick(index) {
          this.items.splice(index, 1);
        },
      },
    });

    app.mount("#app");
  </script>
</html>`;

createApp({
  template: "#app",
  data() {
    return {
      html: "",
    };
  },
  mounted() {
    this.html = initVal;
    const monacoInstance = monaco.editor.create(
      document.getElementById("monaco")!,
      {
        value: initVal,
        language: "html",
        theme: "vs-dark",
      }
    );
    monacoInstance.onDidChangeModelContent((event) => {
      const newValue = monacoInstance.getValue();
      this.html = newValue;
    });
  },
}).mount("#app");
