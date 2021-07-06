<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="140px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">基本信息
          <div class="line"></div>
        </div>
        <div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：" prop="taskInfoReq.projectCode">
                <el-select filterable v-model="form.taskInfoReq.projectCode" 
                remote :remote-method="remoteMethod" clearable placeholder="项目名称/编号/客户名称"
                :disabled="this.$route.query.type === 'budget' || this.$route.query.type === 'exBudget'" 
                @change="selectProject"  size="medium" style="width: 100%;">
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectName"
                    :value="item.projectCode">
                    <span style="float: left">{{ item.projectName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编码：">
                <el-input v-model="form.taskInfoReq.projectCode" style="width: 100%;" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="任务级别标准：" prop="taskInfoReq.level">
                <el-select filterable v-model="form.taskInfoReq.level" clearable placeholder="级别标准" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in taskLevelList"
                             :key="index"
                             :label="item.cnInfo"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="任务名称：" prop="taskInfoReq.name">
                <el-input v-model="form.taskInfoReq.name" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="任务类型：" prop="taskInfoReq.type">
                <el-select filterable v-model="form.taskInfoReq.type" placeholder="任务类型" size="medium"
                           style="width: 100%;">
                  <el-option v-for="(item, index) in taskTypeList" @click.native="selectTaskType(item)"
                             :key="index"
                             :label="item.cnInfo"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--只有预算任务才显示预算组-->
            <el-col :span="8" v-if="isBudget">
              <el-form-item label="预算组：" prop="taskInfoReq.budgetGroupId">
                <el-select filterable v-model="form.taskInfoReq.budgetGroupId" clearable placeholder="选择预算组" size="medium" style="width: 100%;">
                  <el-option v-for="item in budgetGroupList" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!--只有外勤任务和外勤预算任务才显示供应商-->
            <el-col :span="8" >
              <el-form-item label="货物包装类型：" v-if="taskTypeName.indexOf('非保税入库') !== -1">
                <el-select filterable v-model="goodsType" placeholder="选择货物录入类型" size="medium" style="width: 100%;">
                  <el-option v-for="item in goodsTypeList" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="供应商：" v-if="taskTypeName.indexOf('外勤') !== -1">
                <el-select filterable v-model="supplierId" placeholder="选择供应商" size="medium" style="width: 100%;">
                  <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="进出类型：" v-if="taskTypeName.indexOf('报关') !== -1">
                <el-select filterable v-model="form.workCustomsTaskReq.type" placeholder="选择进出类型" size="medium" style="width: 100%;">
                  <el-option v-for="item in importExportType" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="完成时间：" prop="completeTime">
                <el-date-picker type="datetime" placeholder="完成时间" v-model="form.taskInfoReq.completionDate"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="执行部门：" prop="taskInfoReq.orgId" v-if="!(taskTypeValue === '013' || taskTypeValue === '014')">
                <el-select filterable v-model="form.taskInfoReq.orgId" placeholder="执行部门" size="medium"
                           style="width: 100%;">
                  <el-option :value="orgId" :label="orgName" style="height: 300px;overflow-y: scroll;padding: 0">
                    <el-tree
                      :data="treeData"
                      default-expand-all
                      show-checkbox
                      node-key="orgId"
                      ref="orgTree"
                      :props="{label: 'orgName', children: 'childrens'}"
                      :check-strictly="true"
                      @check-change="handleClick"
                      @node-click="nodeClick">
                    </el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" prop="">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="任务描述：" prop="taskDesc">
                <el-input
                  style="width: 100%"
                  type="textarea"
                  :rows="4"
                  maxlength="10000"
                  placeholder="请输入任务描述，10000字以内"
                  v-model="form.taskInfoReq.describe" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">任务内容
          <div class="line"></div>
        </div>
        <div>
          <template  v-if="isOpenGoodsPackage || goodsType==='1'">
             <span>包装箱信息：</span>
              <el-row class="m10">
                <el-button type="primary" size="small" @click="() => {dialogVisible1 = true;boxType='out'}">添加包装箱</el-button>
              </el-row>
              <el-table class="page-table" :data="boxData" style="width: 100%" :cell-style="{color:'#333'}">
                <el-table-column prop="packageBoxSn" label="包装箱号"></el-table-column>
                <el-table-column prop="count" label="数量"></el-table-column>
                <el-table-column prop="insidePackageCount" label="箱内件数"></el-table-column>
                <el-table-column prop="weight" label="毛重（kg）" width="120"></el-table-column>
                <el-table-column prop="volumeWeight" label="体积"></el-table-column>
                <el-table-column prop="remarks" label="备注"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope" fixed="right">
                    <el-button type="primary" size="mini" @click="boxData.splice(scope.$index, 1)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </template>
         
          <!--货物信息-->
          <div class="m10" v-if="isOpenGoodsPackage || goodsType==='0'">
            <span>货物信息：</span>
            <el-row class="m10">
              <el-button type="primary" size="small" @click="() => {dialogVisible2 = true}">添加货物</el-button>
            </el-row>
            <el-table v-if="projectType !== '1'" :data="goodsData" stripe highlight-current-row v-loading="listLoading"
                      :cell-style="{color:'#333'}" style="width: 100%">
              <el-table-column type="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="name" label="货物名称"></el-table-column>
              <el-table-column prop="partNumber" label="件号"></el-table-column>
              <el-table-column prop="number" label="数量"></el-table-column>
              <el-table-column prop="grossWeight" label="毛重" width="120"></el-table-column>
              <el-table-column prop="placeConsigned" label="起运地" width="120"></el-table-column>
              <el-table-column prop="destination" label="目的地" width="120"></el-table-column>
              <el-table-column prop="contractId" label="合同号"></el-table-column>
              <el-table-column prop="separateOddNumber" label="分单单号" v-if="projectType=== '3'"></el-table-column>
              <el-table-column prop="dangerous" label="危险品标识" v-if="projectType=== '3'" width="120"></el-table-column>
              <el-table-column prop="packageType" label="包装类型" v-if="projectType=== '3'"></el-table-column>
              <el-table-column prop="currency" label="合同金额" v-if="projectType=== '3'"></el-table-column>
              <el-table-column prop="price" label="协议价格"></el-table-column>
              <el-table-column prop="length" label="长"></el-table-column>
              <el-table-column prop="width" label="宽"></el-table-column>
              <el-table-column prop="height" label="高"></el-table-column>
              <el-table-column prop="contacts" label="联系人"></el-table-column>
              <el-table-column prop="contactsTel" label="联系电话"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="goodsData.splice(scope.$index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-else :data="goodsData" stripe highlight-current-row v-loading="listLoading"
                      :cell-style="{color:'#333'}"  style="width: 100%">
              <el-table-column type="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="name" label="作品名称"></el-table-column>
              <el-table-column prop="author" label="作者"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="size" label="展品尺寸(cm)" width="120"></el-table-column>
              <el-table-column prop="dimensions" label="包装尺寸(cm)" width="120"></el-table-column>
              <el-table-column prop="netWeight" label="净重(kg)" width="120"></el-table-column>
              <el-table-column prop="material" label="材质"></el-table-column>
              <el-table-column prop="age" label="创作年代"></el-table-column>
              <el-table-column prop="number" label="数量(幅/件)" width="120"></el-table-column>
              <el-table-column prop="photograph" label="图片"></el-table-column>
              <el-table-column prop="valuation" label="估值(RMB)" width="120"></el-table-column>
              <el-table-column prop="collection" label="收藏单位"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope" fixed="right">
                  <el-button type="primary" size="mini" @click="goodsData.splice(scope.$index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--内部包装信息-->
          <div class="m10" v-if="!(taskTypeName == '包装任务' || taskTypeName == '包装预算任务' || goodsType==='0' || goodsType==='1')">
            <span>内部包装信息：</span>
            <el-row class="m10">
              <el-button type="primary" size="small" @click="() => {dialogVisible1 = true;boxType='inner'}">添加内部包装箱</el-button>
            </el-row>
            <el-table class="page-table" :data="innerBoxData" style="width: 100%" :cell-style="{color:'#333'}">
              <el-table-column prop="packageBoxSn" label="包装箱号"></el-table-column>
              <el-table-column prop="count" label="数量"></el-table-column>
              <el-table-column prop="insidePackageCount" label="箱内件数"></el-table-column>
              <el-table-column prop="weight" label="毛重（kg）" width="120"></el-table-column>
              <el-table-column prop="volumeWeight" label="体积重量"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope" fixed="right">
                  <el-button type="primary" size="mini" @click="innerBoxData.splice(scope.$index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--任务内容：外勤任务有-->
          <div class="m10" v-if="taskTypeName.indexOf('外勤') !== -1 && taskTypeName !== '外勤综合任务'">
            <span>任务内容：</span>
            <el-table class="page-table" :data="contentData" stripe highlight-current-row :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column v-for="(header, index) in contentHeader" v-if="header.show" :key="index"
                               :prop="header.prop" :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'operationDt'">
                    <el-date-picker style="width:100%"
                                    v-model="scope.row.operationDt"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="操作时间">
                    </el-date-picker>
                  </div>
                  <div v-else-if="header.prop == 'place'">
                    <el-input v-model="scope.row.place"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'content'">
                    <el-input v-model="scope.row.content"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'tool'">
                    <el-input v-model="scope.row.tool"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'material'">
                    <el-input v-model="scope.row.material"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'remarks'">
                    <el-input v-model="scope.row.remarks"></el-input>
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column align="left" width="100" fixed="right">
                <template slot="header" slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addContent()"></el-button>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-minus"
                    @click="contentData.splice(scope.$index, 1)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--报关离港到港信息-->
          <div class="m10" v-if="taskTypeName.indexOf('报关') !== -1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="预计离港时间：">
                  <el-date-picker type="datetime" placeholder="预计离港时间" v-model="form.workCustomsTaskReq.departureDt"
                                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计到港时间：" prop="gradeStandard">
                  <el-date-picker type="datetime" placeholder="预计到港时间"  v-model="form.workCustomsTaskReq.arrivalDt"
                                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="启运港：" >
                  <el-input v-model="form.workCustomsTaskReq.departurePort"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目的港：" prop="arrivalPort">
                  <el-input v-model="form.workCustomsTaskReq.arrivalPort"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国际运单号：" prop="internationalCode">
                  <el-input v-model="form.workCustomsTaskReq.internationalCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目时效等级：" prop="projectLevel">
                  <el-select filterable v-model="form.workCustomsTaskReq.level" clearable placeholder="项目时效等级" size="medium"
                             style="width: 100%;">
                    <el-option key="001" label="一级" value="001"></el-option>
                    <el-option key="002" label="二级" value="002"></el-option>
                    <el-option key="003" label="三级" value="003"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输线路：" prop="line">
                  <el-input v-model="form.workCustomsTaskReq.line"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--批文-->
          <div class="m10" v-if="taskTypeName.indexOf('批文') !== -1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="预计到港时间：" prop="arrivalDt">
                  <el-date-picker type="datetime" placeholder="预计到港时间" v-model="form.workOfficialDocTaskReq.arrivalDt"
                                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计离港时间：" prop="departureDt">
                  <el-date-picker type="datetime" placeholder="预计离港时间" v-model="form.workOfficialDocTaskReq.departureDt"
                                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输线路：" prop="line">
                  <el-input v-model="form.workOfficialDocTaskReq.line"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--入库-->
          <div class="m10" v-if="taskTypeValue === '013'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="入库时间：" prop="actualTime">
                  <el-date-picker type="datetime" placeholder="入库时间" v-model="form.workHouseReq.actualTime"
                                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="件数：" prop="quantity">
                  <el-input v-model="form.workHouseReq.quantity"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="数量：" prop="number">
                  <el-input v-model="form.workHouseReq.number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量：" prop="weight">
                  <el-input v-model="form.workHouseReq.weight"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="特殊注意事项：" prop="specialPrecautions">
                  <el-input v-model="form.workHouseReq.specialPrecautions"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remarks">
                  <el-input type="textarea" :rows="3" maxlength="500" v-model="form.workHouseReq.remarks" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--出库-->
          <div class="m10" v-if="taskTypeValue === '014'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输线路：" prop="line">
                  <el-input v-model="form.workHouseReq.line"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="出库时间：" prop="actualTime">
                  <el-date-picker type="datetime" placeholder="出库时间" v-model="form.workHouseReq.actualTime"
                                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="件数：" prop="quantity">
                  <el-input v-model="form.workHouseReq.quantity"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="数量：" prop="number">
                  <el-input v-model="form.workHouseReq.number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量：" prop="weight">
                  <el-input v-model="form.workHouseReq.weight"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="特殊注意事项：" prop="specialPrecautions">
                  <el-input v-model="form.workHouseReq.specialPrecautions"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" :rows="3" maxlength="500" v-model="form.workHouseReq.remarks" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--航材-->
          <div class="m10" v-if="taskTypeName.indexOf('航材') !== -1">
            <div v-if="taskTypeName.indexOf('提货') !== -1">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="装货时间：" prop="loadGoodsTime">
                    <el-date-picker type="datetime" placeholder="装货时间" v-model="form.workMaterialTaskReq.loadingDt"
                                    value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="装货地点：" prop="loadingSite">
                    <el-input v-model="form.workMaterialTaskReq.loadingSite"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="装货联系人：" prop="loader">
                    <el-input v-model="form.workMaterialTaskReq.loader"></el-input>
                    <!-- <el-select filterable v-model="form.workMaterialTaskReq.loader" clearable @change="loaderTelChange"  allow-create  placeholder="请选择客户" style="width: 100%;">
                        <el-option
                          v-for="item in customerList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="卸货联系人：" prop="unloader">
                    <el-input v-model="form.workMaterialTaskReq.unloader"></el-input>
                    <!-- <el-select filterable v-model="form.workMaterialTaskReq.unloader" @change="unloaderTelChange" allow-create clearable  placeholder="请选择客户" style="width: 100%;">
                        <el-option
                          v-for="item in customerList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="装货人电话：" prop="workMaterialTaskReq.loaderTel">
                     <el-input v-model="form.workMaterialTaskReq.loaderTel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="卸货人电话：" prop="workMaterialTaskReq.unloaderTel">
                    <el-input v-model="form.workMaterialTaskReq.unloaderTel"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输线路：" prop="line">
                  <el-input v-model="form.workMaterialTaskReq.line"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" :rows="3" maxlength="500" v-model="form.workMaterialTaskReq.remarks" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--保险-->
          <div class="m10" v-if="taskTypeName.indexOf('保险') !== -1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输线路：" prop="line">
                  <el-input v-model="form.workInsuranceTaskReq.line"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--非保税入库-->
          <div class="mb10" v-if="taskTypeName.indexOf('非保税入库') !== -1">
          <!-- <div class="mb10"> -->
               <NobondedItem  :form="form"/>
          </div>
        </div>
        <div class="title" style="margin: 20px 0">附件上传
          <div class="line"></div>
        </div>
        <div style="padding: 0 20px;">
          <el-row>
            <el-col :span="10">
              <el-form-item label="附件上传：">
                <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="form.taskAttachmentReqs"></FileListMultiUpload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 1)">提 交</el-button>
        <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitForm('form', 2)">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
    <!--包装箱信息-->
    <el-dialog
      :close-on-click-modal="canClick"
      :title="boxType==='inner'? '内部包装箱信息': '包装箱信息'"
      :visible.sync="dialogVisible1"
      size="small" top="12vh" width="60%">
      <div>
        <el-table v-if="boxType==='out'" class="page-table" :data="boxInfoList" style="width: 100%" :cell-style="{color:'#333'}" @selection-change="(val) => {boxData = val}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="packageBoxSn" label="包装箱号"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="insidePackageCount" label="箱内件数"></el-table-column>
          <el-table-column prop="weight" label="毛重（kg）" width="120"></el-table-column>
          <el-table-column prop="volumeWeight" label="体积重量"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
        </el-table>
        <el-table v-if="boxType==='inner'" class="page-table" :data="boxInnerInfoList" style="width: 100%" :cell-style="{color:'#333'}" @selection-change="(val) => {innerBoxData = val}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="packageBoxSn" label="包装箱号"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="insidePackageCount" label="箱内件数"></el-table-column>
          <el-table-column prop="weight" label="毛重（kg）" width="120"></el-table-column>
          <el-table-column prop="volumeWeight" label="体积重量"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
        </el-table>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible1=false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogVisible1=false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!--货物信息-->
    <el-dialog
      title="货物信息"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible2"
      size="small" top="12vh" width="60%">
      <div>
        <el-table v-if="projectType !== '1'" :data="goodsList" stripe highlight-current-row v-loading="listLoading"
                  :cell-style="{color:'#333'}" style="width: 100%" @selection-change="(val) => {goodsData = val}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="货物名称"></el-table-column>
          <el-table-column prop="partNumber" label="件号"></el-table-column>
          <el-table-column prop="number" label="数量"></el-table-column>
          <el-table-column prop="grossWeight" label="毛重" width="120"></el-table-column>
          <el-table-column prop="placeConsigned" label="起运地" width="120"></el-table-column>
          <el-table-column prop="destination" label="目的地" width="120"></el-table-column>
          <el-table-column prop="contractId" label="合同号"></el-table-column>
          <el-table-column prop="separateOddNumber" label="分单单号" v-if="projectType=== '3'"></el-table-column>
          <el-table-column prop="dangerous" label="危险品标识" v-if="projectType=== '3'" width="120"></el-table-column>
          <el-table-column prop="packageType" label="包装类型" v-if="projectType=== '3'"></el-table-column>
          <el-table-column prop="currency" label="合同金额" v-if="projectType=== '3'"></el-table-column>
          <el-table-column prop="price" label="协议价格"></el-table-column>
          <el-table-column prop="length" label="长"></el-table-column>
          <el-table-column prop="width" label="宽"></el-table-column>
          <el-table-column prop="height" label="高"></el-table-column>
          <el-table-column prop="contacts" label="联系人"></el-table-column>
          <el-table-column prop="contactsTel" label="联系电话"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
        </el-table>
        <el-table v-else :data="goodsList" stripe highlight-current-row v-loading="listLoading"
                  :cell-style="{color:'#333'}" @selection-change="(val) => {goodsData = val}"  style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="作品名称"></el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="size" label="展品尺寸(cm)" width="120"></el-table-column>
          <el-table-column prop="dimensions" label="包装尺寸(cm)" width="120"></el-table-column>
          <el-table-column prop="netWeight" label="净重(kg)" width="120"></el-table-column>
          <el-table-column prop="material" label="材质"></el-table-column>
          <el-table-column prop="age" label="创作年代"></el-table-column>
          <el-table-column prop="number" label="数量(幅/件)" width="120"></el-table-column>
          <el-table-column prop="photograph" label="图片"></el-table-column>
          <el-table-column prop="valuation" label="估值(RMB)" width="120"></el-table-column>
          <el-table-column prop="collection" label="收藏单位"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
        </el-table>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible2=false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogVisible2=false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import NobondedItem from './NobondedItem'
  export default {
    components: {
      FileListMultiUpload,NobondedItem
    },
    computed:{
      //  'form.workMaterialTaskReq.loader'(){
      //     this.loadCustomerList(this.form.workMaterialTaskReq.loader)
      //   },
      //   'form.workMaterialTaskReq.unloader'(){
      //     this.loadCustomerList(thisform.workMaterialTaskReq.unloader)
      //   },
    },
    data () {
      return {
        isOpenGoodsPackage:true,
        goodsType:'0',
        goodsTypeList:[
          {
            cnInfo:'默认',
            value:'0',
          },
          {
            cnInfo:'包装箱',
            value:'1',
          },
          {
            cnInfo:'集装箱',
            value:'2',
          }
        ],
        canClick: false,
        fileList:[],
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
          detailIds: [],
          packagingInfoIds: [],
          nonBonded:{},
          // 任务附件
          taskAttachmentReqs: [],
          taskInfoReq: {
            orgId:'',
          },
          // 外勤任务内容
          workOutsideTaskReq: {},
          // 报关任务内容
          workCustomsTaskReq: {},
          // 保险任务
          workInsuranceTaskReq: {},
          // 批文任务
          workOfficialDocTaskReq: {},
          // 航材任务
          workMaterialTaskReq: {},
          // 出入库任务
          workHouseReq: {},
        },
        /** 表格 loading */
        listLoading: false,
        rules: {
          'goodsType':[{ required: true, message: '请选择货物包装类型', trigger: 'change' }],
          'taskInfoReq.projectCode': [
            { required: true, message: '请选择项目名称', trigger: 'blur' }
          ],
          'taskInfoReq.type': [{ required: true, message: '请选择任务类型', trigger: 'change' }
          ],
          'taskInfoReq.budgetGroupId': [{ required: true, message: '请选择预算组', trigger: 'change'}],
          'taskInfoReq.level': [{ required: true, message: '请选择任务级别类型', trigger: 'change' }
          ],
          'taskInfoReq.name': [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          'workHouseReq.quantity': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'workHouseReq.number': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'workHouseReq.weight': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'workMaterialTaskReq.loaderTel': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/, message: '请输入正确的手机号码' }
          ],
          'workMaterialTaskReq.unloaderTel': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/, message: '请输入正确的手机号码' }
          ],
          'taskInfoReq.orgId': [
            { required: true, message: '不为空', trigger: 'change' },
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
        contentHeader: [{
          prop: 'operationDt',
          label: '操作时间',
          show: true
        }, {
          prop: 'place',
          label: '地点',
          show: true
        }, {
          prop: 'content',
          label: '操作内容',
          show: true
        }, {
          prop: 'tool',
          label: '工具',
          show: true
        }, {
          prop: 'material',
          label: '材料',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          show: true
        }],
        goodsHeader: [{
          prop: 'no',
          label: '序号',
          width: '80',
          show: true
        }, {
          prop: 'name',
          align: 'center',
          label: '作品名称',
          show: true
        }, {
          prop: 'author',
          align: 'center',
          label: '作者',
          show: true
        }, {
          prop: 'type',
          align: 'center',
          label: '类型',
          show: true
        }, {
          prop: 'size',
          align: 'center',
          label: '展品尺寸（cm）',
          width: '140',
          show: true
        }, {
          prop: 'packageSize',
          align: 'center',
          label: '包装尺寸（cm）',
          width: '140',
          show: true
        }, {
          prop: 'netWeight',
          align: 'center',
          label: '净重（kg）',
          width: '120',
          show: true
        }, {
          prop: 'material',
          align: 'center',
          label: '材质',
          show: true
        }, {
          prop: 'createYear',
          align: 'center',
          label: '创作年代',
          show: true
        }, {
          prop: 'number',
          align: 'center',
          label: '数量（幅/件）',
          width: '120',
          show: true
        }, {
          prop: 'pic',
          align: 'center',
          label: '图片',
          show: true
        }, {
          prop: 'valuation',
          align: 'center',
          label: '估值',
          show: true
        }, {
          prop: 'collectionUnit',
          align: 'center',
          label: '收藏单位',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          show: true
        }],
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
        /** 进出类型 */
        importExportType: [],
        orgId: '',
        orgName: '',
        treeData: [],
        projectCode: '',
        /** 上传数据 */
        uploadData: {
          token: ''
        },
        customerList:[],
      }
    },
    mounted () {
      this.init();
      this.loadCustomerList()
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
              myProjectList:false
          }
          Api.projectList(params).then(res=>{
            console.log(res,'resss')
            this.projectList = res.records
          })
          
        }, 200);
      },
      //处理 电话
      handleTel(name,flag){
        if(name){
           const  arr =this.customerList.filter(item=>item.name==name)
            if(arr.length>0){
              this.form.workMaterialTaskReq[flag] =  arr[0].tel
            }
           
        }
      },
      //卸货联系人
      unloaderTelChange(name){
        this.loadCustomerList(name)
        this.handleTel(name,'unloaderTel')
      },
      //装货联系人
      loaderTelChange(name){
        this.loadCustomerList(name)
         this.handleTel(name,'loaderTel')
         
      },
      //客户下拉列表
      loadCustomerList (name='') {
        Api.customerList({pageNum: 1, pageSize: 100,  name: name}).then((res) => {
          if (res) {
            console.log(res.records,'qq')
            this.customerList = res.records
          }
        })
      },
      uploadSuccess (res, file, fileList) {
        this.fileList = fileList
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
        if (this.$route.query.id) {
          this.projectCode = this.$route.query.id
          this.projectType = this.$route.query.projectType
          this.form.taskInfoReq.projectCode = this.$route.query.id
          this.loadBudgetGroup()

          // 加载包装箱信息
          this.loadPackagesInfo()
          // 加载货物信息
          this.loadMaterialList()
        }

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
          if (dists.WorkCustomsType) {
            this.importExportType = dists.WorkCustomsType.children
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

        Api.getPicToken().then(data => {
          this.uploadData.token = data
        });
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
        // 如果是入库任务， 多传一个taskType参数
        if (this.taskTypeValue === '013') {
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
      /**
       * 表单提交，开始创建任务
       */
      submitForm (formName, tag) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _this = this
            _this.form.packagingInfoIds = []
            _this.form.detailIds = []
            if (this.boxData.length > 0) {
              this.boxData.forEach(function (item) {
                _this.form.packagingInfoIds.push(item.id)
              })
            }
            if (this.innerBoxData.length > 0) {
              this.innerBoxData.forEach(function (item) {
                _this.form.packagingInfoIds.push(item.id)
              })
            }
            if (this.goodsData.length > 0) {
              this.goodsData.forEach(function (item) {
                _this.form.detailIds.push(item.id)
              })
            }
            if (this.fileList.length > 0) {
              _this.form.taskAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.form.taskAttachmentReqs.push({
                  attachmentName: item.name,
                  key: item.attachmentUrlKey,
                  projectCode: _this.projectCode
                })
              })
            } else {
              if (this.removedAll) {
                this.form.taskAttachmentReqs = []
              }
            }
            if (this.taskTypeName.indexOf('外勤') !== -1) {
              //外勤工单
              this.form.templateType = '002'
              let workOutsideTaskReq = {
                supplierId: this.supplierId, // 供应商id
                type: '', // 工单类型,
                workOutsideTaskContentReqs: this.contentData
              }
              this.form.workOutsideTaskReq = workOutsideTaskReq
            }

            if (this.taskTypeName.indexOf('报关') !== -1) {
              //报关工单
              this.form.templateType = '003'
            }
            if (this.taskTypeName.indexOf('保险') !== -1) {
              //保险任务工单
              this.form.templateType = '004'
            }
            if (this.taskTypeName.indexOf('批文') !== -1) {
              //批文任务工单
              this.form.templateType = '006'
            }
            if (this.taskTypeName.indexOf('航材') !== -1) {
              this.form.templateType = '006'
              if (this.taskTypeName.indexOf('提货') !== -1) {
                //航材提货工单
                this.form.templateType = '008'
              } else {
                //航材非提货工单
                this.form.templateType = '007'
              }
            }
            // if(this.taskTypeName.indexOf('非保税入库') !== -1){
            //   //非保税入库
            //   this.form.templateType = '009'
            // }
            Api.addTask(this.form).then(data => {
              if (data) {
                this.$notify.success({
                  title: '提示',
                  message: '任务创建成功'
                })
                // debugger
                if (tag === 1) {
                  /*if (this.taskTypeValue === '013' || this.taskTypeValue === '014') {
                    this.$router.push({path: '/router/storageTask'})
                  } else {
                    if (this.$route.query.type === 'exBudget') {
                      this.$router.push({path: '/router/projectDetail', query: {id: this.$route.query.id, projectType: this.$route.query.projectType, stateId: this.$route.query.stateId, active: '5'}})
                    } else {
                      this.$router.push({path: '/router/taskList'})
                    }
                  }*/
                  if (this.$route.query.type === 'exBudget') {
                    this.$router.push({path: '/router/projectDetail', query: {id: this.$route.query.id, projectType: this.$route.query.projectType, stateId: this.$route.query.stateId, active: '5'}})
                  } else {
                    if (this.taskTypeValue === '013' || this.taskTypeValue === '014') {
                      this.$router.push({path: '/router/storageTask'})
                    } else {
                      this.$router.push({path: '/router/taskList'})
                    }
                  }

                } else {
                   // 提交后继续创建，重置页面数据
                  this.form =  {
                    detailIds: [],
                    packagingInfoIds: [],
                    // 任务附件
                    taskAttachmentReqs: [],
                    taskInfoReq: {},
                    // 外勤任务内容
                    workOutsideTaskReq: {},
                    // 报关任务内容
                    workCustomsTaskReq: {},
                    // 保险任务
                    workInsuranceTaskReq: {},
                    // 批文任务
                    workOfficialDocTaskReq: {},
                    // 航材任务
                    workMaterialTaskReq: {},
                    // 出入库任务
                    workHouseReq: {},
                  }
                  this.fileList = []
                  this.removedAll = false
                  this.boxData = []
                  this.goodsData = []
                  this.innerBoxData = []
                  this.contentData = []
                }

              } else {
                this.$notify.warning({
                  title: '提示',
                  message: '任务创建失败'
                })
              }
            })
          } else {
            this.$message('请完善表单')
          }
        })
      },
      cancelSubmit () {
        if (this.taskTypeValue === '013' || this.taskTypeValue === '014') {
          this.$router.push({path: '/router/storageTask'})
        } else {
          if (this.$route.query.type === 'exBudget') {
            this.$router.push({path: '/router/projectDetail', query: {id: this.$route.query.id, projectType: this.$route.query.projectType, stateId: this.$route.query.stateId, active: '5'}})
          } else {
            this.$router.push({path: '/router/taskList'})
          }
        }
      },
      /**
       * 任务类型下拉框点击事件
       * */
      selectTaskType (item) {
        
        if(item.cnInfo ==='非保税入库任务'){
          this.isOpenGoodsPackage = false
        }else{
          this.isOpenGoodsPackage = true
        }
        if (item.cnInfo === '包装预算任务' || item.cnInfo === '外勤预算任务' || item.cnInfo === '报关预算任务') {
          this.isBudget = true
        } else {
          this.isBudget = false
        }
        this.boxData = []
        this.goodsData = []
        this.innerBoxData = []
        this.contentData = []
        this.goodsList = []
        this.boxInfoList = []
        this.boxInnerInfoList = []


        this.taskTypeValue = item.value
        this.taskTypeName = item.cnInfo
        // 如果是出库任务，重新查询一下货物信息，包装信息
        if (item.value=== '014') {
          // 如果是项目出库任务

          let param = {
            projectCode: this.projectCode
          }
         /* if (this.taskTypeValue === '014') {
             param.taskType = this.taskTypeValue
          } else {
            delete param['taskType']
          }*/

          Api.getGoodsDetail(param).then(res => {
            if (res) {
              if (res.foreignMaterialDetailTasks && res.foreignMaterialDetailTasks.length > 0) {
                // 国际航材货物详情
                this.goodsList = res.foreignMaterialDetailTasks
              } else if (res.detailTasks && res.detailTasks.length > 0) {
                // 国内航材货物详情
                this.goodsList = res.detailTasks
              } else if (res.artDetailTasks && res.artDetailTasks.length > 0) {
                this.goodsList = res.artDetailTasks
              }
              // 包装箱信息
              if (res.packagingInfoTasks) {
                this.boxInfoList = res.packagingInfoTasks
              }
              // 内部包装箱信息
              if (res.innerPackagingInfoTasks) {
                this.boxInnerInfoList = res.innerPackagingInfoTasks
              }
            }

          })
        } else {
            // 加载包装箱信息
            this.loadPackagesInfo()
            // 加载货物信息
            this.loadMaterialList()
        }
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
        this.boxData = []
        this.goodsData = []
        this.innerBoxData = []
        this.contentData = []
        this.goodsList = []
        this.boxInfoList = []
        this.boxInnerInfoList = []
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
        // 如果是入库任务， 多传一个taskType参数
        if (this.taskTypeValue === '013') {
          param.taskType = this.taskTypeValue
        } else {
          delete param['taskType']
        }
        // 获取货物明细来源数据，对应弹框的列表数据
        if (this.projectType === "1" || this.projectType === "4") {
          // 艺术品
          Api.artMaterialListAll(param).then(data => {
            let _this = this
            this.goodsList = data
            this.goodsList.forEach(function (item) {
              _this.$set(item, 'size', (item.length?item.length: '0') + ' x ' + (item.width?item.width: '0') + ' x ' + (item.height?item.height:'0'))
            })
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
      addContent () {
        let item = {
          operationDt: '',
          place: '',
          content: '',
          tool: '',
          material: '',
          remarks: ''
        }
        this.contentData.push(item)
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
