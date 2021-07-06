<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="12">
        <router-link v-if="isEstablish" :to="{path: '/router/createTask', query: {id: projectCode, projectType: projectType, stateId: stateId, type: 'exBudget',}}">
          <el-button type="primary" size="medium" icon="el-icon-plus">新增任务</el-button>
        </router-link>
      </el-col>
      <el-col :span="12" class="text-right">
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop === 'completionDate'">
            {{scope.row.completionDate | timeFormat}}
          </div>
          <div v-else-if="header.prop === 'schedule'">
            {{scope.row.schedule ? scope.row.schedule : '0'}}%
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <router-link :to="{path: '/router/taskDetail', query: {id: scope.row.id, type: scope.row.type, templateType: scope.row.templateType}}">
            <el-button type="primary"  size="mini">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
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
  import Api from '@/api/index'
  export default {
    data () {
      return {
        query: {
          pageSize: 10,
          pageNum: 1,
          projectCode: ''
        },
        total: 0,
        tableHeader: [{
          prop: 'name',
          label: '任务名称',
          width: '120',
          show: true
        }, {
          prop: 'code',
          label: '任务编码',
          width: '120',
          show: true
        }, {
          prop: 'schedule',
          label: '进度',
          align: 'center',
          show: true
        }, {
          prop: 'directorName',
          label: '负责人',
          align: 'center',
          show: true
        }, {
          prop: 'executorName',
          label: '执行人',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'completionDate',
          label: '预计完成时间',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        /** 表格 loading */
        listLoading: false,
        multipleSelection: [],
        isEstablish: false,
        projectType: '',
        stateId: ''
      }
    },
    props: {
      projectCode: String
    },
    watch: {
      projectCode: function(value) {
        this.query.projectCode = value
        if (this.query.projectCode) {
          this.loadData()
        }
      }
    },
    mounted () {
      this.projectType = this.$route.query.projectType
      this.stateId = this.$route.query.stateId
      this.isEstablish = this.$route.query.stateId === '005'
    },
    methods: {
      loadData () {
        Api.projectTaskList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
    }
  }
</script>

<style scoped>

</style>

