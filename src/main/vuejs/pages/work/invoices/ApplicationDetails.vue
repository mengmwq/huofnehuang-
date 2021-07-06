<template>
  <div>
    <el-form label-position="right" :model="form"  ref="form" label-width="160px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content formDetails">
          <el-row>
                <el-col :span="12">
                    <el-form-item label="项目编号：">
                        <span>{{form.projectCode}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同编号：">
                        <span>{{form.contractCode}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
           <el-row>
                <el-col :span="12">
                    <el-form-item label="项目名称：">
                        <span v-if="form.projectName">{{form.projectName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请编号：">
                        <span>{{form.id}}</span>
                    </el-form-item>
                </el-col>
           </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户名称：">
                        <span>{{form.customerName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否首次：">
                        <span>{{form.isFirst === '1' ? '是' : '否'}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开户银行：">
                        <span>{{form.payeeOpenBank}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款单位账号:">
                        <span>{{form.payeeAccount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开票金额：">
                        <span>{{form.amount}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="金额大写：">
                        <span>{{form.chineseAmount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开票类型：">
                        <span>{{form.receiptType | invoiceType1}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请日期：">
                        <span>{{form.applyDate | DateFormat}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="地址电话：">
                        <span>{{form.addrTel}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人：">
                        <span>{{form.applicantName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>发票明细：</p>
        <div class="dash-content" >
           <el-table class="page-table" :data="form.receiptApplyDetailList" 
             show-summary :summary-method="getSummaries"
            stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
                <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                                 :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>单据上传：</p>
         <div class="dash-content" >
           <AttachmentDetails :attachmentInfo="form.applyAttachmentList"></AttachmentDetails>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="tar m10">
       <el-button type="default" size="medium" @click="goBack('add')">返  回</el-button>
       <el-button type="primary" size="medium"  @click="handlePrint">打 印</el-button>
      </div>
      <div id="printInvoices" v-if="isShowPrint">
      <PrintInvoices  
              :approvalInfo="approvalInfo"
              :form="form"   
              :id="$route.query.id" :targetId="$route.query.applyId" :fileList="fileList"></PrintInvoices>
      </div>
    </el-form>
    
  </div>
</template>

<script>
  import Api from '@/api/index'
  import AttachmentDetails from '@/components/attachment/Details'
  import moment from 'moment'
  import PrintInvoices from './PrintInvoices'
  export default {
    components: {
      AttachmentDetails,
      PrintInvoices
    },
    data () {
      const projectCode = this.$route.query.projectCode
      return {
        approvalInfo:null,
        isShowPrint:false,
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
        /** 合同号下拉 */
        ContractNum: [],
        
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
      //获取打印信息
      getPrintInfo(applyId) {
       
        if(applyId){
            Api.approvalDetailWithStep({id: applyId}).then(data => {

                if (data) {
                   console.log(data,'approvalDetails')
                    this.approvalInfo = data
                    //this.currentNode = data.currentNode
                    // data.approvalDetails.unshift({
                    //     id:data.ctUid,
                    //     states:'1',
                    //     approverName:data.approverName?data.approverName:data.ctUName,
                    //     positionName:'申请人',
                    //     updateDt:data.createDt,
                    // })
                    
                }
            })
        }
        
      },
       //打印
      handlePrint(){
        this.isShowPrint = true;
        
        this.$nextTick(()=>{
            Print('#printInvoices')
            this.isShowPrint = false
         })
      },
      goBack(flag){
        this.$router.go(-1)
        // const path = flag==='add'?'invoicesApplication':'addInvoiceApplication'
        // this.$router.push({
        //   path:'/router/'+path
        // })
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
            //获取打印信息
            this.getPrintInfo(data.applyId)
          })
        }
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
