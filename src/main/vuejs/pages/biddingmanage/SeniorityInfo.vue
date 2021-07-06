<template>
  <div>
    <el-form label-position="right" :model="form" ref="form" label-width="140px">
      <el-row>
  	  <el-col :span="8">
	    <el-form-item label="招标方式：">
	      <span>{{form.bidType}}</span>
	    </el-form-item>
	  </el-col>
      <el-col :span="8">
        <el-form-item label="招标编号：">
          <span>{{form.bidCode}}</span>
        </el-form-item>
      </el-col>
      </el-row>
      <el-row>
	  <el-col :span="8">
	    <el-form-item label="开标时间：">
	      <span>{{form.bidOpeningDate	}}</span>
	    </el-form-item>
	  </el-col>
	  <el-col :span="8">
	    <el-form-item label="开标地址：">
	       <span>{{form.bidOpeningSite}}</span>
	     </el-form-item>
	   </el-col>
	   </el-row>
	   <el-row>
	   <el-col :span="8">
         <el-form-item label="报名方式：">
           <span>{{form.signUpType | registrationMethod}}</span>
         </el-form-item>
       </el-col>
	   <el-col :span="8">
	     <el-form-item label="购买标书截止日期：">
	       <span>{{form.deadline}}</span>
	     </el-form-item>
	   </el-col>
	   </el-row>
	   <el-row>
        <el-col :span="8">
          <el-form-item label="代理单位：">
            <span>{{form.agentCompany}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="代理单位联系人：">
            <span>{{form.agent}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="代理电话：">
            <span>{{form.agentTel}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span>{{form.remarks}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
	    <ApprovalStep v-if="approvalDetails" :id="$route.query.applyId" 
	        :index="approvalIndex"
	          :info="approvalDetails" :currentNode.sync="currentNode"
	           @approvalChange="approvalDetailWithStep"></ApprovalStep>
	     <div class="text-right">
	         <el-button type="primary" v-if="states==4  || states==0" @click="newSubmit">重新提交</el-button>
	     </div>
	</div>
	<div>
    <div class="formTitle">
      <div class="title">注意事项
        <div class="line"></div>
      </div>
    </div>
      <el-form :model="form" label-width="130px">
        <el-row class="m10">
          <el-col :span="24">
            <el-form-item label="注意事项：">
              <el-input type="textarea" style="width: 100%" v-model="form.attention"></el-input>
            </el-form-item>
         </el-col>
       </el-row>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="edit1">保 存</el-button>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import ApprovalStep from '@/pages/approval/ApprovalStep'
  export default {
      components:{
      ApprovalStep,
    },
    data () {   //queryBidProjectById
      const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      return {
        id: '',
        form: {

        },
        userInfo:userInfo,
        states:null,
        approvalIndex:1,
        approvalDetails:{},
        currentNode:'',
      }
    },
    props:{
        projectInfo:{
           type:Object,
        }
    },
    mounted () {
      this.id=this.$route.query.id
      this.loadData()
      this.approvalDetailWithStep()
    },
    methods: {
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        let param = {id: this.$route.query.id}
        console.log(param)
        Api.queryBidProjectById(param).then(data => {
          if (data) {
            this.form = data
            this.listLoading = false
          }
        })
      },
     edit1 () {
        Api.updateBidProject(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
          }
        })
      },
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

<style scoped lang="scss">
  .el-form-item {
    margin-bottom: 0px!important;
  }
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
