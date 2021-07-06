<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <div class="item">
        <div class="sequence"><div class="num">1</div>基本信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input v-model="form.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码：" prop="projetcNo">
              <el-cascader  filterable  clearable placeholder="请选择项目编码" style="width: 100%;"
                           :options="options"
                           @change="changeProjetcNo"
                           v-model="form.projetcNo">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="8">
            <el-form-item label="主单号：" prop="mainCode">
              <el-input v-model="form.mainCode"></el-input>
            </el-form-item>
          </el-col> -->
          <!--国际航材-->
          <el-col :span="8" v-if="form.projetcNo.indexOf('A') !== -1 && form.projetcNo.indexOf('I') !== -1">
            <el-form-item label="监管方式：">
              <el-select filterable v-model="form.regulate" placeholder="请选择监管方式" style="width: 100%;">
                <el-option
                  v-for="item in ProjectForeignRegulate"
                  :key="item.value"
                  :label="item.cnInfo"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.$route.query.type === 'F'">
            <el-form-item label="贸易方式：" prop="type">
              <el-select filterable v-model="form.type" placeholder="请选择贸易方式" style="width: 100%;">
                <el-option
                  v-for="item in tradeTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--国际航材------------------------------------------------------------------------------------------>
        <div v-if="form.projetcNo.indexOf('A') !== -1 && form.projetcNo.indexOf('I') !== -1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="件数：" prop="pieces">
                <el-input v-model="form.pieces"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量：" prop="number">
                <el-input v-model="form.number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="运单号：" prop="oddNumbers">
                <el-input v-model="form.oddNumbers" :maxlength="50" placeholder="50字符以内"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报价金额：" prop="quotationAmount">
                <el-input v-model="form.quotationAmount" @blur="formatNum(form.quotationAmount.toString())"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="销售代表：">
              <el-select filterable v-model="form.salesmanId" placeholder="请选择销售代表" style="width: 100%;">
                <el-option
                  v-for="item in salesmanList"
                  :key="item.uId"
                  :label="item.uName"
                  @click.native="selectSalesMan(item)"
                  :value="item.uId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否报关：">
              <el-switch
                style="display: inline-block"
                v-model="form.isCustoms"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$route.query.type!='bid'">
            <el-form-item label="是否投标：">
              <el-switch
                style="display: inline-block"
                v-model="isBiddingProject"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="项目描述：">
              <el-input v-model="form.description" type="textarea" placeholder="请输入项目描述" maxlength="500" :rows="4" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="项目备注：">
              <el-input v-model="form.remarks" type="textarea" placeholder="项目备注信息" maxlength="500" :rows="4" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--运输线路-->
        <TransRoute :haulwayReqs.sync="form.haulwayReqs" :operateFlag="'pro-add'"></TransRoute>
      </div>

      <div class="item">
        <div class="sequence"><div class="num">2</div>客户信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户名称：" prop="customId">
              <el-select filterable v-model="form.customId" 
              remote
              :remote-method="remoteMethod"
              clearable   placeholder="请选择客户" style="width: 100%;">
                <el-option
                  v-for="item in customerList"
                  @click.native="queryCustomerContacters"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：">
              <el-select filterable v-model="form.contacterId" clearable  @change="queryContacterDetail" placeholder="请选择联系人" style="width: 100%;">
                <el-option
                  v-for="item in contacterList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="手机号：">
              <el-input v-model="contacterTel" disabled placeholder="通过联系人关联出来"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Email：">
              <el-input v-model="contacterEmail" disabled placeholder="通过联系人关联出来"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-------------包裝箱信息------------------->
      <div class="item" v-if="this.$route.query.type !== 'bid'">
        <div class="sequence"><div class="num">3</div>包装信息</div>
        <div>
          <AddPackage :operateFlag="'pro-add'" :packagingInfoReqs.sync="form.packagingInfoReqs"></AddPackage>
        </div>
        <!-------------货物明细------------------->
        <div>
          <MaterialDfgDetail
            :operateFlag="'pro-add'"
            :projectType="projectType"
            :domesticMaterialDfgDetailReqs.sync="form.domesticMaterialDfgDetailReqs"
            :foreignMaterialDfgDetailReqs.sync="form.foreignMaterialDfgDetailReqs"
            :artMaterialDfgDetailReqs.sync="form.artDetailReqs"
          ></MaterialDfgDetail>
        </div>
      </div>
	  <!--
      <div class="item" v-if="this.$route.query.type === 'DF'">
           艺术品项目才有预算成本
        <div class="sequence"><div class="num">4</div>预算任务内容</div>
        <div>
          <Budget
                :projectType= projectType
                :taskInfoReqs.sync="form.taskInfoReqs"
          ></Budget>
        </div>
      </div>-->
      <!--投标信息 -->
      <div  class="item" v-if="isBiddingProject">
        <div class="sequence">
          <div class="num">{{$route.query.type=='bid'?'3':'5'}}</div>
          投标信息
        </div>
        <AddBidDfgProject :form="form" />
      </div>
      <div>
        <el-row class="sub-header">
          <el-col :span="24" class="text-right">
            <el-button type="primary" size="small" @click="cancel">重置</el-button>
            <el-button type="primary" size="small" @click="onSubmit('form', 1)">提交</el-button>
            <el-button type="primary" size="small" @click="onSubmit('form', 2)">提交后继续创建</el-button>
             <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
  import AddPackage from './AddPackage'
  import MaterialDfgDetail from './MaterialDfgDetail'
  import Budget from './Budget'
  import TransRoute from './TransRoute'
  import AddBidDfgProject from './AddBidDfgProject'
  import Api from '@/api/index'

  export default {
    name:'AddProject',
    components: {
      AddPackage,
      MaterialDfgDetail,
      Budget,
      TransRoute,
      AddBidDfgProject
    },
    data () {
      const type = this.$route.query.type
      const isBiddingProject = type =='bid'?true:false
      return {
        // 添加或者编辑的标志
        operateFlag: '',

        // 客户下拉列表
        customerList: [],
        // 客户联系人下拉列表
        contacterList: [],
          projectType: '',
        // 国际航材监管方式
        ProjectForeignRegulate: [],
        contacterTel: '',
        contacterEmail: '',
        isBiddingProject:isBiddingProject,
        // 项目创建参数
        form: {
          customId: '',
          //isBiddingProject:false,
          projetcNo: [],
          // 运输线路
          haulwayReqs: [],
          // 包装箱列表信息
          packagingInfoReqs: [],
          // 国内航材货物明细
          domesticMaterialDfgDetailReqs: [],
          foreignMaterialDfgDetailReqs: [],
          // 艺术品货物明细
          artDetailReqs: [],
          //投标信息
          bidProjectReq:{
            bidAttachmentReqList:[],
          },
          // 艺术品任务信息
          taskInfoReqs: []
        },
        rules: {
          projectName: [
            { required: true, message: '请填写项目名称', trigger: 'blur' }
          ],
          projetcNo: [
            { required: true, message: '请选择项目编码', trigger: 'blur' }
          ],
          customId: [
            { required: true, message: '请选择客户', trigger: 'change' }
          ],
          mainCode: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_]{1,}$/, message: '请输入数字类型' },
          ],
          pieces: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]{1,}$/, message: '请输入数字类型' },
          ],
          number: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]{1,}$/, message: '请输入数字类型' },
          ],
          quotationAmount: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^\+?(\d*\.\d{2})$/, message: '请输入数字' }
          ],
          oddNumbers: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]{1,}$/, message: '请输入数字类型' },
          ],

        },
        tradeTypeOptions: [{
          value: 'PI',
          label: '进口'
        }, {
          value: 'PE',
          label: '出口'
        }, {
          value: 'TI',
          label: '暂时进口'
        }, {
          value: 'TE',
          label: '暂时出口'
        }, {
          value: 'RI',
          label: '复进口'
        },{
          value: 'RE',
          label: '复出口'
        }],
        // 项目编码--艺术品
        artOptions: [{
          value: 'DF',
          label: '免税品',
          children: [{
            value: 'D',
            label: '国内',
            children: [{
              value: 'P',
              label: '采购'
            },{
              value: 'T',
              label: '运输'
            },{
              value: 'S',
              label: '仓储'
            }]
          }, {
            value: 'I',
            label: '国际',
            children: [{
              value: 'P',
              label: '采购',
            },{
              value: 'T',
              label: '运输'
            },{
              value: 'S',
              label: '仓储'
            }]
          }]
        }],
        salesmanList: [], //业务员下拉
        options: [],

      }
    },
    watch: {
    },
    mounted () {

        this.operateFlag = this.$route.path === '/router/ArtDfgList' ?  'edit' : 'add'
        const type = this.$route.query.type
       // 新增航材项目
       if (type === 'A') {
          this.options = this.materialOptions
       } else if(type==='DF') {
         // 新增艺术品项目
         this.projectType = '4'
         this.options = this.artOptions
       }else if(type==='bid') {
         // 新增投标项目；
         this.options = [...this.artOptions,...this.materialOptions]
       }

      // 获取字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.ProjectForeignRegulate) {
          this.ProjectForeignRegulate = distsObj.ProjectForeignRegulate.children
        }
      }
      //加载业务员下拉列表
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.salesmanList = res.records
        }
      })

      // 加载客户下拉列表
      //this.loadCustomerList()
      this.remoteMethod()

    },
    methods: {
      remoteMethod(query='') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              name:query,
          }
          Api.customerList(params).then(res=>{
             
             this.customerList = res.records
          })
          
        }, 200);
      },
      //金额转成两位小数
      formatNum(str){
        let newStr = "";
        let count = 0;
        if(str.indexOf(".")===-1){
          for(let i=str.length-1;i>=0;i--){
            // if(count % 3 === 0 && count !== 0){
            //   newStr = str.charAt(i) + "," + newStr;
            // }else{
            newStr = str.charAt(i) + newStr;
            // }
            count++;
          }
          str = newStr + ".0000"; //自动补小数点后四位
          console.log(str)
          this.form.quotationAmount = str
        }
        else
        {
          for(let i = str.indexOf(".")-1;i>=0;i--){
            // if(count % 3 === 0 && count !== 0){
            //   newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
            // }else{
            newStr = str.charAt(i) + newStr; //逐个字符相接起来
            // }
            count++;
          }
          str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
          console.log(str)
          this.form.quotationAmount = str
        }
      },

      selectSalesMan(item){
        this.form.salesman = item.uName
      },
      changeProjetcNo () {
        
        // 新增航材项目
        if (this.$route.query.type === 'A') {
          if (this.form.projetcNo.indexOf('A') !== -1 && this.form.projetcNo.indexOf('I') !== -1) {
            // 国际航材
            this.projectType = '3'
          } else if (this.form.projetcNo.indexOf('A') !== -1 && this.form.projetcNo.indexOf('D') !== -1) {
            // 国内航材
            this.projectType = '2'
          }
        }

      },
      /**
       * 客户下拉列表
       * */
      loadCustomerList (query='') {
        const params = {
          pageNum:1,
          pageSize:10,
          name:query,
        }
        Api.customerList(params).then((res) => {
          if (res) {
            this.customerList = res.records
          }
        })
      },
      /**
       * 查询客户的联系人列表
       * */
      queryCustomerContacters () {
        const params = {
           id: this.form.customId
        }
        Api.customerContacters(params).then((res) => {
          if (res) {
            this.contacterList = res
            this.form.contacterId = ''
            this.contacterTel = ''
            this.contacterEmail = ''
          }
        })
      },
      /**
       * 查询联系人信息
       * */
      queryContacterDetail () {
        Api.contacterDetail({id: this.form.contacterId}).then((res) => {
          if (res) {
            this.contacterTel = res.phone
            this.contacterEmail = res.email
          }
        })
      },

      // 创建项目
      onSubmit (formName, tag) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 项目编码
            let code = this.form.projetcNo
            this.form.projectCodeLevel1 = code[0]
            this.form.projectCodeLevel2 = code[1]
            this.form.projectCodeLevel3 = code[2]
            if (code[3]) {
              if (code[3].indexOf('-') > 0) {
                let arr = code[3].split('-')
                this.form.projectCodeLevel4 = arr[1]
              } else {
                this.form.projectCodeLevel4 = code[3]
              }
            }

            const type = this.$route.query.type
            if (type === 'F') {
                 // 创建艺术品项目
                this.form.projectType = '1'
                this.handleSubmit('艺术品','addArtProject',this.form)
             } else if(type === 'A') {
                 if (code[0] === 'A' && code[1] === 'D') {
                     // 航材国内
                     this.form.projectType = '2'
                     this.handleSubmit('国内航材','addDomesticMaterialProject',this.form)
                 } else if (code[0] === 'A' && code[1] === 'I') {
                     // 航材国际
                     this.form.projectType = '3'
                     this.handleSubmit('国际航材','addForeignMaterialProject',this.form)
                 }
             } else if(type === 'DF'){
                 // 航材国际
                 this.form.projectType = '4'
                 this.handleSubmit('免税品','addArtProject',this.form)
            } else if(type==='bid'){
                const projectType = code[0]
                if(projectType==='F'){
                     this.form.projectType = '1'
                     this.handleSubmit('艺术品投标','addArtProject',this.form)
                }else if(projectType ==='A'){
                    if(code[1] === 'D'){
                      this.form.projectType = '2'
                      this.handleSubmit('国内航材投标','addDomesticMaterialProject',this.form)
                    }else if(code[1] === 'I'){
                        // 航材国际
                     this.form.projectType = '3'
                     this.handleSubmit('国际航材投标','addForeignMaterialProject',this.form)
                    }else if(code[1] === 'DF'){
                        // 航材国际
                     this.form.projectType = '4'
                     this.handleSubmit('国际航材投标','addArtProject',this.form)
                    }
                }
             }
          } else {
            return false
          }
        })
      },
      handleSubmit(projectName,fn,form){
         if (this.operateFlag === 'add') {
            Api[fn](form).then((res) => {
                if (res) {
                    this.$notify.success({
                        title: '提示',
                        message: `${projectName}项目创建成功`
                    })
                    this.goBack()
                }
            })
        }
      },
      resrtForm () {
        this.form = {
          customId: '',
          projetcNo: [],
          // 运输线路
          haulwayReqs: [],
          // 包装箱列表信息
          packagingInfoReqs: [],
          // 国内航材货物明细
          domesticMaterialDfgDetailReqs: [],
          foreignMaterialDfgDetailReqs: [],
          // 艺术品货物明细
          artDetailReqs: [],
          // 艺术品任务信息
          taskInfoReqs: [],
          //投标信息
          bidProjectReq:{
            bidAttachmentReqList:[],
          },


        }
        this.form.contacterId = ''
        this.contacterTel = ''
        this.contacterEmail = ''
      },
      cancel () {
        this.resrtForm()
      },
      goBack(){
          const tag = this.$route.query.tag
          if (tag === 1) {
              this.$router.push({path: '/router/ArtDfgList'})
          } else {
            this.$router.push(
              {
                 path:'/router/ArtDfgList'
              }
            )
            this.resrtForm()
          }
      },
    }
  }
</script>

<style scoped>
  .item {
    border-left: 1px dashed #545454;
    padding: 20px 0 0 10px;
    position: relative;
    margin-bottom: 20px;
  }
  .sequence {
    position: absolute;
    top: -30px;
    left: -11px;
    margin: 20px 0;
    font-size: 14px;
    height: 35px;
    background-color: #FFFFFF;
  }
  .sequence .num {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #C0272C;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    margin-right: 10px;
  }
  .sub-header {
    margin: 10px 0;
  }
  .sub-title {
    color: #C0272C;
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
  }

</style>
