<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" size="medium" @click="editItem('add')">+ 添加保养信息</el-button>
      </el-col>
      <el-col :span="14" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="时间 / 所做项目 / 服务单位" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope">
           <div v-if="header.prop == 'maintainType'">
             {{scope.row.maintainType === '001' ? '保养' :  (scope.row.maintainType === '002' ? '维修':'其他')}}
           </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
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
            <span > <el-button  type="primary" size="mini" @click="editItem('select',scope.row)">查看</el-button> </span>
          </template>
        </el-table-column>
    </el-table>
    <el-row  type="flex" class="page-box" justify="end">
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
      title="增加维修保养信息"
      :visible.sync="dialogVisible"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="55%">
      <div style="text-align: center">
        <el-form :rules="rules" :model="form" ref="form" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号码">
                <span class="info">{{form.registrationNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择日期"  v-model="form.maintainDate" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本次公里数" prop="currentMileageNumber">
                <el-input placeholder="请输入数字"  v-model="form.currentMileageNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性质">
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
              <el-form-item label="所做项目" prop="maintainContent">
                <el-input v-model="form.maintainContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务单位">
                <el-input v-model="form.serviceCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次保养公里数" prop="nextMileageNumber">
                <el-input placeholder="请输入数字"  v-model="form.nextMileageNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用金额" prop="fee">
                <el-input v-model="form.fee" placeholder="请输入数字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="借款费用金额" prop="fee">
                <el-input v-model="form.fee" placeholder="请输入数字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当事人">
                <el-input v-model="form.party" placeholder="请输入当事人"></el-input>
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
    <el-dialog
      title="查看保养信息"
      :visible.sync="selsetDialogVisible"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="55%">
      <div style="text-align: center">
        <el-form :rules="rules" :model="form" ref="form" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号码：">
                <span class="info">{{form.registrationNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期：" prop="maintainDate">
                <span class="info">{{form.maintainDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本次公里数：" prop="currentMileageNumber">
                <span class="info">{{form.currentMileageNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性质：">
              	<span class="info">{{form.maintainType === '001' ? '保养' :  (form.maintainType === '002' ? '维修':'其他')}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所做项目：" prop="maintainContent">
                <span class="info">{{form.maintainContent}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务单位：">
                <span class="info">{{form.serviceCompany}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次保养公里数：" prop="nextMileageNumber">
                <span class="info">{{form.nextMileageNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用金额：" prop="fee">
                <span class="info">{{form.fee}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当事人：">
                <span class="info">{{form.party}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item label="审批流程：">
                <span class="info">{{form.approvalProcessName}}</span>
              </el-form-item>
             </el-col>
          </el-row>
        <el-table class="page-table" v-if="form.attachmentList && form.attachmentList.length>0"  :data="form.attachmentList" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}">
	        <el-table-column label="序号" type="index" width="80" ></el-table-column>
	        <template v-for="(header, index) in attTableHeader">
	                <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
	                         :align="header.align" :formatter="header.formatter" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
	
	                <template slot-scope="scope">
	                    <div v-if="header.prop == 'createDt'">
	                    {{scope.row.createDt | timeFormat}}
	                    </div>
	                    <div v-else>{{scope.row[header.prop]}}</div>
	                </template>
	                </el-table-column>
	        </template>
	        <el-table-column label="操作">
	            <template slot-scope="scope">
	              <template v-if="scope.row.attachmentUrlKey">
	                <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-if="isHasImg(scope.row.attachmentUrlKey)">预览图片</el-button>
	                <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1">预览PDF</el-button>
	                <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.attachmentUrlKey)">下载文件</el-button>
	              </template>
	            </template>
	        </el-table-column>
        </el-table>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="selsetDialogVisible=false">返回</el-button>
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
  import moment from 'moment'
  import Api from '@/api/index'
  import ApplyCancel from './ApplyCancel'
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
        selsetDialogVisible:false,
        editForm:null,
        form: {
          carId: '',  //车辆ID（非空）
          registrationNumber: '',
          accidentRd:'',  //出险记录ID
          currentMileageNumber:'',  //当前里程数
          fee:'',  //费用
          delFlg:'0',  //删除标志
          maintainContent:'',  //所做项目
          maintainDate:'',  //保养日String
          maintainType:'',  //保养类型001:保养 002:维修
          nextMileageNumber:'',  //下次保养里程数
          serviceCompany:'',  //服务单位
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          carId: '',
          // this.$route.query.cardId'eeb68a56-f115-496d-b68a-56f115c96d47'
          param:''
        },
        isUpload:false,
	    fileList:[],
		removedAll:false,
		attachmentList:[],
        //表格数据
        tableHeader: [{
          prop: 'registrationNumber',
          label: '车牌号码',
          align: 'center',
          show: true
        }, {
          prop: 'ctUName',
          label: '创建人',
          show: true
        }, {
          prop: 'party',
          label: '经办人',
          show: true
        }, {
          prop: 'maintainDate',
          label: '时间',
          align: 'center',
          show: true
        }, {
          prop: 'maintainType',
          label: '性质',
          align: 'center',
          show: true
        }, {
          prop: 'currentMileageNumber',
          label: '本次公里数',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'maintainContent',
          label: '所做项目',
          align: 'center',
          show: true
        }, 
        {
          prop: 'approvalProcessName',
          label: '审批流程',
          show: true
        }, 
        {
          prop: 'serviceCompany',
          label: '服务单位',
          align: 'center',
          width: '100',
          show: true
        }, {
          prop: 'nextMileageNumber',
          align: 'center',
          label: '下次保养公里',
          width: '100',
          show: true
        }, {
          prop: 'fee',
          align: 'center',
          label: '费用金额',
          width: '100',
          show: true
        }, {
          prop: 'id',
          label: '保养id',
          show: false
        }],
		attTableHeader:[{
          prop: 'name',
          label: '文件名称',
          align: 'center',
          show: true
        }, {
          prop: 'createDt',
          label: '上传时间',
          align: 'center',
          show: true
        }],
        //下拉select 001:保养 002:维修
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
        value: '',

        /**表单校验**/
        rules: {
          maintainDate: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          'fee': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          'currentMileageNumber': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'maintainContent': [
            { required: false, message: '', trigger: 'blur' },
          ],
          'serviceCompany': [
            { required: false, message: '', trigger: 'blur' },
          ],
          'nextMileageNumber': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
        },

        /** 表格数据 */
        listData: [],
        approvalList:[], 
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.form.carId = this.$route.query.id
      this.form.attachmentList=[]
      this.query.carId = this.$route.query.id
      this.form.registrationNumber =this.$route.query.registrationNumber
      this.loadData()
      this.getApprovalList()
    },
    methods: {
      //编辑维修保养
      editItem(flag,row){
          
          if(flag=='add'){
              this.form= {
                carId: '',  //车辆ID（非空）
                registrationNumber: '',
                accidentRd:'',  //出险记录ID
                currentMileageNumber:'',  //当前里程数
                fee:'',  //费用
                delFlg:'0',  //删除标志
                maintainContent:'',  //所做项目
                maintainDate:'',  //保养日String	
                maintainType:'',  //保养类型001:保养 002:维修
                nextMileageNumber:'',  //下次保养里程数
                serviceCompany:'',  //服务单位
                attachmentList:[],
              }
              this.isUpload = true
              this.dialogVisible=true
          }else if(flag=='edit'){
             this.form = JSON.parse(JSON.stringify(row))
             this.isUpload = true
             this.dialogVisible=true
          }else{
             this.form = JSON.parse(JSON.stringify(row))
             this.selsetDialogVisible=true
          }
          
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
      /**重新提交**/
      newSubmit (item) {
        this.$confirm('您确定要重新提交【' + item.registrationNumber + '】 维修保养申请吗?', '提示', {
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
        Api.carMaintainDetailList(this.query).then(data => {
          this.listData = data.records
          this.total = data.total
          this.listLoading = false
        })
      },
	  attachmentChange(val){
	      this.form.attachmentList = val
	  },
      /**添加操作**/
      submitAdd (formName) {
        this.$refs[formName].validate((valid) => {
          if (this.form.fee) {
            this.form.fee = parseFloat(this.form.fee).toFixed(2)
          }
          if (valid) {
            /**进行正则表达式的校验**/
            if(!this.isNum(this.form.currentMileageNumber)){
              this.$notify.warning({
                title: '提示',
                message: '请检查【本次公里数】是否填写规范'
              })
              return       //校验失败return返回
            }
            if(!this.isNum(this.form.nextMileageNumber)){
              this.$notify.warning({
                title: '提示',
                message: '请检查【下次保养公里数】是否填写规范'
              })
              return       //校验失败return返回
            }
            let _this = this
            //检测弹窗弹出就确认提交
		    if (this.fileList.length > 0) {
		      _this.form.attachmentList = []
		      this.fileList.forEach(function (item) {
		        _this.form.attachmentList.push({
		          name: item.name,
		          attachmentUrlKey: item.attachmentUrlKey
		        })
		      })
		    } else {
		      if (this.removedAll) {
		        _this.form.attachmentList = []
		      }
		    }
			this.form.carId = this.$route.query.id
            /**校验成功执行下列语句**/
            this.form.maintainDate = moment(this.form.maintainDate).format('YYYY-MM-DD')
            if(!this.form.id){
	            Api.addCarMaintain(this.form).then(data => {
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
            	Api.updateCarMaintain(this.form).then(data => {
	              if (data) {
	                this.$notify.success({
	                  title: '提示',
	                  message: '更新成功',
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
          Api.deleteCarMaintainById(param).then(() => {
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
    // 判断是否图片
    isHasImg(key){
       const aFileType = ['.jpg','.jpeg','.png']
        return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
    },
            //文件预览处理
    showFileDetails(key){
      let img = ''
      Api.getUrl(key).then(data => {
        if (data) {
          if(this.isHasImg(key)){
            //图片预览处理；
             img = data
              this.pictures = []
              this.pictures.push(img)
              this.isShowDialogImg = true
          }else{
            //除图片的其他文件；
               window.open(data)
          }
        }
      })
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

