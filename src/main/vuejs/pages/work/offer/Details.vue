<template>
  <div class="formDetails">
      <div v-if="form">
    <img v-if="form.offerExtend.org" :src="'http://cdn.m56.cn/'+form.offerExtend.org+'.png'" style="height:60px;" alt="">
    <el-form :model="form" ref="form" label-width="80px" class="priceTable">
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
          <el-col :span="6" class="text-center">{{form.allFee?parseFloat(form.allFee).toFixed(2):0}}</el-col>
        </el-row>
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
    <!--审批意见处理--->
    <div v-if="$route.query.approvalStatus === 'pendingApproval'">
      <ApprovalHandle></ApprovalHandle>
    </div>
      <div v-else class="tar pd20">
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </div>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import ApprovalHandle from '../ApprovalHandle'

  export default {
    components: {
      ApprovalHandle
    },
    data () {
      return {
       form:{
         total:0,
         offerExtend:{

         }
       },
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      loadData () {
        const params = {
            id:this.$route.query.id
        }
        Api.previewOffer(params).then(res => {
          if (res) {
             this.form = res
             let total = 0
           res.offerDetaileds.forEach((item)=>{
                total += parseFloat(item.quotationAmount)
            })
            console.log(total,'total')
            
            if (res.offerExtend.taxFee) {
                this.form.allFee = res.offerExtend.taxFee + total
            } else {
                this.form.allFee = total
            }
            
             this.form.total = total
          }
        });
      },
    }
  }
</script>

