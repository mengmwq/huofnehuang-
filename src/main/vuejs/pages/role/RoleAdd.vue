<template>
  <el-dialog
      title="添加角色"
      :visible.sync="isShowDialog"
      :before-close = "closeDialog"
      :close-on-click-modal="canClick"
      width="50%">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model.trim="editForm.name" :maxlength="50" placeholder="请输入角色名称"></el-input>
            </el-form-item>
             <el-form-item label="角色描述" prop="intro">
                <el-input v-model.trim="editForm.intro" type="textarea" :maxlength="50" placeholder="请输入角色描述"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确 认</el-button>
        <el-button type="success" size="small" @click="closeDialog">取 消</el-button>
      </div>
  </el-dialog>
</template>
<script>
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'

  export default {
    name: 'SpecialUserAdd',
    components: {},
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        canClick: false,
        rules: {
            name: [
              { required: true, message: '请输入角色名称', trigger: 'blur'},
            ],
            intro: [
              { required: true, message: '请输入角色描述', trigger: 'blur'},
            ]
        },
      }
    },

    mounted () {

    },
    methods: {

      /**
       * 确认保存 ： 新增或编辑
       */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                const editForm  = this.editForm;

                let fn = editForm.id ? 'updateRole' : 'insertRoleInfo'

                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`角色【${editForm.name}】添加成功`
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
