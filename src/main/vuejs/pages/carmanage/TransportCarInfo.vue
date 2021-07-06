<template>
  <div>
    <el-form label-position="right" :model="form" ref="form" label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="道路运输编号：">
            <span>{{form.trainTransportCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业名称：">
            <span>{{form.company}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址：">
            <span>{{form.companyAddr}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营许可证号：">
            <span>{{form.businessLicense}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆类型：">
            <span>{{form.transportationVehiclesType | carTypeFilter}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆（毫米）：">
            <span>长x宽x高：{{form.length}} x {{form.width}} x {{form.height}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="吨（坐）位：">
            <span>{{form.tonnage}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发证日期：">
            <span>{{form.businessCertificateDate | DateFormat}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营范围：">
            <span>{{form.businessRange}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="step-title">交强保险信息：</p>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保单号码：">
            <span>{{form.policyNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险到期日：">
            <span>{{form.policyEndDate | DateFormat}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保险公司：">
            <span>{{form.policyCompany}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险费用(元)：">
            <span>{{form.premium}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保险金额(元)：">
            <span>{{form.insuredAmount}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="step-title">商业保险信息：</p>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保单号码：">
            <span>{{form.taxesPolicyNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险到期日：">
            <span>{{form.taxesPolicyEndDate | DateFormat}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保险公司：">
            <span>{{form.taxesPolicyCompany}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险费用(元)：">
            <span>{{form.taxesPremium}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="保险金额(元)：">
            <span>{{form.taxesInsuredAmount}}</span>
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
    props: {
      carData: Object
    },
    watch: {
      carData: function(value){
        this.form = value
      }
    },
    mounted () {
       this.loadData()
    },
    methods: {
      //加载数据
      loadData () {
        Api.queryCarInfoById({
          id: this.$route.query.id
        }).then(data => {
          this.form = data
        })
      }
    }
  }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0px!important;
  }
</style>
