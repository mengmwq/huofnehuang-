<template>
  <div>
      <el-row class="mb10">
        <el-col :span="12" class="text-left">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add">任务进度</el-button>
        </el-col>
      </el-row>
      <el-table class="page-table" :data="taskProgressData" stripe highlight-current-row :cell-style="{color:'#333'}"
      >
        <el-table-column v-for="(header, index) in progressHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>

          <template slot-scope="scope">

            <div v-if="header.prop == 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="add">添加</el-button>
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>-->

      </el-table>
      <el-row type="flex" class="page-box" justify="end">
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>

    <el-dialog
      :title="operateFlag === 'add' ? '添加任务进度' : '更新任务进度'"
      :visible.sync="JobDialog"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="form" label-width="120px">
          <el-form-item label="项目编号:">
            <span >{{projectCode}}</span>
          </el-form-item>
          <el-form-item label="项目名称:">
            <span >{{projectName}}</span>
          </el-form-item>
          <el-form-item label="完成进度:">
            <el-input v-model="form.progresses"></el-input>
          </el-form-item>
          <el-form-item label="情况说明">
            <el-input type="textarea" v-model="form.explain"></el-input>
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
    data () {
      return {
        canClick: false,
        //添加和编辑标志
        operateFlag: '',
        //弹窗控制
        JobDialog: false,

        total: 0,
        fileListData: [],
        taskProgressData: [],
        multipleSelection: [],
        query: {
          pageNum: 1,
          pageSize: 10,
          taskId: '',
        },
        form:{
          explain:'',
          progresses:'',
          taskId:'',
        },

        progressHeader: [{
          prop: 'taskName',
          label: '任务名称',
          width: '150',
          show: true
        }, {
          prop: 'progresses',
          label: '进度',
          align: 'center',
          show: true
        }, {
          prop: 'userName',
          label: '操作人',
          width: '120',
          align: 'center',
          show: true
        }, {
          prop: 'explain',
          label: '情况说明',
          width: '200',
          align: 'center',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '完成时间',
          width: '120',
          show: true
        }]
      }
    },
    props: {
      projectCode: String,
      projectName: String
    },
    mounted () {
      this.query.taskId = this.$route.query.id
      this.form.taskId = this.$route.query.id
      this.queryTaskProgressData()
    },
    methods: {
      /**
       * 任务进度table数据
       */
      queryTaskProgressData () {
        this.listLoading = true
        Api.taskProgressList(this.query).then(data => {
          if (data) {
            this.taskProgressData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },

      /**
       * 提交
       * */
      onSubmit () {
        if (!this.form.progresses) {
          this.$notify.warning({
            title: '提示',
            message: '请输入项目进度'
          })
          return
        }
        if (!this.form.explain) {
          this.$notify.warning({
            title: '提示',
            message: '请输入情况说明'
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
        // Api.updatePosition(this.form).then(data => {
        //   if (data) {
        //     this.$notify.success({
        //       title: '提示',
        //       message: '修改进度成功'
        //     })
        //     this.JobDialog = false
        //     // 重新渲染页面数据
        //     this.queryTaskProgressData()
        //   }
        // })
      },

      /** 确认添加 */
      confirm: function () {
        Api.addTaskProgress(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加进度成功'
            })
            this.JobDialog = false
            // 重新渲染页面数据
            this.queryTaskProgressData()
          }
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
        // this.editorForm.positionId = item.positionId
        // this.addForm.positionId = item.positionId
        // this.addForm.positionName = item.positionName
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
        // this.keyword = ''
        this.query.pageNum = 1
      },
      handleSizeChange1 (val) {
        this.query.pageSize = val
        this.queryTaskProgressData()
      },
      handleCurrentChange1 (val) {
        this.query.pageNum = val
        this.queryTaskProgressData()
      },
    }
  }
</script>

<style scoped>

</style>
