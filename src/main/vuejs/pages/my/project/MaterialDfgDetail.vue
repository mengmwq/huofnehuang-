<template>
  <div>
    <el-row class="sub-header m10" >
      <el-col :span="4" class="sub-title">货物明细</el-col>
      <el-col :span="20" class="text-right">
        <div v-if="(operateFlag === 'pro-add' || operateFlag === 'pro-detail-edit') && stateId!=='045'">
          <el-button type="primary" size="small" @click="downloadTemplate">下载模板</el-button>
          <el-upload style="display: inline-block"
                     type="primary"
                     icon="el-icon-upload"
                     class="btn-upload"
                     ref="uploadInfo"
                     action=""
                     :before-upload="beforeGoodsUpload"
                     :http-request="uploadGoodsInfo"
                     :limit="1">
            <el-button icon="el-icon-upload2" type="primary" size="small" >导入货物信息</el-button>
          </el-upload>

          <el-button v-if="operateFlag === 'pro-add'" type="primary" size="small" icon="el-icon-plus" @click="openAddGoodsDialolg('add')">新增货物明细</el-button>
          <template v-if="operateFlag === 'pro-detail-edit'">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddGoodsDialolg('add')">添加货物</el-button>
          <el-input size="small" placeholder="请输入货物名称" v-model="query.name" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="loadData">查询</el-button>
          </template>
        </div>
      </el-col>
      <el-col :span="20" class="text-right" v-if="operateFlag === 'stock-in'">
          <template v-if="isStockIn">
            <el-select filterable v-model="stockInForm.warehouseId" clearable placeholder="请选择库" size="medium" style="width: 140px;" >
              <el-option v-for="(item, index) in kuList" :key="index" :label="item.name" :value="item.id" @click.native="selectKu(item)">
              </el-option>
            </el-select>   
            <el-select filterable v-model="stockInForm.houseId" clearable placeholder="请选择仓" size="medium" style="width: 140px;">
              <el-option v-for="(item, index) in cangList" :key="index" :label="item.name" :value="item.id" @click.native="selectCang(item)">
              </el-option>
            </el-select>
            <el-select filterable v-model="stockInForm.cabinetId" clearable placeholder="请选择柜" size="medium" style="width: 140px;">
              <el-option v-for="(item, index) in guiList" :key="index" :label="item.name" :value="item.id" @click.native="selectGui(item)">
              </el-option>
            </el-select>
            <el-select filterable v-model="stockInForm.grideId" clearable placeholder="请选择位" size="medium" style="width: 140px;">
              <el-option v-for="(item, index) in weiList" :key="index" :label="item.name" :value="item.id"
                        :disabled="item.disabled" @click.native="selectWei(item)">
              </el-option>
            </el-select>
            <el-button type="primary" size="small" @click="saveStockIn">确认</el-button>
            <el-button type="default" size="small" @click="cancelStockIn">取消</el-button>
          </template>
           <el-button v-else type="primary" size="small" @click="stockIn">入库</el-button>
      </el-col>
    </el-row>
    <el-table :data="artMaterialDetail" ref="multipleTable" max-height="400"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" v-if="operateFlag === 'stock-in'"></el-table-column>
      <el-table-column type="index" label="序号" width="120" fixed="left"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="300" fixed="left"></el-table-column>
      <el-table-column prop="netWeight" label="净重(kg)" width="280"></el-table-column>
      <el-table-column prop="number" label="数量" width="280"></el-table-column>
      <el-table-column prop="remarks" label="备注" width="400"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right" v-if="operateFlag !== 'stock-in' && operateFlag !== 'stock-in-record'">
        <template slot-scope="scope" v-if="operateFlag === 'pro-detail-edit' || operateFlag === 'pro-add'" fixed="right">
          <el-button type="primary" size="mini" @click="openAddGoodsDialolg('edit',scope.row,scope.$index)">编辑</el-button>
          <el-button type="primary" size="mini" @click="deleteArtMaterial(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="入库位置" width="300" fixed="left" v-if="operateFlag === 'stock-in' || operateFlag === 'stock-in-record'">
        <template slot-scope="scope">
          {{scope.row.warehouseName}}-->{{scope.row.houseName}}-->{{scope.row.cabinetName}}-->{{scope.row.grideName}}
        </template>
      </el-table-column>
    </el-table>
    <!--新增货物信息 艺术品的货物明细-->
    <el-dialog
      :title="artTitleFlag=='edit'?'编辑货物信息':'新增货物信息'"
      :visible.sync="artGoodsDialogVisible"
      @close="resetGoodsField()"
      :close-on-click-modal="canClick"
      size="small" top="12vh" width="60%">
      <div>
        <el-form :model="artForm" ref="artForm" :rules="artRules" label-width="110px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="商品名称:" prop="name">
                <el-input v-model="artForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="估值:" prop="valuation">
                <el-input v-model="artForm.valuation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="币种:" prop="currency">
                <el-select filterable v-model="artForm.currency" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="重量(kg):">
                <el-input v-model="artForm.netWeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"> 
              <el-form-item label="数量:">
                <el-input v-model="artForm.number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input v-model="artForm.remarks" type="textarea" :rows="4" maxlength="100" show-word-limit ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelAddArtMaterial('artForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="addArtMaterial('artForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 图片预览-->
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialog"
     :isFullscreen="false"
     v-if="isShowDialog" @closeDialog="closeDialog"  />
     
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  import ImgPreview from '@/components/common/ImgPreview'
  import ValidForm from '@/utils/ValidForm'
  export default {
    components: {
      'v-upload': Upload,ImgPreview,
    },
      name: 'MaterialDetail',
      data () {
        return {
          canClick: false,
          isShowDialog:false,
          artTitleFlag:'',
          artRowIndex:'',
          pictures:[],
          form: {
          },
          sels:[],
          isStockIn:false,
          //入库操作 
          stockInForm:{
            warehouseId:null,
            warehouseName:null,
            houseId:null, 
            houseName:null, 
            cabinetId:null,  
            cabinetName:null,  
            grideId:null,
            grideName:null,
          },
          query: {
            name: '',
            pageNum: 1,
            pageSize: 10,
            projectCode: ''
          },
          proCode: this.$route.query.id,
          proType: '',
          //stateId:'',
          // projectType:'', //1艺术品，2国内航材，3国际航材
          artForm: {},
          dangerous: false,
          // 包装类型下拉框数据
          packageTypes: [],
          // 航材货物明细dialog
          materialGoodsDialogVisible: false,
          // 艺术品货物明细dialog
          artGoodsDialogVisible: false,
          // 航材
          domesticMaterialDetail: [],
          // 艺术品货物明细table数据
          artMaterialDetail: [],
          // projectType: '', // 1艺术品，2国内航材，3国际航材
          // 运输方式
          transportationMode: [],
          rules: {
            name: [
              { required: true, message: '请填写货物名称', trigger: 'blur' }
            ],
            number: [
              { required: true, message: '请填写数量', trigger: 'blur' },
              { pattern: /^[0-9]{1,}$/, message: '请输入数字类型',trigger: 'blur' }
            ],
          },
          artRules: {
            number: [
              { required: true, message: '请填写数量', trigger: 'blur' },
              { pattern: /^[0-9]{1,}$/, message: '请输入数字类型',trigger: 'blur'  }
            ],
            valuation: [
              { required: true, message: '请填写估值', trigger: 'blur' },
              { pattern:ValidForm.floatNumReg, message: '请正确输入估值(小数保留2位)' },
            ],
            currency: [
              { required: true, message: '请选择币种', trigger: 'change' }
            ],
          },
          // 币种
          currencyTypeList: [],
          operateFlag1: '',
          contractList: [],
          kuList: [],
          cangList: [],
          guiList: [],
          weiList: [],
          stockInfo: {},
          // 记录已选中的位，用于做位列表的过滤
          selectedWeiList: []
        }
      },
      props: {
        domesticMaterialDetailReqs: Array,
        foreignMaterialDetailReqs: Array,
        artMaterialDetailReqs: Array,
        projectType: String, // 1艺术品2国内航材3国际航材
        operateFlag: String,
        importFlag:String, // 项目详情中导入标识
        projectCode: String,
        stateId: String
      },
      watch: {
        domesticMaterialDetailReqs: function (value) {
          this.domesticMaterialDetail = value
        },
        foreignMaterialDetailReqs: function (value) {
          this.domesticMaterialDetail = value
        },
        domesticMaterialDetail: function (value) {
          if (this.projectType === '2') {
            this.$emit('update:domesticMaterialDetailReqs', value)
          } else if (this.projectType === '3') {
            this.$emit('update:foreignMaterialDetailReqs', value)
          }
        },
        artMaterialDetailReqs: function (value) {
          this.artMaterialDetail = value
          let _this = this
          this.artMaterialDetail.forEach(function (item) {
            _this.$set(item, 'size', (item.length?item.length:'0') + ' x ' + (item.width?item.width:'0') + ' x ' + (item.height?item.height:'0'))
          })
        },
        artMaterialDetail: function (value) {
          this.$emit('update:artMaterialDetailReqs', value)
        },
        projectType: function (value) {
          this.proType = value
          this.projectType = value
        },
        projectCode: function (value) {
          this.proCode = value
          if (this.proType && this.proCode) {
            this.loadData()
          }
        },
        stateId: function (value) {
          this.stateId = value
          this.loadData()
        },
        operateFlag: function (value) {
          if (value === 'stock-in') {
            this.loadStockInfo()
          }
        },
        stockInfo: function (newValue) {
          this.$emit('update:stockInfos', newValue)

        },
      },
      mounted() {
        // 获取字典信息
        if (sessionStorage.getItem('dists')) {
          let distsObj = JSON.parse(sessionStorage.getItem('dists'))
          if (distsObj.TransportationMode) {
            this.transportationMode = distsObj.TransportationMode.children
          }
          if (distsObj.PackageType) {
            this.packageTypes = distsObj.PackageType.children
          }
          if (distsObj.Currency) {
            this.currencyTypeList = distsObj.Currency.children
          }
        }
        // 查询合同
        Api.pageContract({pageSize: 50000,
          pageNum: 1}).then(data => {
            if (data) {
              this.contractList = data.records
            }
          })
        this.loadStockInfo()
      },
      methods: {
        handleSelectionChange (val) {
          this.sels = val
        },
          saveStockIn(){
              let selected  = this.sels;
              let stockInForm = this.stockInForm
              if(!stockInForm.warehouseId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择库信息！'
                })
                return;
              }
              if(!stockInForm.houseId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择仓信息！'
                })
                return;
              }
              if(!stockInForm.cabinetId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择柜信息！'
                })
                return;
              }
              if(!stockInForm.grideId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择位信息！'
                })
                return;
              }
              //已选中的ID
              //const aSelectedId = selected.map(item=>item.id)
              if(this.projectType!='1'){
                this.domesticMaterialDetail.map(sItem=>{
                
                    if(selected.some(item=>item.id===sItem.id)){
                          sItem.warehouseId = stockInForm.warehouseId
                          sItem.warehouseName = stockInForm.warehouseName
                          sItem.houseId = stockInForm.houseId
                          sItem.houseName = stockInForm.houseName
                          sItem.cabinetId = stockInForm.cabinetId
                          sItem.cabinetName = stockInForm.cabinetName
                          sItem.grideId = stockInForm.grideId
                          sItem.grideName = stockInForm.grideName
                          return sItem;
                      }
                    
                })
              }else{
                this.artMaterialDetail.map(sItem=>{
                
                if(selected.some(item=>item.id===sItem.id)){
                      sItem.warehouseId = stockInForm.warehouseId
                      sItem.warehouseName = stockInForm.warehouseName
                      sItem.houseId = stockInForm.houseId
                      sItem.houseName = stockInForm.houseName
                      sItem.cabinetId = stockInForm.cabinetId
                      sItem.cabinetName = stockInForm.cabinetName
                      sItem.grideId = stockInForm.grideId
                      sItem.grideName = stockInForm.grideName
                      return sItem;
                  }
                 
                })
              }
              
             this.cancelStockIn()
             
              
          },
          
          cancelStockIn(){
            this.isStockIn = false
            this.$refs.multipleTable.clearSelection();
            this.clearStockIn()
          },
          //入库操作
          stockIn(){
              const selected = this.sels
              if(selected.length==0){
                 this.$notify.warning({
                  title: '提示',
                  message: '请至少 选择一条入库记录！'
                })
                  return ;
              }
              const stockIned = selected.some(item=>item.grideId)
              if(stockIned){
                 this.$notify.warning({
                  title: '提示',
                  message: '选中的记录中包含已入库信息！'
                })
                  return ;
              }
              this.isStockIn = true
          },
          //清除入库FORM
          clearStockIn(){
            this.stockInForm={
              warehouseId:null,
              houseId:null, 
              cabinetId:null,  
              grideId:null,
            }
          },
        //关闭图片预览；
        closeDialog(){
            this.isShowDialog = false
        },
        //图片预览
        previewImg(pictures){
          let img = ''
          Api.getUrl(pictures).then(data => {
            if (data) {
              img = data
              this.pictures = []
              this.pictures.push(img)
              console.log(this.pictures,'poo')
              this.isShowDialog = true
            }
          })

        },
        /**
         * 加载货物信息
         * */
        loadData () {
          let param = {
            pageNum: 1,
            pageSize: 50000,
            projectCode: this.proCode
          }

            // 艺术品
            let _this = this
            Api.artGoodsPageList(param).then((res) => {
              if (res) {
                this.artMaterialDetail = res.records
                this.artMaterialDetail.forEach(function (item) {
                  _this.$set(item, 'size', (item.length?item.length:'0') + ' x ' + (item.width?item.width:'0') + ' x ' + (item.height?item.height:'0'))
                })
                this.total = res.total
              }
            })
        },
        beforeGoodsUpload (file) {
          let Xls = file.name.split('.');
          let fileType = Xls[Xls.length-1]
          if(fileType === 'xls'|| fileType === 'xlsx'){
            return file
          } else {
            this.$notify.warning({
              title: '提示',
              message: '只允许上传excel'
            })
            return false

          }
        },
        //插入货物信息
        insertGoodsInfo(fn,data){
          const params = data.map(item=>{
            item.projectCode = this.$route.query.id
            return item;
          })
          Api[fn](params).then(res=>{
            console.log('importFlagDetails')
            this.loadData()
          })
        },
        /**上传*/
        uploadGoodsInfo (content) {
          let formData = new FormData()
           formData.append('file', content.file)
           formData.append('type',this.projectType)
          // formData.append('actId', this.actId)
        
          
          Api.importExcel(formData).then(data => {
            if (data) {
              //项目详情页中
              const query = this.$route.query
              const projectType = this.projectType
              if(this.importFlag=='pro-detail-import'){
                let fn = 'addArtDetailBatch'
                this.insertGoodsInfo(fn,data)
              }
              this.artMaterialDetail = this.artMaterialDetail.concat(data)
              let _this = this
              this.artMaterialDetail.forEach(function (item) {
                _this.$set(item, 'size', (item.length?item.length:'0') + ' x ' + (item.width?item.width:'0') + ' x ' + (item.height?item.height:'0'))
              })
              this.form = data
              this.artForm = data
              this.$notify.success({
                title: '提示',
                message: '货物明细导入成功'
              })
            }
            this.$refs.uploadInfo.clearFiles()
          }).catch((ret) => {
            this.$notify.warning({
              title: '提示',
              message: ret.response.data.errorMsg
            })
            this.$refs.uploadInfo.clearFiles()
          })
        },

        /**下载模板*/
        downloadTemplate(){
            let param = {
              projectType : this.projectType
            }
            Api.downloadExcelTemplate(param).then((res) => {
              if (res) {
                let reader = new FileReader()
                reader.readAsDataURL(res)
                reader.onload = (e) => {
                  let a = document.createElement('a')
                  a.download = '模板.xlsx'
                  a.href = e.target.result
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }
              }
            })
        },


        /**
         * 打开添加货物明细弹框
         * */
        openAddGoodsDialolg (flag,row,index) {
		  console.log('11111111111111111111111')
          if (!this.projectType) {
            this.$notify.warning({
              title: '提示',
              message: '请先选择项目编码用以确定添加国内货物还是国际货物'
            })
            return
          }
          this.artTitleFlag = flag
          console.log('222222222222222222')
          if(flag=='edit'){
            this.artForm = JSON.parse(JSON.stringify(row))
            this.artRowIndex = index
          }
          console.log('333333333333333')
          if (this.operateFlag === 'pro-add') {
              // 新增航材项目
                this.materialGoodsDialogVisible = true
          } else if (this.operateFlag === 'pro-detail-edit') {
              // 新增艺术品货物
              this.artGoodsDialogVisible = true
          }
        },
        deleteMaterial (item,index) {
          this.$confirm('您确定要删除【' + item.name + '】吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
             if (this.operateFlag === 'pro-add') {
              this.domesticMaterialDetail.splice(index, 1)
            } else if (this.operateFlag === 'pro-detail-edit') {
              if (this.proType === '2') {
                Api.deleteDomesticMaterial({id: item.id}).then((res) => {
                  if (res) {
                    this.$notify.success({
                      title: '提示',
                      message: '删除成功'
                    })
                    this.loadData()
                  } else {
                    this.$notify.warning({
                      title: '提示',
                      message: '删除失败'
                    })
                  }
                })
              } else {
                Api.deleteForeignMaterial({id: item.id}).then((res) => {
                  if (res) {
                    this.$notify.success({
                      title: '提示',
                      message: '删除成功'
                    })
                    this.loadData()
                  } else {
                    this.$notify.warning({
                      title: '提示',
                      message: '删除失败'
                    })
                  }
                })
              }
            }
          })
          
        },
        deleteArtMaterial (item, index) {
          if (this.operateFlag === 'pro-add') {
            this.$confirm('您确定要删除【' + item.name + '】吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.artMaterialDetail.splice(index, 1)
            })

          } else if (this.operateFlag === 'pro-detail-edit') {
            this.$confirm('您确定要删除【' + item.name + '】吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                Api.deleteArtGoods({id: item.id}).then((res) => {
                  if (res) {
                    this.$notify.success({
                      title: '提示',
                      message: '删除成功'
                    })
                    this.loadData()
                  } else {
                    this.$notify.warning({
                      title: '提示',
                      message: '删除失败'
                    })
                  }
                })
            })
          }
        },
        resetGoodsField () {
          this.form = {
            transportationModeId: ''
          }
          this.artForm = {
            currency: '',
            photograph: ''
          }
        },
        /**
         * 取消添加货物明细
         * */
        cancelAddmaterialGoods (formName) {
          this.$refs[formName].resetFields()
          this.materialGoodsDialogVisible = false
        },
        /**
         * 添加艺术品货物明细
         * */
        addArtMaterial (formName) {
          let _this = this
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.operateFlag === 'pro-add') {
                this.artForm.dimensions = (this.artForm.Plength? this.artForm.Plength : '0') + ' x ' + (this.artForm.Pwidth?this.artForm.Pwidth: '0') + ' x ' + (this.artForm.Pheight?this.artForm.Pheight: '0')
                if(this.artTitleFlag=='edit'){
                  this.artMaterialDetail.splice(this.artRowIndex, 1)
                    this.artMaterialDetail.push(this.artForm)
                }else{
                  this.artMaterialDetail.push(this.artForm)
                }
                this.artMaterialDetail.forEach(function (item) {
                  _this.$set(item, 'size', (item.length?item.length: '0') + ' x ' + (item.width?item.width: '0') + ' x ' + (item.height?item.height:'0'))
                })
                this.artGoodsDialogVisible = false
              } else if (this.operateFlag === 'pro-detail-edit') {
                this.artForm.projectCode = this.proCode
                this.artForm.dimensions = (this.artForm.Plength? this.artForm.Plength : '0') + ' x ' + (this.artForm.Pwidth?this.artForm.Pwidth: '0') + ' x ' + (this.artForm.Pheight?this.artForm.Pheight: '0')
                const fn = this.artTitleFlag=='edit' ?'updateDetailArtMaterial':'addArtGoodsDetail';
               Api[fn](this.artForm).then((res) => {
                  if (res) {
                    this.$notify.success({
                      title: '提示',
                      message: '货物添加成功'
                    })
                    this.artGoodsDialogVisible = false
                    this.loadData()
                  }else{
                     this.$notify.warning({
                      title: '提示',
                      message: '货物添加失败！'
                    })
                     this.artGoodsDialogVisible = false
                  }
                })
                this.artForm = {};
              }
            } else {
              return false
            }
          })
        },
        cancelAddArtMaterial (formName) {
          this.$refs[formName].resetFields()
          this.artGoodsDialogVisible = false
        },
        /**
         * 查询协议价格
         * */
        queryPrice (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let params = {
                contractId: this.form.contractId,
                from: this.form.placeConsigned,
                goodsName: this.form.name,
                to: this.form.destination,
                transportationModeId: this.form.transportationModeId
              }
              Api.queryAgreementPrice(params).then((res) => {
                if (res) {
                  this.form.price = res
                }
              })
            } else {
              return false;
            }
          })
        },
        /**
         * 获取库列表
         * */
        loadStockInfo () {
          // 库列表
          Api.selectWarehouseInfoList({}).then((res) => {
            if (res) {
              this.kuList = res
            }
          })

        },
        /**
         * 点击库加载仓列表
         * */
        selectKu (item) {
          this.stockInfo = item
          this.stockInForm.warehouseName = item.name
          Api.queryHouseInfoListByWarehouseId({
            id: item.id,
            code: item.code
          }).then((res) => {
            if (res) {
              this.cangList = res
            }
          })

        },
        /**
         * 点击仓加载柜列表
         * */
        selectCang (item) {
          this.stockInfo = item
          
          this.stockInForm.houseName = item.name
          Api.queryCabinetInfoListByHouseId({
            id: item.id,
            code: item.code
          }).then((res) => {
            if (res) {
              this.guiList = res
            }
          })

        },
        /**
         * 点击柜加载位列表
         * */
        selectGui (item) {
          this.stockInfo = item
          this.stockInForm.cabinetName = item.name
          Api.queryAllGrideListByCabinetId({
         // Api.queryEmptyGrideListByCabinetId({
            id: item.id,
            code: item.code
          }).then((res) => {
            if (res) {
              this.weiList = res
              let _this = this
              let index = 0
              for (let i = 0; i < this.weiList.length; i++) {
                if ( this.selectedWeiList.length > 0) {
                  for (let j = 0; j < this.selectedWeiList.length; j++) {
                    let item = this.weiList[i]
                    let item1 = this.selectedWeiList[j]
                    if (item.id === item1.id) {
                      index = i
                      break
                    }
                  }
                  _this.$set(this.weiList[index], 'disabled', true)
                }
              }
            }
          })

        },
        /**
         * 点击位加载位信息
         * */
        selectWei (item) {
          this.stockInForm.grideName = item.name
          this.stockInfo = item
          this.selectedWeiList.push(item)

        },

        getImgUrl(key) {
          let imageUrl = '';
          if (key) {
            Api.getUrl(key).then(data => {
              if (data) {
                imageUrl = data
              }
            })
          }
          return imageUrl

        },

      }
  }
</script>

<style scoped>

</style>
