<template>
  <div>
    <!-- 操作栏 -->
    <el-row type="flex" justify="space-between" :gutter="10" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="newApply" v-showBtn data-authorityType="add-btn" icon="el-icon-plus">申请差旅报销</el-button>
      </el-col>
      <el-col :span="20" class="text-right">
        申请日期：<el-date-picker
        v-model="query.travelApplyStartTime"
        size="medium" 
        @change="loadData(null)"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        type="datetime"
        placeholder="选择开始日期">
      </el-date-picker>
        至
        <el-date-picker
        size="medium" 
          v-model="query.travelApplyEndTime"
          @change="loadData(null)"
          type="datetime"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择结束日期">
        </el-date-picker>
        <el-select v-model="query.state" clearable placeholder="全部状态" @change="loadData(null)" size="medium" style="width:120px">
          <el-option v-for="(item, index) in approvalStateList"
                     :key="index"
                     :label="item.cnInfo"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="请输入项目编号/申请人" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop" :fixed="header.fixed" :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'id'">
            <router-link :to="{path: '/router/travelDetails', query: {id: scope.row.id}}">{{scope.row.id}}</router-link>
          </div>
          <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
          <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop == 'startEndTime'">
           {{scope.row.beginDate | timeFormatBid}} ~ {{scope.row.endDate | timeFormatBid}}
          </div>
          <div v-else-if="header.prop == 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'approvalTime'">
            {{scope.row.approvalTime | timeFormat}}
          </div>
          <!--<div v-else-if="header.prop == 'state'">-->
            <!--{{scope.row.state | approvalApplyStateFilter}}-->
          <!--</div>-->
          <div v-else-if="header.prop == 'approvalStates'">
            {{scope.row.approvalStates | approvalStateFilter}}
          </div>
          <div v-else-if="header.prop == 'state'">
            {{scope.row.state | travelVal}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="145" fixed="right">
        <template slot-scope="scope">
          <!-- <router-link :to="{path: '/router/editTravelApply', query: {id: scope.row.id}}" v-showBtn data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link> -->
          <el-button type="primary" size="mini" @click="deleteItem(scope.row)" v-showBtn data-authorityType="delete-btn">删除</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.state !== '002'" @click="complete(scope.row)" >完成</el-button> <!--v-showBtn data-authorityType="complete-btn"-->
          <!--<el-button type="primary" size="mini" @click="audit(scope.row)">审批</el-button>-->
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
                        v-model="wanChengForm.reason">
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
        dialogVisible: false,
        dialogWCVisible: false,
        fileList: [],
        removedAll: false,
        projectCodePage:'',  //弹框回显项目编号
        dealForm: {
          payCompany: '',
          payMoney: '',
          remark: '',
          date: ''
        },
        wanChengForm: {
          id: '',
          reason: '',
          applyAttachmentReqs: []
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          travelApplyStartTime: '',
          travelApplyEndTime: '',
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
        }, {
          prop: 'stateF',
          align: 'left',
          label: '状态',
          width: '90',
          show: true
        }, {
          prop: 'approvalStatesF',
          align: 'left',
          label: '审批状态',
          width: '90',
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
          label: '审批时间',
          width: '150',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 10,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        approvalStateList: []
      }
    },
    mounted () {
      if (sessionStorage.getItem('dists')) {
        let dists = JSON.parse(sessionStorage.getItem('dists'));
        if (dists.ApprovalState) {
          this.approvalStateList = dists.ApprovalState.children
        }
      }
      this.loadData()
    },
    methods: {

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
        Api.travelPageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'approvalStatesF', filters.approvalStateFilter(item.approvalStates))
              _this.$set(item, 'stateF', filters.travelValState(item.state))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      audit (item) {
        this.$router.push({path: '/router/travelApproval', query: {id: item.id}})
      },
      /** 添加 */
      newApply: function () {
        this.$router.push({path: '/router/addTravelApplication'})
      },
      deleteItem (item) {
        this.$confirm('您确定要删除【 ' + item.id + ' 】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteTravel({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.loadData()
            }
          })

        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
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
          Api.finishTravel(this.wanChengForm).then(data => {
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
      tablestateChange (val) {
        this.tablestate = val
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
                a.download = '差旅列表数据.xlsx'
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

