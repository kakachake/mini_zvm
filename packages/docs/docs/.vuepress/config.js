const { defaultTheme } = require("@vuepress/theme-default");

module.exports = {
  title: "mini-ZVM",
  description: "一款用于构建 Web 界面的框架",
  dest: "./dist",
  port: "8080",
  markdown: {
    lineNumbers: true,
  },
  head: [
    [
      "script",
      {},
      `var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?3f3385a3d50d9a16ce9956597ab98c1a";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    `,
    ],
  ],
  theme: defaultTheme({
    smoothScroll: true,
    sidebar: "auto",
    logo: "./assets/logo.png",
    navbar: [
      {
        text: "指南",
        link: "/guide/",
      },
      {
        text: "在线编辑器",
        link: "https://mini-zvm-playground.vercel.app/",
      },
      {
        text: "展示",
        link: "http://101.43.155.53/front_end_baidu/mini_mvvm/",
      },
      {
        text: "github",
        link: "https://github.com/kakachake",
      },
    ],
    sidebarDepth: 2,
    sidebar: [
      {
        text: "开始",
        collapsible: true,
        children: [
          {
            text: "介绍",
            link: "/guide/",
          },
          {
            text: "快速上手",
            link: "/guide/quick-start.html",
          },
        ],
      },
      {
        text: "基础",
        children: [
          {
            text: "应用实例",
            link: "/guide/instance.html",
          },
          {
            text: "模板语法",
            link: "/guide/template.html",
          },
          {
            text: "指令介绍",
            link: "/guide/directives.html",
          },
          {
            text: "组件基础",
            link: "/guide/component-basics.html",
          },
        ],
        collapsible: true,
      },
      {
        text: "工具",
        children: [
          {
            text: "单文件组件",
            link: "/guide/single-file-component.html",
          },
        ],
        collapsible: true,
      },
      {
        text: "扩展",
        children: [
          {
            text: "自定义指令",
            link: "/guide/custom-directives.html",
          },
        ],
        collapsible: true,
      },
    ],
    sidebarDepth: 2,
    lastUpdated: "Last Updated",
    searchMaxSuggestoins: 10,
    serviceWorker: {
      updatePopup: {
        message: "有新的内容.",
        buttonText: "更新",
      },
    },
    editLinks: true,
    editLinkText: "在 GitHub 上编辑此页 ！",
  }),
};
