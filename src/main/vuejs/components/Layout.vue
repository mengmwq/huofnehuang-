<template>
    <el-container class="index">
        <el-header class="index-header">
            <div class="headerBar">
                <div class="left">
                    <div class="logo">
                        <router-link to="/router/home" tag="i">
                            <i title="官网首页"></i>
                        </router-link>
                    </div>
                    <div class="headerMenu">
                        <top-menu :activeIndex="activeIndex" :leftMenus="topMenus" @tabClick="handleNavClick"></top-menu>
                    </div>
                </div>
                <div class="right">
                    <i class="iconfont icon-shezhi" @click="handleNavClick('shezhi')"></i>
                    <div class="message" @click="showNotify">
                        <i class="iconfont icon-xiaoxi"></i>
                        <!-- <span>0</span> -->
                    </div>
                    <div class="userInfo">
                        <i class="iconfont icon-zhanghao"></i>
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                {{userInfo.uName}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item  @click.native="modifyUserInfo">账号修改</el-dropdown-item>
                                <el-dropdown-item @click.native="logout" divided>退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    
                </div>
            </div>
        </el-header>
        <el-container>
            <div class="mask" v-if="isShowMask" @click="isShowMask=false"></div>
            <el-aside width="200px" class="index-aside" v-if="$route.path!=='/router/home' && $route.path!='/router/notice'">
                 <el-menu :default-active="$route.path" class="left-menu" @open="handleopen" @close="handleclose" @select="handleSecondMenus" unique-opened router :collapse="collapsed">
                    <template  v-for="(item,index) in leftMenus">
                        <template  v-if="!item.hidden && item.name!='首页'"> <!--$router.options.routes--> <!--leftMenus-->
                            <el-submenu :index="index+''" :key="index" v-if="!item.leaf">
                                <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>
                                <el-menu-item  v-for="child in item.children" :index="child.url" :key="child.url" v-if="!child.hidden" :id="child.url" @click.native="handleMenu(child.meta)">
                                    <i class="el-icon-arrow-right"></i>{{child.name}}
                                </el-menu-item>
                                </el-submenu>
                            <el-menu-item  v-else :index="item.path" :key="index" @click.native="handleMenu(item.meta)"><i :class="item.icon"></i>{{item.name}}</el-menu-item>
                        </template>
                    </template>
                    
                </el-menu>
            </el-aside>
            <el-main class="index-main" :class="{'bgDark':$route.path=='/router/breakEvenAnalysis' || $route.path=='/router/BreakEvenAnalysis','adjustLeft':$route.path=='/router/home' || $route.path=='/router/notice'}">
                
                <el-row type="flex" v-if="$route.path!=='/router/home'">
                    <el-col :span="11" >
                          <div class="text-left">
                            <el-breadcrumb separator=">" class="breadcrumb">
                                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path" >
                                {{ item.name }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>

                    </el-col>
                    <el-col :span="13" class="text-right">
                        <TagsView  :leftMenu="leftMenus" />
                    </el-col>
                </el-row>
                 <alert></alert>
                 <!--修改个人信息-->
                 <UserInfo :isShowDialog="isShowDialog" @closeDialog="closeDialog" />
                <!--接收消息推送使用 : 此处使用是 苏苏测试服务器地址 -->
                <!-- <messages-sockjs @showMessageDetails="showMessageDetails"></messages-sockjs> -->
                <!--查看推送消息详情-->
                <message-details v-if="isShowDetailsDialog" :isShowDialog="isShowDetailsDialog" :editForm="editForm"  @closeDetailsDialog="closeDetailsDialog"></message-details>
                <transition name="fade" mode="out-in"><!--,InvoiceApply,AdministrationApply,BorrowApply,ReimburseApply,PaymentApply,TravelApply-->
                     <keep-alive include="AddContracts,AddProject,AddAirProject,AddBidProject,AddAerialMaterial,MaterielSupplierAdd,">
                            <router-view @messageCountChange="messageCountChange" @showMask="showMask" :isShowPerson="isShowMask"></router-view>
                     </keep-alive>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import Alert from '@/components/common/Alert'
import {User} from '@/model/User'
import Api from '@/api/index'
import TopMenu from '@/components/common/TopMenu'
import MessagesSockjs from '@/components/common/MessagesSockjs'
import MessageDetails from '@/pages/message/MessageDetails'
import UserInfo from '@/pages/companymanage/usermanage/UserInfo'
import TagsView from '@/components/common/TagsView'
//处理后台菜单访问
// router.beforeResolve((to, from, next) => {


// })
export default {
  name: 'index',
  components:{
      Alert,TopMenu,MessagesSockjs,MessageDetails,UserInfo,TagsView
  },
  computed: {

  },
  data () {
    const jwt = JSON.parse(sessionStorage.getItem('jwt'))
    const user = new User()
    let  roleList =[];
   const activeMenuIndex = sessionStorage.getItem('activeMenuIndex')
    return {
       isShowMask:false,
       isShowDialog:false,
       userInfo: {},
       info: user,
       messageCount:0,   //消息数量
       isShowDetailsDialog:false,  //消息弹窗
       activeIndex: activeMenuIndex || '/router/home',    //顶部菜单默认值
       collapsed:false,
       currentRoleId:'',
       currentRoleName:'',
       roleList:roleList,
       userId:null,
       leftMenus:[],
       topMenus:[],
       flag:false,
    }
  },
  mounted () {
    if (sessionStorage.getItem('jwt')) {
      this.userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      this.userId = this.userInfo.uId
    }
    //处理系统菜单 
    this.handleSysmenus()
    
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://webapi.amap.com/maps?v=1.3&key=728c4432f7515c953c09ec23cb9f97f1'   // 高德地图
    document.body.appendChild(script)

  },
  methods: {
      //处理系统菜单 
      handleSysmenus(){
        const sysMenus = sessionStorage.getItem('sysMenus')
        if(sysMenus){
            const menuLocation = sessionStorage.getItem('menuLocation')
            const sysMenusNew = JSON.parse(sysMenus)
            this.topMenus = sysMenusNew
            console.log( sysMenusNew.filter(item=>item.icon.lastIndexOf(menuLocation)!==-1),'leftMenu')
            if(menuLocation!=='shouye'){
                this.leftMenus = sysMenusNew.filter(item=>item.icon.lastIndexOf(menuLocation)!==-1)
            }
        }else{
            // 获取UI资源
            this.selectUIResourceByUserId()
        }
      },
      //查看通知 
      showNotify(){
          this.$router.push({
              path:'/router/notice'
          })
      },
      showMask(val){
         this.isShowMask = val
      },
      modifyUserInfo(){
          this.isShowDialog = true;
      },
      closeDialog(){
          this.isShowDialog = false
      },
    handleNavClick (menuLocation,path) {
      // 缓存主菜单位置
        sessionStorage.setItem('menuLocation', menuLocation)
        
        //处理系统菜单 
        this.leftMenus = this.topMenus.filter(item=>item.icon.lastIndexOf(menuLocation)!==-1)
        let activeMenuIndex = path
        if(menuLocation==='shezhi'){
            path =this.leftMenus[0].children[0].url
            this.$router.push({
                path: path
            })
            activeMenuIndex = ''
        }
        sessionStorage.setItem('activeMenuIndex', path)
        this.activeMenuIndex = activeMenuIndex
        
       
    },
    /**
     * 查询账号信息
     */
    queryUserInfo () {
      Api.queryUserInfo().then(ret => {
          if(ret){
            this.info = ret.data
          }

      })
    },
    /**
     * 消息数量改变
     */
    messageCountChange(count){
        console.log(count,'数',this.messageCount)
        this.messageCount -= count
    },
    /**
     * 关闭详情弹窗
     */
    closeDetailsDialog(){
       this.isShowDetailsDialog = false
    },
    /**
     * 查看信息详情
     */
    showMessageDetails(row){

        this.editForm = Object.assign({},row)
        this.batchRead(row)
        this.isShowDetailsDialog = true
    },
    /**
     * 获取消息数量接口
     */
    getMessageCount(){
        const params = {
            userId: this.userId
        }
        Api.getMessageCount(params).then(res=>{
            if(res){
                this.messageCount = res.data
            }
        })
    },
    /**
     * 标记已读消息
     */
    batchRead(row){
        let selected = [row]
        const params = {
            userId:this.userId,
            messageIds:selected.map(item=>item.id).toString()
        }
        Api.batchRead(params).then(res=>{
            if(res){
                //this.messageCount--
                this.getMessageCount()
            }
        })
    },
    /**
     * 获取菜单UI资源
     */
    selectUIResourceByUserId(){
       
        let fn = 'selectUIResourceByUserId'
        let params = {userId: this.userId}

        Api[fn](params).then(res=>{
            if(res){
                const sysMenus = res.data;
                sessionStorage.setItem('sysMenus',JSON.stringify(sysMenus));
                this.topMenus = sysMenus
            }
        })
    },
    /**
     * 处理菜单权限
     */
    handleMenu(item){
        console.log(this.$route.path,'item')
        this.flag = true
        if(item){
            sessionStorage.setItem('curPageElementAttr', JSON.stringify(item))
        }else{
            sessionStorage.removeItem('curPageElementAttr')
        }
    },
    /**
     * 二级菜单
     */
    handleSecondMenus(path,url){

    },
    /**
    *  处理关闭
     */
    handleclose(){

    },

    /**
    *  处理打开
     */
    handleopen(path,url){
        console.log(path,url)
    },
    /**
     * 账号更多操作
     */
    logout () {
     this.$confirm('此操作将退出当前登录页面，返回登录页。 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            window.location = '/index'
            sessionStorage.clear()
        }).catch(() => {
        });
    },
    /**
    * 一级菜单选择事件
     */
    handleFirstMenus(val,p){

      console.log(this.activeIndex,p,'val')
      this.menus = this.$router.options.routes.forEach(item=>{
           if(item.children[0].path == val){
               return item
           }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .mask {
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:99;
        background:rgba(0,0,0,0.3);
    }
</style>
<style lang="scss">

    .index-header .name i {
      cursor: pointer
    }
    .el-menu .el-menu--popup .el-menu--popup-bottom-start{
        background-color:#3C3C3C!important;
        //border-bottom-color:#3C3C3C!important;
    }
    .el-menu--popup-bottom-start .el-menu-item {
        color:#333!important;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color:#238B7F;
    }
    .mt20 {
        margin-top:20px;
    }
    .breadcrumb {
        margin-bottom:20px;
        font-size:16px!important;
    }
    .pr10 {
        padding-right:10px;
    }

    // 左侧菜单
    .menu {
      float:left;
      overflow: hidden;

    }
    .index {
        height:100%;
        background: #EAEEF3;
        overflow-x:hidden;
        .headerBar{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            .left {
                display: flex;
                justify-content: flex-start;
                align-items: top;
                flex-wrap: nowrap;
                width:calc(100% - 260px);
                .logo{
                    i{
                        display: inline-block;
                        background: url('../assets/img/logo.png') center no-repeat;
                        width: 200px;
                        height: 60px;
                        background-size: 95%;
                        margin-right:20px;
                    }
                }
            }

            .right {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width:250px;
                flex-wrap: nowrap;
                .iconfont {
                    border-radius: 50%;
                    background:#eee;
                    padding:8px;
                    color:#5d5d5d;
                    cursor: pointer;
                }
                .iconfont:hover {
                    color:#000;
                }
                .message {
                    position: relative;
                    i {
                        font-size:18px;
                    }
                    span {
                        position: absolute;
                        top:-10px;
                        right:-10px;
                        display: inline-block;
                        width:20px;
                        height:20px;
                        border-radius: 50%;
                        background:red;
                        color:#fff;
                        line-height: 20px;
                        text-align: center;
                    }
                }
                .userInfo {
                    cursor: pointer;
                }
            }
            .headerMenu {
              overflow: hidden;
            }
        }
        .index-header{
            padding-left:0;
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            z-index: 1500;
            height:60px;
            background: #fff;
            color: #383838;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
        }
        .index-aside{
           width: 200px;
            top: 0;
            bottom: 0;
            position: fixed;
            z-index:3;
            margin-top: 62px;
            .left-menu {
                height: 100%;
                overflow-y:auto;
                overflow-x:hidden;
            }
        }
        .index-main {
            background: #FFFFFF;
            border-radius: 6px;
            height:100%;
            background:#fff;
            padding-top:80px;
            padding-left:220px;
        }
         .bgDark{
            background: #191A1B;
            .el-breadcrumb__inner{
                color:#fff;
            }
        }
        .index-right {
            background:#333;
            .header{
                height:80px;
                background:#fff;
            }
            .main{
                height:calc(100% - 80px);
                background:#fff;
                overflow: auto;
            }
        }
        .adjustLeft{
            padding-left:20px!important;
            background:#f2f2f2!important;
        }
    }

</style>

