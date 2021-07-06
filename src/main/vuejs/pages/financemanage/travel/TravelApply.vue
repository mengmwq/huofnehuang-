<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编码：" prop="projectCode">
                 <span v-if="$route.query.flag=='myApply'">{{form.projectCode}}</span>
                <el-select v-else filterable clearable v-model="form.projectCode"
                 remote
                :remote-method="remoteMethod"
                 placeholder="项目名称/编号/客户名称" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in projectList"
                    :key="index"
                    :label="item.projectCode"
                    :value="item.projectCode">
                    <span style="float: left">{{ item.projectName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="借款单编号：" prop="loanApplyId">
                <span v-if="$route.query.flag=='myApply'">{{form.loanApplyId}}</span>
                <el-select v-else v-model="form.loanApplyId" placeholder="借款单编号" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in borrowList"
                    :key="index"
                    :label="item.id"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">

              <el-form-item label="申请人：" prop="applyer">
                <el-select v-model="form.applyer" filterable placeholder="申请人" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    @click.native="selectUser(item)"
                    :label="item.uName"
                    :value="item.uId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务：" >
                <span>{{form.positionName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门：">
                <span>{{form.orgName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出差事由：" prop="reason">
                <el-input v-model="form.reason"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="12">
              <el-form-item label="总计金额：" prop="amount">
                {{sumAmount()}}
                <el-input v-model="form.amount" readonly placeholder="请先输入下面费用明细；自动求和！"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预借款项：" prop="item">
                <el-input v-model="form.item" placeholder="只能输入数字，小数点后最多两位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实付金额：" prop="actualPay">
                <el-input v-model="form.actualPay" placeholder="总计金额-预借款项"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起止日期：">
                <el-date-picker
                  v-model="form.beginDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择开始日期">
                </el-date-picker>
                至
                <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地：" prop="targetSite">
                <el-input v-model="form.targetSite"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出差人：" prop="travelerIds">
                <el-select v-model="form.travelerIds" filterable multiple value-key="item.uId" placeholder="选择人员，可多选" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.uName"
                    :value="item.uId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总人数：" >
                <el-input v-model="form.peopleNumber" readonly placeholder="由选择出差人数自动求得。"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>交通明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="trafficData" 
          show-summary  :summary-method="getSummariesTraffice"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in trafficHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'trafficTypeId'">
                  <el-select v-model="scope.row.trafficTypeId" placeholder="请选择工具类型" style="width: 100%;">
                    <el-option
                      v-for="item in trafficTypeList"
                      :key="item.value"
                      :label="item.cnInfo"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div v-else-if="header.prop == 'itemDate'">
                  <el-date-picker
                    v-model="scope.row.itemDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-else-if="header.prop == 'traveler'">
                  <el-input v-model="scope.row.traveler"></el-input>
                </div>
                <div v-else-if="header.prop == 'startSite'">
                  <el-input v-model="scope.row.startSite"></el-input>
                </div>
                <div v-else-if="header.prop == 'endSite'">
                  <el-input v-model="scope.row.endSite"></el-input>
                </div>
                <div v-else-if="header.prop == 'amount'">
                  <!--<el-input v-model="scope.row.amount"></el-input>-->
                  <el-input-number v-model="scope.row.amount" controls-position="right" style="width:100px;" :min="0" @change="calcPrice(scope.row.amount, scope.$index, 'trafficData', 'amount')" @blur="calcPrice(scope.row.amount, scope.$index, 'trafficData', 'amount')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="60">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addTrafficItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {trafficData.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>住宿明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="stayData" 
          show-summary :summary-method="getSummariesStay"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listStay" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'beginDate'">
                  <el-date-picker
                    v-model="scope.row.beginDate"
                    type="date"
                    @change="calcDays(scope.row.beginDate, scope.row.endDate, scope.$index, stayData, scope.row, 'stayData')"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-if="header.prop == 'endDate'">
                  <el-date-picker
                    v-model="scope.row.endDate"
                    type="date"
                    @change="calcDays(scope.row.beginDate, scope.row.endDate, scope.$index, stayData, scope.row, 'stayData')"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-if="header.prop == 'cityLevel'">
                  <el-select v-model="scope.row.cityLevel" placeholder="请选择城市类别" style="width: 100%;">
                    <el-option
                      v-for="item in cityLevelList"
                      :key="item.value"
                      :label="item.cnInfo"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div v-if="header.prop == 'residents'">
                  <!--<el-input v-model="scope.row.residents"></el-input>-->
                  <el-input-number v-model="scope.row.residents" controls-position="right" style="width:100px;" :min="0"></el-input-number>
                </div>
                <div v-if="header.prop == 'amount'">
                  <el-input-number v-model="scope.row.amount" controls-position="right" style="width:100px;" :min="0" @change="calcTotalAmount(scope.row, scope.$index, stayData),calcPrice(scope.row.amount, scope.$index, 'stayData', 'amount')" @blur="calcTotalAmount(scope.row, scope.$index, stayData),calcPrice(scope.row.amount, scope.$index, 'stayData', 'amount')"></el-input-number>
                  <!--<el-input v-model="scope.row.amount" @blur="calcTotalAmount(scope.row, scope.$index, stayData)"></el-input>-->
                </div>
                <div v-if="header.prop == 'roomNum'">
                  <el-input-number v-model="scope.row.roomNum" @change="calcTotalAmount(scope.row, scope.$index, stayData)"  @blur="calcTotalAmount(scope.row, scope.$index, stayData)" style="width:100px;" controls-position="right" :min="0"></el-input-number>
                </div>
                <div v-if="header.prop == 'days'">
                  <el-input-number v-model="scope.row.days" @change="calcTotalAmount(scope.row, scope.$index, stayData)" @blur="calcTotalAmount(scope.row, scope.$index, stayData)" style="width:100px;" controls-position="right" :min="0"></el-input-number>
                </div>
                <div v-if="header.prop == 'totalAmount'">
                  {{parseFloat(scope.row.amount*scope.row.roomNum*scope.row.days).toFixed(2)}}
                  <!--<el-input v-model="scope.row.totalAmount"></el-input>-->
                  <!-- <el-input-number v-model="scope.row.totalAmount" @blur="calcPrice(scope.row.totalAmount, scope.$index, 'stayData', 'totalAmount')" controls-position="right" :min="0"></el-input-number> -->
                </div>
                <div v-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="60">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addStayItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {stayData.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">4</span>餐费明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="mealData" 
          show-summary 
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listMeal" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'day'">
                  <el-date-picker
                    v-model="scope.row.day"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-if="header.prop == 'amount'">
                  <!--<el-input v-model="scope.row.amount" @blur="calcMealTotal(scope.row, scope.$index, mealData)"></el-input>-->
                  <el-input-number v-model="scope.row.amount" controls-position="right"  :min="0" @change="calcMealTotal(scope.row, scope.$index, mealData),calcPrice(scope.row.amount, scope.$index, 'mealData', 'amount')"  @blur="calcMealTotal(scope.row, scope.$index, mealData),calcPrice(scope.row.amount, scope.$index, 'mealData', 'amount')"></el-input-number>
                </div>
                <div v-if="header.prop == 'subsidyAmount'">
                  <el-input-number v-model="scope.row.subsidyAmount" controls-position="right"  :min="0" @change="calcMealTotal(scope.row, scope.$index, mealData),calcPrice(scope.row.subsidyAmount, scope.$index, 'mealData', 'subsidyAmount')" @blur="calcMealTotal(scope.row, scope.$index, mealData),calcPrice(scope.row.subsidyAmount, scope.$index, 'mealData', 'subsidyAmount')"></el-input-number>
                </div>
                <div v-if="header.prop == 'totalAmount'">
                  {{scope.row.amount + scope.row.subsidyAmount}}
                </div>
                <div v-if="header.prop == 'remarks'">
                  {{scope.row.remarks}}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="60">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addMealItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {mealData.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">5</span>补贴明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="subsidyData" 
          show-summary :summary-method="getSummariesSubsidy"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listSubsidy" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'beginDate'">
                  <el-date-picker
                    v-model="scope.row.beginDate"
                    @change="calcDays(scope.row.beginDate, scope.row.endDate, scope.$index, subsidyData, scope.row, 'subsidyData')"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-if="header.prop == 'endDate'">
                  <el-date-picker
                    v-model="scope.row.endDate"
                    type="date"
                    @change="calcDays(scope.row.beginDate, scope.row.endDate, scope.$index, subsidyData, scope.row, 'subsidyData')"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-if="header.prop == 'days'">
                  <!--<el-input v-model="scope.row.days" @change="calcSubsidyTotal(scope.row, scope.$index, subsidyData)"></el-input>-->
                  <el-input-number v-model="scope.row.days" :min="0"  controls-position="right" style="width:100px;" @change="calcSubsidyTotal(scope.row, scope.$index, subsidyData),calcPrice(scope.row.days, scope.$index, 'subsidyData', 'days')"   @blur="calcSubsidyTotal(scope.row, scope.$index, subsidyData),calcPrice(scope.row.days, scope.$index, 'subsidyData', 'days')"></el-input-number>
                </div>
                <div v-if="header.prop == 'subsidyAmount'">
                  <el-input-number v-model="scope.row.subsidyAmount" controls-position="right" style="width:100px;" :min="0" @change="calcSubsidyTotal(scope.row, scope.$index, subsidyData),calcPrice(scope.row.subsidyAmount, scope.$index, 'subsidyData', 'subsidyAmount')" @blur="calcSubsidyTotal(scope.row, scope.$index, subsidyData),calcPrice(scope.row.subsidyAmount, scope.$index, 'subsidyData', 'subsidyAmount')"></el-input-number>
                </div>
                <div v-if="header.prop == 'otherSubsidyAmount'">
                  <el-input-number v-model="scope.row.otherSubsidyAmount" controls-position="right" style="width:100px;" :min="0" @change="calcSubsidyTotal(scope.row, scope.$index, subsidyData),calcPrice(scope.row.otherSubsidyAmount, scope.$index, 'subsidyData', 'otherSubsidyAmount')" @blur="calcSubsidyTotal(scope.row, scope.$index, subsidyData),calcPrice(scope.row.otherSubsidyAmount, scope.$index, 'subsidyData', 'otherSubsidyAmount')"></el-input-number>
                </div>
                <div v-if="header.prop == 'totalAmount'">
                   {{(parseInt(scope.row.days)*parseFloat(scope.row.subsidyAmount+scope.row.otherSubsidyAmount)).toFixed(2)}}
                  <!-- <el-input-number v-model="scope.row.totalAmount" :min="0" @blur="calcPrice(scope.row.totalAmount, scope.$index, 'subsidyData', 'totalAmount')"></el-input-number> -->
                </div>
                <div v-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="60">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addSubSidyItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {subsidyData.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">6</span>其他明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="otherData" 
          show-summary :summary-method="getSummariesOther"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listOther" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'day'">
                  <el-date-picker
                    v-model="scope.row.day"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div v-else-if="header.prop == 'name'">
                  <el-input v-model="scope.row.name"></el-input>
                </div>
                <div v-else-if="header.prop == 'amount'">
                  <!--<el-input v-model="scope.row.amount" @blur="calcOtherTotalAmount(scope.row, scope.$index, otherData)"></el-input>-->
                  <el-input-number v-model="scope.row.amount" controls-position="right" style="width:100px;"  :min="0" @change="calcOtherTotalAmount(scope.row, scope.$index, otherData),calcPrice(scope.row.amount, scope.$index, 'otherData', 'amount')" @blur="calcOtherTotalAmount(scope.row, scope.$index, otherData),calcPrice(scope.row.amount, scope.$index, 'otherData', 'amount')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'num'">
                  <el-input-number v-model="scope.row.num"  controls-position="right" style="width:100px;"  :min="0" @change="calcOtherTotalAmount(scope.row, scope.$index, otherData),calcPrice(scope.row.num, scope.$index, 'otherData', 'num')" @blur="calcOtherTotalAmount(scope.row, scope.$index, otherData),calcPrice(scope.row.num, scope.$index, 'otherData', 'num')"></el-input-number>
                </div>
                <div v-else-if="header.prop == 'totalAmount'">
                  {{parseFloat(scope.row.amount*scope.row.num).toFixed(2)}}
                  <!-- <el-input-number v-model="scope.row.totalAmount" :min="0" @blur="calcPrice(scope.row.totalAmount, scope.$index, 'otherData', 'totalAmount')"></el-input-number> -->
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="60">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addOtherItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {otherData.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <p class="step-title"><span class="step-icon">7</span>流程设置：</p>
        <div class="dash-content" style="padding: 0 20px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批流程：" prop="approvalProcessId">
                <el-select v-model="form.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
        <p class="step-title"><span class="step-icon">7</span>单据上传：</p>
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
       
        <!-- 打印内容结束 -->
        <div class="footer m10">
          <el-button type="primary" size="medium" @click="goHref()">返 回</el-button>
          <el-button type="primary" size="medium" @click="submitForm('form', 0)">提 交</el-button>
          <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitForm('form', 1)">提交后继续创建</el-button>
        </div>
        <div style="clear: both"></div>
      </div>
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
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    name:'TravelApply',
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
        fileTypeList:[],
        tableHeaderAttachments: [{
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, 
         {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          width: '200',
          show: true
        },
        ],
        //图片预览
        isShowDialogImg:false,
        pictures:null,

        operate: '',
        type: '',
        removedAll: false,
        form: {
          travelerIds:[],
          peopleNumber:'',
          projectCode:projectCode?projectCode:'',
          orgName: '',
          positionName: '',
          approvalProcessId: '',
          applyAttachmentReqs: []
        },
        //sumAmount:0,  //合计数量
        /** 表格 loading */
        listLoading: false,
        rules: {
          approvalProcessId: [
            {required: true, message: "请选择审批流程", trigger: "change"}
          ],
          applyer: [
            { required: true, message: '不为空', trigger: 'change' },
          ],
          'item': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          'amount': [
            { required: true, message: '请先输入下面费用明细；自动求和！', trigger: 'change' },
            // { pattern: /^\d+(\.\d{1,2})?$/, message: '请先输入下面费用明细；自动求和！' }
          ],
          travelerIds:[
             { required: true, message: '请选择出差人数', trigger: 'change' },
          ],
          'peopleNumber': [
            { required: true, message: '请填写人数', trigger: 'change' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'projectCode': [
            { required: false, message: '不为空', trigger: 'blur' },
          ],
          'loanApplyId': [
            { required: false, message: '不为空', trigger: 'blur' },
          ],
        },
        trafficData: [],
        stayData: [],
        mealData: [],
        subsidyData: [],
        otherData: [],

        /** 项目列表 */
        projectList: [],
        /** 借款列表 */
        borrowList: [],
        /** 人员列表 */
        userList: [],
        shenPiList: [],
        //明细合计
        trafficeAmount:0,
        stayAmount:0,
        mealAmount:0,
        subsidyAmount:0,
        othersAmount:0,
        trafficHeader: [
          {prop: 'trafficTypeId', label: '工具类型', align: 'center', show: true},
          {prop: 'itemDate', label: '日期', align: 'center', show: true},
          {prop: 'traveler', label: '人员', align: 'center', show: true},
          {prop: 'startSite', label: '起点', align: 'center', show: true},
          {prop: 'endSite', label: '终点', align: 'center', show: true},
          {prop: 'amount', label: '票价', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listStay: [
          {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
          {prop: 'endDate', label: '结束日期', align: 'center', show: true},
          {prop: 'cityLevel', label: '类别', align: 'center', show: true},
          {prop: 'residents', label: '住宿人数', align: 'center', show: true},
          {prop: 'amount', label: '单价', align: 'center', show: true},
          {prop: 'roomNum', label: '房间数', align: 'center', show: true},
          {prop: 'days', label: '天数', align: 'center', show: true},
          {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listMeal: [
          {prop: 'day', label: '日期', align: 'center', show: true},
          {prop: 'amount', label: '金额', align: 'center', show: true},
          {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
          {prop: 'totalAmount', label: '金额合计', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listSubsidy: [
          {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
          {prop: 'endDate', label: '结束日期', align: 'center', show: true},
          {prop: 'days', label: '合计天数', align: 'center', show: true},
          {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
          {prop: 'otherSubsidyAmount', label: '其他补贴', align: 'center', show: true},
          {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listOther: [
          {prop: 'day', label: '日期', align: 'center', show: true},
          {prop: 'name', label: '名称', align: 'center', show: true},
          {prop: 'amount', label: '单价', align: 'center', show: true},
          {prop: 'num', label: '数量', align: 'center', show: true},
          {prop: 'totalAmount', label: '总价', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        trafficTypeList: [],
        cityLevelList: [],
        fileList: [],
        approvalDetails:null,
         approvalIndex:1,
      }
    },
    watch: {
      
      'trafficData':{
         
         handler:function(){

           this.sumAmount()
          },
          deep:true
       },
       'stayData':{
         
         handler:function(){

           this.sumAmount()
          },
          deep:true
       },
      
      'mealData':function(){
          this.sumAmount()
      },
      'subsidyData':function(){
          this.sumAmount()
      },
      'otherData':function(){
          this.sumAmount()
      },
      'form.travelerIds':function(val,newValue){
        const len = this.form.travelerIds.length
         if(len>0){
             this.form.peopleNumber = len;
         }
       
      },
      'form.amount': function () {
        if (this.form.item ) {
          this.form.actualPay = parseFloat(this.form.amount) - parseFloat(this.form.item)
        } else {
          this.form.actualPay = parseFloat(this.form.amount)
        }
      },
      'form.item': function () {
        if (this.form.item) {
          if (this.form.amount) {
            this.form.actualPay = parseFloat(this.form.amount) - parseFloat(this.form.item)
          } else {
            this.form.actualPay = parseFloat(this.form.item)
          }

        } else {
          if (this.form.amount) {
            this.form.actualPay = parseFloat(this.form.amount)
          }
        }

      }
    },
    mounted () {
       this.operate = this.$route.query.id ?  'edit' : 'add'
      // 获取字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.TrafficType) {
          this.trafficTypeList = distsObj.TrafficType.children
        }
        if (distsObj.CityLevel) {
          this.cityLevelList = distsObj.CityLevel.children
        }
      }
      // 项目列表
      this.remoteMethod('')
      // Api.allProjects({}).then(data => {
      //   if (data) {
      //     this.projectList = data;
      //   }
      // })
      Api.loanPage({pageNum: 1, pageSize: 50000}).then(data => {
        if (data) {
          this.borrowList = data.records;
        }
      });
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
      Api.approvalList({category: '0'}).then(data => {
        if (data) {
          this.shenPiList = data;
        }
      })
     
      if (this.operate === 'edit') {
        this.loadData()
      }
    },
    methods: {
       getAmountNum(arr,attr){
          const values = arr.map(item => Number(item[attr]));
          if (!values.every(value => isNaN(value))) {
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
        const trafficeAmount = this.getAmountNum(this.trafficData,'amount')
        const stayAmount = this.getAmountNum(this.stayData,'totalAmount')
        const mealAmount = this.getAmountNum(this.mealData,'totalAmount')
        const subsidyAmount = this.getAmountNum(this.subsidyData,'totalAmount')
        const othersAmount = this.getAmountNum(this.otherData,'totalAmount')
        
        
        const amount =  parseFloat(trafficeAmount+stayAmount+mealAmount+subsidyAmount+othersAmount).toFixed(2)
        this.form.amount = amount;
        console.log(amount,'amount')
      },
      //交通合计
      getSummariesTraffice(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && column.property =='amount' ) {
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
      //住宿明细
      getSummariesStay(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='days'  
          || column.property =='residents' || column.property =='roomNum' || column.property =='amount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(column.property=='totalAmount'){
              sums[index] = sums[index].toFixed(2)
            }
            
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      //补贴明细
      getSummariesSubsidy(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='days'  || column.property =='subsidyAmount' || column.property =='otherSubsidyAmount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           if(column.property=='totalAmount'){
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
      //其他明细
      getSummariesOther(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='num'  || column.property =='amount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           if(column.property=='totalAmount'){
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
      remoteMethod(query) {
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
      /**
       * 加载
       */
      loadData () {
        Api.travelDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            let _this = this
            this.form = res
            this.form.beginDate = this.formartDate(res.beginDate)
            this.form.endDate = this.formartDate(res.endDate)
            if (res.travelerIds) {
              this.form.travelerIds = res.travelerIds
            }
            if (res.travelTrafficDetails) {
              this.trafficData = res.travelTrafficDetails
              this.trafficData.forEach(function (item) {
                item.itemDate = _this.formartDate(item.itemDate)
              })
            }
            if (res.travelHotelDetails) {
              this.stayData = res.travelHotelDetails
              this.stayData.forEach(function (item) {
                item.beginDate = _this.formartDate(item.beginDate)
                item.endDate = _this.formartDate(item.endDate)
              })
            }
            if (res.travelMealsDetails) {
              this.mealData = res.travelMealsDetails
              this.mealData.forEach(function (item) {
                item.day = _this.formartDate(item.day)
              })
            }
            if (res.travelSubsidyDetails) {
              this.subsidyData = res.travelSubsidyDetails
              this.subsidyData.forEach(function (item) {
                item.beginDate = _this.formartDate(item.beginDate)
                item.endDate = _this.formartDate(item.endDate)
              })
            }
            if (res.travelOtherDetails) {
              this.otherData = res.travelOtherDetails
              this.otherData.forEach(function (item) {
                item.day = _this.formartDate(item.day)
              })
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
      },
      calcPrice(value, index, tag, key) {
        if (tag === 'trafficData') {
          this.trafficData[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'stayData') {
          this.stayData[index][key] = parseFloat(value).toFixed(2)

        }
        if (tag === 'mealData') {
          this.mealData[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'subsidyData') {
          this.subsidyData[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'otherData') {
          this.otherData[index][key] = parseFloat(value).toFixed(2)
        }
      },
      /**
       * 计算两个日期相差的天数
       * */
      calcDays (firstDate, secondDate, index, listData, item, tag){
        if (firstDate && secondDate) {
            //sDate1和sDate2是2006-12-18格式
           var dateSpan, iDays;
          firstDate = Date.parse(firstDate);
          secondDate = Date.parse(secondDate);
          dateSpan = secondDate - firstDate;
          dateSpan = Math.abs(dateSpan);
          iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
         
          if (tag === 'stayData') {
             listData[index].days = iDays
            this.calcTotalAmount(item, index, listData)
            
          } else {
            listData[index].days = iDays + 1
            this.calcSubsidyTotal(item, index, listData)
             
          }

        }
      },
      /**
       * 住宿管理计算总金额
       * */
      calcTotalAmount(item, index, stayData) {
        if ((item.amount || item.amount === 0) && (item.roomNum || item.roomNum === 0) && (item.days || item.days === 0)) {
          stayData[index].totalAmount =  (parseFloat(item.amount) *  parseInt(item.roomNum) * parseFloat(item.days)).toFixed(2)
        }
      },
      /** 餐费管理计算总金额 */
      calcMealTotal(item, index, mealData) {
        if ((item.subsidyAmount || item.subsidyAmount === 0 ) && (item.amount || item.amount === 0 ) ) {
          mealData[index].totalAmount = (parseFloat(item.subsidyAmount) + parseFloat(item.amount)).toFixed(2)
        }
      },
      /** 计算补贴总金额 */
      calcSubsidyTotal(item, index, subsidyData) {
        if ((item.days || item.days === 0 ) && (item.subsidyAmount || item.subsidyAmount === 0 ) && (item.otherSubsidyAmount || item.otherSubsidyAmount === 0 )) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if ((item.days || item.days === 0 ) && (item.subsidyAmount || item.subsidyAmount === 0 ) && !item.otherSubsidyAmount) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if ((item.subsidyAmount || item.subsidyAmount === 0 ) && !item.days && !item.otherSubsidyAmount) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if (!item.subsidyAmount && !item.days && (item.otherSubsidyAmount || item.otherSubsidyAmount === 0 )) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if (!item.days && (item.subsidyAmount || item.subsidyAmount === 0 ) && (item.otherSubsidyAmount || item.otherSubsidyAmount === 0 )) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
      },
      /** 计算其他总金额 */
      calcOtherTotalAmount(item, index, otherData){
        if ((item.amount || item.amount === 0 ) && (item.num || item.num === 0 )) {
          otherData[index].totalAmount = (parseFloat(item.amount) * parseFloat(item.num)).toFixed(2)
        }
      },
      addTrafficItem () {
        let newItem = {
          trafficTypeId: '',
          itemDate: '',
          traveler: '',
          startSite: '',
          endSite: '',
          amount: '',
          remarks: ''
        }
        this.trafficData.push(newItem)
      },
      addStayItem () {
        let newItem = {
          beginDate: '',
          endDate: '',
          cityLevel: '',
          residents: '',
          amount: '',
          roomNum: '',
          days: '',
          totalAmount: '',
          remarks: ''
        }
        this.stayData.push(newItem)
      },
      addMealItem () {
        let newItem = {
          day: '',
          amount: '',
          subsidyAmount: '',
          totalAmount: ''
        }
        this.mealData.push(newItem)
      },
      addSubSidyItem () {
        let newItem = {
          beginDate: '',
          endDate: '',
          days: '',
          subsidyAmount: '',
          otherSubsidyAmount: '',
          totalAmount: '',
          remarks: ''
        }
        this.subsidyData.push(newItem)
      },
      addOtherItem () {
        let newItem = {
          day: '',
          name: '',
          amount: '',
          num: '',
          totalAmount: '',
          remarks: ''
        }
        this.otherData.push(newItem)
      },
      selectUser (item) {
        this.form.orgName = item.orgName
        this.form.positionName = item.positionName
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
            // 交通明细
            let _this = this
            if (this.trafficData.length > 0) {
              this.form.travelTrafficDetailReqs = this.trafficData
            }
            // 住宿明细
            if (this.stayData.length > 0) {
              this.form.travelHotelDetailReqs = this.stayData
            }
            // 餐费明细
            if (this.mealData.length > 0) {
              this.form.travelMealsDetailReqs = this.mealData
            }
            // 补贴明细
            if (this.subsidyData.length > 0) {
              this.form.travelSubsidyDetailReqs = this.subsidyData
            }
            // 其他明细
            if (this.otherData.length > 0) {
              this.form.travelOtherDetailReqs = this.otherData
            }
            if (this.fileList.length > 0) {
              _this.form.applyAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.form.applyAttachmentReqs.push({
                  name: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.applyAttachmentReqs = []
              }
            }
            if (this.operate === 'edit') {
              delete this.form['travelTrafficDetails']
              delete this.form['travelHotelDetails']
              delete this.form['travelMealsDetails']
              delete this.form['travelSubsidyDetails']
              delete this.form['travelOtherDetails']
              delete this.form['attached']
              delete this.form['applyAttachments']
              Api.updateTravel(this.form).then(res => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '差旅申请修改成功'
                  })
                }
                this.goHref()
              });
            } else {
              Api.addTravel(this.form).then(res => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '差旅申请添加成功'
                  })
                }
                if (i === 1) {
                  this.form = {
                    travelerIds:[],
                    peopleNumber:'',
                    orgName: '',
                    positionName: '',
                    approvalProcessId: '',
                    actualPay: '',
                    applyAttachmentReqs: []
                  }
                  this.trafficData = []
                  this.stayData = []
                  this.mealData = []
                  this.subsidyData = []
                  this.otherData = []
                  this.removedAll = false
                } else {
                  this.goHref()
                }

              });
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
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
            this.$router.push({path: '/router/travelManagement'})
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
      //       this.$router.push({path: '/router/travelManagement'})
      //     }
      // },
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
