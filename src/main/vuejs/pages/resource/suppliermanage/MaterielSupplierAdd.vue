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
              <el-form-item label="详细地址：" prop="address">
                <el-input v-model="form.address" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司电话：" prop="tel" :rules="[ rules.tel]">
                <el-input v-model="form.tel" placeholder="区号-座机号" maxlength="18"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：" prop="remark">
                <el-input v-model="form.remark" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
           <el-col :span="12">
                 <el-form-item label="国籍：">
                   <el-select v-model="form.nationality" filterable clearable placeholder="请选择国籍">
                        <el-option v-for="(item,index) in countryList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="等级：">
                   <el-select v-model="form.grade" filterable clearable placeholder="请选择等级">
                        <el-option v-for="(item,index) in gradeList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>资质信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码：" prop="enterpriseCode">
                <el-input v-model="form.enterpriseCode" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Name：" prop="accountName">
                <el-input v-model="form.accountName" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行：" prop="depositBank">
                <el-input v-model="form.depositBank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Address：" prop="accountAddress">
                <el-input v-model="form.accountAddress" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="对公账户：" prop="publicAccounts">
                <el-input v-model="form.publicAccounts" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Account Number：" prop="accountNumber">
                <el-input v-model="form.accountNumber" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="银行地址：" prop="bankAddress">
                <el-input v-model="form.bankAddress" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Bank Detail：" prop="bankDetails">
                <el-input v-model="form.bankDetails" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Swift Code：" prop="swiftCode">
                <el-input v-model="form.swiftCode" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Remark：" prop="enterpriseRemark">
                <el-input v-model="form.enterpriseRemark" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="BSB：" prop="bsb">
                <el-input v-model="form.bsb" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="12" :offset="12">
              <el-form-item label="GSS ABN：" prop="gssAbn">
                <el-input v-model="form.gssAbn" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="12">
              <el-form-item label="Certifuicate Number：" prop="certifuicaenumber">
                <el-input v-model="form.certifuicaenumber" maxlength="200"></el-input>
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
        <p class="step-title" v-if="$route.query.type!=0"><span class="step-icon">3</span>供应商服务信息 ：</p>
        <p class="step-title" v-if="$route.query.type==0"><span class="step-icon">3</span>供应商品信息：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="goodsData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
             <template v-if="$route.query.type==0">
                <template v-for="(header, index) in tableHeader">
                  <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'" >
                  <el-input v-model="scope.row.name" maxlength="50"  @blur="checkNull(scope.row.name,1)"></el-input>
                </div>
                <div v-else-if="header.prop == 'model'">
                  <el-input v-model="scope.row.model" maxlength="50"></el-input>
                </div>
                <div v-else-if="header.prop == 'specifications'">
                  <el-input v-model="scope.row.specifications" maxlength="12" @blur="checkNull(scope.row.specifications,2)"></el-input>
                </div>
                <div v-else-if="header.prop == 'unitPrice'" >
                  <el-input v-model="scope.row.unitPrice" maxlength="12" @blur="checkNull(scope.row.unitPrice,3)"></el-input>
                </div>
                <div v-else-if="header.prop == 'remark'">
                  <el-input v-model="scope.row.remark" maxlength="100"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
                </template>
             </template>
             <template v-if="$route.query.type!=0">
               <template v-for="(header, index) in tableHeaderBiz">
               <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'">
                  <el-input v-model="scope.row.name"></el-input>
                </div>
                <div v-else-if="header.prop == 'remark'">
                  <el-input v-model="scope.row.remark"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
             </template>
             </template>
            <el-table-column align="left" width="80">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addSupplierItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteSupplier(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">4</span>联系人：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="listData1" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'" >
                  <el-input v-model="scope.row.name"></el-input>
                </div>
                <div v-else-if="header.prop == 'tel'">
                  <el-input v-model="scope.row.tel"></el-input>
                </div>
                <div v-else-if="header.prop == 'position'">
                  <el-input v-model="scope.row.position"></el-input>
                </div>
                <div v-else-if="header.prop == 'phone'">
                  <el-input v-model="scope.row.phone"></el-input>
                </div>
                <div v-else-if="header.prop == 'email'">
                  <el-input v-model="scope.row.email"></el-input>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="80">
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
        <p class="step-title"><span class="step-icon">5</span>可见权限：</p>
        <div class="dash-content" style="padding: 0 20px;">
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <!--<org-tree :orgIds.sync="form.orgIds" :isMuti="isMuti"></org-tree>-->
                <el-tree
                  :data="treeData"
                  show-checkbox
                  node-key="orgId"
                  ref="orgTree"
                  default-expand-all
                  highlight-current
                  :check-strictly="false"
                  :props="{label: 'orgName', children: 'childrens'}"
                  :default-checked-keys="checkedKeys"
                  @check="check"
                >
                </el-tree>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
         <!-- <p class="step-title"><span class="step-icon">6</span>流程设置：</p>
        <div class="dash-content" style="padding: 0 20px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批流程：" prop="approvalProcessId">
                <el-select filterable v-model="form.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="cancelSubmit('form')">重置</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 1)">提 交</el-button>
        <el-button v-if="operate=== 'add'" type="primary" size="medium" @click="submitForm('form', 2)">提交后继续创建</el-button>
        <el-button type="primary" size="medium" @click="$router.go(-1)">返回</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import OrgTree from '@/pages/resource/OrgTree'
  import rules from '@/utils/rules'
  import Api from '@/api/index'
  import areaData from '@/api/area'
  export default {
    name:'MaterielSupplierAdd',
    components: {
      'v-upload': Upload,
      'org-tree': OrgTree
    },
    data () {
      return {
        treeData: [],
        checkedKeys: [],
        // 文件上传是否可多选
        isMultiple: true,
        fileListReqs: [],
        /** 添加编辑的标志 */
        operate: '',
        type: '',
        form: {
          supplierAttachmentReqs: [],
          orgIds: []
        },
        /** 表格 loading */
        listLoading: false,
        goodsData: [],
        listData1: [],
        tableHeaderBiz: [{
          prop: 'name',
          label: '服务内容',
          align: 'center',
          show: true
        }, {
          prop: 'remark',
          label: '备注',
          align: 'center',
          show: true
        }],
        tableHeader: [{
          prop: 'name',
          label: '品名',
          align: 'center',
          show: true
        }, {
          prop: 'model',
          label: '型号',
          align: 'center',
          show: true
        }, {
          prop: 'specifications',
          label: '规格',
          align: 'center',
          show: true
        }, {
          prop: 'unitPrice',
          label: '单价',
          align: 'center',
          show: true
        }, {
          prop: 'remark',
          label: '备注',
          align: 'center',
          show: true
        }],
        tableHeader1: [{
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
        rules: rules,
        orgIds: [],
        options: [],
        defaultProps: {
          label: 'value',
          children: 'children'
        },
        commitA : false,
        commitB : false,
        commitC : false,
      }
    },
    computed: {
        countryList() {
         return this.$store.state.dictionary.dists.Country.children;
        },
        gradeList() {
         return this.$store.state.dictionary.dists.Grade.children;
        },
    },
    mounted () {
      this.options = areaData.data
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })
      this.operate = this.$route.path === '/router/editSupplier' ? 'edit' : 'add'
      if (this.operate === 'edit') {
        this.commitA = true
        this.commitB = true
        this.commitC = true
        this.loadData()
      }
      //审批流程
      Api.approvalList({category: '0'}).then(data => {
        this.shenPiList = data;
      }).finally(() => {
        this.listLoading = false
      })
    },
    methods: {
      //校验非空
      checkNull(item,type){
       if(!item){
         this.$notify.warning({
           title: '提示',
           message: '品名/规格/单价不为空',
         })
         switch (type){
           case 1 : this.commitA = false
             break;
           case 2 : this.commitB = false
             break;
           case 3 : this.commitC = false
             break;
           default: ''
         }

       }else {
         switch (type){
           case 1 : this.commitA = true
             break;
           case 2 : this.commitB = true
             break;
           case 3 : this.commitC = true
             break;
           default: ''
         }

       }
      },

      /**
       * 选中
       */
      check: function (data, item) {
        this.form.orgIds = item.checkedKeys
      },
      /**
       * 加载合作伙伴详情
       */
      loadData () {
        this.listLoading = true
        Api.supplierDetailInfo({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            this.form.supplierAttachmentReqs = []
            this.form.areaAddress = [res.country, res.province, res.city]
            if (res.supplierGoods) {
              this.goodsData = res.supplierGoods
            }
            if (res.contacterInfos) {
              this.listData1 = res.contacterInfos
            }
            if (res.orgIds) {
              this.form.orgIds = res.orgIds
               this.$refs.orgTree.setCheckedKeys(res.orgIds);
              //this.checkedKeys = res.orgIds
              // let arr = res.orgIds; //后台返回的id组成的数组
              // let newArr = [];
              // let _this = this
              // arr.forEach(item=>{
              //   _this.setOrgTreeChecked(item, _this.treeData, newArr)
              // })
              // this.checkedKeys = newArr;
            }
            // 文件上传数据回显
            this.fileListReqs = res.supplierAttachments
            console.log(res.supplierAttachments,'res.supplierAttachments')
            let _this = this
            this.fileListReqs.forEach(function (item) {
              Api.getUrl(item.key).then(data => {
                if (data) {
                  _this.$set(item, 'url', data)
                  
                }
              })
            })
            console.log(this.fileListReqs,'this.fileListReqs')
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
      /** 添加供应商信息 */
      addSupplierItem () {
        let item = {
          name: '',
          model: '',
          specifications: '',
          unitPrice: '',
          remark: ''
        }
          this.goodsData.push(item)
      },
      /** 移除供应商品信息 */
      deleteSupplier (index) {
        this.goodsData.splice(index, 1)
      },
      /** 添加联系人信息 */
      addContactItem () {
        let item = {
          name: '',
          tel: '',
          position: '',
          email: '',
          phone: '',
          remarks: '',
          type: '003' // 联系人分类 001:战略合作伙伴联系人 002:客户 003：供应商
        }
        this.listData1.push(item)
      },
      /** 移除联系人信息 */
      deleteContact (index) {
        this.listData1.splice(index, 1)
      },
      /**
       * 表单提交
       */
      submitForm (formName, tag) {
        const goodsData = this.goodsData
         const type = this.$route.query.type
        if(goodsData.length > 0){
          //debugger
         
          if(type!='0'){
            //业务
            const servicesCont = goodsData.some(item=>!item.name)
            console.log(servicesCont)
            if(servicesCont){
              this.$notify.warning({
                title: '提示',
                message: '供应商服务内容中服务内容不能为空！',
              })
              return
            }
           
          }else if(type==='0'){
            if(this.commitA !== true||this.commitB !== true||this.commitC !== true){//如果品名/规格/单价是空的话就不提交
              //debugger
              this.$notify.warning({
                title: '提示',
                message: '品名/规格/单价不为空',
              })
              return
            }
          }
        }else{
           if(type!='0'){
             this.$notify.warning({
                title: '提示',
                message: '供应商服务内容中服务内容不能为空！',
              })
              return
            }else if(type==='0'){
              this.$notify.warning({
                title: '提示',
                message: '品名/规格/单价不为空',
              })
              return
           }
           
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {

            if (this.form.areaAddress) {
              let areaAddress = this.form.areaAddress
              this.form.country = areaAddress[0]
              this.form.province = areaAddress[1]
              this.form.city = areaAddress[2]
            }
            if (this.fileListReqs.length > 0) {
              let _this = this
              this.fileListReqs.forEach(function(item){
                _this.form.supplierAttachmentReqs.push({
                  id: item.id? item.id: '',
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            }

            if (this.operate === 'add') {
              this.addSupplier(tag)
            } else {
              this.updateSupplier()
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },
      /** 添加供应商 */
      addSupplier (tag) {
        let params = this.form
        // 供应商品信息
        if (this.goodsData.length > 0) {
          params.supplierGoodsReqs = this.goodsData
        }
        // 联系人信息
        if (this.listData1.length > 0) {
         params.contacterInfoReqs = this.listData1
        }
        const type = this.$route.query.type
        params.type = type
        Api.addSupplier(params).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '供应商添加成功'
            })
            if (tag === 1) {
              if(type==='0'){
                this.$router.push({path: '/router/supplierMaterielList'})
              }else if(type==='1'){
                this.$router.push({path: '/router/supplierList'})
              }else if(type==='2'){
                this.$router.push({path: '/router/supplierOuterWorkerList'})
              }else if(type==='3'){
                this.$router.push({path: '/router/supplierAdministrationList'})
              }
              
            } else {
              // 提交后继续创建
              this.isMultiple = true
              this.fileListReqs = []
              this.goodsData = []
              this.listData1 = []
              this.form = {
                supplierAttachmentReqs: [],
                orgIds: []
              }
            }
          } else {
            this.$notify.warning({
              title: '提示',
              message: '供应商添加失败'
            })
          }
        })
      },
      /** 修改供应商 */
      updateSupplier () {
        // 供应商品信息
        if (this.goodsData.length > 0) {
          this.form.supplierGoodsUpdateReqs = this.goodsData
        }
        // 联系人信息
        if (this.listData1.length > 0) {
          this.form.contacterInfoUpdateReqs = this.listData1
        }
        delete this.form['supplierGoods']
        delete this.form['orgInfos']
        let params = this.form
        const type= this.$route.query.type
        params.type = type
        Api.updateSupplier(params).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '供应商修改成功'
            })
            if(type==='0'){
              this.$router.push({path: '/router/supplierMaterielList'})
            }else if(type==='1'){
              this.$router.push({path: '/router/supplierList'})
            }
            
          } else {
            this.$notify.warning({
              title: '提示',
              message: '供应商修改失败'
            })
          }
        })
      },
      cancelSubmit (formName) {
        this.$refs[formName].resetFields()
        this.form = {
                supplierAttachmentReqs: [],
                orgIds: []
              }
        this.checkedKeys= []
        //this.$router.push({path: '/router/supplierList'})
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
