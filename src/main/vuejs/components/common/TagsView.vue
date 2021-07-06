<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ tag.name }}
        <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
      <ul
            class='contextmenu'
            v-show="visible"
            :style="{right:right+'px',top:top+'px'}"
        >
            <li @click="closeSelectedTag(selectedTag)">关闭</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags">关闭所有</li>
        </ul>

  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
import path from 'path'

export default {
  components: { ScrollPane },
  props:[
    'leftMenu'
  ],
  data() {
    return {
      visible: false,
      top: 30,
      right: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      
      return this.$store.state.tagsView.visitedViews
    },
    // routers() {
    //   return this.$store.state.permission.routers
    // }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    //generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          tags.push({
            path: path.resolve(basePath, route.path),
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })

      return tags
    },
    initTags() {
      //const affixTags = this.affixTags = this.filterAffixTags(this.routers)
      const affixTags = this.affixTags
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('addVisitedView', tag)
        }
      }
    },
    addTags() {
      
      const { name } = this.$route
      if (name) {
        this.handleselect(this.$route.path);
        this.$store.dispatch('addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag

      this.$nextTick(() => {
        if(tags){
            for (const tag of tags) {
              if (tag.to.path === this.$route.path) {
                this.$refs.scrollPane.moveToTarget(tag)

                // when query is different then update
                if (tag.to.fullPath !== this.$route.fullPath) {
                  this.$store.dispatch('updateVisitedView', this.$route)
                }

                break
              }
            }
        }
        
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews)
      })
    },
    toLastView(visitedViews) {
      console.log(visitedViews,'visitedViews')
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } 
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
     // this.top = e.clientY

      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
     //递归处理按钮权限
    getCurPageElement(childrenResources,btnElement){
      console.log(childrenResources,btnElement)
      if (childrenResources && childrenResources.length > 0) {
        childrenResources.forEach(tItem=>{
          if(tItem.meta){
            btnElement.push(tItem.meta);
          }
          if(tItem.children){
            this.getCurPageElement(tItem.children,btnElement);
          }
        });
      }
      return btnElement;
    },
    //处理页面权限
    handleselect(key) {
      console.log(key,this.leftMenu,'leftMenu')
      this.leftMenu.forEach(item=>{
          if(item.children){
              item.children.forEach(sItem=>{
                 if(sItem.url && sItem.url.toLowerCase() == key.toLowerCase() && (sItem.children)){
                  // if(sItem.resourceName == curMenuName){
                  let btnElement=[];
                  sessionStorage.setItem('curPageElementAttr', JSON.stringify(this.getCurPageElement(sItem.children,btnElement)));
                  return;
               }
            });
          }
       });
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  // background: #fff;
  // border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      border-radius:3px;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 0;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #C1272D;
        color: #fff;
        border-color: #C1272D;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">

//reset element css of el-icon-close
.tags-view-wrapper  ::-webkit-scrollbar-track,::-webkit-scrollbar-thumb {
  background: none;
}
.tags-view-wrapper ::-webkit-scrollbar {
  width:0;
  height:0;
}
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 18px;
      height: 18px;
      //line-height:18px;
      font-size:18px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        //vertical-align: -3px;
      }
      &:hover {
        background-color: red;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.tags-view-wrapper .el-scrollbar__wrap {
  height:34px;
  margin:0!important;
}
  .tags-view-container .el-scrollbar__bar{
    bottom:-5px!important;
}
</style>