<template>
  <div>
    <el-form label-position="right" :model="form" ref="form" label-width="190px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称：" prop="name" :rules="[rules.required]">
                <el-input v-model="form.name" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址：" prop="areaAddress">
                <el-cascader placeholder="省市区" style="width: 100%;"
                             :options="options"
                             :props="defaultProps"
                             v-model="form.areaAddress">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="E-MAIL：" prop="email" :rules="[rules.email]">
                <el-input v-model="form.email" maxlength="36"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址：" prop="address" >
                <el-input v-model="form.address" maxlength="160"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司电话：" prop="tel" :rules="[rules.telephone]">
                <el-input v-model="form.tel" placeholder="区号-座机号" maxlength="36"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：" prop="remarks" >
                <el-input v-model="form.remark" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="主要联系人：" prop="contactName" :rules="[rules.contactName]">
                <el-input v-model="form.contactName" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话：" prop="contactTel" :rules="[rules.contactTel]">
                <el-input v-model="form.contactTel" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人职位：" prop="contactPosition" :rules="[rules.contactPosition]">
                <el-input v-model="form.contactPosition" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>资质信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码：" prop="enterpriseCode" >
                <el-input v-model="form.enterpriseCode" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Name：" prop="accountName" >
                <el-input v-model="form.accountName" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行：" prop="depositBank" >
                <el-input v-model="form.depositBank" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Address：" prop="accountAddress" >
                <el-input v-model="form.accountAddress" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="对公账户：" prop="publicAccounts" >
                <el-input v-model="form.publicAccounts" maxlength="36"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Number：" prop="accountNumber" >
                <el-input v-model="form.accountNumber" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业地址：" prop="bankAddress" >
                <el-input v-model="form.bankAddress" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Bank Detail：" prop="bankDetails" >
                <el-input v-model="form.bankDetails" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="税号：" prop="dutyParagraph" >
                <el-input v-model="form.dutyParagraph" maxlength="36"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Swift Code：" prop="swiftCode" >
                <el-input v-model="form.swiftCode" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Remark：" prop="enterpriseRemark" >
                <el-input v-model="form.enterpriseRemark" maxlength="200" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="BSB：" prop="bsb" >
                <el-input v-model="form.bsb" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="12">
              <el-form-item label="GSS ABN：" prop="gssAbn" >
                <el-input v-model="form.gssAbn" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="12">
              <el-form-item label="Certifuicate Number：" prop="certifuicaenumber">
                <el-input v-model="form.certifuicaenumber" maxlength="72"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件上传:" prop="">
                <v-upload :isMultiple="isMultiple" :fileListReqs.sync="fileListReqs"></v-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">3</span>联系人：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'">
                  <el-input v-model="scope.row.name" maxlength="50"></el-input>
                </div>
                <div v-else-if="header.prop == 'tel'">
                  <el-input v-model="scope.row.tel" maxlength="18"></el-input>
                </div>
                <div v-else-if="header.prop == 'position'">
                  <el-input v-model="scope.row.position" maxlength="36"></el-input>
                </div>
                <div v-else-if="header.prop == 'phone'">
                  <el-input v-model="scope.row.phone" maxlength="18"></el-input>
                </div>
                <div v-else-if="header.prop == 'email'">
                  <el-input v-model="scope.row.email" maxlength="36"></el-input>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks" maxlength="100"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addContactItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteContact(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="cancelSubmit('form')">取 消</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 1)">提 交</el-button>
        <el-button v-if="operate=== 'add'" type="primary" size="medium" @click="submitForm('form', 2)">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  import rules from '@/utils/rules'
  import areaData from '@/api/area'
  export default {
    components: {
      'v-upload': Upload
    },
    data () {

      return {
        checkedKeys: [],
        // 文件上传是否可多选
        isMultiple: true,
        fileListReqs: [],
        operate: '',
        flag: false,
        type: '',
        form: {
          orgIds: [],
          customerAttachmentReqs: []
        },
        /** 表格 loading */
        listLoading: false,
        rules: rules,
        uploadFileList: [],
        listData: [],
        tableHeader: [ {
          prop: 'name',
          label: '联系人',
          align: 'center',
          show: true
        }, {
          prop: 'tel',
          label: '电话',
          align: 'center',
          show: true
        }, {
          prop: 'position',
          label: '职位',
          align: 'center',
          show: true
        }, {
          prop: 'phone',
          label: '手机',
          align: 'center',
          show: true
        }, {
          prop: 'email',
          label: 'E-MAIL',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        treeData: [],
        options: [],
        defaultProps: {
          label: 'value',
          children: 'children'
        },
      }
    },
    mounted () {
      this.options = areaData.data
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })
      this.operate = this.$route.path === '/router/editCustomer' ? 'edit' : 'add'
      if (this.operate === 'edit') {
        this.loadData()
      }
    },
    methods: {
      /**
       * 选中
       */
      check: function (data, item) {
        this.form.orgIds = item.checkedKeys
      },
      /**
       * 加载客户详情
       */
      loadData () {
        this.listLoading = true

        Api.customerDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            this.form.customerAttachmentReqs = []
            this.form.areaAddress = [res.country, res.province, res.city]
            if (res.contacterInfos) {
              this.listData = res.contacterInfos
            }
            if (res.orgIds) {
              this.form.orgIds = res.orgIds
              //this.checkedKeys = res.orgIds
              let arr = res.orgIds; //后台返回的id组成的数组
              let newArr = [];
              let _this = this
              arr.forEach(item=>{
                _this.setOrgTreeChecked(item, _this.treeData, newArr)
              })
              this.checkedKeys = newArr;
            }
            // 文件上传数据回显
            this.fileListReqs = res.customerAttachments
            let _this = this
            this.fileListReqs.forEach(function (item) {
              Api.getUrl(item.key).then(data => {
                if (data) {
                  _this.$set(item, 'url', data)
                }
              })
            })
          }
        })
        this.listLoading = false
      },

      setOrgTreeChecked(id, data, newArr){
        let _this = this
        data.forEach(item => {
          if(item.orgId == id){
            if(!item.childrens){
              newArr.push(item.orgId)
            }
          }else{
            if(item.childrens){
              _this.setOrgTreeChecked(id, item.childrens,newArr)
            }
          }
        });
      },
      addContactItem () {
        let item = {
          name: '',
          tel: '',
          position: '',
          email: '',
          phone: '',
          remarks: '',
          type: '002'
        }
        this.listData.push(item)
      },
      deleteContact (index, item) {
        this.listData.splice(index, 1)
      },
      /**
       * 表单提交
       */
      submitForm (formName, tag) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 联系人信息
            if (this.listData.length > 0) {
              this.form.contacterInfoReqList = this.listData
            }
            if (this.form.areaAddress) {
              let areaAddress = this.form.areaAddress
              this.form.country = areaAddress[0]
              this.form.province = areaAddress[1]
              this.form.city = areaAddress[2]
            }
            if (this.fileListReqs.length > 0) {
              let _this = this
              this.fileListReqs.forEach(function(item){
                _this.form.customerAttachmentReqs.push({
                  id: item.id? item.id: '',
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            }
            if (this.operate === 'add') {
              this.addCustomer(tag)
            } else {
              this.updateCustomer()
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },
      /** 添加客户 */
      addCustomer (tag) {
		this.form.type = this.$route.query.type
        Api.addCustomer(this.form).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '客户添加成功'
            })
            if (tag === 1) {
              // this.$router.push({path: '/router/customerList'})
              this.$router.go(-1)
            } else {
              // 提交后继续创建
              this.isMultiple = true
              this.fileListReqs = []
              this.listData = []
              this.form = {
                orgIds: [],
                customerAttachmentReqs: []
              }
            }
          } else {
            this.$notify.warning({
              title: '提示',
              message: '客户添加失败'
            })
          }
        })
      },
      /** 修改客户 */
      updateCustomer () {
        this.form.id = this.$route.query.id
		this.form.type = this.$route.query.type
        Api.updateCustomer(this.form).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '客户修改成功'
            })
            // this.$router.push({path: '/router/customerList'})
            this.$router.go(-1)
          } else {
            this.$notify.warning({
              title: '提示',
              message: '客户伙伴修改失败'
            })
          }
        })
      },
      cancelSubmit (formName) {
        this.$router.push({path: '/router/customerList'})
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
