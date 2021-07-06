<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules1" ref="form" label-width="160px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码：" prop="projectCode" :rules="[rules.required]">
                <el-select disabled filterable v-model="form.projectCode" @change="selectProject" clearable placeholder="项目编码" size="medium" style="width: 100%;">
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectCode"
                    :value="item.projectCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="预算金额：" prop="budgetAmount" >
                <el-input v-model="form.budgetAmount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报名方式：" prop="signUpType" :rules="[rules.required]">
                <el-select v-model="form.signUpType" clearable placeholder="报名方式" size="medium" style="width: 100%;">
                  <el-option v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="招标编号：" prop="bidCode" >
                <el-input v-model="form.bidCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开标时间：" prop="bidOpeningDate" :rules="[rules.required]">
                <el-date-picker type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="请选择日期"
                                v-model="form.bidOpeningDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开标地址：" prop="bidOpeningSite" :rules="[rules.required]">
                <el-input v-model="form.bidOpeningSite"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="招标方式：" prop="bidType" :rules="[rules.required]">
                <el-input v-model="form.bidType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="购买标书截止日期：" prop="deadline" :rules="[rules.required]">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="请选择日期"
                                v-model="form.deadline"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目内容：">
                <el-input
                  style="width: 100%"
                  type="textarea"
                  :rows="3"
                  maxlength="1000"
                  placeholder="请输入项目内容，1000字以内"
                  v-model="form.projectContet" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="代理单位：" prop="agentCompany" >
                <el-input v-model="form.agentCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代理单位联系人：" prop="agent" >
                <el-input v-model="form.agent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代理联系人电话：" prop="agentTel">
                <el-input  v-model="form.agentTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remarks" >
                <el-input
                  style="width: 100%"
                  type="textarea"
                  :rows="4"
                  maxlength="1000"
                  placeholder="备注信息，1000字以内"
                  v-model="form.remarks" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>文件上传：</p>
        <div class="dash-content">
          <el-row style="padding: 10px;">
            <el-col :span="4" class="text-center">
              <el-button type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
            </el-col>
          </el-row>
          <div style="padding: 0 6.5%;">
            <el-table class="page-table" :data="form.bidAttachmentReqList" stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'attchmentTypeId'">
                      {{getDistsKeyName(scope.row.attchmentTypeId)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="cancelSubmit('form')">取 消</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form')">保存</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
    <file-upload v-show="dialogVisible" :isShowDialog="dialogVisible" :fileTyeArr="bidAttchmentType" :hasCallBack="hasCallBack"
                 :callBackName="callBackName" @getUploadFile="getUploadFile" @closeDialog="closeDialog"></file-upload>

  </div>
</template>

<script>
  import SelectApprovalProcess from '@/pages/work/SelectApprovalProcess'
  import FileUpload from '@/pages/resource/filemanage/FileUpload'
  import moment from 'moment'
  import Api from '@/api/index'
  import rules from '@/utils/rules'

  export default {
    components: {
      'file-upload' : FileUpload,
      SelectApprovalProcess,
    },
    data () {
      return {
        dialogVisible:false,
        hasCallBack: true,
        callBackName: 'getUploadFile',
        flag: false,
        type: '',
        fileForm: {
        },
        form: {
          bidAttachmentReqList: []
        },
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
        rules1: {
          packageNumber: [
            { required: true, message: '不为空', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'purchaserTel': [
            { required: true, message: '不为空', trigger: 'blur' },
          ],
          'budgetAmount': [
            { required: true, message: '不为空', trigger: 'blur' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
        },
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

      }
    },
    mounted () {
      if(this.$route.query.id!=null){
        console.log(this.$route.query.id)
        this.loadData1()
      }

      // 获取合同类型字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.BidAttchmentType) {
          this.bidAttchmentType = distsObj.BidAttchmentType.children
        }
      }
      this.loadData()

      // 项目列表
      Api.projectAll({category: '2'}).then(data => {
        this.projectList = data;
      });

    },
    methods: {
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

        //子组件form 提交过来的参数
        /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
        let _this = this
        this.form.bidAttachmentReqList.push({
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

              this.form.bidAttachmentReqList = data.bidAttachmentRespList
            } else {
              this.form.bidAttachmentReqList = []
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
        this.form.bidAttachmentReqList.push(this.fileForm);
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
              this.edit1()
          } else {
            this.$message('请完善表单')
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
            this.$router.go(-1)
          }
        })
      },

      cancelSubmit(formName) {
        this.$router.go(-1)
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
