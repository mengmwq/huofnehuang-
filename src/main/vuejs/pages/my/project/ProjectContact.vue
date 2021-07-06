<template>
  <div>
    <div style="padding: 0 15px;">
      <!-- 操作栏 -->
      <el-row :gutter="20" class="m10">
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="small" v-if="stateId !=='045'" v-showBtn data-authorityType="addContact-btn" @click="add" icon="el-icon-plus">新增联系人</el-button>
        </el-col>
        <el-col :span="20" class="text-right" style="float: right">
          <el-input size="small" clearable placeholder="请输入联系人或联系电话" icon="search" v-model="query.nameOrTel" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="loadData" class="btnTop">查询</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <!--<el-table-column prop="联系人"  label="联系人"></el-table-column>-->
        <!--<el-table-column prop="联系电话"  label="联系电话"></el-table-column>-->
        <!--<el-table-column prop="备注"  label="备注"></el-table-column>-->
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" v-if="stateId !=='045'">
          <template slot-scope="scope" >
            <el-button type="primary" size="mini" @click="edit(scope.row)" class="btnTop">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteItem(scope.row)" class="btnTop">删除</el-button>
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
      :title="operateFlag === 'add' ? '增加联系人' : '编辑联系人'"
      :visible.sync="JobDialog"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
          <el-form-item label="联系人:">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="tel">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remarks"></el-input>
          </el-form-item>
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
          projectCode:'',
          remarks:'',
          tel:'',
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          projectCode:'',
          nameOrTel:'',     //根据手机号或姓名搜索
        },
        tableHeader: [{
          prop: 'name',
          label: '联系人',
          width: '120',
          show: true
        }, {
          prop: 'tel',
          label: '联系电话',
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
      if (this.$route.query.id) {
        this.query.projectCode = this.$route.query.id
        this.form.projectCode = this.$route.query.id
        this.loadData()
      }
    },
    methods: {
      /**加载**/

      loadData () {
        this.listLoading = true
        Api.projectlinkmanList(this.query).then(data => {
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
        if (!this.form.name) {
          this.$notify.warning({
            title: '提示',
            message: '请输入联系人姓名'
          })
          return
        }
        if (!this.form.tel) {
          this.$notify.warning({
            title: '提示',
            message: '请输入联系人电话'
          })
          return
        }
        if (!this.form.remarks) {
          this.$notify.warning({
            title: '提示',
            message: '请输入备注'
          })
          return
        }
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
        Api.projectlinkmanUpdate(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改联系人成功'
            })
            this.JobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },

      /** 确认添加 */
      confirm: function () {
        Api.projectlinkmanAdd(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加联系人成功'
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
          Api.projectlinkmanDelete(param).then((data) => {
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
      },
      edit (item) {
        this.JobDialog = true
        this.operateFlag = 'edit'
        // this.editorDialog = true
        this.form.tel = item.tel
        this.form.remarks = item.remarks
        this.form.projectCode = item.projectCode
        this.form.name = item.name
        this.form.id = item.id
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
