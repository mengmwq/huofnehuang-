<template>
  <div>
    <div class="searchBar mb10">
        <el-checkbox-group v-model="searchForm.approvalStateList" @change="search" v-if="curTab==='已审批' || curTab==='我发起'">
            <!-- <el-checkbox label="0" v-if="curTab==='我发起'">审批中</el-checkbox>
            <el-checkbox label="1">已驳回</el-checkbox>
            <el-checkbox label="2">已通过</el-checkbox> -->
            <template v-for="(item, index) in approvalNodeState">
               <template v-if="curTab==='已审批'">
                 <el-checkbox :label="item.value" :key="index" v-if="item.cnInfo!=='审批中'">{{item.cnInfo}}</el-checkbox>
               </template>
               <template v-if="curTab==='我发起'">
                 <el-checkbox :label="item.value" :key="index" >{{item.cnInfo}}</el-checkbox>
               </template>
            </template>
            </el-checkbox-group>
            <el-input
            v-model="searchForm.param"
            size="small"
            clearable
            @keyup.enter.native="search"
            prefix-icon="el-icon-search"
            placeholder="请输入申请标题关键词"
            style="width:180px"
            class="ml10"
            :maxlength="32"
            ></el-input>
            <el-button type="primary" @click="search" size="small" class="ml10">查询</el-button>
        </div>
     <el-table
        class="page-table"
        v-if="tableStatus"
        :data="approvalPage && approvalPage.records"
        stripe
        highlight-current-row
        v-loading="listLoading"
        :cell-style="{color:'#333'}">

        <template v-for="(header, index) in tableHeader">
          <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :min-width="header.width"

          :column-key="header.prop"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="header.prop == 'name'">
               <a href="javascript:;" @click="showApprovalDetails(scope.row)">{{scope.row.name}}</a>
            </div>
            <div v-else-if="header.prop == 'progress'">
                <a href="javascript:;"  @click="showApprovalProgress(scope.row)" :class="getStyle(scope.row.states)">{{scope.row.progress}}</a>
            </div>

            <div v-else-if="header.prop == 'schedule'">
                <a href="javascript:;" @click="showApprovalProgress(scope.row)" :class="getStyle(scope.row.states)">{{scope.row.schedule}}</a>
            </div>
            <div v-else-if="header.prop == 'summary'" class="summary">
               <!--付款审批-->
               <template v-if="$route.path==='/router/paymentApplication'">
                <p>项目名称：{{getProjectName(scope.row,'targetInformation')}}</p>
                <p>客户名称：{{getCustomerName(scope.row,'targetInformation')}}</p>
                <p>供应商：{{getCustomName(scope.row,'targetInformation')}}</p>
                <p>付款金额：{{scope.row.amount}}</p>
              </template>
              <!--发票审批-->
            	<template v-if="$route.path==='/router/invoicesApplication'">
                <p>项目名称：{{getProjectName(scope.row,'receiveMoneys')}}</p>
                <p>客户名称：{{getCustomerName(scope.row,'receiveMoneys')}}</p>
                <p>发票类型：{{scope.row.amount}}</p>
                <p>开票金额：{{scope.row.amount}}</p>
              </template>
              <!--借款审批-->
              <template v-if="$route.path==='/router/borrowApplication'">
                <p>项目名称：{{getProjectName(scope.row,'loanApplys')}}</p>
                <p>客户名称：{{getCustomerName(scope.row,'loanApplys')}}</p>
                <p>申请部门：{{getCustomerName(scope.row,'loanApplys','orgName')}}</p>
                <p>申请金额：{{scope.row.amount}}</p>
              </template>
              <!--报销审批-->
               <template v-if="$route.path==='/router/reimburseApplication'">
                <p>项目名称：{{getProjectName(scope.row,'reimbursementApplys')}}</p>
                <p>客户名称：{{getCustomerName(scope.row,'reimbursementApplys')}}</p>
                <p>申请金额：{{scope.row.amount}}</p>
              </template>
              <!--差旅报销审批-->
               <template v-if="$route.path==='/router/travelApplication'">
                <p>项目名称：{{getProjectName(scope.row,'travelApplys')}}</p>
                <p>客户名称：{{getCustomerName(scope.row,'travelApplys')}}</p>
                <p>出差事由：{{getCustomerName(scope.row,'travelApplys','reason')}}</p>
                <p>总金额：{{scope.row.amount}}</p>
              </template>
              <!--行政支出审批-->
               <template v-if="$route.path==='/router/expenditureApplication'">
                <p>行政事项：{{getCustomerName(scope.row,'payingAdministrations','content')}}</p>
                <p v-if="getCustomerName(scope.row,'payingAdministrations','contractCode')">合同号：{{getCustomerName(scope.row,'payingAdministrations','contractCode')}}</p>
                <p>供应商：{{getCustomerName(scope.row,'payingAdministrations','customName')}}</p>
                <p>费用总额：{{scope.row.amount}}</p>
              </template>
              <!--合同-->
              <template v-if="$route.path==='/router/contractApproval'">
              <p>项目名称：{{scope.row.projectName}}</p>
                <p>合同名称：{{scope.row.contractName}}</p>
                <!-- <p v-if="scope.row.contractInfos.length>0">合同名称：{{scope.row.contractInfos[0].contractName}}</p> -->
                <p v-if="scope.row.contractTitle">标题：{{scope.row.contractTitle}}</p>
                <p>对方单位：{{scope.row.customerName}}</p>
                <!-- <p v-if="scope.row.contractInfos.length>0">对方单位：{{scope.row.contractInfos[0].company1Name}}</p> -->
              </template>
              <!--投标-->
              <template v-if="$route.path==='/router/bidApproval'">
              <p>项目名称：{{scope.row.projectName}}</p>
                <p v-if="scope.row.customerName">客户名称：{{scope.row.customerName}}</p>
                <p>招标方式：{{scope.row.bidType}}</p>
                <p>开标时间：{{scope.row.bidOpeningDate}}</p>
                <p>开标地址：{{scope.row.bidOpeningSite}}</p>
              </template>
              <!--报价-->
               <template v-if="$route.path==='/router/offerApproval'">
               <p>项目名称：{{scope.row.projectName}}</p>
                <p>报价编号：{{scope.row.offerCode}}</p>
                <p>报价金额：{{scope.row.amount}}</p>
                <p>成本/利润：{{scope.row.offerAmount}}</p>
              </template>
              <!--报关-->
               <template v-if="$route.path==='/router/customsApproval'">
               <p>项目名称：{{scope.row.projectName}}</p>
                <p>报关编号：{{scope.row.customssNo}}</p>
                <p>费用总额：{{scope.row.amount}}</p>
              </template>
              <!--操作库： 物料库与工具库-->
               <template v-if="$route.path==='/router/materialApplication' || $route.path==='/router/toolsApplication'">
                <p>品名：{{scope.row.goodsName}}</p>
                <p>规格：{{scope.row.specifications}}</p>
                <p>总价：{{scope.row.amount}}</p>
              </template>
              <!--车辆:油卡申请  与 过路费 ETC -->
               <template v-if="$route.path==='/router/oilCardApplication' || $route.path==='/router/etcApplication'">
               <p>项目名称：{{scope.row.projectName}}</p>
               <p>车牌号：{{scope.row.registrationNumber}}</p>
                <p>费用金额：{{scope.row.amount}}</p>
                <p>本次公里数：{{scope.row.kilometres}}</p>
              </template>

              <!--车辆:维修保养-->
               <template v-if="$route.path==='/router/maintainApplication'">
                <p>车牌号：{{scope.row.registrationNumber}}</p>
                <p>费用金额：{{scope.row.amount}}</p>
                <p>当事人：{{scope.row.party}}</p>
              </template>
              <!--车辆:出险记录-->
               <template v-if="$route.path==='/router/insuranceApplication'">
               <p>项目名称：{{scope.row.projectName}}</p>
               <p>车牌号：{{scope.row.registrationNumber}}</p>
                <p>驾驶员：{{scope.row.accidentRdName}}</p>
                <p>费用金额：{{scope.row.amount}}</p>
                <p>事故时间：{{scope.row.accidentDatetime}}</p>
              </template>
            </div>
            <div v-else-if="header.prop == 'createDt'">
            	 {{getFormatTime(scope.row.createDt)}}
            </div>
            <div v-else-if="header.prop == 'updateDt'">
            	 {{getFormatTime(scope.row.updateDt)}}
            </div>
            <div v-else-if="header.prop == 'states'">
              <template v-if="scope.row.attached">
                <span :class="{'text-danger':scope.row.states==='0','text-success':scope.row.states==='1'}">{{scope.row.attached.ApprovalApplyState[scope.row.states].cnInfo}}</span>
              </template>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        </template>
        <el-table-column label="操作" v-if="curTab==='我发起' || curTab==='待审批'" width="100" fixed="right">
          <template slot-scope="scope" style="background:#fff">
           <el-button type="primary" size="mini" v-if="curTab==='待审批'" @click="showApprovalDetails(scope.row)">审批</el-button>
           <template v-if="curTab==='我发起'">
             <el-button type="primary" size="mini" v-if="scope.row.states==='3'" @click="cancleApproval(scope.row)">撤回</el-button>
             <!-- <el-button type="primary" size="mini" v-if="scope.row.states==='0'" @click="sumbitApproval(scope.row)">提交申请</el-button> -->
           </template>
          </template>
        </el-table-column>

      </el-table>
    <el-row type="flex" class="page-box">
      <!-- 这里这个文件就是待审批的 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        :total="approvalPage ? approvalPage.total : 0"
        @current-change="handleCurrentChange"
        layout="total,sizes, ->,prev, pager, next"
        :page-sizes="[10, 25, 50]"
        :page-size="searchForm.pageSize"
        :current-page="approvalPage ? approvalPage.pageNum : 1"
      ></el-pagination>
    </el-row>
    <ApprovalProgress v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" @closeDialog="closeDialog" @dataChange="dataChange"></ApprovalProgress>
  </div>
