<template>
  <el-dialog
      title="人员编辑"
      :visible.sync="isShowDialog"
      :close-on-click-modal="canClick"
      :before-close = "closeDialog"
      width="50%">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline" @click.native="isShowTree=false">
        <el-row>
            <el-col :span="12">
                <el-form-item label="角色" prop="roleId">
                    <!-- <el-input v-model.trim="editForm.alias" :maxlength="10" placeholder="请输入角色"></el-input> -->
                    <el-select filterable v-model="editForm.roleId" clearable placeholder="请选择角色">
                        <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="隶属机构"  prop="orgId"  class="tree-box">
                  <el-input placeholder="请选择隶属机构" @click.prevent.native="selectOrg" readonly v-model="editForm.orgName"></el-input>
                  <div class="tree-body" v-if="isShowTree">
                    <el-tree :props="defaultProps"
                     :data="orgList"
                     :filter-node-method="filterNode"
                     highlight-current
                     default-expand-all
                     ref="orgTree"
                     node-key="id"
                     @node-click="nodeClick"
                     @check-change="handleCheckChange"
                     >
                    </el-tree>
                  </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
                <el-form-item label="登录账号" prop="username">
                    <el-input v-model.trim="editForm.username " :maxlength="10" placeholder="请输入登录账号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="密码"  prop="password">
                   <el-input v-model.trim="editForm.password" :maxlength="10" placeholder="默认123456"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-form-item label="由会员导入" prop="userCode">
              <!-- <el-input v-model.trim="" :maxlength="10" placeholder="请输入会员登录名"></el-input> -->
              <el-autocomplete v-model="editForm.userCode" style="width:100%;" placeholder="请输入会员登录名"  :fetch-suggestions="fetchSuggestions"  @select="handleUserSelect" :trigger-on-focus="false" class="biaodan_wenb" popper-class="my-autocomplete">
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
                <el-form-item label="姓名" prop="realname">
                    <el-input v-model.trim="editForm.realname" :maxlength="10" placeholder="请输入姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="手机号"  prop="mobile">
                   <el-input v-model.trim="editForm.mobile" :maxlength="11" placeholder="请输入手机号"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="角色"  prop="title">
                   <el-select filterable v-model="editForm.type" placeholder="请选择角色">
                        <el-option v-for="(item,index) in customerTypeList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="电子邮件"  prop="email">
                   <el-input v-model.trim="editForm.email" :maxlength="10" placeholder="请输入电子邮件"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">

                <el-form-item label="证件类型" prop="type">
                     <el-select filterable v-model="editForm.type" placeholder="请选择证件类型">
                        <el-option v-for="(item,index) in customerTypeList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="证件号"  prop="identityCard">
                   <el-input v-model.trim="editForm.identityCard" :maxlength="18" placeholder="请输入证件号"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex">
                      <el-radio :label="3">男</el-radio>
                      <el-radio :label="6">女</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="状态" prop="block">
                    <el-checkbox v-model="editForm.block">冻结</el-checkbox>
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" class="cancel-btn-big" @click="closeDialog">取消</el-button>
        <el-button type="success" class="confirm-btn-big" @click="confirm('editForm')">确认</el-button>
      </div>
