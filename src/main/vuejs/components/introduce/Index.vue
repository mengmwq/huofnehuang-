<template>
    <el-container class="instroduce">
        <el-header class="instroduce-header">
            <el-row>
                <el-col :span="6" class="instroduce-logo">
                    <!-- <i class="el-icon-menu"></i> -->
                    <img src="../../assets/img/logo.png" alt="" height="50">
                </el-col>
                <el-col :span="18">
                    <top-menu :activeIndex="$route.path"></top-menu>
                </el-col>

            </el-row>
        </el-header>
        <alert></alert>
        <el-main class="introduce-main">
             <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script>
import Alert from '@/components/common/Alert'
import Api from '@/api/index'
import TopMenu from '@/components/common/TopMenu'
export default {
  name: 'instroduce',
  components:{
      Alert,TopMenu
  },
  computed: {
  },
  data () {
    return {
       activeIndex: '1',
       collapsed:false,
       menuOne:[
        {
        path: '/router/home',
        name: '活动',
        iconCls: 'iconfont icon-home',
        },
        {
        path: '/router/StudentSignUpManage',
        iconCls: 'iconfont icon-tianxieribao',
        name: '报名'
        },
        {
        path: '/router/sign',
        iconCls: 'iconfont icon-tubiao-zhuzhuangtu',
        name: '签到',
        },
        {
        path: '/router/tongji',
        iconCls: 'iconfont icon-fuwu',
        name: '统计',
        },
        {
        path: '/router/org',
        iconCls: 'iconfont icon-shezhi',
        name: '设置',
        }
       ]
    }
  },
  mounted() {

  },
  methods:{


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
    handleCommand(command){
        if(command =='profile'){
            this.$router.push({
                path:'/router/mySetting'
            })
        }else if(command=='logout'){
            this.$router.push({
                path:'/login'
            })
        }
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


<style lang="scss">
    .mt20 {
        margin-top:20px;
    }

    .pr10 {
        padding-right:10px;
    }

    .instroduce {
        height:100%;
        width:100%;
        background: #EAEEF3;
        //overflow:hidden;
        .instroduce-header{
            position: fixed;
            left:0;
            top:0;
            width:100%;
            z-index:2009;
            height: 78px;
            background: #F96E2D;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
            .header-right{
                text-align: right;
                margin-top:6px;
            }
            .username {
                span,img {
                    vertical-align: middle;
                }
                span {
                    color:#fff;
                }
            }
            .message {
                display:inline-block;
                margin-right:20px;
                vertical-align: middle;
                color:#fff;
                .el-icon-bell{
                    font-size:28px;
                    color:#fff;
                }

            }
            .service {
                margin-right:20px;
                color:#fff;
                .el-icon-service{
                    font-size:28px;
                    color:#fff;
                    vertical-align: middle;
                }
            }
        }
        .instroduce-logo{
            margin-top:6px;
            i,img {
                vertical-align: middle;
            }
            i{
                font-size:24px;
                color:#fff;
            }
        }


        .introduce-main {
            margin:20px;
            background: #FFFFFF;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
            border-radius: 6px;
            //height: 100%;
            margin-top:80px;
            //height:calc(100%-80px);
                background:#fff;
                //overflow: auto;
        }
        .instroduce-right {
            background:#333;
            .header{
                height:80px;
                background:#000;
            }
            .main{
                height:calc(100%-80px);
                background:#fff;
                overflow: auto;
            }
        }
    }

</style>
