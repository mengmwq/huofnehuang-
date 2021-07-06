<template>
  <div>
   
      <!-- 打印内容开始 -->
      <div class="print-data">
      
        <!-- <p class="step-title"><span class="step-icon">1</span>基本信息：</p> -->
        <div >
          <el-row>
            <el-col :span="12">
              <el-form-item label="报名方式：" prop="bidProjectReq.signUpType" :rules="[
            { required: true, message: '请选择报名方式', trigger: 'chnage' },
            ]">
                <el-select v-model="form.bidProjectReq.signUpType" clearable placeholder="报名方式" size="medium" style="width: 100%;">
                  <el-option v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="采购方：" prop="bidProjectReq.purchaser" :rules="[
            { required: true, message: '请输入采购方', trigger: 'blur' },
            ]">
                <el-input v-model="form.bidProjectReq.purchaser"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="预算金额：" prop="bidProjectReq.budgetAmount" >
                <el-input v-model="form.bidProjectReq.budgetAmount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="项目内容：">
                <el-input
                  style="width: 100%"
                  type="textarea"
                  :rows="3"
                  maxlength="500"
                  placeholder="请输入项目内容，500字以内"
                  v-model="form.bidProjectReq.projectContet" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="招标编号：" >
                <el-input v-model="form.bidProjectReq.bidCode"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="采购方电话：" prop="bidProjectReq.purchaserTel" :rules="[rules.tel]">
                <el-input v-model="form.bidProjectReq.purchaserTel"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="招标方式：" prop="bidProjectReq.bidType" :rules="[
            { required: true, message: '请输入招标方式', trigger: 'blur' },
            ]">
                <el-input v-model="form.bidProjectReq.bidType"></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="购买标书截止日：" prop="bidProjectReq.deadline" :rules="[
            { required: true, message: '请选择购买标书截止日期', trigger: 'blur' },
            ]">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="请选择日期"
                                v-model="form.bidProjectReq.deadline"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="采购方联系人姓名：">
                <el-input v-model="form.bidProjectReq.purchaserContacter"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="开标时间：" prop="bidProjectReq.bidOpeningDate" :rules="[
            { required: true, message: '请选择开标时间', trigger: 'change' },
            ]">
                <el-date-picker type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="请选择日期"
                                v-model="form.bidProjectReq.bidOpeningDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开标地址：" prop="bidProjectReq.bidOpeningSite" :rules="[
            { required: true, message: '请输入开标地址', trigger: 'blur' },
            ]">
                <el-input v-model="form.bidProjectReq.bidOpeningSite"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代理单位联系人：" prop="bidProjectReq.agent" :rules="[
            { required: false, message: '请输入代理单位联系人', trigger: 'change' },
            ]">
                <el-input v-model="form.bidProjectReq.agent" placeholder="请先选择代理单位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代理单位：" prop="bidProjectReq.agentCompany" :rules="[
            { required: false, message: '请输入代理单位', trigger: 'change' },
            ]">
                <el-select 
                remote
              :remote-method="remoteMethod"
                  filterable v-model="form.bidProjectReq.agentCompany" clearable placeholder="请选择供应商" size="medium" style="width:100%">
                <el-option v-for="item in supplierList" 
                          :key="item.id"
                          @click.native="selectSupplier(item)"
                          :label="item.name"
                          :value="item.name">
                </el-option>
              </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="代理电话：" prop="bidProjectReq.agentTel">
                <el-input  v-model="form.bidProjectReq.agentTel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="包数：" prop="bidProjectReq.packageNumber">
                <el-input v-model="form.bidProjectReq.packageNumber" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报名情况：" prop="bidProjectReq.signUpInfo">
                <el-input  v-model="form.bidProjectReq.signUpInfo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="bidProjectReq.remarks" >
                <el-input
                  style="width: 100%"
                  type="textarea"
                  :rows="3"
                  maxlength="500"
                  placeholder="备注信息，500字以内"
                  v-model="form.bidProjectReq.remarks" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- <p class="step-title"><span class="step-icon">2</span>文件上传：</p> -->
        <div >
          <el-row style="padding: 10px;">
            <el-col :span="24" class="text-right">
              <el-button type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
            </el-col>
          </el-row>
          <div style="padding: 0 10px">
            <el-table class="page-table" :data="form.bidProjectReq.bidAttachmentReqList" stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <div v-if="header.prop == 'key'">
                      {{getDistsKeyName(scope.row.key)}}
                  </div> -->
                  <div v-if="header.prop == 'attchmentTypeId'">
                      {{getDistsKeyName(scope.row.attchmentTypeId)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- <p class="step-title"><span class="step-icon">3</span>流程设置：</p> -->
        <div  style="padding: 10px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批流程：" prop="bidProjectReq.approvalProcessId"  :rules="[
            { required: true, message: '请选择审批流程', trigger: 'change' },
            ]">
                <el-select v-model="form.bidProjectReq.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- <p class="step-title"><span class="step-icon">4</span>完成</p> -->
      </div>
      <!-- 打印内容结束 -->
      
    <file-upload v-show="dialogVisible" :isShowDialog="dialogVisible" :fileTyeArr="bidAttchmentType" :hasCallBack="hasCallBack"
                 :callBackName="callBackName" @getUploadFile="getUploadFile" @closeDialog="closeDialog"></file-upload>

  </div>
</template>

<script>
  import FileUpload from '@/pages/resource/filemanage/FileUpload'
  import moment from 'moment'
  import Api from '@/api/index'
  import rules from '@/utils/rules'

  export default {
    components: {
      'file-upload' : FileUpload
    },
   props:{
      form:{
          type:Object,
          default:function(){
             return {
                bidAttachmentReqList: [],
                bidProjectReq:{
                  agentCompany:'',
                  agent:'',
                  agentTel:'',
                }
      
             }
          },
      }
    },
    // watch:{
    //   'form.bidProjectReq.agentCompany':{
         
    //      handler:function(){

    //       const sItem = this.curSupperInfos
    //        if(sItem){
    //         this.form.bidProjectReq.agent= sItem.name
    //         this.form.bidProjectReq.agentTel= sItem.phone?sItem.phone:sItem.tel
    //       }else{
    //         this.form.bidProjectReq.agent= ''
    //         this.form.bidProjectReq.agentTel= ''
    //       }
    //       },
    //       deep:true
    //    },
    // },
    data () {
      return {
        dialogVisible:false,
        hasCallBack: true,
        callBackName: 'getUploadFile',
        flag: false,
        type: '',
        fileForm: {
        },
        // form: {
        //   bidAttachmentReqList: [],
        //   bidProjectReq:{

        //   },
        // },
        /** 项目列表 */
        projectList: [],
        // 审批流程列表
        shenPiList: [],
        // 投标文件性质
        bidAttchmentType: [],

       /**下拉数据**/
        options: [{
          value: '001',
          label: '网上报名'
        }, {
          value: '002',
          label: '现场报名'
        }],
        /** 表格 loading */
        listLoading: false,
        rules: rules,
        tableHeader1: [{
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, {
          prop: 'attchmentTypeId',
          align: 'center',
          label: '文件类型',
          width: '200',
          show: true
        },  {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          width: '200',
          show: true
        }, {
          prop: 'size',
          align: 'center',
          label: '文件大小',
          width: '100',
          show: true
        }],

        listData1: [],
        supplierList:[],
        curSupperInfos:null,

      }
    },
    mounted () {
      

      // 获取合同类型字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.BidAttchmentType) {
          this.bidAttchmentType = distsObj.BidAttchmentType.children
          console.log(this.bidAttchmentType,'sas')
        }
      }

      this.loadShenPiList()
      /** 获取供应商 */
      this.remoteMethod()

    },
    methods: {
      remoteMethod(query) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              supplierType:'1', //业务供应商
              name:query,  //可以通过名称搜索
          }
          Api.supplierList(params).then(data => {
            this.supplierList = data.records;
          })
          
        }, 200);
      },
      /**
       * 赋值供应商信息
       * */
      selectSupplier (item) {
        console.log(item,'itemm')
        // if(item.contacterInfos){
        //    this.curSupperInfos =item.contacterInfos[0]
        // }
       
        let contacterInfos = item.contacterInfos
        if(item.contacterInfos && item.contacterInfos.length>0){
          this.form.bidProjectReq.agent= item.contacterInfos[0].name
           this.form.bidProjectReq.agentTel= item.contacterInfos[0].phone?item.contacterInfos[0].phone:item.contacterInfos[0].tel
        }else{
          this.form.bidProjectReq.agent= ''
           this.form.bidProjectReq.agentTel= ''
        }
        
      },
      
      getDistsKeyName(key){
        if(key){
          const val = this.bidAttchmentType.filter(item=>item.value==key)[0].cnInfo
          return val?val:''
        }else{
          return '';
        }
      },
      closeDialog () {
        this.dialogVisible = false
      },
      getUploadFile (form){
       console.log(form,'ffff')
        //子组件form 提交过来的参数
        /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
        let _this = this
        this.form.bidProjectReq.bidAttachmentReqList.push({
          name: form.fileName,
          attachmentUrlKey: form.key,
          attchmentTypeId: form.type,
          description: form.description,
          size: _this.renderSize(form.size)
        })


      },
      renderSize(value){
        if(!value){
          return "";
        }
        let unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
        let index=0;
        let srcsize = parseFloat(value);
        index=Math.floor(Math.log(srcsize)/Math.log(1024));
        let size =srcsize/Math.pow(1024,index);
        size=size.toFixed(2);//保留的小数位数
        return size+unitArr[index];
      },
      /**
       * 数据回显
       */
      loadData1 () {
        Api.queryBidProjectById({id:this.$route.query.id}).then(data => {
          if (data) {
            this.form = data
            if (data.bidAttachmentRespList && data.bidAttachmentRespList.length > 0) {

              this.form.bidProjectReq.bidAttachmentReqList = data.bidAttachmentRespList
            } else {
              this.form.bidProjectReq.bidAttachmentReqList = []
            }
          }
        })
      },

      /**
       * 选择项目
       */
    selectProject (val) {
        this.projectList.forEach(item => {
          if (val === item.projectCode) {
            this.form.bidProjectName = item.projectName;
          }
        })
      },
      /**
       * 获取审批流程下拉数据
       * */
      loadShenPiList () {
        Api.approvalList({category: '2'}).then(data => {
          if (data) {
            this.shenPiList = data;
          }
        })
      },

      /**
       *
       */
      loadData () {
        this.listLoading = true

        this.listLoading = false
      },

      addFile () {
        this.dialogVisible = false;
        this.form.bidProjectReq.bidAttachmentReqList.push(this.fileForm);
        this.fileForm = {};
      },

      /**
       * 表单提交
       */
      submitForm (formName) { //addBidProject
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //金额保留两位小数
            if (this.form.budgetAmount) {
              this.form.budgetAmount = parseFloat(this.form.budgetAmount).toFixed(2)
            }
            if (this.$route.query.id) {
              this.edit1()
            } else {
              this.add1()
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },
      //添加
      add1: function () {

        Api.addBidProject(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            // 跳转回去
            this.$router.push({path: '/router/biddingList'})
          }
        })
      },
      //编辑
      edit1: function () {
        delete this.form['bidAttachmentRespList']
        Api.updateBidProject(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
            // 跳转回去
            this.$router.push({path: '/router/biddingList'})
          }
        })
      },

      cancelSubmit(formName) {
        // this.$refs[formName].resetFields();
        // 跳转回去
        this.$router.push({path: '/router/biddingList'})
      }

    }
  }
</script>

<style scoped>
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }

  .footer {
    float: right;
    margin-top: 20px;
  }
</style>
