<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="add()" v-showBtn data-authorityType="addRole-btn" icon="el-icon-plus">新增岗位</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="查询" icon="search" v-model="query.positionName" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>

    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :formatter="header.formatter" :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button v-showBtn data-authorityType="editRole-btn" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button v-showBtn data-authorityType="deleteRole-btn" type="primary" size="mini" @click="deleteItem(scope.row)">删除</el-button>
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

    <el-dialog
      :title="operateFlag === 'add' ? '新增岗位' : '编辑岗位'"
      :visible.sync="addJobDialog"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="addForm" label-width="120px">
          <el-form-item label="岗位名称:">
            <el-input v-model="addForm.positionName"></el-input>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="onSubmit()">确 定</el-button>
          <el-button type="primary" size="small" @click="addJobDialog=false;addForm.positionName=''">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'

  export default {
    data () {
      return {
        canClick: false,
        //添加和编辑标志
        operateFlag: '',
        addJobDialog: false,
        addForm: {
          positionId: '',
          positionName: ''
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          positionName: ''
        },
        tableHeader: [
          {prop: 'positionName', label: '岗位名称', width: '100', show: true},
          {prop: 'createDt', align: 'center', label: '建立时间', formatter: (val) => moment(val.createDt).format('YYYY-MM-DD HH:mm:ss'), show: true},
          {prop: 'updateDt', align: 'center', label: '更新时间', formatter: (val) => moment(val.updateDt).format('YYYY-MM-DD HH:mm:ss'), show: true}
        ],
        //表格数据
        listData: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false
        // currentItem: ''
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      /** 加载数据 */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.getPositionPage(this.query).then(data => {
          this.listData = data.records
          this.total = data.total
          this.listLoading = false
        })
      },
      /**
       * 提交添加
       * */
      onSubmit () {
        if (!this.addForm.positionName) {
          this.$notify.warning({
            title: '提示',
            message: '请输入岗位名称'
          })
          return
        }

        if (this.operateFlag === 'add') {
          this.confirm()
        } else {
          this.editor()
        }
      },
      add () {
        this.addJobDialog = true
        this.operateFlag = 'add'
      },
      edit (item) {
        this.addJobDialog = true
        this.operateFlag = 'edit'
        this.addForm.positionId = item.positionId
        this.addForm.positionName = item.positionName
      },
      /**
       * 确定编辑
       * */
      editor () {
        Api.updatePosition(this.addForm).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改岗位成功'
            })
            this.addJobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
        // this.editorDialog = false
      },
      /**
       * 删除（停用）信息
       * */
      deleteItem (item) {
        this.$confirm('您确定要删除【' + item.positionName + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let param = {
            positionId: item.positionId,
            delFlag: '1'
          }
          Api.deletePosition(param).then(() => {
            this.loadData()
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })

          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })

        })
      },
      /** 添加数据 */
      confirm: function () {
        const jwt = JSON.parse(sessionStorage.getItem('jwt'))
        this.addForm.ctUId = jwt.uId;

        Api.addPosition(this.addForm).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加岗位成功'
            })
            this.addJobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },
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
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.query.positionName = ''
        this.query.pageNum = 1
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
                a.download = '岗位列表数据.xlsx'
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

