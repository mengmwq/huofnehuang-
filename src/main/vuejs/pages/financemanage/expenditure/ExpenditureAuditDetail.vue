<template>
  <div>
    <el-form label-position="right" :model="form" ref="form" label-width="140px">
      <div class="print-data">
        <div class="title">流程信息
          <div class="line"></div>
        </div>
        <div style="padding: 0 4%;">
          <el-row class="mb10">
            <el-col :span="4">发起人： 张三</el-col>
            <el-col :span="20">发起时间： 2019-01-22</el-col>
          </el-row>
          <el-row style="margin: 20px 0">
            <el-col :span="4">审批流程：</el-col>
            <el-col :span="20">
              <el-steps :space="200" :active="1" finish-status="success">
                <el-step title="张三"></el-step>
                <el-step title="李四"></el-step>
                <el-step title="王五"></el-step>
              </el-steps>
            </el-col>
          </el-row>
        </div>
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title">基本信息：</p>
        <div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编号：">
                <span>{{form.proNo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号：">
                <span>{{form.contractsNo}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：">
                <span>{{form.projectName}}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="客户名称：">
                <span>{{form.customerName}}</span>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户名称：">
                <span>{{form.customerName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款内容：">
                <span>{{form.payContent}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号：">
                <span>{{form.invoiceNo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票信息：">
                <span>{{form.invoiceInfo}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行：">
                <span>{{form.bank}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号：">
                <span>{{form.bankAccount}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款金额：">
                <span>{{form.payAmount}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额大写：">
                <span>{{form.amountChinese}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注：">
                <span>{{form.remark}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title">费用明细：</p>
        <div style="padding: 0 4%">
          <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title">附件信息：</p>
        <div style="padding: 0 4%">
          <p>单位名称</p>
          <p>单位名称</p>
        </div>

      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="">取 消</el-button>
        <el-button type="primary" size="medium" @click="reject">驳 回</el-button>
        <el-button type="primary" size="medium" @click="agree">同 意</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
    <el-row style="margin-top: 20px;margin-right: 13px">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="medium">返回</el-button>
      </el-col>
    </el-row>
    <!--驳回弹框-->
    <el-dialog
      title="驳回操作"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="110px" :model="editForm" ref="editForm" class="demo-form-inline">
        <el-form-item label="驳回原因：">
          <el-input type="textarea" :rows="4" v-model.trim="editForm.reason" :maxlength="350" placeholder="请输入驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确 认</el-button>
        <el-button type="primary" size="small" @click="cancelSubmit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        canClick: false,
        //
        flag: false,
        dialogVisible: false,
        type: '',
        form: {},
        editForm: {
          reason: ''
        },
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        tableHeader: [{
          prop: 'no',
          label: '序号',
          width: '80',
          show: true
        }, {
          prop: 'costType',
          label: '费用类型',
          align: 'center',
          show: true
        }, {
          prop: 'amount',
          label: '金额（元）',
          align: 'center',
          show: true
        }, {
          prop: 'amountChinese',
          label: '金额大写',
          align: 'center',
          show: true
        }]
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        this.listLoading = false
      },
      reject () {
        this.dialogVisible = true
      },
      /**
       * 表单提交
       */
      confirm () {
        if (!this.editForm.reason) {
          this.$notify.warning({
            title: '提示',
            message: '请输入驳回原因'
          })
          return
        }
        this.$confirm('您确定要驳回此申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$notify.success({
            title: '提示',
            message: '驳回成功'
          })
          this.$router.push({path: '/router/myAudit'})
          this.dialogVisible = false
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '驳回成功'
          })
          this.$router.push({path: '/router/myAudit'})
        })
      },
      cancelSubmit () {
        this.editForm.reason = ''
        this.dialogVisible = false
      },
      agree () {
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
  .el-form-item__label{padding: 0!important;}
</style>

