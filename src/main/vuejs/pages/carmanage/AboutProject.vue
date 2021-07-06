<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="项目名称查询" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'createDt'">
            <span>{{scope.row.createDt | timeFormat}}</span>
          </div>
          <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop == 'finishDate'">
            <span>{{scope.row.finishDate | timeFormat}}</span>
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">
            <el-button type="primary" size="small">查看</el-button>
          </router-link>
          <!--<el-button type="primary" size="small" @click="">下载</el-button>-->
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
        dialogVisible: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
        },
        tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          align: 'center',
          width:'150',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          align: 'center',
          show: true
        }, {
          prop: 'stateIdF',
          align: 'center',
          label: '项目状态',
          width: '100',
          show: true
        }, {
          prop: 'createDt',
          label: '建立时间',
          align: 'center',
          show: true
        }, {
          prop: 'finishDate',
          label: '完成时间',
          align: 'center',
          show: true
        }, {
          prop: 'salesman',
          label: '项目负责人',
          align: 'center',
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
    watch: {
      listData: function (list) {
        if (list.length > 0) {
          let _this = this
          this.listData.forEach(function (item) {
            _this.$set(item, 'stateIdF', filters.projectStateFilter(item.stateId))
          })
        }
      }
    },
    mounted () {
      // this.query.carId = this.$route.query.id
      // this.query.license =this.$route.query.registrationNumber
      this.loadData()
    },
    methods: {

      /**
       * 加载列表
       */
      loadData () {
        this.listLoading = true
        // 客户有关项目
        if (this.$route.path === '/router/customerAboutProject') {
          Api.queryProjectsByCustomerId({id: this.$route.query.id,projectName: this.query.name}).then((res) => {
            if (res) {
              // this.listData = res.records
              this.listData = res
            }
          })
        } else if (this.$route.path === '/router/aboutProject') {
          // 车辆有关项目
          this.query.searchStr = this.query.name
          this.query.license = this.$route.query.registrationNumber //车牌号
          Api.carProjects(this.query).then((res) => {
            if (res) {
              // this.listData = res.records
              this.listData = res.records
              this.total = res.total
            }
          })
        }else if (this.$route.path === '/router/supplierAboutProject' || this.$route.path === '/router/outerWorkerAboutProject') {
          // 供应商有关项目
          const query = this.$route.query
          this.query.supplierId = query.id
          this.query.searchStr = this.query.name //车牌号
          this.query.supplierType = query.type
          Api.supplierProjects(this.query).then((res) => {
            if (res) {
              // this.listData = res.records
              this.listData = res.records
              this.total = res.total
            }
          })
        }
        this.listLoading = false
      },
      addBYInfo () {
        this.$router.push({path: ''})
      },
      columnChange (data) {
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
        this.name = ''
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
          let datas = this.listData
          datas.forEach(function (item) {
            item.stateId = filters.projectStateFilter(item.stateId)
          })
          let param = {
            tableHead: this.tableHeader,
            data: datas
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
      },
    }
  }
</script>

<style scoped>

</style>

