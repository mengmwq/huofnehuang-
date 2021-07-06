<template>
  <div class="formDetails">
    <!-- <i class="logo_bj"></i> -->
    <img v-if="form.offerExtend.org" :src="'http://cdn.m56.cn/'+form.offerExtend.org+'.png'" style="height:60px;" alt="">
    <el-form :model="form" ref="form" label-width="80px" class="priceTable mt10">
      <el-form-item label="">
        <span>致敬：{{form.offerExtend.receiver}}</span>
      </el-form-item>
      <el-form-item label="">
        <strong>项目：</strong>
        <span>{{form.projectName}}</span>
      </el-form-item>
      <el-form-item label="">
        <strong>报价人：</strong>
        {{form.offerExtend.offerPerson}}
      </el-form-item>
      <el-form-item label="">
         <strong>日期：</strong>
        <span>{{form.offerExtend.offerDate | dateFormat}}</span>
      </el-form-item>
      <!-- <el-form-item label="致敬:">
        <div class="textarea-content" v-html="form.offerExtend.greetContent"></div>

      </el-form-item> -->
      <el-form-item label="">
        <strong>报价描述：</strong>
        <div class="textarea-content" v-html="form.offerExtend.offerDesc"></div>
      </el-form-item>

      <el-row class="table">
        <el-row class="header" style="padding: 10px 50px;background: #222222;color:#fff">
          <el-col :span="20"> 报价明细</el-col>
          <el-col :span="4" class="text-center">来程</el-col>
        </el-row>
        <el-row style="padding: 12px 50px;border-bottom: 1px solid #efefef" v-for="(item, index) in form.offerDetaileds" :key="index">
          <el-col :span="20">{{index + 1}}、{{item.cnDetailed}}</el-col>
          <el-col :span="4" class="text-center">{{item.quotationAmount}}</el-col>
        </el-row>
        <el-row class="foote" style="margin: 10px 0">
          <el-col :span="18" class="text-right bold">小计：</el-col>
          <el-col :span="6" class="text-center">{{form.total}}</el-col>
        </el-row>
        <el-row class="footer mb10">
          <el-col :span="18" class="text-right bold">税费：</el-col>
          <el-col :span="6" class="text-center">
            <span>{{form.offerExtend.taxFee}}</span>
          </el-col>
        </el-row>
        <el-row class="footer mb10">
          <el-col :span="18" class="text-right bold">合计：</el-col>
          <el-col :span="6" class="text-center">{{parseFloat(form.allFee).toFixed(2)}}</el-col>
        </el-row>
        <!-- <el-row class="footer mb10">
          <el-col :span="18" class="text-right bold">实际成交价：</el-col>
          <el-col :span="6" class="text-center">
            {{form.offerExtend.actualPay}}
          </el-col>
        </el-row> -->
      </el-row>
      <el-form-item label="">
        <strong>额外报价项目：</strong>
        <div class="textarea-content" v-html="form.offerExtend.extOfferProject"></div>
      </el-form-item>
      <el-form-item label="">
         <strong>报价明细内容：</strong>
        <div class="textarea-content" v-html="form.offerExtend.offerDetailContent"></div>
      </el-form-item>
      <el-form-item label="">
        <strong>备注：</strong>
        <div class="textarea-content" v-html="form.offerExtend.remark"></div>
      </el-form-item>
      <el-row class="footer">
        <el-col :span="12" class="text-left">
          <el-form-item label="">
            <strong>甲方签字：</strong>
            <span></span>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="text-left">
          <el-form-item label="">
              <strong>乙方签字：</strong>
            <span></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
    import hfhJpg from '@/assets/img/hfh.jpg'
    export default {
      name: "OfferApprovalInfo",
      data () {
        return {
          tab: 1,
        
          form: {
            offerExtend: {}
          },
          listData2: [],
          hfhJpg
        }
      },
      props: {
        info: Object
      },
      watch: {
        info: function (value) {
          this.form = value
          let total = 0
          this.form.offerDetaileds.forEach(function(item){
            total += parseFloat(item.quotationAmount)

          })

          this.form.total = total
          if (this.form.offerExtend.taxFee) {
            this.form.allFee = this.form.offerExtend.taxFee + total
          } else {
            this.form.allFee = total
          }
        }
      }
    }
</script>

<style scoped>

  .textarea-content{
    padding: 5px;
    white-space: pre-wrap;
  }


</style>
