// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import ElementUI from 'element-ui'
import directives from '@/directive/index'
import store from '@/store'
// icon 字体图标样式
import '@/assets/css/iconfont.css'
// 公共样式
import '@/assets/css/default.scss'
import * as filters from '@/filters/filter'
import global_ from '@/components/common/Global'//引用文件
//import Watermark from '@/utils/watermark';
Vue.prototype.GLOBAL = global_//挂载到Vue实例上面
import gojs from 'gojs'
Vue.prototype.go = gojs
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

import Print from '@/api/print'
Vue.use(Print)
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
      zIndex: 9999,
      title:false,// 显示当前图片的标题
      scalable:true,//图片是否可翻转
      rotatable:true,//图片是否可旋转
      tooltip:true,//显示缩放百分比
      navbar:false,//显示缩略图导航
      loop:false,
      loading:false
  }
})

Vue.use(ElementUI)
Vue.use(directives)
Vue.config.productionTip = false
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// Vue.prototype.$axios = axios

/* eslint-disable no-new */
const GLOBAL_VUE_INSTANCE = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
    
})
window.GLOBAL_VUE_INSTANCE = GLOBAL_VUE_INSTANCE
GLOBAL_VUE_INSTANCE.$mount('#app')

/**价格过滤加两位小数*/
// Vue.prototype.sys = function () {
//   let newStr = "";
//   let count = 0;
//   if(str.indexOf(".")===-1){
//     for(let i=str.length-1;i>=0;i--){
//       // if(count % 3 === 0 && count !== 0){
//       //   newStr = str.charAt(i) + "," + newStr;
//       // }else{
//       newStr = str.charAt(i) + newStr;
//       // }
//       count++;
//     }
//     str = newStr + ".0000"; //自动补小数点后四位
//     console.log(str)
//     return str
//   }
//   else
//   {
//     for(let i = str.indexOf(".")-1;i>=0;i--){
//       // if(count % 3 === 0 && count !== 0){
//       //   newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
//       // }else{
//       newStr = str.charAt(i) + newStr; //逐个字符相接起来
//       // }
//       count++;
//     }
//     str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
//     console.log(str)
//     return str
//   }
// }
//全局的过滤事件
Vue.filter('filterData',(value)=>{
  return value.toFixed(2)
  
})