</template>
<script>
import Api from '@/api/index'
import Util from '@/utils/'
import {Format} from '@/utils/TimeFormat'
import ApprovalProgress from './ApprovalProgress'
export default {
  components: {
    ApprovalProgress
  },
  computed: {
     approvalNodeState(){
        return this.$store.state.dictionary.dists.ApprovalNodeState.children;
     },
  },
  props: {
    curTab: {
      type: String
    },
    tableHeader: {
      type: Array
    },
    approvalProcessInfo:{
      type:Object
    },
  },
  watch: {
    'curTab': function () {
      this.searchForm.approvalStateList = []
    }
  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    //处理审批类型
    //付款申请
    const approvalType = this.getApprovalTypeByRouter()
    //是否显示项目名称
    //const isShowProjectName = this.isShowProjectCol()
    return {
      //isShowProjectName:isShowProjectName,
      isShowDialog: false,
      userInfo: userInfo,
      contacterId: '',
      listLoading: false,
      sels: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        approvalType:approvalType,
        //approvalState:'1',  //  '1' 已审批 ，‘2’待审批
        param: '', //申请名称或提报人姓名
        //positionId:"f9acc921-a99d-40a5-acc9-21a99d40a53c",  //岗位ID,?
        state:3,   //审批状态
        approvalStateList:[],
      },
      tableStatus: true,
      approvalPage:{
         total:0,
         records:[]
      }

    }
  },
  mounted () {
    //this.search()
  },

  methods: {
    //是否显示项目名称
    isShowProjectCol(){
      //不显示项目名称审批申请
      const routes = [
        '/router/maintainApplication',
        '/router/materialApplication',
        '/router/toolsApplication',
        ]
      const path = this.$route.path
      //有不显示的
      const isHas = routes.some(item => item === path)
      return !isHas
    },
    //通过路由获取审批类型
    getApprovalTypeByRouter(){
      const typeArr = [{
        label: '合同审批',
        value: '001',
        path:'/router/contractApproval'
      }, {
        label: '报价审批',
        value: '002',
        path:'/router/offerApproval'
      },{
        label: '投标审批',
        value: '003',
        path:'/router/bidApproval'
      },{
        label: '发票审批',
        value: '004',
        path:'/router/invoicesApplication'
      },{
        label: '付款审批',
        value: '005',
        path:'/router/paymentApplication'
      },{
        label: '借款审批',
        value: '006',
        path:'/router/borrowApplication'
      },{
        label: '差旅报销审批',
        value: '007',
        path:'/router/travelApplication'
      },{
        label: '报销审批',
        value: '008',
        path:'/router/reimburseApplication'
      },{
        label: '投标审批',
        value: '006',
        path:'/router/bidBookApplication'
      },{
        label: '合同审批',
        value: '007',
        path:'/router/travelApplication'
      },{
        label: '车辆审批',
        value: '008',
        path:'/router/vehicleApplication'
      },{
        label: '异常审批',
        value: '009',
        path:'/router/abnormalApplication'
      },{
        label: '物料消耗审批',
        value: '010',
        path:'/router/materialApplication'
      },{
        label: '工具消耗审批',
        value: '011',
        path:'/router/toolsApplication'
      },{
        label: '航材报关审批',
        value: '012',
        path:'/router/customsApproval'
      },{
        label: '标书审批',
        value: '013',
        path:'/router/bidApplication'
      },{
        label: '行政审批',
        value: '014',
        path:'/router/expenditureApplication'
      },
      {
        label: '车辆保养审批',
        value: '015',
        path:'/router/maintainApplication'
      },
      {
        label: '出险记录审批',
        value: '016',
        path:'/router/insuranceApplication'
      },
      {
        label: '加油费用审批',
        value: '017',
        path:'/router/oilCardApplication'
      },{
        label: 'ETC费用审批',
        value: '018',
        path:'/router/etcApplication'
      }]
      let type = ''
      typeArr.map(item=>{
        if(item.path===this.$route.path){
            type = item.value
            return
        }
      })
      console.log('getApprovalTypeByRouter',type)
      return type
    },
    //获取客户名称
    getCustomerName(row,attr,attrName='customerName'){
      if(row[attr]){
        const customerName =  row[attr].map(item=>item[attrName])
        if(customerName){
          const newCustomerName = this.uniqueArr(customerName)
          return newCustomerName.toString()
        }
      }
      return ''
    },
    getCustomName(row,attr,attrName='applyName'){
      if(row[attr]){
        const customerName =  row[attr].map(item=>item[attrName])
        if(customerName){
          const newCustomerName = this.uniqueArr(customerName)
          return newCustomerName.toString()
        }
      }
      return ''
    },
    //数组去重
    uniqueArr (arr) {
      return Array.from(new Set(arr))
    },
    //获取项目名称
    getProjectName(row,attr){
      if(row[attr]){
        const projects =  row[attr].map(item=>item.projectName)
        if(projects){
          const newProjects = this.uniqueArr(projects)
          return newProjects.toString()
        }
      }
      return ''
    },
    // 显示审批进度
    showApprovalProgress (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.isShowDialog = true
    },
    closeDialog () {
      this.isShowDialog = false
    },
    // 撤回审批
    cancleApproval (row) {
      console.log(row)
      const nameStr = row.name
      this.$prompt('请输入理由', `撤回审批申请【${nameStr}】`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '最大长度200个字符！',
        inputPattern: /^.{2,200}$/,
        inputErrorMessage: '最大长度200个字符！'
      }).then(({ value }) => {
        console.log(value)
          // 输入修改原因；
        const params = {
          id:row.id,
          states: 4, //已撤回
          withdrawalReasons: value
        }
        Api.changeState(params).then((res) => {
          this.search()
          this.$message({showClose: true, message: `审批申请【${nameStr}】撤回成功`, type: 'success'})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
     // 提交审批
    sumbitApproval (row) {
      console.log(row)
      const nameStr = row.name
      this.$confirm(`您确定要再次提交【${nameStr}】审批申请吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          // 输入修改原因；
        const params = {
          id:row.id
        }
        Api.resubmitApproval(params).then((res) => {
         this.search()
          this.$message({showClose: true, message: `申请【${nameStr}】提交成功`, type: 'success'})
        })
        })

    },
    getStyle (status) {
        // 0：拒绝 1：批准 2：审批中 3:撤回
      if (status === '1') {
        return {'text-success': true}
      } else if (status === '0') {
        return {'text-danger': true}
      }else{
        return {'text-info':true}
      }
    },
    // 审批详情页面
    showApprovalDetails (row) {
      const curPath = this.$route.path
      let currentNodeId = row.currentNode
      let id =row.id
      let path ='';
      const approvalStatus= this.curTab==='待审批'?'pendingApproval':''
      if(curPath ==='/router/customerVisits'){
          //客户走访
          path = 'customerVisitsDetails'
      }else if(curPath ==='/router/marketDevelopment'){
          //客户走访
          path = 'marketDevelopmentDetails'
      }else if(curPath ==='/router/paymentApplication'){
          //付款审批详情
          path = 'paymentApprovalDetails'
      }else if(curPath ==='/router/invoicesApplication'){
          //发票审批详情
          path = 'invoiceApprovalDetails'

      }else if(curPath ==='/router/borrowApplication'){
          //借款审批详情
          path = 'borrowApprovalDetails'

      }else if(curPath ==='/router/reimburseApplication'){
          //报销
          path = 'reimburseApprovalDetails'

      }else if(curPath ==='/router/travelApplication'){
          //差旅
          path = 'travelApprovalDetails'
      }else if(curPath ==='/router/oilCardApplication'){
          //油卡
          path = 'oilCardApprovalDetails'
      }else if(curPath ==='/router/etcApplication'){
          //过路费ETC
          path = 'etcApprovalDetails'
      }else if(curPath ==='/router/insuranceApplication'){
          //出险记录
          path = 'insuranceRecordApprovalDetails'
      }else if(curPath ==='/router/maintainApplication'){
          //维修保养
          path = 'maintainApprovalDetails'
      }else if(curPath ==='/router/contractApproval'){
          //业务合同
          path = 'contractApprovalDetails'
          id = row.targetId
      }else if(curPath ==='/router/bidApproval'){
          //投标
          path = 'bidApprovalDetails'
          id = row.targetId
      }else if(curPath ==='/router/offerApproval'){
          //报价
          path = 'offerApprovalDetails'
          //id = row.targetId
      }else if(curPath ==='/router/customsApproval'){
          //报关
          path = 'customsApprovalDetails'
          id = row.targetId
      }else if(curPath ==='/router/materialApplication'){
          //物料库
          path = 'materialApprovalDetails'
      }else if(curPath ==='/router/toolsApplication'){
          //物料库
          path = 'toolsApprovalDetails'
      }else if(curPath ==='/router/expenditureApplication'){
          //物料库
          path = 'expenditureApprovalDetails'
      }

      this.$router.push({
        path: path,
        query: {
          id: id,
          currentNodeId: currentNodeId,
          approvalStatus:approvalStatus,
        }
      })
    },
    dataChange () {
      this.closeDialog()
      this.search()
    },

    getFormatTime (time, format = 'yyyy-MM-dd hh:mm:ss') {
      return time ? Format(time, format) : ''
    },
    /** 处理拓展行 */
    handleExpandChange (row, expandedRows) {
      let params = this.searchFormVersion
      params.templateId = row.id,
          params.type = row.type,

        this.listLoading = true
      Api.getYXContractTemplateHistoryList(params).then(res => {
        this.listLoading = false
        row.children = res
          // row.templateVersionPage = res;
      })
    },

    /**
     * 过滤器POST 到后台一个【map】进行查询 key：String val：list[1,2]
     */
    handleFilterChange (filter) {
      var FilterObject = Object.values(filter)[0]
      if (!this.searchForm.filterMap) {
        this.searchForm.filterMap = {}
      }
      var mapkey = Object.keys(filter)[0]
      if (FilterObject.length > 0) {
        // 【写入Map】key：mapkey  val：FilterObject;
        this.searchForm.filterMap[mapkey] = FilterObject
      } else {
        // 【Map删除】mapkey;
        delete this.searchForm.filterMap[mapkey]
      }
      console.log(this.searchForm.filterMap)
      this.search()
    },
    /**
     * 获取字典名称
     */
    getDictsKeyName (row, key, val) {
      return Util.getDictsKeyName(row, key, val)
    },
    /***
     * 表头切换
     */
    columnChange (data) {
      console.log('++++++++++++++++++【表头切换】触发++++++++++++++++++++++++')
      this.tableHeader = data
    },
    /**
     * 表头拖拽状态改变
     */
    tableStatusChange (val) {
      console.log(
        '++++++++++++++++++【表头拖拽状态改变】触发++++++++++++++++++++++++'
      )
      this.tableStatus = val
    },
    /**
     * 表格改变
     */
    dataChange () {
      this.getApprovalProductPage()
      this.closeDialog()
    },
    refresh () {
      this.search()
    },

    // 处理我发起的与其他审批区分开
    handleSearch (params) {
      const curTab = this.curTab
      console.log(curTab,'handleSearch')
      if (curTab === '我发起') {
        delete params.state
        delete params.operationType
        this.approvalAboutMePage(params)
      } else if(curTab ==='抄送我') {
        delete params.state
        //查询条件默认值
        params.approvalStateList=[]
        params.operationType="3"
        this.approvalAboutMePage(params)
      }else if(curTab ==='待审批') {
        params.approvalStateList=[]
        params.state= 3
        //params.positionId= "f9acc921-a99d-40a5-acc9-21a99d40a53c"
        delete params.operationType
        this.unApprovalPage(params)
      }else if(curTab ==='已审批') {
        delete params.operationType
        params.state= 1
        //params.positionId= "f9acc921-a99d-40a5-acc9-21a99d40a53c"
        this.unApprovalPage(params)
      }


    },
    //待审批，已审批
    unApprovalPage(params){

      this.listLoading = true
      Api.approvalPageList(params).then((res) => {
        if (res) {
          this.approvalPage = res
        }
      })
      this.listLoading = false
    },
    //我发起的，抄送我的
    approvalAboutMePage(params){
      this.listLoading = true
      Api.approvalAboutMePage(params).then((res) => {
        if (res) {
          this.approvalPage = res
        }
      })
      this.listLoading = false
    },
    // 查询
    search () {
      let params = this.searchForm
      params.pageNum = 1
      this.handleSearch(params)
    },

    selsChange (sels) {
      this.sels = sels
    },
    getApprovalProductPage () {
      let params = this.searchForm
      this.handleSearch(params)
    },
    handleSizeChange (val) {
      let params = this.searchForm
      params.pageSize = val
      this.handleSearch(params)
    },
    handleCurrentChange (val) {
      let params = this.searchForm
      params.pageNum = val
      this.handleSearch(params)
    },

    /**
     * 显示编辑界面
     */
    handleEdit (index, row) {
      this.editForm = Object.assign({}, row)
      this.$router.push({
        path: '/router/roleedit',
        query: { roleID: this.editForm.id }
      })
    },
    columnChange (data) {
      this.tableHeader = data
    },

    // 表格排序变化
    sortChange ({ column, prop, order }) {
      if (order) {
        var s = order.substring(0, 1)
        var sOrder = 'asc'
        if (s == 'd') {
          sOrder = 'desc'
        }
        this.searchForm.sort = prop + ' ' + sOrder
        this.searchForm.pageNumber = 1
        console.log(
          '++++++++++++++++++【表格排序变化】触发++++++++++++++++++++++++'
        )
        this.search()
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.searchBar{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.summary{
  p {
    padding:0;
    margin:0;
  }
}

</style>
