<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="150px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">1、基本信息
          <div class="line"></div>
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码：" >
                <el-select v-model.trim="form.projectCode"  
                 remote
                :remote-method="remoteMethod"
                filterable
                clearable placeholder="项目名称/编码/客户名称"  size="medium" style="width: 100%;">
                  <el-option
                    v-for="item in projectList"
                    @click.native="handleProjectInfo(item)"
                    :key="item.projectCode"
                    :label="item.projectCode"
                    :value="item.projectCode">
                    <span style="float: left">{{ item.projectName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报关单号：" prop="customsNo">
                <el-input v-model.trim="form.customsNo" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提运单号：" prop="mainCode">
                <el-input v-model.trim="form.mainCode" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货值总金额：" prop="goodsValue">
                <el-input v-model.trim="form.goodsValue" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="件数：" prop="quantity">
                <el-input v-model.trim="form.quantity" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="毛重：" prop="weight">
                <el-input v-model.trim="form.weight" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="境内外发货人：" prop="sendCompany">
                <el-input v-model.trim="form.sendCompany" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="境内外收货人：" prop="receiveCompany">
                <el-input v-model.trim="form.receiveCompany" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label="客户名称：" prop="customerName">
                <el-input v-model.trim="form.customerName" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="消费使用单位：" prop="consumptionUnit">
                <el-input v-model.trim="form.consumptionUnit" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同协议号：" prop="contractNo">
                <el-input v-model.trim="form.contractNo" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="监管方式：">
                <el-input v-model.trim="form.supervisor" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库区：" >
                <el-input v-model.trim="form.reservoir" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成交方式：" prop="transactionMode">
                <el-input v-model.trim="form.transactionMode" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国际运费：" >
                <el-input v-model.trim="form.freight" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="启运国及港口：" prop="startPort">
                <el-input v-model.trim="form.startPort" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目的国及港口：" prop="destinationPort">
                <el-input v-model.trim="form.destinationPort" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输方式：" prop="transportType">
                <el-select
                  filterable
                  style="width:100%"
                  v-model="form.shipMode"
                  placeholder="请选择运输方式">
                  <el-option
                    v-for="(item, index) in transportationModes"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="进出类型：" prop="importExportType">
                <el-select v-model.trim="form.importExportType" placeholder="选择进出类型" size="medium" style="width: 100%;">
                  <el-option v-for="item in importExportType" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备案号：" >
                <el-input v-model.trim="form.recordNumber" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="许可证号：" >
                <el-input v-model.trim="form.licenseKey" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="报关费：">
                <el-input v-model.trim="form.customsTax" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
			<el-col :span="8">
              <el-form-item label="送货费：" >
                <el-input v-model.trim="form.valueAddTax" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
			<el-col :span="8">
              <el-form-item label="仓储费：" >
                <el-input v-model.trim="form.warehousingCharges" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="滞报费：">
                <el-input v-model.trim="form.delayedDecFee" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
			<el-col :span="8">
              <el-form-item label="滞纳费：" >
                <el-input v-model.trim="form.lateFee" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检疫费：" >
                <el-input v-model.trim="form.quarantineFee" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="查验费：">
                <el-input v-model.trim="form.inspectionFee" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其他费用：" >
                <el-input v-model.trim="form.otherExpenses" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          </el-row>
          <el-row>
		    <el-col :span="8">
              <el-form-item label="接单日期：" prop="receiptDate">
                <el-date-picker style="width: 100%"
                                v-model.trim="form.receiptDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="接单日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="调单日期：" prop="orderSheetDate">
                <el-date-picker style="width: 100%"
                                v-model.trim="form.orderSheetDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="调单日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="进口日期：" prop="importDate">
                <el-date-picker style="width: 100%"
                                v-model.trim="form.importDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="进口日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="出口日期：" prop="exportDate">
                <el-date-picker style="width: 100%"
                                v-model.trim="form.exportDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="出口日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申报日期：" prop="declareDate">
                <el-date-picker style="width: 100%"
                                v-model.trim="form.declareDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="申报日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="放行日期：" prop="releaseDate">
                <el-date-picker style="width: 100%"
                                v-model.trim="form.releaseDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="放行日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="暂时入境编号：" prop="temporaryEntryNo">
                <el-input v-model.trim="form.temporaryEntryNo" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入境延期编号：" prop="entryDelayTimeNo">
                <el-input v-model.trim="form.entryDelayTimeNo" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入境延期次数：" prop="importDelayTime">
                <el-input v-model.trim="form.entryDelayTime" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="暂时出境编号：" prop="temporaryExitNo">
                <el-input v-model.trim="form.temporaryExitNo" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出境延期编号：" prop="exitDelayTimeNo">
                <el-input v-model.trim="form.exitDelayTimeNo" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出境延期次数：" prop="exportDelayTime">
                <el-input v-model.trim="form.exitDelayTime" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否结案：" prop="isFinish">
                <el-radio-group v-model.trim="form.isFinish">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" :maxlength="500" show-word-limit v-model.trim="form.remark" style="width: 100%;"></el-input>
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
                <div v-else-if="header.prop == 'goodsBrand'">
                  <el-input v-model.trim="scope.row.goodsBrand"></el-input>
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
          <!-- <div class="text-right" style="margin-top:10px;" v-if="form.customsGoodsReqs.length>0">
               <strong>单价汇总：</strong>
               <span>{{sumGoodsInfo.price}}{{sumGoodsInfo.monetary}}</span>
               <strong class="ml10">总价汇总：</strong>
               <span>{{sumGoodsInfo.sumPrices}}{{sumGoodsInfo.monetary}}</span>
          </div> -->
        </div>
        <div class="title">2、税款
          <div class="line"></div>
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
                <div v-else-if="header.prop == 'consumptionAmount'">
                  <el-input v-model.trim="scope.row.consumptionAmount" @change="isNum(scope.row.consumptionAmount)"></el-input>
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
        <div class="title">3、代垫<div class="line"></div>
        </div>
        <div class="dash-content pd20">
          <el-table class="page-table" :data="form.substituteCost" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <template  v-for="(header, index) in substituteHeader">
              <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'" >
                  <el-input v-model.trim="scope.row.name"  @change="isNum(scope.row.name)"></el-input>
                </div>
                <div v-else-if="header.prop == 'amount'">
                  <el-input v-model.trim="scope.row.amount" @change="isNum(scope.row.amount)"></el-input>
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
                  @click="addSubstituteCost"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.substituteCost.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="title">4、银行保函
          <div class="line"></div>
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
        <div class="title">5、关税保证保险单
          <div class="line" style="left:130px"></div>
        </div>
        <div class="dash-content" style="padding: 0 20px;">
          <el-table class="page-table" :data="form.taxInsurePaperReqs" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader2" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'includeNo'">
                  <el-input v-model.trim="scope.row.includeNo"></el-input>
                </div>
                <div v-else-if="header.prop == 'guaranteeAmount'">
                  <el-input v-model.trim="scope.row.guaranteeAmount" @change="isNum(scope.row.guaranteeAmount)"></el-input>
                </div>
                
                <div v-else-if="header.prop == 'insuranceFee'">
                  <el-input v-model.trim="scope.row.insuranceFee" @change="isNum(scope.row.insuranceFee)"></el-input>
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
                  @click="addItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.taxInsurePaperReqs.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="title">6、保证金
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
        <div class="title">7、免保金
          <div class="line"></div>
        </div>
        <div class="dash-content pd20">
          <el-table class="page-table" :data="form.exemptionReqs" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <template  v-for="(header, index) in guaranteeFreeHeader">
              <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'guaranteeNo'">
                  <el-input v-model.trim="scope.row.guaranteeNo"></el-input>
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
                  @click="addExemptionReqs"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {form.exemptionReqs.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <div class="title">8、附件上传
          <div class="line"></div>
        </div>
        <!-- <div class="dash-content" style="padding: 0 20px;">
          <el-row style="padding: 10px 20px;">
            <el-col :span="12">
               <template v-if="$route.query.id && form.customsAttachments.length>0">
                
                     <ol>
                      <li v-for="(item,index) in form.customsAttachments" :key="index">
                        <a href="javascript:;" @click="showFileDetails(item.key)">{{item.attachmentName}}</a>
                      </li>
                    </ol>
                
               </template>
             
              <el-form-item label="附件上传：" v-else>
                <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.customsAttachments"></FileListMultiUpload>
              </el-form-item>
              
            </el-col>
          </el-row>
        </div> -->
        <div class="dash-content" >
           <div style="margin-left:20px;">
          <el-button class="mb10"  type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
         
            <el-table class="page-table" :data="form.customsAttachments" stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'type'">
                      {{getDistsKeyName(scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <template v-if="scope.row.key">
                    <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.key)" v-if="isHasImg(scope.row.key)">预览图片</el-button>
                    <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.key)" v-else-if="scope.row.key.indexOf('pdf')!=-1 || scope.row.key.indexOf('PDF')!=-1">预览PDF</el-button>
                    <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.key)">下载文件</el-button>
                  </template>
                  <el-button  type="primary" size="small" @click="deleteItem(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="backList()">返回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 1)">提 交</el-button>
        <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitForm('form',2)">提交后继续创建</el-button>
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
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import FileUpload from '@/pages/resource/filemanage/FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
   import moment from 'moment'
  export default {
    name:'AddCustoms',
    components: {
      FileListMultiUpload,ImgPreview,FileUpload
    },
    computed:{
      fileTypeList(){
          return this.$store.state.dictionary.dists.CustomsAttachmentType.children;
      },
    },
    data () {
      return {
        callBackName: 'getUploadFile',
        transportationModes:[],
        tableHeader1: [{
          prop: 'attachmentName',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, {
          prop: 'type',
          align: 'center',
          label: '文件类型',
          width: '200',
          show: true
        },  {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          width: '200',
          show: true
        },],

        hasCallBack: true,
        // 文件性质
        bidAttchmentType: [],
        dialogVisible:false,
        isAddFile:false,
         isShowDialogImg:false,
        pictures:null,
        fileList: [],
        removedAll: false,
        boxType: '',
        taskTypeName: '',
        taskTypeValue: '',
        // 选择的任务类型是否是预算任务
        isBudget: false,
        flag: false,
        supplierId: '', // 供应商id
        importExportId: '', // 进出类型id
        supplierList: '', // 供应商列表
        type: '',
        form: {
          id:'',
          weight: '',
          projectName: '',
          customsGoodsReqs: [],
          bankGuaranteePaperReqs: [],
          taxInsurePaperReqs: [],
          customsInsuranceFeeReqs: [],
          customsAttachments: [],
          exemptionReqs:[],  //免保金
          tariffReqs:[],//关税
          substituteCost:[],
        },
        // 进出口类型
        importExportType: [
          {cnInfo: '进口', value: '001'},
          {cnInfo: '出口', value: '002'}
          ],
        // 币种
        currencyTypeList: [],
        /** 表格 loading */
        listLoading: false,
        rules: {
          'projectCode':[
            { required: true, message: '请选择项目编号', trigger: 'blur' },
          ],
          'customsNo': [
            { required: true, message: '请填写报关单号', trigger: 'blur' },
          ],
           'goodsValue': [
            { required: true, message: '请填写货值', trigger: 'blur' },
          ],
          'internationalShipping':[
          {required: true, message: '请填写国际运费', trigger: 'blur'}
          ],
          'weight': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字' }
          ],
          'quantity': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'tax': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'insuranceAmount': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'amount': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'transportFee': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'otherFee': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'netWeight': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'importDelayTime': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'exportDelayTime': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
        },
        /** 包装箱数据 */
        boxData: [],
        /** 内部包装箱数据 */
        innerBoxData: [],
        /** 预算组列表 */
        budgetGroupList: [],
        /** 任务内容 */
        contentData: [],
        /** 货物数据 */
        goodsData: [],
        goodsHeader: [{
          prop: 'no',
          align: 'center',
          label: '项号',
          width: '100',
          show: true
        }, {
          prop: 'goodsNo',
          align: 'center',
          label: '商品编号',
          show: true
        }, {
          prop: 'goodsNameSpecifications',
          align: 'center',
          label: '商品名称及规格',
          width: '150',
          show: true
        },{
          prop: 'goodsBrand',
          align: 'center',
          label: '货物品牌',
          width: '120',
          show: true
        },{
          prop: 'numAndUnit',
          align: 'center',
          label: '数量及单位',
          show: true
        }, {
          prop: 'unitOrTotalPrice',
          align: 'center',
          label: '单价/总价/币制',
          width: '150',
          show: true
        }, {
          prop: 'countryOfOrigin',
          align: 'center',
          label: '原产国',
          show: true
        }, {
          prop: 'countryOfDestination',
          align: 'center',
          label: '最终目的国',
          show: true
        }, {
          prop: 'domesticSourceOfGoods',
          align: 'center',
          label: '境内货源地',
          show: true
        }, {
          prop: 'exemption',
          align: 'center',
          label: '征免',
          show: true
        }],
        tableHeader: [{
          prop: 'includeNo',
          align: 'center',
          label: '保函单号',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeAmount',
          align: 'center',
          label: '担保额度',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeStart',
          align: 'center',
          label: '担保期限开始时间',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeEnd',
          align: 'center',
          label: '担保期限结束时间',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
        tableHeader2: [{
          prop: 'includeNo',
          align: 'center',
          label: '保险单号',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeAmount',
          align: 'center',
          label: '担保额度',
          width: '100',
          show: true
        }, {
          prop: 'insuranceFee',
          align: 'center',
          label: '保险费',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeStart',
          align: 'center',
          label: '担保期限开始时间',
          width: '100',
          show: true
        }, {
          prop: 'guaranteeEnd',
          align: 'center',
          label: '担保期限结束时间',
          width: '100',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
        //5、免保金 
        guaranteeFreeHeader:[{
          prop: 'guaranteeNo',
          align: 'center',
          label: '保函序号',
          width: '150',
          show: true
        }, {
          prop: 'startDt',
          align: 'center',
          label: '担保开始时间',
          width: '150',
          show: true
        }, {
          prop: 'endDt',
          align: 'center',
          label: '结束时间',
          width: '150',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
        //6、关税
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
          prop: 'consumptionAmount',
          align: 'center',
          label: '消费税金额',
          width: '150',
          show: true
        }, {
          prop: 'startDt',
          align: 'center',
          label: '出税时间',
          width: '150',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
        substituteHeader:[{
          prop: 'name',
          align: 'center',
          label: '代垫费用名称',
          width: '150',
          show: true
        }, {
          prop: 'amount',
          align: 'center',
          label: '其它代垫费用',
          width: '150',
          show: true
        },{
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
        insuranceHeader: [{
          prop: 'insuranceFeeNo',
          align: 'center',
          label: '保证金单号',
          width: '150',
          show: true
        }, {
          prop: 'amount',
          align: 'center',
          label: '保证金额',
          width: '150',
          show: true
        }, {
          prop: 'startDt',
          align: 'center',
          label: '担保期限开始时间',
          width: '150',
          show: true
        }, {
          prop: 'endDt',
          align: 'center',
          label: '担保期限结束时间',
          width: '150',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '100',
          show: true
        }],
        sumGoodsInfo:{
          price:0,
          sumPrices:0,
          monetary:'',
        },
        /** 当前项目 */
        curProject: {},
        /** 对话框 */
        dialogVisible1: false,
        dialogVisible2: false,
        /** 包装箱信息 */
        boxInfoList: [],
        /** 内包装箱信息 */
        boxInnerInfoList: [],
        /** 货物信息 */
        goodsList: [],
        /** 项目列表 */
        projectList: [],
        projectType: '',
        /** 任务级别标准 */
        taskLevelList: [],
        /** 任务类型 */
        taskTypeList: [],
        orgId: '',
        orgName: '',
        treeData: [],
        projectCode: ''
      }
    },
    mounted () {
      if (sessionStorage.getItem('dists')) {
        let dists = JSON.parse(sessionStorage.getItem('dists'));
        if (dists.Currency) {
          this.currencyTypeList = dists.Currency.children
        }
        if (dists.TransportationMode) {
         this.transportationModes = dists.TransportationMode.children;
        }
      }
     
      this.load();
      this.remoteMethod();
    },
    methods: {
      remoteMethod(query='') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              searchStr:query,
              myProjectList:false,
              projectTypes : ['2','3']
          }
          Api.projectList(params).then(res=>{
            this.projectList = res.records
          })
          
        }, 200);
      },
      deleteGoodsItem(index){
          this.form.customsGoodsReqs.splice(index,1)
      },
      getDistsKeyName(type){
        return this.fileTypeList.filter(item=>item.value==type)[0].cnInfo;
      },
      //删除报关附件
      deleteItem(row,index){
          if(row.id){
            const params  = {
              id:row.id
            }
            Api.deleteAttachment(params).then(res=>{
                this.form.customsAttachments.splice(index,1)
            })
          }else{
             this.form.customsAttachments.splice(index,1)
          }
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
        this.form.customsAttachments.push({
          attachmentName: form.fileName,
          key: form.key,
          type: form.type,
          description: form.description,
          //size: _this.renderSize(form.size)
        })
      },
      renderSize(value){
        if(!value){
          return "";
        }
        let unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
        let index=0;
        let srcsize = parseFloat(value);
        index=Math.floor(Math.log(srcsize)/Math.log(1024));
        let size =srcsize/Math.pow(1024,index);
        size=size.toFixed(2);//保留的小数位数
        return size+unitArr[index];
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
        
      /**校验是否填写数字**/
      isNum (str) {
        if (str) {
          let reg=/^[0-9]*$/;   /**定义验证表达式*/
          if (!reg.test(str)) {
            this.$notify.warning({
              title: '提示',
              message: '请填写数字'
            })

          }
        }
      },
      /**加载**/
      load(){
        if(this.$route.query.id){
          this.listLoading = true
          let _this = this
          Api.customsDetail({id : this.$route.query.id}).then((res) => {
            if (res) {
              this.form = res
              this.form.taxInsurePaperReqs = res.taxInsurePapers
              this.form.substituteCost = res.substituteCost
              this.form.bankGuaranteePaperReqs = res.bankGuaranteePapers
              this.form.releaseDate = res.releaseDate ? moment(res.releaseDate).format('YYYY-MM-DD') : ''
              this.form.applyFinishDate	= res.applyFinishDate ? moment(res.applyFinishDate).format('YYYY-MM-DD') : ''
              this.form.declareDate	= res.declareDate ? moment(res.declareDate).format('YYYY-MM-DD') : ''
              this.form.receiptDate	= res.receiptDate ? moment(res.receiptDate).format('YYYY-MM-DD') : ''
              this.form.orderSheetDate	= res.orderSheetDate ? moment(res.orderSheetDate).format('YYYY-MM-DD') : ''
              this.form.releaseDate	= res.releaseDate ? moment(res.releaseDate).format('YYYY-MM-DD') : ''
              this.form.importDate = res.importDate ? moment(res.importDate).format('YYYY-MM-DD') : ''
              this.form.exportDate = res.exportDate ? moment(res.exportDate).format('YYYY-MM-DD') : ''
              this.form.exitDate = this.form.exitDate ? moment(res.exitDate).format('YYYY-MM-DD') : ''
              this.form.entryDate = res.entryDate ? moment(res.entryDate).format('YYYY-MM-DD') : ''
              if (res.bankGuaranteePapers) {
                res.bankGuaranteePapers.forEach(function (item) {
                  item.guaranteeStart = item.guaranteeStart ? moment(item.guaranteeStart).format('YYYY-MM-DD HH:mm:ss') : ''
                  item.guaranteeEnd = item.guaranteeEnd ? moment(item.guaranteeEnd).format('YYYY-MM-DD HH:mm:ss') : ''
                })
              }
              if (res.taxInsurePapers) {
                res.taxInsurePapers.forEach(function (item) {
                  item.guaranteeStart = item.guaranteeStart ? moment(item.guaranteeStart).format('YYYY-MM-DD HH:mm:ss') : ''
                  item.guaranteeEnd = item.guaranteeEnd ? moment(item.guaranteeEnd).format('YYYY-MM-DD HH:mm:ss') : ''
                })
              }
              this.form.bankGuaranteePaperReqs = res.bankGuaranteePapers
              this.form.taxInsurePaperReqs = res.taxInsurePapers

              if (res.customsGoodsList) {
                 this.form.customsGoodsReqs = res.customsGoodsList
              }
              if (res.customsInsuranceFees) {
                res.customsInsuranceFees.forEach(function (item) {
                  item.startDt = item.startDt ? moment(item.startDt).format('YYYY-MM-DD HH:mm:ss') : ''
                  item.endDt = item.endDt ? moment(item.endDt).format('YYYY-MM-DD HH:mm:ss') : ''
                })
                 this.form.customsInsuranceFeeReqs = res.customsInsuranceFees
              }
              //免保金
              let exemptionReqs = res.exemptionReqs
              if (exemptionReqs) {
                exemptionReqs.forEach(function (item) {
                  item.startDt = item.startDt ? moment(item.startDt).format('YYYY-MM-DD HH:mm:ss') : ''
                  item.endDt = item.endDt ? moment(item.endDt).format('YYYY-MM-DD HH:mm:ss') : ''
                })
                 this.form.exemptionReqs = exemptionReqs
              }
              //关税
              let tariffReqs = res.tariffReqs
              if (tariffReqs) {
                tariffReqs.forEach(function (item) {
                  item.startDt = item.startDt ? moment(item.startDt).format('YYYY-MM-DD HH:mm:ss') : ''
                  
                })
                 this.form.tariffReqs = tariffReqs
              }
              if (res.customsAttachments && res.customsAttachments.length > 0) {

                res.customsAttachments.forEach(function (item) {
                  _this.$set(item, 'url', item.key)
                  _this.$set(item, 'name', item.attachmentName)
                })
                this.form.customsAttachments = res.customsAttachments
              } else {
                this.form.customsAttachments = []
              }
          
            }
        })
        this.listLoading = false
        }
      },
      /**重量，名称回显**/
      handleProjectInfo(item){
         this.form.projectName = item.projectName;
        this.form.weight = item.weight
      },
      /**重量，名称回显**/

      s(val){
        for (let i = 0; i < this.projectList.length; i++) {
          let item = this.projectList[i]
          if (val === item.projectCode) {
            this.form.projectName = item.projectName;
            this.form.weight = item.weight
            break
          }
        }
      },

      handleClick(data, checked, node){
        if(checked == true){
          this.form.taskInfoReq.orgId = data.orgId;
          this.orgId = data.orgId;
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        }
      },
      nodeClick(data, checked, node){
        this.form.taskInfoReq.orgId = data.orgId
        this.orgId = data.orgId
        this.orgName = data.orgName
        this.$refs.orgTree.setCheckedNodes([data]);
      },
      /**
       * 初始化页面数据
       */
      init () {

        // 任务列表
        if (sessionStorage.getItem('dists')) {
          let dists = JSON.parse(sessionStorage.getItem('dists'));
          // 如果是项目详情，预算成本-新增预算任务进来的，就只有预算任务
          if (this.$route.query.type === 'budget') {
            if (dists.ArtType) {
              this.taskTypeList = dists.ArtType.children
            }
          } else {
            if (dists.TasType) {
              // 如果是项目详情-任务列表进来的，就没有预算任务
              if (this.$route.query.type === 'exBudget') {
                let arr = dists.TasType.children
                let filterArr = []
                if (arr.length > 0) {
                  arr.forEach(function (item) {
                    if (item.cnInfo.indexOf('预算') === -1) {
                      filterArr.push(item)
                    }
                  })
                }
                this.taskTypeList = filterArr
              } else {
                this.taskTypeList = dists.TasType.children
              }
            }
          }
          if (dists.TaskLevel) {
            this.taskLevelList = dists.TaskLevel.children
          }
        }
        // 项目列表
         this.remoteMethod()
        // Api.projectAll({}).then(data => {
        //   this.projectList = data;
        // })
        // 供应商列表
        Api.selectSupplierList({}).then(data => {
          this.supplierList = data;
        })
        // 组织机构
        Api.getTreeFormOrgInfo().then(data => {
          this.treeData = data
        })
        // this.loadPackagesInfo()
      },
      /**
       * 包装箱信息
       * */
      loadPackagesInfo () {
        let outBoxParam = {
          isSelf: 0,
          projectCode: this.projectCode
        }
        let innerBoxParam = {
          isSelf: '1',
          isBudget: '0',
          projectCode: this.projectCode
        }
        // 如果是出库任务， 多传一个taskType参数
        if (this.taskTypeValue === '014') {
          outBoxParam.taskType = this.taskTypeValue
          innerBoxParam.taskType = this.taskTypeValue
        } else {
          delete outBoxParam['taskType']
          delete innerBoxParam['taskType']
        }
        // 外包装箱信息
        Api.packageListAll(outBoxParam).then(data => {
          this.boxInfoList = data
        })
        // 内部装箱信息
        Api.packageListAll(innerBoxParam).then(data => {
          this.boxInnerInfoList = data;
        })
      },
      /**
       * 加载预算组
       */
      loadBudgetGroup () {
        Api.budgetGroupList({
          projectCode: this.projectCode
        }).then(data => {
          if (data) {
            this.budgetGroupList = data;
          }
        })
      },

      /**返回*/
      backList(){
        this.$router.push({path: '/router/aerialMaterialList'})
      },

      /**
       * 表单提交
       */
      submitForm (formName,i) { //addBidProject
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileList.length > 0) {
              _this.form.customsAttachments = []
              this.fileList.forEach(function (item) {
                _this.form.customsAttachments.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.customsAttachments = []
              }
            }
            if(this.$route.query.id){
             this.edit()
            }else {
             this.add(i)
            }
            console.log('form: ' + this.form)
          } else {
            this.$message('请完善表单')
          }
        })
      },

      /**编辑与添加**/
      //添加
      add: function (i) {
        Api.customsAdd(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            if(i === 1){
              this.$router.push({path: '/router/aerialMaterialList'})
            }else {
              // 跳转回去
              this.form = {
                  id:'',
                  weight: '',
                  projectName: '',
                  customsGoodsReqs: [],
                  bankGuaranteePaperReqs: [],
                  taxInsurePaperReqs: [],
                  customsInsuranceFeeReqs: [],
                  customsAttachments: []
              }
              this.fileList = []
              this.removedAll = false

            }
          }
        })
      },
      //编辑
      edit: function () {
        this.form.applyDate = moment(this.form.applyDate).format('YYYY-MM-DD')
        delete this.form['customsInsuranceFees']
        delete this.form['taxInsurePapers']
        delete this.form['customsGoodsList']
        delete this.form['taxInsurePapers']
        Api.customsEdit(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })

            // 跳转回去
            this.$router.push({path: '/router/aerialMaterialList'})
          }
        })
      },
      /**
             * 任务类型下拉框点击事件
       * */
      selectTaskType (item) {
        if (item.cnInfo === '包装预算任务' || item.cnInfo === '外勤预算任务' || item.cnInfo === '报关预算任务') {
          this.isBudget = true
        } else {
          this.isBudget = false
        }
        this.taskTypeValue = item.value
        // 如果是出库任务，重新查询一下货物信息，包装信息
        if (item.value === '014') {
          this.loadMaterialList()
          this.loadPackagesInfo()
        }
        this.taskTypeName = item.cnInfo
      },
      /**
       * 选择项目
       */
      selectProject (val) {
        for (let i = 0; i < this.projectList.length; i++) {
          let item = this.projectList[i]
          if (val === item.projectCode) {
            this.curProject = item;
            this.projectCode = item.projectCode
            // projetctType: 3 国际航材，1艺术品，2国内航材
            this.projectType = item.projectType
            this.form.taskInfoReq.projectName = item.projectName
            break
          }
        }
        this.loadBudgetGroup()
        // 加载包装箱信息
        this.loadPackagesInfo()
        // 加载货物信息
        this.loadMaterialList()

      },
      /**
       * 查询货物信息
       * */
      loadMaterialList () {
        let param = {
          projectCode: this.projectCode
        }
        // 如果是出库任务， 多传一个taskType参数
        if (this.taskTypeValue === '014') {
          param.taskType = this.taskTypeValue
        } else {
          delete param['taskType']
        }
        // 获取货物明细来源数据，对应弹框的列表数据
        if (this.projectType === "1") {
          // 艺术品
          Api.artMaterialListAll(param).then(data => {
            this.goodsList = data
          })
        } else if (this.projectType === "2") {
          // 航材国内
          Api.domesticMaterialList(param).then(data => {
            this.goodsList = data
          })
        } else if (this.projectType === "3") {
          // 航材国际
          Api.foreignMaterialList(param).then(data => {
            this.goodsList = data
          })
        }
      },
      
      addCusGoods () {
        let item = {
          countryOfDestination: '',
          countryOfOrigin: '',
          domesticSourceOfGoods: '',
          exemption: '',
          goodsNameSpecifications: '',
          goodsNo: '',
          goodsBrand:'',
          no: '',
          numAndUnit: '',
          unitOrTotalPrice: '',
          remarks:'',
        }
        this.form.customsGoodsReqs.push(item)
      },
      addSubstituteCost () {
        let item = {
          name: '',
          amount: '',
          remarks:'',
        }
        this.form.substituteCost.push(item)
      },
      addGuaranteeFree () {
        let item = {
          amount: '',
          startDt: '',
          endDt: '',
          insuranceFeeNo: '',
          no: '',
          exemptionPremium:'',
          remarks:'',
        }
        this.form.customsInsuranceFeeReqs.push(item)
      },
      addInsuranceFee () {
        let item = {
          amount: '',
          startDt: '',
          endDt: '',
          insuranceFeeNo: '',
          no: '',
          exemptionPremium:'',
          remarks:'',
        }
        this.form.customsInsuranceFeeReqs.push(item)
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
      addItem () {
        let item = {
          includeNo: '',
          guaranteeAmount: '',
          insuranceFee: '',
          guaranteeStart: '',
          guaranteeEnd: '',
          remarks:'',
        }
        this.form.taxInsurePaperReqs.push(item)
      },
      //5、添加免保金 
      addExemptionReqs () {
        let item = {
          guaranteeNo: '',
          startDt: '',
          endDt: '',
          remarks:'',
        }
        this.form.exemptionReqs.push(item)
      },
      //6、关税 
      addTariffReqs () {
        let item = {
          tariffAmount: '',
          vatAmount: '',
          consumptionAmount:'',
          startDt: '',
          remarks:'',
        }
        this.form.tariffReqs.push(item)
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
