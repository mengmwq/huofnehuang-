<template>
  <div>

    <div  v-if="typeShow=== 'detail'">
      <ContractApprovalInfo :info="form1"></ContractApprovalInfo>
      <div class="title">附件信息 <div class="line"></div></div>
      <ol style="padding: 0 4%">
        <li v-for="(item, index) in fileList" :key="index"   >
          <span>{{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
          <span v-if="item.key" style="margin-left:40px;" @click="showFileDetails(item.key)">
            <el-button type="primary"  size="mini"   v-if="isHasImg(item.key)">预览图片</el-button>
            <el-button type="primary"  size="mini"  v-else-if="item.key.indexOf('pdf')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else>下载文件</el-button>
          </span>
        </li>
      </ol>
      <ImgPreview
        :pictures="pictures"
        :isShowDialog="isShowDialogImg"
        :isFullscreen="false"
        v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    </div>
    <div v-else>
      <el-form label-position="right" :model="form" :rules="rules1" ref="form" label-width="150px">
        <!-- 打印内容开始 -->
        <div class="print-data">

          <div class="title">申请信息
            <div class="line"></div>
          </div>
          <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
          <div class="dash-content">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目编号：" prop="projectCode">
                  <el-select filterable v-model="form.projectCode" 
                  remote
                    :remote-method="remoteMethod"
                  clearable placeholder="项目名称/编号/客户名称" size="medium" style="width:100%">
                    <el-option
                      v-for="item in projectList"
                      :key="item.projectCode"
                      :label="item.projectCode"
                      :value="item.projectCode">
                      <span style="float: left">{{ item.projectCode }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同号：" prop="contractCode" :rules="[rules.required]">
                  <el-input v-model="form.contractCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标题：" prop="title">
                  <el-input v-model="form.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门：" prop="orgId" :rules="[rules.required]">
                  <el-select filterable v-model="form.orgId" placeholder="请选择部门" size="medium" style="width:100%">
                    <el-option :value="orgId" :label="orgName" style="height: 300px;overflow-y: scroll;padding: 0">
                      <el-tree
                        :data="treeData"
                        default-expand-all
                        show-checkbox
                        node-key="orgId"
                        ref="orgTree"
                        :props="{label: 'orgName', children: 'childrens'}"
                        :check-strictly="true"
                        @check-change="handleClick"
                        @node-click="nodeClick">
                      </el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="对象类型：" prop="contractTargetType" :rules="[rules.required]">
                  <el-select filterable v-model="form.contractTargetType" @change="selectProject" clearable placeholder="请选择象类型" size="medium" style="width:100%">
                    <el-option
                      v-for="item in contractTargetTypeList"
                      :key="item.value"
                      :label="item.cnInfo"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同对象："  prop="contractTargetId" :rules="[rules.required]">
                  <el-select filterable v-model="form.contractTargetId" clearable placeholder="请选择合同对象" size="medium" style="width:100%">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同名称：" prop="contractName" :rules="[rules.required]">
                  <el-input v-model="form.contractName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同类型：" prop="contractTypeId" >
                  <el-select filterable v-model="form.contractTypeId" clearable placeholder="请选择合同类型" size="medium" style="width:100%">
                    <el-option
                      v-for="item in contractType"
                      :key="item.cnInfo"
                      :label="item.cnInfo"
                      :value="item.cnInfo">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同期限：" prop="contractLimit" :rules="[rules.required]">
                  <el-date-picker v-model="form.contractLimit" type="datetime"
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd" placeholder="选择合同期限" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同金额："  >
                  <el-input placeholder="填写数字" v-model="form.contractPrice"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="申请日期：" prop="applyDate" :rules="[rules.required]">
                  <el-date-picker type="date" placeholder="请选择日期" v-model="form.applyDate"
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="省份：" prop="provinceId" :rules="[rules.required]">
                  <el-input v-model="form.provinceId"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="合同摘要：" prop="outline" :rules="[rules.required]">
                  <el-input type="textarea" v-model="form.outline" :rows="4" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="对方单位名称1：" prop="company1Name" :rules="[rules.required]">
                  <el-input v-model="form.company1Name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信用代码证号1：" prop="company1CreditCode" :rules="[rules.required]">
                  <el-input v-model="form.company1CreditCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="对方单位名称2：" prop="company2Name">
                  <el-input v-model="form.company2Name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信用代码证号2：" prop="company2CreditCode" >
                  <el-input v-model="form.company2CreditCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="外来合同编号：" prop="foreignContractNumber" >
                  <el-input  v-model="form.foreignContractNumber"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remarks">
                  <el-input type="textarea" v-model="form.remarks" :rows="4" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding: 10px;">
              <el-col :span="10">
                <!--<el-form-item label="合同附件：">
                  <el-upload
                    class="upload-demo"
                    :action="'https://up-z0.qiniup.com'"
                    :data="uploadData"
                    :limit="1"
                    :on-remove="handleRemove"
                    :on-success="uploadSuccess"
                    :on-change="onUploadChange"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>-->
                <el-form-item label="附件上传：">
                  <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.applyAttachmentReqs"></FileListMultiUpload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- <p class="step-title"><span class="step-icon">2</span>运输线路：</p>
          <div class="dash-content" style="padding: 0 20px;">
            <el-table class="page-table" :data="form.agreementPriceReqs" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
            >
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'name'">
                    <el-input v-model="scope.row.goodsName"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'from'">
                    <el-input v-model="scope.row.from"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'to'">
                    <el-input v-model="scope.row.to"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'transportationModeId'">
                    <el-select filterable v-model="scope.row.transportationModeId" clearable placeholder="请选择运输方式" size="medium" style="width:100%">
                      <el-option v-for="(item, index) in transportationMode" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <div v-else-if="header.prop == 'agreementPrice'">
                    <el-input placeholder="填写数字" v-model="scope.row.agreementPrice"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'currency'">
                    <el-select filterable v-model="scope.row.currencyId" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                      <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column align="left">
                <template slot="header" slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addItem"></el-button>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-minus"
                    @click="() => {form.agreementPriceReqs.splice(scope.$index, 1)}"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div> -->
          <p class="step-title"><span class="step-icon">2</span>流程设置：</p>
          <div style="padding: 0 20px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="审批流程：" prop="definitionAppProcessId" :rules="[rules.required]">
                  <el-select filterable v-model="form.definitionAppProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                    <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

          </div>
        </div>
        <!-- 打印内容结束 -->
        <div class="footer m10">
          <el-button type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
          <el-button type="primary" size="medium" v-if="!this.$route.query.type" @click="submitForm('form')">提 交</el-button>
          <el-button type="primary" size="medium" v-if="!this.$route.query.type" @click="submitAddCreate('form')">提交后继续创建</el-button>
        </div>
        <div style="clear: both"></div>
      </el-form>
    </div>

    
  </div>

</template>

<script>
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import ContractApprovalInfo from '@/pages/approval/ContractApprovalInfo'
  import moment from 'moment'
  import Api from '@/api/index'
  import rules from '@/utils/rules'
import ImgPreview from '@/components/common/ImgPreview'
  export default {
    name:'AddContracts',
    components: {
      FileListMultiUpload,
      ContractApprovalInfo,
      ImgPreview
    },
    data () {
      const query = this.$route.query
      const projectCode = query.projectCode
      const bidId = query.bidId
      return {
         isShowDialogImg:false,
        pictures:null,
        // 判断是入库还是出库
        flag: false,
        removedAll: false,
        //判断添加还是编辑
        operateFlag:'add',

        fileList: [],

        rules: rules,
        rules1:{
          contractPrice: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ]
        },

        type: '',
        form1: {},
        form: {
          appendixUrlKey:'' ,  //合同附件
          applyDate:'' ,  //申请日期
          company1CreditCode:'' ,  //信用代码号1
          company1Name:'' ,  //对方单位名称1
          company2CreditCode:'' ,  //信用代码号2
          company2Name:'' ,  //对方单位名称2
          contractCode:'' ,  //合同号
          contractLimit:'' ,  //合同期限
          contractName:'' ,  //合同名称
          contractPrice:'' ,  //合同金额
          contractTypeId:'' ,  //合同类型
          definitionAppProcessId:'' ,  //审批申请表ID-----------------------无
          foreignContractNumber:'' ,  //外来合同编号
          id:'' ,  //合同主键-------------------------------无
          orgId:'' ,  //组织ID-------------------------------（部门？？？？？）
          outline:'' ,  //合同摘要
          projectCode:projectCode?projectCode:'',  //项目编码
          bidId:bidId?bidId:'', //投标项目ID;
          provinceId:'' ,  //省份ID-------------------------------（省份？？？？？）
          reasonsTermination:'' ,  //终止原因-------------------------无
          remarks:'' ,  //备注
          states:'' ,  //状态-----------------------------------------无
          storageLocation:'' ,  //合同存放地点-----------------------------------------无
          title:'' ,  //标题
          agreementPrice:'' , //  协议价格                   2号表格
          contractId:'' , //  合同ID-----------------------------------------无
          contractTargetId:'',
          currencyId:'' , //  币种ID
          from:'' , //  起点
          goodsName:'' , //  货品名称
          to:'' , //  终点
          transportationModeId:'' , //运输方式id
          agreementPrice:'',
          agreementPriceReqs:[] ,//集合数组
        },
        tableHeader: [{
          prop: 'name',
          align: 'center',
          label: '货物名称',
          width: '100',
          show: true
        }, {
          prop: 'from',
          align: 'center',
          label: '起点',
          width: '100',
          show: true
        }, {
          prop: 'to',
          align: 'center',
          label: '终点',
          width: '100',
          show: true
        }, {
          prop: 'transportationModeId',
          align: 'center',
          label: '运输方式',
          width: '100',
          show: true
        }, {
          prop: 'agreementPrice',
          align: 'center',
          label: '协议价格',
          width: '100',
          show: true
        }, {
          prop: 'currency',
          align: 'center',
          label: '币种',
          width: '100',
          show: true
        },],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        // 运输方式
        transportationMode: [],
        // 币种
        currencyTypeList: [],
        // 审批流程列表
        shenPiList: [],
        // 项目编号
        projectList: [],
        // 合同类型
        contractType: [],
        // 合同对象类型
        contractTargetTypeList: [],
        // 供应商下拉客户下拉战略合作伙伴下拉
        supplierList: [],

        orgId: '',
        orgName: '',
        treeData: [],
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
        typeShow: '' //检测是否为详情页的变量
      }
    },
    mounted () {
      this.typeShow = this.$route.query.type
      this.flag = this.$route.path === '/router/PutInStock'
      // 获取币种字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.TransportationMode) {
          this.transportationMode = distsObj.TransportationMode.children
        }
        if (distsObj.Currency) {
          this.currencyTypeList = distsObj.Currency.children
        }
      }
      // 获取合同类型字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.ContractType) {
          this.contractType = distsObj.ContractType.children
        }
      }

      // 获取合同对象类型字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.ContractTargetType) {
          this.contractTargetTypeList = distsObj.ContractTargetType.children
        }
      }

      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })

      // 项目列表
      this.remoteMethod()
      // Api.projectAll({}).then(data => {
      //   this.projectList = data;
      // })
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      });
      this.loadShenPiList()

      if(this.$route.query.id){
        this.load()
      }
      

    },
    methods: {
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
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
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
      load(){
        Api.contractDetail({id: this.$route.query.id}).then(data => {
          if (data) {
            this.form1 = data
            if (data.contractAttachments && data.contractAttachments.length > 0) {
              this.fileList = data.contractAttachments
            }
          }
        })
      },

          handleClick(data, checked, node){
            if(checked == true){
              this.form.orgId = data.orgId;
              this.orgId = data.orgId;
              this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        }
      },
      nodeClick(data, checked, node){
        this.form.orgId = data.orgId
        this.orgId = data.orgId
        this.orgName = data.orgName
        this.$refs.orgTree.setCheckedNodes([data]);
      },
      /**
       * 获取审批流程下拉数据
       * */
       loadShenPiList () {
        Api.approvalList({category: '1'}).then(data => {
          this.shenPiList = data;
        }).finally(() => {
          this.listLoading = false
        })
      },

      /**
       * 选择合同对象id
       */
      selectProject (val) {
        this.form.contractTargetId  =''
        if(val==='001'){
          // 供应商
          Api.supplierList({pageSize: 666666, pageNum: 1}).then(data => {
            this.supplierList = data.records
          })
        }else if(val==='002'){
          // 客户
          Api.customerList({pageSize: 666666, pageNum: 1}).then(data => {
            this.supplierList = data.records
          })
        }else if(val==='003'){
          // 战略合作伙伴
          Api.partnerList({pageSize: 666666, pageNum: 1}).then(data => {
            this.supplierList = data.records
          })
        }
      },


      /**
       * 表单提交
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _this = this
            if (this.fileList.length > 0) {
              _this.form.contractAttachments = []
              this.fileList.forEach(function (item) {
                _this.form.contractAttachments.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.contractAttachments = []
              }
            }
            if(this.operateFlag==='add'){
              this.add1()
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },

      /** 添加数据 */
      add1: function () {
      this.form.type = '4'
        Api.addContract(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            // 跳转回去
            this.$router.go(-1)
            //this.$router.push({path: '/router/aerialContractsList'})
          }
        })
      },
      addItem () {
        let item = {
          name: '',
          from: '',
          to: '',
          transportationModeId: '',
          agreementPrice: '',
          currency: ''
        }
        this.form.agreementPriceReqs.push(item)
      },

      //提交后继续创建
      submitAddCreate (formName) {
        this.form.applyDate = moment(this.form.applyDate).format('YYYY-MM-DD')
        this.form.contractLimit = moment(this.form.contractLimit).format('YYYY-MM-DD')
        this.form.type = '4'
        Api.addContract(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
          }
        })
        this.form = {}
      },

      cancelSubmit(formName) {
        this.$router.push({path: '/router/aerialContractsList'})
      },
      handleRemove(file, fileList) {
        this.fileList = []
        this.form.appendixUrlKey = ''
      },
      onUploadChange(file) {
        var fileName = file.name;
        if (fileName && fileName.lastIndexOf(".") != -1) {
          var fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      uploadSuccess (res, file, fileList) {
        this.fileList = fileList
        this.form.appendixUrlKey = res.key
        this.form.size = (fileList[0].size/1024).toFixed(1)
      },

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
  .w-trans{
    width: 180px;
  }
</style>
