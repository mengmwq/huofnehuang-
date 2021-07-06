<template>
  <div>
     <el-row>
        <el-col :span="12">
          <div class="tab-nav" style="margin:0">
            <div class="nav-item tab" @click="changeTabData(index)"  v-for="(item,index) in tabItem" :key="index">
              <span :class="tabIndex===index ? 'tab-active' : ''"> {{item}}</span>
            </div>
          </div>
        </el-col>
       <el-col :span="12" class="text-right">
            <el-button size="small"  type="primary" @click="printTable" v-if="tabIndex==0" >
                打印项目收支表
            </el-button>
       </el-col>
       
     </el-row>
    <!--收支汇总-->
    <ProjectFinanceDetails v-if="tabIndex==0" :listPage="listPage" :tableRow="tableRow"  :form="form" :query="query"></ProjectFinanceDetails>
    <!--收支明细 -->
    <ProjectFinanceSummary v-if="tabIndex==1" :projectCode="projectCode" :bidId="bidId"></ProjectFinanceSummary>
    <!--账单确认-->
    <ProjectFinanceCheckBill v-if="tabIndex==2" :projectCode="projectCode" :bidId="bidId" :stateId="stateId"></ProjectFinanceCheckBill>
    <!--收入确认-->
    <ProjectRevenueBill v-if="tabIndex==3" :projectCode="projectCode" :bidId="bidId" :stateId="stateId"></ProjectRevenueBill>
    <!--支出确认-->
    <ProjectExpenditureBill v-if="tabIndex==4" :projectCode="projectCode" :bidId="bidId" :stateId="stateId"></ProjectExpenditureBill>
         <!--项目收支打印-->
    <vue-easy-print  ref="easyPrint" v-if="isShowPrint">
        <template slot-scope="func">
            <ProjectFinanceDetails :listPage="listPage" :tableRow="tableRow" :getChineseNumber="func.getChineseNumber"></ProjectFinanceDetails>
        </template>
    </vue-easy-print>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import ProjectFinanceSummary from './ProjectFinanceSummary'
  import ProjectExpenditureBill from './ProjectExpenditureBill'
  import ProjectRevenueBill from './ProjectRevenueBill'
  import ProjectFinanceCheckBill from './ProjectFinanceCheckBill'
  import vueEasyPrint from "vue-easy-print";
  import ProjectFinancePrint from "./ProjectFinancePrint"
  import ProjectFinanceDetails from './ProjectFinanceDetails'
  export default {
    components:{
      ProjectFinanceCheckBill,
      vueEasyPrint,
      ProjectFinancePrint,
      ProjectFinanceSummary,
      ProjectExpenditureBill,
      ProjectRevenueBill,
      ProjectFinanceDetails
    },
    props: {
      form:Object,
    },
    watch: {
      form: function (value) {
        this.form = value
        this.stateId = value.stateId
      }
    },
    data () {
      const bidId = this.$route.query.id
      const projectCode = this.$route.query.projectCode
      return {
        isShowPrint:false,
        listLoading:false,
        tableRow:0,
        listPage:null,
        query: {
          pageSize: 10,
          pageNum: 1,
          bidId: bidId,
          searchStr: "",
          applyDate: ""
        },
        projectCode:projectCode,
        bidId: bidId,
        stateId:[],
        tabIndex: 0,
        //'项目收支表',
        tabItem:['项目收支表','收支明细表','应收账单','已收账单','支出账单']
      }
    },
    mounted () {
      this.bidId = query.id
      this.projectCode = query.projectCode;
      this.loadData()
    },
    methods: {
      /**
     * 加载
     */
      loadData() {
        this.listLoading = true;
        const params = {
          projectCode : this.projectCode,
          bidId : this.bidId
        }
        Api.getProjectBalanceTotal(params).then(res => {
          
          if (res) {

            this.listPage = res;
            if(res.receivable.length>res.expenditure.length){
               this.tableRow = res.receivable.length
            }else{
               this.tableRow = res.expenditure.length
            }
          }
          this.listLoading = false;
        });
        this.listLoading = false;
      },
      printTable(){
        this.isShowPrint = true;
        this.$nextTick(()=>{
           this.$refs.easyPrint.print()
         })
      },
      changeTabData (index) {
        this.tabIndex = index
       
      },
      
    }
  }
</script>
