<template>
  <div class="formDetails">
    <el-form label-position="right" :model="form" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：">{{form.projectName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请编号：">{{form.targetId}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编码：">{{form.projectCode}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号：">{{form.contractCode}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商名称：">{{form.customName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款内容：">{{form.content}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：">{{form.receiptNo}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：">{{form.receiptInfo}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行：">{{form.depositBank}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号：">{{form.bankCode}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="币种：">
                <span v-if="form.attached && form.attached.Currency">{{form.attached.Currency[form.currency].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：">
                <span>{{form.rate}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款金额：" prop="payment">
               {{form.payment?form.payment:form.amount}}
                <!-- <el-input readonly v-model=""></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折合人民币：">
                <span v-if="form.chineseAmount"></span>{{form.amount}} （{{form.chineseAmount}}）
                <!-- <el-input v-model="form.chineseAmount" readonly placeholder="根据付款金额自动转化"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>费用明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="listData" 
          show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>

              <template slot-scope="scope">
                <div>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
          
        </div>
        <p class="step-title"><span class="step-icon">3</span>单据上传：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <AttachmentDetails :attachmentInfo="fileList"></AttachmentDetails>
        </div>
      </div>
    </el-form>
    <div class="tar pd20">
        <el-button type="default" @click="goBack">返回</el-button>
        <el-button type="primary" size="medium"  @click="handlePrint">打 印</el-button>
    </div>
     <div id="PrintPayment" v-if="isShowPrint">
      <PrintPayment  
              :approvalInfo="approvalInfo"
              :form="form"   
              :id="$route.query.id" :targetId="$route.query.applyId"></PrintPayment>
      </div>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import AttachmentDetails from '@/components/attachment/Details'
  import PrintPayment from './PrintPayment'
  export default {
    components: {
      AttachmentDetails,
      PrintPayment
    },
    props:{
       id:{
           type:String,
           default:''
       }
    },
    data () {
      return {
         approvalInfo:null,
        isShowPrint:false,
         query:'',
        type: '',
        form: {},
        /** 表格 loading */
        listLoading: false,
        listData: [],
        tableHeader: [{
          prop: 'feeTypeName',
          label: '费用名称',
          align: 'center',
          show: true
        }, {
          prop: 'amount',
          label: '单价',
          align: 'center',
          show: true
        },{
          prop: 'num',
          label: '数量/重量',
          align: 'center',
          show: true
        },{
          prop: 'totalAmount',
          label: '金额',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        fileList: []  
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      //获取打印信息
      getPrintInfo(applyId) {
       
        if(applyId){
            Api.approvalDetailWithStep({id: applyId}).then(data => {

                if (data) {
                   console.log(data,'approvalDetails')
                    this.approvalInfo = data
                    //this.currentNode = data.currentNode
                    // data.approvalDetails.unshift({
                    //     id:data.ctUid,
                    //     states:'1',
                    //     approverName:data.approverName?data.approverName:data.ctUName,
                    //     positionName:'申请人',
                    //     updateDt:data.createDt,
                    // })
                    
                }
            })
        }
        
      },
       //打印
      handlePrint(){
        this.isShowPrint = true;
        
        this.$nextTick(()=>{
            Print('#PrintPayment')
            this.isShowPrint = false
         })
      },
      goBack(){
        this.$router.go(-1)
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2)
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      /**
       * 加载
       */
      loadData () {
         
        this.listLoading = true
        Api.payDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            if (res.applyAttachments && res.applyAttachments.length > 0) {
              this.fileList = res.applyAttachments
            }
            if (res.payingApplyDetails) {
              this.listData = res.payingApplyDetails
            }
            
          }
          //获取打印信息
            this.getPrintInfo(res.applyId)
        })
        this.listLoading = false
      }
    }
  }
</script>
