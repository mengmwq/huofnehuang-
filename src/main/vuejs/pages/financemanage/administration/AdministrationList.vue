<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="newPayApply" v-showBtn data-authorityType="add-btn"  icon="el-icon-plus">申请行政支出</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        申请日期：
        <el-date-picker
          style="width: 350px"
          @change="loadData(null)"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="searchDate"
          size="medium"
          type="daterange"
          range-separator="至"
          start-placeholder="付款开始时间"
          end-placeholder="付款结束时间">
        </el-date-picker>
        <el-select filterable v-model="query.payingState" @change="loadData(null)" clearable placeholder="全部状态" size="medium" style="width:170px">
          <el-option v-for="item in payingStateList" :key="item.value"
            :label="item.cnInfo"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="请输入合同编号" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" 
      :prop="header.prop"  :label="header.label" :sortable="header.sortable" :fixed="header.fixed"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
           <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.contractId, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
           <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.contractId, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractCode, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
          <div v-else-if="header.prop === 'id'">
            <router-link :to="{path: '/router/administrationDetail', query: {id: scope.row.id}}">
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
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="scope">
          <!-- <router-link :to="{path: '/router/administrationApplyEdit', query: {id: scope.row.id}}" v-showBtn data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link> -->
          <el-button type="primary" size="mini" @click="payMoney(scope.row)" v-if="scope.row.approvalStates === '1'" v-showBtn data-authorityType="pay-btn">付款</el-button> 
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

    <el-dialog
      title="付款操作"
      :visible.sync="dialogVisible"
      :close-on-click-modal="canClick"
      @close="clearForm"
      size="small" width="55%">
      <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="120px">
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="项目编号：">
              <span class="info">{{form.projectCode}}</span>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="付款金额：">
              <span class="info">{{form.amount}} 元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人：">
              <span class="info">{{form.applyName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实付金额：">
              <el-input v-model="form.actualAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款时间">
              <el-date-picker
                v-model="form.payTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司：">
              <el-input v-model="form.company"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人">
              <el-select filterable v-model="form.operatorId" placeholder="请选择经办人" style="width:100%">
                <el-option v-for="(item, index) in userList" :key="index"
                           :label="item.uName"
                           :value="item.uId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件上传：">
              <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.applyAttachmentReqs"></FileListMultiUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogVisible=false;">取 消</el-button>
        <el-button type="primary" size="small" @click="surePay('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import * as filters from '@/filters/filter'
  import moment from 'moment'
  import Api from '@/api/index'
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  export default {
    name:'AdministrationList',
    components: {
      FileListMultiUpload
    },
    data () {
      return {
        canClick: false,
        dialogBHVisible: false,
        dialogWCVisible: false,
        dialogVisible: false,
        approvalStates:'', //付款管理
        searchDate: '',
        form: {
          applyAttachmentReqs: []
        },
        boHuiForm: {
          reason: ''
        },
        wanChengForm: {
          remark: ''
        },
        userList: [],
        query: {
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
        // {
        //   prop: 'projectCode',
        //   label: '项目编号',
        //   align: 'left',
        //   width:'150',
        //   show: true
        // }, 
        //  {
        //   prop: 'projectName',
        //   label: '项目名称',
        //   align: 'left',
        //   width:'150',
        //   show: true
        // },
        {
          prop: 'contractCode',
          label: '合同编号',
          align: 'left',
          show: true
        }, {
          prop: 'customName',
          label: '付款方名称',
          align: 'left',
          width:'220',
          show: true
        }, {
          prop: 'payingStateStr',
          label: '付款状态',
          align: 'left',
          show: true
        }, {
          prop: 'depositBank',
          align: 'left',
          label: '开户行',
          width: '200',
          show: true
        }, {
          prop: 'bankCode',
          label: '银行账号',
          width: '120',
          align: 'left',
          show: true
        }, {
          prop: 'amount',
          align: 'left',
          label: '付款金额',
          width: '100',
          show: true
        }, {
          prop: 'orgName',
          align: 'left',
          label: '申请部门',
          width: '100',
          show: true
        }, {
          prop: 'applyName',
          align: 'left',
          label: '申请人',
          width: '100',
          show: true
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
          show: true
        },  {
          prop: 'positionName',
          align: 'left',
          label: '审批岗位',
          width: '100',
          show: true
        }, {
          prop: 'approvalStatesStr',
          align: 'left',
          label: '审批状态',
          width: '100',
          show: true
        }, {
          prop: 'approvalTime',
          align: 'left',
          label: '审批时间',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        payingStateList: [],
        fileList: [],
        removedAll: false,
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
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
    },
    methods: {
      clearForm() {
        this.form = {
          applyAttachmentReqs: []
        }
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
        if (this.searchDate) {
          this.query.payApplyStartTime = this.searchDate[0]
          this.query.payApplyEndTime = this.searchDate[1]
        } else {
          this.query.payApplyStartTime = ''
          this.query.payApplyEndTime = ''
        }
        Api.administrationPage(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'payingStateStr', filters.payingStateFilter(item.payingState))
              _this.$set(item, 'approvalStatesStr', filters.approvalApplyStateFilter(item.approvalStates))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      /** 添加申请 */
      newPayApply: function () {
        this.$router.push({path: '/router/addExpenditureApplication'})
      },
      /**
       * 付款
       */
      surePay () {
        let _this = this
        if (this.fileList.length > 0) {
          _this.form.applyAttachmentReqs = []
          this.fileList.forEach(function (item) {
            _this.form.applyAttachmentReqs.push({
              name: item.name,
              attachmentUrlKey: item.attachmentUrlKey
            })
          })
        } else {
          if (this.removedAll) {
            this.form.applyAttachmentReqs = []
          }
        }
        delete this.form['attached']
        Api.payAdministration(this.form).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '付款成功'
            })
            this.dialogVisible = false
            this.loadData()
            this.form = {}
          } else {
            this.$notify.warning({
              title: '提示',
              message: '付款失败'
            })
          }
        })

      },

      deleteInvoice (item) {
        this.$confirm('您确定要删除发票记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
      },
      /**
       * 驳回
       * */
      reject (item) {
        this.currentItem = item
        this.dialogBHVisible = true
      },
      /**
       * 完成
       * */
      complete (item) {
        this.currentItem = item
        this.dialogWCVisible = true
      },
      /**
       * 付款
       * */
      payMoney (item) {
        item.payTime = item.payTime ? moment(item.payTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.currentItem = item
        this.form = item

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
                a.download = '行政支出列表数据.xlsx'
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

