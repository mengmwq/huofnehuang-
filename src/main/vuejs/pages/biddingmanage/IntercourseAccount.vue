<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="14">
         <el-button type="primary" size="medium" v-for="(item,index) in applyList" :key="index" @click="apply(item)">{{item.name}}</el-button>
      </el-col>
      <el-col :span="10" class="text-right">
        <el-input size="medium" clearable placeholder="项目编号" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
        <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
           <div v-if="header.prop == 'applyDate'">
             {{scope.row.applyDate | DateFormat}}
           </div>
           <div v-else-if="header.prop == 'projectCode'">
                <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
           </div>
           <div v-else-if="header.prop === 'contractCode'">
           <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractId, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
           <div v-else-if="header.prop == 'contractState'">
             {{scope.row.contractState | contractStateFilter}}
           </div>
            <div v-else-if="header.prop == 'type'">
              {{scope.row.type | approvalTargetTypeFilter}}
            </div>
           <div v-else-if="header.prop == 'amount'">{{scope.row.amount}}</div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
  </div>
</template>


<script>
  import * as filters from '../../filters/filter'
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    
    data () {

      return {
        dialogVisible: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          contractTargetId: '',
          contractTargetType: ''
        },
        applyList:[
          {
            name:'发票申请',
            path:'/router/addInvoiceApply',
          },
          {
            name:'付款申请',
            path:'/router/addPaymentApply',
          },
          {
            name:'借款申请',
            path:'/router/addBorrowApply',
          },
          {
            name:'报销申请',
            path:'/router/addReimburseApply',
          },
          {
            name:'差旅报销申请',
            path:'/router/addTravelApply',
          },
          {
          	name:'行政支出申请',
          	path:'/router/administrationApply'
          }
        ],
        tableHeader: [{
          prop: 'id',
          align: 'center',
          label: '申请编号',
          width:'130',
          show: true
        }, {
          prop: 'operationName',
          align: 'center',
          label: '经办人',
          show: true
        }, {
          prop: 'contractCode',
          align: 'center',
          label: '合同编号',
          width:'130',
          show: true
        }, {
          prop: 'orgName',
          align: 'center',
          label: '所属部门',
          show: true
        }, {
          prop: 'amount',
          align: 'center',
          label: '金额',
          show: true
        }, {
          prop: 'applyName',
          align: 'center',
          label: '费用流向',
          show: true
        },{
          prop: 'operationName',
          align: 'center',
          label: '申请人',
          show: true
        }, {
          prop: 'applyDate',
          align: 'center',
          label: '申请日期',
          show: true
        }, {
          prop: 'type',
          align: 'center',
          label: '申请类型',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        projectCode:'',
        id:'',
        tag:'bid',
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false
      }
    },
    mounted () {
      const query  = this.$route.query
      this.id = query.id
      this.projectCode = query.projectCode;
      
      if(query.type==2 && !query.projectCode){
        //外工供应商 往来财务
        this.tag = 'outerWorker'
      }
      
      this.loadData()
    },
    methods: {
      /** 序号 */
      indexMethod(index){
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
      },
      //费用申请
      apply(item){
         this.$router.push({
            path:item.path,
            query:{
               projectCode:this.projectCode,
               tag:this.tag,
               bidId:this.id
            }
         })
      },
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        this.query.bidId = this.$route.query.id

        if (this.$route.path === '/router/supplierAccount') {
          this.query.contractTargetType = '001'
        } else if (this.$route.path === '/router/customerAccount') {
          this.query.contractTargetType = '002'
        } else if (this.$route.path === '/router/partnerAccount') {
          this.query.contractTargetType = '003'
        } else if (this.$route.path === '/router/outerWorkerAccount') {
          //外工供应商
          this.query.contractTargetType = '004'
        }
        Api.financialPage(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
          this.listLoading = false
        })
      },
      addBYInfo () {
        this.$router.push({path: ''})
      },
      columnChange (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.query.searchStr = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let data = this.listData
          data.forEach(function (item) {
            item.contractState = filters.contractStateFilter(item.contractState)
          })
          let param = {
            tableHead: this.tableHeader,
            data: this.listData
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '往来账务列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>

