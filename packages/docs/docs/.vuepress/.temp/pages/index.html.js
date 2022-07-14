export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"heroImage\":\"/assets/logo.png\",\"heroText\":\"Welcome to ZVM.\",\"tagline\":\"mini vue.\",\"actions\":[{\"text\":\"介绍\",\"link\":\"/guide/\",\"type\":\"primary\"},{\"text\":\"快速开始\",\"link\":\"/guide/quick-start.html\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"简单\",\"details\":\"仅需简单的HTML、CSS、JavaScript知识即可构建页面。\"},{\"title\":\"易用\",\"details\":\"使用指令，轻易实现页面功能。\"},{\"title\":\"响应式\",\"details\":\"一处改变，处处改变。\"},{\"title\":\"组件化\",\"details\":\"容易维护，易于扩展。\"}],\"footer\":\"Copyright © 2021-present Kakachake\"},\"excerpt\":\"\",\"headers\":[],\"git\":{\"updatedTime\":1656731261000,\"contributors\":[{\"name\":\"卡卡查克\",\"email\":\"282281884@qq.com\",\"commits\":3}]},\"filePathRelative\":\"README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
