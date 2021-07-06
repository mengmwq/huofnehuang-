<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <router-link :to="{path: '/router/addPost'}" v-showBtn data-authorityType="addPost-btn">
          <el-button type="primary" size="medium" icon="el-icon-plus">添加角色</el-button>
        </router-link>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="查询角色名称" prefix-icon="el-icon-search" icon="search" v-model="query.roleName"
                  @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading"
              :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                       :formatter="header.formatter"
                       :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <router-link v-showBtn data-authorityType="editPost-btn" :to="{path: '/router/editPost', query: {roleId: scope.row.roleId}}">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button type="primary" size="mini" v-showBtn data-authorityType="deletePost-btn" @click="deleteItem(scope.row)">删除</el-button>
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
        query: {
          roleName: '',
          pageSize: 10,
          pageNum: 1
        },
        tableHeader: [{
          prop: 'roleName',
          label: '角色名称',
          width: '200',
          show: true
        }, {
          prop: 'roleDescription',
          label: '描述',
          width: '200',
          align: 'center',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '创建时间',
          width: '150',
          formatter: (val) => moment(val.createDt).format('YYYY-MM-DD HH:mm:ss'),
          show: true
        }, {
          prop: 'updateDt',
          align: 'center',
          label: '修改时间',
          formatter: (val) => moment(val.updateDt).format('YYYY-MM-DD HH:mm:ss'),
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
        multipleSelection: []
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      /**
       * 加载数据
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.getRolePage(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            this.listLoading = false
          }
        }).catch(function () {
          this.listLoading = false
        })
      },

      /**
       * 删除
       */
      deleteItem (item) {
        this.$confirm('您确定要删除记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteRole({
            roleId: item.roleId
          }).then(data => {
            if (data === true) {
              this.loadData()
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
            }
          })
        }).catch(() => {})
      },

      /**
       * size change
       */
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },

      /**
       * current change
       */
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },

      /**
       * selection change
       */
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


