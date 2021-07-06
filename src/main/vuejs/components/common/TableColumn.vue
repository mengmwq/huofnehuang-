<template>
  <div class="column-box on" >
    <div class="column-title" @click="isShowColumn = !isShowColumn">
      <!-- <h2>{{isShowColumn ? '收起':'展开'}} <i class="iconfont icon-gengduo"></i> </h2> -->
      <h2>{{isShowColumn ? '收起':'展开'}}设置显示列 <i class="iconfont icon-gengduo"></i> </h2>
    </div>
    <div class="column-body" v-if="isShowColumn">
      <h1>设置显示列</h1>
      <ul class="column-item">
        <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnChange">
          <draggable v-model="currHeaders" :options="{group:'people'}" @start="dragStart" @change="dragChange" @end="dragEnd" :move="move" :component-data="getComponentData()" @dragover="allowDrop">
            <el-checkbox v-for="(header, index) in currHeaders" :label="header.prop" :disabled="header.disabled" :key="index">
              {{header.label}}
            </el-checkbox>
          </draggable>
        </el-checkbox-group>
      </ul>
    </div>
     <!--<div class="column-foot" v-if="isShowColumn">-->
        <!--<el-button type="success">终选</el-button>-->
        <!--<el-button type="default">删除</el-button>-->
    <!--</div>-->
  </div>
</template>
<script>
import Api from "@/api/index";
import { LtHeader } from '@/model/LtHeader';
import Util from '@/utils/';
import draggable from 'vuedraggable'
export default {
  components: {
    draggable,
  },

  // ,'tableHeader'
  props:['tableStatus','pageParams'],
  computed:{
    autoPageParams(){
       if(this.pageParams){
           return this.pageParams;
       }else{
         return null;
       }
    },
  },
  data() {
    const userId =JSON.parse(sessionStorage.getItem('jwt'))?JSON.parse(sessionStorage.getItem('jwt')).id:null
    return {
      isShowColumn:false,
      checkedColumns: null,
      show: false,
      currHeaders: [],
      userId: userId,
      path: this.$route.path,
      sessionStorage: window.sessionStorage,
    }
  },
  mounted() {
    // 设置显示列
    let cacheHeaders = this.sessionStorage.getItem(`${this.userId}${this.path}`);
    if(this.autoPageParams){
      cacheHeaders = this.sessionStorage.getItem(`${this.userId}${this.path}/${this.autoPageParams}`);
    }
    if (cacheHeaders) {
      //从前端换从获取数据
      let currHeaders = JSON.parse(cacheHeaders);
      //console.log(currHeaders);
      this.currHeaders = currHeaders;
      this.checkedColumns = this.currHeaders.map((header, index) => {
        if (header.show) {
          return header.prop;
        }
      })
      this.$emit('change', this.currHeaders);
    } else {
      //缓存没有数据，从数据库读取
      this.getHeaderInfo();
    }
  },
  methods: {
    allowDrop:function (ev) {
        ev.preventDefault();
    },
    dragStart(){
      console.log("+++++++++++++++++++[84]handleHeader++++++++++++++++++++");
      this.$emit('tableStatusChange',false);
    },
    dragEnd(evt){
      console.log(evt);
      console.log("+++++++++++++++++++[87]handleHeader++++++++++++++++++++");
      this.handleHeader(this.currHeaders);
      this.$emit('tableStatusChange',true);
    },

    move: function (evt, originalEvent) {
      console.log(evt)
      console.log(originalEvent) //鼠标位置
    },

    dragChange(){
      console.log("+++++++++++++++++++[93]dragChange++++++++++++++++++++");
      // this.handleHeader(this.currHeaders);
      // this.$emit('tableStatusChange',true);
    },

    getComponentData() {
      console.log("+++++++++++++++++++[105]getComponentData++++++++++++++++++++");
    },


    getHeaderInfo: function() {
      let pageDistiction = this.path;
      console.log(this.autoPageParams);

      if(this.autoPageParams){
        pageDistiction = pageDistiction+'/'+this.autoPageParams;
      }
      //页面初始化从后台查询隐藏显示列设置
      const params = { pageDistiction: pageDistiction, userId: this.userId }
      console.log(params);
      Api.getHeaderInfo(params).then(res=> {
        //从数据库获取到的数据，缓存到前端缓存中，再次访问页面直接从缓存中读取
        if(res){
          // let result = res.data;
           this.currHeaders = Util.arraySort(res,'sequence');
          // this.currHeaders = data;
          console.log(".......................................",res);
          //console.log(this.currHeaders);
//          this.sessionStorage.setItem(`${this.userId}${pageDistiction}`, JSON.stringify(res));

          this.checkedColumns = this.currHeaders.map((header, index) => {
            if (header.show) {
              return header.prop;
            }
          })
          this.$emit('change', this.currHeaders);
        }
      });
    },
    updateHeaderInfo: function(ltHeader) {
      let headers= JSON.parse(ltHeader.headerColumn);
      headers.forEach(function(item,index){
         item.sequence = index+1;
      });
      ltHeader.headerColumn = JSON.stringify(headers);
      Api.updateHeader(ltHeader).then(function(res) {
        //更新前端缓存
        if(this.autoPageParams){
          this.sessionStorage.setItem(`${this.userId}${this.path}/${this.autoPageParams}`, ltHeader.headerColumn);
        }else{
          this.sessionStorage.setItem(`${this.userId}${this.path}`, ltHeader.headerColumn);
        }

      }.bind(this));
    },
    handleHeader(headers){
      console.log("+++++++++++++++++++[136]handleHeader++++++++++++++++++++");
      let ltHeader = new LtHeader();
      ltHeader.userId = JSON.parse(sessionStorage.getItem('jwt')).id;
      ltHeader.pageDistiction = this.path;
      ltHeader.headerColumn = JSON.stringify(headers);
      this.updateHeaderInfo(ltHeader);
      this.$emit('change', headers);
      console.log("+++++++++++++++++++[143]handleHeader++++++++++++++++++++");
    },
    handleCheckedColumnChange: function(command) {
      const tableHeader = this.currHeaders.slice(0)
      let showCount = 0;
      const headers = tableHeader.map((header, index) => {
        let isExist = false;
        for (let j = 0; j < command.length; j++) {
          if (header.prop === command[j]) {
            isExist = true;
            header.show = true;
          }
        }
        if (!isExist) {
          header.show = false;
        }
        return header
      })

      for (let i = 0; i < headers.length; i++) {
        if (headers[i].show) {
          showCount++
        }
      }
      if (showCount == 2) {
        headers.map((header, index) => {
          if (header.show) {
            header.disabled = true;
          } else {
            header.disabled = false;
          }
        })
      } else {
        headers.map((header, index) => {
          header.disabled = false;
        })
      }
      this.handleHeader(headers);
    },
  }
}

