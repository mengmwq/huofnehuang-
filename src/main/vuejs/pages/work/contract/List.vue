<template>
  <div class="mt10">
    <!-- 操作栏 -->
    <el-row :gutter="20"  v-if="flag==='list'">
      <el-col :span="10">
        <el-button type="primary" size="small" @click="newPayApply" data-authorityType="add-btn">合同申请</el-button>
        <el-button type="primary" size="small" @click="deleteItem" data-authorityType="delete-btn">删除</el-button>
      </el-col>
      <!-- <el-col :span="12" class="tar" style="display:none">
        申请日期：
        <el-date-picker
          style="width: 350px"
          @change="loadData(null)"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="searchDate"
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="付款开始时间"
          end-placeholder="付款结束时间">
        </el-date-picker>
        <el-select filterable v-model="query.payingState" @change="loadData(null)" clearable placeholder="全部状态" size="small" style="width:170px">
          <el-option v-for="item in payingStateList" :key="item.value"
            :label="item.cnInfo"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="small" clearable placeholder="请输入项目/合同编号、客户名称" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="small" @click="loadData"  class="btnTop">查询</el-button>
      </el-col> -->
    </el-row>
    <!-- table -->
    <el-table class="page-table mt10"  stripe highlight-current-row 
    :data="listData"
    :cell-style="{color:'#333'}"  
    max-height=400
    @selection-change="selsChange"
    >
     <el-table-column v-if="flag==='list'" type="selection" width="55"></el-table-column>
      <template v-for="(header, index) in tableHeader">
        <el-table-column  v-if="header.show" :key="index" 
      :prop="header.prop"  :label="header.label" :sortable="header.sortable" :fixed="header.fixed"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
           <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
           <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractCode, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
          <div v-else-if="header.prop === 'id'">
            <router-link :to="{path: '/router/paymentApplicationDetails', query: {id: scope.row.id}}">
             {{scope.row.id}}
          </router-link>
          </div>
          <div v-else-if="header.prop == 'payingStateStr'">
            {{scope.row.payingStateStr}}
          </div>
          <div v-else-if="header.prop == 'approvalStatesStr'">
            {{scope.row.approvalStatesStr}}
          </div>
          <div v-else-if="header.prop == 'approvalTime'">
            {{scope.row.approvalTime | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      </template>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <router-link v-if="flag==='list'" :to="{path: '/router/editPaymentApplication', query: {id: scope.row.id}}"  data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <router-link v-if="flag==='details'" :to="{path: '/router/paymentApplicationDetails', query: {id: scope.row.id}}"  data-authorityType="edit-btn">
            <el-button type="primary" size="mini">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="remark mt10" v-if="flag==='list'">
          <el-input v-model.trim="editForm.remark" show-word-limit :maxlength="60" placeholder="请输入备注，非必填"></el-input>
          <el-button type="primary" class="ml10"  @click="onSubmit">提交</el-button>
      </div>
      <template v-if="flag==='details'"> 
         <div v-if="editForm.remark">
           <strong>备注：</strong>
          {{editForm.remark}}
         </div>
      </template>
  </div>
</template>


<script>
  import * as filters from '@/filters/filter'
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    props:{
        flag:{
            type:String
        },
        editForm:{
          type:Object
        },
    },
    data () {
      return {
        dialogVisible: false,
        searchDate: '',
        form: {
          applyAttachmentReqs: []
        },
        query: {
          applyId:'',
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          payApplyEndTime: '',
          payApplyStartTime: '',
          payingState: '',
        },
        tableHeader: [{
          prop: 'id',
          label: '编号',
          align: 'left',
          fixed:'left',
          width:'120',
          show: true
        }, 
        {
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'150',
          show: false
        }, 
         {
          prop: 'customerName',
          align: 'left',
          label: '客户名称',
          width:'180',
          show: true
        },
        {
          prop: 'contractCode',
          label: '合同编号',
          align: 'left',
          show: false
        },
         {
          prop: 'projectName',
          label: '项目名称',
          align: 'left',
          width:'200',
          //fixed:'left',
          show: true
        },
        {
          prop: 'amount',
          align: 'left',
          label: '付款金额',
          width: '100',
          show: true
        }, 
        {
          prop: 'customName',
          label: '付款方名称',
          align: 'left',
          width:'120',
          show: true
        }, {
          prop: 'payingStateStr',
          label: '付款状态',
          align: 'left',
          show: false
        }, {
          prop: 'depositBank',
          align: 'left',
          label: '开户行',
          width: '100',
          show: true
        }, {
          prop: 'bankCode',
          label: '银行账号',
          width: '120',
          align: 'left',
          show: true
        },  {
          prop: 'orgName',
          align: 'left',
          label: '申请部门',
          width: '100',
          show: false
        }, {
          prop: 'applyName',
          align: 'left',
          label: '申请人',
          width: '100',
          show: false
        }, {
          prop: 'createDt',
          align: 'left',
          label: '申请时间',
          width: '100',
          show: true
        }, {
          prop: 'approvalName',
          align: 'left',
          label: '审批人',
          width: '100',
          show: false
        },  {
          prop: 'positionName',
          align: 'left',
          label: '审批角色',
          width: '100',
          show: false
        }, {
          prop: 'approvalStatesStr',
          align: 'left',
          label: '审批状态',
          width: '100',
          show: false
        }, {
          prop: 'approvalTime',
          align: 'left',
          label: '审批时间',
          width: '100',
          show: false
        }],
        /** 表格数据 */
        listData: [],
        sels:[],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        payingStateList: [],
      }
    },
    mounted () {
      if (sessionStorage.getItem('dists')) {
        let dists = JSON.parse(sessionStorage.getItem('dists'));
        if (dists.PayingState) {
          this.payingStateList = dists.PayingState.children
        }
      }
      this.loadData()
    },
    methods: {
      selsChange(sels) {
        this.sels = sels;
      },
      //批量删除申请
      deleteItem(){
        const selected = this.sels
        if (selected.length <= 0) {
          this.$message({
            showClose:true,
            message:`请至少选择一条申请`,
            type: 'error',
          });
          return;
        }

        let ids = selected.map(item => item.id);
        //const nameStr = selected.map(item => item.title).toString();

        this.$confirm(`确认删除编号【${ids}】的申请吗？`, '提示', {
          type: 'warning'
        }).then(() => {
          //this.listLoading = true;
          const params = {
            ids:ids
          }
          Api.deleteApplicationByIds(params).then((res) => {
            if(this.listData.length==selected.length){
                this.query.pageNum =1
            }
            this.loadData();
            this.$message({showClose:true, message:`删除申请【${ids}】成功`, type:'success'});
          });
        }).catch(() => {
          
        });
      },
      //提交申请
      onSubmit(){
        let params = this.editForm
        const sels = this.sels
        if(!params.approvalProcessId){
          this.$message({
            showClose:true,
            message:'请选择审批流程!',
            type:'error'
          })
          return;
        }
        if(sels.length==0){
          this.$message({
            showClose:true,
            message:'请选择付款申请!',
            type:'error'
          })
          return;
        }
        params.ids = sels.map(item=>item.id)
        Api.paySubmission(params).then(res=>{
           
            this.$message({
            showClose:true,
            message:'付款审批申请提交成功!',
            type:'success'
          })
          this.$emit('dataChange')
          this.loadData()
        })
      },

      /**
       * 加载付款列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        //申请总列表 ，某个审批下的申请列表 ；
        const flag = this.flag
        const fn = flag ==='details' ? 'getApprovalApplicationList':'myPayPage'
        let params = this.query
        if(flag ==='details'){
           params.applyId = this.$route.query.id
        }
        Api[fn](params).then((res) => {
          if (res) {
            this.listData = flag ==='details'?res:res.records
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      /** 添加申请 */
      newPayApply: function () {
        this.$router.push({path: '/router/addContract'})
      },
      columnChange: function (data) {
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
        this.searchStr = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
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