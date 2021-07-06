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
            <el-col :span="8">
              <el-form-item label="车牌号：" prop="registrationNumber">
                <el-select
                  v-model="form.registrationNumber"
                  filterable
                  clearable
                  remote
                  :remote-method="getCarId"
                  placeholder="车牌号模糊搜索"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                   @click.native="handleAttrId(item,'carId')"
                    v-for="item in carsList"
                    :key="item.registrationNumber"
                    :label="item.registrationNumber"
                    :value="item.registrationNumber"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事故时间" prop="accidentDatetime">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.accidentDatetime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="驾驶员">
                <el-select
                  v-model="form.uName"
                  filterable
                  clearable
                  remote
                  :remote-method="getUserList"
                  placeholder="驾驶员模糊搜索"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    @click.native="handleAttrId(item,'uId')"
                    v-for="item in userList"
                    :key="item.uId"
                    :label="item.uName"
                    :value="item.uName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="8">
              <el-form-item label="事故地点">
                <el-input v-model="form.accidentSite" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理负责人">
                <el-input v-model="form.caseOfficer" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事故原因">
                <el-input v-model="form.accidentReason" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="案件性质">
                <el-select v-model="form.nature" filterable clearable placeholder="性质" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in carNatureTypeList"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="案件进度">
                <el-select v-model="form.progress" filterable clearable placeholder="进度结果" size="medium" style="width: 100%;">
                  <el-option
                    v-for="(item, index) in carProgressTypeList"
                    :key="index"
                    :label="item.cnInfo"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="损失情况">
                <el-input v-model="form.lostInfo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="费用金额" prop="fee">
                <el-input placeholder="填写数字" v-model="form.fee" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title">
          <span class="step-icon">2</span>单据上传：
        </p>
        <div class="dash-content">
          <div style="margin-left:20px;">
            <div class="text-right mb10">
              <el-button type="primary" size="small" @click="dialogVisible=true">+ 文件上传</el-button>
            </div>

            <el-table
              class="page-table"
              :data="form.attachmentList"
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
                ></el-table-column>
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
      </div>
      <!-- 打印内容结束 -->
      <div class="tar pd10">
        <el-button type="default" size="medium" @click="goBack('add')">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitAdd('form')">提 交</el-button>
        <!-- <el-button
          type="primary"
          size="medium"
          v-if="!this.$route.query.id"
          @click="submitForm('form', 1)"
        >提交后继续创建</el-button> -->
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
import { CarMaintain } from "@/model/CarMaintain";
import Api from "@/api/index";
import Util from "@/utils/";
import ValidForm from '@/utils/ValidForm'
import moment from 'moment'
export default {
  components: {
    FileUpload,
    ImgPreview
  },
  computed: {
    fileTypeList() {
      return this.$store.state.dictionary.dists.CustomsAttachmentType.children;
    },
    //案件性质
    carNatureTypeList() {
      return this.$store.state.dictionary.dists.CarNatureType.children;
    },
    //案件进展
    carProgressTypeList() {
      return this.$store.state.dictionary.dists.CarProgressType.children;
    },
  },
  data() {
    const projectCode = this.$route.query.projectCode;
    const etc = new CarMaintain();
    return {
      //附件上传
      hasCallBack: true,
      callBackName: "getUploadFile",
      dialogVisible: false,

      tableHeaderAttachments: [
        {
          prop: "name",
          align: "center",
          label: "名称",
          width: "100",
          show: true
        },
        {
          prop: "description",
          align: "center",
          label: "文件描述",
          width: "200",
          show: true
        }
      ],
      //图片预览
      isShowDialogImg: false,
      pictures: null,

      operate: "",
      removedAll: false,
      type: "",
      /** 消耗 */
      form: etc,
      /** 项目列表 */
      projectList: [],
      /** 表格 loading */
      listLoading: false,
      rules: {
        registrationNumber: [
          { required: true, message: "请选择车牌号", trigger: "change" }
        ],
        accidentDatetime: [
            { required: true, message: '事故时间不为空', trigger: 'blur' }
          ],
        fee: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
      },
      listData: [],
      tableHeader: [
        {
          prop: "feeTypeName",
          label: "费用名称",
          align: "center",
          show: true
        },
        {
          prop: "amount",
          label: "单价",
          align: "center",
          show: true
        },
        {
          prop: "num",
          label: "数量/重量",
          align: "center",
          show: true
        },
        {
          prop: "totalAmount",
          label: "金额",
          align: "center",
          show: true
        },
        {
          prop: "remarks",
          label: "备注",
          align: "center",
          show: true
        }
      ],
      fileList: [],
      goodsNameList: [],
      carsList:[],
      userList:[],
    };
  },
  watch: {},
  mounted() {
    this.operate =
      this.$route.path === "/router/editInsuranceRecordApplication" ? "edit" : "add";
    if (this.operate === "edit") {
      this.loadData();
    }
    //获取项目列表
    this.remoteMethod();
    this.getCarId()
    this.getUserList()
  },
  methods: {
    handleAttrId(item,attr){
      if(attr === 'uId'){
         this.form.uId = item.uId;
      }else if(attr==='carId'){
        this.form.carId = item.id;
      }
      console.log(this.form.carId,item.id)

    },
     //获取
    getUserList(query = "") {
      setTimeout(() => {
        const params = {
          pageNum: 1,
          pageSize: 10,
          name: query,
        };
        Api.getUserPage(params).then(res => {
          this.userList = res.records;
        });
      }, 200);
    },
    //获取车牌号
    getCarId(query = "") {
      setTimeout(() => {
        const params = {
          pageNum: 1,
          pageSize: 10,
          registrationNumber: query,
          //type:'1',
        };
        Api.selectCarList(params).then(res => {
          this.carsList = res.records;
        });
      }, 200);
    },
    //项目编码
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
    getAmountNum(arr, attr) {
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
      } else {
        return 0;
      }
    },
    //关闭图片预览；
    closeDialogImg() {
      this.isShowDialogImg = false;
    },
    // 判断是否图片
    isHasImg(key) {
      const aFileType = [".jpg", ".jpeg", ".png"];
      return aFileType.some(item => key.toLowerCase().lastIndexOf(item) != -1);
    },
    //文件预览处理
    showFileDetails(key) {
      let img = "";
      Api.getUrl(key).then(data => {
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
      return this.fileTypeList.filter(item => item.value == type)[0].cnInfo;
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
      this.form.attachmentList.push({
        name: form.fileName,
        attachmentUrlKey: form.key,
        type: form.type,
        description: form.description
        //size: _this.renderSize(form.size)
      });
    },
    //删除报关附件
    deleteFileItem(row, index) {
      if (row.id) {
        const params = {
          id: row.id
        };
        Api.deleteAttachment(params).then(res => {
          this.form.attachmentList.splice(index, 1);
        });
      } else {
        this.form.attachmentList.splice(index, 1);
      }
    },

    //验证是否是数字
    isNumber(obj) {
      return obj === +obj;
    },
    calcAmount() {
      if (this.listData.length > 0) {
        const amount = this.listData.map(item => item.amount);
        const num = this.listData.map(item => item.num);
        var newTotal = 0;
        for (var i = 0; i < this.listData.length; i++) {
          newTotal = amount[i] * num[i] + newTotal;
        }
        const newAmount = amount.reduce((prev, cur) => {
          return parseFloat(prev) + parseFloat(cur);
        });
        const newNum = num.reduce((prev, cur) => {
          return parseFloat(prev) + parseFloat(cur);
        });
        const rate = parseFloat(this.form.rate);
        if (this.isNumber(rate)) {
          this.form.amount = (newAmount * rate).toFixed(2);
          this.form.amount = (newTotal * rate).toFixed(2);
        } else
          this.$notify.warning({
            title: "提示",
            message: "请输入正确的汇率信息！"
          });
      } else {
        this.form.amount = "";
        this.form.chineseAmount = "";
      }
    },
    calcPrice(value, index, tag, key) {
      if (tag === "listData") {
        this.listData[index][key] = parseFloat(value).toFixed(2);
        this.calcAmount();
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
        const values = data.map(item => Number(item[column.property]));
        if (
          (column.property == "amount" ||
            column.property == "num" ||
            column.property == "totalAmount") &&
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
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },

    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      Api.getAccidentRdDetail({ id: this.$route.query.id }).then(res => {
        if (res) {
          this.form = res;
          if (res.payingApplyDetails) {
            this.listData = res.payingApplyDetails;
          }
          if (res.attachmentList && res.attachmentList.length > 0) {
            res.attachmentList.forEach(item=> {
              this.$set(item, "url", item.attachmentUrlKey);
            });
            this.form.attachmentList = res.attachmentList;
          } else {
            this.form.attachmentList = [];
          }
        }
      });
      this.listLoading = false;
      //this.sys()
    },
    submitAdd (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          if(!this.form.id){
              /**校验成功执行下列语句**/
              this.form.accidentDatetime = moment(this.form.accidentDatetime).format('YYYY-MM-DD')
             
              Api.addAccidentRd(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '添加成功',
                  })
                 
                  this.goBack()
                }
              })
            }else{
              this.form.accidentDatetime = moment(this.form.accidentDatetime).format('YYYY-MM-DD')
              Api.updateAccidentRdById(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '修改成功',
                  })
                  this.goBack()
                }
              })
            }
          }
          else {
            this.$message('请完善表单')
          }
        })
      },
    goBack(flag) {
      const path =
        flag === "add" ? "insuranceApplication" : "addInsuranceRecord";
      this.$router.push({
        path: "/router/insuranceApplication" 
      });
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
            projectCode: query.projectCode
          }
        });
        return;
      } else if (query.tag === "outerWorker") {
        const path = "/router/outerWorkerAccount";
        this.$router.push({
          path: path,
          query: {
            id: query.bidId,
            type: "2"
          }
        });
        return;
      } else {
        //财务列表
        this.$router.push({ path: "/router/paymentList" });
      }
    }
  }
};
</script>
