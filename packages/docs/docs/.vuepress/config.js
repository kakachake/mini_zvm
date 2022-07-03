module.exports = {
  title: "ZVM",
  description: "mini-vue",
  dest: "./dist",
  port: "8080",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    smoothScroll: true,
    sidebar: "auto",
    nav: [
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
    sidebar: [
      {
        title: "开始",
        children: [
          ["/guide/", "介绍"],
          ["/guide/quick-start", "快速开始"],
        ],

        collapsable: false,
      },
      {
        title: "基础",
        children: [
          ["/guide/instance", "应用实例"],
          ["/guide/template", "模板语法"],
          ["/guide/directives", "各个指令介绍"],
        ],
        collapsable: false,
      },
      {
        title: "扩展",
        children: [["/guide/custom-directives", "自定义指令"]],
        collapsable: false,
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
  },
};
