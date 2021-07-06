<template>
  <div>
    <!-- 操作栏 -->
    <el-row type="flex" justify="space-between" :gutter="10" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="newApply" v-showBtn data-authorityType="add-btn" icon="el-icon-plus">报销申请</el-button>
      </el-col>
      <el-col :span="20" class="text-right">
        申请日期：
        <el-date-picker
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
        <el-select v-model="query.state" clearable placeholder="全部状态" size="medium" style="width:120px">
          <el-option
            v-for="(item,index) in stateList"
            :key="index"
            :label="item.cnInfo"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="query.payType" clearable placeholder="付款方式" size="medium" style="width:120px">
          <el-option
            v-for="(item,index) in PayTypeList"
            :key="index"
            :label="item.cnInfo"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="请输入项目/合同编号" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 220px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" 
      :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :fixed="header.fixed"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'no'">
            <router-link :to="{path: '/router/reimburseDetail',query: {id: scope.row.id}}">{{scope.row.no}}</router-link>
          </div>
          <div v-else-if="header.prop == 'payTypeStr'">
            {{scope.row.payTypeStr}}
          </div>
           <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
          <div v-else-if="header.prop === 'id'">
            <router-link :to="{path: '/router/reimburseDetail', query: {id: scope.row.id}}">
             {{scope.row.id}}
          </router-link>
          </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractId, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
          <div v-else-if="header.prop == 'stateStr'">
            {{scope.row.stateStr}}
          </div>
          <div v-else-if="header.prop == 'approvalStatesStr'">
            {{scope.row.approvalStatesStr}}
          </div>
          <div v-else-if="header.prop == 'applyDatetime'">
            {{scope.row.applyDatetime | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'approverDate'">
            {{scope.row.approverDate | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <!-- <router-link :to="{path: '/router/editReimburseApply', query: {id: scope.row.id}}" v-showBtn data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link> -->
          <el-button type="primary" size="mini" @click="deleteReimburse(scope.row)" v-showBtn data-authorityType="delete-btn">删除</el-button>
        
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
    <!--驳回 dialog-->
    <el-dialog
      title="驳回操作"
      :close-on-click-modal="canClick"
      :visible.sync="dialogBHVisible"
      size="small" width="40%">
      <el-form :model="boHuiForm" ref="boHuiForm" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目编号：">
              <span class="info">{{projectCodePage}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回原因：">
              <el-input style="width: 100%"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入驳回原因"
                        v-model="boHuiForm.reason">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogBHVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="reject()">确 定</el-button>
      </div>
    </el-dialog>
    <!--完成 dialog-->
    <el-dialog
      title="完成操作"
      :close-on-click-modal="canClick"
      :visible.sync="dialogWCVisible"
      size="small" width="45%">
      <el-form :model="wanChengForm" ref="wanChengForm" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目编号：">
              <span class="info">{{projectCodePage}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input style="width: 100%"
                        type="textarea"
                        :rows="3"
                        :maxlength="500"
                        show-word-limit
                        placeholder="备注信息"
                        v-model="wanChengForm.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="附件上传：">
              <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="wanChengForm.applyAttachmentReqList"></FileListMultiUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="cancelComplete ">取 消</el-button>
        <el-button type="primary" size="small" @click="complete()">确 定</el-button>
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
        projectCodePage:'',  //弹框回显项目编号
        dialogBHVisible: false,
        dialogWCVisible: false,
        form: {},
        boHuiForm: {
          approvalState:'001',
          reason: ''
        },
        wanChengForm: {
          approvalState:'002',
          remark: '',
          applyAttachmentReqList: []
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          param: '',
          payType: '',
          reimbursementApplyEndDate: '',
          reimbursementApplyStartDate: '',
          state: ''
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
          width:'150',
          fixed:'left',
          show: false,
        },{
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
        },{
          prop: 'customerName',
          label: '客户名称',
          width:'200',
          align: 'left',
          show: true
        },  {
          prop: 'receiptNos',
          label: '发票号',
          align: 'left',
          show: true
        }, {
          prop: 'receiptInfo',
          label: '发票信息',
          align: 'left',
          show: true
        }, {
          prop: 'companyOfReceipt',
          label: '开票公司',
          align: 'left',
          width:'200',
          show: true
        }, {
          prop: 'applyDatetime',
          align: 'left',
          label: '申请时间',
          width: '100',
          show: true
        }, {
          prop: 'payTypeStr',
          align: 'left',
          label: '付款方式',
          width: '100',
          show: true
        }, {
          prop: 'amount',
          align: 'left',
          label: '合计金额',
          width: '100',
          show: true
        }, {
          prop: 'stateStr',
          align: 'left',
          label: '状态',
          width: '100',
          show: true
        }, {
          prop: 'approvalStatesStr',
          align: 'left',
          label: '审批状态',
          width: '100',
          show: true
        }, {
          prop: 'approverName',
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
          prop: 'approverDate',
          align: 'left',
          label: '审批日期',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        /**支付方式下拉*/
        PayTypeList: [],
        /**状态下拉*/
        stateList: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
      }
    },
    mounted () {
      // 获取支付类型字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.PayType) {
          this.PayTypeList = distsObj.PayType.children
        }
      }
      // 获取状态字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.ReimburseState) {
          this.stateList = distsObj.ReimburseState.children
        }
      }

      this.loadData()
    },
    methods: {

      /**
       * 加载
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        if (this.searchDate) {
          this.query.reimbursementApplyStartDate = this.searchDate[0]
          this.query.reimbursementApplyEndDate = this.searchDate[1]
        } else {
          this.query.reimbursementApplyStartDate = ''
          this.query.reimbursementApplyEndDate = ''
        }
        Api.reimbursementApplyPageList(this.query).then(data => {
          this.listData = data.records;
          let _this = this
          this.listData.forEach(function (item) {
            _this.$set(item, 'stateStr', filters.borrowState(item.state))
            _this.$set(item, 'approvalStatesStr', filters.approvalApplyStateFilter(item.approverStates))
            _this.$set(item, 'payTypeStr', filters.payTypeinFilter(item.payType))
          })
          this.total = data.total
          this.listLoading = false
        })
      },
      /** 添加申请 */
      newApply: function () {
        this.$router.push({path: '/router/addReimburseApplication'})
      },

      /***删除**/
      deleteReimburse (item) {
        this.$confirm('您确定要删除编号['+item.no+']的记录信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteReimbursementApply(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },


      /**
       * 驳回
       * */
      reject (item) {
        if(!this.dialogBHVisible){
          this.dialogBHVisible = true
          this.boHuiForm.id = item.id
        }else {
          Api.approvalOperation2(this.boHuiForm).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '驳回操作成功'
              })
              // 跳转回去
              this.dialogBHVisible = false
              this.loadData()
            }
          })
        }
        // this.currentItem = item
      },

      /**
       * 完成
       * */
      complete (item) {
        let _this = this
        if(!this.dialogWCVisible){
          this.dialogWCVisible = true
          this.wanChengForm.id = item.id
          this.projectCodePage = item.projectCode
        }else {
          if (this.fileList.length > 0) {
            _this.wanChengForm.applyAttachmentReqList = []
            this.fileList.forEach(function (item) {
              _this.wanChengForm.applyAttachmentReqList.push({
                name: item.name,
                attachmentUrlKey: item.attachmentUrlKey
              })
            })
          } else {
            if (this.removedAll) {
              this.wanChengForm.applyAttachmentReqList = []
            }
          }
          Api.approvalOperation2(this.wanChengForm).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '完成操作成功'
              })
              // 跳转回去
              this.dialogWCVisible = false
              this.loadData()
            }
          })
        }
        // this.currentItem = item
      },
      cancelComplete () {
        this.dialogWCVisible=false
        this.fileList = []
        this.removedAll = false
        this.wanChengForm = {}
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
                a.download = '报销列表数据.xlsx'
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

