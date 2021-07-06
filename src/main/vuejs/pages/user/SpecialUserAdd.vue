<template>
  <el-dialog
      :title="editTitle"
      :visible.sync="isShowDialog"
      :close-on-click-modal="canClick"
      :before-close = "closeDialog"
      width="35%">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline" @click.native="isShowTree=false">
          <el-form-item label="特殊身份" prop="type">
              <!-- <el-input v-model.trim="editForm.alias" :maxlength="10" placeholder="请输入角色"></el-input> -->
              <el-select style="width:100%" v-model="editForm.type" @change="selectTypeChange" clearable placeholder="请选择特殊身份" :disabled="editTitle=='特殊用户详情'">
                  <el-option v-for="(item,index) in specialIdentityList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
              <el-input style="width:100%" v-model.trim="editForm.name" :disabled="editTitle=='特殊用户详情'" :maxlength="10" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="证件类型" prop="cardType" >
              <el-select style="width:100%" v-model="editForm.cardType" placeholder="请选择证件类型" :disabled="editTitle=='特殊用户详情'">
                  <el-option v-for="(item,index) in cardTypeList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="身份证号"  prop="cardId"  v-if="editForm.cardType=='1'" :rules="[
            { required: true, message: '请输入身份证号', trigger: 'blur'},
              { pattern: identityCardReg, message: '请正确输入身份证件号码!', trigger: 'blur'}
          ]">
              <el-input v-model.trim="editForm.cardId" :maxlength="18" :disabled="editTitle=='特殊用户详情'" placeholder="请输入证件号"></el-input>
          </el-form-item>
          <el-form-item label="护照号"  prop="cardId"  v-if="editForm.cardType=='2'" :rules="[
            { required: true, message: '请输入护照号', trigger: 'blur'},
              { pattern: passportReg, message: '请正确输入护照!', trigger: 'blur'}
          ]">
              <el-input v-model.trim="editForm.cardId" :maxlength="18" :disabled="editTitle=='特殊用户详情'" placeholder="请输入证件号"></el-input>
          </el-form-item>
          <el-form-item label="港澳通行证"  prop="cardId"  v-if="editForm.cardType=='3'" :rules="[
            { required: true, message: '请输入港澳通行证号', trigger: 'blur'},
              { pattern: HKCardReg, message: '请正确输入港澳通行证!', trigger: 'blur'}
          ]">
              <el-input v-model.trim="editForm.cardId" :maxlength="18" :disabled="editTitle=='特殊用户详情'" placeholder="请输入证件号"></el-input>
          </el-form-item>
          <el-form-item label="台胞证号"  prop="cardId"  v-if="editForm.cardType=='4'" :rules="[
            { required: true, message: '请输入台胞证号', trigger: 'blur'},
              { pattern: taiwanCardReg, message: '请正确输入台胞证!', trigger: 'blur'}
          ]">
              <el-input v-model.trim="editForm.cardId" :maxlength="18" :disabled="editTitle=='特殊用户详情'" placeholder="请输入证件号"></el-input>
          </el-form-item>
          <el-form-item label="学员限制" prop="stuLimitYear" v-show="editForm.type == 1">
              <el-input v-model="editForm.stuLimitYear" :disabled="editTitle=='特殊用户详情'" :min="0" :step="1"></el-input>
          </el-form-item>
          <el-form-item label="义工限制"  prop="volLimitYear" v-show="editForm.type == 1">
              <el-input v-model="editForm.volLimitYear" :disabled="editTitle=='特殊用户详情'" :min="0" :step="1"></el-input>
          </el-form-item>
          <el-form-item label="原因"  prop="reason">
              <el-input v-model.trim="editForm.reason" style="width:100%" :disabled="editTitle=='特殊用户详情'" type="textarea" :maxlength="200" placeholder="多行输入"></el-input>
          </el-form-item>
          <el-form-item label="生效时间"  prop="limitStartAt" v-show="editForm.type == 1">
              <el-date-picker style="width:100%"
                      :disabled="editTitle=='特殊用户详情'"
                      v-model="editForm.limitStartAt"
                      type="date"
                      placeholder="选择生效时间">
              </el-date-picker>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" v-if="editTitle!='特殊用户详情'" @click="confirm('editForm')">确 认</el-button>
        <el-button type="success" size="small" @click="closeDialog">取 消</el-button>
      </div>
