<template>
  <div>
    <el-row class="sub-header m10">
      <el-col :span="12" class="sub-title">内部包装信息</el-col>
    </el-row>
    <el-table   class="page-table" :data="innerPackagingInfoTasks" style="width: 100%" :cell-style="{color:'#333'}">
      <el-table-column prop="packageBoxSn" label="包装箱号"></el-table-column>
      <el-table-column prop="count" label="数量"></el-table-column>
      <el-table-column prop="insidePackageCount" label="箱内件数"></el-table-column>
      <el-table-column prop="weight" label="毛重（kg）" width="120"></el-table-column>
      <el-table-column prop="billingWeight" label="计费重量"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
    </el-table>
    <el-row type="flex"  class="page-box" justify="end" v-if="operateFlag !== 'task-detail-view'">
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
    name: 'InnerPackageInfo',
    data () {
      return {
        innerPackagingInfoTasks: [],
        proCode: '',
        query: {
          isSelf: '1', // 0：外来箱1：自有箱
          isBudget: '0', // 0 否 1是
          pageNum: 1,
          pageSize: 10
        },
        total: 0
      }
    },
    props: {
      innerBoxData: Array,
      projectCode: String,
      operateFlag: String,
    },
    watch: {
      projectCode: function (value) {
        this.proCode = value
        if (this.proCode) {
          this.loadData()
        }
      },
      innerBoxData: function (value) {
        this.innerPackagingInfoTasks = value
      }
    },
    mounted () {
    },
    methods: {
      loadData: function () {
        this.query.projectCode = this.proCode
        Api.packageList(this.query).then((res) => {
          if (res) {
            this.innerPackagingInfoTasks = res.records
            this.total = res.total
          }
        })
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      }
    }
  }
</script>

<style scoped>

</style>
