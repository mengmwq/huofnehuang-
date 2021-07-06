<template>
  <div>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :formatter="header.formatter" :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop === 'happenTime'">
            {{scope.row.happenTime | timeFormat}}
          </div>
          <div v-else-if="header.prop === 'operType'">
            {{scope.row.operType | logOperateTypeFilter}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="{path: '/router/', query: {id: scope.row.id}}">
            <el-button type="primary" size="mini">详情</el-button>
          </router-link>
        </template>
      </el-table-column>-->
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
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    data () {
      return {
        id: '',
        active: '1',
        taskType: '',
        templateType: '',
        projectType: '',
        projectCode: '',
        projectName: '',
        form: {

        },
        query: {
          pageNum: 1,
          pageSize: 10,
          keyword: '',
          id:'',
          userName:''
        },
        tableHeader: [{
          prop: 'happenTime',
          label: '操作时间',
          align: 'center',
          show: true
        }, {
          prop: 'userName',
          label: '操作人',
          align: 'center',
          show: true
        }, {
          prop: 'operDescription',
          label: '详细操作',
          align: 'center',
          width: '350',
          show: true
        }, {
          prop: 'userAccount',
          label: '用户账号',
          align: 'center',
          show: true
        }, {
          prop: 'userPhone',
          label: '用户手机',
          align: 'center',
          show: true
        }, {
          prop: 'operType',
          label: '操作类型',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: ''
      }
    },
    mounted () {
      this.id = this.$route.query.id
      this.query.id = this.$route.query.id
      this.taskType = this.$route.query.type
      this.templateType = this.$route.query.templateType
      this.loadDataLog()
    },
    methods: {
      /**
       * 加载
       */
      loadDataLog () {
        this.listLoading = true
        this.query.projectCode = this.$route.query.id
        Api.operationLogPageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total=res.total
          }
        })
        this.listLoading = false
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
        this.loadDataLog()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadDataLog()
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
                a.download = '项目日志列表数据.xlsx'
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
