<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="查询" icon="search" v-model="query.description" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :formatter="header.formatter"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
           <div v-if="header.prop == 'checkStatus'">
             {{scope.row.checkStatus}}
           </div>
           <div v-else-if="header.prop == 'price'">￥ {{scope.row.price}}</div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>-->
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="">查看</el-button>
          <el-button type="primary" size="small" @click="">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNumber"
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

  export default {
    data () {
      return {
        dialogVisible: false,
        form: {},
        query: {
          delFlg:'',
          errorId: '',
          description:'',
          pageSize: 10,
          pageNum: 1
        },
        tableHeader: [ {
          prop: 'type',
          label: '类型',
          align: 'center',
          show: true
        }, {
          prop: 'name',
          align: 'center',
          label: '文件名称',
          show: true
        }, {
          prop: 'proNo',
          align: 'center',
          label: '项目编号',
          show: true
        }, {
          prop: 'operator',
          align: 'center',
          label: '经办人',
          show: true
        }, {
          prop: 'department',
          align: 'center',
          label: '部门',
          show: true
        }, {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '日期',
          formatter: (val) => moment(val.createDt).format('YYYY-MM-DD HH:MM'),
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
      this.query.errorId = this.$route.query.id;
      this.loadData();
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
        Api.errorAttachmentPage(this.query).then(data => {
          this.listData = data.records;
          this.listLoading = false
        });
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
        this.keyword = ''
        this.query.pageNumber = 1
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
      }
    }
  }
</script>

<style scoped>

</style>

