<template>
  <div>
    <div class="tabBox mb10">
        <div class="sys-tab">
            <div class="tab"  v-for="item in tabs" :key="item" :class="{'active': curTab === item}" @click="handleTabs(item)">
            <strong class="title" >
              {{item}}
              <template v-if="item==='待审批'">
                 ({{pendingApprovalCount}})
              </template>
            </strong>
        </div>
        </div>
        <div class="progressBox" v-if="curTab==='申请'">
            <div class="mr10">审批名称：{{approvalProcessInfo.approvalProcessName}}</div>
            <el-button type="primary" size="small" class="ml10" @click="isShowProcessDialog=true">选择流程</el-button>
        </div>
    </div>
    <template v-if="curTab==='申请'">
        <CustomerVisitsApplication v-if="$route.path==='/router/customerVisits'"></CustomerVisitsApplication>
        <MarketDevelopmentApplication v-else-if="$route.path==='/router/marketDevelopment'"></MarketDevelopmentApplication>
        <!--财务模块-->
        <PaymentAppliction v-else-if="$route.path==='/router/paymentApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></PaymentAppliction>
        <InvoicesApplication v-else-if="$route.path==='/router/invoicesApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></InvoicesApplication>
       <BorrowApplication v-else-if="$route.path==='/router/borrowApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></BorrowApplication>
       <ReimburseApplication v-else-if="$route.path==='/router/reimburseApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></ReimburseApplication>
       <TravelApplication v-else-if="$route.path==='/router/travelApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></TravelApplication>
      <!--车辆模块-->
       <EtcApplication v-else-if="$route.path==='/router/etcApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></EtcApplication>
       <InsuranceApplication v-else-if="$route.path==='/router/insuranceApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></InsuranceApplication>
       <MaintainApplication v-else-if="$route.path==='/router/maintainApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></MaintainApplication>
       <OilCardApplication v-else-if="$route.path==='/router/oilCardApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></OilCardApplication>
     <!--业务模块-->
     <MaterialApplication v-else-if="$route.path==='/router/materialApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></MaterialApplication>
     <ToolsApplication v-else-if="$route.path==='/router/toolsApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></ToolsApplication>
     <!-- <BidList v-else-if="$route.path==='/router/bidApproval'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></BidList>
     <ContractList v-else-if="$route.path==='/router/contractApproval'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></ContractList> -->
    <!--行政模块-->
     
     <ExpenditureApplication v-else-if="$route.path==='/router/expenditureApplication'" :editForm="approvalProcessInfo" @dataChange="applicationChange" flag="list"></ExpenditureApplication> 
  <!-- <RegularApplication v-else-if="$route.path==='/router/regularApproval'"></RegularApplication>
      <QuitApplication v-else-if="$route.path==='/router/quitApproval'"></QuitApplication>
      <SealApplication v-else-if="$route.path==='/router/sealApproval'"></SealApplication>
      <OfficialApplication v-else-if="$route.path==='/router/officialApproval'"></OfficialApplication> -->
    </template>
    <ApprovalTable v-show="curTab!=='申请'" ref="approvalTable" :editForm="editForm" :curTab="curTab" :tableHeader="tableHeader"></ApprovalTable>

    <ApprovalProgress v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" @closeDialog="closeDialog" @dataChange="dataChange"></ApprovalProgress>
    <SelectApprovalProcess v-if="isShowProcessDialog" :isShowDialog="isShowProcessDialog" :category="category" @closeDialog="closeDialog" @confirmProcess="confirmProcess"></SelectApprovalProcess>
  </div>
</template>
<script>
import Api from '@/api/index'
import ApprovalProgress from './ApprovalProgress'
import SelectApprovalProcess from './SelectApprovalProcess'
import ApprovalTable from './ApprovalTable'
import CustomerVisitsApplication from './customerVisits/Application'
import MarketDevelopmentApplication from './marketDevelopment/Application'
//财务
import PaymentAppliction from './payment/Application'
import InvoicesApplication from './invoices/Application'
import BorrowApplication from './borrow/Application'
import ReimburseApplication from './reimburse/Application'
import TravelApplication from './travel/Application'
//行政
import ExpenditureApplication from './expenditure/Application'
//车辆
import EtcApplication from './vehicle/etc/Application'
import InsuranceApplication from './vehicle/insurance/Application'
import MaintainApplication from './vehicle/maintain/Application'
import OilCardApplication from './vehicle/oilCard/Application'
//业务
import BidList from './bid/List'
import ContractList from './contract/List'

