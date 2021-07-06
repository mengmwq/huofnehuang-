<template>
  <el-dialog
    title="审核进度"
    :visible.sync="isShowDialog"
    :before-close="closeDialog"
    fullscreen
    class="bigScreen"
  >
   <el-row v-if="approvalDetails">
      <el-col :span="6">
        <strong>流程名称：</strong>
        {{approvalDetails.name}}
      </el-col>
      <el-col :span="6">
        <strong>流程类型：</strong>
        {{approvalDetails.targetType | approvalTargetTypeFilter}}
      </el-col>
      <el-col :span="6">
        <strong>发起时间：</strong>
        {{approvalDetails.createDt | timeFormat}}
      </el-col>
      <el-col :span="6">
        <strong>紧急度：</strong>
        <template v-if="editForm.attached">
          {{editForm.attached.ApprovalLevel[editForm.level].cnInfo}}
        </template>
      </el-col>
   </el-row>
   <div class="progreeBox mt20">
     <div class="progress" v-if="approvalDetails && approvalDetails.approvalDetails">
      <div class="item" v-for="(item, index) in approvalDetails.approvalDetails" :key="index">
          <div class="left">
             <div class="name nowrap" :class="{'bgRed':item.states==='0','bgGreen':item.states==='1'}">
               <!-- <img v-if="item.imgUrl" :src="item.imgUrl" width="60" height=60 alt="">
               <span v-else>{{item.name}}</span> -->
               {{index+1}}
             </div>
             <div class="content">
                <div class="top">
                  <!--状态是已驳回-->
                  <template v-if="item.states ==='0'">
                    {{item.approverName}}
                  </template>

                  <!--状态是已审批 或签-->
                  <template v-if="item.states ==='1' && index==0">
                    <span>{{item.positionName}} </span>
                    <span v-if="item.positionName && item.approverName">：</span>
                    <span v-if="item.approverName">
                       {{item.approverName}}
                    </span>
                  </template>
                  <template v-if="item.states!=='2' && item.states!=='3'">
                    <!--状态是已审批 会签-->
                    <template v-if="item.approvalNode && item.approvalNode.type==='0'">
                        <div v-for="(child, index) in item.approvalNode.approverList" :key="index">
                          {{child.approverName?child.approverName:child.pendingApprovalName}}
                          <span :class="{'text-danger':child.states==='0','text-success':child.states==='1'}">({{getCurNodeStatus(child.states)}})</span>
                          <div :class="{'text-danger':child.states==='0','text-success':child.states==='1'}" v-if="child.reason">
                            {{child.reason}}
                          </div>
                        </div>
                    </template>
                    <!--状态是已审批 或签-->
                    <template v-if="item.approvalNode && item.approvalNode.type==='1'">
                      <template v-for="(child, index) in item.approvalNode.approverList" >
                        <div v-if="child.states==='1' || child.states==='0'" :key="index">
                          {{child.approverName?child.approverName:child.pendingApprovalName}}
                          <span :class="{'text-danger':child.states==='0','text-success':child.states==='1'}">({{getCurNodeStatus(child.states)}})</span>
                          <div :class="{'text-danger':child.states==='0','text-success':child.states==='1'}">{{child.reason}}</div> 
                        </div>
                      </template>
                        
                    </template>
                   </template>
                  <!--状态是待审核,审批中时-->
                  <template v-if="item.states ==='2' || item.states ==='3'">
                     {{getNodeInfo(item.approvalNode)}}
                  </template>
                   <span v-if="item.approvalNode && (item.approvalNode.approverList[0].pendingApprovalType!=='0' || item.approvalNode.approverList.length>1) ">({{item.approvalNode.type==='1'?'或签':'会签'}})</span>
                </div>
                <div class="bottom" v-if="item.states ==='1' || item.states ==='0' ">
                  <template>
                    {{item.updateDt | timeFormat}} 
                  </template>
                </div>
                <!-- <div class="footer text-danger" v-if="item.reason">
                  {{item.reason}}
                </div> -->
             </div>
          </div>
          <div class="right">
            <!-- {{item.date}} -->
          </div>
      </div>
      <!-- <div class="item" v-if="progress.copyPersonList.length>0">
         <div class="left">
            <div class="name bg-green">
                抄送
            </div>
             <div class="content">
             <div class="top">
                已抄送({{progress.copyPersonList.length}}人)
             </div>
             <div class="bottom mt10">
                <div class="b-item" v-for="(item, index) in progress.copyPersonList" :key="index">
                   <img  v-if="item.imgUrl" :src="item.imgUrl" alt="">
                   <div v-else class="headImg">{{item.name}}</div>
                   <span>{{item.name}}</span>
                </div>
             </div>
         </div>
         </div>
        
      </div> -->
     </div>
     <div class="applicationInfo">
       <!-- <div class="sys-title">
         <div>申请信息</div>
         <i style="color:#fff;margin-right:10px;" :class="{'el-icon-arrow-down':isShow,'el-icon-arrow-up':!isShow}" @click="isShow=!isShow"></i>
       </div>
       <div class="application" v-if="!isShow">
         <PaymentApplicationDetails v-if="$route.path==='/router/paymentApplication'" :id="editForm.id"></PaymentApplicationDetails>
        <CustomerVisitsDetails v-else-if="$route.path==='/router/customerVisits'"></CustomerVisitsDetails>
       </div> -->
        <div class="sys-title mt10">
           <span>评论信息</span>
           <span><el-button type="primary" size="mini" @click="isShowCommentDialog=true">我要评论</el-button></span>
        </div>
        <div class="application">
          <template v-if="approvalDetails && approvalDetails.approvalComments">
            <div class="askItem"  v-for="(item, index) in approvalDetails.approvalComments" :key="index">
              <span> {{item.createDt | timeFormat}}</span>
              <strong>{{item.positionName}} {{item.approverName}}</strong>
              <div class="commentContent">{{item.content}} </div>
          </div>
          </template>
        </div>
     </div>
   </div>
   <AddComment v-if="isShowCommentDialog" :isShowDialog="isShowCommentDialog" :approvalInfo="editForm" @closeDialog="isShowCommentDialog=false" @dialogChange ="dialogChange" />
  </el-dialog>
