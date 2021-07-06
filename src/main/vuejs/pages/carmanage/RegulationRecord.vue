<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" v-showBtn data-authorityType="addRegulation-btn" size="medium" @click="dialogVisible=true">+ 添加违章记录</el-button>
      </el-col>
      <el-col :span="14" class="text-right" style="float:right">
        <el-input size="medium" clearable placeholder="违章时间 / 违章地点 / 违章人" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <!-- <template slot-scope="scope">
           <div v-if="header.prop == 'checkStatus'">
             {{scope.row.checkStatus}}
           </div>
           <div v-else-if="header.prop == 'price'">￥ {{scope.row.price}}</div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>-->
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" v-showBtn data-authorityType="delete-btn" size="small" @click="deleteCar(scope.row)">删除</el-button>

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
      title="增加出险记录信息"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      size="tiny" top="12vh" width="50%">
      <div style="text-align: center">
        <el-form :rules="rules" :model="form" ref="form" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号码">
                <span class="info">京A-123455</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="违章日期" prop="violationDatetime">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.violationDatetime" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="违章事由">
                <el-input v-model="form.violationReason"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="违章地点">
                <el-input v-model="form.violationSite"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          <el-col :span="12">
	          <el-form-item label="处理结果">
	            <el-select v-model="form.maintainType" placeholder="选择性质" style="width: 100%">
	              <el-option
	                v-for="item in options"
	                :key="item.value"
	                :label="item.label"
	                :value="item.value">
	              </el-option>
	            </el-select>
	          </el-form-item>
	        </el-col>
            <el-col :span="12">
              <el-form-item label="违章人员">
               <!-- <el-input v-model="form.uId"></el-input>-->
                <el-select v-model="form.uId" placeholder="违章人员" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.uName"
                    :value="item.uId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.violationResult"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitAdd('form')">确 定</el-button>
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
        dialogVisible: false,
        form: {
          carId:'',
          uId:'',
          violationDatetime:''  ,//违章时间（非空
          violationReason:''  ,//违章事由
          violationResult:''  ,//处理结果
          violationSite:''  ,//违章地点
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          param: '',
          carId: ''
        },
        tableHeader: [{
          prop: 'registrationNumber',
          label: '车牌号码',
          align: 'center',
          show: true
        }, {
          prop: 'violationDatetime',
          label: '违章时间',
          align: 'center',
          show: true
        }, {
          prop: 'violationReason',
          align: 'center',
          label: '违章事由',
          width: '100',
          show: true
        }, {
          prop: 'violationSite',
          label: '违章地点',
          align: 'center',
          show: true
        }, {
          prop: 'violationResult',
          label: '处理结果',
          align: 'center',
          show: true
        }, {
          prop: 'uName',
          label: '违章人员',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        userList: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        options: [{
          value: '001',
          label: '保养'
        }, {
          value: '002',
          label: '维修'
        }, {
          value: '003',
          label: '其他'
        }],
        /**表单校验**/
        rules: {
          violationDatetime: [
            { required: true, message: '不为空', trigger: 'blur' }
          ]
        },
      }
    },
    mounted () {
      this.query.carId = this.$route.query.id
      this.form.carId = this.$route.query.id
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
      this.loadData()
    },
    methods: {
      /**校验是否填写数字**/
      isNum (str) {
        if (str) {
          let reg=/^[0-9]*$/;   /**定义验证表达式*/
          return reg.test(str);     /**进行验证*/
        }else {
          return true
        }
      },
      /**
       * 加载智慧领航船舶数据库
       */
      loadData () {
        this.listLoading = true
        Api.violationRdDetailList(this.query).then(data => { //carMaintainDetailList
          this.listData = data.records
          this.total = data.total
          this.listLoading = false
        })
      },
      /**添加操作**/
      submitAdd (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.violationDatetime = moment(this.form.violationDatetime).format('YYYY-MM-DD')
            Api.addViolationRd(this.form).then(data => {
              if (data) {
                this.$notify.success({
                  title: '提示',
                  message: '添加成功',
                })
                this.dialogVisible=false
                this.loadData()
              }
            })
          }
          else {
            this.$message('请完善表单')
          }
        })
      },
      /**删除**/
      deleteCar (i) {
        this.$confirm('您确定要删除该信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: i.id
          }
          Api.deleteViolationRdById(param).then(() => {
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

      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
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
        this.query.param=''
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
      },
    }
  }
</script>

<style scoped>
  .info{display: inline-block;width: 210px;text-align: left;padding-left: 10px}
</style>

