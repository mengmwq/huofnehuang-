<template>
  <el-dialog
      title="支出补录"
      :before-close="closeDialog"
      :visible.sync="isShowDialog"
      size="tiny" top="12vh" width="30%">
     <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline" @click.native="isShowTree=false">
       
       <el-form-item label="费用名称：" prop="costName">
            <el-input v-model.trim="editForm.costName" :maxlength="10" placeholder="请输入费用项"></el-input>
        </el-form-item>
        <el-form-item label="金额(元)："  prop="value">
            <el-input v-model.trim="editForm.value" :maxlength="11" placeholder="请输入金额(2位小数)"></el-input>
        </el-form-item>
        <el-form-item label="干系人：" >
            <el-input v-model.trim="editForm.person" :maxlength="11" placeholder="请输入干系人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确认</el-button>
        <el-button type="default" size="small" @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    props:['editForm','isShowDialog'],
    data () {
      return {
          rules: {
            costName:[
                { required: true, message: '请输入费用项', trigger: 'blur'},
            ],
            value:[
                { required: true, message: '请输入金额', trigger: 'blur'},
            ],
          }
      }
    },
    mounted () {
       
    },
    methods: {
      closeDialog(){
          this.$emit('closeDialog')
      },
      /** 确认保存   */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                const editForm  = this.editForm;
                // Api.fn(editForm).then(res=>{
                //     this.$message({
                //         showClose: true,
                //         type: 'success',
                //         message:`人员【${editForm.name}】添加成功`
                //       });
                //       this.$emit('dialogChange');
                // })
            } else {
              return false;
            }
          });
      },
    }
  }
</script>