</el-dialog>
</template>
<script>
  import {Org}  from '@/model/Org'
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'

  export default {
    name: 'SpecialUserAdd',
    components: {},
    props: ['isShowDialog', 'editForm', 'editTitle'],

    data: function () {
      return {
        canClick: false,
        isShowTree:false,
        dialogVisible: false,
        defaultProps: {
          children: "childrenOrgs",
          label: "name"
        },
        identityCardReg:ValidForm.identityCardReg,
        passportReg:ValidForm.passportReg,
        HKCardReg:ValidForm.HKCardReg,
        taiwanCardReg:ValidForm.taiwanCardReg,
        rules: {
            type:[
                { required: true, message: '请选择特殊身份', trigger: 'blur'},
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur'},
            ],
            cardType:[
              { required: true, message: '请选择证件类型', trigger: 'blur'},
            ],
            cardId: [
               { required: true, message: '请输入证件号', trigger: 'blur'},
              { pattern: ValidForm.identityCardReg, message: '请正确输入证件号码!', trigger: 'blur'}
            ]
        },
      }
    },
    computed: {
        /**
         * 特殊身份
         */
        specialIdentityList(){
          // const specialIdentityList = [
          //   {value:1,cnInfo:'黑名单'},
          //   {value:2,cnInfo:'嘉宾'},
          // ];
          // return specialIdentityList
          return this.$store.state.dictionary.dists.SpecialType.children;

        },
        /**
         * 证件类型
         */
        cardTypeList(){
          // const cardTypeList = [
          //   {value:1,cnInfo:'身份证'},
          //   {value:2,cnInfo:'护照'},
          //   {value:3,cnInfo:'港澳通行证'},
          //   {value:4,cnInfo:'台胞证'},
          // ];
          // return cardTypeList
          return this.$store.state.dictionary.dists.CardType.children;
        },
        orgList(){
          return this.$store.state.organization.allOrganizationInfo;
        }
    },
    mounted () {
    },
    methods: {
      cardTypeChange (val) {
        // if(this.editTitle=='添加特殊用户'){
        //   this.editForm.cardId = ''
        //   delete this.rules['cardId']
        // }

        // if (val ==0) {
        //   this.editForm.cardId = ''
        //   delete this.rules['cardId']
        // } else if(val=='1'){
        //   this.rules.cardId = [
        //     { required: true, message: '请输入身份证号', trigger: 'blur'},
        //       { pattern: ValidForm.identityCardReg, message: '请正确输入身份证件号码!', trigger: 'blur'}
        //   ];
        // }else if(val=='2'){
        //   this.rules.cardId = [
        //     { required: true, message: '请输入护照号', trigger: 'blur'},
        //       { pattern: ValidForm.passportReg, message: '请正确输入护照!', trigger: 'blur'}
        //   ];
        // }else if(val=='3'){
        //   this.rules.cardId = [
        //     { required: true, message: '请输入港澳通行证号', trigger: 'blur'},
        //       { pattern: ValidForm.HKCardReg, message: '请正确输入港澳通行证!', trigger: 'blur'}
        //   ];
        // }else if(val=='4'){
        //   this.rules.cardId = [
        //     { required: true, message: '请输入台胞证号', trigger: 'blur'},
        //       { pattern: ValidForm.taiwanCardReg, message: '请正确输入台胞证!', trigger: 'blur'}
        //   ];
        // }
      },
      /**
       * 确认保存 ： 新增或编辑
       */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
               const editForm  = this.editForm;

                let fn = editForm.id ? 'updateSpecialUser' : 'insertSpecialUser'

                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`人员【${editForm.name}】添加成功`
                      });
                      this.closeDialog();
                    }
                }).catch(err=>{
                })
            } else {
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
