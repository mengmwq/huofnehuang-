<template>
  <el-dialog
      title="个人信息"
      :visible.sync="isShowDialog"
      :before-close = "closeDialog"
      width="70%">
      <!--上传头像-->
      <el-form label-position="right" :model="editForm" ref="editForm" :rules="rules" label-width="130px">
        <el-row :gutter="10">
          <el-col :span="4" class="avatar-content">
            <el-upload
              class="avatar-uploader"
              :data="uploadData"
              action="https://up-z0.qiniup.com"
              :show-file-list="false"
              :on-change="onUploadChange"
              :on-success="handleAvatarSuccess"
              >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="text" style="width: 150px;" class="btnTop">点击方框上传头像</el-button>
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                <el-form-item label="员工编号：" prop="uCode">
                  {{editForm.uCode}}
                  <!-- <el-input v-model="editForm.uCode" :disabled="operateFlag=== 'update'"></el-input> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中文名：" prop="uName">
                  <el-input v-model="editForm.uName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色：" prop="roleId">
                  {{editForm.roleName}}
                  <!-- <el-select v-model="editForm.roleId" clearable placeholder="请选择角色" size="medium" style="width: 100%;">
                    <el-option v-for="item in postList" :key="item.roldId" :label="item.roleName" :value="item.roleId"></el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="英文名：" prop="englishName">
                  <el-input v-model="editForm.englishName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录账号：" prop="loginAccount">
                  {{editForm.loginAccount}}
                  <!-- <el-input v-model="editForm.loginAccount" maxlength="11"></el-input> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录密码：" prop="pwd">
                  <el-input v-model="editForm.pwd"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="隶属机构：" prop="orgName" class="orgName">
                  {{editForm.orgName}}
                  <!-- <el-select  v-model="editForm.orgName" placeholder="请选择机构" size="medium" style="width: 100%;">
                    <el-option :value="orgId" :label="orgName" style="height: 300px;overflow-y: scroll;padding: 0">
                      <el-tree
                        :data="treeData"
                        show-checkbox
                        default-expand-all
                        node-key="orgId"
                        ref="orgTree"
                        :props="{label: 'orgName', children: 'childrens'}"
                        :default-expanded-keys="expandedKeys"
                        :default-checked-keys="checkedKeys"
                        :check-strictly="true"
                        @check-change="handleClick"
                        @node-click="nodeClick">
                      </el-tree>
                    </el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                
                <el-form-item label="性别：" prop="sex">
                  <el-select v-model="editForm.sex" clearable placeholder="请选择性别" size="medium" style="width: 100%;">
                    <el-option v-for="(item, index) in SexType" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="岗位：" prop="positionId">
                  {{editForm.positionName}}
                  <!-- <el-select v-model="editForm.positionId" clearable placeholder="请选择岗位" size="medium" style="width: 100%;">
                    <el-option v-for="item in jobList" :key="item.positionId" :label="item.positionName" :value="item.positionId"></el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码：" prop="tel">
                  <el-input v-model="editForm.tel"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="账号状态：" prop="delFlg">
                  <el-select v-model="editForm.delFlg" clearable placeholder="选择账号状态" size="medium" style="width: 100%;">
                    <el-option v-for="(item, index) in DelFlagStatus" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                  </el-select>
                </el-form-item> 
              </el-col>-->
            </el-row>
            <el-row>
              
              <el-col :span="12">
                <el-form-item label="员工分类：" prop="uClass" v-if="editForm.attached">
                  {{editForm.attached.UserClassType[editForm.uClass.toString()].cnInfo}}
                  <!-- <el-select v-model="editForm.uClass" clearable placeholder="选择员工分类" size="medium" style="width: 100%;">
                    <el-option v-for="(item, index) in UserClassType" :disabled="item.value!== '003' &&  rolesArr.indexOf(item.value) !== -1" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱号：" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="是否为领导：">
                  <el-switch
                    v-model="editForm.isLeaderLevel"
                    active-color="#13ce66"
                    inactive-color="#aaa">
                  </el-switch>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-col>
        </el-row>
        <div class="dialog-footer text-center">
         
          <el-button  type="primary" size="medium" @click="closeDialog" style="width: 100px;" class="btnTop">取消</el-button>
          <el-button type="primary" size="medium" @click="onSubmit('editForm')" style="width: 100px;" class="btnTop">确认</el-button>
        </div>
      </el-form>
