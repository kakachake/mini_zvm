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
    </div>
  </body>
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
