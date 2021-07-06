<template>
  <div v-if="info">
    <div class="formTitle">
      <div class="title">流程信息
        <div class="line"></div>
      </div>
    </div>
    <div style="padding: 0 4%;">
       <el-row class="mb10 " >
        <el-col :span="2">流程名称：</el-col>
        <el-col :span="6"> {{info.name}}</el-col>
         <el-col :span="2">事件名称：</el-col>
        <el-col :span="6"> {{$route.query.targetType | approvalTargetTypeFilter}}</el-col>
        <el-col :span="2">发起时间：</el-col>
        <el-col :span="6"> {{info.createDt | timeFormat}}</el-col>
      </el-row>
      <el-row class="progressBox">
        <el-col :span="2">审批流程：</el-col>
        <el-col :span="22">
          <el-steps :space="200" :active="index" finish-status="success">   <!--:active="2"-->
            <el-step :title="handleStepName(item)" :description="handleStepTime(item)" v-for="(item, index) in info.approvalDetails" :key="index"></el-step>
          </el-steps>
        </el-col>
      </el-row>
       <el-row class="mt20">
         <el-col :span="12">
            <el-row>
               <el-col :span="24">审批意见：</el-col>
                <el-col :span="24">
                    <div class="approvalItem"  v-for="(item, index) in info.approvalDetails" :key="index">
                      <template v-if="item.reason">
                        <p>
                            <strong>{{index+1}}、{{item.positionName}}
                              <span  class="ml10">
                               {{item.approverName}}
                              </span>
                            </strong>
                        </p>
                          <div class="reason">
                              {{item.reason}} 
                          </div>
                      </template>
                    </div>
                </el-col>
            </el-row>
         </el-col>
         <el-col :span="12">
            <el-row>
               <el-col :span="24">  
                 评论列表： <el-button type="primary" @click="showDialog" size="small">我要评论</el-button>
               </el-col>
                <el-col :span="24">
                    <div class="approvalItem"  v-for="(item, index) in info.approvalComments" :key="index">
                      <template v-if="item.content">
                        <p>
                            <strong>
                              {{item.createDt | timeFormat}}
                           
                            <span class="ml10"> {{item.positionName}} {{item.approverName}} </span>
                            
                            </strong>
                        </p>
                          <div class="reason">
                              {{item.content}} 
                          </div>
                      </template>
                    </div>
                </el-col>
            </el-row>
         </el-col>
       </el-row>
    </div>
    <AddComment v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" @closeDialog="closeDialog" @dialogChange ="dialogChange" />
  </div>
</template>

<script>
  import Api from '@/api/index'
  import AddComment from './AddComment'
   import moment from 'moment'
  export default {
    components:{
      AddComment,
    },
    data () {
      const ctUId = JSON.parse(sessionStorage.getItem('jwt')).ctUId;
      const query = this.$route.query
      const id = this.$router.path=="/router/bidSignup"?query.applyId:query.id
     
      return {
        //info: {},
        isShowDialog:false,
        //index: 1,
        currentNode: '',
        editForm:{
           applicationId:id,
           ctUId:ctUId,
           content: '',
        }
      }
    },
    props: {
      id: String,
      info:Object,
      index:Number,
    },
    watch: {
      id: function (value) {
        if (value) {
         //this.loadData()
        }
      },
      // currentNode: function (value) {
      //   this.$emit('update:currentNode', value)
      // }
    },
    methods: {
      handleStepTime(item){
         if(item.states=='1'){
           return moment(item.updateDt).format('YYYY-MM-DD HH:mm:ss')
         }else{
          return item.positionName 
         }
         
      },
      handleStepName(item){
         if(item.states=='1'){
           return item.approverName + '   ' + item.positionName
         }else{
          return item.approverName 
         }
         
      },
      showDialog(){
         this.isShowDialog = true
      },
      dialogChange(){
         this.closeDialog()
         this.$emit('approvalChange')
      },
      closeDialog(){
          this.isShowDialog = false
     },
      loadData() {
        Api.approvalDetailWithStep({id: this.id}).then(data => {
          if (data) {
            this.info = data
            //this.currentNode = data.currentNode
           
            data.approvalDetails.unshift({
                 id:data.ctUid,
                 states:'1',
                 approverName:data.ctUName,
                 positionName:data.approvalName?data.approvalName:'申请人',
            })
           console.log(data.approvalDetails.length,'sss')
            if (data.approvalDetails.length > 0) {
              let _this = this
              for (let i = 0; i < data.approvalDetails.length; i++) {
                let item = data.approvalDetails[i]
                if(item.states ==='1'){
                    this.index = i+1
                    continue;
                }
              }
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .progressBox{
     margin-top:10px;
     .el-step__description{
       font-size:14px!important;
       margin-top:5px!important;
     }
  }
  .approvalItem{
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      margin-bottom:10px;
      .approvalPerson  {
       // width:200px;
        p {
          margin:0;
        }
      }
  }
</style>