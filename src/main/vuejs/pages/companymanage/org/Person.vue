<template>
  <div class="orgPerson" v-if="isShowPerson">
    <div class="personTitle">
      <div class="orgName">当前机构：{{org.orgName}}</div>
      <div class="close">
        <i class="el-icon-circle-close" @click="closeDialog"></i>
      </div>
    </div>
    <div class="pd20">
      <div class="main">
        <div class="personTable">
          <PersonList ref="personList" :org="org" @selectPersonChange="selectPersonChange"></PersonList>
        </div>
        <template v-if="editForm.uCode">
          <el-form
            class="personForm"
            :model="editForm"
            ref="editForm"
            :rules="rules"
            label-width="130px"
          >
            <el-form-item label="员工编号：" prop="uCode">{{editForm.uCode}}</el-form-item>
            <el-form-item label="中文名：" prop="uName">
              <el-input v-model="editForm.uName" maxlength="5" size="small"></el-input>
            </el-form-item>
             <el-form-item label="英文名：">
              <el-input v-model="editForm.englishName" maxlength="20" size="small"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-select
                v-model="editForm.sex"
                clearable
                placeholder="请选择性别"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="(item, index) in SexType"
                  :key="index"
                  :label="item.cnInfo"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色：" prop="roleName">
              <el-select
                filterable
                clearable
                remote
                :remote-method="getRoleList"
                v-model="editForm.roleName"
                placeholder="请选择角色"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="(item,index) in RoleList"
                  @click.native="handleRoleInfo(item)"
                  :key="index"
                  :label="item.roleName"
                  :value="item.roleName"
                ></el-option>
              </el-select>
              <!-- <el-select v-model="editForm.roleName" filter clearable placeholder="请选择角色" size="small" style="width: 100%;">
            <el-option v-for="item in RoleList" :key="item.roldId" @click.native="handleRoleInfo(item)" :label="item.roleName" :value="item.roleId"></el-option>
              </el-select>-->
            </el-form-item>
           
            <el-form-item label="登录账号：" prop="loginAccount">{{editForm.loginAccount}}</el-form-item>
            <el-form-item label="手机号码：" prop="tel">
              <el-input v-model="editForm.tel" maxlength="11" size="small"></el-input>
            </el-form-item>
            <!-- <el-form-item label="登录密码：" prop="pwd">
          <el-input v-model="editForm.pwd"></el-input>
            </el-form-item>-->
            <el-form-item label="隶属机构：" prop="orgName" class="orgName">
              <el-select
                ref="orgSelect"
                v-model="editForm.orgName"
                placeholder="请选择机构"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  :value="editForm.orgId"
                  :label="editForm.orgName"
                  style="height: 300px;overflow-y: auto;padding: 0"
                >
                  <SelectOneOrg :editForm="editForm" @dataChange="orgChange"></SelectOneOrg>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位：" prop="positionName">
              <!-- {{editForm.positionName}} -->
              <el-select
                v-model="editForm.positionName"
                filterable
                clearable
                remote
                :remote-method="getPositionList"
                placeholder="请选择岗位"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  @click.native ="handlePostionId(item)"
                  v-for="item in positionList"
                  :key="item.positionId"
                  :label="item.positionName"
                  :value="item.positionName"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="员工分类：" prop="uClass" v-if="editForm.attached">
              <!-- {{editForm.attached.UserClassType[editForm.uClass.toString()].cnInfo}} -->
              <el-select
                v-model="editForm.uClass"
                clearable
                placeholder="选择员工分类"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="(item, index) in UserClassType"
                  :key="index"
                  :label="item.cnInfo"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱号：" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <!--<el-form-item label="是否为领导：">
              <el-switch
                v-model="editForm.isLeaderLevel"
                active-value=1
                inactive-value=0
                active-color="#13ce66"
                inactive-color="#aaa"
              ></el-switch>
            </el-form-item>-->
            <div class="text-center mt20">
              <el-button
                type="primary"
                v-if="editForm.uCode"
                size="medium"
                @click="onSubmit('editForm')"
                style="width: 100px;"
                class="btnTop"
              >确认</el-button>
              <el-tooltip
                class="item"
                v-else
                effect="dark"
                content="请点击左侧人员列表姓名"
                placement="top-start"
              >
                <el-button
                  type="primary"
                  size="medium"
                  :disabled="true"
                  style="width: 100px;"
                  class="btnTop"
                >确认</el-button>
              </el-tooltip>
            </div>
          </el-form>
        </template>
        <ol v-else>
          <h4>操作提示</h4>
          <li>点击左侧表格中姓名，可修改人员部分信息</li>
          <!--<li>点击【添加人员】，在人员列表中添加人员</li>-->
          <li>支持点击遮罩层关闭</li>
          
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/index";
import ValidForm from "@/utils/ValidForm";
import PersonList from "./PersonList";
import SelectOneOrg from "@/components/org/SelectOneOrg";
export default {
  components: {
    PersonList,
    SelectOneOrg
  },
  computed: {
    UserClassType() {
      return this.$store.state.dictionary.dists.UserClassType.children;
    },
    SexType() {
      return this.$store.state.dictionary.dists.SexType.children;
    },
    DelFlagStatus() {
      return this.$store.state.dictionary.dists.DelFlagStatus.children;
    }
  },
  props: {
    isShowPerson: {
      type: Boolean
    },
    org: {
      type: Object
    }
  },
  data() {
    return {
      positionList: [],
      RoleList: [],
      editForm: {
        picKey: "",
        uCode: "",
        loginAccount: "",
        uName: "",
        tel: "",
        pwd: "",
        orgId: "",
        roleId: "",
        positionId: "",
        uClass: "",
        isLeaderLevel: 0,
        email: "",
        englishName: "",
        delFlg: "",
        sex: ""
      },
      defaultProps: {
        children: "childrenOrgs",
        label: "name"
      },
      rules: {
        englishName: [
          { required: true, message: "请输入英文名", trigger: "blur" }
        ],
        uName: [{ required: true, message: "请输入中文名", trigger: "blur" }],
        roleName:[{ required: true, message: "请选择角色名称", trigger: ["blur","change"] }],
        positionName:[{ required: true, message: "请选择岗位名称", trigger: ["blur","change"] }],
        orgName:[{ required: true, message: "请选择隶属机构", trigger: ["blur","change"] }],
        loginAccount:[{ required: true, message: "请输入登录账号", trigger: ["blur","change"] }],
        tel: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"]
          },
          { pattern: ValidForm.mobileReg, message: "请输入正确的手机号" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
         uClass: [{ required: true, message: "请选择员工分类", trigger: "change" }],
        email: [
          { required: false, message: "请输入邮箱号", trigger: "blur" },
          { pattern: ValidForm.emailReg, message: "请输入正确的邮箱号" }
        ]
      }
    };
  },
  mounted() {
    //获取岗位
    this.getPositionList();
    //获取角色
    this.getRoleList();
  },
  methods: {
    handlePostionId(item){
      this.editForm.positionId = item.positionId
    },
    //获取角色列表
    getRoleList(query='') {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
            pageNum:1,
            pageSize:10,
            roleName:query,
        }
        Api.getRolePage(params).then(res=>{
            this.RoleList = res.records
        })
        
      }, 200);
    },
    //获取岗位列表
    getPositionList(query='') {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
            pageNum:1,
            pageSize:10,
            positionName:query,
        }
        Api.getPositionPage(params).then(res=>{
            this.positionList = res.records
        })
        
      }, 200);
    },
    //处理角色ID;
    handleRoleInfo(item) {
      console.log(item, item.roleId);
      this.editForm.roleId = item.roleId;
    },
    orgChange(data) {
      console.log(data, data.orgName, data.orgId);
      this.editForm.orgName = data.orgName;
      this.editForm.orgId = data.orgId;
      this.$refs.orgSelect.blur();
    },
    //当前人员切换
    selectPersonChange(row) {
      this.editForm = JSON.parse(JSON.stringify(row));
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateUser();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 编辑用户
     * */
    updateUser() {
      //this.editForm.isLeaderLevel = this.addForm.isLeaderLevel === true ? '1' : '0'
      let params = JSON.parse(JSON.stringify(this.editForm))
      delete params.attached
      Api.updateUser(params).then(res => {
        if (res) {
          //this.loadData()
          this.$notify.success({
            title: "提示",
            message: "人员信息修改成功! "
          });
          this.editForm= {
            picKey: "",
            uCode: "",
            loginAccount: "",
            uName: "",
            tel: "",
            pwd: "",
            orgId: "",
            roleId: "",
            positionId: "",
            uClass: "",
            isLeaderLevel: false,
            email: "",
            englishName: "",
            delFlg: "",
            sex: ""
          }
          this.$emit('personChange')
          this.$refs.personList.loadData()
          //this.closeDialog()
        }
      });
    },
    /**
     * 关闭浮窗
     */
    closeDialog: function() {
      this.$emit("closeDialog", false);
    }
  }
};
</script>
<style lang="scss">
.personForm {
  .el-form-item__error {
    display: none !important;
  }
}
</style>
<style lang="scss" scoped>
.orgPerson {
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 100;
  background: #fff;
  height: calc(100% - 60px);
  .personTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    background: #4d4d4d;
    color: #fff;
    .orgName {
      font-weight: 700;
      padding-left: 10px;
    }
    i {
      font-size: 24px;
      padding-right: 10px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    justify-content: flex-end;
    align-items: top;
    height: 100%;
    width: 100%;
    .personTable {
      width: 60%;
    }
    .personForm {
      width: 40%;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>

