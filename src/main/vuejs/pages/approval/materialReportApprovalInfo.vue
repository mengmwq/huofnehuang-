<template>
  <div>
    <el-form label-position="right" :model="form" ref="form" label-width="130px">
      <p class="step-title">基本信息：</p>
      <div >
        <el-row>
          <el-col :span="12">
            <el-form-item label="主运单号：">
              {{form.mainCode}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号：">
              {{form.contractCode}}
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
            <el-form-item label="发货地：">
              {{form.originPlace}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申报日期：">
              {{form.declareDate | timeFormat}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名称：">
              {{form.chineseName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称：">
              {{form.englishName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="件数：">
              {{form.quantity}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重量：">
              {{form.weight}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="件号：">
              {{form.pieceMode}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个数：">
              {{form.num}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票金额：">
              {{form.receiptPrice}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期：">
              {{form.day}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报关单号：">
              {{form.customsNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贸易方式：">
              {{form.tradeMode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="国内目的港：">
              {{form.internalDesPort}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方式：">
              {{form.shipMode}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关税：">
              {{form.customsTax}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增值税：">
              {{form.valueAddTax}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关税编号：">
              {{form.taxNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增值税编号：">
              {{form.valueAddTaxNo}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              {{form.remark}}
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "materialReportApprovalInfo",
    data () {
      return {
        form: {}
      }
    },
    props: {
      info: Object
    },
    watch: {
      info: function (value) {
        this.form = value
      }
    }
  }
</script>

<style scoped>

</style>
