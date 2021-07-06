<template>
  <div>
    <el-form :model="form3" label-width="130px">
      <el-row class="m10">
        <el-col :span="8">
          <el-form-item label="标书复审：" prop="firstHeadName">
            <el-input style="width: 100%" v-model="form3.firstHeadName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标书撰写：" prop="secondHeadName">
            <el-input style="width: 100%" v-model="form3.secondHeadName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" style="width: 100%" v-model="form3.remarks"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
         <FileTableMultiUpload
         	  v-if="isUpload"
              :fileList.sync="fileList"
              :removedAll.sync="removedAll"
              @attachmentChange="attachmentChange"
              :applyAttachment="form3.bidingDocumentAttachmentReqList"
            ></FileTableMultiUpload>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批：" prop="approvalProcessId">
            <el-select
              filterable
              v-model="form3.approvalProcessId"
              clearable
              placeholder="请选择审批流程"
              size="medium"
              style="width:100%"
            >
              <el-option
                v-for="item in shenPiList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" v-if="!form3.applyId" @click="tenderMakeAll">提交</el-button>
      </div>
      <div v-if="form3.applyId">
	    <ApprovalStep v-if="approvalDetails" :id="form3.applyId"
	        :index="approvalIndex"
	          :info="approvalDetails" :currentNode.sync="currentNode"
	           @approvalChange="approvalDetailWithStep"></ApprovalStep>
	     <div class="text-right">
	         <el-button type="primary" v-if="states==4  || states==0" @click="newSubmit">重新提交</el-button>
	         <el-button type="primary" v-if="form3.applyId" @click="tenderMakeAll">保存并重新提交</el-button>
	     </div>
	  </div>
    </el-form>
  </div>
</template>

<script>
import Api from "@/api/index";
import FileTableMultiUpload from "@/components/common/FileTableMultiUpload";
import ApprovalStep from '@/pages/approval/ApprovalStep'
export default {
  components: {
    FileTableMultiUpload,
    ApprovalStep
  },
  data() {
    return {
      removedAll: false,
      fileList: [],
       /** 表格 文件制作汇总 审批下拉loading */
        shenPiList: [],
      id: "",
      form3: {
        bidingDocumentAttachmentReqList: []
      },
      isUpload:false,
      states:null,
      currentNode:'',
      approvalIndex:1,
      approvalDetails:{},
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.loadData();
    this.loadShenPiList()
  },
  methods: {
    attachmentChange(val){
      this.form3.bidingDocumentAttachmentReqList = val
    },
    /**
       * 获取审批流程下拉数据
       * */
      loadShenPiList() {
        Api.approvalList({category: '2'}).then(data => {
          this.shenPiList = data;
        }).finally(() => {
          this.listLoading = false
        })
      },
    /**
     * 标书制作汇总操作
     * */
    tenderMakeAll(item) {
    
      if (!this.form3.approvalProcessId) {
        this.$notify.warning({
          title: "提示",
          message: "请选择审批流程"
        });
        return;
      }
      //检测弹窗弹出就确认提交
      if (this.fileList.length > 0) {
        this.form3.bidingDocumentAttachmentReqList = [];
        this.fileList.forEach(function(item) {
          this.form3.bidingDocumentAttachmentReqList.push({
            name: item.name,
            attachmentUrlKey: item.attachmentUrlKey,
            bidAttachmentType:'001',
          });
        });
      } else {
        if (this.removedAll) {
          this.form3.bidingDocumentAttachmentReqList = [];
        }
      }
      delete this.form3["bidingDocumentAttachmentRespList"];
      Api.addOrUpdateBidingDocument(this.form3).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "标书制作申请提交成功"
          });
          this.cancelTenderMake();
          // 重新渲染页面数据
          this.loadData();
        }
      });
    },
    cancelTenderMake() {
      this.dialogVisibleTender = false;
      this.form3 = {
        bidingDocumentAttachmentReqList: []
      };
    },
    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      const  bidProjectId =this.$route.query.id
      let param = { bidProjectId: bidProjectId };
      Api.queryBidingDocumentByBidProjectId(param).then(data => {
          if (data) {
            this.form3 = data;
            this.form3.bidProjectId = bidProjectId
            if (
              data.bidingDocumentAttachmentRespList &&
              data.bidingDocumentAttachmentRespList.length > 0
            ) {
              data.bidingDocumentAttachmentRespList.forEach(function(item) {
              });
              this.form3.bidingDocumentAttachmentReqList = data.bidingDocumentAttachmentRespList;
              this.isUpload= true
            } else {
              this.form3.bidingDocumentAttachmentReqList = [];
              this.isUpload= true
            }
          }
          this.approvalDetailWithStep();
        });
    },
          //审批详情
      approvalDetailWithStep() {
        const applyId = this.form3.applyId
        if(applyId || applyId === ''){
          return
        }
        Api.approvalDetailWithStep({id: applyId}).then(data => {
          if (data) {
            console.log(data,'data')
            this.approvalDetails = data
            
            this.currentNode = data.currentNode
            data.approvalDetails.unshift({
                 id:data.ctUid,
                 states:'1',
                 approverName:data.approverName?data.approverName:data.ctUName,
                 positionName:'申请人',
                 updateDt:data.createDt,
            })
            if (data.approvalDetails.length > 0) {
              console.log(data.approvalDetails,'data.approvalDetails')
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
  }
};
</script>

