<template>
  <div>
    <!--财务 -->
    <PaymentApplication v-if="$route.path==='/router/paymentApprovalDetails'" :editForm="editForm" flag="details"></PaymentApplication>
    <InvoiceApplication v-else-if="$route.path==='/router/invoiceApprovalDetails'" :editForm="editForm" flag="details"></InvoiceApplication>
    <BorrowApplication v-else-if="$route.path==='/router/borrowApprovalDetails'" :editForm="editForm" flag="details"></BorrowApplication>
    <ReimburseApplication v-else-if="$route.path==='/router/reimburseApprovalDetails'" :editForm="editForm" flag="details"></ReimburseApplication>
    <TravelApplication v-else-if="$route.path==='/router/travelApprovalDetails'" :editForm="editForm" flag="details"></TravelApplication>
    <!--车辆 -->
    <ETCApplication v-else-if="$route.path==='/router/etcApprovalDetails'" :editForm="editForm" flag="details"></ETCApplication>
    <OilCardApplication v-else-if="$route.path==='/router/oilCardApprovalDetails'" :editForm="editForm" flag="details"></OilCardApplication>
    <InsuranceApplication v-else-if="$route.path==='/router/insuranceRecordApprovalDetails'" :editForm="editForm" flag="details"></InsuranceApplication>
    <MaintainApplication v-else-if="$route.path==='/router/maintainApprovalDetails'" :editForm="editForm" flag="details"></MaintainApplication>
    <!--业务  涉及多个申请 ，不涉及多个申请在详情页中处理；-->
    <CustomerVisitsApplication v-else-if="$route.path==='/router/customerVisitsDetails'" :editForm="editForm" flag="details"></CustomerVisitsApplication>
    <MarketDevelopmentApplication v-else-if="$route.path==='/router/marketDevelopmentDetails'" :editForm="editForm" flag="details"></MarketDevelopmentApplication>
    <!-- 操作库---->
    <MaterialApplication v-else-if="$route.path==='/router/materialApprovalDetails' || $route.path==='/router/toolsApprovalDetails'" :editForm="editForm" flag="details"></MaterialApplication>
    
    <ExpenditureApplication v-else-if="$route.path==='/router/expenditureApprovalDetails'" :editForm="editForm" flag="details"></ExpenditureApplication>
    
    <!--审批意见处理--->
    <div v-if="$route.query.approvalStatus === 'pendingApproval'">
      <ApprovalHandle></ApprovalHandle>
    </div>
    <div class="tar mt10" v-else>
        <el-button type="default" class="ml10"  @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import Api from '@/api/index'
import ApprovalHandle from './ApprovalHandle'
import PaymentApplication from './payment/Application'
import InvoiceApplication from './invoices/Application'
import BorrowApplication from './borrow/Application'
import ReimburseApplication from './reimburse/Application'
import TravelApplication from './travel/Application'
import ETCApplication from './vehicle/etc/Application'
import OilCardApplication from './vehicle/oilCard/Application'
import MaintainApplication from './vehicle/maintain/Application'
import InsuranceApplication from './vehicle/insurance/Application'
import CustomerVisitsApplication from './customerVisits/Application'
import MarketDevelopmentApplication from './marketDevelopment/Application'
import MaterialApplication from './library/material/Application'
import ExpenditureApplication from './expenditure/Application'

export default {
  components:{

    ApprovalHandle,
    InvoiceApplication,
    BorrowApplication,
    PaymentApplication,
    ReimburseApplication,
    TravelApplication,

    ETCApplication,
    OilCardApplication,
    MaintainApplication,
    InsuranceApplication,
    ExpenditureApplication,

    MaterialApplication,

    CustomerVisitsApplication,
    MarketDevelopmentApplication
  },
  computed: {
  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      isShowPrintBtn:false,
      isShowPrint:false,
      userInfo: userInfo,
      listLoading: false,
      sels: [],
      form:{
        status:0,
        reason:"",
        id:''
      },
      editForm:{
        approvalProcessName:'',
        approvalProcessId:'',
        remark:'',
        ids:[], //申请列表
      },
      
    }
  },
  mounted () {
    
  },

  methods: {
    goBack(){
      this.$router.go(-1)
    },
     // 提交审批
    sumbitApproval (row) {
      // 输入修改原因；
      let params = this.form
      const status = params.status
      if(status===1 && !params.reason){
        this.$message({
           showClose:true,
           message:'审批驳回时，必须要输入原因！',
           type:'error'
        })
        return;
      }
      params.id = this.$route.query.currentNodeId  //审批当前节点 ID;
      const fn = status ===1?'approvalRefuse':'approvalAccept' 
      const msg = status ===1?'审批驳回操作成功！':'审批同意操作成功！'
      Api[fn](params).then((res) => {
        this.$router.go(-1)
        this.$message({showClose: true, message: `${msg}`, type: 'success'})
        //获取审批数量
        this.$store.dispatch('getApprovalCount',{states:2})
      })
    }

  }
}
</script>
<style lang="scss" scoped>
    .remark{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>

