<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary"  size="medium" @click="editItem('add')">+ 添加出险记录</el-button>
      </el-col>
      <el-col :span="14" class="text-right" style="float:right">
        <el-input size="medium" clearable placeholder="费用金额" icon="search" v-model="query.fee" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-input size="medium" clearable placeholder="事故时间 / 事故地点" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
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
      <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.row.ctUId===userInfo.uId">
              <el-button v-if="scope.row.approvalStatus==3"  type="primary" size="mini" @click="cancel(scope.row)">撤销</el-button>
              <span v-if="scope.row.approvalStatus==4 || scope.row.approvalStatus==0">
                  <el-button  type="primary" size="mini" @click="editItem('edit',scope.row)">编辑</el-button>
                  <el-button v-if="scope.row.approvalProcessId"  type="primary" size="mini" @click="newSubmit(scope.row)">重新提交</el-button>
                  <el-button  type="primary" size="mini" @click="deleteCar(scope.row)">删除</el-button>
              </span>
            </span>
            
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
        <el-form :model="form" :rules="rules" ref="form" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号码">
                <span class="info">{{form.registrationNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故时间" prop="accidentDatetime">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.accidentDatetime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驾驶员">
                <!-- <el-input v-model="form.userName" maxlength="20"></el-input> -->
                <el-select v-model="form.uId" filterable clearable placeholder="选择驾驶员" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.uName"
                    :value="item.uId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故地点">
                <el-input v-model="form.accidentSite" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理负责人">
                <el-input v-model="form.accidentSite" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故原因">
                <el-input v-model="form.accidentReason" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件性质">
                <el-select v-model="form.nature" filterable clearable placeholder="性质" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in natureList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件进度">
                <el-select v-model="form.progress" filterable clearable placeholder="进度结果" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in progressList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="损失情况">
                <el-input v-model="form.lostInfo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用金额" prop="fee">
                <el-input placeholder="填写数字" v-model="form.fee" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="审批流程：" prop="approvalProcessId">
                <el-select  filterable v-model="form.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in approvalList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row>
            <el-col v-if="isUpload" :span="24">
              <el-form-item label="附件上传：">
                <FileListMultiUpload 
                :fileList.sync="fileList" 
                :removedAll.sync="removedAll" 
                :applyAttachmentReqList="form.attachmentList">
                </FileListMultiUpload>
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
     <!-- 油卡撤销 -->
     <ApplyCancel
      v-if="isShowDialogCancel"
      :isShowDialog="isShowDialogCancel"
      :editForm="editForm"
      @closeDialog="closeDialog"
      @changeDialog="changeDialog"
     ></ApplyCancel>
     
  </div>
</template>


<script>
  import ApplyCancel from './ApplyCancel'
  import moment from 'moment'
  import Api from '@/api/index'
  import FileListMultiUpload from "@/components/common/FileListMultiUpload";
  export default {
    components:{
      ApplyCancel,
      FileListMultiUpload
    },
    data () {
      const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      return {
         userInfo:userInfo,
        isShowDialogCancel:false,
        canClick: false,
        dialogVisible: false,
        editForm:null,
        form: {
          registrationNumber:'',
          accidentDatetime:'', //事故时间（非空） String
          accidentReason:'',  //事故原因
          accidentSite:'',  //事故地点
          carId: '',  //车辆ID（非空）
          fee:'',  //费用
          lostInfo:'', //损失情况
          uId:'' //驾驶员
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          carId: '',
          param:''
        },
        tableHeader: [{
          prop: 'registrationNumber',
          label: '车牌号码',
          align: 'center',
          show: true
        }, {
          prop: 'uName',
          label: '驾驶员',
          align: 'center',
          show: true
        }, {
          prop: 'approvalProcessName',
          label: '审批流程',
          show: true
        }, {
          prop: 'accidentDatetime',
          label: '事故时间',
          align: 'center',
          show: true
        }, {
          prop: 'accidentSite',
          label: '事故地点',
          align: 'center',
          width: '100',
          show: true
        }, {
          prop: 'accidentReason',
          align: 'center',
          label: '事故原因',
          width: '100',
          show: true
        }, {
          prop: 'lostInfo',
          align: 'center',
          label: '损失情况',
          width: '100',
          show: true
        }, {
          prop: 'fee',
          align: 'center',
          label: '费用金额',
          width: '100',
          show: true
        }, {
          prop: 'userName',
          label: '创建人',
          align: 'center',
          show: true
        },],
       progressList: [{
          value: '001',
          label: '保养'
        }, {
          value: '002',
          label: '维修'
        }, {
          value: '003',
          label: '其他'
        }],
        natureList: [{
          value: '001',
          label: '保养'
        }, {
          value: '002',
          label: '维修'
        }, {
          value: '003',
          label: '其他'
        }],
        /** 表格数据 */
        listData: [],
        approvalList:[],
        isUpload:false,
	    fileList:[],
		removedAll:false,
		attachmentList:[],
        userList: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        /**表单校验**/
        rules: {
          accidentDatetime: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          /*fee: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],*/
        },

      }
    },
    mounted () {
      this.form.carId = this.$route.query.id
      this.query.carId = this.$route.query.id
      this.form.registrationNumber = this.$route.query.registrationNumber
      
      this.loadData()
      this.getApprovalList()
      this.getUserList()
    },
    methods: {
      //编辑 出险记录
      editItem(flag,row){
          if(flag=='add'){
              this.form= {
                registrationNumber: this.$route.query.registrationNumber,
                accidentDatetime:'', //事故时间（非空） String
                accidentReason:'',  //事故原因
                accidentSite:'',  //事故地点
                carId: '',  //车辆ID（非空）
                fee:'',  //费用
                lostInfo:'', //损失情况
                uId:'' //驾驶员
              }
              this.isUpload = true
          }else{
             this.form = JSON.parse(JSON.stringify(row))
             this.isUpload = true
          }
          
          this.dialogVisible=true
       },
      //撤销功能
      cancel(item){
         this.isShowDialogCancel = true
         let editForm = {
          id : item.approvalId,
          states : '4',
          withdrawalReasons: '',
          projectName:item.projectName,
        }
          this.editForm = editForm
      },
      /**重新提交**/
      newSubmit (item) {
        this.$confirm('您确定要重新提交【' + item.registrationNumber + '】 出险记录申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.resubmit({id: item.approvalId}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '重新提交成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '重新提交失败'
              })
              this.loadData()
            }
          })
        })
      },
      changeDialog(){
        this.closeDialog()
        this.loadData()
      },
      closeDialog(){
        this.isShowDialog = false;
        this.isShowDialogCancel = false
        this.dialogVisible=false
      },
      getUserList(){
        Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
      },
      //获取审批流程
      getApprovalList(){
        //审批流程
        Api.approvalList({category: '7'}).then(data => {
          this.approvalList = data;
        }).finally(() => {
          this.listLoading = false
        })
      },
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
        Api.accidentRdDetailList(this.query).then(data => {
          this.listData = data.records
          // this.form = data
          this.total = data.total
          this.listLoading = false
        })
      },

      /**添加操作**/
      submitAdd (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          if(!this.form.id){
              /**校验成功执行下列语句**/
              this.form.accidentDatetime = moment(this.form.accidentDatetime).format('YYYY-MM-DD')
              this.form.carId = this.$route.query.id
              Api.addAccidentRd(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '添加成功',
                  })
                  this.dialogVisible=false
                  this.loadData()
                }
              })
            }else{
              this.form.accidentDatetime = moment(this.form.accidentDatetime).format('YYYY-MM-DD')
              Api.updateAccidentRdById(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '修改成功',
                  })
                  this.dialogVisible=false
                  this.loadData()
                }
              })
            }
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
          Api.deleteAccidentRdById(param).then(() => {
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

      addBYInfo () {
        this.$router.push({path: ''})
      },
      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
      },
      formartDate(value) {
        let times = '';
        if (value) {
          times = moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return times;
      },
      canSelected(row, index) {
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){
          return 0;
        } else{
          return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.query.param = '';
        this.query.pageNum = 1;
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

