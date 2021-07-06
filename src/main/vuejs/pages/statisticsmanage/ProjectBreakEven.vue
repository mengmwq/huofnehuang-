<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-date-picker
          v-model="query.startDate"
          style="width:240px;"
          type="date"
           clearable
          format='yyyy-MM-dd'
          value-format ="yyyy-MM-dd"
          size="medium"
          placeholder="起始年月日">
        </el-date-picker>
        <label for="">至</label>
        <el-date-picker
          v-model="query.endDate"
           style="width:240px;"
           clearable
          type="date"
          format='yyyy-MM-dd'
          value-format ="yyyy-MM-dd"
          size="medium"
          placeholder="截止年月日">
        </el-date-picker>
         <!-- <el-select  v-model="query.orgName" placeholder="请选择分公司" size="medium" style="width: 200px;">
                    <el-option :value="orgId" :label="orgName" style="height: 300px;overflow-y: scroll;padding: 0">
                      <el-tree
                        :data="treeData"
                        show-checkbox
                        default-expand-all
                        node-key="orgId"
                        ref="orgTree"
                        :props="{label: 'orgName', children: 'childrens'}"
                        :default-expanded-keys="expandedKeys"
                        :default-checked-keys="checkedKeys"
                        :check-strictly="true"
                        @check-change="handleClick"
                        @node-click="nodeClick">
                      </el-tree>
                    </el-option>
                  </el-select> -->
       <el-select v-model="query.orgId" filterable clearable placeholder="选择分公司" size="medium" @change="loadData(null)">
            <el-option v-for="item in companyList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
          </el-select>
          <el-select v-model="query.customerName" filterable clearable placeholder="选择客户" size="medium" style="width:220px" @keyup.native="customerChange($event)">
            <el-option v-for="(item,index) in customerList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        <el-select v-model="query.status" clearable placeholder="项目状态" size="medium" style="width:120px" @change="loadData(null)">
            <el-option v-for="item in projectStateList" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input size="medium"  clearable placeholder="请输入项目负责人名称" icon="search" v-model="query.projectName" @keyup.enter.native="loadData" style="width: 200px;"></el-input> -->
        <el-input size="medium"  clearable placeholder="项目名称/编号" icon="search" v-model="query.projectName" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" v-if="tableStatus" show-summary :data="listPage?listPage.result:[]" :summary-method="getSummaries"  @sort-change="sortChange" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <template v-for="(header, index) in tableHeader" >
        <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
           <div v-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
            <div v-else-if="header.prop == 'projectCode'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
            </div>
          <div v-else-if="header.prop == 'establishedTime'">
            {{scope.row.establishedTime | DateFormat}}
          </div>
          <div v-else-if="header.prop == 'totalIncome'">
            {{getNumberFormat(scope.row.totalIncome)}}
          </div>
          <div v-else-if="header.prop == 'totalExpenditure'">
            {{getNumberFormat(scope.row.totalExpenditure)}}
          </div>
          <div v-else-if="header.prop == 'totalGrossProfit'">
            {{getNumberFormat(scope.row.totalGrossProfit)}}
          </div>
          <div v-else-if="header.prop == 'grossProfit'">
            {{scope.row.totalIncome ? parseFloat((scope.row.totalGrossProfit/scope.row.totalIncome)*100).toFixed(2) : 0}}%
          </div>
          <div v-else-if="header.prop == 'status'">
            {{getDictsKeyName(scope.row,'PROJECT_TYPE',scope.row.status)}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      </template>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
        <el-button type="primary" v-showBtn data-authorityType="bill-btn" size="small" @click="showBill(scope.row)">收支表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button> -->
    </el-row>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import Util from '@/utils/'
  export default {
    name:'ProjectBreakEven',
    computed:{
        projectStateList(){
           return this.$store.state.dictionary.dists.PROJECT_TYPE.children;
        },
    },
    
    data () {
      const oDate = new Date()
      const curYear = oDate.getFullYear()
      return {
        listLoading:false,
        amountOption:['totalIncome','totalExpenditure','totalGrossProfit'],
        timeRange: '',
        tableStatus:true,
        editForm: {},
        orgName: '',
        orgId: '',
        treeData: [],
        expandedKeys: [],
        checkedKeys: [],
        companyList:[],
        query: {
          pageSize: 10,
          pageNum: 1,
          sort:'',
          year :new Date(),
          customerName: "",
          orgId: "",
          projectName: "",
          sort: "",
          status: "045",
        },
        tableHeader: [ {
          prop: 'orgName',
          label: '分公司',
          align: 'left',
          width:'120',
           sortable:false,
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
           sortable:false,
            align: 'left',
          width:'150',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
           sortable:false,
          align: 'left',
          width:'150',
          show: true
        }, {
          prop: 'customerName',
          label: '客户名称',
          align: 'left',
           sortable:false,
          show: true
        },
        // {
        //   prop: 'pieceMode',
        //   align: 'left',
        //   label: '负责人',
        //    sortable:false,
        //   width: '100',
        //   show: true
        // }, 
        {
          prop: 'contractCode',
          align: 'left',
          label: '合同编号',
           sortable:false,
          width: '100',
          show: true
        }, {
          prop: 'establishedTime',
          align: 'left',
          label: '立项日期',
           sortable:false,
          width: '100',
          show: true
        }, {
          prop: 'totalIncome',
          align: 'right',
          label: '收入(元)',
          sortable:'custom',
          width: '100',
          show: true
        }, {
          prop: 'totalExpenditure',
          align: 'right',
          label: '支出(元)',
         sortable:'custom',
          width: '100',
          show: true
        }, {
          prop: 'totalGrossProfit',
          align: 'right',
          label: '毛利(元)',
         sortable:'custom',
          width: '100',
          show: true
        }, {
          prop: 'grossProfit',
          align: 'right',
          label: '利润率',
         sortable:'custom',
          width: '100',
          show: true
        }, 
        /**{
          prop: 'status',
          align: 'left',
          label: '状态',
          width: '70',
          show: true
        }, */
        ],
        /** 表格数据 */
        listPage:null,
        // listData: [{
        //   projectName:'第一个项目'
        // }],
        tableSumTotal:null,
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        customerList:[],
      }
    },
    mounted () {
      
      //this.getTreeFormOrgInfo()
      //分公司
      this.getCompanyfo()
      this.getcustomerList()
      const query = this.$route.query
      if(query.year && query.orgId){
          this.curYear = Date.parse(query.year)
          this.checkedKeys = [query.orgId]
          this.query.orgId = query.orgId
          this.query.orgName = query.orgName
      }
      this.loadData()
     
    },
    methods: {
      getCompanyfo(){
        Api.getCompanyfo().then(res=>{
            this.companyList = res
        })
      },
      getDictsKeyName(row,key,value){
        return Util.getDictsKeyName(row,key,value)
      },
      getNumberFormat(val){
        return val?Util.numberFormat(val):'0'
      },
      // 组织机构
      getTreeFormOrgInfo(){
        Api.getTreeFormOrgInfo().then(data => {
          this.treeData = data
        })
      },
      customerChange(e){
        console.log(e,'sss')
        this.getcustomerList(e.target.value)
      },
      getcustomerList(name=''){
        const params = {
          "delFlg": "",
          "name": name,
          "orgId": this.orgId,
          "pageNum": 1,
          "pageSize": 10,
        }
        Api.customerList(params).then(res=>{
           
            this.customerList = res.records
        })
      },
    //item在arr数组中
  inArray(item,arr){
     for(var i=0;i<arr.length;i++){
        if(item == arr[i]){
          return true;
        }
     }
     return false;
  },
  inObject(item,json){
     for(var key in json){
        if(item == key){
          return true;
        }
     }
     return false;
  },
  getSummaryStatistics(){
  	  console.log('444444444','sss')
      const params = this.query
      console.log('55555555555','sss')
      Api.getSummaryStatistics(params).then(res=>{
      console.log('666666666','sss')
         this.tableSumTotal = res
      })
    },
      //表格合计
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				if (this.inObject(column.property, this.tableSumTotal)) {
					if (this.inArray(column.property, this.amountOption)) {
						sums[index] = this.getNumberFormat(this.tableSumTotal[column.property]);
					} else {
						sums[index] = parseFloat(this.tableSumTotal[column.property]).toFixed(2);
					}
				} else {
					sums[index] = '';
				}
			});

			return sums;
		},
      handleClick(data, checked, node){
        if(checked == true){
          this.query.orgId = data.orgId;
          this.query.orgName = data.orgName;
          this.orgId = data.orgId;
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        } else {
          this.orgId = ''
          this.orgName = ''
          this.query.orgId = ''
        }
      },
      nodeClick(data, checked, node){
        if (checked) {
          this.query.orgId = data.orgId
          this.query.orgName = data.orgName
          this.orgId = data.orgId
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        } else {
          this.orgId = ''
          this.orgName = ''
          this.query.orgId = ''
        }

      },
      //查看项目明细
      showDetails(row){
         this.$router.push({
            path:'/router/projectBreakEvenDetails',
            query:{
              projectCode:row.projectCode
            },
         })
      },
      //查看项目明细
      showBill(row){
         this.$router.push({
            path:'/router/myProjectFinanceDetails',
            query:{
              id:row.projectCode,
              from: JSON.stringify(row)
            },
         })
      },
      /**
       * 加载
       */
      loadData (pageNum=1) {
        if(typeof pageNum ==='object'){
           this.query.pageNum =1
        }else{
           this.query.pageNum = pageNum
        }
        this.listLoading = true
        Api.pageBudgetStatistics(this.query).then(data => {
          console.log('11111111','sss')
          this.listPage = data;
          console.log('222222222','sss')
          this.total = data.totalCount
          console.log('3333333333','sss')
          this.listLoading = false
        })
        this.getSummaryStatistics()
      },

      //表格排序变化
    sortChange({ column, prop, order }) {
      if (order) {
        this.tableStatus = false
        var s = order.substring(0, 1);
        var sOrder = "asc";
        if (s == "d") {
          sOrder = "desc";
        }
        this.query.sort = prop + " " + sOrder;
        this.query.pageNumber = 1;
       console.log('7777777777','sss')
        this.loadData();
        this.tableStatus = true
      }
    },


      addAerialMaterial () {
        this.$router.push({path: '/router/AddAerialMaterial'})
      },
      columnChange: function(data) {
        this.tableHeader = data;
      },
      tableStatusChange(val) {
        this.tableStatus = val;
      },
      formartDate(value) {
        let times = '';
        if (value) {
          times = moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return times;
      },
      canSelected(row, index) {
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){
          return 0;
        } else{
          return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.keyword = '';
        this.query.pageNum = 1;
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
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
                a.download = '航材报关列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      },
    }
  }
</script>

