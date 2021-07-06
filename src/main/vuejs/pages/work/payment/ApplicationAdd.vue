<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编码：" prop="projectCode">
                <span v-if="$route.query.flag=='myApply'">{{form.projectCode}}</span>
                <el-select v-else filterable v-model="form.projectCode" 
                 remote
                    :remote-method="remoteMethod"
                placeholder="项目名称/编号/客户名称" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in projectList"
                    :key="index"
                    :label="item.projectCode"
                    :value="item.projectCode">
                    <span style="float: left">{{ item.projectName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row v-if="$route.query.tag!='outerWorker'">
            <el-col :span="12"  v-if="$route.query.flag!='myApply'">
              <el-form-item label="供应商类型：" prop="supplierType">
                <!-- <span v-if="$route.query.flag=='myApply' && form.attached.SupplierType">{{form.attached.SupplierType[form.supplierType].cnInfo}}</span> -->
                <el-select  filterable v-model="form.supplierType" @change="supplierTypeChange()" clearable placeholder="供应商类型" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in supplierTypeList" :key="index" :label="item.cnInfo" :value="item.value" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商名称：" prop="customName">
                <span v-if="$route.query.flag=='myApply'">{{form.customName}}</span>
                <el-select v-else filterable v-model="form.customName" clearable placeholder="供应商名称" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in customList" :key="index" :label="item.name" :value="item.name" @click.native="selectCunstom(item)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同号：" prop="contractId">
                <span v-if="$route.query.flag=='myApply'">{{form.contractCode}}</span>
                <el-select v-else filterable style="width:100%" clearable v-model="form.contractCode" placeholder="合同号">
                  <el-option v-for="(item, index) in contractList" 
                  @click.native="handleContractId(item)"
                  :key="index" 
                  :label="item.contractCode" 
                  :value="item.contractCode">
                     <span  style="float: left">{{ item.contractCode }}</span>
                     <span  style="float: right; color: #8492a6; font-size: 13px">{{ item.contractName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款内容：" prop="content">
                <el-input v-model="form.content"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：" prop="receiptNo">
                <el-input v-model="form.receiptNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：" prop="receiptInfo">
                <el-input v-model="form.receiptInfo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行：" prop="depositBank">
                <el-input v-model="form.depositBank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号：" prop="bankCode">
                <el-input v-model="form.bankCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           
          
          <!-- <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="form.remark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
        <p class="step-title"><span class="step-icon">2</span>费用明细：</p>
        
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="币种：" prop="currency">
                <el-select filterable style="width:100%" clearable v-model="form.currency" placeholder="">
                  <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：" prop="rate">
                <el-input v-model="form.rate" maxlength="9" @change="calcAmount"></el-input>
              </el-form-item>
             
            </el-col>
          </el-row>
          <el-table class="page-table mb10 ml10"  :data="listData" show-summary :summary-method="getSummaries"  stripe highlight-current-row :cell-style="{color:'#333'}"
          >
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'feeTypeName'">
                  <el-input v-model="scope.row.feeTypeName"></el-input>
                </div>
                <div v-else-if="header.prop == 'amount'">
                  <el-input-number v-model="scope.row.amount" controls-position="right" style="width:100px;"  :min="0" @change="calcOtherTotalAmount(scope.row, scope.$index, listData),calcPrice(scope.row.amount, scope.$index, 'listData', 'amount')" @blur="calcOtherTotalAmount(scope.row, scope.$index, listData),calcPrice(scope.row.amount, scope.$index, 'listData', 'amount')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'num'">
                  <el-input-number v-model="scope.row.num"  controls-position="right" style="width:100px;"  :min="0" @change="calcOtherTotalAmount(scope.row, scope.$index, listData),calcPrice(scope.row.num, scope.$index, 'listData', 'num')" @blur="calcOtherTotalAmount(scope.row, scope.$index, listData),calcPrice(scope.row.num, scope.$index, 'listData', 'num')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'totalAmount'">
                  {{parseFloat(scope.row.amount*scope.row.num).toFixed(2)}}
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="70">
              <template slot="header" slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteItem(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款金额：" prop="payment">
                {{form.payment}}
                <!-- <el-input readonly v-model=""></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折合人民币：">
                <span v-if="form.chineseAmount"></span>{{form.amount}} （{{form.chineseAmount}}）
                <!-- <el-input v-model="form.chineseAmount" readonly placeholder="根据付款金额自动转化"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">3</span>单据上传：</p>
        <div class="dash-content" >
           <div style="margin-left:20px;">
            <div class="text-right mb10">
              <el-button type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
            </div>
         
            <el-table class="page-table" :data="form.applyAttachmentReqs" stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <template v-for="(header, index) in tableHeaderAttachments">
                 <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                  <div v-if="header.prop == 'type'">
                      {{getDistsKeyName(scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template> -->
              </el-table-column>
              </template>
             
              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <template v-if="scope.row.attachmentUrlKey">
                    <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-if="isHasImg(scope.row.attachmentUrlKey)">预览图片</el-button>
                    <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1">预览PDF</el-button>
                    <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.attachmentUrlKey)">下载文件</el-button>
                  </template>
                  <el-button  type="primary" size="small" @click="deleteFileItem(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- <div class="dash-content">
          <el-row style="padding: 10px 20px;">
            <el-col :span="12">
              <el-form-item label="附件上传：">
                <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.applyAttachmentReqs"></FileListMultiUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
        <!-- <p class="step-title"><span class="step-icon">4</span>选择抄送人：</p>
        <el-form-item label="抄送人：">
               <el-select
              filterable
              clearable
             multiple
              remote
              :remote-method="getPersonList"
              @remove-tag="removeCopyGive"
              v-model="form.copyGiveName"
              placeholder="可模糊搜索"
              style="width: 500px"
            >
              <el-option
                v-for="(item,index) in personList"
                @click.native="handleSelectedCustomer(item)"
                :key="index"
                :label="item.uName"
                :value="item.uName"
              ></el-option>
            </el-select>
            <span class="text-info">用于跨部门审批</span>
        </el-form-item> -->
        
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="default" size="medium" @click="goBack('add')">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 0)">提 交</el-button>
        <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitForm('form', 1)">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
     <file-upload v-show="dialogVisible" :isShowDialog="dialogVisible" :fileTyeArr="fileTypeList" :hasCallBack="hasCallBack"
                 :callBackName="callBackName" @getUploadFile="getUploadFile" @closeDialog="closeDialog"></file-upload>
  </div>
</template>

<script>
  //import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import FileUpload from '@/components/common/FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
  import Api from '@/api/index'
  import Util from '@/utils/'
  export default {
    name:'PaymentApply',
    components: {
      //FileListMultiUpload,
      FileUpload,
      ImgPreview
    },
    computed:{
      supplierTypeList(){
        return this.$store.state.dictionary.dists.SupplierType.children;
      },
      currencyTypeList(){
        return this.$store.state.dictionary.dists.Currency.children;
      },
      fileTypeList(){
          return this.$store.state.dictionary.dists.CustomsAttachmentType.children;
      },
    },
    data () {
      const projectCode = this.$route.query.projectCode
      return {
        //附件上传
        hasCallBack: true,
        callBackName: 'getUploadFile',
        dialogVisible:false,
        
        tableHeaderAttachments: [{
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          width: '200',
          show: true
        }, ],
        //图片预览
        isShowDialogImg:false,
        pictures:null,

        operate: '',
        removedAll: false,
        type: '',
        form: {
          copyGives:[],
          copyGiveName:[],
          currency:'001',
          rate:'1',
          customId:'',
          supplierType:'',
          projectCode:projectCode?projectCode:'',
          contractId:'',
          contractCode: '',
          depositBank: '',
          bankCode: '',
          amount: '',
          payment:'',
          applyAttachmentReqs: []
        },
        personList:[], //人员列表 
        /** 项目列表 */
        projectList: [],
        contractList: [],
        copyGiveList: [], // 抄送人
        customList: [],
        /** 表格 loading */
        listLoading: false,
        rules: {
          supplierType: [
            {required: true, message: "请选择供应商类型", trigger: "change"}
          ],
          customId: [
            {required: true, message: "请选择客户", trigger: "blur"}
          ],
          // copyGiveName:[
          //   {required: true, message: "请选择抄送人", trigger: ["blur","change"]}
          // ],
          rate:[
             {required: true, message: "请输入汇率", trigger: "blur"},
              { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          'amount': [
            { required: true, message: '请填写费用明细表，此项由费用明细汇总所得', trigger: 'change' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          'projectCode': [
            { required: false, message: '非空', trigger: 'blur' },
          ],
        },
        listData: [],
        tableHeader: [{
          prop: 'feeTypeName',
          label: '费用名称',
          align: 'center',
          show: true
        }, {
          prop: 'amount',
          label: '单价',
          align: 'center',
          show: true
        }, {
          prop: 'num',
          label: '数量/重量',
          align: 'center',
          show: true
        },{
          prop: 'totalAmount',
          label: '金额',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        FeeTypeList: [],
        fileList: [],
      }
    },
    watch: {
      'listData':{
         handler:function(){
           this.sumAmount()
          },
          deep:true
       },
      'form.amount' : function (value) {
         if (value  || value === 0) {
           this.changeMoneyToChinese(value)
         }
      },
      'form.currency':function(value){
          const rate =  this.form.rate
          if(value!=='001' && rate=='1'){
               this.form.rate = ''
          }else if(value==='001'){
            this.form.rate = '1'
          }
      }
    },
    mounted () {
      // 获取字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.FeeType) {
          this.FeeTypeList = distsObj.FeeType.children
        }
      }
      this.operate = this.$route.path === '/router/editPaymentApplication' ? 'edit' : 'add'
      // 项目列表
      this.remoteMethod()
      this.getSupplierList()
      if (this.operate === 'edit') {
        this.loadData()
      }
      //获取抄送人列表 
      //this.getPersonList()

    },
    methods: {
      // 处理合同Id与合同名称
      handleContractId(item){
          this.form.contractId = item.contractId
          this.form.contractName = item.contractName
      },
      // 删除撑着抄送人
    removeCopyGive (val) {
      console.log(val)
      this.copyGiveList = this.copyGiveList.filter(item => item.uName != val)
    },
      
      //获取抄送人
      getPersonList(query = "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
            pageNum: 1,
            pageSize: 10,
            name: query
          };
          Api.getUserPage(params).then(res => {
            this.personList = res.records;
          });
        }, 200);
      },
      
      handleSelectedCustomer(user) {
        if (!this.copyGiveList.some(item => item.uId === user.uId)) {
          this.copyGiveList.push({
            uId: user.uId,
            uName: user.uName
          })
        }
      },
      getAmountNum(arr,attr){
          const values = arr.map(item => Number(item[attr]));
          if (!values.every(value => isNaN(value))) {
            return values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }else {
             return 0;
          }
          
       },
      //计算总合计
      sumAmount(){
        //各费用明细求和
        const amount =  parseFloat(this.getAmountNum(this.listData,'totalAmount')).toFixed(2)
        this.form.payment = amount;
        console.log(amount,'amount111')
      },
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        // 判断是否图片
        isHasImg(key){
           const aFileType = ['.jpg','.jpeg','.png']
            return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
        },
        //文件预览处理
        showFileDetails(key){
          let img = ''
          Api.getUrl(key).then(data => {
            if (data) {
              if(this.isHasImg(key)){
                //图片预览处理；
                 img = data
                  this.pictures = []
                  this.pictures.push(img)
                  this.isShowDialogImg = true
              }else{
                //除图片的其他文件；
                   window.open(data)
              }
            }
          })

        },
      getDistsKeyName(type){
        return this.fileTypeList.filter(item=>item.value==type)[0].cnInfo;
      },
      closeDialog () {
        this.dialogVisible = false
      },
      getUploadFile (form){

        //子组件form 提交过来的参数
        /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
        let _this = this
        this.form.applyAttachmentReqs.push({
          name: form.fileName,
          attachmentUrlKey: form.key,
          type: form.type,
          description: form.description,
          //size: _this.renderSize(form.size)
        })
      },
      //删除报关附件
      deleteFileItem(row,index){
          if(row.id){
            const params  = {
              id:row.id
            }
            Api.deleteAttachment(params).then(res=>{
                this.form.applyAttachmentReqs.splice(index,1)
            })
          }else{
             this.form.applyAttachmentReqs.splice(index,1)
          }
      },
      //供应商类型改变。
      supplierTypeChange(){
        this.form.customId =''
        this.getSupplierList()
      },
      //获取供应商列表
      getSupplierList(){
        const params = {
          pageNum:1,
          pageSize: 5000,
          supplierType:this.form.supplierType
        }
        Api.supplierList(params).then(data => {
          this.customList = data.records;
        })
      },
      remoteMethod(query='') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              searchStr:query,
              myProjectList:false
          }
          Api.projectList(params).then(res=>{
            console.log(res,'resss')
            this.projectList = res.records
          })
          
        }, 200);
      },
      //验证是否是数字 
      isNumber(obj) {
        return obj === +obj
      },
      calcAmount(){
        if(this.listData.length>0){
            const amount =   this.listData.map(item=>item.amount)
            const num = this.listData.map(item=>item.num)
            var newTotal = 0;
            for(var i = 0 ; i < this.listData.length;i++){
            	newTotal = (amount[i] * num[i]) + newTotal
            }
            const newAmount = amount.reduce((prev,cur)=>{
                return parseFloat(prev) + parseFloat(cur)
            })
            const  newNum = num.reduce((prev,cur)=>{
                return parseFloat(prev) + parseFloat(cur)
            })
            const rate = parseFloat(this.form.rate)
            if(this.isNumber(rate)){
              this.form.amount = (newAmount * rate).toFixed(2)
              this.form.amount = (newTotal * rate).toFixed(2)
            }else(
               this.$notify.warning({
                 title:'提示',
                 message:'请输入正确的汇率信息！'
               })
            )
             
        }else{
           this.form.amount= ''
           this.form.chineseAmount = ''
        }
        
      },
      calcPrice(value, index, tag, key) {
        if (tag === 'listData') {
          this.listData[index][key] = parseFloat(value).toFixed(2)
          this.calcAmount()
        }
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if ((column.property =='amount'|| column.property =='num' || column.property =='totalAmount') && !values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2)
           
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      calcOtherTotalAmount(item, index, listData){
        if ((item.amount || item.amount === 0) && (item.num || item.num === 0) ) {
          listData[index].totalAmount = (parseFloat(item.amount) * parseFloat(item.num)).toFixed(2)
        }
      },
      changeMoneyToChinese (money) {
        let cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字
        let cnIntRadice = new Array("","拾","佰","仟"); //基本单位
        let cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
        let cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位
        //let cnInteger = "整"; //整数金额时后面跟的字符
        let cnIntLast = "元"; //整型完以后的单位
        let maxNum = 999999999999999.9999; //最大处理的数字

        let IntegerNum; //金额整数部分
        let DecimalNum; //金额小数部分
        let ChineseStr=""; //输出的中文金额字符串
        let parts; //分离金额后用的数组，预定义
        if( money == "" ){
          return "";
        }
        money = parseFloat(money);
        if( money >= maxNum ){
          $.alert('超出最大处理数字');
          return "";
        }
        if( money == 0 ){
          //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
          ChineseStr = cnNums[0]+cnIntLast
          //document.getElementById("show").value=ChineseStr;
          return ChineseStr;
        }
        money = money.toString(); //转换为字符串
        if( money.indexOf(".") == -1 ){
          IntegerNum = money;
          DecimalNum = '';
        }else{
          parts = money.split(".");
          IntegerNum = parts[0];
          DecimalNum = parts[1].substr(0,4);
        }
        let zeroCount = ''
        let IntLen = 0
        if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
          zeroCount = 0;
          IntLen = IntegerNum.length;
          for(let i=0;i<IntLen;i++ ){
            let n = IntegerNum.substr(i,1);
            let p = IntLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if( n == "0" ){
              zeroCount++;
            }else{
              if( zeroCount > 0 ){
                ChineseStr += cnNums[0];
              }
              zeroCount = 0; //归零
              ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
            }
            if( m==0 && zeroCount<4 ){
              ChineseStr += cnIntUnits[q];
            }
          }
          ChineseStr += cnIntLast;
          //整型部分处理完毕
        }
        let decLen = 0
        if( DecimalNum!= '' ){//小数部分
          decLen = DecimalNum.length;
          for(let i=0; i<decLen; i++ ){
           let n = DecimalNum.substr(i,1);
            if( n != '0' ){
              ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
            }
          }
        }
        if( ChineseStr == '' ){
          //ChineseStr += cnNums[0]+cnIntLast+cnInteger;
          ChineseStr += cnNums[0]+cnIntLast;
        }
        this.form.chineseAmount = ChineseStr;
      },
      selectCunstom (item) {
        this.form.customId = item.id
        this.form.depositBank = item.depositBank
        this.form.bankCode = item.publicAccounts
        this.form.contractId = ''
        // 合同号
        //供应商传001客户传002合作伙伴003
        Api.contractList({contractTargetId: item.id, contractTargetType: '001'}).then(data => {
          if (data) {
            this.contractList = data;
          }

        })
      },

      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        Api.payDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            let _this = this
            //处理抄送人
            const copyGive = res.copyGives
            if(copyGive && copyGive.length>0){
               //const copyGiveList = []
               copyGive.map((item,index)=>{
                  this.copyGiveList.push({
                     uId:item,
                     uName:res.copyGiveName[index]
                  })
               })
              
            }
            if (res.payingApplyDetails) {
              this.listData = res.payingApplyDetails
            }
            if (res.applyAttachments && res.applyAttachments.length > 0) {
              res.applyAttachments.forEach(function (item) {
                _this.$set(item, 'url', item.attachmentUrlKey)
              })
              this.form.applyAttachmentReqs = res.applyAttachments
            } else {
              this.form.applyAttachmentReqs = []
            }
          }
        })
        this.listLoading = false
       //this.sys()
      },
      deleteItem(index){
        this.listData.splice(index, 1);
        console.log(this.listData,'listData')
        this.calcAmount()
      },
      addItem () {
        let newItem = {
          feeTypeId: '',
          feeTypeName: '',
          amount: '',
          num:'',
          totalAmount:'',
          remarks: ''
        }
        this.listData.push(newItem)
      },
      /**
       * 表单提交
       */
      submitForm (formName, i) {
        if (!this.form.projectCode && !this.form.contractId) {
          this.$notify.warning({
            title: '提示',
            message: '项目编码和合同号至少选择一个'
          })
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //从投标项目详情中过来的项目，需要传投标项目ID
            const query   =this.$route.query;
             const bidId = query.bidId
             const tag = query.tag 
             if(tag == 'outerWorker'){
              this.form.customId = bidId
             }else if(bidId){
               this.form.bidId = bidId
             }
             
            let _this = this
            if (this.form.amount) {
              this.form.amount = parseFloat(this.form.amount).toFixed(2)
            }
            if (this.listData.length > 0) {
              this.form.payingApplyDetailReqs = this.listData
             
            }
            if (this.fileList.length > 0) {
              _this.form.applyAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.form.applyAttachmentReqs.push({
                  name: item.name,
                  attachmentUrlKey: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.applyAttachmentReqs = []
              }
            }
            //处理抄送人
            const copyGiveList = this.copyGiveList
            if(copyGiveList.length>0){
              this.form.copyGives = copyGiveList.map(item=>item.uId)
              this.form.copyGiveName = copyGiveList.map(item=>item.uName)
            }
            if (this.operate === 'edit') {
              delete this.form['payingApplyDetails']
              delete this.form['attached']
              delete this.form['applyAttachments']
              Api.updatePay(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '付款申请更新成功'
                  })
                  // 跳转回去
                  //this.goHref('update')
                  this.goBack('add')
                }
              })
            } else {
              Api.addPay(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '付款申请添加成功'
                  })
                  if (i == 1) {
                    const projectCode = this.$route.query.projectCode
                    this.form = {
                      currency:'001',
                      rate:'1',
                      supplierType:'',
                      projectCode:projectCode?projectCode:'',
                      depositBank: '',
                      bankCode: '',
                      amount: '',
                      payment:'',
                      applyAttachmentReqs: []
                    }
                    this.listData = []
                    this.removeAll = false
                  } else {
                    // 跳转回去
                   this.goBack('add')

                  }

                }
              })
            }

          } else {
            this.$message('请完善表单')
          }
        })
      },
      goBack(flag){
        const path = flag==='add'?'paymentApplication':'addPaymentApplication'
        this.$router.push({
          path:'/router/'+path
        })
      },
     goHref() {
        const query = this.$route.query
        if (query.tag === '1' || query.flag === 'myApply') {
            //来自项目详情
            // 如果入口是我的申请进来的，创建完成之后，跳转到我的申请
            this.$router.push({path: '/router/myApply'})
          } else if (query.tag === 'bid') {
           //来自投标详情
                const path = '/router/intercourseAccount'
                this.$router.push({
                  path: path,
                  query:{
                    id:query.bidId,
                    projectCode:query.projectCode,
                  }
                })
                return;
          } else if (query.tag === 'outerWorker') {
             const path = '/router/outerWorkerAccount'
                this.$router.push({
                  path: path,
                  query:{
                    id:query.bidId,
                    type:'2',
                  }
                })
                return;
          }else {
            //财务列表
            this.$router.push({path: '/router/paymentList'})
          }
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
          this.form.amount = str
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
          this.form.amount = str
        }
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
