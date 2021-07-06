<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title">
          <span class="step-icon">1</span>基本信息：
        </p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编码" v-if="$route.query.flag=='myApply'">
                <span>{{form.projectCode}}</span>
              </el-form-item>
              <el-form-item v-else label="项目编码：" prop="projectCode">
                <el-select
                  filterable
                  v-model="form.projectCode"
                  remote
                  :remote-method="remoteMethod"
                  clearable
                  placeholder="项目名称/编号/客户名称"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    @click.native="handleProjectName(item)"
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectCode"
                    :value="item.projectCode"
                  >
                    <span style="float: left">{{ item.projectName }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.projectCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号：" prop="contractCode">
                <span v-if="$route.query.flag=='myApply'">{{form.contractCode}}</span>
                <el-select
                  v-else
                  filterable
                  clearable
                  style="width:100%"
                  v-model="form.contractCode"
                  placeholder="合同号"
                >
                  <el-option
                    v-for="(item, index) in contractList"
                    @click.native="handleContractCode(item)"
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
              <el-form-item label="申请人：" prop="applyerId">
                <el-select
                  filterable
                  clearable
                  v-model="form.applyerId"
                  placeholder="申请人"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.uName"
                    :value="item.uId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请部门：" prop="orgId">
                <el-select
                  filterable
                  v-model="form.orgName"
                  placeholder="申请部门"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    :value="orgId"
                    :label="orgName"
                    style="height: 300px;overflow-y: scroll;padding: 0"
                  >
                    <el-tree
                      :data="treeData"
                      default-expand-all
                      show-checkbox
                      node-key="orgId"
                      ref="orgTree"
                      :props="{label: 'orgName', children: 'childrens'}"
                      :check-strictly="true"
                      @check-change="handleClick"
                      @node-click="nodeClick"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人员数量：" prop="peopleNumber">
                <el-input v-model="form.peopleNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请日期：" prop="applyDate">
                <el-date-picker
                  v-model="form.applyDate"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计天数：" prop="daysNumber">
                <el-input v-model="form.daysNumber"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="领用人：" prop="payeeId">
                <el-select
                  filterable
                  v-model="form.payeeId"
                  clearable
                  placeholder="申请人"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(item, index) in userList"
                    :key="index"
                    :label="item.uName"
                    :value="item.uId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remarks">
                <el-input
                  type="textarea"
                  :rows="3"
                  show-word-limit
                  placeholder="请输入内容"
                  v-model="form.remarks">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>-->
        </div>
        <p class="step-title">
          <span class="step-icon">2</span>费用明细：
        </p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="币种：" prop="currency">
                <el-select
                  filterable
                  style="width:100%"
                  clearable
                  v-model="form.currency"
                  placeholder
                >
                  <el-option
                    v-for="(item, index) in currencyTypeList"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：" prop="rate">
                <el-input v-model="form.rate" maxlength="9" @change="calcAmount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table
            class="page-table ml10 mb10"
            :data="listData"
            show-summary
            :summary-method="getSummaries"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{color:'#333'}"
          >
            <el-table-column
              v-for="(header, index) in tableHeader"
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
                <div v-if="header.prop == 'loanReason'">
                  <el-input v-model="scope.row.loanReason"></el-input>
                </div>
                <div v-else-if="header.prop == 'rechargingAmount'">
                  <el-input-number
                    v-model="scope.row.rechargingAmount"
                    controls-position="right"
                    style="width:100px;"
                    :min="0"
                    @change="calcPrice(scope.row.rechargingAmount, scope.$index, 'listData', 'rechargingAmount')"
                    @blur="calcPrice(scope.row.rechargingAmount, scope.$index, 'listData', 'rechargingAmount')"
                  ></el-input-number>
                </div>
                <div v-else-if="header.prop == 'cashAmount'">
                  <el-input-number
                    v-model="scope.row.cashAmount"
                    controls-position="right"
                    style="width:100px;"
                    :min="0"
                    @change="calcPrice(scope.row.cashAmount, scope.$index, 'listData', 'cashAmount')"
                    @blur="calcPrice(scope.row.cashAmount, scope.$index, 'listData', 'cashAmount')"
                  ></el-input-number>
                </div>
                <div v-else-if="header.prop == 'amount'">
                  <el-input-number
                    v-model="scope.row.amount"
                    controls-position="right"
                    style="width:100px;"
                    :min="0"
                    @change="calcAmountPrice(scope.row.amount, scope.$index, 'listData', 'amount')"
                    @blur="calcAmountPrice(scope.row.amount, scope.$index, 'listData', 'amount')"
                  ></el-input-number>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="80">
              <template slot="header">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteItem(scope.$index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合计金额：" prop="amount">
                <el-input v-model="form.amount" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <p class="step-title">
          <span class="step-icon">3</span>单据上传：
        </p>
        <div class="dash-content">
          <div class="ml10">
            <div class="text-right mb10">
              <el-button type="primary" size="small" @click="dialogVisible=true">+ 文件上传</el-button>
            </div>

            <el-table
              class="page-table"
              :data="form.applyAttachmentReqs"
              stripe
              highlight-current-row
              :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <template v-for="(header, index) in tableHeaderAttachments">
                <el-table-column
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
                  <!-- <template slot-scope="scope">
                  <div v-if="header.prop == 'type'">
                      {{getDistsKeyName(scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                  </template>-->
                </el-table-column>
              </template>

              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <template v-if="scope.row.attachmentUrlKey">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="showFileDetails(scope.row.attachmentUrlKey)"
                      v-if="isHasImg(scope.row.attachmentUrlKey)"
                    >预览图片</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="showFileDetails(scope.row.attachmentUrlKey)"
                      v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1"
                    >预览PDF</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      v-else
                      @click="showFileDetails(scope.row.attachmentUrlKey)"
                    >下载文件</el-button>
                  </template>
                  <el-button
                    type="primary"
                    size="small"
                    @click="deleteFileItem(scope.row,scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <p class="step-title">
          <span class="step-icon">4</span>选择抄送人：
        </p>
        <el-form-item label="抄送人：">
          <el-select
            filterable
            clearable
            multiple
            remote
            :remote-method="getPersonList"
            @remove-tag="removeCopyGive"
            v-model="form.copyGiveName"
            placeholder="可模糊搜索"
            style="width: 500px"
          >
            <el-option
              v-for="(item,index) in personList"
              @click.native="handleSelectedCustomer(item)"
              :key="index"
              :label="item.uName"
              :value="item.uName"
            ></el-option>
          </el-select>
          <span class="text-info">用于跨部门审批</span>
        </el-form-item>
      </div>
      <!-- 打印内容结束 -->
      <div class="tar mt20">
        <el-button type="default" size="medium" @click="goBack">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 0)">提 交</el-button>
        <el-button
          type="primary"
          size="medium"
          v-if="!this.$route.query.id"
          @click="submitForm('form', 1)"
        >提交后继续创建</el-button>
      </div>
    </el-form>
    <ImgPreview
      :pictures="pictures"
      :isShowDialog="isShowDialogImg"
      :isFullscreen="false"
      v-if="isShowDialogImg"
      @closeDialog="closeDialogImg"
    />
    <file-upload
      v-show="dialogVisible"
      :isShowDialog="dialogVisible"
      :fileTyeArr="fileTypeList"
      :hasCallBack="hasCallBack"
      :callBackName="callBackName"
      @getUploadFile="getUploadFile"
      @closeDialog="closeDialog"
    ></file-upload>
  </div>
</template>

<script>
import FileUpload from "@/components/common/FileUpload";
import ImgPreview from "@/components/common/ImgPreview";
import moment from "moment";
import Api from "@/api/index";
import rules from "@/utils/rules";

export default {
  name: "BorrowApply",
  components: {
    //FileListMultiUpload,
    FileUpload,
    ImgPreview,
  },
  computed: {
    currencyTypeList() {
      return this.$store.state.dictionary.dists.Currency.children;
    },
  },
  data() {
    const userInfo = JSON.parse(sessionStorage.getItem("jwt"));

    const projectCode = this.$route.query.projectCode;
    return {
      userInfo: userInfo,
      //附件上传
      hasCallBack: true,
      callBackName: "getUploadFile",
      dialogVisible: false,
      fileTypeList: [],

      tableHeaderAttachments: [
        {
          prop: "name",
          align: "center",
          label: "名称",
          width: "100",
          show: true,
        },
        // {
        //   prop: 'type',
        //   align: 'center',
        //   label: '文件类型',
        //   width: '200',
        //   show: true
        // },
        {
          prop: "description",
          align: "center",
          label: "文件描述",
          width: "200",
          show: true,
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
      isShowDialogImg: false,
      pictures: null,
      personList: [],
      copyGiveList: [],
      /** 项目列表 */
      projectList: [],
      // 审批流程列表
      shenPiList: [],
      // 审批部门
      treeData: [],
      contractList: [],
      userList: [],
      orgName: "",
      orgId: "",
      flag: false,
      removedAll: false,
      type: "",
      form: {
        currency: "001",
        rate: "1",
        amount: "",
        payment: "",
        applyAttachmentReqs: [],
        projectCode: projectCode ? projectCode : "",
        applyDate: null,
        applyerId: "",
        approvalProcessId: "",
        bidId: "",
        chineseAmount: "",
        contractId: "",
        contractCode: "",
        copyGiveName: [],
        copyGives: [],
        daysNumber: 0,
        id: "",
        loanApplyDetailReqs: [],
        orgId: "",
        orgName: "",
        payeeId: "",
        peopleNumber: 0,
        remarks: "",
      },
      /** 表格 loading */
      listLoading: false,
      rules: {
        payeeId: [
          { required: true, message: "请选择领用人", trigger: "change" },
        ],
        approvalProcessId: [
          { required: true, message: "请选择审批流程", trigger: "change" },
        ],
        amount: [
          {
            required: true,
            message: "请填写费用明细表，此项由费用明细汇总所得",
            trigger: "change",
          },
          {
            pattern: /^\d+(\.\d{1,4})?$/,
            message: "请输入数字，小数点后最多四位",
          },
        ],
        peopleNumber: [
          { required: false, message: "请填写数量", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" },
        ],
        daysNumber: [
          { required: false, message: "请填写数量", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "请输入数字类型" },
        ],
      },
      listData: [],
      tableHeader: [
        {
          prop: "loanReason",
          label: "借款事由",
          align: "center",
          show: true,
        },
        {
          prop: "rechargingAmount",
          label: "充值金额",
          align: "center",
          show: true,
        },
        {
          prop: "cashAmount",
          label: "现金预支",
          align: "center",
          show: true,
        },
        {
          prop: "amount",
          label: "金额",
          align: "center",
          show: true,
        },
        {
          prop: "remarks",
          label: "备注",
          align: "center",
          show: true,
        },
      ],
      operate: "",
      fileList: [],
    };
  },
  watch: {
    listData: {
      handler: function () {
        this.sumAmount();
      },
      deep: true,
    },
    "form.amount": function (value) {
      if (value) {
        this.changeMoneyToChinese(value);
      }
    },
    "form.currency": function (value) {
      const rate = this.form.rate;
      if (value !== "001" && rate == "1") {
        this.form.rate = "";
      } else if (value === "001") {
        this.form.rate = "1";
      }
    },
       //form.projectCode 值改变   nInfo--改变后的值,oldInfo--改变前的值
    'form.projectCode'(nInfo,oldInfo){
      // 如果新的值没有
      if(!nInfo){
        // 调用方法-里面是一个对象 用的projectCode字段
        this.pageContract({
          projectCode:''
        })
      }
    }
  },
  mounted() {
    console.log(this.userInfo, "hehehh ");
    this.$set(this.form, "applyerId", this.userInfo.uName);
    this.form.orgName = this.userInfo.orgName;
    this.operate =
      this.$route.path === "/router/editBorrowApplication" ? "edit" : "add";
    // 项目列表
    this.remoteMethod();
    //获取抄送人列表
    this.getPersonList();
    // 申请部门
    Api.getTreeFormOrgInfo().then((data) => {
      if (data) {
        this.treeData = data;
      }
    });
    // 查询合同
    Api.pageContract({ pageSize: 50000, pageNum: 1, projectCode: this.projectCode }).then((data) => {
      if (data) {
        this.contractList = data.records;
      }
    });
    // 客户列表
    Api.getUserPage({ pageSize: 50000, pageNum: 1 }).then((res) => {
      if (res) {
        this.userList = res.records;
      }
    });
    if (this.operate === "edit") {
      this.loadData();
    }
  },
  methods: {
    handleProjectName(item) {
       this.$set(this.form,'contractCode','')
      // console.log(item, "dd");
      this.projectCode = item.projectCode
      this.form.projectName = item.projectName;
       Api.pageContract({ pageSize: 50000, pageNum: 1, projectCode: this.projectCode }).then((data) => {
      if (data) {
        this.contractList = data.records;
      }
    });
    },
    handleContractCode(item) {
      this.form.contractId = item.contractId;
      //this.form.contractId = item.contractId
    },
    // 删除撑着抄送人
    removeCopyGive(val) {
      console.log(val);
      this.copyGiveList = this.copyGiveList.filter((item) => item.uName != val);
    },

    //获取抄送人
    getPersonList(query = "") {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
          pageNum: 1,
          pageSize: 10,
          name: query,
        };
        Api.getUserPage(params).then((res) => {
          this.personList = res.records;
        });
      }, 200);
    },

    handleSelectedCustomer(user) {
      if (!this.copyGiveList.some((item) => item.uId === user.uId)) {
        this.copyGiveList.push({
          uId: user.uId,
          uName: user.uName,
        });
      }
    },
    getAmountNum(arr, attr) {
      const values = arr.map((item) => Number(item[attr]));
      console.log(values, "values");
      if (!values.every((value) => isNaN(value))) {
        console.log(values, "values");
        return values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
      } else {
        return 0;
      }
    },
    //计算总合计
    sumAmount() {
      //各费用明细求和
      const applyFeeAmount = this.getAmountNum(this.listData, "amount");

      console.log(this.listData);
      const amount = parseFloat(applyFeeAmount).toFixed(2);
      this.form.payment = amount;
      console.log(amount, "amount3");
    },
    //关闭图片预览；
    closeDialogImg() {
      this.isShowDialogImg = false;
    },
    // 判断是否图片
    isHasImg(key) {
      const aFileType = [".jpg", ".jpeg", ".png"];
      return aFileType.some(
        (item) => key.toLowerCase().lastIndexOf(item) != -1
      );
    },
    //文件预览处理
    showFileDetails(key) {
      let img = "";
      Api.getUrl(key).then((data) => {
        if (data) {
          if (this.isHasImg(key)) {
            //图片预览处理；
            img = data;
            this.pictures = [];
            this.pictures.push(img);
            this.isShowDialogImg = true;
          } else {
            //除图片的其他文件；
            window.open(data);
          }
        }
      });
    },
    getDistsKeyName(type) {
      return this.fileTypeList.filter((item) => item.value == type)[0].cnInfo;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    getUploadFile(form) {
      //子组件form 提交过来的参数
      /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
      let _this = this;
      this.form.applyAttachmentReqs.push({
        name: form.fileName,
        attachmentUrlKey: form.key,
        type: form.type,
        description: form.description,
        //size: _this.renderSize(form.size)
      });
    },
    //删除报关附件
    deleteFileItem(row, index) {
      if (row.id) {
        const params = {
          id: row.id,
        };
        Api.deleteAttachment(params).then((res) => {
          this.form.applyAttachmentReqs.splice(index, 1);
        });
      } else {
        this.form.applyAttachmentReqs.splice(index, 1);
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计：";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (
          column.property !== "remarks" &&
          !values.every((value) => isNaN(value))
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    remoteMethod(query = "") {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
          pageNum: 1,
          pageSize: 10,
          searchStr: query,
          myProjectList: false,
        };
        Api.projectList(params).then((res) => {
          console.log(res, "resss");
          this.projectList = res.records;
        });
      }, 200);
    },
    calcPrice(value, index, tag, key) {
      if (tag === "listData") {
        this.listData[index][key] = parseFloat(value).toFixed(2);
      }
    },
    //验证是否是数字
    isNumber(obj) {
      return obj === +obj;
    },
    calcAmount() {
      if (this.listData.length > 0) {
        const amount = this.listData.map((item) => item.amount);
        const newAmount = amount.reduce((prev, cur) => {
          return parseFloat(prev) + parseFloat(cur);
        });

        const rate = parseFloat(this.form.rate);
        if (this.isNumber(rate)) {
          this.form.amount = (newAmount * rate).toFixed(2);
        } else
          this.$notify.warning({
            title: "提示",
            message: "请输入正确的汇率信息！",
          });
      } else {
        this.form.amount = "";
        this.form.chineseAmount = "";
      }
    },
    calcAmountPrice(value, index, tag, key) {
      if (tag === "listData") {
        this.listData[index][key] = parseFloat(value).toFixed(2);
        this.calcAmount();
      }
    },
    changeMoneyToChinese(money) {
      let cnNums = new Array(
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖"
      ); //汉字的数字
      let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
      let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
      let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
      //let cnInteger = "整"; //整数金额时后面跟的字符
      let cnIntLast = "元"; //整型完以后的单位
      let maxNum = 999999999999999.9999; //最大处理的数字

      let IntegerNum; //金额整数部分
      let DecimalNum; //金额小数部分
      let ChineseStr = ""; //输出的中文金额字符串
      let parts; //分离金额后用的数组，预定义
      if (money == "") {
        return "";
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        $.alert("超出最大处理数字");
        return "";
      }
      if (money == 0) {
        //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
        ChineseStr = cnNums[0] + cnIntLast;
        //document.getElementById("show").value=ChineseStr;
        return ChineseStr;
      }
      money = money.toString(); //转换为字符串
      if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = "";
      } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, 4);
      }
      let zeroCount = "";
      let IntLen = 0;
      if (parseInt(IntegerNum, 10) > 0) {
        //获取整型部分转换
        zeroCount = 0;
        IntLen = IntegerNum.length;
        for (let i = 0; i < IntLen; i++) {
          let n = IntegerNum.substr(i, 1);
          let p = IntLen - i - 1;
          let q = p / 4;
          let m = p % 4;
          if (n == "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              ChineseStr += cnNums[0];
            }
            zeroCount = 0; //归零
            ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            ChineseStr += cnIntUnits[q];
          }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
      }
      let decLen = 0;
      if (DecimalNum != "") {
        //小数部分
        decLen = DecimalNum.length;
        for (let i = 0; i < decLen; i++) {
          let n = DecimalNum.substr(i, 1);
          if (n != "0") {
            ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (ChineseStr == "") {
        //ChineseStr += cnNums[0]+cnIntLast+cnInteger;
        ChineseStr += cnNums[0] + cnIntLast;
      }
      this.form.chineseAmount = ChineseStr;
    },
    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      let _this = this;
      Api.loanDetail({ id: this.$route.query.id }).then((data) => {
        if (data) {
          this.form = data;
          this.form.applyDate = data.applyDate
            ? moment(data.applyDate).format("YYYY-MM-DD HH:mm:ss")
            : "";
          this.listData = data.loanApplyDetails;
          if (data.applyAttachments && data.applyAttachments.length > 0) {
            data.applyAttachments.forEach(function (item) {
              _this.$set(item, "url", item.attachmentUrlKey);
            });
            this.form.applyAttachmentReqs = data.applyAttachments;
          } else {
            this.form.applyAttachmentReqs = [];
          }
        }
      });
      this.listLoading = false;
    },
    deleteItem(index) {
      this.listData.splice(index, 1);
      //console.log(this.listData,'listData')
      this.calcAmount();
    },
    addItem() {
      let newItem = {
        loanReason: "",
        rechargingAmount: "",
        cashAmount: "",
        amount: "",
        remarks: "",
      };
      this.listData.push(newItem);
    },
    handleClick(data, checked, node) {
      if (checked == true) {
        this.form.orgId = data.orgId;
        this.form.orgName = data.orgName;
        this.orgId = data.orgId;
        this.orgName = data.orgName;
        this.$refs.orgTree.setCheckedNodes([data]);
      }
    },
    nodeClick(data, checked, node) {
      this.form.orgId = data.orgId;
      this.form.orgName = data.orgName;
      this.orgId = data.orgId;
      this.orgName = data.orgName;
      this.$refs.orgTree.setCheckedNodes([data]);
    },
    /**
     * 表单提交
     */
    submitForm(formName, i) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //从投标项目详情中过来的项目，需要传投标项目ID
          const query = this.$route.query;
          const bidId = query.bidId;
          const tag = query.tag;
          if (tag == "outerWorker") {
            this.form.customId = bidId;
          } else if (bidId) {
            this.form.bidId = bidId;
          }
          let _this = this;
          if (this.form.amount) {
            this.form.amount = parseFloat(this.form.amount).toFixed(2);
          }

          if (this.listData.length > 0) {
            this.form.loanApplyDetailReqs = this.listData;
          }
          if (this.fileList.length > 0) {
            _this.form.applyAttachmentReqs = [];
            this.fileList.forEach(function (item) {
              _this.form.applyAttachmentReqs.push({
                name: item.name,
                attachmentUrlKey: item.attachmentUrlKey,
              });
            });
          } else {
            if (this.removedAll) {
              this.form.applyAttachmentReqs = [];
            }
          }
          //处理抄送人
          const copyGiveList = this.copyGiveList;
          if (copyGiveList.length > 0) {
            this.form.copyGives = copyGiveList.map((item) => item.uId);
            this.form.copyGiveName = copyGiveList.map((item) => item.uName);
          }
          if (this.operate === "add") {
            Api.loanAdd(this.form).then((data) => {
              if (data) {
                this.$notify.success({
                  title: "提示",
                  message: "借款申请成功",
                });
                if (i == 1) {
                  this.form = {
                    currency: "001",
                    rate: "1",
                    amount: "",
                    payment: "",
                    applyAttachmentReqs: [],
                    projectCode: projectCode ? projectCode : "",
                    applyDate: null,
                    applyerId: "",
                    approvalProcessId: "",
                    bidId: "",
                    chineseAmount: "",
                    contractId: "",
                    contractCode: "",
                    copyGiveName: [],
                    copyGives: [],
                    daysNumber: 0,
                    id: "",
                    loanApplyDetailReqs: [],
                    orgId: "",
                    orgName: "",
                    payeeId: "",
                    peopleNumber: 0,
                    remarks: "",
                  };
                  this.removedAll = false;
                  this.listData = [];
                } else {
                  this.goBack();
                }
              }
            });
          } else {
            delete this.form["loanApplyDetails"];
            delete this.form["attached"];
            Api.loanUpdate(this.form).then((data) => {
              if (data) {
                this.$notify.success({
                  title: "提示",
                  message: "借款申请修改成功",
                });
                this.goBack();
              }
            });
          }
        } else {
          this.$message("请完善表单");
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    goHref() {
      const query = this.$route.query;
      if (query.tag === "1" || query.flag === "myApply") {
        //来自项目详情
        // 如果入口是我的申请进来的，创建完成之后，跳转到我的申请
        this.$router.push({ path: "/router/myApply" });
      } else if (query.tag === "bid") {
        //来自投标详情
        const path = "/router/intercourseAccount";
        this.$router.push({
          path: path,
          query: {
            id: query.bidId,
            projectCode: query.projectCode,
          },
        });
        return;
      } else if (query.tag === "outerWorker") {
        //来自外工供应商的往来财务
        const path = "/router/outerWorkerAccount";
        this.$router.push({
          path: path,
          query: {
            id: query.bidId,
            type: 2,
          },
        });
        return;
      } else {
        //财务列表
        this.$router.push({ path: "/router/borrowList" });
      }
    },
  },
};
</script>
