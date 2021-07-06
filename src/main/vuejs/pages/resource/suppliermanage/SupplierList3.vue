<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="addSupplier" v-showBtn data-authorityType="add-btn" icon="el-icon-plus">新增供应商</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="按名称搜索" icon="search" prefix-icon="el-icon-search" v-model="query.name" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'name'">
            <router-link :to="{path: '/router/supplierDetail',  query: {id: scope.row.id,type:'1',supplierTypes:'3'}}">{{scope.row.name}}</router-link>
          </div>
          <div v-else-if="header.prop == 'createDt'">
            {{scope.row.createDt | DateFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path: '/router/editSupplier', query: {id: scope.row.id,type:'1',supplierTypes:'3'}}" v-showBtn data-authorityType="edit-btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button type="primary" size="mini" @click="deleteItem(scope.row)" v-showBtn data-authorityType="delete-btn">删除</el-button>

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
  import Api from '@/api/index'
  export default {
    name:'SupplierList',
    data () {
      return {
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          name: '',
          type:'1',//供应商类型0:物料供应商,1:业务供应商
          supplierTypes:'3'
        },
        tableHeader: [{
          prop: 'name',
          label: '供应商名称',
          width: '230',
          show: true
        }, {
          prop: 'enterpriseCode',
          label: '统一社会信用代码',
          align: 'center',
           width: '180',
          show: true
        },{
          prop: 'address',
          label: '地址',
          align: 'center',
           width: '250',
          show: true
        }, {
          prop: 'tel',
          label: '公司电话',
          align: 'center',
          width:'120',
          show: true
        }, {
          prop: 'email',
          align: 'center',
          label: 'E-MAIL',
          width: '100',
          show: true
        }, {
          prop: 'nationality',
          label: '国籍',
          align: 'center',
          width:'120',
          show: true
        }, {
          prop: 'grade',
          align: 'center',
          label: '等级',
          width: '100',
          show: true
        }, {
          prop: 'remark',
          label: '备注',
          width: '120',
          align: 'center',
          show: true
        }, {
          prop: 'ctUserName',
          align: 'center',
          label: '创建人',
          width: '100',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '创建时间',
          width: '110',
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
      this.loadData()
    },
    methods: {
      /**
       * 加载供应商列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        let _this = this
        Api.supplierList(this.query).then(res => {
          this.listData = res.records
          this.total = res.total
        })
        this.listLoading = false
      },
      /** 新增供应商 */
      addSupplier: function () {
        this.$router.push({
          path: '/router/addSupplier',
          query:{
            type:'1',
            supplierTypes:'3'
          }
          })
      },
      deleteItem (item) {
        this.$confirm('您确定要删除【 ' + item.name + ' 】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteSupplier({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
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
        this.loadData(val)
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
                a.download = '供应商列表数据.xlsx'
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

