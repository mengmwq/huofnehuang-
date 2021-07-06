<template>
  <el-dialog
      title="我要评论"
      :visible.sync="isShowDialog"
      append-to-body
      :before-close = "closeDialog"
      width="40%">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline" @click.native="isShowTree=false">
         <el-form-item label="评论内容："  prop="content">
            <el-input v-model.trim="editForm.content" type="textarea" rows="3" show-word-limit :maxlength="100" placeholder="请输入评论内容"></el-input>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
       
        <el-button type="default" size="small" @click="closeDialog">取消</el-button>
         <el-button type="primary" size="small" @click="confirm('editForm')">确认</el-button>
      </div>
</el-dialog>
</template>
<script>
 
  import Api from '@/api/index'

  export default {
    name: 'AddComment',
    components: {},
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        // editForm:{
        //   content:''
        // },
        rules: {
            content:[
                { required: true, message: '请输入评论内容', trigger: 'blur'},
            ],
            
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

                Api.addApprovalComment(editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`评论添加成功`
                      });
                      this.$emit('dialogChange');
                    }else{
                      this.$message({
                        showClose: true,
                        type: 'error',
                        message:`评论添加失败`
                      });
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
        this.$emit('closeDialog', false)
      },
    }
  }

</script>
