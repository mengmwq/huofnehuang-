<template>
  <div>
    <div style="padding: 0 15px;">
      <!-- 操作栏 -->
      <el-row :gutter="20" class="m10">
        <el-col :span="12">
          <el-button type="primary" size="medium" v-showBtn data-authorityType="cgStockIn-btn" icon="el-icon-plus" @click="dialogVisible = true">采购入库</el-button>
          <el-button type="primary" size="medium" v-showBtn data-authorityType="lyStockOut-btn" icon="el-icon-minus" @click="dialogVisible2 = true">领用出库</el-button>
          <el-button type="primary" size="medium" v-showBtn data-authorityType="lyStockIn-btn" icon="el-icon-plus" @click="dialogVisible3 = true">领用入库</el-button>
          <el-button type="primary" size="medium" v-showBtn data-authorityType="consumApply-btn" @click="dialogVisible4 = true">消耗申请</el-button>
        </el-col>
        <el-col :span="12" class="text-right" style="float: right">
          <el-input size="medium" clearable placeholder="品名查询" prefix-icon="el-icon-search" icon="search" v-model="query.searchStr"
                    @keyup.enter.native="loadData" style="width: 200px;"></el-input>
          <el-button type="primary" size="medium" @click="loadData"  class="btnTop">搜索</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                >
        <!--@selection-change="handleSelectionChange"-->
       <!-- <el-table-column type="selection" width="55"></el-table-column>-->
        <template v-for="(header, index) in tableHeader">
          <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else-if="header.prop == 'updateDt'">
              {{scope.row.updateDt | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        </template>
      </el-table>
      <el-row type="flex" class="page-box" justify="end">
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-tabs v-model="active" type="card" @tab-click="handleClick">
          <el-tab-pane label="采购入库记录" name="1">
              <StockInOrOutRecords ref="child1" :hisType="'001'" :type="type"></StockInOrOutRecords>
          </el-tab-pane>
          <el-tab-pane label="领用出库记录" name="2">
              <StockInOrOutRecords ref="child2" :hisType="'003'" :type="type"></StockInOrOutRecords>
          </el-tab-pane>
          <el-tab-pane label="领用入库记录" name="3">
              <StockInOrOutRecords ref="child3" :hisType="'002'" :type="type"></StockInOrOutRecords>
          </el-tab-pane>
          <el-tab-pane label="消耗申请记录" name="4">
              <ConsumeRecords ref="child4" :type="type"></ConsumeRecords>
          </el-tab-pane>
          <el-tab-pane label="文件记录" name="5">
               <FileRecords ref="child5" :type="type"></FileRecords>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
    <!--采购入库-->
    <el-dialog
      title="采购入库"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      @close="clearForm"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="caiGouForm" ref="caiGouForm" :rules="rules" label-width="120px">
          <el-form-item label="供应商:">
            <el-select filterable v-model="caiGouForm.supplierId" clearable placeholder="请选择供应商" size="medium" style="width:100%">
              <el-option v-for="(item, index) in supplierList" :key="index"
                         @click.native="selectSupplier(item)"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名:">
            <el-select filterable v-model="caiGouForm.goodsName" clearable placeholder="请选择品名" size="medium" style="width:100%">
              <el-option v-for="(item, index) in goodsNameList" :key="index"
                         @click.native="selectGood(item)"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格:">
            <el-select filterable v-model="caiGouForm.specifications" clearable placeholder="请选择规格" size="medium" style="width:100%">
              <el-option v-for="(item, index) in specList" :key="index"
                         @click.native="selectrGoodsWithPrice(item)"
                         :label="item.specifications"
                         :value="item.specifications">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价:">
            <el-select filterable v-model="caiGouForm.unitPrice" clearable placeholder="请选择物品价格" size="medium" style="width:100%">
              <el-option v-for="(item, index) in priceList" :key="index"
                         :label="item.unitPrice"
                         :value="item.unitPrice">
              </el-option>
            </el-select>
            <!--<el-select filterable v-model="outStockForm.unitPrice" clearable placeholder="请选择单价" size="medium" style="width:100%">
              <el-option v-for="(item, index) in priceList" :key="index"
                         @click.native="selectPrice(item, 'out')"
                         :label="item.unitPrice"
                         :value="item.unitPrice">
              </el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="数量:">
            <el-input-number v-model="caiGouForm.num" :min=1></el-input-number>
          </el-form-item>
          <el-form-item label="存放位置:">
            <el-input v-model="caiGouForm.storageLocation"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="caiGouForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="附件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="caiGouForm.purchaseAttachmentReqs"></FileListMultiUpload>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="cancelCaiGou('caiGouForm')">取 消</el-button>
          <el-button type="primary" size="small" @click="submitCaiGou('caiGouForm', '1')">提 交</el-button>
          <el-button type="primary" size="small" @click="submitCaiGou('caiGouForm', '2')">提交后继续创建</el-button>
        </div>
      </div>
    </el-dialog>
    <!--领用出库-->
    <el-dialog
      title="领用出库"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="canClick"
      @close="clearForm"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="outStockForm" ref="outStockForm" label-width="120px">
          <el-form-item label="出库时间:">
            <el-date-picker style="width: 100%"
              v-model="outStockForm.operationTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="领用人:">
            <el-select filterable v-model="outStockForm.operationId" clearable placeholder="请选择人员" size="medium" style="width:100%">
              <el-option v-for="(item, index) in userList" :key="index"
                         :label="item.uName"
                         :value="item.uId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名:"><!--purchaseId-->
            <el-select filterable v-model="outStockForm.index" clearable placeholder="请选择品名" size="medium" style="width:100%">
              <el-option v-for="(item, index) in listAllData" :key="index"
                         @click.native="selectStorageGood(item, 'out')"
                         :label="item.goodsName + '/' + item.supplierName + '/' + item.storageLocation"
                         :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格:">
            <!--<el-input v-model="outStockForm.specifications" ></el-input>-->
            <el-select filterable v-model="outStockForm.specifications" clearable placeholder="请选择规格" size="medium" style="width:100%">
              <el-option v-for="(item, index) in specList" :key="index"
                         @click.native="selectSpec(item)"
                         :label="item.specifications"
                         :value="item.specifications">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价:">
            <!--<el-input v-model="outStockForm.unitPrice" ></el-input>-->
            <el-select filterable v-model="outStockForm.unitPrice" clearable placeholder="请选择单价" size="medium" style="width:100%">
              <el-option v-for="(item, index) in priceList" :key="index"
                         @click.native="selectPrice(item, 'out')"
                         :label="item.unitPrice"
                         :value="item.unitPrice">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库数量:">
            <el-input-number v-model="outStockForm.num"></el-input-number>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="outStockForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="附件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="outStockForm.purchaseAttachmentReqs"></FileListMultiUpload>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="cancelOutStock('outStockForm')">取 消</el-button>
          <el-button type="primary" size="small" @click="submitOutStock('outStockForm', '1')">提 交</el-button>
          <el-button type="primary" size="small" @click="submitOutStock('outStockForm', '2')">提交后继续创建</el-button>
        </div>
      </div>
    </el-dialog>
    <!--领用入库-->
    <el-dialog
      title="领用入库"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible3"
      @close="clearForm"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="inStockForm" ref="inStockForm" label-width="120px">
          <el-form-item label="入库人:">
            <el-select filterable v-model="inStockForm.operationId" clearable placeholder="请选择人员" size="medium" style="width:100%">
              <el-option v-for="(item, index) in userList" :key="index"
                         :label="item.uName"
                         :value="item.uId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名:">
            <el-select filterable v-model="inStockForm.index" clearable placeholder="请选择品名" size="medium" style="width:100%">
              <el-option v-for="(item, index) in listAllData" :key="index"
                         @click.native="selectStorageGood(item, 'in')"
                         :label="item.goodsName + '/' + item.supplierName + '/' + item.storageLocation"
                         :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格:">
            <!--<el-input v-model="inStockForm.specifications" disabled></el-input>-->
            <el-select filterable v-model="inStockForm.specifications" clearable placeholder="请选择规格" size="medium" style="width:100%">
              <el-option v-for="(item, index) in specList" :key="index"
                         @click.native="selectSpec(item)"
                         :label="item.specifications"
                         :value="item.specifications">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价:">
            <!--<el-input v-model="inStockForm.unitPrice" disabled></el-input>-->
            <el-select filterable v-model="inStockForm.unitPrice" clearable placeholder="请选择单价" size="medium" style="width:100%">
              <el-option v-for="(item, index) in priceList" :key="index"
                         @click.native="selectPrice(item, 'in')"
                         :label="item.unitPrice"
                         :value="item.unitPrice">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="存放位置:">
            <el-input v-model="inStockForm.storageLocation" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库数量:">
            <el-input-number v-model="inStockForm.num" ></el-input-number>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="inStockForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="附件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="inStockForm.purchaseAttachmentReqs"></FileListMultiUpload>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="cancelInStock('inStockForm')">取 消</el-button>
          <el-button type="primary" size="small" @click="submitInStock('inStockForm', '1')">提 交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--消耗申请-->
    <el-dialog
      title="消耗申请"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible4"
      @close="clearForm"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="form" ref="form" label-width="120px">
          <el-form-item label="品名:">
            <el-select filterable v-model="form.index" clearable placeholder="请选择品名" size="medium" style="width:100%">
              <el-option v-for="(item, index) in listAllData" :key="index"
                         @click.native="selectStorageGood(item, 'xh')"
                         :label="item.goodsName + '/' + item.supplierName + '/' + item.storageLocation"
                         :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格:">
            <!--<el-input v-model="form.specifications" disabled></el-input>-->
            <el-select filterable v-model="form.specifications" clearable placeholder="请选择规格" size="medium" style="width:100%">
              <el-option v-for="(item, index) in specList" :key="index"
                         @click.native="selectSpec(item)"
                         :label="item.specifications"
                         :value="item.specifications">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价:">
            <!--<el-input v-model="form.unitPrice" ></el-input>-->
            <el-select filterable v-model="form.unitPrice" clearable placeholder="请选择单价" size="medium" style="width:100%">
              <el-option v-for="(item, index) in priceList" :key="index"
                         @click.native="selectPrice(item, 'xh')"
                         :label="item.unitPrice"
                         :value="item.unitPrice">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量:">
            <el-input-number v-model="form.num" ></el-input-number>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="审批流程:">
            <el-select filterable v-model="form.approvalProcessId" placeholder="请选择审批流程" size="medium" style="width:100%">
              <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="附件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.purchaseAttachmentReqs"></FileListMultiUpload>
          </el-form-item>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelXh('form')">取 消</el-button>
            <el-button type="primary" size="small" @click="submitXh('form', '1')">提 交</el-button>
            <el-button type="primary" size="small" @click="submitXh('form', '2')">提交后继续创建</el-button>
          </div>
        </el-form>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import StockInOrOutRecords from '@/pages/operator/StockInOrOutRecords'
  import ConsumeRecords from '@/pages/operator/ConsumeRecords'
  import FileRecords from '@/pages/operator/FileRecords'
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  export default {
    components: {
      StockInOrOutRecords,
      ConsumeRecords,
      FileRecords,
      FileListMultiUpload
    },
    data () {
      return {
        canClick: false,
        removedAll: false,
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        /** 采购入库 */
        caiGouForm: {
          type: '',// // 类型001物料入库002工具入库
          storageLocation: '',
          remark: '',
          unitPrice: '',
          purchaseAttachmentReqs: []
        },
        /** 领用出库 */
        outStockForm: {
          specifications: '',
          unitPrice: '',
          type: '',
          remark: '',
          purchaseAttachmentReqs:[]
        },
        /** 领用入库 */
        inStockForm: {
          specifications: '',
          unitPrice: '',
          storageLocation: '',
          type: '',
          remark: '',
          purchaseAttachmentReqs: []
        },
        /** 消耗 */
        form: {
          specifications: '',
          unitPrice: '',
          remark: '',
          approvalProcessId: '', // 审批流程id
          purchaseAttachmentReqs: []
        },
        rules: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: '',
          type: ''
        },
        tableHeader: [{
          prop: 'goodsName',
          label: '品名',
          align: 'center',
          show: true
        }, {
          prop: 'num',
          label: '数量',
          align: 'center',
          show: true
        }, {
          prop: 'specifications',
          label: '规格',
          align: 'center',
          show: true
        }, {
          prop: 'unitPrice',
          label: '单价',
          align: 'center',
          show: true
        }, {
          prop: 'supplierName',
          label: '供应商',
          show: true
        }, {
          prop: 'storageLocation',
          align: 'center',
          label: '存放位置',
          show: true
        }, {
          prop: 'remark',
          align: 'center',
          label: '备注',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '首次入库时间',
          show: true
        }, {
          prop: 'updateDt',
          align: 'center',
          label: '更新时间',
          show: true
        }, {
          prop: 'updUName',
          align: 'center',
          label: '操作人',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        listAllData: [],
        multipleSelection: [],
        /** 总数据数 */
        total: 10,
        /** 表格 loading */
        listLoading: false,
        active: '1',
        // 供应商列表
        supplierList: [],
        // 品名列表
        goodsNameList: [],
        // 规格列表
        specList: [],
        // 价格列表
        priceList: [],
        // 用户列表
        userList: [],
        // 文件列表
        fileList: [],
        // 审批流程列表
        shenPiList: [],
        type: '',
        queryParam: {}
      }
    },
    watch: {
       '$route' (to, from) {
         this.type = this.$route.path === '/router/toolLibrary' ? '002' : '001'
         this.caiGouForm.type = this.type
         this.outStockForm.type = this.type
         this.inStockForm.type = this.type
         this.caiGouForm.type = this.type
         this.query.type = this.type
         this.loadData()
         this.$refs.child1.loadData();
       }
    },
    mounted () {
      this.type = this.$route.path === '/router/toolLibrary' ? '002' : '001'
      this.caiGouForm.type = this.type
      this.outStockForm.type = this.type
      this.inStockForm.type = this.type
      this.caiGouForm.type = this.type
      this.query.type = this.type
      Api.supplierList({pageNum: 1, pageSize: 50000}).then(res => {
        this.supplierList = res.records
      })
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then(res => {
        this.userList = res.records
      })
      Api.approvalList({category: '6'}).then(data => {
        if (data) {
          this.shenPiList = data;
        }
      })
      this.loadData()
      this.$refs.child1.loadData();
    },
    methods: {
      // //过滤采购入库数量
      // filterValue(){
      //   if(this.caiGouForm.num > 0 ){
      //
      //   }else {
      //     this.caiGouForm.num = 2
      //   }
      //
      // },
      clearForm () {
        this.fileList = []
        this.removedAll = false
        /** 采购入库 */
        this.caiGouForm = {
          type: '001', // // 类型001物料入库002工具入库
          storageLocation: '',
          remark: '',
          unitPrice: '',
          purchaseAttachmentReqs: []
        }
        /** 领用出库 */
        this.outStockForm = {
          specifications: '',
          unitPrice: '',
          type: '',
          purchaseAttachmentReqs:[]
        }
        /** 领用入库 */
        this.inStockForm = {
          specifications: '',
          unitPrice: '',
          storageLocation: '',
          type: '',
          purchaseAttachmentReqs: []
        }
        /** 消耗 */
        this.form = {
          specifications: '',
          unitPrice: '',
          approvalProcessId: '', // 审批流程id
          purchaseAttachmentReqs: []
        }
      },
      /**
       * 加载
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.operationPage(this.query).then(res => {
          this.listData = res.records
          this.total = res.total
        })
        // 为了让领用出库选择品名有数据

        Api.getGoodsName({type: this.type}).then(res => {
          this.listAllData = res
        })

        this.listLoading = false
      },
      /**
       * 选择供应商
       * */
      selectSupplier (item) {
        this.caiGouForm.supplierName = item.name
        this.caiGouForm.goodsName = ''
        this.caiGouForm.specifications = ''
        this.caiGouForm.unitPrice = ''
        this.caiGouForm.num = ''
        this.caiGouForm.storageLocation = ''
        this.caiGouForm.remark = ''
        Api.supplierGoodsWithDistinctName({supplierId: item.id}).then(res => {
          this.goodsNameList = res
        })
      },
      /**
       * 采购入库选择品名
       * */
      selectGood (item) {
        let param = {
          supplierId: item.supplierId,
          name: item.name
        }
        Api.supplierGoodsWithSpecifications(param).then(res => {
          this.specList = res
        })
      },
      /**
       * 领用出库选择品名
       * */
      selectStorageGood (item, tag) {
        if (tag === 'out') {
          this.outStockForm.specifications = item.specifications
          this.outStockForm.unitPrice = item.unitPrice
          this.outStockForm.type = this.type
        } else if (tag === 'in') {
          this.inStockForm.specifications = item.specifications
          this.inStockForm.unitPrice = item.unitPrice
          this.inStockForm.storageLocation = item.storageLocation
          this.inStockForm.type = this.type
        } else if (tag === 'xh') {
          this.form.specifications = item.specifications
          this.form.unitPrice = item.unitPrice
          this.form.type = this.type
        }
        this.queryParam = {
          goodsName: item.goodsName,
          supplierName: item.supplierName,
          storageLocation: item.storageLocation,
          type: this.type
        }
        Api.getSpecifications(this.queryParam).then(res => {
          this.specList = res
        })
      },
      /**
       * 选择规格
       * */
      selectSpec (item) {
        this.queryParam.specifications = item.specifications
        Api.getPrice(this.queryParam).then(res => {
          this.priceList = res
        })
      },

      /**
       * 采购入库获取价格
       * */
      selectrGoodsWithPrice (item) {
        this.queryParam.specifications = item.specifications
        this.queryParam.name = item.name
        this.queryParam.supplierId = item.supplierId
        this.queryParam.type = this.type
        Api.supplierGoodsWithPrice(this.queryParam).then(res => {
          this.priceList = res
        })
      },

      selectPrice (item, tag) {
        if (tag === 'out') {
          this.outStockForm.purchaseId = item.id
        } else if (tag === 'in') {
          this.inStockForm.purchaseId = item.id
        } else if (tag === 'xh') {
          this.form.purchaseId = item.id
        }
      },
      changeTabData (index) {
        this.tabIndex = index
      },
      /**
       * 提交采购入库
       * */
      submitCaiGou (formName, tag) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileList.length > 0) {
              _this.caiGouForm.purchaseAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.caiGouForm.purchaseAttachmentReqs.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.caiGouForm.purchaseAttachmentReqs = []
              }
            }
            Api.operationPurchase(this.caiGouForm).then(res => {
              if (res) {
                this.$notify.success({
                  title: '提示',
                  message: '采购入库成功'
                })
                this.loadData()
                this.$refs.child1.loadData()
                if (tag === '2') {
                  this.clearForm()
                } else {
                  this.clearForm()
                  this.dialogVisible=false
                }
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelCaiGou (formName) {
        this.clearForm()
        this.dialogVisible=false
      },
      /**
       * 提交领用出库
       * */
      submitOutStock (formName, tag) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileList.length > 0) {
              _this.outStockForm.purchaseAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.outStockForm.purchaseAttachmentReqs.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.outStockForm.purchaseAttachmentReqs = []
              }
            }
            Api.operationExportStock(this.outStockForm).then(res => {
              if (res) {
                this.$notify.success({
                  title: '提示',
                  message: '领用出库提交成功'
                })
                this.loadData()
                this.$refs.child2.loadData();
                if (tag === '2') {
                  this.clearForm()
                } else {
                  this.clearForm()
                  this.dialogVisible2=false
                }
              }
            })
          } else {
            return false;
          }
        });
      },
      cancelOutStock (formName) {
        this.clearForm()
        this.dialogVisible2=false
      },
      /**
       * 提交领用入库
       * */
      submitInStock (formName, tag) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileList.length > 0) {
              _this.inStockForm.purchaseAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.inStockForm.purchaseAttachmentReqs.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.inStockForm.purchaseAttachmentReqs = []
              }
            }
            Api.operationImportStock(this.inStockForm).then(res => {
              if (res) {
                this.$notify.success({
                  title: '提示',
                  message: '领用入库提交成功'
                })
                this.loadData()
                this.$refs.child3.loadData()
                if (tag === '2') {
                  this.clearForm()
                } else {
                  this.clearForm()
                  this.dialogVisible3 = false
                }
              }
            })
          } else {
            return false;
          }
        });
      },
      cancelInStock (formName) {
        this.clearForm()
        this.dialogVisible3 = false
      },
      /**
       * 提交消耗
       * */
      submitXh (formName, tag) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileList.length > 0) {
              _this.form.purchaseAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.form.purchaseAttachmentReqs.push({
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
                this.loadData()
                this.$refs.child4.loadData()
                if (tag === '2') {
                  this.clearForm()
                } else {
                  this.clearForm()
                  this.dialogVisible4 = false
                }
              }
            })
          } else {
            return false;
          }
        });
      },
      cancelXh (formName) {
        this.clearForm()
        this.dialogVisible4 = false
      },

      handleClick(tab, event) {
        this.active = tab.name
        let _this = this
        switch (tab.name) {
          case ('1') : _this.$refs.child1.loadData();break;
          case ('2') : _this.$refs.child2.loadData();break;
          case ('3') : _this.$refs.child3.loadData();break;
          case ('4') : _this.$refs.child4.loadData();break;
          case ('5') : _this.$refs.child5.loadData();break;
        }
      },
      deleteItem (item) {
        this.$confirm('您确定要删除记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 驳回
       * */
      dealIncome (item) {
        this.currentItem = item
        this.dialogVisible = true
      },
      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.searchStr = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      /**
       * 导出excel
       */
      exportExcel () {

        if (this.listData.length > 0) {
          let param = {
            tableHead: this.tableHeader,
            data: this.listData
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '操作库列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>