</script>
<style scoped lang="scss">
.column-box {
   position: fixed;
   top:80px;
   right:0;
   font-size:14px;
   background:#fff;
   height: 100%;
   border:1px solid #eee;
   z-index: 4;
   .column-title{
     position:absolute;
     top:-1px;
     left:-34px;

     width:18px;
     height:188px;
     padding:20px 8px;
     /*background:#38BCA4;*/
     background:#303133;
     border-top-left-radius: 5px;
     border-bottom-left-radius: 5px;
     cursor: pointer;
     .icon-gengduo {
       padding-top:10px;
       font-size:16px;
     }
     h2 {
       margin:0;
       padding:0;
       height:24px;
       line-height: 24px;
       font-size:14px;
       font-weight: 500;
       color:#fff;
       text-align: center;
     }
   }
   .column-body {
     width:160px;
     padding:10px 20px;
     height:100%;
     max-height:500px;
     overflow: auto;
     h1{
       font-size:16px;
       padding:0;
       margin:0;
       margin-bottom:10px;
     }
   }
   .column-item {
     margin:0;
     padding:0;
     margin-left:10px!important;
     .el-checkbox+.el-checkbox {
       margin-left:0!important;
     }
     .el-checkbox {
       font-size:18px!important;
       display: block;
     }
     .el-checkbox__label{
        font-size:18px!important;
     }
   }
   .column-foot{
     position: fixed;
     bottom:40px;
     right:20px;
   }
}
</style>


