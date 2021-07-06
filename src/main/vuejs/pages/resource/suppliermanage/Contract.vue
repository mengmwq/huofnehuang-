<template>
    <div>
        <!-- 操作栏 -->
        <el-row :gutter="20" class="m10">
            <el-col :span="24" class="text-right">
                <el-input size="medium" clearable placeholder="按合同名称查询" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
                <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
            </el-col>
        </el-row>
        <!-- table -->
        <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
        >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                 <div v-if="header.prop == 'applyDate'">
                   {{scope.row.applyDate | timeFormat}}
                 </div>
                  <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractId, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
                <div v-else-if="header.prop == 'statesStr'">
                   {{scope.row.statesStr}}
                 </div>
                 <div v-else-if="header.prop == 'amount'">￥ {{scope.row.amount}}</div>
                 <div v-else>{{scope.row[header.prop]}}</div>
               </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <!--<el-button type="primary" size="small" @click="">查看</el-button>-->
                    <el-button type="primary" size="small" v-if="scope.row.appendixUrlKey" @click="downLoadItem(scope.row)">下载</el-button>
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
    </div>
</template>


<script>

import moment from 'moment'
import Api from '@/api/index'
import * as filters from '@/filters/filter'
export default {
  data () {
    return {
      timeRange: '',
      form: {},
      query: {
        pageSize: 10,
        pageNum: 1,
        searchStr: '',
        contractTargetId: '',
        contractTargetType: ''
      },
      tableHeader: [{
        prop: 'contractCode',
        label: '合同编号',
        width: '80',
        align: 'center',
        show: true
      }, {
        prop: 'contractName',
        label: '合同名称',
        align: 'center',
        width: '100',
        show: true
      }, {
        prop: 'projectCode',
        label: '项目编号',
        align: 'center',
        width:'150',
        show: true
      }, {
        prop: 'applyName',
        label: '经办人',
        align: 'center',
        show: true
      }, {
        prop: 'orgName',
        label: '部门',
        width: '150',
        align: 'center',
        show: true
      }, {
        prop: 'contractTypeId',
        align: 'center',
        label: '合同类型',
        width: '120',
        show: true
      }, {
        prop: 'contractLimit',
        label: '合同期限（月）',
        width: '120',
        align: 'center',
        show: true
      }, {
        prop: 'statesStr',
        align: 'center',
        label: '合同状态',
        width: '100',
        show: true
      }, {
        prop: 'ctUName',
        align: 'center',
        label: '申请人',
        width: '100',
        show: true
      }, {
        prop: 'applyDate',
        align: 'center',
        label: '申请日期',
        width: '100',
        show: true
      }],
      /** 表格数据 */
      listData: [],
      /** 总数据数 */
      total: 0,
      /** 表格 loading */
      listLoading: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {

    /**
     * 加载合同列表
     */
    loadData () {
      this.listLoading = true
      this.query.contractTargetId = this.$route.query.id
      // 供应商合同
      if (this.$route.path === '/router/supplierContract') {
         this.query.contractTargetType = '001'
      } else if (this.$route.path === '/router/customerContract') {
        this.query.contractTargetType = '002'
      } else if (this.$route.path === '/router/partnerContract') {
        this.query.contractTargetType = '003'
      }else if (this.$route.path === '/router/outerWorkerContract') {
        this.query.contractTargetType = '004'
      }
      Api.contractPage(this.query).then((res) => {
        if (res) {
          this.listData = res.records
            let _this = this
            this.listData.forEach(function (item) {
                _this.$set(item, 'statesStr', filters.contractStateFilter(item.states))
            })
          this.total = res.total
        }
        this.listLoading = false
      })
    },
    addContracts () {
      this.$router.push({path: '/router/AddContracts'})
    },
    deleteHT (item) {
      this.$confirm('您确定要删除合同记录吗?', '提示', {
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
      this.loadData()
    },
    downLoadItem (item) {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        Api.getUrl(item.appendixUrlKey).then(data => {
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          save_link.download = item.appendixUrlKey;
          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
        });
      } else {
        //window.location.href = data;
        let key = item.appendixUrlKey
        if (key) {
          Api.downloadFile(key).then((res) => {
            if (res) {
              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(res, item.key)
              } else {
                /*var link = document.createElement('a')
                link.href = window.URL.createObjectURL(res)
                link.download = key
                link.click()
                window.URL.revokeObjectURL(link.href)*/
                  const elink = document.createElement('a')
                  elink.download = key
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(res)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href) // 释放URL 对象
                  document.body.removeChild(elink)
              }
            }
          });
        }
      }
    },
    /**
     * 导出excel
     */
    exportExcel () {
      if (this.listData.length > 0) {
        // let temp1
        // temp1 = 'hello'
        // let temp = temp1
        //   temp = temp+"lalal"
        // alert(temp)
        // alert(temp1)

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
              a.download = '合同列表数据.xlsx'
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

