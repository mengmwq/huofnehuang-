<template>
  <el-dialog
      title="添加收支"
      :visible.sync="isShowDialog"
      :before-close = "closeDialog"
      width="50%">
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
                <el-form-item label="费用名称：" prop="name">
                    <el-input v-model="editForm.name " :maxlength="36" placeholder="请输入费用名称"></el-input>
                </el-form-item>
            </el-col>
             <el-col :span="12">
                <el-form-item label="汇率："  prop="rate">
                   <el-input v-model.trim="editForm.rate" :maxlength="36" placeholder="请输入汇率"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="单价："  prop="unitPrice">
                   <el-input v-model.trim="editForm.unitPrice" :maxlength="10" placeholder="请输入单价"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="数量："  prop="num">
                   <el-input v-model.trim="editForm.num" :maxlength="10" placeholder="请输入数量"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="金额：" >
                   {{editForm.amount}}
                </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="币种：">
                   <el-select v-model="editForm.currency" placeholder="请选择币种">
                        <el-option v-for="(item,index) in currencyList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="汇后：">
                   {{editForm.remittance}}
                </el-form-item>
            </el-col>
            <el-col :span="12">
                 <el-form-item label="收款方：" prop="receiver">
                   <el-select  remote :remote-method="remoteMethod" filterable v-model="editForm.receiver" 
                   allow-create
                   clearable placeholder="请输入供应商" size="medium" style="width:100%">
                	   <el-option v-for="item in supplierList" 
                          :key="item.id"
                          :label="item.name"
                          :value="item.name">
	                   </el-option>
	               </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="备注：">
                   <el-input v-model="editForm.remarks" :maxlength="100" ></el-input>
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
        supplierList:[],
        dialogVisible: false,
        rules: {
            renown: [
              { required: true, message: '请输入费用名称', trigger: 'blur'},
            ],
            unitPrice: [
              { required: true, message: '请输入金额', trigger: 'blur'},
              { pattern: ValidForm.floatNumReg, message: '请正确输入金额'}
            ],
            amount: [
              { required: true, message: '请输入金额', trigger: 'blur'},
              { pattern: ValidForm.floatNumReg, message: '请正确输入金额'}
            ],
            num: [
              { required: true, message: '请输入数量', trigger: 'blur'},
              { pattern: ValidForm.floatNumReg, message: '请正确输入金额'}
            ],
            type:[
              { required: true, message: '请选择类型', trigger: 'change'},
            ],
            currency: [
              { required: true, message: '请输入币种', trigger: 'change'},
            ],
            rate: [
              { required: true, message: '请输入汇率', trigger: 'blur'},
            ],
            name:[
              { required: true, message: '请选择费用名称', trigger: 'blur'},
            ],
            receiver:[
              { required: true, message: '请输入收款方', trigger: 'change'},
            ],
        },
      }
    },
    watch: {
    //计算税后
    "editForm.rate": function(val) {
      const amount = this.editForm.amount;
      if (amount) {
        this.editForm.remittance = (val * amount).toFixed(2);
      }
    },
    //计算税后
    "editForm.amount": function(val) {
      const rate = this.editForm.rate;
      if (rate) {
        this.editForm.remittance = (rate * val).toFixed(2);
      }
    },
    "editForm.num": function(val) {
      const unitPrice = this.editForm.unitPrice;
      if (unitPrice) {
        this.editForm.amount = (unitPrice * val).toFixed(2);
      }
    },
    "editForm.unitPrice": function(val) {
      const num = this.editForm.num;
      if (num) {
        this.editForm.amount = (num * val).toFixed(2);
      }
    },
    },
    computed: {
        typeList() {
         return this.$store.state.dictionary.dists.PROJECT_BILL_TYPE.children;
        },
        currencyList() {
         return this.$store.state.dictionary.dists.Currency.children;
        },
        feeTypeList() {
         return this.$store.state.dictionary.dists.FeeType.children;
        },
    },
    mounted () {
     this.remoteMethod()
    },
    methods: {
      remoteMethod(query) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              supplierType:'1', //业务供应商
              name:query,  //可以通过名称搜索
          }
          Api.supplierList(params).then(data => {
            this.supplierList = data.records;
          })
          
        }, 200);
      },
     selectBlur(e){
      this.editForm.receiver = e.target.value
    },
      /**
       * 确认保存 ： 新增或编辑
       */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                let editForm  = this.editForm;
                editForm.projectCode = this.$route.query.projectCode;
                editForm.bidId = this.$route.query.bidId;
                let fn = editForm.id ? 'updateProjectBillList' : 'addProjectBillList'
				if(!editForm.id){
					editForm.type = '1';
					editForm.costType ='2';
				}
                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`操作成功`
                      });
                      this.$emit('changeDialog');
                    }else{
                      this.$message({
                        showClose: true,
                        type: 'error',
                        message:`操作失败`
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
