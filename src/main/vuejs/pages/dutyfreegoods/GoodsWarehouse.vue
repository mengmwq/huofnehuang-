<template>
  <div>
    <div style="padding: 0 15px;">
      <!-- 操作栏 -->
      <el-row :gutter="20" class="m10">
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="small" v-if="stateId !=='045'" v-showBtn data-authorityType="add-btn" @click="add" icon="el-icon-plus">新增</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
            <div v-if="header.prop === 'limitationStart'">
              {{scope.row.limitationStart | timeFormat}}
            </div>
            <div v-else-if="header.prop === 'limitationEnd'">
              {{scope.row.limitationEnd | timeFormat}}
            </div>
            <div v-else-if="header.prop === 'tenantTimeStart'">
              {{scope.row.tenantTimeStart | timeFormat}}
            </div>
            <div v-else-if="header.prop === 'tenantTimeEnd'">
              {{scope.row.tenantTimeEnd | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" v-if="stateId !=='045'">
          <template slot-scope="scope" >
            <el-button type="primary" size="mini" @click="edit(scope.row)" v-showBtn data-authorityType="update-btn" class="btnTop">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteItem(scope.row)" v-showBtn data-authorityType="delete-btn" class="btnTop">删除</el-button>
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
      </el-row>
    </div>

    <el-dialog
      :title="operateFlag === 'add' ? '增加' : '编辑'"
      :visible.sync="JobDialog"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="60%">
      <div>
        <el-form :model="form" ref="form" :rules="rules" class="demo-form-inline" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="签约时效开始" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择时间"  v-model.trim="form.limitationStart" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签约时效结束" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择时间"  v-model.trim="form.limitationEnd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库名称:">
                <el-input v-model.trim="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="承租名称:">
                <el-input v-model.trim="form.tenantName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="承租时间开始" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择时间"  v-model.trim="form.tenantTimeStart" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="承租时间结束" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择时间"  v-model.trim="form.tenantTimeEnd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库成本:">
                <el-input v-model.trim="form.warehouseCost"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租金总额:">
                <el-input v-model.trim="form.totalRent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remarks"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="JobDialog=false">取 消</el-button>
          <el-button type="primary" size="small" @click="onSubmit()">确 定</el-button>
        </div>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment'
  import {GoodsWarehouse} from '@/model/GoodsWarehouse'
  import Api from '@/api/index'
  export default {
    props: {
     projectCode: String,
     stateId:String,
    },
    watch: {
     stateId: function (value) {
      this.stateId = value
    }
   },
    data () {
      return {
        canClick: false,
        //添加和编辑标志
        operateFlag: '',
        //弹窗控制
        JobDialog: false,
        rules: {
          'tel': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^(1[3-9][0-9])[0-9]{8}$/, message: '请输入正确手机号' }
          ],
        },
        form:{
          id:'',
          name:'',
          limitationStart:'',
          remarks:'',
          limitationEnd:'',
          tenantName:'',
          tenantTimeStart:'',
          tenantTimeEnd:'',
          warehouseCost:'',
          totalRent:'',
          remarks:'',
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          projectCode:'',
          nameOrTel:'',     //根据手机号或姓名搜索
        },
        tableHeader: [{
          prop: 'name',
          label: '仓库名称',
          align: 'center',
          show: true
        }, {
          prop: 'limitationStart',
          label: '签约时效开始',
          align: 'center',
          show: true
        }, {
          prop: 'limitationEnd',
          label: '签约时效结束',
          align: 'center',
          show: true
        }, {
          prop: 'tenantName',
          label: '承租名称',
          align: 'center',
          show: true
        }, {
          prop: 'tenantTimeStart',
          label: '承租时间开始',
          align: 'center',
          show: true
        }, {
          prop: 'tenantTimeEnd',
          label: '承租时间结束',
          align: 'center',
          show: true
        }, {
          prop: 'warehouseCost',
          label: '仓库成本',
          align: 'center',
          show: true
        }, {
          prop: 'totalRent',
          label: '租金总额',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        multipleSelection: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        props: {
          projectCode: String,
	    },
      }
    },
    mounted () {
        this.loadData()
    },
    methods: {
      /**加载**/
      loadData () {
        this.listLoading = true
        Api.pageGoodsWarehouse(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },

      /**
       * 提交
       * */
      onSubmit () {
        if (this.operateFlag === 'add') {
          this.confirm()
        } else {
          this.editor()
        }
      },

      /**
       * 确定编辑
       * */
      editor () {
        this.form.tenantTimeStart =  moment(this.form.tenantTimeStart).format('YYYY-MM-DD')
        this.form.tenantTimeEnd =  moment(this.form.tenantTimeEnd).format('YYYY-MM-DD')
        this.form.limitationStart =  moment(this.form.limitationStart).format('YYYY-MM-DD')
        this.form.limitationEnd =  moment(this.form.limitationEnd).format('YYYY-MM-DD')
        Api.updateGoodsWarehouse(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
            this.JobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },

      /** 确认添加 */
      confirm: function () {
        this.form.tenantTimeStart =  moment(this.form.tenantTimeStart).format('YYYY-MM-DD')
        this.form.tenantTimeEnd =  moment(this.form.tenantTimeEnd).format('YYYY-MM-DD')
        this.form.limitationStart =  moment(this.form.limitationStart).format('YYYY-MM-DD')
        this.form.limitationEnd =  moment(this.form.limitationEnd).format('YYYY-MM-DD')
        Api.addGoodsWarehouse(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            this.JobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },

      /**
       * 删除（停用）信息
       * */
      deleteItem (item) {
        this.$confirm('您确定要删除【' + item.name + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.removeGoodsWarehouse(param).then((data) => {
            if (data) {
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

        })
      },

      /**控制弹窗增加与编辑 */
      add () {
        this.JobDialog = true
        this.operateFlag = 'add'
        this.form = new GoodsWarehouse()
      },
      edit (item) {
        this.JobDialog = true
        this.operateFlag = 'edit'
        this.form = item
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
    }
  }
</script>

<style scoped>
</style>
