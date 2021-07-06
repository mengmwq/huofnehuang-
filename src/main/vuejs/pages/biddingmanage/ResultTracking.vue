<template>
  <div class="bid-audit">
  <div class="formTitle">
      <div class="title">结果跟踪<div class="line"></div>
      </div>
      </div>
    <el-form :model="formTailAfter" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="中标公告发布时间：" prop="releaseDate">
            <el-date-picker
              v-model="formTailAfter.releaseDate"
              type="datetime"
              size="medium"
              value-format="yyyy-MM-dd hh:mm:ss"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否中标：" prop="releaseDate">
            <el-select
              filterable
              v-model="formTailAfter.stateId"
              clearable
              placeholder="请选择是否中标"
              size="medium"
              style="width:100%"
            >
              <el-option
                v-for="item in yesnoBidding"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="中标金额：" prop="winningBidPrice">
            <el-input
              style="width: 100%"
              placeholder="请填写数字"
              v-model="formTailAfter.winningBidPrice"
              type="number"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="中标单位：" prop="tariffNo">
            <el-input style="width: 100%" v-model="formTailAfter.winningBidName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注：" prop="tariffNo">
            <el-input style="width: 100%" v-model="formTailAfter.remarks"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件上传" prop>
            <FileListMultiUpload
              :fileList.sync="fileList"
              :removedAll.sync="removedAll"
              :applyAttachmentReqList="formTailAfter.bidingResultAttachmentReqList"
            ></FileListMultiUpload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center">
      <el-button type="primary" @click="bidTailAfter">确 认</el-button>
    </div>
  </div>
</template>

<script>
import Api from "@/api/index";
import FileListMultiUpload from "@/components/common/FileListMultiUpload";
export default {
  components: {
    FileListMultiUpload
  },
  data() {
    return {
      fileList: [],
      removedAll: false,
      yesnoBidding: [{
          value: '010',
          label: '是'
        }, {
          value: '011',
          label: '否'
        }],
      id: "",
      //跟踪已用
      formTailAfter: {
        bidingResultAttachmentReqList: []
      }
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.loadData();
  },
  methods: {
    /**
     * 跟踪
     * */
    bidTailAfter(item) {
      
      if (this.fileList.length > 0) {
        this.formTailAfter.bidingResultAttachmentReqList = [];
        this.fileList.forEach((item)=> {
          this.formTailAfter.bidingResultAttachmentReqList.push({
            name: item.name,
            attachmentUrlKey: item.attachmentUrlKey
          });
        });
      } else {
        if (this.removedAll) {
          this.formTailAfter.bidingResultAttachmentReqList = [];
        }
      }
      Api.addOrUpdateBidingResult(this.formTailAfter).then(data => {
        if (data) {
          this.$notify.success({
            title: "提示",
            message: "投标结果情况跟踪提交成功！"
          });
          this.cancelTaiAfter();
          // 重新渲染页面数据
          this.loadData();
        }
      });
    },
    /**校验是否填写数字**/
    isNum(str) {
      if (str) {
        let reg = /^[0-9]*$/;
        /**定义验证表达式*/
        return reg.test(str);
        /**进行验证*/
      } else {
        return true;
      }
    },
    cancelTaiAfter() {
      this.dialogVisibleTailAfter = false;
      this.formTailAfter = {
        bidingResultAttachmentReqList: []
      };
    },
    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      const bidProjectId =this.$route.query.id
      let param = {
          bidProjectId: bidProjectId
        };
      this.formTailAfter.bidProjectId = bidProjectId
       Api.queryBidingResultByBidProjectId(param).then(data => {
          if (data) {
            this.formTailAfter = data;
            if (this.formTailAfter.winningBidPrice) {
              this.formTailAfter.winningBidPrice = parseFloat(
                this.formTailAfter.winningBidPrice
              ).toFixed(2);
            }
            if (
              this.formTailAfter.stateId !== "010" &&
              this.formTailAfter.stateId !== "011"
            ) {
              this.formTailAfter.stateId = "";
            }
            if (
              data.bidingResultAttachmentRespList &&
              data.bidingResultAttachmentRespList.length > 0
            ) {
              data.bidingResultAttachmentRespList.forEach((item)=> {
                this.$set(item, "url", item.attachmentUrlKey);
              });
              this.formTailAfter.bidingResultAttachmentReqList =
                data.bidingResultAttachmentRespList;
            } else {
              this.formTailAfter.bidingResultAttachmentReqList = [];
            }
          }
        });
    }
  }
};
</script>
