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
              <el-form-item label="日期" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择日期"  v-model="form.maintainDate" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="本次公里数" prop="currentMileageNumber">
                <el-input placeholder="请输入数字"  v-model="form.currentMileageNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性质">
                <el-select v-model="form.maintainType" placeholder="选择性质" style="width: 100%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所做项目" prop="maintainContent">
                <el-input v-model="form.maintainContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务单位">
                <el-input v-model="form.serviceCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下次保养公里数" prop="nextMileageNumber">
                <el-input placeholder="请输入数字"  v-model="form.nextMileageNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="费用金额" prop="fee">
                <el-input v-model="form.fee" placeholder="请输入数字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="借款费用金额">
                <el-input v-model="form.borrowingFee" placeholder="请输入数字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当事人">
                <el-input v-model="form.party" placeholder="请输入当事人"></el-input>
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
      <div class="footer m10">
        <el-button type="default" size="medium" @click="goBack('add')">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitAdd('form', 0)">提 交</el-button>
        <!-- <el-button
          type="primary"
          size="medium"
          v-if="!this.$route.query.id"
          @click="submitForm('form', 1)"
        >提交后继续创建</el-button> -->
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
    }
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
      //下拉select 001:保养 002:维修
        options: [{
          value: '001',
          label: '保养'
        }, {
          value: '002',
          label: '维修'
        }, {
          value: '003',
          label: '其他'
        }],
        value: '',

        /**表单校验**/
        rules: {
          registrationNumber: [
          { required: true, message: "请选择车牌号", trigger: "change" }
        ],
        maintainDate: [
            { required: true, message: '请选择维修日期', trigger:['blur',"change"] }
          ],
          fee: [
            { required: false, message: '请输入费用金额', trigger: 'blur' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],
          'currentMileageNumber': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'maintainContent': [
            { required: false, message: '', trigger: 'blur' },
          ],
          'serviceCompany': [
            { required: false, message: '', trigger: 'blur' },
          ],
          'nextMileageNumber': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
        },
      listData: [],
      fileList: [],
      goodsNameList: [],
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
    this.operate =
      this.$route.path === "/router/editMaintainApplication" ? "edit" : "add";
    if (this.operate === "edit") {
      this.loadData();
    }
    //获取项目列表
    this.remoteMethod();
    this.getCarId()
    //this.getUserList()
  },
  methods: {
   handleAttrId(item,attr){
      if(attr === 'uId'){
         this.form.uId = item.uId;
      }else if(attr==='carId'){
        this.form.carId = item.id;
      }
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
    /**校验是否填写数字**/
      isNum (str) {
        if (str) {
          let reg=/^[0-9]*$/;   /**定义验证表达式*/
          return reg.test(str);     /**进行验证*/
        }else {
          return true
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
    /**添加操作**/
      submitAdd (formName) {
        this.$refs[formName].validate((valid) => {
          if (this.form.fee) {
            this.form.fee = parseFloat(this.form.fee).toFixed(2)
          }
          if (valid) {
            /**进行正则表达式的校验**/
            if(!this.isNum(this.form.currentMileageNumber)){
              this.$notify.warning({
                title: '提示',
                message: '请检查【本次公里数】是否填写规范'
              })
              return       //校验失败return返回
            }
            if(!this.isNum(this.form.nextMileageNumber)){
              this.$notify.warning({
                title: '提示',
                message: '请检查【下次保养公里数】是否填写规范'
              })
              return       //校验失败return返回
            }
            let _this = this
            //检测弹窗弹出就确认提交
		    if (this.fileList.length > 0) {
		      _this.form.attachmentList = []
		      this.fileList.forEach(function (item) {
		        _this.form.attachmentList.push({
		          name: item.name,
		          attachmentUrlKey: item.attachmentUrlKey
		        })
		      })
		    } else {
		      if (this.removedAll) {
		        _this.form.attachmentList = []
		      }
		    }
			//this.form.registrationNumber = this.$route.query.id
            /**校验成功执行下列语句**/
            this.form.maintainDate = moment(this.form.maintainDate).format('YYYY-MM-DD')
            if(!this.form.id){
	            Api.addCarMaintain(this.form).then(data => {
	              if (data) {
	                this.$notify.success({
	                  title: '提示',
	                  message: '维修保养申请添加成功',
	                })
	                this.goBack('add')
	              }
	            })
            }else{
            	Api.updateCarMaintain(this.form).then(data => {
	              if (data) {
	                this.$notify.success({
	                  title: '提示',
	                  message: '维修保养申请更新成功',
	                })
	               this.goBack('add')
	              }
	            })
            }
          }
          else {
            this.$message('请完善表单')
          }
        })
      },
    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      const params = { 
        id: this.$route.query.id 
        }
      Api.getCarMaintainDetail(params).then(res => {
        if (res) {
          this.form = res;
          let _this = this;
          //处理抄送人
          // const copyGive = res.copyGives;
          // if (copyGive && copyGive.length > 0) {
          //   //const copyGiveList = []
          //   copyGive.map((item, index) => {
          //     this.copyGiveList.push({
          //       uId: item,
          //       uName: res.copyGiveName[index]
          //     });
          //   });
          // }
          if (res.attachmentList && res.attachmentList.length > 0) {
            res.attachmentList.forEach(function(item) {
              _this.$set(item, "url", item.attachmentUrlKey);
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
        flag === "add" ? "maintainApplication" : "addMaintainApplication";
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
