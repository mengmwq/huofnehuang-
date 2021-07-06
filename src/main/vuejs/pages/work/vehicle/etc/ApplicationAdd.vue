<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <!-- <p class="step-title">
          <span class="step-icon">1</span>基本信息：
        </p>-->
        <div class="pd20">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号：" prop="carId">
                <el-select
                  v-model="form.carId"
                  filterable
                  clearable
                  remote
                  :remote-method="getCarId"
                  placeholder="车牌号模糊搜索"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in carsList"
                   
                    :label="item.registrationNumber"
                    :value="item.registrationNumber"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编码：" prop="projectCode">
                <el-select
                  v-model="form.projectCode"
                  filterable
                  clearable
                  remote
                  :remote-method="remoteMethod"
                  placeholder="项目名称/编号/客户名称"
                  size="medium"
                  style="width: 100%;"
                >
                  <el-option
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
              <el-form-item label="本次公里数：" prop="kilometres">
                <el-input v-model="form.kilometres" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额：" prop="amount">
                <el-input v-model="form.amount" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="始发地：" prop="startingPlace">
                <el-input v-model="form.startingPlace" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="途径地：" prop="startingPlace">
                <el-input v-model="form.startingPlace" maxlength="20"></el-input>
              </el-form-item>
            </el-col> -->

            <el-col :span="12">
              <el-form-item label="目的地" prop="destination">
                <el-input v-model="form.destination" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- <p class="step-title">
          <span class="step-icon">2</span>单据上传：
        </p>
        <div class="dash-content">
          <div style="margin-left:20px;">
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
        </div>-->
      </div>
      <!-- 打印内容结束 -->
      <div class="tar pd10">
        <el-button type="default" size="medium" @click="goBack('add')">返 回</el-button>
        <el-button type="primary" size="medium" @click="confirm()">提 交</el-button>
        <!-- <el-button
          type="primary"
          size="medium"
          v-if="!this.$route.query.id"
          @click="confirm()"
        >提交后继续创建</el-button>-->
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
import { OilCard } from "@/model/OilCard";
import Api from "@/api/index";
import Util from "@/utils/";
import ValidForm from "@/utils/ValidForm";
export default {
  components: {
    FileUpload,
    ImgPreview,
  },
  computed: {
    fileTypeList() {
      return this.$store.state.dictionary.dists.CustomsAttachmentType.children;
    },
  },
  data() {
    const projectCode = this.$route.query.projectCode;
    const etc = new OilCard();
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
          show: true,
        },
        {
          prop: "description",
          align: "center",
          label: "文件描述",
          width: "200",
          show: true,
        },
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
        carId: [{ required: true, message: "请选择车牌号", trigger: "change" }],
        projectCode: [
          { required: false, message: "请选择项目编码", trigger: "change" },
        ],
        amount: [
          { required: true, message: "请输入金额", trigger: "blur" },
          { pattern: ValidForm.floatNumReg, message: "请输入正确的金额" },
        ],
        startingPlace: [
          { required: true, message: "请输入始发地", trigger: "blur" },
        ],
        destination: [
          { required: true, message: "请输入目的地", trigger: "blur" },
        ],
        approvalProcessId: [
          { required: false, message: "请选择审批流程", trigger: "change" },
        ],
      },
      listData: [],
      tableHeader: [
        {
          prop: "feeTypeName",
          label: "费用名称",
          align: "center",
          show: true,
        },
        {
          prop: "amount",
          label: "单价",
          align: "center",
          show: true,
        },
        {
          prop: "num",
          label: "数量/重量",
          align: "center",
          show: true,
        },
        {
          prop: "totalAmount",
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
      fileList: [],
      goodsNameList: [],
      carsList: [],
    };
  },
  watch: {},
  mounted() {
    this.operate =
      this.$route.path === "/router/editEtcApplication" ? "edit" : "add";
    if (this.operate === "edit") {
      this.loadData();
    }
    //获取项目列表
    this.remoteMethod();
    this.getCarId();
  },
  methods: {
    handleCarId(item) {
      this.form.carId = item.id;
    },
    /** 确认保存 ： 新增或编辑 */
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = this.form;
          const fn = form.id ? "updateETCById" : "addETC";
          const msg = form.id ? "编辑ETC申请成功" : "添加ETC申请成功";
          Api[fn](form)
            .then((res) => {
              this.$notify.success({
                title: "提示",
                message: msg,
              });
              this.goBack("add");
            })
            .catch((err) => {});
        } else {
          return false;
        }
      });
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
        Api.selectCarList(params).then((res) => {
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
          myProjectList: false,
        };
        Api.projectList(params).then((res) => {
          console.log(res, "resss");
          this.projectList = res.records;
        });
      }, 200);
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

    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      Api.getETCById({ id: this.$route.query.id }).then((res) => {
        if (res) {
          this.form = res;
        }
      });
      this.listLoading = false;
      //this.sys()
    },

    goBack(flag) {
      const path = flag === "add" ? "etcApplication" : "addEtc";
      this.$router.push({
        path: "/router/" + path,
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
            projectCode: query.projectCode,
          },
        });
        return;
      } else if (query.tag === "outerWorker") {
        const path = "/router/outerWorkerAccount";
        this.$router.push({
          path: path,
          query: {
            id: query.bidId,
            type: "2",
          },
        });
        return;
      } else {
        //财务列表
        this.$router.push({ path: "/router/paymentList" });
      }
    },
  },
};
</script>
