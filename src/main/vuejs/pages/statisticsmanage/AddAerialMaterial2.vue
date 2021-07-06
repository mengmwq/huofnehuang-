<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">
          申请信息
          <div class="line"></div>
        </div>
        <p class="step-title">
          <span class="step-icon">1</span>基本信息：
        </p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="主运单号：" prop="mainCode">
                <el-input v-model="form.mainCode	"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编码：" prop="projectCode">
                <el-select
                  v-model.trim="form.projectCode"
                 
                    remote
                :remote-method="remoteMethod"
                  filterable
                clearable placeholder="项目名称/编码/客户名称"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectCode"
                    :value="item.projectCode"
                     @click.native="handleProjectInfo(item)"
                  >
                    <span style="float: left">{{ item.projectName }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.projectCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row>
            <el-col :span="12">
              <el-form-item label="合同号：" prop="contractCode">
                <el-select
                  filterable
                  v-model="form.contractCode"
                  placeholder="选择合同号"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(item,index) in contractList"
                    :key="index"
                    :label="item.contractCode"
                    :value="item.contractCode"
                  >
                    <span style="float: left">{{ item.contractCode }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.contractName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="始发港：" prop="no">
                <el-input v-model="form.originPlace"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申报日期：" prop="time">
                <el-date-picker
                  type="datetime"
                  placeholder="请选择申报日期"
                  v-model="form.declareDate"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中文名称：" prop="cnName">
                <el-input v-model="form.chineseName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名称：" prop="enName">
                <el-input v-model="form.englishName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="件数：" prop="quantity">
                <el-input v-model="form.quantity"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量：" prop="weight">
                <el-input v-model="form.weight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="件号：" prop="cnName">
                <el-input v-model="form.pieceMode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="个数：" prop="num">
                <el-input v-model="form.num"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票金额：" prop="receiptPrice">
                <el-input v-model="form.receiptPrice"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期：" prop="time">
                <el-date-picker
                  type="datetime"
                  placeholder="请选择日期"
                  v-model="form.day"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报关单号：" prop="baoguan">
                <el-input v-model="form.customsNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="贸易方式：" prop="tradeType">
                <el-input v-model="form.tradeMode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的港：" prop="targetPort">
                <el-input v-model="form.internalDesPort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运输方式：" prop="transportType">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.shipMode"
                  placeholder="请选择运输方式"
                >
                  <el-option
                    v-for="(item, index) in transportationModes"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关税：" prop="customsTax">
                <el-input v-model="form.customsTax"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="增值税：" prop="valueAddTax">
                <el-input v-model="form.valueAddTax"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关税编号：" prop="tariffNo">
                <el-input v-model="form.taxNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="增值税编号：" prop="vatNo">
                <el-input v-model="form.valueAddTaxNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-table class="page-table" :data="form.customsGoodsReqs" stripe highlight-current-row  :cell-style="{color:'#333'}">
            <el-table-column label="#" type="index" width="40"></el-table-column>
            <el-table-column v-for="(header, index) in goodsHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'no'">
                  <el-input v-model.trim="scope.row.no"></el-input>
                </div>
                <div v-else-if="header.prop == 'goodsNo'">
                  <el-input v-model.trim="scope.row.goodsNo"></el-input>
                </div>
                <div v-else-if="header.prop == 'goodsNameSpecifications'">
                  <el-input v-model.trim="scope.row.goodsNameSpecifications"></el-input>
                </div>
                <div v-else-if="header.prop == 'numAndUnit'">
                  <el-input v-model.trim="scope.row.numAndUnit"></el-input>
                </div>
                <div v-else-if="header.prop == 'unitOrTotalPrice'">
                  <el-input v-model.trim="scope.row.unitOrTotalPrice"></el-input>
                </div>
                <div v-else-if="header.prop == 'countryOfOrigin'">
                  <el-input v-model.trim="scope.row.countryOfOrigin"></el-input>
                </div>
                <div v-else-if="header.prop == 'countryOfDestination'">
                  <el-input v-model.trim="scope.row.countryOfDestination"></el-input>
                </div>
                <div v-else-if="header.prop == 'domesticSourceOfGoods'">
                  <el-input v-model.trim="scope.row.domesticSourceOfGoods"></el-input>
                </div>
                <div v-else-if="header.prop == 'exemption'">
                  <el-input v-model.trim="scope.row.exemption"></el-input>
                </div>
                <div v-else-if="header.prop == 'number'">
                  <el-input v-model.trim="scope.row.number"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="70">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addCusGoods"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteGoodsItem(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
         </div>
  		<div class="title">1、客户信息<div class="line"></div>
        </div>
        <div class="dash-content" style="padding: 0 20px;">
          <el-table class="page-table" :data="form.bankGuaranteePaperReqs" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'includeNo'">
                  <el-input v-model.trim="scope.row.includeNo"></el-input>
                </div>
                <div v-else-if="header.prop == 'guaranteeAmount'">
                  <el-input v-model.trim="scope.row.guaranteeAmount" @change="isNum(scope.row.guaranteeAmount)"></el-input>
                </div>
                <div v-else-if="header.prop == 'guaranteeStart'">
                  <el-date-picker
                    v-model.trim="scope.row.guaranteeStart"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择开始日期">
                  </el-date-picker>
                </div>
                <div v-else-if="header.prop == 'guaranteeEnd'">
                  <el-date-picker
                    v-model.trim="scope.row.guaranteeEnd"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择结束日期">
                  </el-date-picker>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model.trim="scope.row.remarks" ></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="70">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addContent"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.bankGuaranteePaperReqs.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="title">2、税款<div class="line"></div>
        </div>
        <div class="dash-content pd20">
          <el-table class="page-table" :data="form.tariffReqs" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <template  v-for="(header, index) in tariffHeader">
              <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'tariffAmount'" >
                  <el-input v-model.trim="scope.row.tariffAmount"  @change="isNum(scope.row.tariffAmount)"></el-input>
                </div>
                <div v-else-if="header.prop == 'vatAmount'">
                  <el-input v-model.trim="scope.row.vatAmount" @change="isNum(scope.row.vatAmount)"></el-input>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model.trim="scope.row.remarks" ></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            </template>
            <el-table-column align="left" width="70">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addTariffReqs"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.tariffReqs.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="title">3、费用项
          <div class="line"></div>
        </div>
        <div class="dash-content pd20">
          <el-table class="page-table" :data="form.customsInsuranceFeeReqs" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <template  v-for="(header, index) in insuranceHeader">
              <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'insuranceFeeNo'">
                  <el-input v-model.trim="scope.row.insuranceFeeNo"></el-input>
                </div>
                <div v-else-if="header.prop == 'amount'">
                  <el-input v-model.trim="scope.row.amount" @change="isNum(scope.row.amount)"></el-input>
                </div>
                <div v-else-if="header.prop === 'startDt'">
                  <el-date-picker
                    v-model.trim="scope.row.startDt"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择开始日期">
                  </el-date-picker>
                </div>
                <div v-else-if="header.prop === 'endDt'">
                  <el-date-picker
                    v-model.trim="scope.row.endDt"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择结束日期">
                  </el-date-picker>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model.trim="scope.row.remarks" ></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            </template>
            <el-table-column align="left" width="70">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addInsuranceFee"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.customsInsuranceFeeReqs.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form')">提 交</el-button>
        <el-button type="primary" size="medium" @click="submitAddCreate('form')">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import Api from "@/api/index";
export default {
  name:'AddAerialMaterial',
  data() {
    return {
      // 判断是入库还是出库
      flag: false,
      type: "",
      form: {
        weight:'',
        projectName:'',
        customsGoodsReqs:[],
        bankGuaranteePaperReqs:[],
        tariffReqs:[],
        customsInsuranceFeeReqs:[]
      },
      /** 表格数据 */
      listData: [],
      tariffReqs:[],
      bankGuaranteePaperReqs:[],
      customsGoodsReqs:[],
      customsInsuranceFeeReqs:[],
      goodsHeader: [{
          prop: 'no',
          align: 'center',
          label: '项号',
          width: '60',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '合同协议号',
          show: true
        }, {
          prop: 'number',
          align: 'center',
          label: '件数',
          show: true
        }, {
          prop: 'countryOfDestination',
          align: 'center',
          label: '毛重',
          show: true
        }, {
          prop: 'goodsNameSpecifications',
          align: 'center',
          label: '商品名称',
          width: '150',
          show: true
        }, {
          prop: 'goodsNo',
          align: 'center',
          label: '商品编号',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '规格型号',
          show: true
        }, {
          prop: 'numAndUnit',
          align: 'center',
          label: '数量及单位',
          width: '120',
          show: true
        }, {
          prop: 'countryOfOrigin',
          align: 'center',
          label: '原产国',
          show: true
        }, {
          prop: 'unitOrTotalPrice',
          align: 'center',
          label: '总价及币值',
          width: '150',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '暂时进出口编号',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '延期编号',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '延期次数',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '是否需结案',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '成交方式',
          show: true
        }],
       tableHeader: [{
          prop: 'includeNo',
          align: 'center',
          label: '客户名称',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeStart',
          align: 'center',
          label: '接单日期',
          width: '200',
          show: true
        }, {
          prop: 'guaranteeEnd',
          align: 'center',
          label: '调单日期',
          width: '200',
          show: true
        }, {
          prop: 'guaranteeStart',
          align: 'center',
          label: '申报日期',
          width: '200',
          show: true
        }, {
          prop: 'guaranteeEnd',
          align: 'center',
          label: '放行日期',
          width: '200',
          show: true
        }, {
          prop: 'guaranteeAmount',
          align: 'center',
          label: '进出口类型',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '报关单号',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '进出境关别',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '申报地关别',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '库区',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '提运单号',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '境内外收发货人',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '消费使用单位',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '启运国及港口',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '目的国及港口',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '运输方式',
          width: '100',
          show: true
        }],
      /** 总数据数 */
      total: 0,
      tariffHeader:[{
          prop: 'tariffAmount',
          align: 'center',
          label: '关税金额',
          width: '150',
          show: true
        }, {
          prop: 'vatAmount',
          align: 'center',
          label: '增值税金额',
          width: '150',
          show: true
        }, {
          prop: 'vatAmount',
          align: 'center',
          label: '消费税金额',
          width: '150',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '保证金金额',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '保证金编号',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '保函编号',
          width: '100',
          show: true
        }],
        insuranceHeader: [{
          prop: 'insuranceFeeNo',
          align: 'center',
          label: '查验费',
          width: '150',
          show: true
        }, {
          prop: 'amount',
          align: 'center',
          label: '报关费',
          width: '150',
          show: true
        }, {
          prop: 'startDt',
          align: 'center',
          label: '送货费',
          width: '150',
          show: true
        }, {
          prop: 'endDt',
          align: 'center',
          label: '其它代垫费用',
          width: '150',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
      /** 表格 loading */
      listLoading: false,
      //审批下拉
      shenPiList: [],
      projectList: [],
      //合同号
      contractList: [],
      transportationModes: [],
      rules: {
        mainCode: [
          { required: true, message: "请输入主运单号", trigger: "blur" }
        ],
        contractCode: [
          { required: true, message: "请输入合同号", trigger: "blur" }
        ],
        // approvalProcessId: [
        //   { required: true, message: '请输入审批流程', trigger: 'blur' }
        // ],
        customsTax: [
          { required: false, message: "", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ],
        num: [
          { required: false, message: "", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ],
        weight: [
          { required: false, message: "", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ],
        quantity: [
          { required: false, message: "", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ],
        receiptPrice: [
          { required: false, message: "", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ],
        valueAddTax: [
          { required: false, message: "", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ]
      }
    };
  },
  mounted() {
    if (sessionStorage.getItem("dists")) {
      let dists = JSON.parse(sessionStorage.getItem("dists"));
      if (dists.TransportationMode) {
        this.transportationModes = dists.TransportationMode.children;
      }
    }
    //审批流程
    Api.approvalList({ category: "5" })
      .then(data => {
        this.shenPiList = data;
      })
      .finally(() => {
        this.listLoading = false;
      });
    //合同编号
    Api.pageContract({ pageNum: 1, pageSize: 50000 })
      .then(data => {
        this.contractList = data.records;
      })
      .finally(() => {
        this.listLoading = false;
      });

    this.flag = this.$route.path === "/router/PutInStock";
    this.remoteMethod()
  },
  methods: {
    /**重量，名称回显**/
      handleProjectInfo(item){
        console.log(item,'sss')
         this.form.projectName = item.projectName;
        this.form.weight = item.weight
      },
    remoteMethod(query = "") {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
          pageNum: 1,
          pageSize: 10,
          searchStr: query,
          myProjectList: false
        };
        Api.projectList(params).then(res => {
          console.log(res, "resss");
          this.projectList = res.records;
        });
      }, 200);
    },
    addContent () {
        let item = {
          includeNo: '',
          guaranteeAmount: '',
          guaranteeStart: '',
          guaranteeEnd: '',
          remarks:'',
        }
        this.form.bankGuaranteePaperReqs.push(item)
      },
   addTariffReqs () {
        let item = {
          tariffAmount: '',
          vatAmount: '',
          startDt: '',
          remarks:'',
        }
        this.form.tariffReqs.push(item)
      },
    addCusGoods () {
        let item = {
          countryOfDestination: '',
          countryOfOrigin: '',
          domesticSourceOfGoods: '',
          exemption: '',
          goodsNameSpecifications: '',
          goodsNo: '',
          no: '',
          numAndUnit: '',
          unitOrTotalPrice: '',
          remarks:'',
        }
        this.form.customsGoodsReqs.push(item)
      },
     deleteGoodsItem(index){
          this.form.customsGoodsReqs.splice(index,1)
          //this.getSumGoodsInfo()
      },
    /**
     * 表单提交
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.day = moment(this.form.day).format("YYYY-MM-DD");
          this.form.declareDate = moment(this.form.declareDate).format(
            "YYYY-MM-DD"
          );
          Api.customsAdd(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: "提示",
                message: "添加成功"
              });
              // 跳转回去
              this.$router.push({ path: "/router/aerialMaterialList" });
            }
          });
          console.log("form: " + this.form);
        } else {
          this.$message("请完善表单");
        }
      });
    },
    submitAddCreate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.day = moment(this.form.day).format("YYYY-MM-DD");
          this.form.declareDate = moment(this.form.declareDate).format(
            "YYYY-MM-DD"
          );
          Api.customsAdd(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: "提示",
                message: "添加成功"
              });
              // 跳转回去
              this.form = {};
            }
          });
          console.log("form: " + this.form);
        } else {
          this.$message("请完善表单");
        }
      });
    },
    cancelSubmit(formName) {
      this.form = {
        weight:'',
        projectName:'',
      };
    }
  }
};
</script>

<style scoped>
.title {
  color: #c2272d;
  margin-bottom: 10px;
  overflow: hidden;
  height: 40px;
}

.title .line {
  border-bottom: 2px dashed #dfdfdf;
  position: relative;
  left: 80px;
  margin-top: -11px;
}

.footer {
  float: right;
  margin-top: 20px;
}
</style>
