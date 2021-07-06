<template>
	<el-menu :default-active="activeIndex" class="topMenu" router mode="horizontal" >
      <el-menu-item v-for="(item, index) in siteMenus" :key="index" :index="item.path" class="menuItem" @click="handleSelect(item)">
          <!-- <i :class="item.iconCls"></i> -->
          <span class="nav-name">{{item.name}}</span>
      </el-menu-item>
  </el-menu>
</template>
<script>

	export default {
    data () {
      return {
        showList: false,
        caiwu:false,
        yewu:false,
        tongji: false,
        ziyuan: false,
        shenpi:false,
        siteMenus: []
      }
    },
    props: {
      activeIndex: String,
      leftMenus: Array
    },
    watch: {
      leftMenus(list) {
        if (list.length > 0) {
        
          this.handleTopMenu(list,'caiwu')
          this.handleTopMenu(list,'yewu')
          this.handleTopMenu(list,'tongji')
          this.handleTopMenu(list,'ziyuan')
          this.handleTopMenu(list,'shenpi')
          if(list.some(item=>item.name==='首页')){
               this.siteMenus.push({
                  path: '/router/home',
                  location: 'shouye',
                 iconCls: 'iconfont icon-shouye',
                  name: '首页'
                })
          }
          if (this.yewu) {
            this.siteMenus.push({
              path: '/router/myTask',
              location: 'yewu',
              iconCls: 'iconfont icon-wuliu-',
              name: '业务'
            })
          }
          if (this.caiwu) {
            this.siteMenus.push({
              path: '/router/invoiceList',
              location: 'caiwu',
              iconCls: 'iconfont icon-caiwu',
              name: '财务'
            })
          }
          if (this.tongji) {
            this.siteMenus.push({
              path: '/router/breakEvenAnalysis',
              location: 'tongji',
              iconCls: 'iconfont icon-tongji',
              name: '统计'
            })
          }
          if (this.ziyuan) {
            this.siteMenus.push({
              path: '/router/addressBookList',
              location: 'ziyuan',
              iconCls: 'iconfont icon-XYZY_YH',
              name: '资源'
            })
          }
          if (this.shenpi) {
            this.siteMenus.push({
              path: '/router/approvalIndex',
              location: 'shenpi',
              iconCls: 'iconfont icon-XYZY_YH',
              name: '审批'
            })
          }

        }
      }
    },
    mounted () {

    },
    methods: {
      handleTopMenu(list,flag){
        if(flag==='shenpi'){
          console.log(list.filter(item=>item.icon.indexOf(flag)>0),'shenpi')
        }
        for (let i = 0; i < list.length; i++) {
            let item = list[i]
            if (item.icon) {
              if (item.icon.indexOf(flag) > 0) {
                this[flag] = true
                break
              }
            }
          }
      },
      handleSelect (item) {
        if(item){
            sessionStorage.setItem('curPageElementAttr', JSON.stringify(item))
        }else{
            sessionStorage.removeItem('curPageElementAttr')
        }
        this.$emit('tabClick', item.location,item.path)
      }
    }
}

</script>
<style lang="scss" scoped>
  .topMenu{
    .nav-name {
      font-size: 16px;
      color:#333;
    }
    .menuItem{
      margin-right:2rem;
      color: #333;
    }
    li.menuItem:hover{
      border-bottom: 3px solid #C2272D;
      color: #383838;
      border-left: 0;
      background: #eee;
    }
  } 
</style>
