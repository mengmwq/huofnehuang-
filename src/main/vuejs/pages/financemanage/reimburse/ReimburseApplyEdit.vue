<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
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
              <el-form-item label="合同编号：" prop="contractCode">
                <span v-if="$route.query.flag=='myApply'">{{form.contractCode}}</span>
                <el-select v-else v-model="form.contractCode" filterable clearable placeholder="选择合同号" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in contractList"
                    :key="index"
                    :change="gather(item.id)"
                    :label="item.contractCode"
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
              <el-form-item label="发票号：" prop="receiptNos">
                <el-input  v-model="form.receiptNos"></el-input>
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
              <el-form-item label="开票公司：" prop="companyOfReceipt">
                <el-input v-model="form.companyOfReceipt"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请时间：" prop="applyDatetime">
                <el-date-picker v-model="form.applyDatetime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合计金额：" prop="amount">
                {{sumAmount()}}
                <el-input v-model="form.amount" readonly placeholder="请先填写费用明细，自动求和!"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式：" prop="payType">
                <el-select v-model="form.payType" clearable placeholder="付款方式" size="medium" style="width:150px">
                  <el-option
                    v-for="(item,index) in PayTypeList"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value">
                  </el-option>
                </el-select>
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
              <template slot-scope="scope">
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
              </template>
            </el-table-column>
            <el-table-column align="left" width="65">
              <template slot="header">
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
                  @click="() => {form.reimburseApplyLoanDetailReqs.splice(scope.$index, 1)}"></el-button>
              </template>
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
              <template slot-scope="scope">
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
              </template>
            </el-table-column>
            <el-table-column align="left" width="65">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addItem2"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.reimburseApplyFeeDetailReqs.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">4</span>流程设置：</p>
        <div class="dash-content" style="padding: 0 20px;">
          <el-row>
            <el-col :span="12">
               <!-- <el-form-item label="审批流程："  v-if="$route.query.flag=='myApply'" >
                <span>{{form.approvalName}}</span>
              </el-form-item> -->
              <el-form-item  label="审批流程：" prop="approvalProcessId">
                <el-select v-model="form.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">5</span>单据上传：</p>
        <div class="dash-content" >
           <div style="margin-left:20px;">
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
        <!-- <div class="dash-content" style="padding: 0 20px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="附件上传：">
                <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.applyAttachmentReqList"></FileListMultiUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
        <p class="step-title"><span class="step-icon">6</span>完成</p>

      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="goHref()">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form',0)">提 交</el-button>
        <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitForm('form',1)">提交后继续创建</el-button>
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
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import Api from '@/api/index'
  import FileUpload from '@/components/common/FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
  import moment from 'moment'
  export default {
    name:'ReimburseApplyEdit',
    components: {
      //FileListMultiUpload,
      FileUpload,
      ImgPreview
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
        // 审批流程列表
        shenPiList: [],
        // 合同编号
        contractList: [],
        // 借款单号
        borrowList: [],
        //项目下拉
        projectList: [],
        //支付方式下拉
        PayTypeList: [],
        fileList: [],
        fileTypeList:[],
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
      //审批流程
      Api.approvalList({category: '0'}).then(data => {
        this.shenPiList = data;
      }).finally(() => {
        this.listLoading = false
      })
      //合同编号
      Api.pageContract({pageNum: 1, pageSize:50000}).then(data => {
        this.contractList = data.records;
      }).finally(() => {
        this.listLoading = false
      })
      // 项目列表
      this.remoteMethod()
      // Api.allProjects({}).then(data => {
      //   this.projectList = data;
      // })
      // 借款单号
      Api.loanPage({pageNum: 1, pageSize:50000}).then(data => {
        this.borrowList = data.records;
      })
      // 获取支付类型字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.PayType) {
          this.PayTypeList = distsObj.PayType.children
        }
      }

      this.loadData()
    },
    methods: {
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
               this.goHref()

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
             this.goHref()

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
