/**
 *  按钮级权限控制
 *  2018-1-5  by sunzelong 
 */
const directives = {}
directives.install = Vue => {
  Vue.directive('showBtn', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el,binding) {  
        if(sessionStorage.curPageElementAttr){ 
          let curPageElement = JSON.parse(sessionStorage.curPageElementAttr);
          let authorityType = el.getAttribute('data-authorityType'); 
          //console.log(curPageElement,'sss') 

          if(curPageElement.length>0 || curPageElement.find(attr=>attr==authorityType)){
             //console.log('有权限');
          }else{
            el.remove();
          }
        }
    }
  })
}

export default directives