import MaterialApplication from './library/material/Application'
import ToolsApplication from './library/tools/Application'

//行政
//import TruckList from './truck/List'
// import RegularApplication from './RegularApplication'
// import SealApplication from './SealApplication'
// import QuitApplication from './QuitApplication'
// import OfficialApplication from './OfficialApplication'
 //import EmployeeFilesAdd from '../personnel/EmployeeFilesAdd'
export default {
  components: {
    ApprovalProgress,
    CustomerVisitsApplication,
    MarketDevelopmentApplication, 
    PaymentAppliction,
    InvoicesApplication,
    BorrowApplication,
    ReimburseApplication,
    TravelApplication,
    EtcApplication,
    InsuranceApplication,
    OilCardApplication,
    MaintainApplication,

    ExpenditureApplication,

    ApprovalTable,
    SelectApprovalProcess,
    MaterialApplication,
    ToolsApplication,
    BidList,
    ContractList,
    
    //TruckList,
    //EmployeeFilesAdd,
    // JobApplication,
    // JobApproval,
    // RegularApplication,
    // QuitApplication,
    // SealApplication,
    // OfficialApplication
  },
  computed: {
    // 待审批数量
    pendingApprovalCount () {
      const pendingApprovalCount = this.$store.state.approval.approvalCount
      return pendingApprovalCount
    }

  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    const approvalType= this.getApprovalTypeByRouter()
    let  tabs = ['申请', '待审批', '已审批', '我发起', '抄送我']
    const path = this.$route.path;
    //业务审批中无申请
    const pathArr = ['/router/offerApproval','/router/customsApproval','/router/bidApproval','/router/contractApproval']
    const isHasBusiness = pathArr.some(item=>item===path)
    if(isHasBusiness){
      tabs = ['待审批', '已审批', '我发起', '抄送我']
    }
    return {
      category:'',
      curApprovalType:approvalType,
      progressName: '',
      isShowDialog: false,   //审批进度
      isShowProcessDialog:false, //选择审批流程
      tabs: tabs,
      curTab: '待审批',
      userInfo: userInfo,
      contacterId: '',
      listLoading: false,
      sels: [],
      editForm:null,
      approvalProcessInfo:{
        approvalProcessName:'',
        approvalProcessId:'',
        remark:'',
        ids:[], //申请列表
      },
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        approvalType:'005',
        approvalState:'2',  //  '1' 已审批 ，‘2’待审批 
        param: '', //申请名称或提报人姓名
        //positionId:"f9acc921-a99d-40a5-acc9-21a99d40a53c",  //岗位ID,?
        state:3,   //审批状态
      },

      tableStatus: true,
      tableHeader: [
        {
          prop: 'name',
          label: '标题',
          width: '80',
          show: true
        },
        {
          prop: 'summary',
          label: '摘要',
          width: '160',
          show: true
        },
        {
          prop: 'ctUName',
          label: '申请人',
          width: '80',
          show: true
        },
        {
          prop: 'createDt',
          label: '申请时间',
          width: '90',
          show: true
        },
        {
          prop: 'updateDt',
          label: '完成时间',
          width: '90',
          show: false
        },
        {
          prop: 'progress',
          label: '审批进度',
          width: '50',
          show: true
        },
        {
          prop: 'states',
          label: '状态',
          width: '70',
          show: false
        },
        {
          prop: 'approvalTime',
          label: '审批时间',
          width: '90',
          show: false
        },
        {
          prop: 'approvalName',
          label: '审批人',
          width: '120',
          show: false
        },
        {
          prop: 'refuseReasons',
          label: '驳回原因',
          width: '90',
          show: false
        }
      ],
      listData:[],
      total:0
    }
  },
  mounted () {
    const curTab = sessionStorage.getItem('curApprovalTab')
    if (curTab) {
      this.curTab = curTab
    }
    this.approvalType= this.getApprovalTypeByRouter()
    console.log(this.approvalType,'this.approvalType')
     //获取审批数量
    this.$store.dispatch('getApprovalCount',{states:2,approvalType:this.curApprovalType})
    this.search()
   
  },

  methods: {
    getApprovalTypeByRouter(){
      const typeArr = [{
        label: '合同审批',
        value: '001',
        path:'/router/contractApproval',
        approvalCategory:'1',
      }, {
        label: '报价审批',
        value: '002',
        path:'/router/offerApproval',
         approvalCategory:'3',
      },{
        label: '投标审批',
        value: '003',
        path:'/router/bidApproval',
         approvalCategory:'2',
      },{
        label: '发票审批',
        value: '004',
        path:'/router/invoicesApplication',
         approvalCategory:'0',
      },{
        label: '付款审批',
        value: '005',
        path:'/router/paymentApplication',
         approvalCategory:'0',
      },{
        label: '借款审批',
        value: '006',
        path:'/router/borrowApplication',
         approvalCategory:'0',
      },{
        label: '差旅报销审批',
        value: '007',
        path:'/router/travelApplication',
         approvalCategory:'0',
      },{
        label: '报销审批',
        value: '008',
        path:'/router/reimburseApplication',
         approvalCategory:'0',
      },{
        label: '异常审批',
        value: '009',
        path:'/router/abnormalApplication',
         approvalCategory:'6',
      },{
        label: '物料消耗审批',
        value: '010',
        path:'/router/materialApplication',
         approvalCategory:'6',
      },{
        label: '工具消耗审批',
        value: '011',
        path:'/router/toolsApplication',
         approvalCategory:'6',
      },{
        label: '航材报关审批',
        value: '012',
        path:'/router/customsApproval',
         approvalCategory:'5',
      },{
        label: '标书审批',
        value: '013',
        path:'/router/bidbookApproval',
         approvalCategory:'0',
      },{
        label: '行政审批',
        value: '014',
        path:'/router/expenditureApplication',
         approvalCategory:'0',
      },
      {
        label: '车辆保养审批',
        value: '015',
        path:'/router/maintainApplication',
         approvalCategory:'7',
      },
      {
        label: '出险记录审批',
        value: '016',
        path:'/router/insuranceApplication',
         approvalCategory:'7',
      },
      {
        label: '加油费用审批',
        value: '017',
        path:'/router/oilCardApplication',
         approvalCategory:'7',
      },{
        label: 'ETC费用审批',
        value: '018',
        path:'/router/etcApplication',
         approvalCategory:'7',
      }]
      let type = ''
    
      typeArr.map(item=>{
        if(item.path===this.$route.path){
            type = item.value
            this.category = item.approvalCategory
            return
        }
      })
      console.log('getApprovalTypeByRouter',type)
      return type
    },
    //申请列表数据改变
    applicationChange(){
       this.approvalProcessInfo = {
        approvalProcessName:'',
        approvalProcessId:'',
        remark:'',
        ids:[], //申请列表
      }
      this.search()
    },
    confirmProcess(processInfo){
      this.closeDialog()
      this.approvalProcessInfo.approvalProcessName = processInfo.name
      this.approvalProcessInfo.approvalProcessId = processInfo.id
    },
    search(){
      console.log('search1')
      const approvalTable = this.$refs.approvalTable
      this.$nextTick( ()=> {
         this.$refs.approvalTable.search()
      })
    },
    // 显示审批进度
    showApprovalProgress (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.isShowDialog = true
    },
    closeDialog () {
      this.isShowDialog = false
      this.isShowProcessDialog = false
    },
    getStyle (status) {
        // 0：拒绝 1：批准 2：审批中3:撤回
      if (status === 1) {
        return {'text-success': true}
      } else if (status === 0) {
        return {'text-danger': true}
      }
    },
    // 审批详情页面
    showApprovalDetails (row) {
      this.$router.push({
        path: '/router/approvalProductDetails',
        query: {
          approvalInfoId: row.approvalInfoId,
          targetId: row.targetId,
          processId: row.processId
        }
      })
    },
    dataChange () {
      this.closeDialog()
      this.search()
    },

    handleTabs (item) {
      this.curTab = item
      sessionStorage.setItem('curApprovalTab', item)
      if (item !== '申请') {
        // 处理表格列
        if (item === '待审批') {
          // 申请人
          this.tableHeader[2].show = true
          // 完成时间
          this.tableHeader[4].show = false
          //状态
          this.tableHeader[6].show = false
          this.$store.dispatch('getApprovalCount',{states:2,approvalType:this.curApprovalType})
        } else {
            // 已审批，我发起，抄送我
          // 申请人
          this.tableHeader[2].show = false
          // 完成时间
          this.tableHeader[4].show = true
          //状态
          this.tableHeader[6].show = true
        }
        this.search()
      }
      
    }

  }
}
</script>
<style lang="scss" scoped>

.tabBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .progressBox{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.sys-tab {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tab {
        background:#4d4d4d;
        margin-right:10px;
        padding:4px 30px;
        color:#fff;
        font-size:14px;
        cursor: pointer;
    }
    .active{
        background:#C1272D;
    }
    
}
</style>

