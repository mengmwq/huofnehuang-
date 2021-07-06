<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="输入联系人查询" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
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
      <!--<el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="">查看</el-button>
          <el-button type="primary" size="small" @click="">下载</el-button>
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
          name: '',
          id: '',
        },
        tableHeader: [ {
          prop: 'name',
          label: '联系人',
          align: 'center',
          show: true
        }, {
          prop: 'tel',
          align: 'center',
          label: '联系人电话',
          show: true
        }, {
          prop: 'position',
          align: 'center',
          label: '职位',
          show: true
        }, {
          prop: 'phone',
          align: 'center',
          label: '手机',
          show: true
        }, {
          prop: 'email',
          align: 'center',
          label: 'E-MAIL',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          show: true
        }, {
          prop: 'ctUName',
          align: 'center',
          label: '创建人',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '创建时间',
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
      this.query.id = this.$route.query.id
      this.loadData()
    },
    methods: {

      /**
       * 加载列表数据
       */
      loadData () {
        this.listLoading = true
        // 客户联系人
        if (this.$route.path === '/router/customerContacts') {
          Api.selectCustomerContacters(this.query).then((res) => {
            if (res) {
              this.listData = res.records
              this.total = res.total
            }
          })
        }
        // 战略合作伙伴联系人
        if (this.$route.path === '/router/partnerContacts') {
          Api.selectPartnerContacters(this.query).then((res) => {
            if (res) {
              this.listData = res.records
              this.total = res.total
            }
          })
        }
        //  供应商联系人
        if (this.$route.path === '/router/supplierContacts') {
          Api.contacterPageListBySupplierId(this.query).then((res) => {
            if (res) {
              this.listData = res.records
              this.total = res.total
            }
          })
        }

        this.listLoading = false
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
      }
    }
  }
</script>

<style scoped>

</style>

