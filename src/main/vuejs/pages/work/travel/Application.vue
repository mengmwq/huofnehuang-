<template>
  <div class="mt10">
    <!-- 操作栏 -->
    <el-row :gutter="20"  v-if="flag==='list'">
      <el-col :span="10">
        <el-button type="primary" size="small" @click="newPayApply" data-authorityType="add-btn">申请差旅</el-button>
        <el-button type="primary" size="small" @click="deleteItem" data-authorityType="delete-btn">删除</el-button>
      </el-col>
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
            <router-link :to="{path: '/router/travelApplicationDetails', query: {id: scope.row.id,applyId: scope.row.applyId}}">
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
          <router-link v-if="flag==='list'" :to="{path: '/router/editTravelApplication', query: {id: scope.row.id}}"  data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <router-link v-if="flag==='details'" :to="{path: '/router/travelApplicationDetails', query: {id: scope.row.id,applyId: scope.row.applyId}}"  data-authorityType="edit-btn">
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
         <!-- 加载这里 -->
    <el-row type="flex" class="page-box">
      <el-pagination
        background
        @size-change="handleSizeChange"
        :total="total"
        @current-change="handleCurrentChange"
        layout="total,sizes, ->,prev, pager, next"
        :page-sizes="[10, 25, 50]"
        :page-size="query.pageSize"
        :current-page="query.pageNum"
      ></el-pagination>
    </el-row>
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
          label: '报销编号',
          width: '120',
          fixed:'left',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          align: 'left',
          fixed:'left',
          width: '250',
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width: '150',
          show: true
        },{
          prop: 'customerName',
          label: '客户名称',
          align: 'left',
          show: true
        },  {
          prop: 'loanApplyId',
          label: '借款单号',
          width:'140',
          align: 'left',
          show: true
        }, {
          prop: 'reason',
          label: '出差事由',
          align: 'left',
          show: true
        }, {
          prop: 'amount',
          label: '总计金额',
          align: 'left',
          show: true
        }, {
          prop: 'startEndTime',
          align: 'left',
          label: '起止日期',
          width: '85',
          show: true
        }, {
          prop: 'targetSite',
          align: 'left',
          label: '目的地',
          width: '100',
          show: true
        }, {
          prop: 'peopleNumber',
          align: 'left',
          label: '总人数',
          width: '70',
          show: true
        }, {
          prop: 'applyName',
          align: 'left',
          label: '申请人',
          width: '70',
          show: true
        }, {
          prop: 'createDt',
          align: 'left',
          label: '申请时间',
          width: '150',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        sels:[],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
      }
    },
    mounted () {
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
          Api.deleteTravelApplicationByIds(params).then((res) => {
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
            message:'请选择差旅申请!',
            type:'error'
          })
          return;
        }
        params.ids = sels.map(item=>item.id)
        Api.submitTravelApplication(params).then(res=>{
           
            this.$message({
            showClose:true,
            message:'差旅审批申请提交成功!',
            type:'success'
          })
          this.$emit('dataChange')
          this.loadData()
        })
      },

      /**
       * 加载差旅列表
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
        const fn = flag ==='details' ? 'getTravelApplicationByApprovalId':'getTravelApplication'
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
        this.$router.push({path: '/router/addTravelApplication'})
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