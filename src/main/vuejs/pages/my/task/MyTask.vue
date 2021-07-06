<template>
  <div>
    <!-- 操作栏 -->
    <el-row class="m10">
      <!--<el-col :span="4" class="text-left">
        <router-link :to="{path: '/router/createTask'}">
          <el-button type="primary" size="medium" icon="el-icon-plus">创建任务</el-button>
        </router-link>
      </el-col>-->
      <el-col :span="24" class="text-right">
        预计完成时间：<el-date-picker style="width: 200px" size="medium" v-model="query.date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"></el-date-picker>
        <el-select v-model="query.type" clearable placeholder="任务类型" size="medium" @change="loadData" style="width:150px">
          <el-option v-for="(item, index) in taskTypeList"
                     :key="index"
                     :label="item.cnInfo"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="query.states" clearable placeholder="任务状态" size="medium" @change="loadData" style="width:150px">
          <el-option v-for="(item, index) in taskStateList"
                     :key="index"
                     :label="item.cnInfo"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="任务名称/项目编码/负责人" suffix-icon="el-icon-search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>

    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column type="index" label="序号"></el-table-column>
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
             <div v-else-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
          <div v-else-if="header.prop == 'type'">
            {{scope.row.type | taskTypeFilter}}
          </div>
          <div v-else-if="header.prop == 'states'">
            {{scope.row.states | taskStatesFilter}}
          </div>
          <div v-else-if="header.prop == 'completionDate'">
            {{scope.row.completionDate | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="210">
        <template slot-scope="scope">
          <router-link v-showBtn data-authorityType="base-btn" :to="{path: '/router/taskDetail', query: {id: scope.row.id, type: scope.row.type, templateType: scope.row.templateType}}">
            <el-button type="primary" size="small">详情</el-button>
          </router-link>
          <!--executor没有数据说明还未接受--> <!---->
          <el-button type="primary" v-showBtn data-authorityType="accept-btn" v-if="!scope.row.executor" size="small" @click="accept(scope.row)">接受</el-button>
          <el-button type="primary" v-showBtn data-authorityType="refuse-btn" v-if="!scope.row.executor" size="small" @click="refuseTask(scope.row)">拒绝</el-button>
          <el-button type="primary" v-showBtn data-authorityType="commit-btn" v-if="scope.row.executor && scope.row.states !== '005'" size="small" @click="commit(scope.row)">提交</el-button>
          <el-button type="primary" v-showBtn data-authorityType="delete-btn" v-if="scope.row.executor && scope.row.states === '005'" size="small" @click="deleteTask(scope.row)">删除</el-button>
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

    <!--保险任务提交对话框-->
    <el-dialog
      title="保险任务"
      :close-on-click-modal="canClick"
      :visible.sync="dialogBXVisible"
      size="small" top="12vh" width="60%">
      <div>
        <el-form :model="baoXianForm" ref="baoXianForm" label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编号："><span>{{projectCode}}</span></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称："><span>{{projectName}}</span></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="保险单编号：">
                <el-input v-model="baoXianForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="保险日期：">
                <el-date-picker
                  v-model="baoXianForm.startDt"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="开始日期"
                >
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                  v-model="baoXianForm.endDt"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="总赔偿限额：">
                <el-input v-model="baoXianForm.maxLimits"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="保险费：">
                <el-input v-model="baoXianForm.insurancePremium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="币种：">
                <el-select v-model="form.currency" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="投保公司：">
                <el-input v-model="baoXianForm.insuranceCompany"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="24" class="text-left">
              <el-button type="primary" size="small">保单上传</el-button>
            </el-col>
          </el-row>
          <el-table class="page-table" :data="fileData" stripe highlight-current-row :cell-style="{color:'#333'}"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="">查看</el-button>
                <el-button type="primary" size="mini" @click="">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelSubmitBaoxianTask('baoXianForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="submitBaoXianTask">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!--批文任务提交对话框-->
    <el-dialog
      :close-on-click-modal="canClick"
      title="批文任务"
      :visible.sync="dialogPWVisible"
      size="small" top="12vh" width="60%">
      <div>
        <el-form :model="piWenForm" ref="piWenForm" label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编号："><span>{{projectCode}}</span></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称："><span>{{projectName}}</span></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="批文编号：">
                <el-row>
                  <el-col :span="11"><el-input placeholder="批文开始编号" v-model="piWenForm.startCode"></el-input></el-col>
                  <el-col :span="2"><div class="text-center">-</div></el-col>
                  <el-col :span="11"><el-input placeholder="批文结束编号" v-model="piWenForm.endCode"></el-input></el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批文数量：">
                <span>根据批文编号自动算的</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="24" class="text-left">
              <el-button type="primary" size="small">文件批量上传</el-button>
            </el-col>
          </el-row>
          <el-table class="page-table" :data="fileData" stripe highlight-current-row :cell-style="{color:'#333'}"
                    @selection-change="handleSelectionChange1">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="">查看</el-button>
                <el-button type="primary" size="mini" @click="">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelSubmitPiWenTask('piWenForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="submitPiWenTask()">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!--航材任务提交-->
    <el-dialog
            title="航材任务提交"
            :close-on-click-modal="canClick"
            :visible.sync="dialogHCVisible"
            @close="clearForm"
            size="small" top="12vh" width="45%">
      <div>
        <el-form :model="hangCaiForm" ref="hangCaiForm" label-width="100px">
          <el-form-item label="项目编号：">
            <span>{{projectCode}}</span>
          </el-form-item>
          <el-form-item label="任务名称：">
            <span>{{currentItem.name}}</span>
          </el-form-item>
          <!--仅在航材出口任务提交时才会出现-->
          <el-form-item label="分单号：" v-if="templateType==='008'">
            <el-input v-model="hangCaiForm.subCode"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" :rows="4" maxlength="500" show-word-limit v-model="hangCaiForm.remarks"></el-input>
          </el-form-item>
          <el-form-item label="文件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll"></FileListMultiUpload>
          </el-form-item>

          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelSubmitHangCaiTask('hangCaiForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="submitHangCaiTask('hangCaiForm')">确 定</el-button>
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
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  export default {
    components: {
      FileListMultiUpload
    },
    data () {
      return {
        fileList: [],
        removedAll: false,
        canClick: false,
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
        baoXianForm: {
        },
        hangCaiForm: {},
        projectCode: '',
        projectName: '',
        // 任务模板类型
        templateType: '',
        query: {
          pageSize: 10,
          pageNum: 1,
          myTaskList: true,
          searchStr: '',
          type: '',
          states: ''
        },
        /** 任务类型 */
        taskTypeList: [],
        /** 任务状态 */
        taskStateList: [],
        tableHeader: [{
          prop: 'name',
          label: '任务名称',
          align: 'left',
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'140',
          show: true
        },{
          prop: 'projectName',
          label: '项目名称',
          width: '300',
          align: 'left',
          show: true
        },{
          prop: 'customerName',
          label: '客户名称',
          width: '280',
          align: 'left',
          show: true
        }, {
          prop: 'describe',
          label: '任务描述',
          align: 'left',
          show: true
        }, {
          prop: 'typeF',
          label: '任务类型',
          width: '150',
          align: 'left',
          show: true
        }, {
          prop: 'completionDate',
          align: 'left',
          width: '180',
          label: '预计完成日期',
          show: true
        }, {
          prop: 'orgName',
          align: 'left',
          label: '部门',
          width: '150',
          show: true
        }, {
          prop: 'directorName',
          label: '负责人',
          align: 'left',
          show: true
        }, {
          prop: 'statesF',
          label: '状态',
          align: 'left',
          width: '100',
          show: true
        }, {
          prop: 'progress',
          align: 'left',
          label: '进度',
          width: '100',
          show: true
        }],
        /***接受、拒绝按钮触发flag**/
        flag : true,
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
        currencyTypeList: []
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
    },
    methods: {
      clearForm(){
        this.fileList = []
        this.removedAll = false
        this.hangCaiForm = {
          subCode: '',
          remarks: ''
        }
      },

      /**
       * 加载任务列表
       */
      loadData () {
        this.listLoading = true
        Api.taskPageList(this.query).then((res) => {  //4,6 隐藏
          if (res) {
            this.listData = res.records
            /*let i= 0
            for(i ; i < this.listData.length; i++){
              if( this.listData[i].states == 4 || this.listData[i].states == 6){
                this.listData[i].rejectFlag = false
              }else {
                this.listData[i].rejectFlag = true
              }
            }*/
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'statesF', filters.taskStatesFilter(item.states))
              _this.$set(item, 'typeF', filters.taskTypeFilter(item.type))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      /**
       * 接受任务
       * */
      accept (item) {
        this.$confirm('您确定要接受【' + item.name + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.acceptTask({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '任务接受成功'
              })
              this.flag = false
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '接受失败'
              })
            }
          })
        })
      },
      /**
       * 拒绝任务
       * */
      refuseTask (item) {
        this.$confirm('您确定要拒绝【' + item.name + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.refuseTask({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '任务拒绝成功'
              })
              this.flag = false
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '拒绝失败'
              })
            }
          })
        })
      },
      /** 删除任务 */
      deleteTask (item) {
        this.$confirm('您确定要删除【' + item.name + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteTask({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '任务删除成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '删除失败'
              })
            }
          })
        })
      },
      /** 提交 */
      commit (item) {
        this.currentItem = item
        this.projectCode = item.projectCode
        this.projectName = item.projectName
        // 任务类型
        let type = item.type
        // 任务模板类型
        let templateType = item.templateType
        switch (templateType) {
          case ('001'):
            // 包装任务
            this.$router.push({path: '/router/baoZhuangTaskCommit', query: {id: item.id, type: type, templateType: templateType, tag: '1'}})
            break;
          case ('002'):
            // 外勤任务
            this.$router.push({path: '/router/outSideTaskCommit', query: {id: item.id, type: type, templateType: templateType, tag: '1'}})
            break;
          case ('003'):
            // 报关任务
            this.$router.push({path: '/router/baoGuanTaskCommit', query: {id: item.id, type: type, templateType: templateType, tag: '1'}})
            break;
          case ('004'):
            // 提交保险任务
            this.dialogBXVisible = true
            break;
          case ('006'):
            // 提交批文任务
            this.dialogPWVisible = true
            break;
          case ('007'):
            // 提交航材非提货任务
            this.dialogHCVisible = true
            break;
          case ('008'):
            // 提交航材提货任务
            this.dialogHCVisible = true
            break;
        }
      },
      /**
       * 提交保险任务
       * */
      submitBaoXianTask () {
        let param = {
          id : this.currentItem.id,
          workInsuranceTaskReq: this.baoXianForm
        }
        Api.submitBaoXianTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '保险任务提交成功'
            })
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: '保险任务提交失败'
            })
          }
        })
      },
      cancelSubmitBaoxianTask (formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      /**
       * 提交批文任务
       * */
      submitPiWenTask () {
        let param = {
          id : this.currentItem.id,
          workOfficialDocTaskReq: this.piWenForm
        }
        Api.submitPiWenTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '批文任务提交成功'
            })
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: '批文任务提交失败'
            })
          }
        })
      },
      /**
       * 提交航材任务
       * */
      submitHangCaiTask (formName) {
        let param = {
          id : this.currentItem.id,
          taskAttachmentReqs: [],
          workMaterialTaskSubmitSubReq: this.hangCaiForm
        }
        let _this = this
        if (this.fileList.length > 0) {
          param.taskAttachmentReqs = []
          this.fileList.forEach(function (item) {
            param.taskAttachmentReqs.push({
              attachmentName: item.name,
              key: item.attachmentUrlKey,
              projectCode: _this.projectCode
            })
          })
        } else {
          if (this.removedAll) {
            param.taskAttachmentReqs = []
          }
        }
        Api.submitHangCaiTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '航材任务提交成功'
            })
            this.dialogHCVisible = false
            this.hangCaiForm.subCode = ''
            this.hangCaiForm.remarks = ''
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: '航材任务提交失败'
            })
          }
        })
      },
      cancelSubmitHangCaiTask (formName) {
        this.dialogHCVisible = false
        this.$refs[formName].resetFields()
      },
      cancelSubmitBaoxianTask (formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      cancelSubmitPiWenTask (formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSelectionChange1 (val) {
        this.multipleSelection1 = val
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
                a.download = '我的任务列表数据.xlsx'
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

