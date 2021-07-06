<template>
  <div v-if="iframeSrc">
   <iframe  frameborder="0" marginheight="0" marginwidth="0" scrolling="no" id="content-frame" name="content-frame" allowfullscreen="true" allowtransparency="true" style="width: 100%; height: 487px; background: rgb(255, 255, 255); overflow: hidden; min-height: 487px;" :src="iframeSrc"></iframe>
    <!-- <iframe  src="https://truck.g7s.huoyunren.com/v2/monitor/index.html?__displayrunner__=gateway" width="100%"  style="min-height:520px;" frameborder="0"></iframe> -->
    <div class="tar">
       <el-button type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
    </div>
  </div>
</template>


<script>

  export default {
    data () {
      return {
        iframeSrc:'',
      }
    },
    mounted () {
       const carnum = this.$route.query.carnum
       const gpsno = this.$route.query.gpsno
       const query = [{
         carnum:carnum,
         gpsno:gpsno,
         autoplay:1
       }]
       console.log(JSON.stringify(query))
       this.iframeSrc=`https://truck.g7s.huoyunren.com/v2/follow/index.html?param=${JSON.stringify(query)}&amp;__displayrunner__=gateway`
       
    },
    methods: {

    }
  }
</script>

