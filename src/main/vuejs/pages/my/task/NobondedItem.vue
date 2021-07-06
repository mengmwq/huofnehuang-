<template>
  <div>
    <div class="title">
      报文内容
      <div class="line"></div>
    </div>
     <el-row type="flex" justify="space-between" :gutter="10">
        <el-col :span="8">
        <el-form-item label="报关单号：" prop="nonBonded.customsDeclaration"
        :rules="[
            { required: true, message: '请输入报关单号', trigger: 'blur' },
            ]"
        >
          <el-input v-model="form.nonBonded.customsDeclaration" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报文加签：" prop="nonBonded.signature"
        :rules="[
            { required: true, message: '请输入报文加签', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.signature" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="报文批次号：" prop="nonBonded.batchCode"
        :rules="[
            { required: true, message: '请输入报文批次号', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.batchCode" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
     </el-row>
    <el-row type="flex" justify="space-between" :gutter="10">
        <el-col :span="8">
        <el-form-item label="发送报文类型：" prop="nonBonded.senderType"
        :rules="[
            { required: true, message: '请选择发送报文类型', trigger: 'change' },
            ]">
           <el-select v-model="form.nonBonded.senderType" placeholder="请选择">
            <el-option
            v-for="item in messageTypeList"
            :key="item.value"
            :label="item.cnInfo"
            :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
      </el-col>
        
        <el-col :span="8">
        <el-form-item label="报文发送者编号："  prop="nonBonded.senderCode" :rules="[
            { required: true, message: '请输入报文发送者编号', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.senderCode" style="width: 100%;"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="报文发送者地址：" prop="nonBonded.senderAddress" :rules="[
            { required: true, message: '请输入报文发送者地址', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.senderAddress" style="width: 100%;"></el-input>
        </el-form-item>
         </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" :gutter="10">
       <el-col :span="8" >
            <el-form-item label="报文传输时间：" prop="nonBonded.transferTime" :rules="[
            { required: true, message: '请选择报文传输时间', trigger: 'change' },
            ]">
            <el-date-picker
                v-model="form.nonBonded.transferTime"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="报文接收者编号："  prop="nonBonded.recipientCode" :rules="[
            { required: true, message: '请输入报文接收者编号', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.recipientCode" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
        <el-col :span="8">
        <el-form-item label="报文接收者地址：" prop="nonBonded.recipientAddress" :rules="[
            { required: true, message: '请输入报文接收者地址', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.recipientAddress" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="title">
      出入库相关内容
      <div class="line"></div>
    </div>
    <el-row type="flex" justify="space-between" :gutter="10">
        <el-col :span="8">
            <el-form-item label="出入库类型："  prop="nonBonded.cargoMovingType" :rules="[
            { required: true, message: '请选择出入库类型', trigger: 'change' },
            ]">
                <el-select v-model="form.nonBonded.cargoMovingType" placeholder="请选择">
                    <el-option
                    v-for="item in cargoMovingTypeList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="出入库单号：" prop="nonBonded.cargoMovingCode" :rules="[
            { required: true, message: '请输入出入库单号', trigger: 'blur' },
            ]">
            <el-input v-model="form.nonBonded.cargoMovingCode" style="width: 100%;"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
             <el-form-item label="出入库日期：" prop="nonBonded.cargoMovingData" :rules="[
            { required: true, message: '请选择出入库日期', trigger: 'change' },
            ]">
            <el-date-picker
                v-model="form.nonBonded.cargoMovingData"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-col>
        
         
    </el-row>
    <el-row>
        <el-col :span="8">
          
                <el-form-item label="库存类型:"  prop="nonBonded.stockType" :rules="[
            { required: true, message: '请选择库存类型', trigger: 'change' },
            ]">
                    <el-select v-model="form.nonBonded.stockType" placeholder="请选择">
                            <el-option
                            v-for="item in stockTypeList"
                            :key="item.value"
                            :label="item.cnInfo"
                            :value="item.value">
                            </el-option>
                        </el-select>
                
                </el-form-item>
            </el-col>
          <el-col :span="8">
            <el-form-item label="库别：">
            <el-input v-model="form.nonBonded.warehouse" style="width: 100%;"></el-input>
            </el-form-item>
        </el-col>
         <el-col :span="8">
            <el-form-item label="储位：" prop="nonBonded.storageLocation">
            <el-input v-model="form.nonBonded.storageLocation" style="width: 100%;"></el-input>
            </el-form-item>
        </el-col>
        
    </el-row>
    <el-row>
         <el-col :span="24">
        <el-form-item label="备注：" prop="nonBonded.remarks">
          <el-input v-model="form.nonBonded.remarks" type="textarea" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="title">
       物料相关内容
      <div class="line"></div>
    </div>
    <el-row>
        <el-col :span="8">
        <el-form-item label="料号：" prop="nonBonded.materialCode" :rules="[
            { required: true, message: '请输入料号', trigger: 'blur' },
            ]">
          <el-input v-model="form.nonBonded.materialCode" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
       <el-col :span="8">
        <el-form-item label="材料性质：" prop="nonBonded.materialProperties" :rules="[
            { required: true, message: '请输入材料性质', trigger: 'blur' },
            ]">
          <el-select v-model="form.nonBonded.materialProperties" placeholder="请选择">
            <el-option
            v-for="item in goodsNatureList"
            :key="item.value"
            :label="item.cnInfo"
            :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="期初日期："  prop="nonBonded.initialDate" :rules="[
            { required: true, message: '请输入期初日期', trigger: 'blur' },
            ]">
          <el-date-picker
                v-model="form.nonBonded.initialDate"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
     <el-row>
      <el-col :span="8">
        <el-form-item label="货主品名：" prop="nonBonded.ownershipName">
          <el-input v-model="form.nonBonded.ownershipName" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
     
      <el-col :span="8">
        <el-form-item label="单价：" prop="nonBonded.unitPrice">
          <el-input-number v-model.trim="form.nonBonded.unitPrice" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="货物包装毛重：" prop="nonBonded.containerGrossWeight">
          <el-input-number v-model.trim="form.nonBonded.containerGrossWeight" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
     
    </el-row>
    <el-row>
        <el-col :span="8">
        <el-form-item label="货物形态：" prop="nonBonded.cargoForm">
          <el-input v-model="form.nonBonded.cargoForm" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="数量：" prop="nonBonded.initialNumber">
          <el-input-number v-model.trim="form.nonBonded.initialNumber" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="货物包装净重：" prop="nonBonded.netWeight">
          <el-input-number v-model.trim="form.nonBonded.netWeight" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="单重：" prop="nonBonded.singleWeight">
          <el-input-number v-model.trim="form.nonBonded.singleWeight" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
       <el-col :span="8">
        <el-form-item label="总价：" prop="nonBonded.totalPrice">
          <el-input-number v-model.trim="form.nonBonded.totalPrice" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
     
      <el-col :span="8">
        <el-form-item label="集装容器毛重：" prop="nonBonded.grossWeight">
          <el-input-number v-model.trim="form.nonBonded.grossWeight" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
         <el-col :span="8">
        <el-form-item label="合格类型:" prop="nonBonded.qualifiedType">
            <el-select v-model="form.nonBonded.qualifiedType" placeholder="请选择">
                    <el-option
                    v-for="item in qualifiedTypeList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value">
                    </el-option>
                </el-select>
          
        </el-form-item>
      </el-col>
        <el-col :span="8">
        <el-form-item label="申请单号:" prop="nonBonded.applicationForm">
          <el-input v-model="form.nonBonded.applicationForm" placeholder="(非报关/报关)" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="业务单证编号：" prop="nonBonded.businessSheet">
          <el-input v-model="form.nonBonded.businessSheet" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      
      
    </el-row>
    <el-row>
      
      <el-col :span="8">
        <el-form-item label="功能代码：" prop="nonBonded.functionCode">
           <el-select v-model="form.nonBonded.functionCode" placeholder="请选择">
                    <el-option
                    v-for="item in functionCodeList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value">
                    </el-option>
                </el-select>
        </el-form-item>
      </el-col>
     
      
      
     <el-col :span="8">
        <el-form-item label="项号：" prop="nonBonded.itemCode">
          <el-input v-model="form.nonBonded.itemCode" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="BOM版本号：" prop="nonBonded.bom">
          <el-input v-model="form.nonBonded.bom" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
     
    </el-row>
    <el-row>
       <el-col :span="8">
            <el-form-item label="回执结果："  prop="nonBonded.receipt" :rules="[
            { required: true, message: '请选择回执结果', trigger: 'change' },
            ]">
                 <el-select v-model="form.nonBonded.receipt" placeholder="请选择">
                    <el-option
                    v-for="item in chkResultList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="16">
            <el-form-item label="回执详细说明："  prop="nonBonded.expound" :rules="[
            { required: true, message: '请输入回执详细说明', trigger: 'blur' },
            ]">
                <el-input v-model="form.nonBonded.expound" type="textarea" style="width: 100%;"></el-input>
            </el-form-item>
        </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  props:{
      form:{
          type:Object,
      }
  },
  computed:{
    //报文业务类型
    messageTypeList(){
      return [];
        //return this.$store.state.dictionary.dists.MESSAGE_TYPE.children;
    },
    //功能代码
    functionCodeList(){
        return this.$store.state.dictionary.dists.FUNCTION_CODE.children;
    },
    //回执结果
    chkResultList(){
        return this.$store.state.dictionary.dists.CHK_RESULT.children;
    },
    //发送报文的类型
    sendTypeList(){
        return this.$store.state.dictionary.dists.SEND_TYPE.children;
    },
    //料件性质
    goodsNatureList(){
        return this.$store.state.dictionary.dists.GOODS_NATURE.children;
    },
     //库存
    stockTypeList(){
        return this.$store.state.dictionary.dists.DATA_TYPE.children;
    },
    //出入库
    cargoMovingTypeList(){
      return [];
       // return this.$store.state.dictionary.dists.TYPE.children;
    },
    //进出库类型
    qualifiedTypeList(){
        return this.$store.state.dictionary.dists.CHK_CODE.children;
    },
  },
  data() {
    return {
    
      flag: false,
      type: "",
    //   form: {},
      /** 表格 loading */
      listLoading: false,
    
      tableHeader: [
        {
          prop: "no",
          label: "序号",
          width: "80",
          align: "center",
          show: true
        },
        {
          prop: "carNo",
          label: "包装箱号",
          align: "center",
          show: true
        },
        {
          prop: "carType",
          label: "数量（副/件）",
          width: "150",
          align: "center",
          show: true
        },
        {
          prop: "length",
          label: "箱内件数",
          align: "center",
          show: true
        },
        {
          prop: "width",
          label: "V毛重（kg）",
          width: "150",
          align: "center",
          show: true
        },
        {
          prop: "height",
          label: "体积",
          align: "center",
          show: true
        },
        {
          prop: "prevMaintain",
          label: "体积重量",
          align: "center",
          width: "100",
          show: true
        },
        {
          prop: "nextMaintain",
          align: "center",
          label: "作品名称",
          width: "100",
          show: true
        },
        {
          prop: "insuranceExpired",
          align: "center",
          label: "作者",
          width: "100",
          show: true
        },
        {
          prop: "insuranceCompany",
          align: "center",
          label: "类型",
          width: "100",
          show: true
        },
        {
          prop: "isInsurance",
          align: "center",
          label: "展品尺寸（cm）",
          width: "150",
          show: true
        },
        {
          prop: "insuranceMoney",
          align: "center",
          label: "包装尺寸",
          width: "100",
          show: true
        },
        {
          prop: "leader",
          align: "center",
          label: "净重（kg）材质",
          width: "150",
          show: true
        },
        {
          prop: "createDate",
          align: "center",
          label: "创作年代",
          width: "100",
          show: true
        },
        {
          prop: "updateDate",
          align: "center",
          label: "图片",
          width: "100",
          show: true
        },
        {
          prop: "updateDate",
          align: "center",
          label: "估值（RMB）",
          width: "150",
          show: true
        },
        {
          prop: "updateDate",
          align: "center",
          label: "收藏",
          show: true
        }
      ],
      /** 表格数据 */
      listData: [],
     
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      this.listLoading = false;
    },
    /**
     * 表单提交
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("form: " + this.form);
        } else {
          this.$message("请完善表单");
        }
      });
    },
    cancelSubmit(formName) {
      this.form = {};
    }
  }
};
</script>

<style scoped>
.title {
  color: #c2272d;
  margin-bottom: 10px;
  overflow: hidden;
  height: 40px;
}

.title .line {
  border-bottom: 2px dashed #dfdfdf;
  position: relative;
  left: 80px;
  margin-top: -11px;
}

.footer {
  float: right;
  margin-top: 20px;
}
</style>
