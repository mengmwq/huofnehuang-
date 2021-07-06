<template>
  <div>
    <div class="tab-nav" style="padding: 0 15px;border-bottom: 1px solid #e3e2e2;">
      <div class="nav-item tab" @click="changeTabData(0)">
        <span :class="tabIndex === 0 ? 'tab-active' : ''">报价中</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(1)">
        <span :class="tabIndex === 1 ? 'tab-active' : ''">操作中</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(2)">
        <span :class="tabIndex === 2 ? 'tab-active' : ''">操作完成</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(4)">
        <span :class="tabIndex === 4 ? 'tab-active' : ''">已结案</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(3)">
        <span :class="tabIndex === 3 ? 'tab-active' : ''">已作废</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(5)">
        <span :class="tabIndex === 5 ? 'tab-active' : ''">全部</span>
      </div>
    </div>
    <div>
      <!-- 操作栏 v-if="tabIndex===2"-->
      <el-row class="m10">
        <el-col :span="6" class="text-left" v-if="$route.path!='/router/projectDetail'">
          <router-link :to="{ path: '/router/AddDfgProject', query: {type: 'DF'}}" v-showBtn data-authorityType="createYiSu-btn">
            <el-button type="primary" size="medium" >新增免税品项目</el-button>
          </router-link>
        </el-col>
        <el-col :span="18" class="text-right">
          <el-select filterable v-model="query.retrievalFlg" clearable placeholder="收款状态" size="medium" style="width:150px" @change="loadData">
            <el-option v-for="item in retrievalFlgArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker
            v-if="tabIndex===1"
            style="width: 350px"
            @change="loadData"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="searchDate"
            size="medium"
            type="daterange"
            range-separator="至"
            start-placeholder="项目成立开始时间"
            end-placeholder="项目成立结束时间">
          </el-date-picker>

          <el-date-picker
            v-if="tabIndex===2"
            style="width: 350px"
            @change="loadData"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="searchDate"
            size="medium"
            type="daterange"
            range-separator="至"
            start-placeholder="项目完成开始时间"
            end-placeholder="项目完成结束时间"
          >
        </el-date-picker>
          <el-select v-model="query.companyfo" clearable placeholder="分公司" size="medium" style="width:120px" @change="loadData(null)">
            <el-option v-for="item in subCompanyList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
          </el-select>

          <el-input size="medium" clearable placeholder="项目编号/客户名称/项目名称" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
          <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop" :fixed="header.fixed" :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
            <div v-else-if="header.prop == 'projectCode'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
            </div>
            <!--<div v-else-if="header.prop == 'projectType'">
              <span>{{scope.row.projectType | projectTypeFilter}}</span>
            </div>-->
            <div v-else-if="header.prop == 'process'">
              <span>{{scope.row.process ? scope.row.process : 0}}%</span>
            </div>
            <!--<div v-else-if="header.prop == 'stateId'">
              <span>{{scope.row.stateId | projectStateFilter}}</span>
            </div>-->
            <div v-else-if="header.prop == 'arriveDate'">
              <span>{{scope.row.arriveDate | timeFormat}}</span>
            </div>
            <div v-else-if="header.prop == 'planFinishDate'">
              <span>{{scope.row.planFinishDate | timeFormat}}</span>
            </div>
            <div v-else-if="header.prop == 'createDt'">
              <span>{{scope.row.createDt | timeFormat}}</span>
            </div>
            <div v-else-if="header.prop == 'endDate'">
              <span>{{scope.row.endDate | timeFormat}}</span>
            </div>
            <div v-else-if="header.prop == 'establishDate'">
              <span>{{scope.row.establishDate | timeFormat}}</span>
            </div>
            <div v-else-if="header.prop == 'finishDate'">
              <span>{{scope.row.finishDate | timeFormat}}</span>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right"   v-if="tabIndex === 2">
          <template slot-scope="scope">
            <el-button type="primary" size="small" v-showBtn data-authorityType="closedCase-btn"  @click="handleProjectStatus(scope.row)">结案</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right"   v-if="tabIndex === 4">
          <template slot-scope="scope">
            <el-button type="primary" size="small" v-showBtn data-authorityType="recantedCase-btn"  @click="recantedProjectStatus(scope.row)">取消结案</el-button>
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
    </div>
    <el-dialog
      :close-on-click-modal="canClick"
          :title="'撤销结案项目'"
          :visible.sync="updateDialogVisible"
          size="tiny" top="12vh" width="40%">
      <div>
        <el-form :model="editForm" ref="editForm" label-width="120px">
          <el-form-item label="撤销原因:">
            <el-input type="textarea" :rows="4" maxlength="500" show-word-limit v-model="editForm.recantedRemarks"></el-input>
          </el-form-item>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelUpdate('editForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="sureUpdate('editForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  export default {
    data () {
     
      return {
        canClick: false,
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          planFinishDateStart: '',
          stateId: '005',
          companyfo:'',//分公司
        },
        updateDialogVisible: false,
        editForm: {
          stateId: '',
          recantedRemarks:''
        },
        searchDate: '',
		tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          width:'150',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          fixed:'left',
           align: 'left',
          width:'320',
          show: true
        }, {
          prop: 'customerName',
          label: '客户名称',
           align: 'left',
          width:'280',
          show: true
        }, 
        {
          prop: 'createDt',
           align: 'left',
          label: '创建时间',
          width:'160',
          show: true
        }, {
          prop: 'establishDate',
           align: 'left',
          label: '成立时间',
          width: '160',
          show: true
        }, {
          prop: 'finishDate',
           align: 'left',
          label: '完成时间',
          width: '160',
          show: true
        }, {
          prop: 'endDate',
           align: 'left',
          label: '结案时间',
          width: '160',
          show: true
        }, {
          prop: 'stateIdStr',
          label: '项目状态',
          show: true
        }, {
          prop: 'description',
           align: 'left',
          label: '项目描述',
          width:'400',
          show: true
        }, {
          prop: 'accepted',
           align: 'left',
          label: '已收金额',
          show: true
        }, {
          prop: 'receivable',
           align: 'left',
          label: '应收金额',
          show: true
        }, {
          prop: 'salesman',
           align: 'left',
          label: '销售员',
          show: true
        }, {
          prop: 'ctUName',
           align: 'left',
          label: '录入人员',
          show: true
        }],
        retrievalFlgArr:[{
		    label: '完成收款',
		    value: 'A'
		  }, {
		    label: '未完成收款',
		    value: 'B'
		  }],
        /** 表格数据 */
        listData: [],
        multipleSelection: [],
        /** 总数据数 */
        total: 10,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        tabIndex: 1,
        projectTypeList: [],
        projectStateList: [],
        subCompanyList:[],
        getProjectCodeLevel3Arr:[{
              value: 'E',
              label: '画廊'
            }, {
              value: 'M',
              label: '博物馆'
            }, {
              value: 'A',
              label: '拍卖行'
            }],
      }
    },
    mounted () {
      if (sessionStorage.getItem('dists')) {
        let dists = JSON.parse(sessionStorage.getItem('dists'));
        if (dists.ProjectType) {
          this.projectTypeList = dists.ProjectType.children
        }
        if (dists.ProjectState) {
          this.projectStateList = dists.ProjectState.children
        }
      }
      this.loadData()
      this.getSubCompanyList()
    },
    methods: {
      recantedProjectStatus(item){
      	this.updateDialogVisible = true;
      	this.editForm = item
      },
      handleProjectStatus(item){
         this.$confirm('您确定要将项目【' + item.projectName + '】结案吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
             stateId: '045',
            projectCode: item.projectCode,
            }
          Api.updateProjectState(params).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '结案成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '结案失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      //获取 分公司
      getSubCompanyList(){
        Api.getCompanyfo().then(res=>{
            this.subCompanyList = res
        })
      },
      changeTabData (index) {
        this.searchDate = ''
        this.tabIndex = index
        if (index === 2) {
          delete this.query['establishDateStart']
          delete this.query['establishDateEnd']
          this.query.planFinishDateStart = ''
          this.query.planFinishDateEnd = ''
          this.query.stateId = '012'
        } else if(index ===1){
          delete this.query['planFinishDateStart']
          delete this.query['planFinishDateEnd']
          this.query.establishDateStart = ''
          this.query.establishDateEnd = ''
          this.query.stateId = '005'
        }  else if(index ===0){
          delete this.query['planFinishDateStart']
          delete this.query['planFinishDateEnd']
          this.query.establishDateStart = ''
          this.query.establishDateEnd = ''
          this.query.stateId = '004'
        } else if(index ===3){
            delete this.query['planFinishDateStart']
          delete this.query['planFinishDateEnd']
           delete this.query['establishDateStart']
          delete this.query['establishDateEnd']
           this.query.stateId = '011'
        }else if(index ===4){
            delete this.query['planFinishDateStart']
          delete this.query['planFinishDateEnd']
           delete this.query['establishDateStart']
          delete this.query['establishDateEnd']
           this.query.stateId = '045'
        }else if(index === 5){
            delete this.query['planFinishDateStart']
          delete this.query['planFinishDateEnd']
           delete this.query['establishDateStart']
          delete this.query['establishDateEnd']
          this.query.stateId = ''
        }
        this.loadData()
      },
      /**
       * 加载任务列表
       */
      loadData (pageNum=1) {
        if(pageNum === 'A' || pageNum === 'B' || 
        pageNum === 'M' || pageNum === 'E'){
        	pageNum=1
        }
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true

        if (this.tabIndex === 1) {
          delete this.query['planFinishDateStart']
          delete this.query['planFinishDateEnd']
          if (this.searchDate) {
            this.query.establishDateStart = this.searchDate[0]
            this.query.establishDateEnd = this.searchDate[1]
          } else {
            this.query.establishDateStart = ''
            this.query.establishDateEnd = ''
          }
        } else {
          if (this.searchDate) {
            delete this.query['establishDateStart']
            delete this.query['establishDateEnd']
            this.query.planFinishDateStart = this.searchDate[0]
            this.query.planFinishDateEnd = this.searchDate[1]
          } else {
            this.query.planFinishDateStart = ''
            this.query.planFinishDateEnd = ''
          }
        }

        Api.getArtDfgProjectList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'projectTypeStr', filters.projectTypeFilter(item.projectType))
              _this.$set(item, 'stateIdStr', filters.projectStateFilter(item.stateId))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      /**
       * 删除项目
       * */
      deleteTask (item) {
        this.$confirm('您确定要删除【' + item.projectName + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteProject({id: item.projectCode}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      operateTask (item, stateId) {
        this.currentItem = item
        this.editForm.stateId = stateId
        this.editForm.projectCode = item.projectCode
        let projectName = item.projectName
        if (stateId === '005' || stateId === '012') {
          let tips = stateId === '005' ? '您确定要成立【' + projectName + '】吗?' : '您确定要结案【' + projectName + '】吗?'
          let successTips = stateId === '005' ? '【' + projectName + '】项目成立成功' : '【' + projectName + '】项目结案成功'
          let failTips = stateId === '005' ? '【' + projectName + '】项目成立失败' : '【' + projectName + '】项目结案失败'
          this.$confirm(tips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = {
              projectCode: item.projectCode,
              stateId: stateId
            }
            Api.updateProjectState(param).then((res) => {
              if (res) {
                this.$notify.success({
                  title: '提示',
                  message: successTips
                })
                // 项目结案之后，tab显示结案，查询结案的数据
                if(stateId == '012'){
                  this.tabIndex = 2
                  this.query.stateId = '012'
                  this.loadData()
                } else {
                  this.query.stateId = '001'
                  this.loadData()
                }
              } else {
                this.$notify.warning({
                  title: '提示',
                  message: failTips
                })
              }
            })
          })
        } else {
          this.updateDialogVisible = true
        }
      },
      cancelUpdate (formName) {
        this.$refs[formName].resetFields()
        this.updateDialogVisible = false
      },
      sureUpdate () {
        let successTips = ''
        let failTips = ''
        let param = {
          projectCode: this.editForm.projectCode,
          stateId: '012',
          recantedRemarks: this.editForm.recantedRemarks
        }
          // 项目作废
          if (!this.editForm.recantedRemarks) {
            this.$notify.warning({
              title: '提示',
              message: '请填写项目撤销原因'
            })
            return
          }
          successTips = '项目撤销成功'
          failTips = '项目撤销失败'
          delete param['process']
          delete param['remarks']
        Api.updateProjectState(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: successTips
            })
            this.updateDialogVisible = false
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: failTips
            })
          }
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 驳回
       * */
      dealIncome (item) {
        this.currentItem = item
        this.dialogVisible = true
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
      canSelected (row, index) {
        if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
          return 0
        } else {
          return 1
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.projectName = ''
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
                a.download = '项目列表数据.xlsx'
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

