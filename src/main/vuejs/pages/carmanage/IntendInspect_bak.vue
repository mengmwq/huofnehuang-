<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" v-showBtn data-authorityType="addIntendInspect-btn" size="medium" @click="addInfo">+ 添加一日三检表记录</el-button>
      </el-col>
      <el-col :span="14" class="text-right" style="float:right">
        <el-input size="medium" clearable placeholder="填表人查询" icon="search" v-model="query.uName" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                       :formatter="header.formatter"
                       :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip >
        <!-- <template slot-scope="scope">
           <div v-if="header.prop == 'checkStatus'">
             {{scope.row.checkStatus}}
           </div>
           <div v-else-if="header.prop == 'price'">￥ {{scope.row.price}}</div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>-->
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="selectInfo(scope.row)">查看</el-button>
          <el-button type="primary" size="small" @click="downloadFiles(scope.row)">下载</el-button>
          <el-button type="primary" size="small" @click="">打印</el-button>
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
        carId: '',
        registrationNumber: '',
        // uId: '',
        dialogVisible: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          carId: '',
          uName:'',
        },
        tableHeader: [ {
          prop: 'checkDatetime',
          label: '日期',
          align: 'center',
          formatter: (val) => moment(val.checkDatetime).format('YYYY-MM-DD'),
          show: true
        }, {
          prop: 'uName',
          align: 'center',
          label: '填表人',
          show: true
        }
        // , {
        //   prop: 'uId',         //填报人id
        //   align: 'center',
        //   label: '',
        //   show: false
        // }, {
        //   prop: 'id',           //记录id
        //   align: 'center',
        //   label: '',
        //   show: false
        // }, {
        //   prop: 'carId',
        //   align: 'center',
        //   label: '',
        //   show: false
        // }
          ],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.carId = this.$route.query.id
      this.query.carId = this.$route.query.id
      this.registrationNumber = this.$route.query.registrationNumber
      this.loadData()
      // this.form.checkDatetime = moment(this.form.checkDatetime).format('YYYY-MM-DD')
    },
    methods: {

      /**
       * 加载table data
       */
      loadData () {
        this.listLoading = true
        Api.oneDayThirdChecksInfoList(this.query).then(data => {
           if (data) {
             this.listData = data.records
             this.total = data.total
             this.listLoading = false
           }
        })
      },

      //添加-跳转网页
      addInfo () {
        this.$router.push({path: '/router/addIntendInspect',query: {carId: this.carId, registrationNumber: this.registrationNumber}})
      },
      //查看-跳转网页
      selectInfo (row) {
        this.$router.push({path: '/router/selectIntendInspect',query: {carId: row.carId, registrationNumber: row.registrationNumber,id:row.id,select:1}})
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
        this.query.uName = '';
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
      //下载一日三检表
      downloadFiles(row) {
        let param = {
          id:row.id
        }
        Api.downloadCarChecking(param).then((res) => {
        
          if (res) {
            let reader = new FileReader()
            reader.readAsDataURL(res)
            reader.onload = (e) => {
              let a = document.createElement('a')
              a.download = `一日三检表${this.formatDate(row.checkDatetime)}.xlsx`
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          }
        })
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
    },
    filters:{
      formatDate(val){
        return moment(val).format('YYYY-MM-DD')
      },
    }
  }
</script>

<style scoped>

</style>