</template>
<script>
import Api from '@/api/index'
import CustomerVisitsDetails from './customerVisits/ApplicationDetails'
import MarketDevelopmentDetails from './marketDevelopment/ApplicationDetails'
import PaymentApplicationDetails from './payment/ApplicationDetails'
import AddComment from './AddComment'
export default {
  components: {
    AddComment,
    CustomerVisitsDetails,
    MarketDevelopmentDetails,
    PaymentApplicationDetails
  },
  props: ['isShowDialog', 'editForm'],
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      isShow:false,
      isShowCommentDialog:false,//评论弹窗
      userInfo: userInfo,
      approvalDetails:null,
      progress: {
        progressList: [
          {
            name: '张三',
            date: '2019-10-01',
            type: '发起人',
            imgUrl: '',
            status: '',
            reason: ''
          }, {
            name: '李四',
            date: '2019-10-01',
            type: '审批人',
            imgUrl: '',
            status: '已同意',
            reason: ''
          }, {
            name: '张三',
            date: '2019-10-01',
            type: '审批人',
            imgUrl: '',
            status: '驳回',
            reason: '姓名与身份证上的信息不一致'
          }
        ],
        copyPersonList: [
          {
            name: '李四',
            imgUrl: ''
          }, {
            name: '李四',
            imgUrl: ''
          }
        ]
      }

    }
  },
  mounted () {
    //获取审批流程信息
    this.getApprovalDetailWithStep()
  },
  methods: {
    getCurNodeStatus(status){
      const statusName = ['已驳回','已通过','审批中']
      return statusName[status]
    },
    //获取节点信息
    getNodeInfo(node){
        console.log(node,node.approverList,'getNOdelIst')
       if(node && node.approverList){
         const approverList = node.approverList.map(item=>item.pendingApprovalName).toString()
        return approverList
       }else{
         return ''
       }
       
    },
    //审批详情
      getApprovalDetailWithStep() {
        const params = {
          id :this.editForm.id
        }
        Api.approvalDetailWithStep(params).then(data => {
          if (data) {
            console.log(data,'approvalDetails')
            this.approvalDetails = data
            this.currentNode = data.currentNode
            data.approvalDetails.unshift({
                 id:data.ctUid,
                 states:'1',
                 approverName:data.approverName?data.approverName:data.ctUName,
                 positionName:'申请人',
                 updateDt:data.createDt,
            })
           
            // if (data.approvalDetails.length > 0) {
            //   let _this = this
            //   for (let i = 0; i < data.approvalDetails.length; i++) {
            //     let item = data.approvalDetails[i]
            //     if(item.states ==='1'){
            //         this.approvalIndex = i+1
            //         continue;
            //     }
            //   }
            // }
            // console.log(data.approvalDetails,'data.approvalDetails')
          }
        })
      },
    getApprovalProcessList () {
      const path = this.$route.path
      const targetId = (path === '/router/approvalProduct' || path === '/router/approvalActivity') ? this.editForm.targetId : this.editForm.id
      let params = {
        userId: this.userInfo.id,
        targetId: targetId
      }

      if (targetId) {
          // pageFlag
        const fn = (path === '/router/approvalProduct' || path === '/router/approvalActivity') ? 'getApprovalProcessList' : 'getPlanApprovalProcessList'
        Api[fn](params).then(res => {
          this.total.agreeCount = res.filter(item => item.states == 1).length
          this.total.rejectCount = res.filter(item => item.states == 0).length
          this.total.waitCount = res.filter(item => item.states == 2).length
          if (res.length > 0) {
            this.tableHeader[0].label = res[0].groupType === 2 ? '审批人' : '博物馆名称'
          }

          this.approvalProgress = res
          console.log(this.approvalProgress)
        })
      }
    },
    dialogChange(){
      this.isShowCommentDialog = false;
      this.getApprovalDetailWithStep()
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.progreeBox{
  display: flex;
  justify-content: space-between;
  align-self: auto;
  
  .applicationInfo{
    width:50%;
    .application {
      border:1px solid #eee;
      padding:10px;
      // height:260px;
      // overflow-y: auto;
    }
  }
  .askItem{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #ddd;
    padding-top:5px;
    padding-bottom:5px;
    .commentContent{
      width:60%;
    }
  }
  .progress {
     width:49%;
     display:flex;
     flex-direction: column;
     justify-content: flex-start;
     align-items: left;
     .item {
       display: flex;
       justify-content: space-between;
       align-items:center;
       border-left:2px solid #ddd;
       position: relative;
       margin-left:30px;
       padding-bottom:30px;
       &:nth-last-child(1){
         border-left:none;
         align-items:top!important;
       }
       .left {
        display:flex;
        justify-content: flex-start;
        align-items: top;
          .name {
            position: absolute;
            left:-19px;
            width:36px;
            height:36px;
             overflow: hidden;
            border-radius:50%;
            background:#ddd;
            text-align:center;
            color:#FFF;
            line-height: 36px;
          }

          .content{
            display: flex;
         flex-direction: column;
         justify-content: center;
            margin-left:25px;
            .top {
              font-weight: 700;
            }
            .bottom {
              color:#888;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: wrap;
              .b-item {
                 display: flex;
                 flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  margin-right:10px;
                  margin-bottom:10px;
                .headImg {
                  width:40px;
                  height:40px;
                  overflow: hidden;
                  border-radius:50%;
                  background:#22AEDD;
                  text-align:center;
                  color:#FFF;
                  line-height: 40px;
                }
              }
            }
          }
       }
       .right{
         display: flex;
         flex-direction: column;
         justify-content: center;
       }
     }
     
     .bgRed {
       background:red!important;
     }
     .bgGreen {
         background:#1BB677!important;
     }
  }
  
}
  
</style>
