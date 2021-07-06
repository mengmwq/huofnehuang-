<template>
  <div>
    <OfferApprovalInfo :info="info"></OfferApprovalInfo>
    <el-row class="text-right m10">
      <el-button type="primary" size="medium" @click="$router.go(-1)">返回</el-button>
    </el-row>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import OfferApprovalInfo from '@/pages/approval/OfferApprovalInfo'

  export default {
    components: {
      OfferApprovalInfo
    },
    data () {
      return {
        active: '1',
        targetId: '',
        tab: 1,
        info: {
          offerDetaileds: []
        }
      }
    },
    mounted () {
      this.targetId = this.$route.query.targetId
      this.loadData()
    },
    methods: {
      loadData () {
        Api.previewOffer({id: this.targetId}).then(res => {
          if (res) {
            this.info = res
          }
        });
      },
    }
  }
</script>

