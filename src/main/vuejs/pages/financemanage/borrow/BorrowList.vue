<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="newApply" v-showBtn data-authorityType="add-btn" icon="el-icon-plus">借款申请</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        申请日期：<el-date-picker
        @change="loadData(null)"
        v-model="searchDate"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        size="medium"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
        <el-select filterable v-model="query.state" @change="loadData(null)" clearable placeholder="全部状态" size="medium" style="width:170px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="请输入项目/合同编号" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" 
      :prop="header.prop"  :label="header.label" :sortable="header.sortable"  :fixed="header.fixed"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'proNo'">
            <router-link :to="{path: '/router/'}">{{scope.row.proNo}}</router-link>
          </div>
          <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
          <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractCode, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
          <div v-else-if="header.prop == 'id'">
           <router-link :to="{path: '/router/borrowDetail', query: {id: scope.row.id}}">
            {{scope.row.id}}
          </router-link>
          </div>
          
          <div v-else-if="header.prop == 'applyDate'">
            {{scope.row.applyDate | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'approvalTime'">
            {{scope.row.approvalTime | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'stateStr'">
            {{scope.row.stateStr}}
          </div>
          <div v-else-if="header.prop == 'approvalStatesStr'">
            {{scope.row.approvalStatesStr}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          
          <!-- <router-link :to="{path: '/router/editBorrowApply', query: {id: scope.row.id}}" v-showBtn data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link> -->
          <!--<el-button type="primary" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="reject(scope.row)">驳回</el-button>-->
          <el-button type="primary" size="mini" v-if="scope.row.state !== '002'" @click="complete(scope.row)" v-showBtn data-authorityType="complete-btn">完成</el-button>
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
      title="完成操作"
      :visible.sync="dialogWCVisible"
      :close-on-click-modal="canClick"
      @close="clearForm"
      size="small" width="45%">
      <el-form :model="wanChengForm" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编号：">
              <span class="info">{{currentItem.contractCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号：">
              <span class="info">{{currentItem.projectCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="借款金额：">
              <span class="info">{{currentItem.amount}} 元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人：">
              <span class="info">{{currentItem.applyName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input style="width: 100%"
                type="textarea"
                :rows="3"
                placeholder="备注信息"
                v-model="wanChengForm.remarks">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="附件上传：">
              <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="wanChengForm.applyAttachmentReqs"></FileListMultiUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogWCVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmFinish">确 定</el-button>
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
        canClick: false,
        searchDate: '',
        fileList: [],
        removedAll: false,
        dialogBHVisible: false,
        dialogWCVisible: false,
        form: {

        },
        boHuiForm: {
          reason: ''
        },
        wanChengForm: {
          remark: '',
          applyAttachmentReqs: []
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          loanApplyStartTime: '',
          loanApplyEndTime: '',
          state: ''
        },
        tableHeader: [{
          prop: 'id',
          label: '编号',
          width: '120',
          fixed:'left',
          show: true
        },  {
          prop: 'projectName',
          label: '项目名称',
          align: 'left',
          fixed:'left',
          width:'260',
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'150',
          show: true
        }, {
          prop: 'contractCode',
          label: '合同编号',
          align: 'left',
          show: true
        }, {
          prop: 'customerName',
          label: '客户名称',
          align: 'left',
          width:'200',
          show: true
        }, 
        // {
        //   prop: 'projectName',
        //   label: '项目名称',
        //   align: 'left',
        //   width:'280',
        //   show: true
        // },
         {
          prop: 'applyName',
          align: 'left',
          label: '申请人',
          width: '100',
          show: true
        }, {
          prop: 'orgName',
          align: 'left',
          label: '申请部门',
          width: '100',
          show: true
        }, {
          prop: 'peopleNumber',
          align: 'left',
          label: '人员数量',
          width: '100',
          show: true
        }, {
          prop: 'applyDate',
          align: 'left',
          label: '申请日期',
          width: '100',
          show: true
        }, {
          prop: 'daysNumber',
          align: 'left',
          label: '预计天数',
          width: '100',
          show: true
        }, {
          prop: 'payeeName',
          label: '领用人',
          width: '120',
          align: 'left',
          show: true
        }, {
          prop: 'amount',
          align: 'left',
          label: '借款金额',
          width: '100',
          show: true
        }, {
          prop: 'stateStr',
          label: '状态',
          align: 'left',
          show: true
        }, {
          prop: 'approvalStatesStr',
          align: 'left',
          label: '审批状态',
          width: '100',
          show: true
        }, {
          prop: 'approvalName',
          align: 'left',
          label: '审批人',
          width: '100',
          show: true
        }, {
          prop: 'positionName',
          align: 'left',
          label: '审批岗位',
          width: '100',
          show: true
        }, {
          prop: 'approvalTime',
          align: 'left',
          label: '审批日期',
          width: '100',
          show: true
        }],
        options: [{
          value: '001',
          label: '未完成'
        }, {
          value: '002',
          label: '已完成'
        }],
        value: '',
        /** 表格数据 */
        listData: [],

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
      clearForm () {
        this.wanChengForm = {
          remark: '',
          applyAttachmentReqs: []
        }
      },
      /**
       * 加载
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true;

        if (this.searchDate ) {
          this.query.loanApplyStartTime = this.searchDate[0]
          this.query.loanApplyEndTime = this.searchDate[1]
        } else {
          this.query.loanApplyStartTime = ''
          this.query.loanApplyEndTime = ''
        }
        Api.loanPage(this.query).then(data => {
          this.listData = data.records;
          let _this = this
          this.listData.forEach(function (item) {
            _this.$set(item, 'stateStr', filters.borrowState(item.state))
            _this.$set(item, 'approvalStatesStr', filters.approvalApplyStateFilter(item.approvalStates))
          })
          this.total = data.total;
          this.listLoading = false
        });
      },
      /** 添加申请 */
      newApply: function () {
        this.$router.push({path: '/router/addBorrowApplication'})
      },
      deleteItem (item) {
        this.$confirm('您确定要删除借款记录吗?', '提示', {
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
       * 完成确认
       */
      confirmFinish () {
        this.wanChengForm.id = this.currentItem.id;
        let _this = this
        if (this.fileList.length > 0) {
          _this.wanChengForm.applyAttachmentReqs = []
          this.fileList.forEach(function (item) {
            _this.wanChengForm.applyAttachmentReqs.push({
              name: item.name,
              attachmentUrlKey: item.attachmentUrlKey
            })
          })
        } else {
          if (this.removedAll) {
            this.wanChengForm.applyAttachmentReqs = []
          }
        }
        Api.loanFinish(this.wanChengForm).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '完成成功'
            });
            this.loadData();
            this.dialogWCVisible = false;
          }
        });
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
        this.keyword = ''
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
                a.download = '借款列表数据.xlsx'
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

<style scoped>
</style>

