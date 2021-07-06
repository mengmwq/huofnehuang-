<template>
  <el-dialog title="工资条" :visible.sync="isShowDialog" :before-close="closeDialog" width="50%">
    <div class="searchBar mb10">
      <el-date-picker
      v-model="query.date"
      size="small"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
      <el-button type="primary" @click="search" size="small" class="ml10">查询</el-button>
    </div>
    <el-table
      class="page-table"
     
      :data="salaryPage && salaryPage.result"
      stripe
      highlight-current-row
      v-loading="listLoading"
      :cell-style="{color:'#333'}"
    >
      <template v-for="(header, index) in tableHeader">
        <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :min-width="header.width"
          :column-key="header.prop"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="header.prop == 'title'">
              <a href="javascript:;" @click="showApprovalDetails(scope.row)">{{scope.row.title}}</a>
            </div>
            <div v-else-if="header.prop == 'schedule'">
              <a
                href="javascript:;"
                @click="showApprovalProgress(scope.row)"
                :class="getStyle(scope.row.states)"
              >{{scope.row.schedule}}</a>
            </div>

            <div v-else-if="header.prop == 'createAt'">{{getFormatTime(scope.row.createAt)}}</div>
            <div v-else-if="header.prop == 'approvalTime'">{{getFormatTime(scope.row.approvalTime)}}</div>
            <div v-else-if="header.prop == 'status'">
              <template
                v-if="scope.row.attached"
              >{{scope.row.attached.ContractTemplateStatus_cnInfo}}</template>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作"  width="100" fixed="right">
      </el-table-column>
    </el-table>
    <!-- <el-row type="flex" class="page-box">
      <el-pagination
        background
        @size-change="handleSizeChange"
        :total="salaryPage ? salaryPage.totalCount : 0"
        @current-change="handleCurrentChange"
        layout="total,sizes, ->,prev, pager, next"
        :page-sizes="[10, 25, 50]"
        :page-size="query.pageSize"
        :current-page="salaryPage ? salaryPage.pageNumber : 1"
      ></el-pagination>
    </el-row> -->
  </el-dialog>
</template>
<script>
import Api from '@/api/index'
export default {
  computed: {},
  props: ['isShowDialog', 'editForm'],
  data () {
    return {
      query: {
        pageSize: 200,
        pageNumber: 1,
        keywords: ''
      },
      salaryPage: {
        totalCount: 1,
        result: [
          {
            month: '2019-10-10',
            uName: '张三'
          }
        ]
      },
      listLoading:false,
      tableHeader: [{
        prop: 'month',
        label: '工资月份',
        show: true,
        align: '100'
      }, {
        prop: 'uName',
        label: '姓名',
        align: 'left',
        show: true
      }, {
        prop: 'salary',
        label: '基本工资',
        align: 'center',
        show: true
      }, {
        prop: 'days',
        label: '在职天数',
        align: 'center',
        show: true
      }, {
        prop: 'roleName',
        label: '应发工资',
        align: 'left',
        show: true
      }, {
        prop: 'workId',
        label: '应扣工资',
        align: 'left',
        show: true
      }, {
        prop: 'delFlg',
        label: '实发工资',
        align: 'center',
        show: true
      }, {
        prop: 'remark',
        label: '备注',
        align: 'center',
        show: true
      }]
    }
  },
  mounted () {},
  methods: {
    search () {

    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>
