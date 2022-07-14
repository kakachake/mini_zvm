export const data = JSON.parse("{\"key\":\"v-f4b79958\",\"path\":\"/guide/single-file-component.html\",\"title\":\"单文件组件\",\"lang\":\"en-US\",\"frontmatter\":{},\"excerpt\":\"\",\"headers\":[{\"level\":2,\"title\":\"介绍\",\"slug\":\"介绍\",\"children\":[]},{\"level\":2,\"title\":\"如何使用？\",\"slug\":\"如何使用\",\"children\":[{\"level\":3,\"title\":\"使用脚手架\",\"slug\":\"使用脚手架\",\"children\":[]},{\"level\":3,\"title\":\"使用 zvm-loader\",\"slug\":\"使用-zvm-loader\",\"children\":[]}]}],\"git\":{\"updatedTime\":null,\"contributors\":[]},\"filePathRelative\":\"guide/single-file-component.md\"}")

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
