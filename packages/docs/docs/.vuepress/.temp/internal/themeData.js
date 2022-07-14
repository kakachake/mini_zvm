export const themeData = JSON.parse("{\"smoothScroll\":true,\"sidebar\":[{\"text\":\"开始\",\"collapsible\":true,\"children\":[{\"text\":\"介绍\",\"link\":\"/guide/\"},{\"text\":\"快速上手\",\"link\":\"/guide/quick-start.html\"}]},{\"text\":\"基础\",\"children\":[{\"text\":\"应用实例\",\"link\":\"/guide/instance.html\"},{\"text\":\"模板语法\",\"link\":\"/guide/template.html\"},{\"text\":\"指令介绍\",\"link\":\"/guide/directives.html\"},{\"text\":\"组件基础\",\"link\":\"/guide/component-basics.html\"}],\"collapsible\":true},{\"text\":\"工具\",\"children\":[{\"text\":\"单文件组件\",\"link\":\"/guide/single-file-component.html\"}],\"collapsible\":true},{\"text\":\"扩展\",\"children\":[{\"text\":\"自定义指令\",\"link\":\"/guide/custom-directives.html\"}],\"collapsible\":true}],\"logo\":\"./assets/logo.png\",\"navbar\":[{\"text\":\"指南\",\"link\":\"/guide/\"},{\"text\":\"在线编辑器\",\"link\":\"https://mini-zvm-playground.vercel.app/\"},{\"text\":\"展示\",\"link\":\"http://101.43.155.53/front_end_baidu/mini_mvvm/\"},{\"text\":\"github\",\"link\":\"https://github.com/kakachake\"}],\"sidebarDepth\":2,\"lastUpdated\":\"Last Updated\",\"searchMaxSuggestoins\":10,\"serviceWorker\":{\"updatePopup\":{\"message\":\"有新的内容.\",\"buttonText\":\"更新\"}},\"editLinks\":true,\"editLinkText\":\"在 GitHub 上编辑此页 ！\",\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"editLink\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
