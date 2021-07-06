<template>
  <div class="formDetails">
    <el-form label-position="right" :model="form" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编码：">{{form.projectCode}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号：">{{form.contractCode}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="12">
              <el-form-item label="申请编号：">{{form.targetId}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称：">{{form.projectName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="12">
              <el-form-item label="报销编号：">{{form.no}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：">{{form.receiptNos}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：">{{form.receiptInfo}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票公司：">{{form.companyOfReceipt}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请时间：">{{form.applyDatetime | timeFormat}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合计金额：">{{form.amount}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式：">{{form.payType|payTypeinFilter}}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>冲账明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="form.reimburseApplyLoanDetailList" 
          show-summary :summary-method="getSummaries"
          stripe highlight-current-row :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="80" ></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>费用明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="form.reimburseApplyFeeDetailList"
          show-summary :summary-method="getSummaries"
           stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">4</span>附件信息：</p>
        <ol class="attachmentOl" v-if="fileList.length>0">
            <li v-for="(item, index) in fileList" :key="index">
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
      </div>

      <div style="clear: both"></div>
    </el-form>
    <el-row style="margin-top: 20px;margin-right: 13px">
      <el-col :span="24" class="text-right">
        <router-link  :to="{path: '/router/reimburseList'}">
        <el-button type="primary" size="medium">返回</el-button>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ImgPreview from '@/components/common/ImgPreview'
  import Api from '@/api/index'
  export default {
    components: {
      ImgPreview,
    },
    data () {
      return {
          isShowDialogImg:false,
        pictures:null,
        fileList: [],
        flag: false,
        type: '',
        form: {
          reimburseApplyLoanDetailList: [],
          reimburseApplyFeeDetailList:[]
        },
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        tableHeader: [ {
          prop: 'loanApplyId',
          label: '借款单号',
          align: 'center',
          show: true
        }, {
          prop: 'loanAmount',
          label: '冲账金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        tableHeader1: [{
          prop: 'reimburseIten',
          label: '用途',
          align: 'center',
          show: true
        }, {
          prop: 'reimburseAmount',
          label: '金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'actualReimburse',
          label: '实报',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }]
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      //明细求和
      getSummaries(param) {
        //需要求和的字段
        const property = ['actualReimburse','reimburseAmount','loanAmount']
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
           
            sums[index]=sums[index].toFixed(2)
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
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
      /** 序号 */
      indexMethod(index){
        return index + 1
      },
      /**
       * 加载
       */
      loadData () {
        Api.queryReimbursementApplyDetailById({id : this.$route.query.id}).then(data => {
          this.form = data;
          if (data.applyAttachmentList && data.applyAttachmentList.length > 0) {
            this.fileList = data.applyAttachmentList
          }
        })

      }
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
