<template>
  <div>
    <el-form label-position="right" :model="form" ref="form" label-width="140px">
      <div class="print-data">

        <ApprovalStep :id="id" :info="approvalDetails" 
         :index="approvalIndex"
        @approvalChange="approvalDetailWithStep" :currentNode.sync="currentNode"></ApprovalStep>

        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title">基本信息：</p>
        <div class="formDetails">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编号：">
                <span>{{form.projectCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号：">
                <span>{{form.contractCode}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：">
                <span>{{form.projectName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称：">
                <span>{{form.customerName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请编号：">
                <span>{{form.targetId}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报销编号：">
                <span>{{form.no}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：">
                <span>{{form.receiptNos}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：">
                <span>{{form.receiptInfo}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票公司：">
                <span>{{form.companyOfReceipt}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时间：">
                <span>{{form.applyDatetime | timeFormat}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合计金额：">
                <span>{{form.amount}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式：">
                <span>{{form.payType | payMethodFilter}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title">冲账明细：</p>
        <div style="padding: 0 4%;">
          <el-table class="page-table" :data="listData" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="80" ></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title">费用明细：</p>
        <div style="padding: 0 4%;">
          <el-table class="page-table" :data="listData1" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="80" ></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件信息：">
               <ol class="attachmentOl">
                <li v-for="(item, index) in fileList" :key="index">
                  <span>{{index+1}}. {{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
                  <span v-if="item.attachmentUrlKey" style="margin-left:40px;" @click="showFileDetails(item.attachmentUrlKey)">
                    <el-button type="primary"  size="mini"   v-if="isHasImg(item.attachmentUrlKey)">预览图片</el-button>
                    <el-button type="primary"  size="mini"  v-else-if="item.attachmentUrlKey.indexOf('pdf')!=-1">预览PDF</el-button>
                    <el-button type="primary"  size="mini"  v-else>下载文件</el-button>
                  </span>
                </li>
              </ol>
              <ImgPreview
            :pictures="pictures"
            :isShowDialog="isShowDialogImg"
            :isFullscreen="false"
            v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
            </el-form-item>

          </el-col>
        </el-row>

      </div>
      <!-- 打印内容结束 -->
      <div v-if="$route.query.tag!='1'">
          <div class="title" >审批意见 <div class="line"></div></div>
          <el-input style="width: 90%;margin-left:50px;"
                        type="textarea"
                        maxlength="50"
                          show-word-limit
                        :rows="3"
                        placeholder="请输入审批意见"
                        v-model="editForm.reason">
              </el-input>
      </div>
      <div class="footer m10" >
        <el-button type="primary" size="medium" @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" size="medium" @click="printTable">打印</el-button>
        <el-button type="primary" v-if="!this.$route.query.tag" size="medium" @click="reject">驳回</el-button>
        <el-button type="primary" v-if="!this.$route.query.tag" size="medium" @click="okSubmit('form')">同意</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
    <vue-easy-print  ref="easyPrint" v-if="isShowPrint">
            <template slot-scope="func">
                <ReimbursePrint  :getChineseNumber="func.getChineseNumber" 
                :form="form"   
                :info="approvalDetails"
                :id="id" :targetId="targetId" :fileList="fileList"></ReimbursePrint>
            </template>
        </vue-easy-print>
    <!--驳回弹框-->
    <!-- <el-dialog
      title="驳回操作"
      :close-on-click-modal="canClick"
      :visible.sync="dialogBHVisible"
      width="40%">
      <el-form label-width="110px" :model="editForm" ref="editForm" class="demo-form-inline">
        <el-form-item label="驳回原因：">
          <el-input type="textarea" :rows="4" v-model.trim="editForm.reason" :maxlength="350" placeholder="请输入驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="reject('editForm')">确 认</el-button>
        <el-button type="primary" size="small" @click="dialogBHVisible = false;editForm={}">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import Api from '@/api/index'
  import ApprovalStep from '@/pages/approval/ApprovalStep'
  import ImgPreview from '@/components/common/ImgPreview'
  import ReimbursePrint from './ReimbursePrint'
  import vueEasyPrint from "vue-easy-print"
  export default {
    components: {
      ApprovalStep,ImgPreview,vueEasyPrint,ReimbursePrint
    },
    data () {
      return {
        isShowDialogImg:false,
        pictures:null,
        canClick: false,
        fileList: [],
        flag: false,
        dialogVisible: false,
        dialogBHVisible: false,
        type: '',
        form: {},
        editForm: {
          reason: ''
        },
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        listData1: [],
        tableHeader: [ {
          prop: 'loanApplyId',
          label: '借款单号',
          align: 'center',
          show: true
        }, {
          prop: 'loanAmount',
          label: '冲账金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        tableHeader1: [ {
          prop: 'reimburseIten',
          label: '用途',
          align: 'center',
          show: true
        }, {
          prop: 'reimburseAmount',
          label: '金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'actualReimburse',
          label: '实报',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        id: '', // 用于查审批流程步骤
        targetId: '',
        targetType: '',
        currentNode: '',
        approvalDetails:null,
        approvalIndex:1,
        isShowPrint:false,
      }
    },
    mounted () {
      this.id = this.$route.query.id
      this.targetId = this.$route.query.targetId
      this.targetType = this.$route.query.targetType
      this.loadData()
      this.approvalDetailWithStep();
    },
    methods: {
      //打印表格
       printTable(){
         this.isShowPrint = true
      
         this.$nextTick(()=>{
           this.$refs.easyPrint.print()
         })
        },
      //明细求和
      getSummaries(param) {
        //需要求和的字段
        const property = ['actualReimburse','reimburseAmount','loanAmount']
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));

          if (!values.every(value => isNaN(value)) && (property.some(item=>item==column.property))){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           
            sums[index]=sums[index].toFixed(2)
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      //审批详情
      approvalDetailWithStep() {
        Api.approvalDetailWithStep({id: this.id}).then(data => {
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
                if(item.states ==='1'){
                    this.approvalIndex = i+1
                    continue;
                }
              }
            }
          }
        })
      },
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        // 判断是否图片
        isHasImg(key){
           const aFileType = ['.jpg','.jpeg','.png']
            return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
        },
        //文件预览处理
        showFileDetails(key){
          let img = ''
          Api.getUrl(key).then(data => {
            if (data) {
              if(this.isHasImg(key)){
                //图片预览处理；
                 img = data
                  this.pictures = []
                  this.pictures.push(img)
                  this.isShowDialogImg = true
              }else{
                //除图片的其他文件；
                   window.open(data)
              }
            }
          })

        },
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        Api.queryReimbursementApplyDetailById({id : this.targetId}).then(data => {
          this.form = data;
          // 冲账明细
          this.listData = data.reimburseApplyLoanDetailList
          // 费用明细
          this.listData1 = data.reimburseApplyFeeDetailList

          if (data.applyAttachmentList && data.applyAttachmentList.length > 0) {
            this.fileList = data.applyAttachmentList
          }

        })
        this.listLoading = false
      },
      /**
       * 驳回
       * */
      reject () {
        const params =  this.editForm

        if(!params.reason){
           this.$notify.warning({
                title: '提示',
                message: '请输入审批意见'
              })
            return;
        }
        this.$confirm('您确定驳回吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         
          let params = this.editForm
          params.id =this.currentNode
          Api.approvalRefuse(params).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '驳回成功'
              })
              this.dialogBHVisible=false
              this.$router.push({path: '/router/myAudit'})
            } else {
              this.$notify.warning({
                title: '提示',
                message: '驳回失败'
              })
            }
          })
        })
      },

      okSubmit() {
        this.$confirm('您确定同意吗?', '提示', {   // 1 同意   0 拒绝
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         let params = this.editForm
          params.id =this.currentNode
          Api.approvalAccept(params).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '审批通过'
              })
              this.$router.push({path: '/router/myAudit'})
            }
          })
        })
      },
      cancelSubmit () {
        this.$router.push({path: '/router/myAudit'})
      },
    }
  }
</script>

<style scoped>
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }

  .footer {
    float: right;
    margin-top: 20px;
  }
  .el-form-item__label{padding: 0!important;}
</style>

