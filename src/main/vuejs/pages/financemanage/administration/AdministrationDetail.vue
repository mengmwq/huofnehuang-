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
              <el-form-item label="客户名称：">{{form.customName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款内容：">{{form.content}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：">{{form.receiptNo}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：">{{form.receiptInfo}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行：">{{form.depositBank}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号：">{{form.bankCode}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="币种：">
               <span v-if="form.attached && form.currency">{{form.attached.Currency[form.currency].cnInfo}}</span>
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
                <!-- <el-input readonly v-model=""></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="折合人民币：">
                <span v-if="form.chineseAmount"></span>{{form.amount}} （{{form.chineseAmount}}）
                <!-- <el-input v-model="form.chineseAmount" readonly placeholder="根据付款金额自动转化"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>-->
            <!--<el-col :span="12">-->
              <!--<el-form-item label="实付金额：">{{form.actualAmount}}</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">{{form.remark}}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>费用明细：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="listData" 
          show-summary :summary-method="getSummaries"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>

              <template slot-scope="scope">
                <div v-if="header.prop == 'feeTypeId'">
                  {{scope.row.feeTypeId | feeTypeFilter}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="24">
              <el-form-item label="附件信息：">
                <ol class="attachmentOl">
                  <li v-for="(item, index) in fileList" :key="index"   >
                    <span>{{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
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
    <el-row style="margin-top: 20px;margin-right: 13px">
      <el-col :span="24" class="text-right">
        <router-link :to="{path:'/router/paymentList'}"><el-button type="primary" size="medium">返回</el-button></router-link>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components: {
      'v-upload': Upload,ImgPreview,
    },
    data () {
      return {
          isShowDialogImg:false,
        pictures:null,
        flag: false,
        type: '',
        form: {},
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        tableHeader: [{
          prop: 'feeTypeName',
          label: '费用名称',
          align: 'center',
          show: true
        }, {
          prop: 'amount',
          label: '单价',
          align: 'center',
          show: true
        },{
          prop: 'num',
          label: '数量',
          align: 'center',
          show: true
        },{
          prop: 'totalAmount',
          label: '金额',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        fileList: []
      }
    },
    mounted () {
      this.loadData()
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
          if (column.property =='amount' && !values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           sums[index] = sums[index].toFixed(2)
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
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        Api.administrationDetails({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            if (res.applyAttachments && res.applyAttachments.length > 0) {
              this.fileList = res.applyAttachments
            }
            if (res.payingApplyDetails) {
              this.listData = res.payingApplyDetails
            }
          }
        })
        this.listLoading = false
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
