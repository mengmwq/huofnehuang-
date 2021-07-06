<template>
    <div id="editProcess" class="pd10">
       <div class="formItem">
          <label>审批类型：</label>
          <el-switch
              style="display: block"
              class="ml10"
              v-model="editForm.type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              active-text="会签"
              inactive-value="1"
              inactive-text="或签">
            </el-switch>
       </div>
       <div>
          <div class="tar approvalTips">
                <div class="person">
                <i class="dot personBgColor"></i>
                <label>人员</label>
                </div>
                <div class="role">
                <i class="dot roleBgColor"></i>
                <label>角色</label>
                </div>
                <div class="post">
                <i class="dot postBgColor"></i>
                <label>岗位</label>
                </div>
            </div>
       </div>
        <div class="aduitProcess ">
            <div class="processItem mt20">
            <div class="left">
                <strong>审批人</strong>
                <!-- <label>{{approvers.length}}人依次审批</label> -->
                <label>{{approvers.length}}人审批</label>
            </div>
            <div class="right">
                <div class="personList">
                  <template v-for="(item,index) in approvers" >
                    <div class="personItem"  :key="index">
                        <label class="person" :class="{'personBgColor':item.pendingApprovalType==0,'roleBgColor':item.pendingApprovalType==1,'postBgColor':item.pendingApprovalType==2}">
                        <i class="el-icon-error" @click="removeApprover(item,index,'审批人')"></i>
                        <span>{{getApprovalTagName(item)}}</span>
                        </label>
                        <p>{{item.pendingApprovalName}}</p>
                    </div>
                    <!--临时注释-->
                    <!-- <div class="personItem" :key="index+'person'">
                       <i class="el-icon-arrow-right"></i>
                    </div> -->
                  </template>
                   <div class="personItem" @click="addApprover('0')">
                        <i class="el-icon-circle-plus-outline addPerson"></i>
                    </div>
                </div>
            </div>
            </div>
            <div class="processItem mt20">
            <div class="left">
                <strong>抄送人</strong>
                <label>抄送{{approversCopy.length}}人</label>
            </div>
            <div class="right">
                <div class="personList">
                  <template v-for="(item,index) in approversCopy">
                    <div class="personItem"  :key="index">
                        <label class="person" :class="{'personBgColor':item.pendingApprovalType==0,'roleBgColor':item.pendingApprovalType==1,'postBgColor':item.pendingApprovalType==2}">
                        <i class="el-icon-error" @click="removeApprover(item,index,'抄送人')"></i>
                        <span>{{getApprovalTagName(item)}}</span>
                        </label>
                        <!-- <p>{{item.pendingApprovalRoleName?item.pendingApprovalRoleName:item.pendingApprovalName}}</p> -->
                         <p>{{item.pendingApprovalName}}</p>
                    </div>
                    <!--临时注释-->
                     <!-- <div class="personItem"  :key="index+'copy'">
                       <i class="el-icon-arrow-right"></i>
                     </div> -->
                  </template>
                  <div class="personItem"  @click="addApprover('1')">
                      <i class="el-icon-circle-plus-outline addPerson"></i>
                  </div>
                </div>
            </div>
            </div>
        </div>
        <SelectApprover
            v-if="isShowDialog"
            :isShowDialog="isShowDialog"
            :approverType="approverType"
            :editForm="editForm"
            :orgId="orgId"
            :orgName="orgName"
            @closeDialog="closeDialog"
            @dataChange="dataChange"
        ></SelectApprover>
    </div>
</template>
<script>
import Api from "@/api/index";
import SelectApprover from "../SelectApprover";

