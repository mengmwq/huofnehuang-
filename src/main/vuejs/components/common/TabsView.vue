<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      <el-tag :closable="true" :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
export default {
  props:['leftMenu'],
  computed: {
    visitedViews() {
      return this.$store.state.tabsView.visitedViews.slice(-6)
    }
  },
  methods: {
    //递归处理按钮权限
    getCurPageElement(childrenResources,btnElement){
      if (childrenResources && childrenResources.length > 0) {
        childrenResources.forEach(tItem=>{
          if(tItem.elementId){
            btnElement.push(tItem.elementId);
          }
          if(tItem.childrenResources){
            this.getCurPageElement(tItem.childrenResources,btnElement);
          }
        });
      }
      return btnElement;
    },
    closeViewTabs(view, $event) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view.path)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/router/home')
          }
          this.handleselect(view.path);
        }
      })

      $event.preventDefault()
    },
    generateRoute() {
      if (this.$route.matched[this.$route.matched.length - 1].name) {
        return this.$route.matched[this.$route.matched.length - 1]
      }
      this.$route.matched[0].path = '/router/home'
      return this.$route.matched[0]
    },
    handlePageTabs(){
      const menuLocation = sessionStorage.menuLocation;
      //页面刷新时，处理主菜单的样式
      $('.tnav li').each(function(index, element) {
        if ($(element).attr('data-type') == menuLocation) {
          $(element).addClass('on').siblings().removeClass('on');
          $('.el-submenu').hide();
          $('.nav.fl').show();
          $('.' + menuLocation).parents('.el-submenu').show();
        }
      });
    },
    getFirstMenuLocation(path){
       const aRoutes = this.$router.options.routes;
       let  location ='';
       if(aRoutes){
         aRoutes.forEach(item=>{
           if(item.children){
             item.children.forEach(sItem=>{
               if(path == sItem.path){
                  const aIconCls = item.iconCls.split(' ');
                  location = aIconCls[aIconCls.length-1];
                  return location;
               }
            })
           }            
        });
       }
       
       return location;
    },
    addViewTabs() {
      this.$store.dispatch('addVisitedViews', this.generateRoute())
      this.handleselect(this.$route.path);
      sessionStorage.setItem('menuLocation', this.getFirstMenuLocation(this.$route.path));
      this.handlePageTabs();
    },
    isActive(path) {
      return path === this.$route.path
    },
    //处理页面权限
    handleselect(key) {
      this.leftMenu.forEach(item=>{
          if(typeof item.childrenResources !='undefined'){
              item.childrenResources.forEach(sItem=>{
                 if(sItem.url && sItem.url.toLowerCase() == key.toLowerCase() && (typeof sItem.childrenResources !='undefined')){
                  // if(sItem.resourceName == curMenuName){
                  let btnElement=[];
                  sessionStorage.setItem('curPageElementAttr', JSON.stringify(this.getCurPageElement(sItem.childrenResources,btnElement)));
                  return;
               }
            });
          }
       });
    },
  },

  watch: {
    $route() {
      this.addViewTabs()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
      margin-left: 10px;
    }
  }
</style>
