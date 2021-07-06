<template>
  <el-dialog
      :title="editForm.id?'编辑注意事项':'添加注意事项'"
      :before-close="closeDialog"
      :visible.sync="isShowDialog"
      size="tiny" top="12vh" width="50%">
       <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" >
          <el-form-item label="标题：" prop="title">
            <el-input v-model="editForm.title"  maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
            <el-input type="textarea" v-model="editForm.content"   autosize show-word-limit maxlength="200"></el-input>
        </el-form-item>
        </el-form>
        <div style="margin-top: 20px;text-align: center">
          <el-button type="default" size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>


<script>
  import Api from '@/api/index'
  import ValidForm from '@/utils/ValidForm'
  export default {
    props:['editForm','isShowDialog'],
    components:{
      
    },
    computed:{
     
    },
    data () {
      return {
      
        rules: {    
           title: [
            { required: true, message: '请输入标题', trigger: 'blur'},
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur'},
          ],
        },
      }
    },
    mounted () {
       
    },
    methods: {
      
      closeDialog(){
          this.$emit('closeDialog')
      },
      
      /** 确认保存 ： 新增或编辑 */
      confirm(){
          this.$refs.editForm.validate((valid) => {
            if (valid) {     
                let editForm  = this.editForm;
                editForm.bidId = this.$route.query.id
                const fn = editForm.id ?'updateAttentionById':'saveAttentioon'
                Api[fn](editForm).then(res=>{ 
                    this.$notify.success({
                        title: '提示',
                        message:`注意事项编辑成功`
                        })                 
                      this.$emit('changeDialog');  
                   
                }).catch(err=>{            
                })                
            } else {
              return false;
            }
          });                    
      },
    }
  }
</script>