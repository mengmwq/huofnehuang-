<template>
  <div class="formDetails">
    <el-form label-position="right" :model="form" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：">{{form.projectName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请编号：">{{form.targetId}}</el-form-item>
            </el-col>
          </el-row>
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
              <el-form-item label="项目名称：">{{form.projectName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人：">{{form.applyName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请部门：">{{form.orgName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人员数量：">{{form.peopleNumber}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请日期：">{{form.applyDate | timeFormat}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计天数：">{{form.daysNumber}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="币种：">
                <span v-if="form.attached">{{form.attached.Currency[form.currency].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：">
                <span>{{form.rate}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
                <el-col :span="12">
                    <el-form-item label="付款金额：" prop="payment">
                        {{form.payment?form.payment:form.amount}}
                       <!-- {{form.payment}} -->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="折合人民币：" prop="chineseAmount">
                         <span v-if="form.amount">{{form.amount}}（{{form.chineseAmount}}）</span>
                    </el-form-item>
                </el-col>
            </el-row>
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="合计金额：">{{form.amount}}</el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="领用人：">{{form.payeeName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">{{form.remarks}}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>费用明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="listData" show-summary :summary-method="getSummaries" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="24">

              <el-form-item label="附件信息：">
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
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div style="clear: both"></div>
    </el-form>
   <div class="footer m10" >
         <el-button type="primary" size="medium" @click="$router.go(-1)">返回</el-button>
   </div>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components: {
     ImgPreview,
    },
    data () {
      return {
          isShowDialogImg:false,
        pictures:null,
        fileList: [],
        id: null,
        flag: false,
        type: '',
        form: {},
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        tableHeader: [{
          prop: 'loanReason',
          label: '借款事由',
          align: 'center',
          show: true
        }, {
          prop: 'projectName',
          label: '项目',
          align: 'center',
          show: true
        }, {
          prop: 'rechargingAmount',
          label: '充值金额',
          align: 'center',
          show: true
        }, {
          prop: 'cashAmount',
          label: '现金预支',
          align: 'center',
          show: true
        }, {
          prop: 'amount',
          label: '金额',
          align: 'center',
          show: true
        },{
          prop: 'conversion',
          label: '折合人民币',
          align: 'center',    
          show: true
        },  {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }]
      }
    },
    mounted () {
      this.id = this.$route.query.id;
      Api.loanDetail({
        id: this.id
      }).then(data => {
        this.form = data;
        if (data.applyAttachments && data.applyAttachments.length > 0) {
          this.fileList = data.applyAttachments
        }
        this.listData = data.loanApplyDetails
        let _this = this
        this.listData.forEach(function (item) {
          _this.$set(item, 'projectName', data.projectName)
        })
      });
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.property!=='remarks' && !values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2)
           // this.form.payment = sums[index]
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

