<template>
  <div>
    <el-form label-position="right" :model="form"  ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title">
          <span class="step-icon">1</span>基本信息：
        </p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号：">
                {{form.registrationNumber}}
               
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故时间" prop="accidentDatetime">
                 {{form.accidentDatetime}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驾驶员">
                {{form.uName}}
                
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故地点">
                {{form.accidentSite}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理负责人">
               {{form.caseOfficer}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故原因">
                
                 {{form.accidentReason}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件性质">
                <span v-if="form.attached && form.attached.CarNatureType">{{form.attached.CarNatureType[form.nature].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件进度">
                <span v-if="form.attached && form.attached.CarProgressType">{{form.attached.CarProgressType[form.progress].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="损失情况">
                {{form.lostInfo}}
                
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用金额" prop="fee">
                {{form.fee}}
               
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title">
          <span class="step-icon">2</span>单据上传：
        </p>
        <div class="dash-content">
          <div style="margin-left:20px;">
           
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

              <el-table-column label="操作" width="100">
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
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="default" size="medium" @click="goBack('add')">返 回</el-button>
      </div>
      <div style="clear: both"></div>
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
import ValidForm from '@/utils/ValidForm'
export default {
  components: {
    FileUpload,
    ImgPreview
  },
  computed: {
    fileTypeList() {
      return this.$store.state.dictionary.dists.CustomsAttachmentType.children;
    }
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
      carsList:[],
      userList:[],
      progressList: [{
          value: '001',
          label: '保养'
        }, {
          value: '002',
          label: '维修'
        }, {
          value: '003',
          label: '其他'
        }],
        natureList: [{
          value: '001',
          label: '保养'
        }, {
          value: '002',
          label: '维修'
        }, {
          value: '003',
          label: '其他'
        }],
    };
  },
  watch: {},
  mounted() {
    this.loadData();
  },
  methods: {
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
    
    goBack(flag) {
      const path =
        flag === "add" ? "insuranceApplication" : "addInsuranceRecord";
      this.$router.push({
        path: "/router/" + path
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
