<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
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
                <span>{{form.projectName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称：">
                <span>{{form.customerName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="申请编号：">
                <span>{{form.targetId}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报销编号：">
                <span>{{form.no}}</span>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：">
                <span>{{form.receiptNos}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：">
                <span>{{form.receiptInfo}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票公司：">
                <span>{{form.companyOfReceipt}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请时间：">
                <span>{{form.applyDatetime | timeFormat}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合计金额：">
                <span>{{form.amount}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式：">
                <span>{{form.payType | payMethodFilter}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>冲账明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="form.reimburseApplyLoanDetailReqs" 
          show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <div v-if="header.prop == 'loanApplyId'">
                  <el-select v-model="scope.row.loanApplyId"   placeholder="选择借款单号" size="medium" style="width: 100%;">
                    <el-option
                      v-for="(item,index) in borrowList"
                      :key="index"
                      :label="item.id"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <div v-else-if="header.prop == 'loanAmount'">
                  <el-input-number v-model="scope.row.loanAmount" :min="0" @blur="calcPrice(scope.row.loanAmount, scope.$index, 'form.reimburseApplyLoanDetailReqs', 'loanAmount')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>-->
            </el-table-column> 
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>费用明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="form.reimburseApplyFeeDetailReqs"  
          show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader2" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <!-- <template slot-scope="scope">
                <div v-if="header.prop == 'reimburseIten'">
                  <el-input v-model="scope.row.reimburseIten"></el-input>
                </div>
                <div v-else-if="header.prop == 'reimburseAmount'">
                  <el-input-number v-model="scope.row.reimburseAmount" :min="0" @blur="calcPrice(scope.row.reimburseAmount, scope.$index, 'form.reimburseApplyFeeDetailReqs', 'reimburseAmount')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'actualReimburse'">
                  <el-input-number v-model="scope.row.actualReimburse" :min="0"  @blur="calcPrice(scope.row.actualReimburse, scope.$index, 'form.reimburseApplyFeeDetailReqs', 'actualReimburse')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
        
        <p class="step-title"><span class="step-icon">4</span>单据上传：</p>
        <div class="dash-content" style="padding: 0 4%;" >
          <AttachmentDetails :attachmentInfo="form.applyAttachmentReqList"></AttachmentDetails>
        </div>
        <p class="step-title"><span class="step-icon">5</span>选择抄送人：</p>
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
      <div class="tar m10 mr10">
        <el-button type="default" size="medium" @click="goBack()">返 回</el-button>
      <el-button type="primary" size="medium"  @click="handlePrint">打 印</el-button>
    </div>
     <div id="PrintReimburse" v-if="isShowPrint">
      <PrintReimburse  
              :approvalInfo="approvalInfo"
              :form="form"   
              :id="$route.query.id" :targetId="$route.query.applyId"></PrintReimburse>
      </div>
    </el-form>
    
  </div>
</template>

<script>
  import AttachmentDetails from '@/components/attachment/Details'
  import Api from '@/api/index'
  import moment from 'moment'
  import PrintReimburse from './PrintReimburse'
  export default {
    components: {
      AttachmentDetails,
      PrintReimburse
    },
    data () {
      const projectCode = this.$route.query.projectCode
      return {
        approvalInfo:null,
        isShowPrint:false,
        copyGiveList:[],
       
        //图片预览
        isShowDialogImg:false,
        pictures:null,
        flag: false,
        removedAll: false,
        type: '',
        form: {
          projectCode:projectCode?projectCode:'',
          chineseAmount: false,
          reimburseApplyFeeDetailReqs:[],
          reimburseApplyLoanDetailReqs:[],
          applyAttachmentReqList: []
        },
        /** 表格 loading */
        listLoading: false,
        rules: {
          'amount': [
            { required: true, message: '请先填写费用明细，自动求和!', trigger: 'change' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          approvalProcessId: [
            {required: true, message: "请选择审批流程", trigger: "change"}
          ],
          projectCode: [
            {required: false, message: "请选择项目编码", trigger: "change"}
          ],
        },
        listData: [],
        tableHeader: [ {
          prop: 'loanApplyId',
          label: '借款单号',
          align: 'center',
          show: true
        }, {
          prop: 'loanAmount',
          label: '冲账金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        tableHeader2: [ {
          prop: 'reimburseIten',
          label: '用途',
          align: 'center',
          show: true
        }, {
          prop: 'reimburseAmount',
          label: '金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'actualReimburse',
          label: '实报',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
       
        fileList: [],
      }
    },
    watch:{
       'form.reimburseApplyFeeDetailReqs':{
         
         handler:function(){

           this.sumAmount()
          },
          deep:true
       },
       
    },
    mounted () {
      this.loadData()
     
    },
    methods: {
      //获取打印信息
      getPrintInfo(applyId) {
       
        if(applyId){
            Api.approvalDetailWithStep({id: applyId}).then(data => {
  console.log(data,'approvalDetails--------------------------')
                if (data) {
                   console.log(data,'approvalDetails--------------------------')
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
            Print('#PrintReimburse')
            this.isShowPrint = false
         })
      },
      goBack(){
        this.$router.go(-1)
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
        const applyFeeAmount = this.getAmountNum(this.form.reimburseApplyFeeDetailReqs,'actualReimburse')
        //const ApplyLoanAmount = this.getAmountNum(this.form.reimburseApplyLoanDetailReqs,'loanAmount')
       
        console.log(this.form.reimburseApplyFeeDetailReqs,this.form.reimburseApplyLoanDetailReqs)
        const amount =  parseFloat(applyFeeAmount).toFixed(2)
        //const amount =  parseFloat(applyFeeAmount+ApplyLoanAmount).toFixed(2)
        this.form.amount = amount;
        console.log(amount,'amount3')
      },
      //明细求和
      getSummaries(param) {
        //需要求和的字段
        const property = ['actualReimburse','reimburseAmount','loanAmount']
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
           
            sums[index]=sums[index].toFixed(2)
            //sums[index] += ' 元';
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
      //把合同号还有id一起传过去
      gather(id){
        this.form.id = id
      },

      calcPrice(value, index, tag, key) {
        if (tag === 'form.reimburseApplyLoanDetailReqs') {
          this.form.reimburseApplyLoanDetailReqs[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'form.reimburseApplyFeeDetailReqs') {
          this.form.reimburseApplyFeeDetailReqs[index][key] = parseFloat(value).toFixed(2)
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

      sum() {      //:focus="sum()" 获得焦点时自动计算
       this.form.reimburseApplyFeeDetailReqs.actualReimburse = this.form.reimburseApplyLoanDetailReqs.loanAmount - this.form.reimburseApplyFeeDetailReqs.reimburseAmount
      },

      /** 序号 */
      indexMethod(index){
        return index + 1
      },

      /**
       * 加载
       */
      loadData () {
        if (this.$route.query.id != null) {
            let _this = this
            Api.queryReimbursementApplyDetailById(this.$route.query).then(data => {
              this.form = data
              this.form.reimburseApplyFeeDetailReqs = data.reimburseApplyFeeDetailList
              this.form.reimburseApplyLoanDetailReqs = data.reimburseApplyLoanDetailList

              if (data.applyAttachmentList && data.applyAttachmentList.length > 0) {
                data.applyAttachmentList.forEach(function (item) {
                  _this.$set(item, 'url', item.attachmentUrlKey)
                })
                this.form.applyAttachmentReqList = data.applyAttachmentList
              } else {
                this.form.applyAttachmentReqList = []
                
              }
              if (data.applyDatetime) {
                this.form.applyDatetime = moment(data.applyDatetime).format('YYYY-MM-DD HH:mm:ss')
              }
             this.getPrintInfo(data.applyId)
            })
             
             
          }
           
      },

      /**表格里的input*/
      addItem () {
        let newItem = {
          loanApplyId: '',
          loanAmount	: '',
          remarks: ''
        }
        this.form.reimburseApplyLoanDetailReqs.push(newItem)
      },
      addItem2 () {
        let newItem = {
          reimburseIten: '',
          reimburseAmount	: '',
          actualReimburse: '', //实报
          remarks: ''
        }
        this.form.reimburseApplyFeeDetailReqs.push(newItem)
      },

      /**
       * 表单提交
       */
      submitForm (formName,i) { //addBidProject
        if (!this.form.projectCode && !this.form.contractCode) {
          this.$notify.success({
            title: '提示',
            message: '请选择项目编码或者合同号'
          })
          return
        }
        
        let _this = this
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
              _this.form.applyAttachmentReqList = []
              this.fileList.forEach(function (item) {
                _this.form.applyAttachmentReqList.push({
                  name: item.name,
                  attachmentUrlKey: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.applyAttachmentReqList = []
              }
            }
            if(this.$route.query.id!=null){
              this.edit()
            }else {
              this.add(i)
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },

      //添加
      add: function (i) {
        Api.addReimbursementApply(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            if(i){
              this.form = {
                chineseAmount: false,
                reimburseApplyFeeDetailReqs:[],
                reimburseApplyLoanDetailReqs:[],
                applyAttachmentReqList: []
              }
              this.removedAll = false
            }else {
              // 跳转回去
               this.goBack()

            }
          }
        })
      },

      //编辑
      edit: function () {
        this.form.applyDate = moment(this.form.applyDate).format('YYYY-MM-DD')
        Api.updateReimbursementApply(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
            // 跳转回去
             this.goBack()

          }
        })
      },
      //编辑后继续添加
      edit2: function () {
        this.form.applyDate = moment(this.form.applyDate).format('YYYY-MM-DD')
        Api.updateReimbursementApply(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })

            // 跳转回去
            this.form = {}
            this.loadData()
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
            this.$router.push({path: '/router/reimburseList'})
          }
      },
      
    }
  }
</script>
