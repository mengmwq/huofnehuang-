<template>
  <div>
    <!-- 操作栏 -->
    <el-row class="m10">
      <el-col :span="4" class="text-left" v-if="$route.path!='/router/projectDetail'">
        <router-link :to="{path: '/router/AddDfgCustoms'}" v-showBtn data-authorityType="addCustom-btn">
          <el-button type="primary" size="medium" icon="el-icon-plus">新增报关</el-button>
        </router-link>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        放行日期：
        <el-date-picker @change="loadData"
          v-model="dateRange"
          type="datetimerange"
          size="medium"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <!--<el-select v-model="query.state" clearable placeholder="报关状态" size="medium" @change="loadData" style="width:150px">
          <el-option v-for="(item, index) in taskStateList"
                     :key="index"
                     :label="item.cnInfo"
                     :value="item.value">
          </el-option>
        </el-select>-->
        <el-input size="medium" clearable placeholder="报关单号/项目编号" suffix-icon="el-icon-search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>

    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}">
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'name'">
            <router-link :to="{path: '/router/taskDetail', query: {id: scope.row.id, type: scope.row.type, templateType: scope.row.templateType}}">
              {{scope.row.name}}
            </router-link>
          </div>
          <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop == 'applyFinishDate'">
            {{scope.row.applyFinishDate | timeFormat}}
          </div>
           <div v-else-if="header.prop == 'customsNo'">
            <router-link :to="{path: '/router/AddDfgCustoms',query:{id: scope.row.id}}">
            {{scope.row.customsNo}}
          </router-link>
          </div>
           <div v-else-if="header.prop == 'projectName'">
            <a href="javascript:;" @click="showGoodsDetails(scope.row)">{{scope.row.projectName}}</a>
          </div>
          <div v-else-if="header.prop == 'releaseDate'">
            {{scope.row.releaseDate | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'states'">
            {{scope.row.states | taskStatesFilter}}
          </div>
          <div v-else-if="header.prop == 'projectState'">
            {{scope.row.projectState | projectStateFilter}}
          </div>
          <div v-else-if="header.prop == 'createDt'">
            {{scope.row.createDt | DateFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="136" fixed="right" v-if="$route.path!='/router/projectDetail'">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="deleteCus(scope.row)">删除</el-button>
          <router-link :to="{path: '/router/AddDfgCustoms',query:{id: scope.row.id, edit:1}}" v-showBtn data-authorityType="editCustom-btn">
            <el-button type="primary" size="small" >编辑</el-button>
          </router-link>
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
      <el-button type="primary" size="small" v-if="$route.path!='/router/projectDetail'" @click="exportExcel">导出excel</el-button>
    </el-row>
    <el-dialog
      title="货物详情"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
        <MaterialDetail
            :operateFlag="'pro-detail'"
            :projectType="projectType"
            :projectCode="projectCode"
    ></MaterialDetail>
    </el-dialog>
  </div>
</template>


<script>
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  import MaterialDetail from '@/pages/my/project/MaterialDetail'
  export default {
    components: {
      MaterialDetail,
    },
    data () {

      const projectCode = this.$route.query.id
      let show = true;
      if(this.$route.path=='/router/projectDetail'){
         show = false;
      }
      return {
        dialogVisible:false,
        dialogBXVisible: false,
        dialogPWVisible: false,
        dialogHCVisible: false,
        assignVisible: false,
        timeRange: '',
        // 指派负责人，需要指派的人员
        directorId: '',
        // 指派负责人时查询的人员类表
        userList: [],
        form: {},
        piWenForm: {
          startCode: '',
          endCode: '',
        },
        dateRange: [],
        baoXianForm: {},
        hangCaiForm: {},
        assignForm: {},
        projectType:'',
        projectCode: '',
        projectName: '',
        // 任务模板类型
        templateType: '',
        query: {
          pageSize: 10,
          pageNum: 1,
          releaseEndTime: '',
          releaseStartTime: '',
          searchStr: '',
          state: '',
          projectCode:projectCode?projectCode:''
        },
        /** 任务类型 */
        taskTypeList: [],
        /** 任务状态 */
        taskStateList: [],
        tableHeader: [{
          prop: 'customsNo',
          label: '报关单号',
          align: 'center',
          width:'120',
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'150',
          show: show
        }, {
          prop: 'customerName',
          label: '客户名称',
          align: 'left',
          width:'150',
          show: show
        },{
          prop: 'receiveCompany',
          label: '收货单位',
          align: 'center',
          show: true
        }, {
          prop: 'sendCompany',
          label: '发货单位',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'projectName',
          align: 'center',
          width: '180',
          label: '品名',
          show: true
        }, {
          prop: 'projectStateF',
          align: 'center',
          label: '项目状态',
          width: '150',
          show: show
        }, {
          prop: 'releaseDate',
          label: '放行日期',
          align: 'center',
          show: true
        }, {
          prop: 'mainCode',
          label: '主运单',
          align: 'center',
          width: '100',
          show: true
        },{
          prop: 'ctUName',
          align: 'center',
          label: '创建人',
          width: '100',
          show: show
        }, {
          prop: 'createDt',
          align: 'center',
          label: '创建日期',
          width: '100',
          show: show
        }],
        /** 表格数据 */
        listData: [],
        fileData: [],
        multipleSelection: [],
        multipleSelection1: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: {},
        // 币种
        currencyTypeList: [],
        piWenNum: '',
      }
    },
    watch: {
      'piWenForm.endCode' : function () {
        if (this.piWenForm.endCode > this.piWenForm.startCode) {
          this.piWenNum = this.piWenForm.endCode - this.piWenForm.startCode
        }
      }
    },
    mounted () {
      if (sessionStorage.getItem('dists')) {
        let dists = JSON.parse(sessionStorage.getItem('dists'));
        if (dists.TasType) {
          this.taskTypeList = dists.TasType.children
        }
        if (dists.TaskState) {
          this.taskStateList = dists.TaskState.children
        }
        if (dists.Currency) {
          this.currencyTypeList = dists.Currency.children
        }
      }
      this.loadData()
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
    },
    methods: {
      //显示浮窗并赋值参数 
      showGoodsDetails(row){
         this.projectCode = row.projectCode
         this.projectType = row.projectType
         this.dialogVisible = true
      },
      //关闭货物详情窗口；
      handleClose(){
        this.dialogVisible = false
        this.loadData()
      },
      /**
       * 加载任务列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        this.query.projectType = '4'
        if (this.dateRange) {
          this.query.releaseStartTime = this.dateRange[0]
          this.query.releaseEndTime = this.dateRange[1]
        } else {
          this.query.releaseStartTime = ''
          this.query.releaseEndTime = ''
        }
        Api.customsManagePage(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'projectStateF', filters.taskTypeFilter(item.projectState))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },

      deleteCus (item) {
        this.$confirm('您确定要删除【' + item.customsNo + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteCustoms({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '【' + item.customsNo + '】删除成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '【' + item.customsNo + '】删除失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      /** 确认指派 */
      sureAssign(formName) {
        if (!this.assignForm.directorId) {
          this.$notify.warning({
            title: '提示',
            message: '请选择指派人员'
          })
          return
        }
        this.assignForm.id = this.currentItem.id
        Api.assignChargePerson(this.assignForm).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '指派成功'
            })
            this.$refs[formName].resetFields()
            this.assignVisible = false
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: '指派失败'
            })
          }
        })
      },
      /**
       * 取消指派
       * */
      cancelSign (formName) {
        this.assignVisible = false
        this.$refs[formName].resetFields()
      },
     
      cancelSubmitBaoxianTask (formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      
      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
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
                a.download = '报关列表数据.xlsx'
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