</el-dialog>
</template>
<script>
  import {Org}  from '@/model/Org'
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'

  export default {
    name: 'UserInfo',
    components: {},
    computed:{
      SexType(){
        return  this.$store.state.dictionary.dists.SexType.children;
      },
      DelFlagStatus(){
        return  this.$store.state.dictionary.dists.DelFlagStatus.children;
      },
       UserClassType(){
        return  this.$store.state.dictionary.dists.UserClassType.children;
      },
    },
    props: ['isShowDialog'],
    data: function () {
      const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      return {
        editForm:userInfo,
        canClick: false,
        isShowTree:false,
        dialogVisible: false,
        defaultProps: {
          children: "childrenOrgs",
          label: "name"
        },
        rules: {
          // 'uCode': [
          //   { required: true, message: '请输入员工编号', trigger: 'blur' }
          // ],
          uName: [
            { required: true, message: '请输入中文名', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            // { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
          tel: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: ValidForm.mobileReg, message: '请输入正确的手机号'}
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          // roleId: [
          //   { required: true, message: '请选择角色', trigger: 'change' }
          // ],
          // delFlg: [
          //   { required: true, message: '请选择账号状态', trigger: 'change' }
          // ],
          // positionId: [
          //   { required: true, message: '请选择岗位', trigger: 'change' }
          // ],
          // uClass: [
          //   { required: true, message: '请选择员工分类', trigger: 'change' }
          // ],
          // loginAccount: [
          //   { required: true, message: '请输入登录账号', trigger: 'blur' },
          //   { pattern: ValidForm.mobileReg, message: '请输入11位'}
          // ],
          email: [
            { required: false, message: '请输入邮箱号', trigger: 'blur' },
            { pattern: ValidForm.emailReg, message: '请输入正确的邮箱号'}
          ]
        },
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
        fileList: [],
        imageUrl: '',
        postList:[],
        jobList:[],
         operateFlag: '',
        flag: false,
        orgName: '',
        orgId: '',
        treeData: [],
        expandedKeys: [],
        checkedKeys: [],
      }
    },
    mounted () {
      Api.getPicToken().then(data => {
        this.uploadData.token = data
        this.getImgUrl(this.editForm.picKey)
      });
      // Api.getRolePage({pageNum:1, pageSize: 20000}).then(data => {
      //   this.postList = data.records
      // })
      // Api.getPositionPage({pageNum:1, pageSize: 20000}).then(data => {
      //   this.jobList = data.records
      // })
      // // 组织机构
      // Api.getTreeFormOrgInfo().then(data => {
      //   this.treeData = data
      // })
      

    },
    methods: {
      onUploadChange(file) {
        let fileName = file.name;
        if (fileName && fileName.lastIndexOf(".") != -1) {
          let fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      handleAvatarSuccess(res, file) {
        this.editForm.picKey = res.key
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      getImgUrl(key) {
        this.imageUrl = '';
        if (key) {
          Api.getUrl(key).then(data => {
            if (data) {
              this.imageUrl = data
              //this.fileList = [{url: data}];
            }
          })
        }

      },
      onSubmit (formName) {
        
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateUser()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /**
       * 编辑用户
       * */
      updateUser () {
        //this.addForm.isLeaderLevel = this.addForm.isLeaderLevel === true ? '1' : '0'
        Api.updateUser(this.editForm).then((res) => {
          if(res) {
            //this.loadData()
            this.$notify.success({
              title: '提示',
              message: '个人信息修改成功!  建议您重新启动部分设置才会生效！'
            })
            this.closeDialog()
          }
        })
      },
      /**
       * 关闭浮窗
       */
      closeDialog: function () {
        this.$emit('closeDialog', false)
      },
    }
  }

</script>