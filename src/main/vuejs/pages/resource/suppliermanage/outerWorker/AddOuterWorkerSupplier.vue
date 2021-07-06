<template>
  <div>
    <el-form label-position="right" :rules="rules" :model="form" ref="form" label-width="190px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <div class="title">
          申请信息
          <div class="line"></div>
        </div>
        <!-- 基础信息 -->
        <p class="step-title">
          <span class="step-icon">1</span>基本信息：
        </p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="form.name" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="住址：" prop="city">
                <el-input v-model="form.city"  maxlength="50"></el-input>
                <!-- <el-cascader
                  placeholder="省市区"
                  style="width: 100%;"
                  :options="options"
                  :props="defaultProps"
                  v-model="form.areaAddress"
                ></el-cascader> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="身份证号：" prop="idNo" >
                <el-input v-model="form.idNo"  maxlength="18"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证地址：" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="tel">
                <el-input v-model="form.tel" placeholder="请输入手机号" maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：">
                <el-input v-model="form.enterpriseRemark" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="tel">
                <el-input v-model="form.tel" placeholder="请输入手机号" maxlength="11"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title">
          <span class="step-icon">2</span>资质信息：
        </p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码：" prop="enterpriseCode">
                <el-input v-model="form.enterpriseCode"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="开户银行：" prop="depositBank">
                <el-input v-model="form.depositBank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对公账户：" prop="publicAccounts">
                <el-input v-model="form.publicAccounts"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行地址：" prop="bankAddress">
                <el-input v-model="form.bankAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title">
          <span class="step-icon">3</span>过往经历 ：
        </p>
         <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="outworkerPasts"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{color:'#333'}"
          >
            <template>
              <template v-for="(header, index) in tableHeader">
                <el-table-column
                  v-if="header.show"
                  :key="index"
                  :prop="header.prop"
                  :label="header.label"
                  :sortable="header.sortable"
                  :align="header.align"
                  :min-width="header.width"
                  :column-key="header.prop"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div v-if="header.prop == 'name'">
                      <el-input v-model="scope.row.name"></el-input>
                    </div>
                    <div v-else-if="header.prop == 'specifications'">
                      <el-input v-model="scope.row.specifications"></el-input>
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
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addSupplierItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteSupplier(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title">
          <span class="step-icon">4</span>技能特长 ：
        </p>

        <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="outworkerSkills"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{color:'#333'}"
          >
            <template>
              <template v-for="(header, index) in tableHeaderBiz">
                <el-table-column
                  v-if="header.show"
                  :key="index"
                  :prop="header.prop"
                  :label="header.label"
                  :sortable="header.sortable"
                  :align="header.align"
                  :min-width="header.width"
                  :column-key="header.prop"
                  show-overflow-tooltip
                >
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
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addSupplierKillsItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteSupplierKills(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title">
          <span class="step-icon">5</span>紧急联系人：
        </p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="listData1"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{color:'#333'}"
          >
            <el-table-column
              v-for="(header, index) in tableHeader1"
              v-if="header.show"
              :key="index"
              :prop="header.prop"
              :label="header.label"
              :sortable="header.sortable"
              :align="header.align"
              :min-width="header.width"
              :column-key="header.prop"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'">
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
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addContactItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteContact(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title">
          <span class="step-icon">6</span>身份证上传
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证上传:" prop>
              <v-upload :isMultiple="isMultiple" :removedAll.sync="removedAll"  :fileListReqs.sync="fileListReqs"></v-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <p class="step-title"><span class="step-icon">6</span>完成</p> -->
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button v-if="$route.query.flag!='details'" type="primary" size="medium" @click="cancelSubmit('form')">重 置</el-button>
        <el-button v-if="$route.query.flag!='details'" type="primary" size="medium" @click="submitForm('form', 1)">提 交</el-button>
        <el-button
          v-if="operate=== 'add'"
          type="primary"
          size="medium"
          @click="submitForm('form', 2)"
        >提交后继续创建</el-button>
         <el-button type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
import Upload from "@/components/common/Upload";
import OrgTree from "@/pages/resource/OrgTree";
import Api from "@/api/index";
import ValidForm from '@/utils/ValidForm'
import areaData from "@/api/area";
export default {
  components: {
    "v-upload": Upload,
    "org-tree": OrgTree
  },
  data() {
    return {
      removedAll:false,
        // 审批流程列表
      shenPiList: [],
      treeData: [],
      checkedKeys: [],
      // 文件上传是否可多选
      isMultiple: true,
      fileListReqs: [],
      /** 添加编辑的标志 */
      operate: "",
      type: "",
      form: {
        supplierAttachments: [],
        orgIds: []
      },
      /** 表格 loading */
      listLoading: false,
      outworkerPasts: [],
      outworkerSkills:[],
      listData1: [],
      tableHeaderBiz: [
        {
          prop: "name",
          label: "专业技能",
          align: "center",
          show: true
        },
        {
          prop: "remark",
          label: "备注",
          align: "center",
          show: true
        }
      ],
      tableHeader: [
        {
          prop: "name",
          label: "曾服务企业",
          align: "center",
          show: true
        },
        {
          prop: "specifications",
          label: "曾服务项目",
          align: "center",
          show: true
        },
        {
          prop: "remark",
          label: "备注",
          align: "center",
          show: true
        }
      ],
      tableHeader1: [
        {
          prop: "name",
          label: "联系人",
          align: "center",
          show: true
        },
        {
          prop: "tel",
          label: "电话",
          align: "center",
          show: true
        },
        // {
        //   prop: "position",
        //   label: "职位",
        //   align: "center",
        //   show: true
        // },
        // {
        //   prop: "phone",
        //   label: "手机",
        //   align: "center",
        //   show: true
        // },
        // {
        //   prop: "email",
        //   label: "E-MAIL",
        //   align: "center",
        //   show: true
        // },
        {
          prop: "remarks",
          label: "备注",
          align: "center",
          show: true
        }
      ],
      rules: {
         
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur'},
            ],
            tel: [
              { required: true, message: '请输入手机号码', trigger: 'blur'},
              { pattern: ValidForm.mobileReg, message: '请正确输入手机号码'}
            ],
            // type:[
            //   { required: true, message: '请选择证件类型', trigger: 'change'},
            // ],
            idNo: [
               { required: true, message: '请输入身份证号', trigger: 'blur'},
              { pattern: ValidForm.identityCardReg, message: '请正确输入身份证号!', trigger: 'change'}
            ],
            // email: [
            //   { pattern: ValidForm.emailReg, message: '请正确输入电子邮件!', trigger: 'change'}
            // ]
      },
      orgIds: [],
      options: [],
      defaultProps: {
        label: "value",
        children: "children"
      },
      commitA: false,
      commitB: false,
      commitC: false
    };
  },
  mounted() {
    this.options = areaData.data;
    // 组织机构
    Api.getTreeFormOrgInfo().then(data => {
      this.treeData = data;
    });
    this.operate = this.$route.path === "/router/editOuterWorkerSupplier" ? "edit" : "add";
    if (this.operate === "edit") {
      // this.commitA = true;
      // this.commitB = true;
      // this.commitC = true;
      this.loadData();
    }
     //审批流程
      // Api.approvalList({category: '0'}).then(data => {
      //   this.shenPiList = data;
      // }).finally(() => {
      //   this.listLoading = false
      // })
  },
  methods: {
    

    /**
     * 选中
     */
    check: function(data, item) {
      this.form.orgIds = item.checkedKeys;
    },
    /**
     * 加载合作伙伴详情
     */
    loadData() {
      this.listLoading = true;
      Api.supplierDetailInfoOuterWorker({ id: this.$route.query.id }).then(res => {
        if (res) {
          this.form.supplierAttachments = [];
          this.form = res;
         //this.form.areaAddress = [res.country, res.province, res.city];
          if (res.outworkerPasts) {
            this.outworkerPasts = res.outworkerPasts;
          }
          if (res.outworkerSkills) {
            this.outworkerSkills = res.outworkerSkills;
          }
          if (res.contacterInfos) {
            this.listData1 = res.contacterInfos;
          }
          if (res.orgIds) {
            this.form.orgIds = res.orgIds;
            console.log(res.orgIds,'orgId')
            this.checkedKeys = res.orgIds
            let arr = res.orgIds; //后台返回的id组成的数组
            let newArr = [];
            let _this = this;
            arr.forEach(item => {
              _this.setOrgTreeChecked(item, _this.treeData, newArr);
            });
            this.checkedKeys = newArr;
          }
          // 文件上传数据回显
          this.fileListReqs = res.supplierAttachments;
          console.log(res.supplierAttachments,'res.supplierAttachments')
           let _this = this;
          this.fileListReqs.forEach(function(item) {
            Api.getUrl(item.key).then(data => {
              if (data) {
                _this.$set(item, "url", data);

              }
            });
          });
          console.log(this.fileListReqs,'this.fileListReqs')
        }
      });
      this.listLoading = false;
    },
    setOrgTreeChecked(id, data, newArr) {
      let _this = this;
      data.forEach(item => {
        if (item.orgId == id) {
          if (!item.childrens) {
            newArr.push(item.orgId);
          }
        } else {
          if (item.childrens) {
            _this.setOrgTreeChecked(id, item.childrens, newArr);
          }
        }
      });
    },
    /** 添加供应商信息 */
    addSupplierItem() {
      let item = {
        name: "",
        model: "",
        specifications: "",
        unitPrice: "",
        remark: ""
      };
      this.outworkerPasts.push(item);
    },
    /** 移除供应商品信息 */
    deleteSupplier(index) {
      this.outworkerPasts.splice(index, 1);
    },
    /** 添加供应商技能信息 */
    addSupplierKillsItem() {
      let item = {
        name: "",
        remark: ""
      };
      this.outworkerSkills.push(item);
    },
    /** 移除供应商品信息 */
    deleteSupplierKills(index) {
      this.outworkerSkills.splice(index, 1);
    },
    /** 添加联系人信息 */
    addContactItem() {
      let item = {
        name: "",
        tel: "",
        position: "",
        email: "",
        phone: "",
        remarks: "",
        type: "003" // 联系人分类 001:战略合作伙伴联系人 002:客户 003：供应商
      };
      this.listData1.push(item);
    },
    /** 移除联系人信息 */
    deleteContact(index) {
      this.listData1.splice(index, 1);
    },
    /**
     * 表单提交
     */
    submitForm(formName, tag) {
      const outworkerPasts = this.outworkerPasts;
      const type = this.$route.query.type;
      // if (outworkerPasts.length > 0) {
      //   debugger;

      //   if (type != "0") {
      //     //业务
      //     const servicesCont = outworkerPasts.some(item => !item.name);
      //     console.log(servicesCont);
      //     if (servicesCont) {
      //       this.$notify.warning({
      //         title: "提示",
      //         message: "供应商服务内容中服务内容不能为空！"
      //       });
      //       return;
      //     }
      //   } 
      // } 

      if (!this.form.orgIds || this.form.orgIds.length == 0) {
        this.$notify.warning({
          title: "提示",
          message: "请选择第5项可见权限！"
        });
        return;
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          //省市区
          // if (this.form.areaAddress) {
          //   let areaAddress = this.form.areaAddress;
          //   this.form.country = areaAddress[0];
          //   this.form.province = areaAddress[1];
          //   this.form.city = areaAddress[2];
          // }
          if (this.fileListReqs.length > 0) {
            let _this = this;
            this.fileListReqs.forEach(function(item) {
              _this.form.supplierAttachments.push({
                id: item.id ? item.id : "",
                attachmentName: item.name,
                key: item.attachmentUrlKey
              });
            });
          }else {
              if (this.removedAll) {
                this.form.applyAttachmentReqList = []
              }
            }
          if (this.operate === "add") {
            this.addSupplier(tag);
          } else {
            this.updateSupplier();
          }
        } else {
          this.$message("请完善表单");
        }
      });
    },
    /** 添加供应商 */
    addSupplier(tag) {
      let params = this.form;
      // 供应商品信息
      if (this.outworkerPasts.length > 0) {
        params.outworkerPasts = this.outworkerPasts;
      }
       // 供应商品信息
      if (this.outworkerSkills.length > 0) {
        params.outworkerSkills = this.outworkerSkills;
      }
      // 联系人信息
      if (this.listData1.length > 0) {
        params.contacterInfos = this.listData1;
      }
      const type = this.$route.query.type;
      params.type = type;
      Api.addSupplierOuterWorker(params).then(res => {
        if (res) {
          this.$notify.success({
            title: "提示",
            message: "供应商添加成功"
          });
          if (tag === 1) {
            // if (type === "0") {
            //   this.$router.push({ path: "/router/supplierMaterielList" });
            // } else if (type === "1") {
            //   this.$router.push({ path: "/router/supplierList" });
            // } else if (type === "2") {
            //   this.$router.push({ path: "/router/supplierOuterWorkerList" });
            // } else if (type === "3") {
            //   this.$router.push({ path: "/router/supplierAdministrationList" });
            // }
            this.$router.push({ path: "/router/supplierOuterWorkerList" });
          } else {
            // 提交后继续创建
            this.isMultiple = true;
            this.fileListReqs = [];
            this.outworkerPasts = [];
            this.outworkerSkills = [];
            this.listData1 = [];
            this.form = {
              supplierAttachments: [],
              orgIds: []
            };
          }
        } else {
          this.$notify.warning({
            title: "提示",
            message: "供应商添加失败"
          });
        }
      });
    },
    /** 修改供应商 */
    updateSupplier() {
      // 供应商品信息
      if (this.outworkerPasts.length > 0) {
        this.form.outworkerPasts = this.outworkerPasts;
      }
      // 技能特长
      if (this.outworkerSkills.length > 0) {
        this.form.outworkerSkills = this.outworkerSkills;
      }
      // 联系人信息
      if (this.listData1.length > 0) {
        this.form.contacterInfos = this.listData1;
      }
      delete this.form["supplierGoods"];
      delete this.form["orgInfos"];
      let params = this.form;
      const type = this.$route.query.type;
      params.type = type;
      Api.updateSupplierOuterWorker(params).then(res => {
        if (res) {
          this.$notify.success({
            title: "提示",
            message: "供应商修改成功"
          });
         this.$router.push({ path: "/router/supplierOuterWorkerList" });
        } else {
          this.$notify.warning({
            title: "提示",
            message: "供应商修改失败"
          });
        }
      });
    },
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/router/supplierOuterWorkerList" });
    }
  }
};
</script>

<style scoped>
.title {
  color: #c2272d;
  margin-bottom: 10px;
  overflow: hidden;
  height: 40px;
}

.title .line {
  border-bottom: 2px dashed #dfdfdf;
  position: relative;
  left: 80px;
  margin-top: -11px;
}

.footer {
  float: right;
  margin-top: 20px;
}
</style>
