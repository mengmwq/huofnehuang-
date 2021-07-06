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
    <!-- 操作栏 -->
    <el-row class="m10">
      <el-col :span="4" class="text-left">
        <router-link :to="{path: '/router/createTask'}" v-showBtn data-authorityType="createTask-btn">
          <el-button type="primary" size="small" icon="el-icon-plus">创建任务</el-button>
        </router-link>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right">
        预计完成时间：<el-date-picker style="width: 200px" v-model="query.date"  size="small"
                               value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"></el-date-picker>
        <el-select filterable v-model="query.type" clearable placeholder="任务类型" size="small" @change="loadData" style="width:150px">
          <el-option v-for="(item, index) in taskTypeList"
                     :key="index"
                     :label="item.cnInfo"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select filterable v-model="query.states" clearable placeholder="任务状态" size="small" @change="loadData" style="width:150px">
          <el-option v-for="(item, index) in taskStateList"
                     :key="index"
                     :label="item.cnInfo"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-input size="small" clearable placeholder="任务名称/项目编码/负责人" suffix-icon="el-icon-search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="small" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>

    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column type="index" label="序号" fixed="left"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" 
       :prop="header.prop"  :label="header.label" :sortable="header.sortable" :fixed="header.fixed"
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
          <div v-else-if="header.prop == 'taskName'">
              <router-link  :to="{path: '/router/taskDetail', query: {id: scope.row.id, type: scope.row.type, templateType: scope.row.templateType}}">
             {{scope.row.taskName}}
          </router-link>
          </div>
          <div v-else-if="header.prop == 'completionDate'">
              {{scope.row.completionDate | DateFormat}}
          </div>
          <div v-else-if="header.prop == 'type'">
             {{getDictsKeyName(scope.row,'TasType',scope.row.type)}}
          </div>
          <div v-else-if="header.prop == 'states'">
             {{getDictsKeyName(scope.row,'TaskState',scope.row.states)}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button v-showBtn data-authorityType="assign-btn" v-if="scope.row.states === '001'" type="primary" size="small" @click="assignPerson(scope.row)">指派负责人</el-button>
          <el-button v-showBtn data-authorityType="submit-btn" v-if="scope.row.states !== '005'" type="primary" size="small" @click="commit(scope.row)">提交</el-button>
          <el-button v-showBtn data-authorityType="delete-btn" type="primary" size="small" @click="deleteTask(scope.row)">删除</el-button>
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

      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <!--指派负责人 -->
    <el-dialog
      title="指派负责人"
      :visible.sync="assignVisible"
      :close-on-click-modal="canClick"
      @close="clearAssignForm"
      size="tiny" top="12vh" width="40%">
      <div>
        <el-form :model="assignForm" ref="assignForm" label-width="130px">
            <el-form-item label="任务名称："><span>{{currentItem.name}}</span></el-form-item>
            <el-form-item label="指派负责人：">
              <el-select filterable v-model="assignForm.directorId" clearable placeholder="请选择指派负责人" size="small" style="width: 100%;">
                <el-option v-for="item in userList" :key="item.uId" :label="item.uName" :value="item.uId">
                   <span style="float: left">{{ item.uName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tel }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指派参与者：">
              <el-select filterable v-model="assignForm.joinIds" 
              multiple value-key="item.uId" placeholder="请选择指派参与者" style="width:100%">
                <el-option v-for="(item, index) in userList" :key="index"
                           :label="item.uName"
                           :value="item.uId">
                           <span style="float: left">{{ item.uName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tel }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计完成时间：">
              <el-date-picker type="datetime" placeholder="请选择预计完成时间" v-model="assignForm.completionDate"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="assignForm.remark" :rows="4" maxlength="500" show-word-limit></el-input>
            </el-form-item>
            <div class="text-center mt20">
              <el-button type="primary" size="small" @click="cancelSign('assignForm')">取 消</el-button>
              <el-button type="primary" size="small" @click="sureAssign('assignForm')">确 定</el-button>
            </div>
        </el-form>
      </div>
    </el-dialog>
    <!--保险任务提交对话框-->
    <el-dialog
      title="保险任务"
      :close-on-click-modal="canClick"
      :visible.sync="dialogBXVisible"
      @close="clearForm"
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
                <el-date-picker v-model="baoXianForm.startDt" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  type="datetime" placeholder="开始日期">
                </el-date-picker>
                <span>-</span>
                <el-date-picker v-model="baoXianForm.endDt" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  type="datetime" placeholder="结束日期">
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
                <el-select filterable v-model="form.currency" clearable placeholder="请选择币种" size="small" style="width: 100%;">
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
          <el-row>
            <el-col :span="24">
              <el-form-item label="文件上传：">
                <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll"></FileListMultiUpload>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="cancelSubmitBaoxianTask('baoXianForm')">取 消</el-button>
          <el-button type="primary" size="small" @click="submitBaoXianTask">确 定</el-button>
        </div>
        </el-form>
      </div>
    </el-dialog>
    <!--批文任务提交对话框-->
    <el-dialog
      title="批文任务"
      :close-on-click-modal="canClick"
      :visible.sync="dialogPWVisible"
      @close="clearForm"
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
                  <el-col :span="11">
                    <!--<el-input placeholder="批文开始编号" v-model="piWenForm.startCode"></el-input>-->
                    <el-input-number placeholder="批文开始编号" v-model="piWenForm.startCode" controls-position="right" :min="0" ></el-input-number>

                  </el-col>
                  <el-col :span="2"><div class="text-center">-</div></el-col>
                  <el-col :span="11">
                    <!--<el-input placeholder="批文结束编号" v-model="piWenForm.endCode"></el-input>-->
                    <el-input-number placeholder="批文结束编号" v-model="piWenForm.endCode" controls-position="right" ></el-input-number>

                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="批文数量：">
                <span>批文数量： {{piWenNum}}</span>
                <p style="font-size: 13px; color: #aaa;padding: 0;margin: 0">注意：批文结束编号大于批文开始编号时才开始计算数量</p>
              </el-form-item>

            </el-col>
          </el-row>
          <el-form-item label="文件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll"></FileListMultiUpload>
          </el-form-item>
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
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  import Util from '@/utils/'
  export default {
    components: {
      FileListMultiUpload
    },
    computed: {
    // 待审批数量
        pendingApprovalCount () {
        const pendingApprovalCount = this.$store.state.approval.approvalCount
        return pendingApprovalCount
        }
    },
    data () {
      return {
          tabs: ['待我指派', '指派我', '我执行', '我发起', '已完成'],
      curTab: '待我指派',
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
        baoXianForm: {},
        hangCaiForm: {},
        assignForm: {},
        projectCode: '',
        projectName: '',
        // 任务模板类型
        templateType: '',
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          type: '',
          states: ''
        },
        /** 任务类型 */
        taskTypeList: [],
        /** 任务状态 */
        taskStateList: [],
        tableHeader: [ {
          prop: 'name',
          label: '任务名称',
          align: 'left',
          fixed:'left',
          width: '160',
          show: true
        },{
          prop: 'projectCode',
          label: '项目编号',
          width: '150',
          align: 'left',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          width: '260',
         // fixed:'left',
          align: 'left',
          show: true
        },{
          prop: 'customerName',
          label: '客户名称',
          align: 'left',
          show: true
        },  {
          prop: 'describe',
          label: '任务描述',
          align: 'left',
          width: '160',
          show: true
        }, {
          prop: 'type',
          label: '任务类型',
          width: '150',
          align: 'left',
          show: true
        }, {
          prop: 'completionDate',
          align: 'left',
          width: '110',
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
          prop: 'states',
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
        const curTab = sessionStorage.getItem('curTaskTab')
        if (curTab) {
        this.curTab = curTab
        }
      this.loadData()
    },
    methods: {
        handleTabs (item) {
      this.curTab = item
      sessionStorage.setItem('curTaskTab', item)
     if (item === '待我指派') {
        this.$store.dispatch('getApprovalCount',{states:2})
     }
      this.loadData()
    },
      //获取数据字典名称通过KEY
      getDictsKeyName(row,key,value){
        return Util.getDictsKeyName(row,key,value)
      },
      clearForm(){
        this.fileList = []
        this.removedAll = false
        this.hangCaiForm = {
          subCode: '',
          remarks: ''
        }
      },
      clearAssignForm () {
         this.assignForm = {
           directorId: '',
           joinIds: [],
           completionDate: '',
           remark: ''
         }
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
        Api.taskPageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
        this.listLoading = false
      },

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
        }).catch(() => {
        })
      },

      /** 指派负责人 */
      assignPerson (item) {
        this.currentItem = item
        const params  =  {
           name:''
        }
        Api.getUserList(params).then((res) => {
          if (res) {
            this.userList = res
          }
        })
        this.assignVisible = true
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
            this.assignVisible=false
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: '指派失败'
            })
          }
          this.assignForm = {}
        })
      },
      /**
       * 取消指派
       * */
      cancelSign (formName) {
        this.assignVisible = false
        this.$refs[formName].resetFields()
      },
      /** 提交 */
      commit (item) {
        this.currentItem = item
        this.projectCode = item.projectCode
        this.projectName = item.projectName
        // 任务类型
        let type = item.type
        // 任务模板类型
        this.templateType = item.templateType
        switch (this.templateType) {
          case ('001'):
            // 包装任务
            this.$router.push({path: '/router/baoZhuangTaskCommit', query: {id: item.id, type: type, templateType: this.templateType}})
            break;
          case ('002'):
            // 外勤任务
            this.$router.push({path: '/router/outSideTaskCommit', query: {id: item.id, type: type, templateType: this.templateType}})
            break;
          case ('003'):
            // 报关任务
            this.$router.push({path: '/router/baoGuanTaskCommit', query: {id: item.id, type: type, templateType: this.templateType}})
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
          taskAttachmentReqs: [],
          workInsuranceTaskReq: this.baoXianForm
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
        Api.submitBaoXianTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '保险任务提交成功'
            })
            this.dialogBXVisible = false
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
          taskAttachmentReqs: [],
          workOfficialDocTaskReq: this.piWenForm
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
        Api.submitPiWenTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '批文任务提交成功'
            })
            this.dialogPWVisible = false
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
        this.dialogBXVisible = false
        this.$refs[formName].resetFields()
      },
      cancelSubmitPiWenTask (formName) {
        this.dialogPWVisible = false
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
                a.download = '任务列表数据.xlsx'
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

