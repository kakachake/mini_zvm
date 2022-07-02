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
        text: "展示",
        link: "http://101.43.155.53/front_end_baidu/mini_mvvm/",
      },
      {
        text: "github",
        link: "https://github.com/kakachake",
      },
    ],
    sidebar: {
      "/guide/": [
        ["", "介绍"],
        ["instance", "应用实例"],
        ["template", "模板语法"],
        ["directives", "各个指令介绍"],
      ],
    },
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
