<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" v-showBtn data-authorityType="addInspect-btn" size="medium" @click="addInfo">+ 添加车辆检查</el-button>
      </el-col>
      <el-col :span="14" class="text-right" style="float:right">

        <el-date-picker
          v-model="query.startDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始日期时间">
        </el-date-picker>
        <el-date-picker
          v-model="query.endDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束日期时间">
        </el-date-picker>
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
             {{scope.row.createDt | timeFormat}}
           </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="selectInfo(scope.row.id)">查看</el-button>
          <el-button type="primary" size="small" @click="download(scope.row)">下载</el-button>
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
  export default {
    data () {
      return {
        dialogVisible: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          carId: '',
          // param:''
        },
        tableHeader: [ {
          prop: 'createDt',
          label: '日期',
          align: 'center',
          show: true
        }, {
          prop: 'uName',
          align: 'center',
          label: '填表人',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.query.carId = this.$route.query.id
      this.loadData()
      console.log(this.query.carId)
    },
    methods: {

      /**
       * 加载车辆检测表
       */
      loadData () {
        this.listLoading = true
        Api.queryCarCheckingList(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
          }
          this.listLoading = false
        })
      },
      addInfo () {
        this.$router.push({path: '/router/addCarInspect',query: {carId: this.$route.query.id,registrationNumber: this.$route.query.registrationNumber}})
      },
      selectInfo (id) {
        this.$router.push({path: '/router/addCarInspect',query: {id: id, registrationNumber: this.$route.query.registrationNumber}})
      },
      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
      },
      formartDate(value) {
        let times = '';
        if (value) {
          times = moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return times;
      },
      canSelected(row, index) {
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){
          return 0;
        } else{
          return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.param = '';
        this.query.pageNum = 1;
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
                a.download = '列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      },

      /**
       * 下载
       */
      download(param){
        Api.downloadCarCheckingInfo(param).then((res) => {
          if (res) {
            let reader = new FileReader()
            reader.readAsDataURL(res)
            reader.onload = (e) => {
              let a = document.createElement('a')
              a.download = '车辆检测表.xlsx'
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          }
        })
      },

    }
  }
</script>

<style scoped>

</style>

