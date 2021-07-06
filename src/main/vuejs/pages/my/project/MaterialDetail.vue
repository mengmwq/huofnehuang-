<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 -->

<template>
  <div>
    <el-row class="sub-header m10">
      <el-col :span="4" class="sub-title">货物明细</el-col>
      <el-col :span="20" class="text-right">
        <div
          v-if="
            (operateFlag === 'pro-add' || operateFlag === 'pro-detail-edit') &&
            stateId !== '045'
          "
        >
          <el-button type="primary" size="small" @click="downloadTemplate"
            >下载模板</el-button
          >
          <el-upload
            style="display: inline-block"
            type="primary"
            icon="el-icon-upload"
            class="btn-upload"
            ref="uploadInfo"
            action=""
            :before-upload="beforeGoodsUpload"
            :http-request="uploadGoodsInfo"
            :limit="1"
          >
            <el-button icon="el-icon-upload2" type="primary" size="small"
              >导入货物信息</el-button
            >
          </el-upload>

          <el-button
            v-if="operateFlag === 'pro-add'"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="openAddGoodsDialolg('add')"
            >新增货物明细</el-button
          >
          <!--<el-button type="info" size="small">删除导入货物信息</el-button>-->
          <!-- </div>
        <div v-if="operateFlag === 'pro-detail-edit'"> -->
          <template v-if="operateFlag === 'pro-detail-edit'">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="openAddGoodsDialolg('add')"
              >添加货物</el-button
            >
            <el-input
              size="small"
              placeholder="请输入货物名称"
              v-model="query.name"
              style="width: 200px"
            ></el-input>
            <el-button type="primary" size="small" @click="loadData"
              >查询</el-button
            >
          </template>
        </div>
      </el-col>
      <el-col :span="20" class="text-right" v-if="operateFlag === 'stock-in'">
        <template v-if="isStockIn">
          <el-select
            filterable
            v-model="stockInForm.warehouseId"
            clearable
            placeholder="请选择库"
            size="medium"
            style="width: 140px"
          >
            <el-option
              v-for="(item, index) in kuList"
              :key="index"
              :label="item.name"
              :value="item.id"
              @click.native="selectKu(item)"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            v-model="stockInForm.houseId"
            clearable
            placeholder="请选择仓"
            size="medium"
            style="width: 140px"
          >
            <el-option
              v-for="(item, index) in cangList"
              :key="index"
              :label="item.name"
              :value="item.id"
              @click.native="selectCang(item)"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            v-model="stockInForm.cabinetId"
            clearable
            placeholder="请选择柜"
            size="medium"
            style="width: 140px"
          >
            <el-option
              v-for="(item, index) in guiList"
              :key="index"
              :label="item.name"
              :value="item.id"
              @click.native="selectGui(item)"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            v-model="stockInForm.grideId"
            clearable
            placeholder="请选择位"
            size="medium"
            style="width: 140px"
          >
            <el-option
              v-for="(item, index) in weiList"
              :key="index"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
              @click.native="selectWei(item)"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="small" @click="saveStockIn"
            >确认</el-button
          >
          <el-button type="default" size="small" @click="cancelStockIn"
            >取消</el-button
          >
        </template>
        <el-button v-else type="primary" size="small" @click="stockIn"
          >入库</el-button
        >
      </el-col>
    </el-row>
    <!--航材信息-->
    <el-table
      v-if="projectType !== '1'"
      ref="multipleTable"
      :data="newDomesticMaterialDetailReqs"
      max-height="400"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="60"
        v-if="operateFlag === 'stock-in'"
      ></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="80"
        fixed="left"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="货物名称"
        width="200"
        fixed="left"
      ></el-table-column>
      <el-table-column prop="partNumber" label="件号"></el-table-column>
      <el-table-column prop="number" label="数量"></el-table-column>
      <el-table-column
        prop="grossWeight"
        label="毛重"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="placeConsigned"
        label="起运地"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="destination"
        label="目的地"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="separateOddNumber"
        label="分单单号"
        v-if="projectType === '3'"
      ></el-table-column>
      <el-table-column
        prop="dangerous"
        label="危险品标识"
        v-if="projectType === '3'"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.dangerous | dangerGoods }}
        </template>
      </el-table-column>
      <el-table-column
        prop="packagingType"
        label="包装类型"
        v-if="projectType === '3'"
      >
        <template slot-scope="scope">
          {{ scope.row.packagingType | packagingType }}
        </template>
      </el-table-column>
      <el-table-column prop="contractPrice" label="合同金额"></el-table-column>
      <!-- <el-table-column prop="agreementPrice" label="协议价格"></el-table-column> -->
      <el-table-column prop="length" label="长*宽*高">
        <template slot-scope="scope">
          <span v-if="scope.row.length">
            {{ scope.row.length }}*{{ scope.row.width }}*{{
              scope.row.height
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="contacts" label="联系人"></el-table-column>
      <el-table-column
        prop="contactsTel"
        label="联系电话"
        width="150"
      ></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column
        label="操作"
        width="150"
        v-if="operateFlag === 'pro-detail-edit' || operateFlag === 'pro-add'"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="openAddGoodsDialolg('edit', scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="deleteMaterial(scope.row, scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="入库位置"
        width="400"
        v-if="operateFlag === 'stock-in' || operateFlag === 'stock-in-record'"
      >
        <template slot-scope="scope">
          {{ scope.row.warehouseName }}-->{{ scope.row.houseName }}-->{{
            scope.row.cabinetName
          }}-->{{ scope.row.grideName }}
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-else
      :data="artMaterialDetail"
      ref="multipleTable"
      max-height="400"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="60"
        v-if="operateFlag === 'stock-in'"
      ></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="60"
        fixed="left"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="作品名称"
        width="200"
        fixed="left"
      ></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column
        prop="size"
        label="展品尺寸(cm)"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="dimensions"
        label="包装尺寸(cm)"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="netWeight"
        label="净重(kg)"
        width="120"
      ></el-table-column>
      <el-table-column prop="material" label="材质"></el-table-column>
      <el-table-column prop="age" label="创作年代"></el-table-column>
      <el-table-column
        prop="number"
        label="数量(幅/件)"
        width="120"
      ></el-table-column>
      <el-table-column prop="photograph" label="图片">
        <template slot-scope="scope" v-if="scope.row.photograph">
          <a
            href="javascript:;"
            v-if="scope.row.photograph.length > 0"
            @click="previewImg(scope.row.photograph)"
            >预览</a
          >
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="valuation"
        label="估值(RMB)"
        width="120"
      ></el-table-column>
      <el-table-column prop="collection" label="收藏单位"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        v-if="operateFlag !== 'stock-in' && operateFlag !== 'stock-in-record'"
      >
        <template
          slot-scope="scope"
          v-if="operateFlag === 'pro-detail-edit' || operateFlag === 'pro-add'"
          fixed="right"
        >
          <el-button
            type="primary"
            size="mini"
            @click="openAddGoodsDialolg('edit', scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="deleteArtMaterial(scope.row, scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="入库位置"
        width="300"
        fixed="left"
        v-if="operateFlag === 'stock-in' || operateFlag === 'stock-in-record'"
      >
        <template slot-scope="scope">
          {{ scope.row.warehouseName }}-->{{ scope.row.houseName }}-->{{
            scope.row.cabinetName
          }}-->{{ scope.row.grideName }}
        </template>
      </el-table-column>
    </el-table>
    <!--新增/编辑货物信息 航材的货物明细-->
    <el-dialog
      :title="artTitleFlag == 'add' ? '新增货物信息' : '编辑货物信息'"
      :visible.sync="materialGoodsDialogVisible"
      @close="resetGoodsField()"
      :close-on-click-modal="canClick"
      size="small"
      top="12vh"
      width="60%"
    >
      <div>
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同号:">
                <el-select
                  filterable
                  style="width: 100%"
                  v-model="form.contractId"
                  placeholder="合同号"
                >
                  <el-option
                    v-for="(item, index) in contractList"
                    :key="index"
                    :label="item.contractName"
                    :value="item.contractCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="件号:">
                <el-input v-model="form.partNumber"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="8">
              <el-form-item label="序号:">
                <el-input></el-input>
              </el-form-item>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货物名称:" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量:" prop="number">
                <el-input v-model="form.number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="起运地:" prop="placeConsigned">
                <el-input v-model="form.placeConsigned"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目的地:" prop="destination">
                <el-input v-model="form.destination"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="运输方式:" prop="transportationModeId">
                <el-select
                  filterable
                  v-model="form.transportationModeId"
                  clearable
                  placeholder="请选择运输方式"
                  size="medium"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in transportationMode"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同金额:" prop="contractPrice">
                <el-input v-model="form.contractPrice"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="14">
              <el-form-item label="协议价格:" prop="agreementPrice">
                <el-input v-model="form.agreementPrice" placeholder="根据必填项查询得出" style="width: 195px"></el-input>
                <el-button type="primary" size="medium" @click="queryPrice('form')">查询协议价格</el-button>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="毛重:" prop="grossWeight">
                <el-input v-model="form.grossWeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="体积(cm):">
                <el-input
                  placeholder="长"
                  v-model="form.length"
                  style="width: 100px"
                ></el-input>
                X
                <el-input
                  placeholder="宽"
                  v-model="form.width"
                  style="width: 100px"
                ></el-input>
                X
                <el-input
                  placeholder="高"
                  v-model="form.height"
                  style="width: 100px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--国际航材-->
          <div v-if="projectType === '3'">
            <el-row>
              <el-col :span="8">
                <el-form-item label="分单单号:" prop="separateOddNumber">
                  <el-input v-model="form.separateOddNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="危险品标识:">
                  <el-switch
                    v-model="dangerous"
                    active-color="#13ce66"
                    inactive-color="#aaa"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="包装类型:">
                  <el-select
                    filterable
                    v-model="form.packagingType"
                    clearable
                    placeholder="请选择包装类型"
                    size="medium"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(item, index) in packageTypes"
                      :key="index"
                      :label="item.cnInfo"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系人:">
                <el-input v-model="form.contacts"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:" prop="contactsTel">
                <el-input v-model="form.contactsTel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  type="textarea"
                  :rows="4"
                  maxlength="500"
                  show-word-limit
                  v-model="form.remarks"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-center" style="margin-top: 20px">
            <el-button
              type="primary"
              size="small"
              @click="cancelAddmaterialGoods('form')"
              >取 消</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="addMaterialGoods('form')"
              >确 定</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!--新增货物信息 艺术品的货物明细-->
    <el-dialog
      :title="artTitleFlag == 'edit' ? '编辑货物信息' : '新增货物信息'"
      :visible.sync="artGoodsDialogVisible"
      @close="resetGoodsField()"
      :close-on-click-modal="canClick"
      size="small"
      top="12vh"
      width="60%"
    >
      <div>
        <el-form
          :model="artForm"
          ref="artForm"
          :rules="artRules"
          label-width="110px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="作品名称:" prop="name">
                <el-input v-model="artForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数量:" prop="number">
                <el-input v-model="artForm.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型:">
                <el-input v-model="artForm.type"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="估值:" prop="valuation">
                <el-input v-model="artForm.valuation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="币种:" prop="currency">
                <el-select
                  filterable
                  v-model="artForm.currency"
                  clearable
                  placeholder="请选择币种"
                  size="medium"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in currencyTypeList"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="级别:">
                <el-input v-model="artForm.level"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="收藏单位:" prop="collection">
                <el-input v-model="artForm.collection"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="藏品号:" prop="collectionCode">
                <el-input v-model="artForm.collectionCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注:">
                <el-input v-model="artForm.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="作者:">
                <el-input v-model="artForm.author"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重量(kg):">
                <el-input v-model="artForm.netWeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源地:">
                <el-input v-model="artForm.placeOfOrigin"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="包装尺寸(cm):">
                <el-input
                  style="width: 120px"
                  v-model="artForm.Plength"
                  clearable
                ></el-input>
                X
                <el-input
                  style="width: 120px"
                  v-model="artForm.Pwidth"
                  clearable
                ></el-input>
                X
                <el-input
                  style="width: 120px"
                  v-model="artForm.Pheight"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="内包装/画框:">
                <el-input v-model="artForm.innerPacking"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="尺寸(cm):">
                <el-input
                  v-model="artForm.length"
                  style="width: 120px"
                  clearable
                ></el-input>
                X
                <el-input
                  v-model="artForm.width"
                  style="width: 120px"
                  clearable
                ></el-input>
                X
                <el-input
                  v-model="artForm.height"
                  style="width: 120px"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时代/年代:">
                <el-input v-model="artForm.age"></el-input>
                <!-- <el-date-picker type="year" placeholder="选择时代/年代" v-model="artForm.age"
                                format="yyyy" value-format="yyyy" style="width: 100%"></el-date-picker>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="出土地点:">
                <el-input v-model="artForm.unearthedPlace"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="材质:">
                <el-input v-model="artForm.material"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="完残情况:">
                <el-input v-model="artForm.residualCondition"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="图片:">
                <v-upload :imgKeyReq.sync="artForm.photograph"></v-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-center" style="margin-top: 20px">
            <el-button
              type="primary"
              size="small"
              @click="cancelAddArtMaterial('artForm')"
              >取 消</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="addArtMaterial('artForm')"
              >确 定</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 图片预览-->
    <ImgPreview
      :pictures="pictures"
      :isShowDialog="isShowDialog"
      :isFullscreen="false"
      v-if="isShowDialog"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import Upload from "@/components/common/Upload";
import Api from "@/api/index";
import ImgPreview from "@/components/common/ImgPreview";
import ValidForm from "@/utils/ValidForm";
export default {
  components: {
    "v-upload": Upload,
    ImgPreview,
  },
  name: "MaterialDetail",
  data() {
    return {
      canClick: false,
      isShowDialog: false,
      artTitleFlag: "",
      artRowIndex: "",
      pictures: [],
      form: {},
      sels: [],
      isStockIn: false,
      //入库操作
      stockInForm: {
        warehouseId: null,
        warehouseName: null,
        houseId: null,
        houseName: null,
        cabinetId: null,
        cabinetName: null,
        grideId: null,
        grideName: null,
      },
      query: {
        name: "",
        pageNum: 1,
        pageSize: 10,
        projectCode: "",
      },
      proCode: "",
      proType: "",
      stateId:'',
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
        name: [{ required: true, message: "请填写货物名称", trigger: "blur" }],
        number: [
          { required: true, message: "请填写数量", trigger: "blur" },
          {
            pattern: /^[0-9]{1,}$/,
            message: "请输入数字类型",
            trigger: "blur",
          },
        ],
        price: [
          { required: false, message: "请填写协议价格", trigger: "blur" },
          {
            pattern: /^[0-9]{1,}$/,
            message: "请输入数字类型",
            trigger: "blur",
          },
        ],
        placeConsigned: [
          { required: true, message: "请填写起运地", trigger: "blur" },
        ],
        destination: [
          { required: true, message: "请填写目的地", trigger: "blur" },
        ],
        transportationModeId: [
          { required: true, message: "请选择运输方式", trigger: "change" },
        ],
        contractPrice: [
          { required: true, message: "", trigger: "blur" },
           { pattern:/^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/, message: '请输入正确的金额(小数点保留2位)',trigger: 'blur' },
        ],
        grossWeight: [
          { required: false, message: "", trigger: "blur" },
          {
            pattern: /^[0-9]{1,}$/,
            message: "请输入数字类型",
            trigger: "blur",
          },
        ],
        contactsTel: [
          { required: false, message: "", trigger: "blur" },
          {
            pattern: /^(1[3-9][0-9])[0-9]{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        separateOddNumber: [
          { required: false, message: "", trigger: "blur" },
          {
            pattern: /^[0-9a-zA-Z]*$/g,
            message: "请输入数字类型或字母类型",
            trigger: "blur",
          },
        ],
      },
      artRules: {
        name: [{ required: true, message: "请填写作品名称", trigger: "blur" }],
        number: [
          { required: true, message: "请填写数量", trigger: "blur" },
          {
            pattern: /^[0-9]{1,}$/,
            message: "请输入数字类型",
            trigger: "blur",
          },
        ],
        collection: [
          { required: false, message: "请填写收藏单位", trigger: "blur" },
        ],
        valuation: [
          { required: true, message: "请填写估值", trigger: "blur" },
          {
            pattern: ValidForm.floatNumReg,
            message: "请正确输入估值(小数保留2位)",
          },
        ],
        currency: [
          { required: true, message: "请选择币种", trigger: "change" },
        ],
        collectionCode: [
          { required: false, message: "", trigger: "change" },
          {
            pattern: /^[0-9a-zA-Z]*$/g,
            message: "请输入数字类型或字母类型",
            trigger: "blur",
          },
        ],
      },
      // 币种
      currencyTypeList: [],
      operateFlag1: "",
      contractList: [],
      kuList: [],
      cangList: [],
      guiList: [],
      weiList: [],
      stockInfo: {},
      // 记录已选中的位，用于做位列表的过滤
      selectedWeiList: [],
    };
  },
  props: {
    domesticMaterialDetailReqs: Array,
    foreignMaterialDetailReqs: Array,
    artMaterialDetailReqs: Array,
    projectType: String, // 1艺术品2国内航材3国际航材
    operateFlag: String,
    importFlag: String, // 项目详情中导入标识
    projectCode: String,
    stateId: String,
  },
  computed: {
    newDomesticMaterialDetailReqs() {
      return this.domesticMaterialDetail.map((item)=>{
        console.log(item,'itemitemitemitemitemitemitem')

          item.contractPrice = item.contractPrice && Number(item.contractPrice).toFixed(2)

        return item
      })
    }
  },
  watch: {
    domesticMaterialDetailReqs: function (value) {
      this.domesticMaterialDetail = value;
    },
    foreignMaterialDetailReqs: function (value) {
      this.domesticMaterialDetail = value;
    },
    domesticMaterialDetail: function (value) {
      if (this.projectType === "2") {
        this.$emit("update:domesticMaterialDetailReqs", value);
      } else if (this.projectType === "3") {
        this.$emit("update:foreignMaterialDetailReqs", value);
      }
    },
    artMaterialDetailReqs: function (value) {
      this.artMaterialDetail = value;
      let _this = this;
      this.artMaterialDetail.forEach(function (item) {
        _this.$set(
          item,
          "size",
          (item.length ? item.length : "0") +
            " x " +
            (item.width ? item.width : "0") +
            " x " +
            (item.height ? item.height : "0")
        );
      });
    },
    artMaterialDetail: function (value) {
      this.$emit("update:artMaterialDetailReqs", value);
    },
    projectType: function (value) {
      this.proType = value;
      this.projectType = value;
    },
    projectCode: function (value) {
      this.proCode = value;
      if (this.proType && this.proCode) {
        this.loadData();
      }
    },
    stateId: function (value) {
      console.log(value,'jjjjjjjjj')

      this.stateId = value;
    },
    operateFlag: function (value) {
      if (value === "stock-in") {
        this.loadStockInfo();
      }
    },
    stockInfo: function (newValue) {
      this.$emit("update:stockInfos", newValue);
    },
  },
  mounted() {

    console.log('====================================');
    console.log(this);
    console.log('====================================');
    // 获取字典信息
    if (sessionStorage.getItem("dists")) {
      let distsObj = JSON.parse(sessionStorage.getItem("dists"));
      if (distsObj.TransportationMode) {
        this.transportationMode = distsObj.TransportationMode.children;
      }
      if (distsObj.PackageType) {
        this.packageTypes = distsObj.PackageType.children;
      }
      if (distsObj.Currency) {
        this.currencyTypeList = distsObj.Currency.children;
      }
    }
    // 查询合同
    Api.pageContract({ pageSize: 50000, pageNum: 1 }).then((data) => {
      if (data) {
        this.contractList = data.records;
      }
    });
    this.loadStockInfo();
  },
  methods: {
    handleSelectionChange(val) {
      this.sels = val;
    },
    saveStockIn() {
      let selected = this.sels;
      let stockInForm = this.stockInForm;
      if (!stockInForm.warehouseId) {
        this.$notify.warning({
          title: "提示",
          message: "请选择库信息！",
        });
        return;
      }
      if (!stockInForm.houseId) {
        this.$notify.warning({
          title: "提示",
          message: "请选择仓信息！",
        });
        return;
      }
      if (!stockInForm.cabinetId) {
        this.$notify.warning({
          title: "提示",
          message: "请选择柜信息！",
        });
        return;
      }
      if (!stockInForm.grideId) {
        this.$notify.warning({
          title: "提示",
          message: "请选择位信息！",
        });
        return;
      }
      //已选中的ID
      //const aSelectedId = selected.map(item=>item.id)
      if (this.projectType != "1") {
        this.domesticMaterialDetail.map((sItem) => {
          if (selected.some((item) => item.id === sItem.id)) {
            sItem.warehouseId = stockInForm.warehouseId;
            sItem.warehouseName = stockInForm.warehouseName;
            sItem.houseId = stockInForm.houseId;
            sItem.houseName = stockInForm.houseName;
            sItem.cabinetId = stockInForm.cabinetId;
            sItem.cabinetName = stockInForm.cabinetName;
            sItem.grideId = stockInForm.grideId;
            sItem.grideName = stockInForm.grideName;
            return sItem;
          }
        });
      } else {
        this.artMaterialDetail.map((sItem) => {
          if (selected.some((item) => item.id === sItem.id)) {
            sItem.warehouseId = stockInForm.warehouseId;
            sItem.warehouseName = stockInForm.warehouseName;
            sItem.houseId = stockInForm.houseId;
            sItem.houseName = stockInForm.houseName;
            sItem.cabinetId = stockInForm.cabinetId;
            sItem.cabinetName = stockInForm.cabinetName;
            sItem.grideId = stockInForm.grideId;
            sItem.grideName = stockInForm.grideName;
            return sItem;
          }
        });
      }

      this.cancelStockIn();
    },

    cancelStockIn() {
      this.isStockIn = false;
      this.$refs.multipleTable.clearSelection();
      this.clearStockIn();
    },
    //入库操作
    stockIn() {
      const selected = this.sels;
      if (selected.length == 0) {
        this.$notify.warning({
          title: "提示",
          message: "请至少 选择一条入库记录！",
        });
        return;
      }
      const stockIned = selected.some((item) => item.grideId);
      if (stockIned) {
        this.$notify.warning({
          title: "提示",
          message: "选中的记录中包含已入库信息！",
        });
        return;
      }
      this.isStockIn = true;
    },
    //清除入库FORM
    clearStockIn() {
      this.stockInForm = {
        warehouseId: null,
        houseId: null,
        cabinetId: null,
        grideId: null,
      };
    },
    //关闭图片预览；
    closeDialog() {
      this.isShowDialog = false;
    },
    //图片预览
    previewImg(pictures) {
      let img = "";
      Api.getUrl(pictures).then((data) => {
        if (data) {
          img = data;
          this.pictures = [];
          this.pictures.push(img);
          console.log(this.pictures, "poo");
          this.isShowDialog = true;
        }
      });
    },
    /**
     * 加载货物信息
     * */
    loadData() {
      let param = {
        pageNum: 1,
        pageSize: 50000,
        projectCode: this.proCode,
      };

      if (this.proType === "1") {
        // 艺术品
        let _this = this;
        Api.artGoodsPageList(param).then((res) => {
          if (res) {
            this.artMaterialDetail = res.records;
            this.artMaterialDetail.forEach(function (item) {
              _this.$set(
                item,
                "size",
                (item.length ? item.length : "0") +
                  " x " +
                  (item.width ? item.width : "0") +
                  " x " +
                  (item.height ? item.height : "0")
              );
            });
            this.total = res.total;
          }
        });
      } else if (this.proType === "2") {
        // 国内货物
        Api.domesticMaterialPageList(param).then((res) => {
          if (res) {
            this.domesticMaterialDetail = res.records;
            this.total = res.total;
          }
        });
      } else {
        // 国际货物
        Api.foreignMaterialPageList(param).then((res) => {
          if (res) {
            this.domesticMaterialDetail = res.records;
            this.total = res.total;
          }
        });
      }
    },
    beforeGoodsUpload(file) {
      let Xls = file.name.split(".");
      let fileType = Xls[Xls.length - 1];
      if (fileType === "xls" || fileType === "xlsx") {
        return file;
      } else {
        this.$notify.warning({
          title: "提示",
          message: "只允许上传excel",
        });
        return false;
      }
    },
    //插入货物信息
    insertGoodsInfo(fn, data) {
      const params = data.map((item) => {
        item.projectCode = this.$route.query.id;
        return item;
      });
      Api[fn](params).then((res) => {
        console.log("importFlagDetails");
        this.loadData();
      });
    },
    /**上传*/
    uploadGoodsInfo(content) {
      let formData = new FormData();
      formData.append("file", content.file);
      formData.append("type", this.projectType);
      // formData.append('actId', this.actId)

      Api.importExcel(formData)
        .then((data) => {
          if (data) {
            //项目详情页中
            const query = this.$route.query;
            const projectType = this.projectType;
            if (this.importFlag == "pro-detail-import") {
              let fn = "";
              if (projectType == "1") {
                //艺术品
                fn = "addArtDetailBatch";
              } else if (projectType == "2") {
                //国内
                fn = "addAirDomesticDetailBatch";
              } else if (projectType == "3") {
                //国际
                fn = "addAirForeignDetailBatch";
              }
              this.insertGoodsInfo(fn, data);
            }

            //if (this.$route.query.type === 'F') {
            if (projectType == "1") {
              this.artMaterialDetail = this.artMaterialDetail.concat(data);
              let _this = this;
              this.artMaterialDetail.forEach(function (item) {
                _this.$set(
                  item,
                  "size",
                  (item.length ? item.length : "0") +
                    " x " +
                    (item.width ? item.width : "0") +
                    " x " +
                    (item.height ? item.height : "0")
                );
              });
            } else {
              this.domesticMaterialDetail = this.domesticMaterialDetail.concat(
                data
              );
            }
            // 这里加
            console.log('====================================');
            console.log(data);
            console.log('====================================');
            this.form = data;
            this.artForm = data;
            this.$notify.success({
              title: "提示",
              message: "货物明细导入成功",
            });
          }
          this.$refs.uploadInfo.clearFiles();
        })
        .catch((ret) => {
          this.$notify.warning({
            title: "提示",
            message: ret.response.data.errorMsg,
          });
          this.$refs.uploadInfo.clearFiles();
        });
    },

    /**下载模板*/
    downloadTemplate() {
      let param = {
        projectType: this.projectType,
      };
      Api.downloadExcelTemplate(param).then((res) => {
        if (res) {
          let reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = (e) => {
            let a = document.createElement("a");
            a.download = "模板.xlsx";
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        }
      });
    },

    /**
     * 打开添加货物明细弹框
     * */
    openAddGoodsDialolg(flag, row, index) {
      if (!this.projectType) {
        this.$notify.warning({
          title: "提示",
          message: "请先选择项目编码用以确定添加国内货物还是国际货物",
        });
        return;
      }


      this.artTitleFlag = flag;

      if (flag == "edit") {

        this.artForm = JSON.parse(JSON.stringify(row));
        this.form = JSON.parse(JSON.stringify(row));
        this.artRowIndex = index;
      }
      if (this.operateFlag === "pro-add") {
        if (this.$route.query.type) {
          // 新增航材项目
          if (this.$route.query.type === "A") {
            this.materialGoodsDialogVisible = true;
          } else {
            // 新增艺术品项目
            this.artGoodsDialogVisible = true;
          }
        }
      } else if (this.operateFlag === "pro-detail-edit") {
        if (this.projectType === "1") {
          // 新增艺术品货物
          this.artGoodsDialogVisible = true;
        } else {
          // 新增国内国际货物
          this.materialGoodsDialogVisible = true;

          this.form = JSON.parse(JSON.stringify(row));
        }
      }
    },
    /**
     * 航材添加货物明细
     * */
    addMaterialGoods(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (this.operateFlag === "pro-add") {
        console.log(this.operateFlag,'>???');
        console.log(this.proType,'this.proType');

            if (this.proType === "2") {


              delete this.form["dangerous"];
              delete this.form["packageType"];
              delete this.form["separateOddNumber"];
              this.domesticMaterialDetail.splice(this.artRowIndex, 1);
              this.domesticMaterialDetail.push(this.form);

              //this.newDomesticMaterialDetailReqs.push(this.form);
            } else {




              // this.form.dangerous = this.dangerous == false ? "0" : "1"; // 0:非危险品1：危险品
              console.log('====================================');
              console.log(this.form.dangerous);
              console.log('====================================');
              this.domesticMaterialDetail.push(this.form);
              //this.newDomesticMaterialDetailReqs.push(this.form);
            }
            this.materialGoodsDialogVisible = false;
          } else if (this.operateFlag === "pro-detail-edit") {


            this.form.projectCode = this.proCode;


            if (this.proType === "2") {
              delete this.form["dangerous"];
              delete this.form["packageType"];
              delete this.form["separateOddNumber"];
              const fn =
                this.artTitleFlag == "edit"
                  ? "updateDetailDomesticMaterial"
                  : "addDomesticMaterialDetail";
              Api[fn](this.form).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: "提示",
                    message: "货物添加成功",
                  });
                  this.materialGoodsDialogVisible = false;
                  this.loadData();
                } else {
                  this.$notify.warning({
                    title: "提示",
                    message: "货物编辑失败",
                  });
                  this.materialGoodsDialogVisible = false;
                }
              });
            } else {
              const fn =
                this.artTitleFlag == "edit"
                  ? "updateDetailForeignMaterial"
                  : "addForeignMaterialDetail";

                  //这里才是else里面
                  console.log(this.form.dangerous)
                  this.form.dangerous = this.dangerous == false ? "0" : "1"; // 0:非危险品1：危险品

              Api[fn](this.form).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: "提示",
                    message: "货物添加成功",
                  });
                  this.materialGoodsDialogVisible = false;
                  this.loadData();
                } else {
                  this.$notify.warning({
                    title: "提示",
                    message: "货物编辑失败",
                  });
                  this.materialGoodsDialogVisible = false;
                }
              });
            }
          }
        } else {
           console.log(this.operateFlag,'>??????????????/');
           console.log(this.proType,'======');
           debugger
          return false;
        }
      });
    },
    deleteMaterial(item, index) {
      this.$confirm("您确定要删除【" + item.name + "】吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.operateFlag === "pro-add") {
          this.domesticMaterialDetail.splice(index, 1);
        } else if (this.operateFlag === "pro-detail-edit") {
          if (this.proType === "2") {
            Api.deleteDomesticMaterial({ id: item.id }).then((res) => {
              if (res) {
                this.$notify.success({
                  title: "提示",
                  message: "删除成功",
                });
                this.loadData();
              } else {
                this.$notify.warning({
                  title: "提示",
                  message: "删除失败",
                });
              }
            });
          } else {
            Api.deleteForeignMaterial({ id: item.id }).then((res) => {
              if (res) {
                this.$notify.success({
                  title: "提示",
                  message: "删除成功",
                });
                this.loadData();
              } else {
                this.$notify.warning({
                  title: "提示",
                  message: "删除失败",
                });
              }
            });
          }
        }
      });
    },
    deleteArtMaterial(item, index) {
      if (this.operateFlag === "pro-add") {
        this.$confirm("您确定要删除【" + item.name + "】吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.artMaterialDetail.splice(index, 1);
        });
      } else if (this.operateFlag === "pro-detail-edit") {
        this.$confirm("您确定要删除【" + item.name + "】吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          Api.deleteArtGoods({ id: item.id }).then((res) => {
            if (res) {
              this.$notify.success({
                title: "提示",
                message: "删除成功",
              });
              this.loadData();
            } else {
              this.$notify.warning({
                title: "提示",
                message: "删除失败",
              });
            }
          });
        });
      }
    },
    resetGoodsField() {
      this.form = {
        transportationModeId: "",
      };
      this.artForm = {
        currency: "",
        photograph: "",
      };
    },
    /**
     * 取消添加货物明细
     * */
    cancelAddmaterialGoods(formName) {
      this.$refs[formName].resetFields();
      this.materialGoodsDialogVisible = false;
    },
    /**
     * 添加艺术品货物明细
     * */
    addArtMaterial(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.operateFlag === "pro-add") {
            this.artForm.dimensions =
              (this.artForm.Plength ? this.artForm.Plength : "0") +
              " x " +
              (this.artForm.Pwidth ? this.artForm.Pwidth : "0") +
              " x " +
              (this.artForm.Pheight ? this.artForm.Pheight : "0");
            console.log(this.artMaterialDetail, this.artForm, "edddd");
            if (this.artTitleFlag == "edit") {
              this.artMaterialDetail.splice(this.artRowIndex, 1);
              this.artMaterialDetail.push(this.artForm);
              // this.artMaterialDetail[this.artRowIndex] = JSON.parse(JSON.stringify(this.artForm))
              //  console.log(this.artMaterialDetail,this.artTitleFlag)
              //  this.$emit('update:artMaterialDetailReqs', this.artMaterialDetail)
            } else {
              this.artMaterialDetail.push(this.artForm);
            }
            this.artMaterialDetail.forEach(function (item) {
              _this.$set(
                item,
                "size",
                (item.length ? item.length : "0") +
                  " x " +
                  (item.width ? item.width : "0") +
                  " x " +
                  (item.height ? item.height : "0")
              );
            });
            this.artGoodsDialogVisible = false;
          } else if (this.operateFlag === "pro-detail-edit") {
            this.artForm.projectCode = this.proCode;
            this.artForm.dimensions =
              (this.artForm.Plength ? this.artForm.Plength : "0") +
              " x " +
              (this.artForm.Pwidth ? this.artForm.Pwidth : "0") +
              " x " +
              (this.artForm.Pheight ? this.artForm.Pheight : "0");
            const fn =
              this.artTitleFlag == "edit"
                ? "updateDetailArtMaterial"
                : "addArtGoodsDetail";
            Api[fn](this.artForm).then((res) => {
              if (res) {
                this.$notify.success({
                  title: "提示",
                  message: "货物添加成功",
                });
                this.artGoodsDialogVisible = false;
                this.loadData();
              } else {
                this.$notify.warning({
                  title: "提示",
                  message: "货物添加失败！",
                });
                this.artGoodsDialogVisible = false;
              }
            });
            this.artForm = {};
          }
        } else {
          return false;
        }
      });
    },
    cancelAddArtMaterial(formName) {
      this.$refs[formName].resetFields();
      this.artGoodsDialogVisible = false;
    },
    /**
     * 查询协议价格
     * */
    // queryPrice (formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       let params = {
    //         contractId: this.form.contractId,
    //         from: this.form.placeConsigned,
    //         goodsName: this.form.name,
    //         to: this.form.destination,
    //         transportationModeId: this.form.transportationModeId
    //       }
    //       Api.queryAgreementPrice(params).then((res) => {
    //         if (res) {
    //           this.form.price = res
    //         }
    //       })
    //     } else {
    //       return false;
    //     }
    //   })
    // },
    /**
     * 获取库列表
     * */
    loadStockInfo() {
      // 库列表
      Api.selectWarehouseInfoList({}).then((res) => {
        if (res) {
          this.kuList = res;
        }
      });
    },
    /**
     * 点击库加载仓列表
     * */
    selectKu(item) {
      this.stockInfo = item;
      this.stockInForm.warehouseName = item.name;
      Api.queryHouseInfoListByWarehouseId({
        id: item.id,
        code: item.code,
      }).then((res) => {
        if (res) {
          this.cangList = res;
        }
      });
    },
    /**
     * 点击仓加载柜列表
     * */
    selectCang(item) {
      this.stockInfo = item;

      this.stockInForm.houseName = item.name;
      Api.queryCabinetInfoListByHouseId({
        id: item.id,
        code: item.code,
      }).then((res) => {
        if (res) {
          this.guiList = res;
        }
      });
    },
    /**
     * 点击柜加载位列表
     * */
    selectGui(item) {
      this.stockInfo = item;
      this.stockInForm.cabinetName = item.name;
      Api.queryAllGrideListByCabinetId({
        // Api.queryEmptyGrideListByCabinetId({
        id: item.id,
        code: item.code,
      }).then((res) => {
        if (res) {
          this.weiList = res;
          let _this = this;
          let index = 0;
          for (let i = 0; i < this.weiList.length; i++) {
            if (this.selectedWeiList.length > 0) {
              for (let j = 0; j < this.selectedWeiList.length; j++) {
                let item = this.weiList[i];
                let item1 = this.selectedWeiList[j];
                if (item.id === item1.id) {
                  index = i;
                  break;
                }
              }
              _this.$set(this.weiList[index], "disabled", true);
            }
          }
        }
      });
    },
    /**
     * 点击位加载位信息
     * */
    selectWei(item) {
      this.stockInForm.grideName = item.name;
      this.stockInfo = item;
      this.selectedWeiList.push(item);
    },

    getImgUrl(key) {
      let imageUrl = "";
      if (key) {
        Api.getUrl(key).then((data) => {
          if (data) {
            imageUrl = data;
          }
        });
      }
      return imageUrl;
    },
  },
};
</script>

<style scoped>
</style>
