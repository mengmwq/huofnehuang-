
<template>
  <div>
    <el-row>
      <el-row type="flex" justify="space-between" :gutter="10" class="m10" >
        <el-col :span="18">
          <el-button v-if="priceStateId  !=='045'"
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="costDialogVisible = true;operate = 'add';addBudgetCostForm={}" >新增成本</el-button>
          <el-button v-if="priceStateId  !=='045'"
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="budgetDialogVisible = true" >新增预算组</el-button>
          <!--<router-link v-if="priceStateId  !=='045'" :to="{path:'/router/createTask', query: {id: projectCode, projectType: projectType, stateId: stateId, type: 'budget'}}">
            <el-button type="primary" size="medium" icon="el-icon-plus">新增预算任务</el-button>
          </router-link>-->
          <el-select
            v-model="budgetGroup"
            placeholder="选择预算组"
            size="medium"
            style="width: 200px;"
            @change="() => {loadBudgetCost(); loadOffer();}"
          >
            <el-option
              v-for="item in budgetGroupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-select
              v-model="offerCurrency"
              placeholder="货币单位"
              size="medium"
              style="width:120px;"
              @change="currencyChange"
            >
              <el-option
                v-for="item in currencyList"
                :key="item.value"
                :label="item.cnInfo"
                :value="item.value"
              ></el-option>
            </el-select>
          
        </el-col>
      </el-row>
      <!-- <el-row class="m10">
        
      </el-row>-->
      <el-table
        class="page-table"
        :data="listData"
         max-height="250"
        show-summary
        :summary-method="getSummaries"
        stripe
        highlight-current-row
        v-loading="listLoading"
        :cell-style="{color:'#333'}"
      >
      <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column
          v-for="(header, index) in tableHeader"
         
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :align="header.align"
          :column-key="header.prop"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="header.prop == 'company'">{{scope.row.company}}</div>
            <div v-else-if="header.prop == 'states'">
               {{getDictsKeyName(scope.row,'BudgetCostState',scope.row.states)}}
            </div>
            <div v-else-if="header.prop == 'type'">
               {{getDictsKeyName(scope.row,'BudgetCostType',scope.row.type)}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <!--cnCurrency-->
        <el-table-column label="操作" width="320" v-if="priceStateId  !=='045'">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="viewCost(scope.row)">查看</el-button>
            <el-button
              type="primary"
              size="small"
              
              @click="changeStates(scope.row)"
            >
              <span v-if="scope.row.states === '1'">取消采用</span>
              <span v-else>采用</span>
            </el-button>
            <el-button type="primary" size="small" v-if="scope.row.states === '0'" @click="changeStates(scope.row,'discard')" >废弃</el-button>
            <!--如果是预算任务提交产生的成本才允许重新报价-->
            <el-button
              v-if="scope.row.source === '1'"
              type="primary"
              size="small"
              @click="reCharge(scope.row)"
            >重新报价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-row type="flex" class="page-box" justify="end">
        <el-col :span="12">
          
        
        </el-col>
        <el-col :span="12" class="text-right">
           
        <el-pagination
          background
          layout="total,prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="5"
          :total="budgetCostQuery.total"
        ></el-pagination>
        </el-col>
      </el-row> -->
      <el-row class="text-center" v-if="priceStateId  !=='045'">
        <br />
        <el-button type="primary" size="medium" @click="createInsidePrice">生成内部报价单</el-button>
      </el-row>
    </el-row>

    <el-row>
      <el-row :gutter="20" class="m10"  v-if="priceStateId  !=='045'">
        <el-col :span="12">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="addReportPrice"
          >新增报价</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button type="primary" size="medium" @click="merge(multipleSelection)">合并</el-button>
        </el-col>
      </el-row>
      <el-table
        class="page-table"
        :data="listData2"
        show-summary
        :summary-method="getSummaries"
        stripe
        highlight-current-row
        v-loading="listLoading"
        :cell-style="{color:'#333'}"
        @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
        
        <el-table-column
          v-for="(header, index) in tableHeader2"
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :align="header.align"
          :min-width="header.width"
          :column-key="header.prop"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="header.prop == 'cnCurrency'">
              <!-- {{scope.row.cnCurrency | currencyFilter}} -->
              {{getDictsKeyName(scope.row,'Currency',scope.row.cnCurrency)}}
            </div>
            <div v-else-if="header.prop == 'profitMargin'">
              {{scope.row.profitMargin}}%
             
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="420"  v-if="priceStateId  !=='045'">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="updateOffer(scope.row)">编辑</el-button>
            <el-button
              type="primary"
              size="small"
              v-if="scope.$index !== 0"
              @click="mergeUp(scope.row)"
            >向上合并</el-button>
            <el-button
              type="primary"
              size="small"
              v-if="scope.$index !== 0"
              @click="move(scope.row, 1, scope.$index)"
            >上移</el-button>
            <el-button
              type="primary"
              size="small"
              v-if="scope.$index !== listData2.length-1"
              @click="move(scope.row, -1, scope.$index)"
            >下移</el-button>
            <el-button type="primary" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="text-center mt20">
       
        <!--addOfficialOffer-->
        <strong v-if="onLinePriceCode">模板编号：{{onLinePriceCode}}</strong>
        
        <el-button type="primary" size="medium" v-if="priceStateId  !=='045'" @click="checkOfferCurrency">生成正式报价</el-button>
      </el-row>
    </el-row>
     <!-- 正式报价 -->
     <el-row class="mt20">
        <ProjectOffer ref="projectOffer" :id="id" :type="type" :stateId="priceStateId" @priceTemplateChange="priceTemplateChange"></ProjectOffer>
     </el-row>
    <!-- 新增成本 -->
    <el-dialog
      :title="operate === 'add' ? '新增成本' : '查看成本'"
      :visible.sync="costDialogVisible"
      :close-on-click-modal="canClick"
      size="tiny"
      top="12vh"
      width="35%"
    >
      <div>
        <el-form
          :model="addBudgetCostForm"
          ref="addBudgetCostForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="成本名称：" prop="name">
            <el-input v-model="addBudgetCostForm.name" :disabled="operate === 'view'"></el-input>
          </el-form-item>
          <el-form-item label="货币单位：" prop="company">
            <el-select
              v-model="addBudgetCostForm.company"
              :disabled="operate === 'view'"
              placeholder="货币单位"
              size="medium"
              style="width: 100%;"
            >
              <el-option
                v-for="item in currencyList"
                :key="item.value"
                :label="item.cnInfo"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成本报价：" prop="price">
            <el-input v-model="addBudgetCostForm.price" :disabled="operate === 'view'"></el-input>
          </el-form-item>
          <!-- <el-form-item label="汇率：" prop="rate">
            <el-input v-model="addBudgetCostForm.rate" :disabled="operate === 'view'"></el-input>
          </el-form-item>
           <el-form-item label="兑换报价：" prop="">
            <el-input v-model="addBudgetCostForm.currency" readonly></el-input>
          </el-form-item>-->
          <el-form-item label="备注：">
            <el-input
              v-model="addBudgetCostForm.remark"
              :disabled="operate === 'view'"
              type="textarea"
              :rows="2"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px" v-if="operate === 'add'">
          <el-button type="primary" size="small" @click="cancelAddCost('addBudgetCostForm')">取 消</el-button>
          <el-button type="primary" size="small" @click="addBudgetCost('addBudgetCostForm')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新增预算组 -->
    <el-dialog
      title="新增预算组"
      :close-on-click-modal="canClick"
      :visible.sync="budgetDialogVisible"
      size="tiny"
      top="12vh"
      width="35%"
    >
      <div>
        <el-form :model="addBudgetGroupForm" label-width="120px">
          <el-form-item label="分组名称：">
            <el-input v-model="addBudgetGroupForm.groupName"></el-input>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="budgetDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="addBudgetGroup">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新增报价 -->
    <el-dialog
      :title="operateFlag === 'add'?'新增报价':'编辑报价'"
      :visible.sync="offerDialogVisible"
      :close-on-click-modal="canClick"
      size="tiny"
      top="12vh"
      width="50%"
    >
      <div>
        <el-form :model="addCostForm" ref="addCostForm" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12" v-if="operateFlag === 'add'">
              <el-form-item label="预算编号：" prop="budgetId" >
                <el-select
                  v-model="addCostForm.budgetId"
                  filterable
                  clearable
                  remote
                  :remote-method="remoteMethod"
                  placeholder="成本名称"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in costList"
                    @click.native="handleCostItem(item)"
                    
                    :key="item.code"
                    :label="item.code"
                    :value="item.code"
                  >
                    <span style="float: left">{{ item.code }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="operateFlag === 'add'">
              <el-form-item label="成本币种：">
                <el-select
                  v-model="addCostForm.cnCurrency"
                  disabled
                  placeholder="货币单位"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in currencyList"
                    :key="item.value"
                    :label="item.cnInfo"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="operateFlag === 'add'">
              <el-form-item label="成本汇率：">
                <el-input v-model="addCostForm.rate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="operateFlag === 'add'">
              <el-form-item label="成本价格：">
                <el-input v-model="addCostForm.price" readonly></el-input>
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="报价：" prop="quotationAmount">
                <el-input v-model="addCostForm.quotationAmount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇后价格：" v-if="operateFlag === 'add'">
                <el-input v-model="addCostForm.ratePrice" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="中文说明：" prop="cnDetailed">
            <el-input v-model="addCostForm.cnDetailed"></el-input>
          </el-form-item>

          <el-form-item label="英文说明：">
            <el-input v-model="addCostForm.usDetailed"></el-input>
          </el-form-item>
          <el-row></el-row>
          <el-row>
            
          </el-row>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="offerDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            v-if="operateFlag === 'edit'"
            @click="updateCost('addCostForm')"
          >确 定</el-button>
          <el-button type="primary" size="small" v-else @click="addCost('addCostForm')">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 合并 -->
    <el-dialog
      title="合并报价"
      :visible.sync="mergeDialogVisible"
      :close-on-click-modal="canClick"
      size="tiny"
      top="12vh"
      width="35%"
    >
      <div>
        <el-form :model="mergeForm" label-width="120px">
          <el-form-item label="中文明细：">
            <el-input v-model="mergeForm.cnDetailed"></el-input>
          </el-form-item>
          <el-form-item label="英文明细：">
            <el-input v-model="mergeForm.usDetailed"></el-input>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="mergeDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="confirmMerge">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 生成正式报价-->
    <el-dialog
      title="生成正式报价"
      :visible.sync="officialDialogVisible"
      :close-on-click-modal="canClick"
      @close="clearOfficialForm"
      size="small"
      top="12vh"
      width="50%"
    >
      <div>
        <el-form :model="officialForm" ref="officialForm" class="priceLabel" label-width="110px">
          <el-form-item label="所属分公司：">
           <el-select filterable v-model="officialForm.org" clearable placeholder="请选择" size="medium" style="width:150px">
            <el-option v-for="(item, index) in orgList"
                       :key="index"
                       :label="item.cnInfo"
                       :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="致敬：">
            <el-input v-model="officialForm.receiver"></el-input>
          </el-form-item>
          <el-form-item label="项目：">
            <span>{{officialForm.projectName}}</span>
          </el-form-item>
          <el-form-item label="报价人：">
            <el-input v-model="officialForm.offerPerson"></el-input>
          </el-form-item>
          <el-form-item label="日期：">
            <span>{{officialForm.offerDate | dateFormat}}</span>
          </el-form-item>
          
          <el-form-item label="报价描述：" class="editStyle">
            <quill-editor 
                        v-model="officialForm.offerDesc" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                    </quill-editor>
            <!-- <el-input
              type="textarea"
              :rows="3"
              :maxlength="1000"
              show-word-limit
              v-model="officialForm.offerDesc"
            ></el-input> -->
          </el-form-item>

          <el-row class="table">
            <el-row class="header" style="padding: 10px 50px;background: #222222;color:#fff">
              <el-col :span="20">报价明细</el-col>
              <el-col :span="4" class="text-center">来程</el-col>
            </el-row>
            <el-row
              style="padding: 12px 50px;border-bottom: 1px solid #efefef"
              v-for="(item, index) in listData2"
              :key="index"
            >
              <el-col :span="20">{{index + 1}}：{{item.cnDetailed}}</el-col>
              <el-col :span="4" class="text-center">{{item.quotationAmount}}</el-col>
            </el-row>
            <el-row class="foote" style="margin: 10px 0">
              <el-col :span="18" class="text-right">小计：</el-col>
              <el-col :span="6" class="text-center">{{officialForm.total}}</el-col>
            </el-row>
            <el-row class="footer mb10">
              <el-col :span="18" class="text-right">税费：</el-col>
              <el-col :span="6" class="text-center">
                <el-input v-model="officialForm.taxFee"></el-input>
              </el-col>
            </el-row>
            <el-row class="footer mb10">
              <el-col :span="18" class="text-right">合计：</el-col>
              <el-col :span="6" class="text-center">{{parseFloat(officialForm.allFee).toFixed(2)}}</el-col>
            </el-row>
            <!-- <el-row class="footer mb10">
              <el-col :span="18" class="text-right">实际成交价：</el-col>
              <el-col :span="6" class="text-center">
                <el-input v-model="officialForm.actualPay"></el-input>
              </el-col>
            </el-row> -->
          </el-row>
          <el-form-item label="额外报价项目：" class="editStyle">
            <quill-editor 
                        v-model="officialForm.extOfferProject" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                    </quill-editor>
            <!-- <el-input
              type="textarea"
              :rows="3"
              :maxlength="500"
              show-word-limit
              v-model="officialForm.extOfferProject"
            ></el-input> -->
          </el-form-item>
          <el-form-item label="报价明细内容：" class="editStyle">
            <quill-editor 
                        v-model="officialForm.offerDetailContent" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                    </quill-editor>
            <!-- <el-input
              type="textarea"
              :rows="3"
              :maxlength="500"
              show-word-limit
              v-model="officialForm.offerDetailContent"
            ></el-input> -->
          </el-form-item>
          <el-form-item label="备注：" class="editStyle">
            <quill-editor 
                        v-model="officialForm.remark" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                    </quill-editor>
            <!-- <el-input
              type="textarea"
              :rows="3"
              :maxlength="1000"
              show-word-limit
              v-model="officialForm.remark"
            ></el-input> -->
          </el-form-item>
          <el-row class="footer">
            <el-col :span="12" class="text-right">
              <el-form-item label="甲方签字：">
                <span></span>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="text-center">
              <el-form-item label="乙方签字：">
                <span></span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="officialDialogVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="commitofficial('officialForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 生成内部报价-->
    <ProjectInsidePrice
      v-if="isShowDialog"
      :selectedPriceTable="selectedPriceTable"
      :offCurrencyName="offCurrencyName"
      :isShowDialog="isShowDialog"
      @closeDialog="closeDialog"
      @changeDialog="addOffer"
    />
  </div>
</template>

<script>
import Api from "@/api/index";
import ProjectInsidePrice from "./ProjectInsidePrice";
import ProjectOffer from "./ProjectOffer";
import Util from "@/utils/";
export default {
  name: "ProjectBudget",
  components: {
    ProjectInsidePrice,ProjectOffer
  },
  computed:{
    orgList(){
      return this.$store.state.dictionary.dists.ORG_TYPE.children;
    },
  },
  data() {
    return {
      editorOption:{
          modules:{
              toolbar:[
                //['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['bold', 'italic'],
                // ['blockquote', 'code-block'],
                //[{ 'list': 'ordered'}, { 'list': 'bullet' }], //列表 - list 
                //[{ 'indent': '-1'}, { 'indent': '+1' }],  //缩进 - indent
                // [{ 'direction': 'rtl' }], //文本方向 - direction

                [{ 'size': ['small', false, 'large', 'huge'] }], 
                [{ 'color': [] }], 
                // [{ 'font': [] }],
                // [{ 'align': [] }],
                ['clean']
              ]
          }
      },
      //生成内部报价
      isShowDialog: false,
      selectedPriceTable: [],
      canClick: false,
      operate: "",
      projectCode: "",
      projectType: "",
      /** 添加预算组表单 */
      addBudgetGroupForm: {},
      /** 选择的预算组 */
      budgetGroup: null,
      /** 预算组列表 */
      budgetGroupList: [],
      /** 预算成本查询条件 */
      budgetCostQuery: {
        groupId: "",
        pageNum: 1,
        pageSize: 200,
        total: 0
      },
      /** 添加成本表单 */
      addBudgetCostForm: {},
      /** 添加报价表单 */
      addCostForm: {
        rate: "",
        ratePrice: "",
        price: "",
        cnCurrency:'',
        cnDetailed:'',
        usDetailed:'',
        budgetId:'',
        quotationAmount:''

      },
      officialForm: {},
      /** 币种列表 */
      currencyList: [],
      form: {},
      rules: {
        name: [{ required: true, message: "请填写成本名称", trigger: "blur" }],
        company: [
          { required: true, message: "请选择货币单位", trigger: "blur" }
        ],
        needWrite: [{ required: true, message: "不为空", trigger: "blur" }],
        price: [{ required: true, message: "请填写成本报价", trigger: "blur" }],
        quotationAmount: [
          { required: true, message: "不为空", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" }
        ],
        // usDetailed: [{ required: true, message: "不为空", trigger: "blur" }],
        budgetId: [{ required: true, message: "不为空", trigger: "blur" }],
        cnDetailed: [{ required: true, message: "不为空", trigger: "blur" }],
        cnCurrency: [{ required: true, message: "不为空", trigger: "blur" }]
      },
      mergeForm: {},
      //priceStateId:'',
      listLoading: false,
      costDialogVisible: false,
      budgetDialogVisible: false,
      offerDialogVisible: false,
      mergeDialogVisible: false,
      officialDialogVisible: false,
      tableHeader: [
        {
          prop: "code",
          label: "预算编号",
          show: true
        },
        {
          prop: "states",
          label: "生效状态",
          align: "center",
          show: true
        },
        {
          prop: "name",
          label: "成本名称",
          align: "center",
          show: true
        },
        {
          prop: "type",
          label: "类型",
          align: "type",
          show: true
        },
        {
          prop: "price",
          label: "成本报价",
          align: "center",
          show: true
        },
        {
          prop: "company",
          label: "成本币种",
          align: "center",
          show: true
        },
        {
          prop: "remark",
          label: "备注",
          align: "center",
          show: true
        }
      ],
      tableHeader2: [
        {
          prop: "cnDetailed",
          label: "报价明细",
          show: true
        },
        {
          prop: "quotationAmount",
          label: "报价金额",
          align: "center",
          show: true
        },
        {
          prop: 'cost',
          label: '成本报价',
          align: 'right',
          show: true
        },
        // {
        //   prop: "cnCurrency",
        //   label: "币种",
        //   align: "center",
        //   show: true
        // },
        {
          prop: "costCode",
          label: "成本编号",
          align: "center",
          show: true
        },
        {
          prop: "profit",
          label: "利润",
          align: "center",
          show: true
        },
        {
          prop: "profitMargin",
          label: "利润率",
          align: "center",
          show: true
        }
      ],
      listData: [],
      listData2: [],
      multipleSelection: [],
      costList: [],
      currentItem: "",
      operateFlag: "",
      templateType: "",
      stateId: "",
      onLinePriceCode:'',
      officialTotal:0,
    };
  },
  props: {
    projectName: String,
    id: String,
    type: String,
    offerCurrency:String,
    offCurrencyName:String,
    projectDetails:Object,
    priceStateId:String
  },
  watch: {
    //计算汇后价格
    // "addCostForm.rate": function(val) {
    //   const addCostForm = this.addCostForm;
    //   const taxRate = addCostForm.rate;
    //   if (taxRate) {
    //     this.addCostForm.ratePrice = (val * taxRate).toFixed(2);
    //   }
    // },
    // //计算税后
    "addCostForm.rate": function(val) {
      const addCostForm = this.addCostForm;
      const price = addCostForm.price;
      if (price) {
        this.addCostForm.ratePrice = (val * price).toFixed(2);
      }
    },
    id: function(value) {
      this.projectCode = value;
      if (this.projectCode) {
        this.loadBudgetGroup();
      }
    },
    priceStateId: function(value) {
      this.priceStateId = value;
    },
    type: function(value) {
      this.projectType = value;
    },
    projectName: function(value) {
      this.officialForm.projectName = value;
    },
    "officialForm.taxFee": function(value) {
      if (value) {
        //this.officialForm.allFee = this.officialForm.total + parseFloat(value);
        this.officialForm.allFee = this.officialTotal + parseFloat(value);
      } else {
        //this.officialForm.allFee = this.officialForm.total;
        this.officialForm.allFee = this.officialTotal
      }
    }
  },
  mounted() {
    this.stateId = this.$route.query.stateId;
    this.officialForm.projectCode = this.$route.query.id;
    //this.officialForm.offerDate = new Date().getTime();
    // 从数据字典获取币种下拉框数据
    if (sessionStorage.getItem("dists")) {
      let distsObj = JSON.parse(sessionStorage.getItem("dists"));
      if (distsObj.Currency) {
        this.currencyList = distsObj.Currency.children;
      }
    }
  },
  methods: {
    onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
        saveHtml:function(event){
          alert(this.content);
        },
    //获取正式报价详情
    getPriceDetails (id) {
        Api.previewOffer({id:id}).then(res => {
         console.log(res,'this.officialForm')
          let result = res.offerExtend;
          delete result.allFee
          console.log(result,'this.offerExtend')
          this.officialForm = result
        });
      },
    // 正式报价模板改变
    priceTemplateChange(val){
       this.onLinePriceCode = val?val.code:'';
       if(val){
            //获取正式报价详情
          this.getPriceDetails(val.id)
       }
     
       //this.officialForm = val&& val;
    },
    addReportPrice(){
      this.operateFlag = 'add'
      this.addCostForm= {
        rate: "",
        company: "",
        ratePrice: "",
        price: "",
        cnDetailed:'',
        usDetailed:'',
        budgetId:'',
        quotationAmount:''
      }
      this.offerDialogVisible = true;
    },
    currencyChange(){
      this.$emit('currencyChange',this.offerCurrency)
    },
    handleCostItem(item) {
      this.addCostForm.rate = item.rate ? item.rate : "";
      this.addCostForm.price = item.price;
      this.addCostForm.cnCurrency = item.company?item.company:'';
      this.addCostForm.ratePrice = parseFloat(item.price * item.rate).toFixed(2);
      console.log(item,this.addCostForm)
    },
    getDictsKeyName(row, key, val) {
      return Util.getDictsKeyName(row, key, val);
    },
    // 生成内部报价
    createInsidePrice() {
      //是否选择预算组
      if (!this.budgetGroup) {
        this.$notify.success({
          title: "提示",
          message: "请选择预算组"
        });
        return;
      }
      const selected = this.listData.filter(item => item.states === "1");
      console.log(selected, "selected");
      if (selected.length > 0) {
        this.isShowDialog = true;
        this.selectedPriceTable = selected
        // this.selectedPriceTable = selected.map(item=>{
        //   item.rate = 1
        //   return item;
        // });
      } else {
        this.$notify({
          title: "提示",
          type: "warning",
          message: "请选择至少采用一条成本记录!"
        });
      }
    },
    changeDialog() {
      this.closeDialog();
    },
    closeDialog() {
      this.isShowDialog = false;
    },
    //模糊搜索预算编码
    remoteMethod(query = "") {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        Api.budgetCostPage({
          groupId: this.budgetGroup,
          pageNum: 1,
          pageSize: 10,
          name: query
        }).then(data => {
          if (data) {
            this.costList = data.records;
          }
        });
      }, 200);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计：";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (
          (column.property == "price" ||
            column.property == "quotationAmount" ||
            column.property == "profit") &&
          !values.every(value => isNaN(value))
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += ' 元';
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    /**
     * 重新报价
     * */
    reCharge(item) {
      this.$confirm("您确定要对【" + item.name + "】重新报价吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Api.copyTask({ id: item.taskId }).then(res => {
            if (res) {
              this.$notify.success({
                title: "提示",
                message: "重新报价成功"
              });
              this.loadBudgetCost();
            } else {
              this.$notify.warning({
                title: "提示",
                message: "报价失败"
              });
            }
          });
        })
        .catch(() => {});
    },
    viewCost(item) {
      if (item.taskId) {
        // 任务类型
        let type = item.type;
        let taskId = item.taskId;
        // 任务模板类型
        this.templateType = item.taskType;
        switch (this.templateType) {
          case "001":
            // 包装任务
            this.$router.push({
              path: "/router/baoZhuangTaskCommit",
              query: {
                id: taskId,
                type: type,
                templateType: this.templateType,
                tag: "view"
              }
            });
            break;
          case "002":
            // 外勤任务
            this.$router.push({
              path: "/router/outSideTaskCommit",
              query: {
                id: taskId,
                type: type,
                templateType: this.templateType,
                tag: "view"
              }
            });
            break;
          case "003":
            // 报关任务
            this.$router.push({
              path: "/router/baoGuanTaskCommit",
              query: {
                id: taskId,
                type: type,
                templateType: this.templateType,
                tag: "view"
              }
            });
            break;
        }
      } else {
        this.costDialogVisible = true;
        this.addBudgetCostForm = item;
        this.operate = "view";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 加载预算组
     */
    loadBudgetGroup() {
      Api.budgetGroupList({
        projectCode: this.projectCode
      }).then(data => {
        this.budgetGroupList = data;
        if (data.length > 0) {
          this.budgetGroup = data[0].id;
          this.loadBudgetCost();
          this.loadOffer();
        }
      });
    },
    /**
     * 加载预算成本
     */
    loadBudgetCost() {
      this.budgetCostQuery.groupId = this.budgetGroup;
      Api.budgetCostPage(this.budgetCostQuery).then(data => {
        if (data) {
          this.listData = data.records;

          this.budgetCostQuery.total = data.total;
          let _this = this;
          this.listData.forEach(function(item) {
            // if (item.taskId) {
            //   if (item.price !== 0) {
            //     _this.$set(item, "canUse", true);
            //   } else {
            //     _this.$set(item, "canUse", false);
            //   }
            // } else {
            //   if (item.price !== 0) {
            //     _this.$set(item, "canUse", true);
            //   } else {
            //     _this.$set(item, "canUse", false);
            //   }
            // }
          });
        }
      });
      // 加载预算下拉列表
      this.remoteMethod();
    },
    /**
     * 添加预算组
     */
    addBudgetGroup() {
      this.addBudgetGroupForm.projectCode = this.projectCode;
      Api.addBudgetGroup(this.addBudgetGroupForm).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "添加预算组成功"
          });
          this.loadBudgetGroup();
          this.budgetDialogVisible = false;
        }
      });
    },
    /**
     * 检查报价币种是否一致接口
     * true代表一致，false代表不允许报价，要重新修改币种
     * */
    checkOfferCurrency() {
      
      Api.checkOfferCurrency({ budgetGroupId: this.budgetGroup }).then(data => {
        if (data) {
          console.log(this.projectDetails.createDt,'ddd')
          //生成正式报价时，回显项目名称与项目创建时间；
          this.officialForm.projectName = this.projectDetails.projectName
          this.officialForm.offerDate = this.projectDetails.createDt
          this.officialDialogVisible = true;
        } else {
          this.$notify.warning({
            title: "提示",
            message: "币种不一致，不允许报价"
          });
        }
      });
    },
    commitofficial(forName) {
      this.$refs[forName].validate(valid => {
        if (valid) {
          if (!this.budgetGroup) {
            this.$notify.success({
              title: "提示",
              message: "请选择预算组"
            });
            return;
          }
          this.officialForm.budgetGroupId = this.budgetGroup;
          this.officialForm.projectCode = this.$route.query.id;
          Api.addOfficialOffer(this.officialForm).then(data => {
            if (data) {
              this.$notify.success({
                title: "提示",
                message: "生成正式报价成功"
              });
              this.officialDialogVisible = false;
              this.$refs.projectOffer.loadData()
            }
          });
        } else {
          return false;
        }
      });
    },
    clearOfficialForm() {
      if(!this.onLinePriceCode){
        this.officialForm = {};
      } 
      
    },
    /**
     * 添加成本
     */
    addBudgetCost(forName) {
      this.$refs[forName].validate(valid => {
        if (valid) {
          this.addBudgetCostForm.groupId = this.budgetGroup;
          Api.addBudgetCost(this.addBudgetCostForm).then(data => {
            if (data) {
              this.$notify.success({
                title: "提示",
                message: "添加成本成功"
              });
              this.loadBudgetCost();
              this.costDialogVisible = false;
              this.addBudgetCostForm = {};
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelAddCost(forName) {
      this.addBudgetCostForm = {};
      this.costDialogVisible = false;
    },
    //处理报价状态
    handlePriceStates(id,str,states){
      Api.budgetCostChangeState({
        id: id,
        states: states
      }).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: str + "成功"
          });
          this.loadBudgetCost();
        }
      });
    },
    /**
     * 改变状态，采用，废弃
     */
    changeStates(row,flag) {
      let str='',states='';
      if(flag=='discard'){
        str = '废弃'
        states = "2"
      }else{
         str = row.states === "0" ? "采用" : "取消采用";
         states = row.states === "0" ? "1" : "0"
      }
      if(flag=='discard'){
        this.$confirm(`您确定要将报价【${row.name}】记录废弃吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         
        })
        this.$prompt('请输入废弃原因', `确定将报价【${row.name}】记录废弃`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.handlePriceStates(row.id,str,states)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      }else{
        this.handlePriceStates(row.id,str,states)
      }
      
      
      
    },
    /**
     * 生成内部报价
     */
    addOffer(val) {
      
      if (!this.budgetGroup) {
        this.$notify.success({
          title: "提示",
          message: "请选择预算组"
        });
        return;
      }
      
      Api.addOffer({
        budgetGroupId: this.budgetGroup,
        costs:val
      }).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "生成内部报价成功"
          });
          this.closeDialog();
          this.loadOffer();
        }
      });
    },
    /**
     * 添加预算
     * */
    addCost(formName) {
      Api.newOffer(this.addCostForm).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "添加成功"
          });
          this.addCostForm = {
            taxRate: 1,
            afterTax: ""
          };
          this.offerDialogVisible = false;
          this.loadOffer();
        }
      });
    },
    /**
     * 编辑报价
     * */
    updateOffer(item) {
      this.operateFlag = "edit";
      // this.currentItem = item
      this.addCostForm = item;
      this.offerDialogVisible = true;
    },
    updateCost(formName) {
      // this.addCostForm.id = this.currentItem.id
      Api.updateOffer(this.addCostForm).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "编辑成功"
          });
          this.offerDialogVisible = false;
          this.loadOffer();
        }
      });
    },
    /**
     * 加载内部报价
     */
    loadOffer() {
      Api.offerDetailByBudgetGroupId({
        budgetGroupId: this.budgetGroup
      }).then(data => {
        if (data) {
          this.listData2 = data;
          let total = 0;
          this.listData2.forEach(function(item) {
            total += parseFloat(item.quotationAmount);
          });
          // _this.$set(item, 'total',)
         // this.officialForm.total = total;
          this.officialTotal = total;
          this.officialForm.allFee = parseFloat(total).toFixed(2);
        }
      });
    },
    /**
     * 移动
     */
    move(item, tag, index) {
      let param = {
        firstForeignReq: {
          id: item.id,
          sequenceNumber: item.sequenceNumber
        },
        secondForeignReq: {
          id: "",
          sequenceNumber: ""
        }
      };
      let item1 = {};
      if (tag === 1) {
        item1 = this.listData2[index - 1];
      } else {
        item1 = this.listData2[index + 1];
      }
      param.secondForeignReq.id = item1.id;
      param.secondForeignReq.sequenceNumber = item1.sequenceNumber;

      Api.offerMove(param).then(data => {
        if (data) {
          this.loadOffer();
        }
      });
    },
    /**
     * 删除
     */
    del(item) {
      this.$confirm(`确认删除【${item.cnDetailed}】吗？`, "提示", {
        type: "warning"
      })
        .then(() => {
          Api.deleteOfferDetail({
            id: item.id
          }).then(data => {
            if (data) {
              this.$notify.success({
                title: "提示",
                message: "删除成功"
              });
              this.loadOffer();
            }
          });
        })
        .catch(err => {});
    },
    /**
     * 向上合并
     */
    mergeUp(row) {
      let ids = [];
      for (let i = 0; i < this.listData2.length; i++) {
        let item = this.listData2[i];
        if (item === row) {
          ids.push(item);
          break;
        } else {
          ids = [item];
        }
      }
      this.merge(ids);
    },
    /**
     * 合并
     */
    merge(ids) {
      if (ids.length <= 1) {
        this.$notify.info({
          title: "提示",
          message: "请选择2个及以上报价"
        });
        return;
      }
      this.mergeForm.ids = [];
      ids.forEach(item => {
        this.mergeForm.ids.push(item.id);
      });
      this.mergeDialogVisible = true;
    },
    /**
     * 确定合并
     */
    confirmMerge() {
      Api.offerMergeOrUpdate(this.mergeForm).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "合并成功"
          });
          this.loadOffer();
          this.mergeDialogVisible = false;
        }
      });
    },
    handleSizeChange(val) {
      this.budgetCostQuery.pageSize = val;
      this.loadBudgetCost();
    },
    handleCurrentChange(val) {
      this.budgetCostQuery.pageNum = val;
      this.loadBudgetCost();
    }
  }
};
</script>
<style lang="scss">
  .editStyle  .el-form-item__content{
   line-height: 24px;
}
</style>