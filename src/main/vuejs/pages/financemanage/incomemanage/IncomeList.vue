<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" @click="newApply" icon="el-icon-plus">新增进账通知</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        进账日期：<el-date-picker
        v-model="query.date"
        size="medium"
        type="daterange"
        range-separator="至"
        start-placeholder=""
        end-placeholder="">
      </el-date-picker>
        <el-input size="medium"  clearable placeholder="请输入项目编号/合同号/进账公司" icon="search" v-model="query.keyword" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop" >查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'proNo'">
            <router-link :to="{path: '/router/'}">{{scope.row.proNo}}</router-link>
          </div>

          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path: '/router/editReimburseApply', query: {id: scope.row.id}}">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button type="primary" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="dealIncome(scope.row)">进账处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNumber"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <!--驳回 dialog-->
    <el-dialog
      title="进账处理"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      size="small" width="40%">
      <el-form :model="dealForm" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目编号：">
              <span class="info">FJGsd46541</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="付款公司：">
              <el-input v-model="dealForm.payCompany"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="付款：">
              <el-input v-model="dealForm.payMoney"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="进账时间：">
              <el-date-picker v-model="dealForm.date" type="datetime" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input style="width: 100%"
                        type="textarea"
                        :rows="3"
                        placeholder="备注信息"
                        v-model="dealForm.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogVisible=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import moment from 'moment'
  export default {
    data () {
      return {
        canClick: false,
        dialogVisible: false,
        dealForm: {
          payCompany: '',
          payMoney: '',
          remark: '',
          date: ''
        },
        query: {
          pageSize: 10,
          pageNumber: 1,
          keyword: '',
          type: '',
          caId: '',
          date: ''
        },
        tableHeader: [{
          prop: 'no',
          label: '序号',
          width: '80',
          show: true
        }, {
          prop: 'proNo',
          label: '项目编号',
          align: 'center',
          show: true
        }, {
          prop: 'contractNo',
          label: '合同号',
          align: 'center',
          show: true
        }, {
          prop: 'invoiceNo',
          label: '计划进账时间',
          align: 'center',
          show: true
        }, {
          prop: 'invoiceInfo',
          label: '实际进账时间',
          align: 'center',
          show: true
        }, {
          prop: 'invoiceCompany',
          label: '进账金融',
          align: 'center',
          show: true
        }, {
          prop: 'applyTime',
          align: 'center',
          label: '进账公司名称',
          width: '100',
          show: true
        }, {
          prop: 'payType',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }, {
          prop: 'totalMoney',
          align: 'center',
          label: '审批状态',
          width: '100',
          show: true
        }, {
          prop: 'status',
          align: 'center',
          label: '审批人',
          width: '100',
          show: true
        }, {
          prop: 'auditType',
          align: 'center',
          label: '审批时间',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 10,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {

      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        for (let i = 0; i < 2; i++) {
          this.listData.push({
            no: i + 1,
            proNo: '45jh42',
            contractNo: '5455',
            invoiceNo:'1999-8 10:10',
            invoiceInfo:'1999-8 10:10',
            invoiceCompany:'1000,100',
            applyTime:'大连风气涟起',
            customerName: '上海展厅',
            status: '',
            accountUnit: '单位名称',
            bank: '招商银行',
            bankAccount: '5231224124',
            payType: '现金',
            totalMoney: '20000',
            invoiceType: '专票',
            applyPerson: '张三',
            auditDate: '2019-02-05'
          })
        }
        this.listLoading = false
      },
      /** 添加 */
      newApply: function () {
        this.$router.push({path: '/router/addIncome'})
      },
      deleteItem (item) {
        this.$confirm('您确定要删除记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
      },
      /**
       * 驳回
       * */
      dealIncome (item) {
        this.currentItem = item
        this.dialogVisible = true
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
        this.query.pageNumber = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNumber = val
        this.loadData()
      },

      //转成两位小数
      formatNum(str){
        let newStr = "";
        let count = 0;
        if(str.indexOf(".")===-1){
          for(let i=str.length-1;i>=0;i--){
            // if(count % 3 === 0 && count !== 0){
            //   newStr = str.charAt(i) + "," + newStr;
            // }else{
            newStr = str.charAt(i) + newStr;
            // }
            count++;
          }
          str = newStr + ".0000"; //自动补小数点后四位
          console.log(str)
          this.dealForm.payMoney = str
        }
        else
        {
          for(let i = str.indexOf(".")-1;i>=0;i--){
            // if(count % 3 === 0 && count !== 0){
            //   newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
            // }else{
            newStr = str.charAt(i) + newStr; //逐个字符相接起来
            // }
            count++;
          }
          str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
          console.log(str)
          this.dealForm.payMoney = str
        }
      },


      /**
       * 导出excel
       */
      exportExcel () {
      }
    }
  }
</script>

<style scoped>
</style>

