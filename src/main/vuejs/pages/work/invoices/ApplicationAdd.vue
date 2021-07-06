<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="160px">
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
                 clearable placeholder="项目名称/编号/客户名称" size="medium" style="width: 100%;">
                  <el-option
                   @click.native ="handleProjectName(item)"
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectCode"
                    :value="item.projectCode">
                    <span style="float: left">{{ item.projectName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectCode }}</span>
                  </el-option>

                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否首次：" prop="name">
                <el-switch
                  v-model="form.isFirst"
                  active-color="#13ce66"
                  inactive-color="#aaa"
                  active-text="是"
                  inactive-text="否">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户名称：" prop="customerId">
                <!--<span v-if="$route.query.flag=='myApply'">{{form.customerName}}</span>-->
                <span v-if="this.$route.query.id">{{form.customerName}}</span>
                <el-select v-else
                filterable
                    clearable
                    remote
                    :remote-method="getCustomerList"
                v-model="form.customerId" placeholder="请选择客户" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in customerListName"
                    @click.native="selectCustom(item)"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同：" prop="contractCode">
                <span v-if="$route.query.flag=='myApply'">{{form.contractCode}}</span>
                <el-select v-else filterable clearable v-model="form.contractCode" placeholder="选择合同号" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in ContractNum"
                    @click.native="handleContractCode(item)"
                    :key="index"
                    :label="item.contractName"
                    :value="item.contractCode">
                    <span  style="float: left">{{ item.contractCode }}</span>
      <span  style="float: right; color: #8492a6; font-size: 13px">{{ item.contractName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码：" prop="codeNo">
                <el-input v-model="form.creditCodeCertificateNumber" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票类型：" prop="invoiceType">
                <el-select filterable v-model="form.receiptType"   placeholder="选择发票类型" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in receiptTypeSelect"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款单位账号：" prop="unitAccount">
                <el-input v-model="form.payeeAccount" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票金额：" prop="amount">
                <el-input v-model="form.amount" readonly ></el-input><!--@blur="formatNum(form.amount)-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款单位开户行：" prop="bank">
                <el-input v-model="form.payeeOpenBank" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额大写：" prop="amountChinese">
                <el-input v-model="form.chineseAmount" readonly placeholder="请先填写费用明细，自动求和!"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请日期：" prop="applyDate">
                <el-date-picker type="date" placeholder="请选择申请日期" v-model="form.applyDate"
                                value-format="yyyy-MM-dd" size="medium"
                                format="yyyy-MM-dd"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址电话：" prop="addrTel">
                <el-input v-model="form.addrTel" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用人：">
                <el-input v-model="form.applicantName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input type="textarea" :rows="3" :maxlength="500" show-word-limit v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
        <p class="step-title"><span class="step-icon">2</span>发票明细：</p>
        <div class="dash-content" >
          <el-table class="page-table ml10 mb10" :data="form.receiptApplyDetailReqList"
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'detailItem'">
                  <el-input v-model="scope.row.detailItem"></el-input>
                </div>
                <div v-else-if="header.prop == 'specification'">
                  <el-input v-model="scope.row.specification"></el-input>
                </div>
                <div v-else-if="header.prop == 'unit'">
                  <el-input v-model="scope.row.unit"></el-input>
                </div>
                <div v-else-if="header.prop == 'number'">
                  <el-input-number v-model="scope.row.number" controls-position="right" style="width:100px;"
                  :min="0" @change="calcPrice(scope.row.number, scope.$index, 'form.receiptApplyDetailReqList', 'number', scope.row)"
                  @blur="calcPrice(scope.row.number, scope.$index, 'form.receiptApplyDetailReqList', 'number', scope.row)"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'unitPrice'">
                  <el-input-number v-model="scope.row.unitPrice" controls-position="right" style="width:100px;"
                  :min="0" @change="calcPrice(scope.row.number, scope.$index, 'form.receiptApplyDetailReqList', 'number', scope.row)"
                  @blur="calcPrice(scope.row.unitPrice, scope.$index, 'form.receiptApplyDetailReqList', 'unitPrice', scope.row)"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'sumPrice'">
                  <el-input v-model="scope.row.sumPrice"></el-input>
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
                  @click="addInvoiceItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.receiptApplyDetailReqList.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>单据上传：</p>
         <div class="dash-content" >
           <div class="ml10">
            <div class="text-right mb10">
              <el-button type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
            </div>

            <el-table class="page-table" :data="form.applyAttachmentReqList" stripe highlight-current-row  :cell-style="{color:'#333'}"
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
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
       <el-button type="default" size="medium" @click="goBack('add')">返  回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form',0)">提 交</el-button>
        <el-button type="primary" v-if="!this.$route.query.id" size="medium" @click="submitForm('form',1)">提交后继续创建</el-button>
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
  import Api from '@/api/index'
  import FileUpload from '@/components/common/FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
  import ValidForm from '@/utils/ValidForm'
  import moment from 'moment'
  export default {
    components: {
      FileUpload,
      ImgPreview
    },
    computed: {
      receiptTypeSelect(){
        console.log(this.$store.state.dictionary.dists.ReceiptType.children,'发票类型')
          return this.$store.state.dictionary.dists.ReceiptType.children
      }
    },
    data () {
      const projectCode = this.$route.query.projectCode
      return {
        personList:[],
        //附件上传
        hasCallBack: true,
        callBackName: 'getUploadFile',
        dialogVisible:false,
        fileTypeList:[],
        tableHeaderAttachments: [{
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        },
        // {
        //   prop: 'type',
        //   align: 'center',
        //   label: '文件类型',
        //   width: '200',
        //   show: true
        // },
         {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          width: '200',
          show: true
        },
        //  {
        //   prop: 'size',
        //   align: 'center',
        //   label: '文件大小',
        //   width: '100',
        //   show: true
        // }
        ],
        //图片预览
        isShowDialogImg:false,
        pictures:null,

        flag: false,
        removedAll: false,
        type: '',
        form: {
          projectCode:projectCode?projectCode:'',
          contractCode: '',
          customerName: '',
          amount: '',
          creditCodeCertificateNumber: '',
          payeeAccount: '',
          payeeOpenBank: '',
          addrTel: '',
          chineseAmount: '',
          receiptApplyDetailReqList:[], //数组对象
          applyAttachmentReqList: [],
          approvalProcessId: ''
        },

        /** 表格 loading */
        listLoading: false,
        /** 项目下拉 */
        projectList: [],
        /** 客户名称下拉 */
        customerListName: [],
        /** 合同号下拉 */
        ContractNum: [],
        // 审批流程列表
        shenPiList: [],

        rules: {
          'customerId': [
            { required: true, message: '请选择客户', trigger: 'change' },
          ],
          'amount': [
            { required: true, message: '请先填写费用明细，自动求和!', trigger: 'change' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          // 'addrTel': [
          //   { required: false, message: '', trigger: 'blur' },
          //   { pattern: ValidForm.telReg, message: '请输入正确手机号' }
          // ],
          'approvalProcessId': [
            { required: true, message: '请选择审批流程', trigger: 'change' }
          ],
          'projectCode': [
            { required: false, message: '请选择项目', trigger: 'change' }
          ],
        },
        listData: [],
        tableHeader: [{
          prop: 'detailItem',
          label: '货物或应税劳务名称',
          align: 'center',
          width:'100',
          show: true
        }, {
          prop: 'specification',
          label: '规格型号',
          align: 'center',
          show: true
        }, {
          prop: 'unit',
          label: '单位',
          align: 'center',
          show: true
        }, {
          prop: 'number',
          label: '数量',
          align: 'center',
          show: true
        }, {
          prop: 'unitPrice',
          label: '单价',
          align: 'center',
          show: true
        }, {
          prop: 'sumPrice',
          label: '价税合计',
          align: 'center',
          show: true
        }],
        fileList: []

      }
    },
    mounted () {
      // 项目列表
      this.remoteMethod()
      // 客户名称下拉
      this.getCustomerList()
      this.loadData()
    },
    watch: {
       'form.receiptApplyDetailReqList':{
         handler:function(){
           this.sumAmount()
          },
          deep:true
       },
      'form.amount' : function (value) {
        if (value) {
          this.changeMoneyToChinese(value)
        }
      }
    },
    methods: {
      handleProjectName(item){
           this.form.projectName = item.projectName
      },
      handleContractCode(item){
        this.form.contractId = item.contractId
        //this.form.contractId = item.contractId
      },
      goBack(flag){
        const path = flag==='add'?'invoicesApplication':'addInvoiceApplication'
        this.$router.push({
          path:'/router/'+path
        })
      },
      getCustomerList(query='') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              name:query,
          }
          Api.customerList(params).then(res=>{
             console.log(res,'rrr')
             this.customerListName = res.records
          })

        }, 200);
      },
      getAmountNum(arr,attr){
          const values = arr.map(item => Number(item[attr]));
          console.log(values,'values')
          if (!values.every(value => isNaN(value))) {
             console.log(values,'values')
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
        const sumPrice = this.getAmountNum(this.form.receiptApplyDetailReqList,'sumPrice')
        //const ApplyLoanAmount = this.getAmountNum(this.form.reimburseApplyLoanDetailReqs,'loanAmount')

        console.log(this.form.receiptApplyDetailReqList)
        const amount =  parseFloat(sumPrice).toFixed(2)
        this.form.amount = amount;
        console.log(amount,'amount3')
      },
      //明细求和
      getSummaries(param) {
        //需要求和的字段
        const property = ['number','sumPrice']
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));

          if (!values.every(value => isNaN(value)) && (property.some(item=>item==column.property))){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);

            if(column.property=='sumPrice'){
                sums[index] = sums[index].toFixed(2)
            }
            //this.sumAmount +=sums[index]
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
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
        this.form.applyAttachmentReqList.push({
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
                this.form.applyAttachmentReqList.splice(index,1)
            })
          }else{
             this.form.applyAttachmentReqList.splice(index,1)
          }
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
      calcPrice(value, index, tag, key, item) {
        if (tag === 'form.receiptApplyDetailReqList') {
          this.form.receiptApplyDetailReqList[index][key] = parseFloat(value).toFixed(2)
        }
       if ((item.number || item.unitPrice === 0) && (item.number || item.unitPrice === 0) ) {
          this.form.receiptApplyDetailReqList[index].sumPrice = (parseFloat(item.number) * parseFloat(item.unitPrice)).toFixed(2)
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
      selectCustom (item) {
        console.log(item,'SSS')
        this.form.customerName = item.name
        this.form.creditCodeCertificateNumber = item.enterpriseCode
        this.form.payeeAccount = item.publicAccounts
        this.form.payeeOpenBank = item.depositBank
        this.form.addrTel = item.bankAddress+' '+item.tel
        this.form.contractCode = ''
        // 合同号
        //供应商传001客户传002合作伙伴003
        Api.contractList({contractTargetId: item.id, contractTargetType: '002'}).then(data => {
          if (data) {
            console.log(data,'ddddd')
            this.ContractNum = data;
          }

        })
      },
      /**
       * 加载
       */
      loadData () {
        if(this.$route.query.id) {
          Api.queryReceiptApplyInfoById(this.$route.query).then(data => {
            this.form = data
            let _this = this

            this.form.isFirst = data.isFirst === '1' ? true : false
            this.form.approvalProcessId = data.approvalProcessId
            this.form.receiptApplyDetailReqList = data.receiptApplyDetailList
            this.form.applyDate = data.applyDate ? moment(data.applyDate).format('YYYY-MM-DD') : ''
            if (data.applyAttachmentList && data.applyAttachmentList.length > 0) {
              data.applyAttachmentList.forEach(function (item) {
                _this.$set(item, 'url', item.attachmentUrlKey)
              })
              this.form.applyAttachmentReqList = data.applyAttachmentList
            } else {
              this.form.applyAttachmentReqList = []
            }

          })
        }
      },

      addInvoiceItem () {
        let newItem = {
          detailItem: '',
          specification: '',
          unit: '',
          number: '',
          unitPrice: '',
          sumPrice: '',
        }
        this.form.receiptApplyDetailReqList.push(newItem)
      },

      /**
       * 表单提交
       */
      submitForm (formName, i) { //addBidProject
        if (!this.form.projectCode && !this.form.contractCode) {
          this.$notify.success({
            title: '提示',
            message: '请选择项目编码或者合同号'
          })
          return
        }
        //金额保留两位小数
        if (this.form.amount) {
          this.form.amount = parseFloat(this.form.amount).toFixed(2)
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

            if (this.fileList.length > 0) {
              this.form.applyAttachmentReqList = []
              this.fileList.forEach(item=> {
                this.form.applyAttachmentReqList.push({
                  name: item.name,
                  attachmentUrlKey: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.applyAttachmentReqList = []
              }
            }
            if(!this.$route.query.id){
              this.add(i)
            }else {
              this.edit()
            }
            console.log('form: ' + this.form)
          } else {
            this.$message('请完善表单')
          }
        })
      },
      //添加
      add: function (i) {
        this.form.isFirst = this.form.isFirst ? 1 : 0
        Api.addReceiptApply(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加发票申请成功'
            })
            if (i == 1) {
              this.form = {
                contractCode: '',
                customerName: '',
                amount: '',
                creditCodeCertificateNumber: '',
                payeeAccount: '',
                payeeOpenBank: '',
                addrTel: '',
                chineseAmount: '',
                receiptApplyDetailReqList:[], //数组对象
                applyAttachmentReqList: [],
                approvalProcessId: ''
              }
            } else {
               this.goBack('add')
            }
          }
        })
      },

      //编辑
      edit: function () {
        this.form.isFirst = this.form.isFirst ? 1 : 0
        delete this.form['applyAttachmentList']
        Api.updateReceiptApplyById(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改发票申请成功'
            })
            // 跳转回去
            //this.goHref()
            this.goBack('add')
          }
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
          }else if (query.tag === 'outerWorker') {
              //来自外工供应商的往来财务
               const path = '/router/outerWorkerAccount'
                this.$router.push({
                  path: path,
                  query:{
                    id:query.bidId,
                    type:2,
                  }
                })
                return;
          }else {
            //财务列表
            this.$router.push({path: '/router/invoiceList'})
          }
      },

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
