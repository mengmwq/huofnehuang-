<template>
  <el-dialog
      title="申请撤销"
      :before-close="closeDialog"
      :visible.sync="isShowDialog"
      size="tiny" top="12vh" width="50%">
       <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" >
          <el-row>
            <el-col :span="12" v-if="editForm.projectName">
                <span>项目名称：{{editForm.projectName}}</span>
            </el-col>
            <!-- <el-col :span="12">
                <span>审批人：{{editForm.projectName}}</span>
            </el-col> -->
            </el-row>
            <el-row class="m10">
            <el-col :span="24">
                <el-input v-model="editForm.withdrawalReasons" type="textarea" placeholder="请输入撤销原因" maxlength="500" :rows="4" show-word-limit></el-input>
            </el-col>
            </el-row>
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
        projectList:[],
        approvalList:[],
        userList:[],
        
        rules: {    
           withdrawalReasons: [
            { required: true, message: '请输入撤销原因', trigger: 'blur'},
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
                
                Api.changeState(editForm).then(res=>{ 
                    this.$notify.success({
                        title: '提示',
                        message:`撤销成功`
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