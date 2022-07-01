const nameDict = {
  all: "全部展示",
  bind: "z-bind attr绑定展示",
  for: "z-for列表渲染",
  on: "z-on事件处理",
  if: "z-if/else",
  text: "z-text",
  model: "z-model 双向绑定",
};

const files = require.context("./src", false, /\.js$/);
console.log(files);
const keyReg = /^\.\/(.*).js/;
files.keys().forEach((key) => {
  key = keyReg.exec(key)[1];
  const a = document.createElement("a");
  a.setAttribute("href", `${key}.html`);
  a.setAttribute("target", "show");
  a.text = nameDict[key];
  tabs.appendChild(a);
});