</el-dialog>
</template>
<script>
  import {Org}  from '@/model/Org'
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'

  export default {
    name: 'PersonAdd',
    components: {},
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        canClick: false,
        isShowTree:false,
        dialogVisible: false,
        defaultProps: {
          children: "childrenOrgs",
          label: "name"
        },
        rules: {
            roleId:[
                { required: true, message: '请选择角色', trigger: 'change'},
            ],
            orgId:[
                { required: true, message: '请选择隶属机构', trigger: 'change'},
            ],
            username: [
              { required: true, message: '请输入登录账号', trigger: 'blur'},
            ],
            // password: [
            //   { required: true, message: '请输入登录密码', trigger: 'blur'},
            // ],
            realname: [
              { required: true, message: '请输入姓名', trigger: 'blur'},
            ],
            mobile: [
              { required: true, message: '请输入手机号码', trigger: 'blur'},
              { pattern: ValidForm.mobileReg, message: '请正确输入手机号码'}
            ],
            type:[
              { required: true, message: '请选择证件类型', trigger: 'change'},
            ],
            identityCard: [
               { required: true, message: '请输入证件号', trigger: 'change'},
              { pattern: ValidForm.identityCardReg, message: '请正确输入证件号码!', trigger: 'change'}
            ],
            email: [
              { pattern: ValidForm.emailReg, message: '请正确输入电子邮件!', trigger: 'change'}
            ]
        },
      }
    },
    computed: {
        customerTypeList() {
          return []
          //return this.$store.state.dictionary.dists.UserType.children;
        },
        roleList(){
          return []
          //return this.$store.state.role.roleList;
        },
        orgList(){
          return this.$store.state.organization.allOrganizationInfo;
        }
    },
    mounted () {
      this.$store.dispatch('selectAllRole')
      const curOrg = new Org();
      this.$store.dispatch('getOrganizationInfoList',curOrg)
    },
    methods: {
      /**
       * 会员名导入用户信息
       */
      fetchSuggestions(queryString, cb){
        const reg = /^[\d]{4,}$/;
        const that = this;
        let carInfo = new CarInfo();
        carInfo.driverTel = queryString;
        carInfo.orgId = that.orgId;
        if(queryString){
          Api.selectCarInfoList(carInfo).then((res) => {
            if(res){
              const shipperTelList = res.data;
              //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
              for (let i of shipperTelList) {
                i.value = i.driverTel; //将driverTel作为value
              }
              this.shipperTelList = queryString ? shipperTelList.filter(that.createTelFilter(queryString)) : shipperTelList;
              clearTimeout(that.timeout);
              that.timeout = setTimeout(() => {
                cb(that.shipperTelList);
              }, 1000 * Math.random());
            }
          })
        }else{
          cb([]);
          return;
        }
      },
      /**
       * 处理用户选择
       */
      handleUserSelect(item){
        Api.selectCarInfoList(item).then((res)=> {
          if(res){
            let data = res.data;
            if (data.length > 0) {
              this.carInfo.driver = res.data[0].driver;
              this.carInfo.carNumber = res.data[0].carNumber;
            } else {
              this.carInfo.driver = '';
              this.carInfo.carNumber = '';
            }
          }
        })
      },
      /**
       * 过滤会员名
       */
      createTelFilter(val) {
        return (state) => {
          if (state) {
            return (state.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
          }
        };
      },
      /**
       *  树点击事件
      */
      nodeClick(data,node){
        console.log(node,data);
        const row = Object.assign({},data);
        console.log(row.name,row.id)
        this.editForm.orgName = row.name
        this.editForm.orgId = row.id
        this.isShowTree = false
        //event.stopPropagation();

      },
      /**
       * 节点过滤
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleCheckChange(){

      },
      selectOrg(){
        this.isShowTree = true
        event.stopPropagation();
      },
      getCustomer: function () {
        Api.getCustomer({orgId: this.editRow.id}).then((res) => {
          if (res) {
            this.customerValue = res.data

            console.log('data',res.data)
          }
        })
      },
      /**
       * 确认保存 ： 新增或编辑
       */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                const editForm  = this.editForm;

                let fn = editForm.id ? 'updateUser' : 'insertUser'

                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`人员【${editForm.name}】添加成功`
                      });
                      this.closeDialog();
                    }else{
                      this.$message({
                        showClose: true,
                        type: 'error',
                        message:`人员【${editForm.name}】添加失败`
                      });
                    }
                }).catch(err=>{
                })
            } else {
            //   this.$message({
            //     showClose: true,
            //     type: 'error',
            //     message:`${this.dialogTitle}验证失败！`
            //   });
              return false;
            }
          });
      },
      /**
       * 关闭浮窗
       */
      closeDialog: function () {
        this.$emit('closeEditDialog', false)
      },
      /**
       * 发送信息
       */
      sendMessage (info, type) {
        const message = {value: info, type: type, time: new Date()}
        this.$store.dispatch('setMessageList', message)
      }
    }
  }

</script>
<style lang="scss" scoped>
.tree-box{
  position: relative;
  .tree-body {
    position: absolute;
    width:100%;
    left:0;
    top:40px;
    border:1px solid #eee;
    z-index: 99

  }

}
</style>
