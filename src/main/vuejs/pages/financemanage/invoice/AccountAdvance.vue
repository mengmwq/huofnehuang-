<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="10" class="m10">
      <el-col :span="3">
        <el-button type="primary" size="medium" v-showBtn data-authorityType="add-btn" @click="newApply" icon="el-icon-plus">新建财务</el-button>
      </el-col>
      <el-col :span="21" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="请输入项目/合同编号、客户名称" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 220px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <!-- <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column> -->
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" 
      :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :fixed="header.fixed"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope">
            <div v-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
            <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractCode, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
           <div v-else-if="header.prop == 'payingDate'">
             {{scope.row.payingDate | timeFormat}}
           </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" v-showBtn data-authorityType="delete-btn" size="mini" @click="updateInvoice(scope.row)">编辑</el-button>
          <el-button type="primary" v-showBtn data-authorityType="delete-btn" size="mini" @click="deleteInvoice(scope.row)">删除</el-button>
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
    <!--进账确认-->
    <el-dialog
      title="进账确认"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="canClick"
      @close="clearForm"
      size="tiny" top="12vh" width="40%">
      <div class="bid-audit">
        <el-form :model="form" label-width="100px">
          <el-form-item label="开票编号：">
            <el-select filterable v-model="form.receiptApplyId" placeholder="请选择客户" size="medium" style="width: 100%;">
              <el-option
                      v-for="(item,index) in receiptApplyIds"
                      :key="index"
                      :label="item.id"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="付款公司：" prop="">
            <el-input style="width: 100%" v-model="form.payer"></el-input>
          </el-form-item>
          <el-form-item label="进账金额：" prop="">
            <el-input style="width: 100%" v-model="form.amount"></el-input>
          </el-form-item>
          <el-form-item label="进账时间：">
            <el-date-picker
              v-model="form.payingDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="4"
              :maxlength="500"
              show-word-limit
              placeholder="请输入内容"
              v-model="form.remarks">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 20px" class="text-center">
        <el-button type="primary" size="small" @click="dialogVisible2=false">取 消</el-button>
        <el-button type="primary" size="small" @click="operate2">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  export default {
    components: {
      FileListMultiUpload
    },
    data () {
      return {
        searchDate: '',
        searchDate1: '',
        canClick: false,
        removedAll: false,
        dialogVisible: false,
        dialogVisible2: false,
        form: {
        },
        receiptTypeList:['开票时间','申请时间'],
        query: {
          receiptType:'开票时间',//开票日期类型: 开票时间,申请时间
          param:'',
          receiptState:'',
          receiptApplyStartDate:'',
          receiptApplyEndDate:'',
          receiptStartDate:'',
          receiptEndDate:'',
          pageSize: 10,
          pageNum: 1,
        },
        tableHeader: [
          {
          prop: 'receiptApplyId',
          label: '开票编号',
          align: 'left',
          fixed:'left',
          width:'120',
          show: true
        },{
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'150',
          show: true
        }, 
        {
          prop: 'projectName',
          label: '项目名称',
          align: 'left',
          width:'300',
          show: false,
        },{
          prop: 'customerName',
          label: '客户名称',
          width:'280',
          align: 'left',
          show: true
        }, {
          prop: 'payer',
          label: '付款公司',
          align: 'left',
          show: true
        }, {
          prop: 'amount',
          label: '进账金额',
          align: 'left', 
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          width: '120',
          align: 'left',
          show: true
        }, {
          prop: 'payingDate',
          align: 'left',
          label: '进账时间',
          width: '100',
          show: true
        }],

        options: [{
          value: '001',
          label: '未开票'
        }, {
          value: '002',
          label: '开票中'
        }, {
          value: '003',
          label: '已开票'
        }],
        value: '',

        /** 表格数据 */
        listData: [],
        /** 项目下拉 */
        projectList: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: {},
        fileList: [],
        /** 客户名称下拉 */
        customerListName: [],
        receiptApplyIds:[],
        operateFlag:"",
      }
    },
    mounted () {
      // 客户名称下拉
      Api.customerList({pageNum:'1',pageSize:'10000'}).then(data => {
        this.customerListName = data.records;
      })
      Api.receiptApplyPageList({pageNum:'1',pageSize:'10000'}).then(data => {
        this.receiptApplyIds = data.records;
      })
      this.loadData()
    },
    methods: {
      clearForm () {
        this.form = {
          applyAttachmentReqList: []
        }
        this.fileList = []
        this.removedAll = false
      },
      /** 序号 */
      indexMethod(index){
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
      },
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
        const query = this.query;
        Api.getReceiveMoneyPage(this.query).then(data => {
          this.listData = data.records;
          let _this = this
          this.total = data.total
          this.listLoading = false
        })
      },

      /** 添加申请 */
      newApply: function () {
        this.dialogVisible2 = true
        this.operateFlag = 'add'
      },
      remoteMethod(query='') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              searchStr:query,
              myProjectList:false
          }
          Api.projectList(params).then(res=>{
            console.log(res,'resss')
            this.projectList = res.records
          })
          
        }, 200);
      },
      updateInvoice(item){
      	this.form = item
      	this.dialogVisible2 = true
      },
      /***删除**/
      deleteInvoice (item) {
        this.$confirm('您确定要删除['+item.receiptApplyId+']吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.removeReceiveMoneyById(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },

      /**财务操作*/
      operate (item) {
       if(!this.dialogVisible){
         this.currentItem = item
         this.form.id = item.id
         this.dialogVisible = true
       }else{
         this.$confirm('您确定进行此财务操作吗?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
           let _this = this
           this.currentItem.receiptDate = moment(this.currentItem.receiptDate).format('YYYY-MM-DD')
           if (this.fileList.length > 0) {
             _this.currentItem.applyAttachmentReqList = []
             this.fileList.forEach(function (item) {
               _this.currentItem.applyAttachmentReqList.push({
                 name: item.name,
                 attachmentUrlKey: item.attachmentUrlKey
               })
             })
           } else {
             if (this.removedAll) {
               this.currentItem.applyAttachmentReqList = []
             }
           }
           Api.financialOperations(this.currentItem).then(() => {
             this.$notify.success({
               title: '提示',
               message: '成功'
             })
             this.loadData()
           }).catch(() => {
             this.$notify.warning({
               title: '提示',
               message: '失败'
             })
           })
           this.dialogVisible=false
           this.form = {}
           this.currentItem = {}
         })

       }

      },

      /**进账确认*/
      operate2 (item) {
        this.form.payingDate = moment(this.form.payingDate).format('YYYY-MM-DD')
        if(this.operateFlag === 'add'){
          Api.addReceiveMoney(this.form).then(() => {
	          this.$notify.success({
	            title: '提示',
	            message: '成功'
	          })
	          this.loadData()
	        }).catch(() => {
	          this.$notify.warning({
	            title: '提示',
	            message: '失败'
	          })
	        })
	        this.dialogVisible2 = false
	        this.form = {}
		}else{	
	        Api.updateReceiveMoney(this.form).then(() => {
	          this.$notify.success({
	            title: '提示',
	            message: '成功'
	          })
	          this.loadData()
	        }).catch(() => {
	          this.$notify.warning({
	            title: '提示',
	            message: '失败'
	          })
	        })
	        this.dialogVisible2 = false
	        this.form = {}
      }
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
      canSelected (row, index) {
        if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
          return 0
        } else {
          return 1
        }
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`)
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
                a.download = '发票列表数据.xlsx'
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

