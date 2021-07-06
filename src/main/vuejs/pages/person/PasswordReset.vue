<template>
  <el-dialog
      title="重置密码"
      :visible.sync="isShowDialog"
      :close-on-click-modal="canClick"
      :before-close = "closeDialog"
      width="40%">
      <p class="f16 message">
          用户 <span class="text-primary">{{editForm.name}} </span> 的密码将被重置，新密码将以短信的方式发送到用户手机上，新密码重置为：
      </p>
      <el-radio-group v-model="radioVal" class="radio-group">
        <el-radio :label="0">随机生成</el-radio>
        <el-radio :label="1">自定义</el-radio>
        <el-input v-model="newPassword"  v-if="radioVal==1" class="new-password" :maxlength="10"></el-input>
     </el-radio-group>

      <div slot="footer" class="dialog-footer">
        <el-button type="info" class="cancel-btn-big" @click="closeDialog">取消</el-button>
        <el-button type="success" class="confirm-btn-big" @click="confirm('editForm')">确认</el-button>
      </div>
</el-dialog>
</template>
<script>
  import Api from '@/api/index'
  export default {
    name: 'PasswordReset',
    components: {},
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        canClick: false,
        dialogVisible: false,
        newPassword:null,
        radioVal:0
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      /**
       * 确认保存 ： 新增或编辑
       */
      save(newPassword){
        const accountName = this.editForm.name
        let params = {
            loginAccount: accountName,
            loginPassword: newPassword
        }
        Api.updatePasswordByLoginAccount(params).then(res=>{
            if(res){
                this.$message({
                    showClose: true,
                    type: 'success',
                    message:`用户【${accountName}】密码重置成功`
                });
                this.closeDialog();
            }else{
                this.$message({
                showClose: true,
                type: 'error',
                message:`用户【${accountName}】密码重置失败`
                });
            }
        }).catch(err=>{
        })
      },
      confirm(formName){
        if(this.radioVal!=0){
            // 自定义设置
            const newPassword = this.newPassword
            if(newPassword){
                this.save(this.newPassword);
            }else{
                this.$message({showClose:true, message:'请输入新密码', type:'error'})
            }

        }else{
            // 随机生成
            this.save('');
        }

      },
      /**
       * 关闭浮窗
       */
      closeDialog: function () {
        this.$emit('closeDialog', false)
      }
    }
  }

</script>
<style lang="scss" scoped>
.radio-group {
    font-size:16px!important;
    padding-left:120px;
    height:50px;
    line-height: 50px;
    .new-password {
        padding-left:20px;
        display:inline-block;
        width:200px;
    }
}
.message{
    font-size:16px;
    padding-left:20px;
}
.text-primary {
    color:blue,
}

</style>

