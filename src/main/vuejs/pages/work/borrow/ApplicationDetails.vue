<template>
  <div>
    <el-form label-position="right" :model="form"  ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content  formDetails">
          <el-row>
                <el-col :span="12">
                    <el-form-item label="项目编码：">{{form.projectCode}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同编号：">{{form.contractCode}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目名称：">{{form.projectName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人：">{{form.applyName}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请编号：">
                        <span>{{form.targetId}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户名称：">
                        <span>{{form.customerName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请部门：">{{form.orgName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="人员数量：">{{form.peopleNumber}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请日期：">{{form.applyDate | DateFormat}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预计天数：">{{form.daysNumber}}</el-form-item>
                </el-col>
            <el-col :span="12">
              <el-form-item label="币种：">
                <span>{{form.attached.Currency[form.currency].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：">
                <span>{{form.rate}}</span>
              </el-form-item>
            </el-col>
                <el-col :span="12">
                    <el-form-item label="付款金额：" prop="payment">
                        {{form.payment?form.payment:form.amount}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="折合人民币：" prop="chineseAmount">
                         <span v-if="form.amount">{{form.amount}}（{{form.chineseAmount}}）</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="合计金额：">{{form.amount}}</el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item label="领用人：">{{form.payeeName}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：">{{form.remarks}}</el-form-item>
                </el-col>
            </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>费用明细：</p>
        <div class="dash-content formDetails">
          <el-row>
            <el-col :span="12">
              <el-form-item label="币种：" prop="currency">
                 <span v-if="form.attached && form.attached.Currency">{{form.attached.Currency[form.currency].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：" prop="rate">
                {{form.rate}}
              </el-form-item>

            </el-col>
          </el-row>
           <el-table class="page-table ml10"
            show-summary :summary-method="getSummaries"
            :data="form.loanApplyDetails" stripe highlight-current-row  :cell-style="{color:'#333'}"
        >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
        </el-table>
          <!-- <el-row class="formDetails">
              <el-col :span="12">
              <el-form-item label="合计金额：" prop="amount">
               {{form.amount}}
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>

        <p class="step-title"><span class="step-icon">3</span>单据上传：</p>
        <div class="dash-content" >
           <div class="ml10">
             <AttachmentDetails :attachmentInfo="form.applyAttachments"></AttachmentDetails>
          </div>
        </div>
        <p class="step-title"><span class="step-icon">4</span>选择抄送人：</p>
        <el-form-item label="抄送人：">
             <template v-if="form.copyGiveName">
               <el-tag
                  v-for="tag in form.copyGiveName"
                  :key="tag"
                  type="info">
                  {{tag}}
                </el-tag>
             </template>
              <template v-else>
                无
              </template>
            <span class="text-info ml10">用于跨部门审批</span>
        </el-form-item>

      </div>
      <!-- 打印内容结束 -->
      <div class="tar mt10">
       <el-button type="default" size="medium" @click="goBack()">返 回</el-button>
       <el-button type="primary" size="medium"  @click="handlePrint">打 印</el-button>
      </div>
      <div id="PrintBorrow" v-if="isShowPrint">
        <PrintBorrow
                :approvalInfo="approvalInfo"
                :form="form"
                :id="$route.query.id" :targetId="$route.query.applyId"></PrintBorrow>
        </div>
    </el-form>

  </div>
</template>

<script>
 import AttachmentDetails from '@/components/attachment/Details'
  import moment from 'moment'
  import Api from '@/api/index'
  import PrintBorrow from './PrintBorrow'
  export default {
    components: {
      AttachmentDetails,
      PrintBorrow
    },
    computed:{
      currencyTypeList(){
        return this.$store.state.dictionary.dists.Currency.children;
      },
    },
    data () {
       const projectCode = this.$route.query.projectCode
      return {

         approvalInfo:null,
        isShowPrint:false,
        personList:[],
        copyGiveList:[],
        /** 项目列表 */
        projectList: [],

        treeData: [],
        contractList: [],
        userList: [],
        orgName: '',
        orgId: '',
        flag: false,
        removedAll: false,
        type: '',
        form: {
           currency:'001',
          rate:'1',
          amount:'',
          payment:'',
          applyAttachmentReqs: [],
          projectCode:projectCode?projectCode:'',
        },
        /** 表格 loading */
        listLoading: false,

        listData: [],
        tableHeader: [{
          prop: 'loanReason',
          label: '借款事由',
          align: 'center',
          show: true
        }, {
          prop: 'rechargingAmount',
          label: '充值金额',
          align: 'center',
          show: true
        }, {
          prop: 'cashAmount',
          label: '现金预支',
          align: 'center',
          show: true
        }, {
          prop: 'amount',
          label: '金额',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        operate: '',
        fileList: []
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
        if (value) {
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
      this.loadData()
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
            Print('#PrintBorrow')
            this.isShowPrint = false
         })
      },
      goBack(){
        this.$router.go(-1)
      },
      handleProjectName(item){
           this.form.projectName = item.projectName
      },
      handleContractCode(item){
        this.form.contractId = item.contractId
        //this.form.contractId = item.contractId
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
        const applyFeeAmount = this.getAmountNum(this.listData,'amount')

        console.log(this.listData)
        const amount =  parseFloat(applyFeeAmount).toFixed(2)
        this.form.payment = amount;
        console.log(amount,'amount3')
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
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.property!=='remarks' && !values.every(value => isNaN(value))) {
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
      calcPrice(value, index, tag, key) {
        if (tag === 'listData') {
          this.listData[index][key] = parseFloat(value).toFixed(2)
        }
      },
      //验证是否是数字
      isNumber(obj) {
        return obj === +obj
      },
      calcAmount(){
        if(this.listData.length>0){
            const amount =   this.listData.map(item=>item.amount)
            const newAmount = amount.reduce((prev,cur)=>{
                return parseFloat(prev) + parseFloat(cur)
            })

            const rate = parseFloat(this.form.rate)
            if(this.isNumber(rate)){
              this.form.amount = (newAmount * rate).toFixed(2)
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
      calcAmountPrice(value, index, tag, key) {
        if (tag === 'listData') {
          this.listData[index][key] = parseFloat(value).toFixed(2)
          this.calcAmount()
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
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        let _this = this
        Api.loanDetail({id: this.$route.query.id}).then(data => {
          if (data) {
           this.form = data
           //处理抄送人
            const copyGive = data.copyGives
            if(copyGive && copyGive.length>0){
               //const copyGiveList = []
               copyGive.map((item,index)=>{
                  this.copyGiveList.push({
                     uId:item,
                     uName:data.copyGiveName[index]
                  })
               })

            }
           this.form.applyDate = data.applyDate ? moment(data.applyDate).format('YYYY-MM-DD') : ''
           this.listData = data.loanApplyDetails
            if (data.applyAttachments && data.applyAttachments.length > 0) {
              data.applyAttachments.forEach(function (item) {
                _this.$set(item, 'url', item.attachmentUrlKey)
              })
              this.form.applyAttachmentReqs = data.applyAttachments
            } else {
              this.form.applyAttachmentReqs = []
            }

          }
          this.getPrintInfo(data.applyId)
        })
        this.listLoading = false
      },
      deleteItem(index){
        this.listData.splice(index, 1);
        //console.log(this.listData,'listData')
        this.calcAmount()
      },
      addItem () {
        let newItem = {
          loanReason: '',
          rechargingAmount: '',
          cashAmount: '',
          amount: '',
          remarks: ''
        }
        this.listData.push(newItem)
      },
      handleClick(data, checked, node){
        if(checked == true){
          this.form.orgId = data.orgId;
          this.form.orgName = data.orgName;
          this.orgId = data.orgId;
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        }
      },
      nodeClick(data, checked, node){
        this.form.orgId = data.orgId;
        this.form.orgName = data.orgName;
        this.orgId = data.orgId
        this.orgName = data.orgName
        this.$refs.orgTree.setCheckedNodes([data]);
      },
      /**
       * 表单提交
       */
      submitForm (formName, i) {
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
              this.form.loanApplyDetailReqs = this.listData
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
            if (this.operate === 'add') {
              Api.loanAdd(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '借款申请成功'
                  })
                  if (i == 1) {
                    this.form = {
                      applyAttachmentReqs: [],
                      payment:'',
                      amount:'',
                    }
                    this.removedAll = false
                    this.listData = []
                  } else {
                    this.goHref()
                  }

                }
              })
            } else {
              delete this.form['loanApplyDetails']
              delete this.form['attached']
              Api.loanUpdate(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '借款申请修改成功'
                  })
                  this.goHref()
                }
              })
            }

          } else {
            this.$message('请完善表单')
          }
        })
      },
      goHref() {
        const query = this.$route.query
        if (query.tag === '1'  || query.flag === 'myApply') {
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
            this.$router.push({path: '/router/borrowList'})
          }
      },
    }
  }
</script>
