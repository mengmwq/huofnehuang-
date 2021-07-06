<template>
  <div style="padding:20px;">
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="150px">
    
    <el-row :gutter="10">
       
         <el-col :span="8">
        <el-form-item label="料号：" prop="materialCode">
          <el-input v-model="form.materialCode" style="width: 100%;"></el-input>
          
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="项号：" prop="itemCode" >
          <!-- <el-input v-model="form.itemCode" style="width: 100%;"></!--> 
          <el-input-number v-model.trim="form.itemCode" min="1" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
       
          <el-col :span="8">
            <el-form-item label="库别：" prop="warehouse">
            <el-input v-model="form.warehouse" maxlength="20" style="width: 100%;"></el-input>
            </el-form-item>
        </el-col>
         <el-col :span="8">
            <el-form-item label="储位：" prop="storageLocation" >
            <el-input v-model="form.storageLocation" maxlength="20" style="width: 100%;"></el-input>
            </el-form-item>
        </el-col>
         <el-col :span="8">
       
      </el-col>
      
       
       <el-col :span="8">
        <el-form-item label="材料性质：" prop="materialProperties" >
          <el-select v-model="form.materialProperties" placeholder="请选择">
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
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="form.name" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单价：" prop="unitPrice">
          <el-input-number v-model.trim="form.unitPrice" min="1" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
      
      <!-- <el-col :span="8">
        <el-form-item label="数量：" prop="initialNumber" >
          <el-input-number v-model.trim="form.initialNumber" maxlength="19" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-col> -->
      <el-col :span="8">
        <el-form-item label="申报单位：" prop="applicants">
          
          <el-select v-model="form.applicants" filterable  clearable placeholder="请选择">
                    <el-option
                    v-for="item in applicationsTypeList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value">
                    </el-option>
                </el-select>
          <!-- <el-input v-model="form.applicants" :maxlength="4" style="width: 100%;"></el-input> -->
        </el-form-item>
      </el-col>
       <!-- <el-col :span="8">
        <el-form-item label="总价：">
          <el-input v-model="form.totalPrice" readonly style="width: 100%;"></el-input>
         
        </el-form-item>
      </el-col> -->
         <!-- <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="form.remarks" type="textarea" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col> -->
    </el-row>
    <el-row>
      
       
      <el-col :span="8">
        <el-form-item label="料件所属：" >
         <el-input v-model="form.materialBelongs" :maxlength="1" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
       <el-col :span="8">
        <el-form-item label="货物形态：" prop="cargoForm">
          <el-input v-model="form.cargoForm" :maxlength="1" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
     
      
         <el-col :span="8">
        <el-form-item label="合格类型:" prop="qualifiedType">
            <el-select v-model="form.qualifiedType" placeholder="请选择">
                    <el-option
                    v-for="item in qualifiedTypeList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value">
                    </el-option>
                </el-select>
          
        </el-form-item>
      </el-col>
      
      
    </el-row>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
        <el-button type="primary" v-if="$route.query.flag!='details'" size="medium" @click="submitForm('form')">提交</el-button>
        <!-- <el-button type="primary" size="medium" @click="submitForm('form')">提交后继续上传</el-button> -->
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>
<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  export default {
    components: {
      'v-upload': Upload
    },
    computed:{
      //报文业务类型
      messageTypeList(){
        
        return this.$store.state.dictionary.dists.MESSAGE_TYPE.children;
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
      //申报单位
      applicationsTypeList(){
        return this.$store.state.dictionary.dists.APPLICANTS_TYPE.children;
      },
    },
    data () {
      return {
        //
        flag: false,
        type: '',
        form: {},
        /** 表格 loading */
        listLoading: false,
        materrialCodeList:[],
        rules: {
          materialCode:[
            { required: true, message: '请输入料号', trigger: 'change' },
          ],
          itemCode:[
            { required: true, message: '请输入项号', trigger: 'blur' },
          ],
          name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          
          cargoMovingCode:[
            { required: true, message: '请输入出入库单号', trigger: 'blur' },
          ],
          warehouse:[
            { required: true, message: '请输入库别', trigger: 'blur' },
          ],
          storageLocation:[
            { required: true, message: '请输入储位', trigger: 'blur' },
            ],
          applicationForm:[
            { required: true, message: '请输入申请单号', trigger: 'blur' },
            ],
           materialProperties:[
            { required: true, message: '请选择材料性质', trigger: 'change' },
            ],
           initialNumber:[
            { required: true, message: '请输入数量', trigger: 'blur' },
            ],
          applicants:[
            { required: true, message: '请输入申报单位', trigger: 'blur' },
            ],
        },
        tableHeader: [{
          prop: 'no',
          label: '序号',
          width: '80',
          align: 'center',
          show: true
        }, {
          prop: 'carNo',
          label: '包装箱号',
          align: 'center',
          show: true
        }, {
          prop: 'carType',
          label: '数量（副/件）',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'length',
          label: '箱内件数',
          align: 'center',
          show: true
        }, {
          prop: 'width',
          label: 'V毛重（kg）',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'height',
          label: '体积',
          align: 'center',
          show: true
        }, {
          prop: 'prevMaintain',
          label: '体积重量',
          align: 'center',
          width: '100',
          show: true
        }, {
          prop: 'nextMaintain',
          align: 'center',
          label: '作品名称',
          width: '100',
          show: true
        }, {
          prop: 'insuranceExpired',
          align: 'center',
          label: '作者',
          width: '100',
          show: true
        }, {
          prop: 'insuranceCompany',
          align: 'center',
          label: '类型',
          width: '100',
          show: true
        }, {
          prop: 'isInsurance',
          align: 'center',
          label: '展品尺寸（cm）',
          width: '150',
          show: true
        }, {
          prop: 'insuranceMoney',
          align: 'center',
          label: '包装尺寸',
          width: '100',
          show: true
        }, {
          prop: 'leader',
          align: 'center',
          label: '净重（kg）材质',
          width: '150',
          show: true
        }, {
          prop: 'createDate',
          align: 'center',
          label: '创作年代',
          width: '100',
          show: true
        }, {
          prop: 'updateDate',
          align: 'center',
          label: '图片',
          width: '100',
          show: true
        }, {
          prop: 'updateDate',
          align: 'center',
          label: '估值（RMB）',
          width: '150',
          show: true
        }, {
          prop: 'updateDate',
          align: 'center',
          label: '收藏',
          show: true
        }],
        /** 表格数据 */
        listData: [],
       
      }
    },
    mounted () {
      this.loadData()
      this.getBondedDetail()
    },
    methods: {
      //查看详情
      getBondedDetail(){
        const params = {
          id :this.$route.query.id
        }
         Api.getBondedDetail(params).then(res=>{
            if(res){
                this.form = res
            }
         })
      },
      // goBack(){
      //   this.$router.push({
      //       path:
      //   })
      // },
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        this.listLoading = false
      },
      /**
       * 表单提交
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
            const params = this.form;
            const fn = params.id ?'updateBondedById':'saveBonded'
            Api[fn](params).then(res=>{
                this.$notify({
                  type:'success',
                  title:'提示',
                  message:'库存列表保存成功！',
                })
                this.$router.push({
                  path:'/router/nonBondedStorage'
                })
            })
          } else {
            this.$notify({
              type:'warning',
               title:'提示',
               message:'请完善表单',
            })
          }
        })
      },
      cancelSubmit (formName) {
        this.form = {}
      }

    }
  }
</script>

<style scoped>
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }

  .footer {
    float: right;
    margin-top: 20px;
  }
</style>
