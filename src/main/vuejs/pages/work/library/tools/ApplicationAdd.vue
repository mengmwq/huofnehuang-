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
               <el-form-item label="品名:" prop="goodsName">
                <el-select filterable v-model="form.goodsName" clearable placeholder="请选择品名" size="medium" style="width:100%">
                  <el-option v-for="(item, index) in goodsNameList" :key="index"
                            @click.native="selectStorageGood(item)"
                            :label="item.goodsName + '/' + item.supplierName + '/' + item.storageLocation"
                            :value="item.goodsName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单价:">
            <el-select filterable v-model="form.unitPrice" clearable placeholder="请选择单价" size="medium" style="width:100%">
              <el-option v-for="(item, index) in priceList" :key="index"
                         @click.native="selectPrice(item)"
                         :label="item.unitPrice"
                         :value="item.unitPrice">
              </el-option>
            </el-select>
          </el-form-item>
             </el-col>
             <el-col :span="12">
               <el-form-item label="规格:">
                <el-select filterable v-model="form.specifications" clearable placeholder="请选择规格" size="medium" style="width:100%">
                  <el-option v-for="(item, index) in specList" :key="index"
                            @click.native="selectSpec(item)"
                            :label="item.specifications"
                            :value="item.specifications">
                  </el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="数量:">
                <el-input-number v-model.trim="form.num" ></el-input-number>
              </el-form-item>
             </el-col>
          </el-row>
          <el-form-item label="备注:">
            <el-input v-model.trim="form.remark" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </div>
        <p class="step-title"><span class="step-icon">2</span>单据上传：</p>
        <div class="dash-content" >
           <div style="margin-left:20px;">
            <div class="text-right mb10">
              <el-button type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
            </div>
         
            <el-table class="page-table" :data="form.purchaseAttachmentReqs" stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <template v-for="(header, index) in tableHeaderAttachments">
                 <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              
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
        <el-button type="default" size="medium" @click="goBack('add')">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitXh('form')">提 交</el-button>
        <!-- <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitXh('form', 1)">提交后继续创建</el-button> -->
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
  import FileUpload from '@/components/common/FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
  import Api from '@/api/index'
  import Util from '@/utils/'
  export default {
    components: {
      FileUpload,
      ImgPreview
    },
    computed:{
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
          prop: 'attachmentName',
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
        type: '002',
        /** 消耗 */
        form: {
          specifications: '',
          unitPrice: '',
          remark: '',
          purchaseAttachmentReqs: []
        },
        /** 表格 loading */
        listLoading: false,
        rules: {
          goodsName: [
            {required: true, message: "请选择品名", trigger: "change"}
          ],
          customId: [
            {required: true, message: "请选择客户", trigger: "blur"}
          ]
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
        fileList: [],
        goodsNameList:[],
        specList:[],
        priceList:[],
      }
    },
    watch: {
    },
    mounted () {
      this.operate = this.$route.path === '/router/editMaterialApplication' ? 'edit' : 'add'
      if (this.operate === 'edit') {
        this.loadData()
      }
      //获取品名列表
      this.getGoodsName()

    },
    methods: {
      /**
       * 提交消耗
       * */
      submitXh (formName, tag) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileList.length > 0) {
              this.form.purchaseAttachmentReqs = []
              this.fileList.forEach(function (item) {
                this.form.purchaseAttachmentReqs.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.purchaseAttachmentReqs = []
              }
            }
            Api.operationConsume(this.form).then(res => {
              if (res) {
                this.$notify.success({
                  title: '提示',
                  message: '消耗申请提交成功'
                })
                this.clearForm()
                this.$router.go(-1)
              }
            })
          } else {
            return false;
          }
        });
      },
      clearForm(){
        /** 消耗 */
        this.form = {
          specifications: '',
          unitPrice: '',
          approvalProcessId: '', // 审批流程id
          purchaseAttachmentReqs: []
        }
      },
      /**
       * 采购入库获取价格
       * */
      selectrGoodsWithPrice (item) {
        const params = {
          specifications:item.specifications,
          name:item.name,
          supplierId:item.supplierId,
          type:this.type,
        }
        Api.supplierGoodsWithPrice(params).then(res => {
          this.priceList = res
        })
      },
      /**
       * 领用出库选择品名
       * */
      selectStorageGood (item) {
        this.form.specifications = item.specifications
        this.form.unitPrice = item.unitPrice
        this.form.type = this.type
        this.form.supplierName = item.supplierName
        this.form.storageLocation =item.storageLocation

        const params = {
          goodsName: item.goodsName,
          supplierName: item.supplierName,
          storageLocation: item.storageLocation,
          type: this.type
        }
        Api.getSpecifications(params).then(res => {
          this.specList = res
        })
      },
      //选择规格
      selectSpec (item) {
        const form = this.form
        const params = {
          specifications:item.specifications,
          supplierName: form.supplierName,
          storageLocation:form.storageLocation,
          goodsName :form.goodsName,
          type:this.type
        }
        Api.getPrice(params).then(res => {
          this.priceList = res
        })
      },
      selectPrice (item) {
        this.form.purchaseId = item.id
      },
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
      
      //获取货物品名列表
      getGoodsName(query = "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
            pageNum: 1,
            pageSize: 10,
            type:this.type, // 类型001物料入库002工具入库
            goodsName: query
          };
          Api.getGoodsName(params).then(res => {
            this.goodsNameList = res;
          });
        }, 200);
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
        this.form.purchaseAttachmentReqs.push({
          attachmentName: form.fileName,
          key: form.key,
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
                this.form.purchaseAttachmentReqs.splice(index,1)
            })
          }else{
             this.form.purchaseAttachmentReqs.splice(index,1)
          }
      },
      

      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        Api.operationDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            
            if (res.payingApplyDetails) {
              this.listData = res.payingApplyDetails
            }
            if (res.purchaseAttachments && res.purchaseAttachments.length > 0) {
              res.purchaseAttachments.forEach(item=> {
                this.$set(item, 'url', item.attachmentUrlKey)
              })
              this.form.purchaseAttachmentReqs = res.purchaseAttachments
            } else {
              this.form.purchaseAttachmentReqs = []
            }
          }
        })
        this.listLoading = false
       //this.sys()
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
      goBack(flag){
        const path = flag==='add'?'materialApplication':'addMaterialApplication'
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
