<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4"><!---->
        &nbsp;<el-button type="primary" size="medium"  @click="emptyStorage" v-showBtn data-authorityType="useable-btn">可用位置</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right">
        <el-select filterable v-model="query.retrievalFlg" clearable placeholder="状态" size="medium" style="width:150px" @change="loadData">
          <el-option v-for="item in retrievalFlgArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input size="medium" suffix-icon="el-icon-search" clearable placeholder="项目编号/任务名称" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData"  style="width: 310px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'taskType'">
           {{scope.row.taskType | taskTypeFilter}}
          </div>
          <div v-else-if="header.prop == 'projectCode'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
            </div>
            <div v-else-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
          <div v-else-if="header.prop == 'taskName'">
               <router-link :to="{path: '/router/outboundDetails', query: {id: scope.row.taskId, taskType: scope.row.taskType}}">
            {{scope.row.taskName}}
          </router-link>
            </div>
           
          <div v-else-if="header.prop == 'retrievalFlg'">
           {{scope.row.retrievalFlg | retrievalFlgFilter}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" fixed="right">
        <template slot-scope="scope">
          <!-- <router-link :to="{path: '/router/outboundDetails', query: {id: scope.row.taskId, taskType: scope.row.taskType}}">
            <el-button type="primary" size="mini">详情</el-button>
          </router-link> -->
          <!--0代表已入库，已入库了就不能再入库-->
          <router-link v-showBtn data-authorityType="stockIn-btn" v-if="scope.row.taskType === '013' && scope.row.retrievalFlg ==='2'" :to="{path: '/router/StockIn', query: {id: scope.row.taskId}}">
            <el-button type="primary" size="mini">入库</el-button>
          </router-link>
          <!--1代表已出库，已出库了就不能再出库-->
          <router-link v-showBtn data-authorityType="stockOut-btn" v-if="scope.row.taskType === '014' && scope.row.retrievalFlg ==='3'" :to="{path: '/router/StockOut', query: {id: scope.row.taskId}}">
            <el-button type="primary" size="mini">出库</el-button>
          </router-link>
          <el-button v-showBtn data-authorityType="exceptionReport-btn" type="primary" size="mini" @click="reportEx(scope.row)">异常上报</el-button>
          <router-link v-showBtn data-authorityType="approval-btn" v-if="scope.row.taskType === '013' && scope.row.retrievalFlg ==='4'" :to="{path: '/router/stockInAudit', query: {id: scope.row.taskId, taskType: scope.row.taskType}}">
            <el-button type="primary" size="mini">核准</el-button>
          </router-link>
          <router-link v-showBtn data-authorityType="approval-btn" v-if="scope.row.taskType === '014' && scope.row.retrievalFlg ==='4'" :to="{path: '/router/stockOutAudit', query: {id: scope.row.taskId, taskType: scope.row.taskType}}">
            <el-button type="primary" size="mini">核准</el-button>
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

      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <!--驳回 dialog-->
    <el-dialog
      title="异常上报"
      :visible.sync="dialogVisible"
      :close-on-click-modal="canClick"
      size="small" width="40%">
        <el-row class="m10">
          <el-col :span="12">
              <p class="info">项目编号： {{currentItem.projectCode}}</p>
          </el-col>
          <el-col :span="12">
              <p class="info">项目名称： {{currentItem.taskName}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <el-input type="textarea"
                        :rows="4"
                        maxlength="500"
                        show-word-limit
                        placeholder="输入异常描述"
                        v-model="exForm.reason">
              </el-input >
          </el-col>
        </el-row>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogVisible=false;exForm.reason=''">取 消</el-button>
        <el-button type="primary" size="small" @click="submitException()">确 定</el-button>
      </div>
    </el-dialog>
    <StorageEmpty v-if="isShowStorageEmptyDialog" :isShowDialog="isShowStorageEmptyDialog"  @closeDialog="closeDialog"/>
  </div>
</template>


<script>
  import moment from 'moment'
  import StorageEmpty from '@/pages/storage/StorageEmpty'
  import * as filters from '@/filters/filter'
  import Api from '@/api/index'
  export default {
    components: {
      StorageEmpty
    },
    data () {
      return {
        canClick: false,
        isShowStorageEmptyDialog: false, // 可用位置弹窗
        dialogVisible: false,
        exForm: {
          reason: ''
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          retrievalFlg: ''
        },
        tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'150',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          align: 'left',
           width:'200',
          show: true
        },{
          prop: 'customerName',
          label: '客户名称',
           width:'200',
          align: 'left',
          show: true
        },  {
          prop: 'taskName',
          label: '任务名称',
          align: 'center',
          show: true
        }, {
          prop: 'taskTypeF',
          label: '任务类型',
          align: 'center',
          show: true
        }, {
          prop: 'retrievalFlgF',
          align: 'center',
          label: '状态',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        retrievalFlgArr: filters.retrievalFlgArr()
      }
    },
    mounted () {

      this.loadData()
    },
    methods: {

      /**
       * 加载仓储任务列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.stockTaskPageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'taskTypeF', filters.taskTypeFilter(item.taskType))
              _this.$set(item, 'retrievalFlgF', filters.retrievalFlgFilter(item.retrievalFlg))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      deleteInvoice (item) {
        this.$confirm('您确定要删除记录吗?', '提示', {
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
       * 异常上报
       * */
      reportEx (item) {
        this.currentItem = item
        this.dialogVisible = true
      },
      // 确认异常上报
      submitException () {
        this.exForm.taskId = this.currentItem.taskId
        Api.exceptionReport(this.exForm).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '异常上报成功'
            })
            this.dialogVisible = false
            this.loadData()
          } else {
            this.$notify.warning({
              title: '提示',
              message: '异常上报失败'
            })
          }
        })
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
      /** 可用位置 */
      emptyStorage () {
        this.isShowStorageEmptyDialog = true
      },
      /**
       *  密码重设事件改变
       */
      closeDialog () {
        this.isShowDialog = false
        this.isShowStorageEmptyDialog = false
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
                a.download = '仓储任务列表数据.xlsx'
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

