<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="品名查询" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <template v-if="$route.query.type==='1'">
        <template  v-for="(header, index) in tableHeaderBiz">
         <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope">
          <div v-if="header.prop === 'delFlgStr'">
            {{scope.row.delFlgStr}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
        </template>
      </template>
       <template v-if="$route.query.type==='0'">
        <template  v-for="(header, index) in tableHeader">
         <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope">
          <div v-if="header.prop === 'delFlgStr'">
            {{scope.row.delFlgStr}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
        </template>
      </template>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.delFlg ==='1'" type="primary" size="mini" @click="updateState(scope.row, '0')">启用</el-button>
            <el-button v-if="scope.row.delFlg ==='0'" type="primary" size="mini" @click="updateState(scope.row, '1')">停用</el-button>
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
      title="编辑供应商品信息"
      :visible.sync="dialogVisible"
      :close-on-click-modal="canClick"
      @close="clearForm"
      size="tiny" top="12vh" width="30%">
      <div>
        <el-form :model="editForm" ref="editForm" label-width="90px">
          <el-form-item :label="$route.query.type==='1'?'服务内容：':'品名：'">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <template v-if="$route.query.type==='0'">
            <el-form-item label="型号：">
                <el-input v-model="editForm.model"></el-input>
              </el-form-item>
              <el-form-item label="规格：">
                <el-input v-model="editForm.specifications"></el-input>
              </el-form-item>

              <el-form-item label="单价：">
                <el-input v-model="editForm.unitPrice"></el-input>
              </el-form-item>
          </template>

          <el-form-item label="备注：">
            <el-input type="textarea" :rows="4" maxlength="500" show-word-limit v-model="editForm.remark"></el-input>
          </el-form-item>
          <div style="margin-top: 20px;text-align: center">
            <el-button type="primary" size="small" @click="cancelUpdate('editForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="onSubmit('editForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  export default {
    data () {
      return {
        canClick: false,
        dialogVisible: false,
        editForm: {},
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          name: '',
          supplierId: ''
        },
        tableHeaderBiz: [{
          prop: 'name',
          label: '服务内容',
          align: 'center',
          show: true
        }, {
          prop: 'remark',
          label: '备注',
          align: 'center',
          show: true
        }],
        tableHeader: [{
          prop: 'name',
          label: '品名',
          width: '100',
          show: true
        }, {
          prop: 'model',
          label: '型号',
          align: 'center',
          show: true
        }, {
          prop: 'specifications',
          label: '规格',
          align: 'center',
          show: true
        }, {
          prop: 'unitPrice',
          label: '单价',
          align: 'center',
          show: true
        }, {
          prop: 'remark',
          label: '备注',
          align: 'center',
          show: true
        }, {
          prop: 'delFlgStr',
          align: 'center',
          label: '启用状态',
          width: '100',
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
      clearForm (){
        this.editForm = {}
        this.loadData()
      },

      /**
       * 加载商品信息列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        this.query.supplierId = this.$route.query.id
        let _this = this
        Api.supplierGoodsList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.listData.forEach(function (item) {
              _this.$set(item, 'delFlgStr', filters.accountDelFilter(item.delFlg))
            })
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      /** 编辑 */
      editItem (item) {
        this.dialogVisible = true
        this.editForm = item
      },
      /** 提交修改 */
      onSubmit (formName) {
        if (!this.editForm.name) {
          this.$notify.warning({
            title: '提示',
            message: '请填写品名'
          })
          return
        }
        Api.updateSupplierGoodsById(this.editForm).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
            this.dialogVisible = false
            this.loadData()
          } else {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
          }
        })
      },
      cancelUpdate (formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      /**
       * 启用和停用
       */
      updateState (item, delFlg) {
        let str = delFlg === '1' ? '停用' : '启用'
        let successStr = delFlg === '1' ? '停用成功' : '启用成功'
        let failStr = delFlg === '1' ? '停用失败' : '启用失败'
        this.$confirm('您确定要' + str + '【 ' + item.name + ' 】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
            delFlg: delFlg
          }
          Api.updateSupplierGoodsById(param).then((res) => {
            if (res) {
              this.listData = res.records
              this.$notify.success({
                title: '提示',
                message: successStr
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: failStr
              })
            }
          })
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
        this.keyword = ''
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
                a.download = '供应商品列表数据.xlsx'
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

