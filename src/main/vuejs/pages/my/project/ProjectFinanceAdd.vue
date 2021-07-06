<template>
  <el-dialog
      title="添加收支"
      :visible.sync="isShowDialog"
      :before-close = "closeDialog"
      width="50%">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline">
      
        <el-row>
          <el-col :span="12">
                <el-form-item label="费用名称：" prop="renown">
                    <el-input v-model.trim="editForm.renown " :maxlength="36" placeholder="请输入费用名称"></el-input>
                </el-form-item>
            </el-col>
           
          <el-col :span="12">
                <el-form-item label="类型：" prop="type">
                   <el-select v-model="editForm.type" placeholder="请选择类型">
                        <el-option v-for="(item,index) in typeList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
             <el-col :span="12">
                <el-form-item label="收款方："  prop="receiver" v-if="editForm.type==1">
                   <el-input v-model.trim="editForm.receiver" :maxlength="36" placeholder="请输入收款方"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="金额："  prop="amount">
                   <el-input v-model.trim="editForm.amount" :maxlength="10" placeholder="请输入金额"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                 <el-form-item label="备注：">
                   <el-input v-model.trim="editForm.remarks" :maxlength="50" show-word-limit  placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确认</el-button>
        <el-button type="success" size="small" @click="closeDialog">取消</el-button>
      </div>
</el-dialog>
</template>
<script>
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'

  export default {
    name: 'ProjectFinanceAdd',
    components: {},
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        
        dialogVisible: false,
        rules: {
            renown: [
              { required: true, message: '请输入费用名称', trigger: 'blur'},
            ],
            amount: [
              { required: true, message: '请输入金额', trigger: 'blur'},
              { pattern: ValidForm.floatNumReg, message: '请正确输入金额'}
            ],
            type:[
              { required: true, message: '请选择类型', trigger: 'change'},
            ],
        },
      }
    },
    computed: {
        typeList() {
        //return [];
         return this.$store.state.dictionary.dists.BalanceDetailedType.children;
        },
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
                let editForm  = this.editForm;
                editForm.relationId = this.$route.query.id;
              
                let fn = editForm.id ? 'updateProjectBalanceDetailed' : 'insertProjectBalanceDetailed'

                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`项目收支添加成功`
                      });
                      this.$emit('changeDialog');
                    }else{
                      this.$message({
                        showClose: true,
                        type: 'error',
                        message:`项目收支添加失败`
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
