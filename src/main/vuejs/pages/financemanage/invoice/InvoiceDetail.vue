<template>
  <div>
      <div class="print-data">
        <!--审批流程步骤信息-->
        <ApprovalStep v-show="flag && approvalDetails" :id="id" 
        :index="approvalIndex"
          :info="approvalDetails" :currentNode.sync="currentNode"
           @approvalChange="approvalDetailWithStep"></ApprovalStep>

        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <div class="formDetails">
          <!-- 合同审批 001-->
           <ContractApprovalInfo v-if="targetType==='001'" :info="form"></ContractApprovalInfo>
           <!-- 报价审批 002-->
           <OfferApprovalInfo v-if="targetType==='002'" :info="form"></OfferApprovalInfo>
           <!-- 投标审批 003-->
           <BiddingApprovalInfo v-if="targetType==='003'" :info="form"></BiddingApprovalInfo>
           <!--发票信息 004-->
           <InvoiceApprovalInfo v-if="targetType==='004'" :info="form" :approvalDetails="approvalDetails"></InvoiceApprovalInfo>
           <!--付款信息 005-->
           <paymentApprovalInfo v-if="targetType==='005'" :info="form"></paymentApprovalInfo>
           <!--借款信息 006-->
           <BorrowApprovalInfo v-if="targetType==='006'" :info="form"></BorrowApprovalInfo>
           <!--异常信息 009-->
           <ExceptionApprovalInfo v-if="targetType==='009'" :info="form"></ExceptionApprovalInfo>
           <!--物料库，工具库消耗申请 -->
           <ConsumeApprovalInfo v-if="targetType==='010' || targetType==='011'" :info="form"></ConsumeApprovalInfo>
           <!--航材报关审批 012-->
           <materialReportApprovalInfo v-if="targetType==='012'" :info="form"></materialReportApprovalInfo>
           <!--标书审批 013-->
           <BindingBookApprovalInfo v-if="targetType==='013'" :info="form"></BindingBookApprovalInfo>
            <!--付款信息 014-->
           <AdministrationApprovalInfo v-if="targetType==='014'" :info="form"></AdministrationApprovalInfo>
          <!-- 维修保养 015-->
           <Maintenance v-if="targetType==='015'" :info="form"></Maintenance>
          <!-- 出险记录 016-->    
           <InsuranceRecord v-if="targetType==='016'" :info="form"></InsuranceRecord>
           <!-- 油卡信息 017-->
           <OilCard v-if="targetType==='017'" :info="form"></OilCard>
            <!-- ETC信息 018--> 
           <ETC v-if="targetType==='018'" :info="form"></ETC>

        </div>
           

          <div class="title">附件信息 <div class="line"></div></div>
          <ol class="attachmentOl">
            <li v-for="(item, index) in fileList" :key="index"   >
              <span>{{index+1}}. {{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
              <span  style="margin-left:40px;" @click="showFileDetails(item.key?item.key:item.attachmentUrlKey)">
                <el-button type="primary"  size="mini"   v-if="isHasImg(item.key?item.key:item.attachmentUrlKey)">预览图片</el-button>
                <el-button type="primary"  size="mini"  v-else-if="isHasPdf(item.key?item.key:item.attachmentUrlKey)">预览PDF</el-button>
                <el-button type="primary"  size="mini"  v-else>下载文件</el-button>
              </span>
            </li>
          </ol>
          <ImgPreview
            :pictures="pictures"
            :isShowDialog="isShowDialogImg"
            :isFullscreen="false"
            v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
          <!-- 打印内容结束 -->
       
            <div v-if="$route.query.tag!='1'">
                <div class="title" >审批意见 <div class="line"></div></div>
                <el-input style="width: 90%;margin-left:50px;"
                              type="textarea"
                              maxlength="50"
                               show-word-limit
                              :rows="3"
                              placeholder="请输入审批意见"
                              v-model="boHuiForm.reason">
                    </el-input>
            </div>
         
          <div class="footer m10">
            <el-button type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
            <el-button type="primary" size="medium" v-if="$route.query.targetType!='002'" @click="printTable">打 印</el-button>
            <el-button type="primary" v-if="flag && !this.$route.query.tag" size="medium" @click="reject">驳 回</el-button>
            <el-button type="primary" v-if="flag && !this.$route.query.tag" size="medium" @click="okSubmit">同 意</el-button>
          </div>
          <div style="clear: both"></div>
          <vue-easy-print ref="easyPrint" v-if="isShowPrint">
            <template slot-scope="func">
                <InvoicePrint  :getChineseNumber="func.getChineseNumber" 
                :form="form"
                :info="approvalDetails"
                :id="id" :targetId="targetId" :fileList="fileList"></InvoicePrint>
            </template>
        </vue-easy-print>
      </div>
    <!-- <el-dialog
      title="驳回操作"
      :close-on-click-modal="canClick"
      :visible.sync="dialogBHVisible"
      size="small" width="40%">
      <el-form :model="boHuiForm" ref="boHuiForm" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目编号：">
              <span class="info">{{form.projectCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回原因：">
              <el-input style="width: 100%"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入驳回原因"
                        v-model="boHuiForm.reason">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogBHVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="reject()">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import 'element-ui/lib/theme-chalk/display.css';
  import ApprovalStep from '@/pages/approval/ApprovalStep'
  import InvoiceApprovalInfo from '@/pages/approval/InvoiceApprovalInfo'
  import paymentApprovalInfo from '@/pages/approval/paymentApprovalInfo'
  import BorrowApprovalInfo from '@/pages/approval/BorrowApprovalInfo'
  import BiddingApprovalInfo from '@/pages/approval/BiddingApprovalInfo'
  import ContractApprovalInfo from '@/pages/approval/ContractApprovalInfo'
  import OfferApprovalInfo from '@/pages/approval/OfferApprovalInfo'
  import ExceptionApprovalInfo from '@/pages/approval/ExceptionApprovalInfo'
  import materialReportApprovalInfo from '@/pages/approval/materialReportApprovalInfo'
  import ConsumeApprovalInfo from '@/pages/approval/ConsumeApprovalInfo'
  import BindingBookApprovalInfo from '@/pages/approval/BindingBookApprovalInfo'
  import AdministrationApprovalInfo from '@/pages/approval/AdministrationApprovalInfo'
  import ImgPreview from '@/components/common/ImgPreview'
  import InvoicePrint from './InvoicePrint'
   import InsuranceRecord from '@/pages/approval/InsuranceRecord'
    import Maintenance from '@/pages/approval/Maintenance'
  import OilCard from '@/pages/approval/OilCard'
  import ETC from '@/pages/approval/ETC'
  import vueEasyPrint from "vue-easy-print";

  import Api from '@/api/index'
  export default {
    components: {
      InsuranceRecord,
      Maintenance,
      ETC,
      OilCard,
      InvoicePrint,
      vueEasyPrint,
      ImgPreview,
      ApprovalStep,
      ContractApprovalInfo,
      OfferApprovalInfo,
      InvoiceApprovalInfo,
      paymentApprovalInfo,
      BorrowApprovalInfo,
      BiddingApprovalInfo,
      ExceptionApprovalInfo,
      materialReportApprovalInfo,
      ConsumeApprovalInfo,
      BindingBookApprovalInfo,
      AdministrationApprovalInfo
    },
    data () {
      return {
        isShowPrint:false,
        approvalDetails:{},
        isShowDialogImg:false,
        pictures:null,
        canClick: false,
        dialogVisible: false,
        dialogBHVisible: false,
        flag : false,
        type: '',
        form: {},
        boHuiForm: {},
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        id: '', // 用于查审批流程步骤
        targetId: '',
        targetType: '',
        currentNode: '',
        param: {},
        fileList: [],
        approvalIndex:1,

      }
    },
    mounted () {
     this.flag = this.$route.path === '/router/auditDetail'
      this.id = this.$route.query.id
      this.targetId = this.$route.query.targetId
      this.targetType = this.$route.query.targetType
      // this.$route.query.type ? alert('审批') : alert('详情')
      this.param = {
        id: this.targetId
      }
      this.loadData()
      this.approvalDetailWithStep()
    },
    methods: {
      
      //审批详情
      approvalDetailWithStep() {
        const id = this.id 
        if(id){
          Api.approvalDetailWithStep({id: this.id}).then(data => {
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
                  if(item.states ==='1'){
                      this.approvalIndex = i+1
                      continue;
                  }
                }
              }
            }
          })
        }
        
      },
      //打印表格
       printTable(){
         this.isShowPrint = true
         console.log(this.fileList,this.approvalDetails,'fa')
         this.$nextTick(()=>{
           this.$refs.easyPrint.print()
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
        isHasPdf(key){
           return key.toLowerCase().lastIndexOf('.pdf')!=-1
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
          /**
           * 合同审批 001
           * 投标审批 003
           * 发票审批 004
           * 付款审批 005
           * 借款审批 006
           * 差旅报销审批 007
           * 报销审批 008
           * 加油卡审批 017
           * */
        // 发票详情
        switch (this.targetType) {
           case('001'):
              Api.contractDetail(this.param).then(data => {
                if (data) {
                  this.form = data
                  if (data.contractAttachments && data.contractAttachments.length > 0) {
                    this.fileList = data.contractAttachments
                  }
                }
              })
              break
          case('002'):
              Api.previewOffer(this.param).then(res => {
                if (res) {
                  this.form = res
                }
              });
              break
           case('003'):
               Api.queryBidProjectById(this.param).then(data => {
                   if (data) {
                     this.form = data
                     if (data.bidAttachmentRespList && data.bidAttachmentRespList.length > 0) {
                       this.fileList = data.bidAttachmentRespList
                     }
                   }
               })
             break
           case('004'):
             Api.queryReceiptApplyInfoById(this.param).then(data => {
                 if (data) {
                   this.form = data
                   if (data.applyAttachmentList && data.applyAttachmentList.length > 0) {
                     this.fileList = data.applyAttachmentList
                   }

                 }
             })
             break
          case('005'):
             Api.payDetail(this.param).then(data => {
                 if (data) {
                   this.form = data
                   if (data.applyAttachments && data.applyAttachments.length > 0) {
                     this.fileList = data.applyAttachments
                   }
                 }
             })
             break
          case('006'):
             Api.loanDetail(this.param).then(data => {
                 if (data) {
                   this.form = data
                   if (data.applyAttachments && data.applyAttachments.length > 0) {
                     this.fileList = data.applyAttachments
                   }
                 }
             })
             break
          case('009'):
            Api.errorDetail(this.param).then(data => {
              if (data) {
                this.form = data
              }
            })
             break
          case('010'):
            Api.operationDetail(this.param).then(data => {
              if (data) {
                this.form = data
                if (data.purchaseAttachments && data.purchaseAttachments.length > 0) {
                  this.fileList = data.purchaseAttachments
                }
              }
            })
            break
          case('011'):
            Api.operationDetail(this.param).then(data => {
              if (data) {
                this.form = data
                if (data.purchaseAttachments && data.purchaseAttachments.length > 0) {
                  this.fileList = data.purchaseAttachments
                }
              }
            })
            break
          case('012'):
            Api.customsDetail(this.param).then(data => {
              if (data) {
                this.form = data
              }
            })
            break
          case('013'):
            let param = {
              id: this.targetId
            }
            Api.queryBidingDocumentDetail(param).then(data => {
              if (data) {
                this.form = data
              }
            })
            break
          case('014'):
             Api.administrationApprovalDetails(this.param).then(data => {
                 if (data) {
                   this.form = data
                   if (data.applyAttachments && data.applyAttachments.length > 0) {
                     this.fileList = data.applyAttachments
                   }
                 }
             })
            break
          case('015'):
             Api.getCarMaintainDetail(this.param).then(data => {
                 if (data) {
                   this.form = data
                  
                 }
             })
            break
            case('016'):
             Api.getAccidentRdDetail(this.param).then(data => {
                 if (data) {
                   this.form = data
                   console.log(data,'AccidentRdDetail')
                 }
             })
            break
            case('017'):
             Api.getGasolineById(this.param).then(data => {
                 if (data) {
                   this.form = data
                 }
             })
            break
            case('018'):
             Api.getETCById(this.param).then(data => {
                 if (data) {
                   this.form = data
                  
                 }
             })
            break
        }
        

      },
      /**
       * 驳回
       * */
      reject () {
        const params =  this.boHuiForm

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
          this.boHuiForm.id = this.currentNode
          Api.approvalRefuse(this.boHuiForm).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '驳回成功'
              })
              this.dialogBHVisible=false
              this.$router.go(-1)
            } else {
              this.$notify.warning({
                title: '提示',
                message: '驳回失败'
              })
            }
          })
        })
      },
      downLoadFile (item) {
        let key = ''
        if (item.key) {
          key = item.key
        } else if (item.attachmentUrlKey) {
          key = item.attachmentUrlKey
        } else if (item.appendixUrlKey) {
          key = item.appendixUrlKey
        }

        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          if (key) {
            Api.getUrl(key).then(data => {
              var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
              save_link.href = data;
              save_link.download = key;
              var event = document.createEvent('MouseEvents');
              event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              save_link.dispatchEvent(event);
            });
          }

        } else {
          if (key) {
            Api.downloadFile(key).then((res) => {
              if (res) {
                if (window.navigator.msSaveOrOpenBlob) {
                  navigator.msSaveBlob(res, item.key)
                } else {
                  const elink = document.createElement('a')
                  elink.download = key
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(res)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href) // 释放URL 对象
                  document.body.removeChild(elink)
                }
              }
            });
          }
        }
      },
      okSubmit() {
        this.$confirm('您确定同意吗?', '提示', {   // 1 同意   0 拒绝
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params  = this.boHuiForm
           params.id= this.currentNode
          Api.approvalAccept(params).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '审批通过',
              })
              this.$router.go(-1)
            }
          })
        })
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

