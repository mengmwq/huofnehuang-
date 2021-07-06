<template>
    <div>
        <el-form label-position="right" :model="form" ref="form" label-width="200px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="统一社会信用代码：">
                        <span>{{form.enterpriseCode}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Account Name：">
                        {{form.accountName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开户银行：">
                        <span>{{form.depositBank}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Account Address：">
                        <span>{{form.accountAddress}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="对公账户：">
                        <span>{{form.publicAccounts}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Account Number：">
                        <span>{{form.accountNumber}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="企业地址：">
                        <span>{{form.bankAddress}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Bank Detail：">
                        <span>{{form.bankDetails}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="税号：">
                        <span>{{form.dutyParagraph}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Swift Code：">
                        <span>{{form.swiftCode}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="">
                        <span>{{form.serviceContent}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="BSB：">
                        <span>{{form.bsb}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="12">
                    <el-form-item label="GSS ABN：">
                        <span>{{form.gssAbn}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="12">
                    <el-form-item label="Remark：">
                        <span>{{form.enterpriseRemark}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="12">
                    <el-form-item label="Certifuicate Number：">
                        <span>{{form.certifuicaenumber}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import Api from '@/api/index'
export default {
  data () {
    return {
      id: '',
      form: {}
    }
  },
  mounted () {
    // 客户资质信息
    if (this.$route.path === '/router/customerSeniorityInfo') {
      Api.customerDetail({id: this.$route.query.id}).then((res) => {
        if (res) {
          this.form = res
        }
      })
    }
    // 战略合作伙伴资质信息
    if (this.$route.path === '/router/partnerSeniorityInfo') {
      Api.partnerDetail({id: this.$route.query.id}).then((res) => {
        if (res) {
          this.form = res
        }
      })
    }
    //  供应商资质信息
    if (this.$route.path === '/router/supplierSeniorityInfo') {
      Api.supplierBaseInfo({id: this.$route.query.id}).then((res) => {
        if (res) {
          this.form = res
        }
      })
    }
  },
  methods: {

  }
}
</script>

<style scoped>
    .el-form-item {
        margin-bottom: 0px!important;
    }
</style>
