<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-select v-model="query.type" clearable placeholder="文件类型" size="medium" style="width:170px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="请输入文件名称" icon="search" v-model="query.fileName" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'fileName'">
            <router-link :to="{path: '/router/',  query: {id: scope.row.id}}">{{scope.row.fileName}}</router-link>
          </div>
          <div v-else-if="header.prop == 'updateDt'">
            {{scope.row.updateDt | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-showBtn data-authorityType="delete-btn" @click="deleteItem(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" v-showBtn data-authorityType="download-btn" @click="downLoadItem(scope.row)">下载</el-button>

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
        uploadDialog: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          fileName:'',
          type:''
        },
        tableHeader: [{
          prop: 'fileName',
          label: '文件名',
          width: '200',
          show: true
        }, {
          prop: 'projectNo',
          label: '项目编号',
          width: '200',
          align: 'center',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          width: '200',
          align: 'center',
          show: true
        }, {
          prop: 'description',
          label: '文件描述',
          align: 'center',
          show: true
        }, {
          prop: 'size',
          label: '大小',
          align: 'center',
          show: true
        }, {
          prop: 'updateDt',
          align: 'center',
          label: '修改时间',
          width: '150',
          show: true
        }, {
          prop: 'ctUName',
          align: 'center',
          label: '创建者',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        options: [{
          value: '001',
          label: '证件'
        }, {
          value: '文件',
          label: '002'
        }],
        value: '',
      }
    },
    mounted () {
      this.loadData()
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
        Api.filePage(this.query).then(data => {
          if(data){
            this.listData = data.records;
            this.total = data.total
          }
        })
        this.listLoading = false
      },
      deleteItem (item) {
        this.$confirm('您确定要删除记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteFile({id: item.id}).then(data => {
            if(data){
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.loadData()
            }
          })

        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
      },

      downLoadItem (item) {},

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
      canSelected (row, index) {
        if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
          return 0
        } else {
          return 1
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.query.keyword = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
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
    }
  }
</script>

<style scoped>
</style>

