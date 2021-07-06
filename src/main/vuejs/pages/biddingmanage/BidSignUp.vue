<template>
<div>
    <ApprovalStep v-if="approvalDetails" :id="$route.query.applyId" 
        :index="approvalIndex"
          :info="approvalDetails" :currentNode.sync="currentNode"
           @approvalChange="approvalDetailWithStep"></ApprovalStep>
     <div class="text-right">
         <el-button type="primary" v-if="states==4  || states==0" @click="newSubmit">重新提交</el-button>
         <el-button type="primary" v-if="projectInfo.stateId!=='004'" @click="signUp">报名</el-button>
     </div>
</div>
  
</template>

<script>
  import Api from '@/api/index'
  import ApprovalStep from '@/pages/approval/ApprovalStep'
 
  export default {
  
    components:{
      ApprovalStep,
    },
    props:{
        
        projectInfo:{
           type:Object,
        }
    },
    data () {
      const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      return {
          userInfo:userInfo,
          form:{
              id:'',
              stateId:'',
          },
          states:null,
          approvalIndex:1,
          approvalDetails:{},
          currentNode:'',
      }
    },
    mounted(){
        this.approvalDetailWithStep()
    },
    methods: {
        /**重新提交**/
      newSubmit () {
        const query = this.$route.query

        this.$confirm('您确定要重新提交申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.resubmit({id: query.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '重新提交成功'
              })
              this.$emit('bidStatusChange')
            } else {
              this.$notify.warning({
                title: '提示',
                message: '重新提交失败'
              })
              
            }
          })
        })
      },
        /**
       * 已报名操作
       * */
      signUp() {
        const item  = this.form;
        this.$confirm(`您确定对【${this.projectInfo.bidProjectName}】进行投标报名吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.id = this.$route.query.id
          this.form.stateId = '004'  //已经报名
          Api.changeBidProjectStateById(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: `项目【${this.projectName}】已报名`
              })
              // 重新渲染页面数据
              this.loadData()
            }
          })
        });
      },
      //审批详情
      approvalDetailWithStep() {
        const query = this.$route.query

        Api.approvalDetailWithStep({id: query.applyId}).then(data => {
          if (data) {
            
            this.approvalDetails = data
            console.log(data,'approval')
            this.currentNode = data.currentNode
            data.approvalDetails.unshift({
                 id:data.ctUid,
                 states:'1',
                 approverName:data.approverName?data.approverName:data.ctUName,
                 positionName:'申请人',
                 updateDt:data.createDt,
            })
           console.log(data.approvalDetails.length,'sss')
            if (data.approvalDetails.length > 0) {
              let _this = this
              for (let i = 0; i < data.approvalDetails.length; i++) {

                let item = data.approvalDetails[i]
                if(item.ctUId == this.userInfo.ctUId){
                    this.states = item.states
                }
                if(item.states ==='1'){
                    this.approvalIndex = i+1
                    continue;
                }

              }
            }
          }
        })
      },
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