export default {
  components: {
      SelectApprover,
  },
  props:{
    orgId:{
      type:String,
    },
    orgName:{
      type:String,
    },
     definitionSteps:{
        type:Array,
     },
     editForm:{
       type:Object,
     },
  },
  data() {
    const approverList =this.editForm.approverList
    const approvers = approverList?approverList.filter(item=>item.type==='0'):[]
    const approversCopy = approverList?approverList.filter(item=>item.type==='1'):[]
    return {
        isShowDialog:false,
        approverType:'',
        approversCopy:approversCopy,
        approvers:approvers,
        rules: {
            name: [
                {
                    required: true
                }
            ]
        },
    }

  },
  watch:{
    'editForm.approverList':function(approverList){
      console.log(approverList,'edddd')
      this.approvers = approverList?approverList.filter(item=>item.type==='0'):[]
      this.approversCopy = approverList?approverList.filter(item=>item.type==='1'):[]
    },
  },
  mounted() {
  },
  methods: {
    //处理审批人与抄送人显示
    getApprovalTagName(item){
      const type = item.pendingApprovalType
      const tagName = item.pendingApprovalName
      return tagName.substring((tagName.length-2),tagName.length)
      // if(type===0){
      //   //待审批类型 0:人1:角色2:岗位
      //     return tagName.substring((tagName.length-2),tagName.length)
      // }else if(type===1){
      //   //角色
      //   return tagName.substring(0,1)
      // }else if(type===2){
      //   //岗位
      //   return tagName.substring(0,1)
      // }
    },
      closeDialog() {
        this.isShowDialog = false;
      },
      //处理重复数组
      handleArrRepeat(arr){
         var hash = {};
        return  arr.reduce(function(item, next) {
            hash[next.pendingApprovalName] ? '' : hash[next.pendingApprovalName] = true && item.push(next);
            return item
        }, [])

      },
      dataChange(selectedApprovers,flag) {
        this.closeDialog();
        
        if(flag==='1'){
           //抄送人
           //处理重复项；
           const newApproversCopy =this.approversCopy.concat(selectedApprovers)
            this.approversCopy= this.handleArrRepeat(newApproversCopy)
        }else if(flag==='0'){
          //审批人
          //处理重复项；
          const newApprovers = this.approvers.concat(selectedApprovers)
          this.approvers=this.handleArrRepeat(newApprovers)
        }
        //合并数组
        const newApprovers =this.approvers.concat(this.approversCopy)
        this.$emit('dataChange',newApprovers)
       },
      removeApprover(item, index,flag) {
        if(flag=='审批人'){
            this.approvers.splice(index, 1);
            //this.$emit('dataChange',this.approvers,flag)
        }else if(flag==='抄送人'){
            this.approversCopy.splice(index, 1);
            //this.$emit('dataChange',this.approversCopy,flag)
        }
        const newApprovers =this.approvers.concat(this.approversCopy)
        this.$emit('dataChange',newApprovers)
      },
      addApprover(approverType) {
        console.log(this.orgId,'this.editForm.orgName')
        if(this.orgId){
          this.approverType = approverType
          this.isShowDialog = true
        }else{
           this.$message({
              type:'error',
              message:'请选择流程所属机构！',
              showClose:true
           })
        }
        
      },
  }
};
</script>
<style lang="scss" scoped>
 .formItem{
   display: flex;
   justify-content: flex-start;
   align-items: center;
   padding-bottom:15px;
 }
  .approvalTips {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    //margin-bottom: 25px;
    .dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-block;
    }
    .person,
    .role,
    .post {
      margin-left: 15px;
    }
    i,
    label {
      vertical-align: middle;
    }
    .personBgColor {
      background-color: #818cc3;
    }
    .roleBgColor {
      background-color: #f6942f;
    }
    .postBgColor {
      background-color: #4c4d4e;
    }

  }
  .aduitProcess {
    //margin-bottom: 16px;
    .processItem:nth-child(1) {
      border-bottom: 1px dashed #ddd;
      padding-bottom:6px;
      margin-bottom: 10px;
    }
    .processItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        height: 45px;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        //align-items: center;
        strong {
          padding: 0;
          margin: 0;
          color: #c3282f;
        }
        label {
          color: #999;
          font-size:12px;
        }
      }
      .right {
        .personList {
          display: flex;
          justify-content: space-around;
          //align-items: center;
          .personItem {
            text-align: center;
            margin-left: 10px;
            .person {
              position: relative;
              background: #818cc3;
              padding:8px 5px;
              border-radius: 20px;
              span {
                color: #fff;
              }

              i {
                display: inline-block;
                position: absolute;
                top: -6px;
                right: -6px;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                cursor: pointer;
                text-align: center;
              }
            }
            p {
              margin-top: 10px;
              margin-bottom: 5px;
              font-size:12px;
            }
          }
          .addPerson {
            font-size: 30px;
            color: #c3282f;
          }
        }
      }
    }
    .roleBgColor {
      background-color: #f6942f!important;
    }
    .postBgColor {
      background-color: #4c4d4e!important;
    }
  }
</style>
