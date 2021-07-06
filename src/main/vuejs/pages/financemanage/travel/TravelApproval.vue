<template>
  <div>

    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <ApprovalStep :id="id" :info="approvalDetails" 
         :index="approvalIndex"
         :currentNode.sync="currentNode" @approvalChange="approvalDetailWithStep"></ApprovalStep>
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content formDetails">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编码：">
                <span>{{form.projectCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="借款单编号：">
                <span>{{form.loanApplyId}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：">
                <span>{{form.projectName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称：">
                <span>{{form.customerName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：">
                <span>{{form.applyName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务：">
                <span>{{form.positionName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门：">
                <span>{{form.orgName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出差事由：">
                <span>{{form.reason}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预借款项：">
                <span>{{form.item}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总计金额：">
                <span>{{form.amount}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实付金额：">
                <span>{{form.amount-form.item}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起止日期：">
                <span>{{form.beginDate}}  &nbsp;&nbsp;至&nbsp;&nbsp; {{form.endDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地：">
                <span>{{form.targetSite}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出差人：">
                <span style="margin: 0 5px" v-for="(item, index) in form.travelers" :key="index">{{item.uName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总人数：">
                <span>{{form.peopleNumber}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>交通明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="trafficData" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in trafficHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">

                <div v-if="header.prop == 'trafficTypeId'">
                  {{scope.row.trafficTypeId | trafficTypeFilter}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>住宿明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="stayData" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listStay" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                              <template slot-scope="scope">

                <div v-if="header.prop == 'cityLevel'">
                  {{scope.row.attached.CityLevel[scope.row.cityLevel].cnInfo}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">4</span>餐费明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="mealData" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listMeal" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div><p class="step-title"><span class="step-icon">5</span>补贴明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="subsidyData" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listSubsidy" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div><p class="step-title"><span class="step-icon">6</span>其他明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="otherData" 
           show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listOther" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>

        <p class="step-title"><span class="step-icon">7</span>单据上传：</p>
        <ol class="attachmentOl">
            <li v-for="(item, index) in fileList" :key="index"   >
              <span>{{index+1}}. {{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
              <span v-if="item.attachmentUrlKey" style="margin-left:40px;" @click="showFileDetails(item.attachmentUrlKey)">
                <el-button type="primary"  size="mini"   v-if="isHasImg(item.attachmentUrlKey)">预览图片</el-button>
                <el-button type="primary"  size="mini"  v-else-if="item.attachmentUrlKey.indexOf('pdf')!=-1">预览PDF</el-button>
                <el-button type="primary"  size="mini"  v-else>下载文件</el-button>
              </span>
            </li>
          </ol>
          <ImgPreview
            :pictures="pictures"
            :isShowDialog="isShowDialogImg"
            :isFullscreen="false"
            v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
        <!-- <div class="dash-content">
          <el-row style="padding: 10px 20px;">
            <el-col :span="12">
              <el-form-item label="附件信息：">
                <p v-for="(item, index) in fileList" :key="index">
                  {{index + 1}}： {{item.name}}
                </p>
              </el-form-item>
            </el-col>
          </el-row>
        </div> -->
        <!-- 打印内容结束 -->
        <div v-if="$route.query.tag!='1'">
                <div class="title" >审批意见 <div class="line"></div></div>
                <el-input style="width: 90%;margin-left:50px;"
                              type="textarea"
                              maxlength="50"
                               show-word-limit
                              :rows="3"
                              placeholder="请输入审批意见"
                              v-model="editForm.reason">
                    </el-input>
            </div>
        <div class="footer m10" >
          <!-- <el-button type="primary" size="medium" @click="cancelSubmit()">取消</el-button> -->
          <el-button type="primary" size="medium" @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" size="medium" @click="handlePrint">打印</el-button>
          <span v-if="!this.$route.query.tag">
              <el-button type="primary" size="medium" @click="reject">驳回</el-button>
              <el-button type="primary" size="medium" @click="okSubmit('form')">同意</el-button>
          </span>
        </div>
        <div style="clear: both"></div>
        <div id="printContent" v-if="isShowPrint">
          <TravalPrint  
                :form="form"   
                :info="approvalDetails"
                :id="id" :targetId="targetId" :fileList="fileList"></TravalPrint>
        </div>
        <!-- <vue-easy-print  ref="easyPrint" id="printContent" v-if="isShowPrint">
            <template slot-scope="func">
                <TravalPrint  :getChineseNumber="func.getChineseNumber" 
                :form="form"   
                :info="approvalDetails"
                :id="id" :targetId="targetId" :fileList="fileList"></TravalPrint>
            </template>
        </vue-easy-print> -->
      </div>
    </el-form>
  </div>
</template>

<script>
  import ApprovalStep from '@/pages/approval/ApprovalStep'
  import ImgPreview from '@/components/common/ImgPreview'
  //import vueEasyPrint from "vue-easy-print"
  import TravalPrint from './TravalPrint'
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    components: {
      ApprovalStep,ImgPreview,TravalPrint
      //vueEasyPrint,
    },
    data () {
      return {
        canClick: false,
        isShowDialogImg:false,
        pictures:null,
        flag: false,
        dialogVisible: false,
        dialogBHVisible: false,
        type: '',
        form: {},
        editForm: {
          reason: ''
        },
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        trafficData: [],
        stayData: [],
        mealData: [],
        subsidyData: [],
        otherData: [],
        trafficHeader: [
          {prop: 'trafficTypeId', label: '工具类型', align: 'center', show: true},
          {prop: 'itemDate', label: '日期', align: 'center', show: true},
          {prop: 'traveler', label: '人员', align: 'center', show: true},
          {prop: 'startSite', label: '起点', align: 'center', show: true},
          {prop: 'endSite', label: '终点', align: 'center', show: true},
          {prop: 'amount', label: '票价', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
        ],
        listStay: [
          {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
          {prop: 'endDate', label: '结束日期', align: 'center', show: true},
          {prop: 'cityLevel', label: '类别', align: 'center', show: true},
          {prop: 'residents', label: '住宿人数', align: 'center', show: true},
          {prop: 'amount', label: '单价', align: 'center', show: true},
          {prop: 'roomNum', label: '房间数', align: 'center', show: true},
          {prop: 'days', label: '天数', align: 'center', show: true},
          {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
        ],
        listMeal: [
          {prop: 'day', label: '日期', align: 'center', show: true},
          {prop: 'amount', label: '金额', align: 'center', show: true},
          {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
          {prop: 'totalAmount', label: '金额合计', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
        ],
        listSubsidy: [
          {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
          {prop: 'endDate', label: '结束日期', align: 'center', show: true},
          {prop: 'days', label: '合计天数', align: 'center', show: true},
          {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
          {prop: 'otherSubsidyAmount', label: '其他补贴', align: 'center', show: true},
          {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
        ],
        listOther: [
          {prop: 'day', label: '日期', align: 'center', show: true},
          {prop: 'name', label: '名称', align: 'center', show: true},
          {prop: 'amount', label: '单价', align: 'center', show: true},
          {prop: 'num', label: '数量', align: 'center', show: true},
          {prop: 'totalAmount', label: '总价', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
        ],
        id: '', // 用于查审批流程步骤
        targetId: '',
        targetType: '',
        currentNode: '',
        fileList: [],
        approvalDetails:null,
        approvalIndex:1,
        isShowPrint:false,
      }
    },
    watch: {

    },
    mounted () {
      this.id = this.$route.query.id
      this.targetId = this.$route.query.targetId
      this.targetType = this.$route.query.targetType
      this.loadData()
       this.approvalDetailWithStep()
    },
    methods: {
      //打印表格
      handlePrint(){
        this.isShowPrint = true;
        this.$nextTick(()=>{
            Print('#printContent')
            this.isShowPrint = false
         })
      },
      //明细求和
      getSummaries(param) {
         const property = ['totalAmount','num','amount','residents','subsidyAmount','otherSubsidyAmount','days','roomNum']
         const  propertyFloat =  ['totalAmount','amount','subsidyAmount','otherSubsidyAmount']
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (property.some(item=>item==column.property))){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(propertyFloat.some(item=>item==column.property)){
              sums[index] = sums[index].toFixed(2)
            }
            //this.sumAmount +=sums[index]
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      //审批详情
      approvalDetailWithStep() {
        Api.approvalDetailWithStep({id: this.id}).then(data => {
          if (data) {
            this.approvalDetails = data
            console.log(data,'approval')
            this.currentNode = data.currentNode
            data.approvalDetails.unshift({
                 id:data.ctUid,
                 states:'1',
                 approverName:data.approverName?data.approverName:data.ctUName,
                 positionName:'申请人',
                 updateDt:data.createDt,
            })
           console.log(data.approvalDetails.length,'sss')
            if (data.approvalDetails.length > 0) {
              let _this = this
              for (let i = 0; i < data.approvalDetails.length; i++) {
                let item = data.approvalDetails[i]
                if(item.states ==='1'){
                    this.approvalIndex = i+1
                    continue;
                }
              }
            }
          }
        })
      },
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        // 判断是否图片
        isHasImg(key){
           const aFileType = ['.jpg','.jpeg','.png']
            return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
        },
        //文件预览处理
        showFileDetails(key){
          let img = ''
          Api.getUrl(key).then(data => {
            if (data) {
              if(this.isHasImg(key)){
                //图片预览处理；
                 img = data
                  this.pictures = []
                  this.pictures.push(img)
                  this.isShowDialogImg = true
              }else{
                //除图片的其他文件；
                   window.open(data)
              }
            }
          })

        },
      /**
       * 加载详情
       */
      loadData () {
        Api.travelDetail({id: this.targetId}).then((res) => {
          if (res) {
            let _this = this
            this.form = res
            if (res.applyId) {
              this.form.approvalProcessId = res.applyId
            }
            this.form.beginDate = this.formartDate(res.beginDate)
            this.form.endDate = this.formartDate(res.endDate)
            if (res.applyId) {
              this.form.applyer = res.applyId
            }
            if (res.travelerIds) {
              this.form.travelerIds = res.travelerIds
            }

            this.form.approvalProcessId = res.applyId
            if (res.travelTrafficDetails) {
              this.trafficData = res.travelTrafficDetails
              this.trafficData.forEach(function (item) {
                item.itemDate = _this.formartDate(item.itemDate)
              })
            }
            if (res.travelHotelDetails) {
              this.stayData = res.travelHotelDetails
              this.stayData.forEach(function (item) {
                item.beginDate = _this.formartDate(item.beginDate)
                item.endDate = _this.formartDate(item.endDate)
              })
            }
            if (res.travelMealsDetails) {
              this.mealData = res.travelMealsDetails
              this.mealData.forEach(function (item) {
                item.day = _this.formartDate(item.day)
              })
            }
            if (res.travelSubsidyDetails) {
              this.subsidyData = res.travelSubsidyDetails
              this.subsidyData.forEach(function (item) {
                item.beginDate = _this.formartDate(item.beginDate)
                item.endDate = _this.formartDate(item.endDate)
              })
            }
            if (res.travelOtherDetails) {
              this.otherData = res.travelOtherDetails
              this.otherData.forEach(function (item) {
                item.day = _this.formartDate(item.day)
              })
            }
            if (res.applyAttachments && res.applyAttachments.length > 0) {
              this.fileList = res.applyAttachments
            }
          }
        })
      },

      /**
       * 驳回
       * */
      reject () {
        const params =  this.editForm

        if(!params.reason){
           this.$notify.warning({
                title: '提示',
                message: '请输入审批意见'
              })
            return;
        }
        this.$confirm('您确定驳回吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = this.editForm
          params.id = this.currentNode
          Api.approvalRefuse(params).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '驳回成功'
              })
              this.dialogBHVisible=false
              this.$router.push({path: '/router/myAudit'})
            } else {
              this.$notify.warning({
                title: '提示',
                message: '驳回失败'
              })
            }
          })
        })
      },

      okSubmit() {
        this.$confirm('您确定同意吗?', '提示', {   // 1 同意   0 拒绝
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let params = this.editForm
          params.id = this.currentNode
          Api.approvalAccept(params).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '审批通过'
              })
              this.$router.push({path: '/router/myAudit'})
            }
          })
        })
      },
      cancelSubmit () {
        this.$router.push({path: '/router/myAudit'})
      },
      addInvoiceItem () {
        let newItem = {
          no: '',
          name: '',
          ruleType: '',
          unit: '',
          number: '',
          total: '',
          tag: 'new'
        }
        this.listData.splice(0, 0, newItem)
      },
      deleteInvoiceItem (item) {
        this.listData.splice(this.listData.indexOf(item), 1)
      },

      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD')
        }
        return times
      },
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
