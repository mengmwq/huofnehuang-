<template>
  <div>
    <div class="bid-audit">
        <el-form :model="formBack" label-width="130px">
        <!--
          <el-row>
            <el-col :span="8">
              <el-form-item label="投标人：" prop="tariffNo">
                <el-input v-model="formBack.bidderName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文件递交时间：" prop="tariffNo">
                <el-date-picker v-model="formBack.commitDate" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文件递交地点：">
                <el-input v-model="formBack.commitSite"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参加供应商数量：">
                <el-input v-model="formBack.bidderNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开标是否顺利：" prop="isWell">
                <el-select filterable v-model="formBack.isWell" clearable size="medium" style="width:100%">
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
              <el-form-item label="备注：" prop="tariffNo">
                <el-input v-model="formBack.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>-->
          <p>供应商信息：</p>
          <el-table class="page-table mb10" :data="formBack.bidderInfoReqList" stripe highlight-current-row
                    :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeaderBack2" v-if="header.show" :key="index"
                             :prop="header.prop" :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'bidderCompanyName'">
                  <el-input v-model="scope.row.bidderCompanyName"></el-input>
                </div>
                <div v-else-if="header.prop == 'bidder'">
                  <el-input v-model="scope.row.bidder"></el-input>
                </div>
                <div v-else-if="header.prop == 'tel'">
                  <el-input v-model="scope.row.tel"></el-input>
                </div>
                <div v-else-if="header.prop == 'grade'">
                  <!-- <el-input placeholder="填写数字" v-model="scope.row.grade"></el-input> -->
                  <el-input-number v-model="scope.row.grade" :step="1" step-strictly></el-input-number>
                </div>
                <div v-else-if="header.prop == 'stateId'">
	            <el-select
	              filterable
	              v-model="scope.row.stateId"
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
	          </div>
                <div v-else-if="header.prop == 'openBidPrice'">
                  <el-input-number v-model="scope.row.openBidPrice" :step="1" step-strictly></el-input-number>
                  <!-- <el-input placeholder="填写数字" v-model="scope.row.openBidPrice"></el-input> -->
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="80">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="() => {formBack.bidderInfoReqList.splice(scope.$index, 1)}"></el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-form :model="formBack" label-width="130px">
	          <el-row>
	          <el-col :span="24">
              <el-form-item label="备注：" prop="remarks" >
                <el-input
                  style="width: 100%"
                  type="textarea"
                  :rows="4"
                  maxlength="1000"
                  placeholder="备注信息，1000字以内"
                  v-model="formBack.remarks" show-word-limit>
                </el-input>
               </el-form-item>
	           </el-col>
	          </el-row>
	        <el-row>
	          <el-col :span="24">
	          	<FileTableMultiUpload
	          	  v-if="isUpload"
	              :fileList.sync="fileList"
	              :removedAll.sync="removedAll"
	              @attachmentChange="attachmentChange"
	              :applyAttachment="formBack.feedbackAttachmentReqList"></FileTableMultiUpload>
	          </el-col>
	        </el-row>
          </el-form>
          <div class="text-center">
            <el-button type="primary" @click="bidBack">确 认</el-button>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import FileTableMultiUpload from "@/components/common/FileTableMultiUpload";
  import ApprovalStep from '@/pages/approval/ApprovalStep'
      
  export default {
    components:{
      ApprovalStep,
      FileTableMultiUpload
    },
    data () {  
      return {
        options: [{
          value: '1',
          label: '顺利'
        }, {
          value: '0',
          label: '不顺利'
        }],
        yesnoBidding: [{
          value: '010',
          label: '是'
        }, {
          value: '011',
          label: '否'
        }],
        removedAll:false,
       fileList:[],
        id: '',
       formBack: {
          bidderInfoReqList: [],
          feedbackAttachmentReqList: []
        }, 
        // 反馈2（填写）供应商列表
        tableHeaderBack2: [{
          prop: 'bidderCompanyName',
          align: 'center',
          label: '供应商名称',
          show: true
        }, {
          prop: 'bidder',
          align: 'center',
          label: '供应商代表姓名',
          show: true
        }, {
          prop: 'tel',
          align: 'center',
          label: '联系方式',
          show: true
        }, {
          prop: 'grade',
          align: 'center',
          label: '得分',
          show: true
        }, {
          prop: 'openBidPrice',
          align: 'center',
          label: '开标价',
          show: true
        }, {
          prop: 'stateId',
          align: 'center',
          label: '是否中标',
          show: true
        }],
		isUpload:false,
      }
    },
    mounted () {
      this.id=this.$route.query.id
      this.loadData()
    },
    methods: {
        attachmentChange(val){
	      this.formBack.feedbackAttachmentReqList = val
	    },
      addItem() {        //反馈填写表格
        let item = {
          bidder: '',
          bidderCompanyName: '',
          grade: '',
          tel: '',
          openBidPrice: ''
        }
        this.formBack.bidderInfoReqList.push(item)
      },
      
        /**
       * 反馈
       * */
      bidBack(item) {
        //检测弹窗没有弹出就弹出加载
        let _this = this
       
        //检测弹窗弹出就确认提交
     

        if (this.fileList.length > 0) {
          _this.formBack.feedbackAttachmentReqList = []
          this.fileList.forEach(function (item) {
            _this.formBack.feedbackAttachmentReqList.push({
              name: item.name,
              attachmentUrlKey: item.attachmentUrlKey
            })
          })
        } else {
          if (this.removedAll) {
            _this.formBack.feedbackAttachmentReqList = []
          }
        }
        this.formBack.bidderName = '1'
        Api.addOrUpdateBidFeedback(this.formBack).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '反馈成功'
            })
            this.cancelBidBack()
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },
      cancelBidBack() {
        this.dialogVisibleBack = false
        this.formBack = {
          bidderInfoReqList: [],
          feedbackAttachmentReqList: [],
          feedbackAttachmentRespList: []
        }
      },
      /**
       * 加载
       */
      loadData () {
        let param = {bidProjectId: this.$route.query.id}
        Api.queryBidFeedbackByBidProjectId(param).then(data => {
            if (data) {
              this.formBack = data
              if (!data.bidderInfoList) {
                this.formBack.bidderInfoReqList = []
              } else {
                this.formBack.bidderInfoReqList = data.bidderInfoList
              }
              // 接口返回的字段是feedbackAttachmentRespList，和请求字段不同
              if (data.feedbackAttachmentRespList && data.feedbackAttachmentRespList.length > 0) {
                data.feedbackAttachmentRespList.forEach(item=> {
                  this.$set(item, 'url', item.attachmentUrlKey)
                })
                this.formBack.feedbackAttachmentReqList = data.feedbackAttachmentRespList
                this.isUpload=true
              } else {
                this.formBack.feedbackAttachmentReqList = []
                this.isUpload=true
              }

            }
          })
      },

    }
  }
</script>
