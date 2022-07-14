export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"en-US\",\"title\":\"mini-ZVM\",\"description\":\"一款用于构建 Web 界面的框架\",\"head\":[[\"script\",{},\"var _hmt = _hmt || [];\\n    (function() {\\n      var hm = document.createElement(\\\"script\\\");\\n      hm.src = \\\"https://hm.baidu.com/hm.js?3f3385a3d50d9a16ce9956597ab98c1a\\\";\\n      var s = document.getElementsByTagName(\\\"script\\\")[0]; \\n      s.parentNode.insertBefore(hm, s);\\n    })();\\n    \"]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
