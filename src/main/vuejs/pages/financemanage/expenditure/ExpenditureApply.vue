<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="项目编码：" prop="projectCode">
                <el-select filterable v-model="form.projectCode" placeholder="项目编码" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in projectList"
                    :key="index"
                    :label="item.projectCode"
                    :value="item.projectCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> -->

            <el-col :span="12">
              <el-form-item label="供应商名称：" prop="customId">
                <span v-if="$route.query.flag=='myApply'">{{form.customName}}</span>
                <el-select v-else filterable v-model="form.customId" clearable placeholder="供应商名称" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in customList" :key="index" :label="item.name" :value="item.id" @click.native="selectCunstom(item)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同号：" prop="contractId">
                <span v-if="$route.query.flag=='myApply'">{{form.contractCode}}</span>
                <el-select v-else filterable style="width:100%" clearable v-model="form.contractId" placeholder="合同号">
                  <el-option v-for="(item, index) in contractList" :key="index" :label="item.contractCode" :value="item.id">
                    <span style="float: left">{{ item.contractName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.contractCode }}</span>
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款金额：" prop="amount">
                <el-input v-model="form.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额大写：" prop="chineseAmount">
                <el-input v-model="form.chineseAmount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>费用明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
          >
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-else-if="header.prop == 'amount'">
                  <el-input-number v-model="scope.row.amount" :min="0" @change="calcPrice(scope.row.amount, scope.$index, 'listData', 'amount')" @blur="calcPrice(scope.row.amount, scope.$index, 'listData', 'amount')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left">
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
                  @click="() => {listData.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>流程设置：</p>
        <div class="dash-content" style="padding: 0 20px;">
          <el-row>
            <el-col :span="12">
             <!-- <el-form-item label="审批流程："  v-if="$route.query.flag=='myApply'" >
                <span>{{form.approvalName}}</span>
              </el-form-item> -->
              <el-form-item  label="审批流程：" prop="approvalProcessId">
                <el-select  filterable v-model="form.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">4</span>单据上传：</p>
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
        <p class="step-title"><span class="step-icon">5</span>完成</p>

      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
       <el-button type="primary" size="medium" @click="goHref()">返  回</el-button>
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
  export default {
    name:'ExpenditureApply',
    components: {
     //FileListMultiUpload,
      FileUpload,
      ImgPreview,
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

        operate: '',
        removedAll: false,
        type: '',
        form: {
          contractId:'',
          contractCode: '',
          projectCode:projectCode?projectCode:'',
          depositBank: '',
          bankCode: '',
          amount: '',
          applyAttachmentReqs: []
        },
        /** 项目列表 */
        projectList: [],
        contractList: [],
        // 审批流程列表
        shenPiList: [],
        customList: [],
        /** 表格 loading */
        listLoading: false,
        rules: {
          customId: [
            {required: true, message: "请选择客户", trigger: "blur"}
          ],
          approvalProcessId: [
            {required: true, message: "请选择审批流程", trigger: "change"}
          ],
          'amount': [
            { required: true, message: '请填写金额', trigger: 'blur' },
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
         if (value) {
           this.changeMoneyToChinese(value)
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
      this.operate = this.$route.path === '/router/editPaymentApply' ? 'edit' : 'add'
      // 项目列表
      Api.allProjects({}).then(data => {
        this.projectList = data;
      })
      /*// 查询合同
      Api.pageContract({pageSize: 50000,
        pageNum: 1}).then(data => {
        if (data) {
          this.contractList = data.records
        }
      })*/
      // 审批列表
      Api.approvalList({category: '0'}).then(data => {
        this.shenPiList = data;
      }).finally(() => {
        this.listLoading = false
      })
      //
      Api.supplierList({pageNum:1,pageSize: 50000}).then(data => {
        this.customList = data.records;
      })
      if (this.operate === 'edit') {
        this.loadData()
      }

      // this.formatNum('15.548')

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
      calcPrice(value, index, tag, key) {
        if (tag === 'listData') {
          this.listData[index][key] = parseFloat(value).toFixed(2)
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
        this.form.customName = item.name
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
       this.sys()
      },
      addItem () {
        let newItem = {
          feeTypeId: '',
          amount: '',
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
            if (this.operate === 'edit') {
              delete this.form['payingApplyDetails']
              delete this.form['attached']
              delete this.form['applyAttachments']
              Api.updatePay(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '更新成功'
                  })
                  // 跳转回去
                this.goHref()
                }
              })
            } else {
              Api.addPay(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '添加成功'
                  })
                  if (i == 1) {
                    this.form = {
                      depositBank: '',
                      bankCode: '',
                      amount: '',
                      applyAttachmentReqs: []
                    }
                    this.listData = []
                    this.removeAll = false
                  } else {
                   this.goHref()

                  }

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
            this.$router.push({path: '/router/expenditureList'})
          }
      },
      // goHref() {
      //   const query = this.$route.query
      //     if(query.projectCode && query.bidId){
      //         this.$router.push({
      //           path: '/router/intercourseAccount',
      //           query:{
      //             id:query.bidId,
      //             projectCode:query.projectCode,
      //           }
      //         })
      //         return;
      //     }
      //   if (query.tag === '1') {
      //       // 如果入口是我的申请进来的，创建完成之后，跳转到我的申请
      //       this.$router.push({path: '/router/myApply'})
      //     } else {
      //       this.$router.push({path: '/router/expenditureList'})
      //     }
      // },
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
