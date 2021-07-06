<template>
  <div>
    <!--添加包装箱信息-->
    <AddPackage :operateFlag="'pro-detail-edit'" :projectCode="projectCode" :stateId="stateId"></AddPackage>
    <!--添加货物信息-->
    <MaterialDetail v-if="projectType !== '4'"
            operateFlag="pro-detail-edit"
            importFlag = "pro-detail-import"
            :projectType="projectType"
            :projectCode="projectCode"
            :stateId="stateId"></MaterialDetail>
     <MaterialDfgDetail v-else-if="projectType === '4'"
            operateFlag="pro-detail-edit"
            importFlag = "pro-detail-import"
            :projectType="projectType"
            :projectCode="projectCode"
            :stateId="stateId"></MaterialDfgDetail>
    <!--内部包装箱信息-->
    <InnerPackageInfo :projectCode="projectCode" :stateId="stateId"></InnerPackageInfo>
  </div>
</template>

<script>
  import AddPackage from '@/pages/my/project/AddPackage'
  import MaterialDetail from '@/pages/my/project/MaterialDetail'
  import MaterialDfgDetail from '@/pages/my/project/MaterialDfgDetail'
  import Budget from '@/pages/my/project/Budget'
  import InnerPackageInfo from '@/pages/my/task/InnerPackageInfo'
  import Api from '@/api/index'
  export default {
    components: {
      AddPackage,
      MaterialDetail,
      MaterialDfgDetail,
      Budget,
      InnerPackageInfo
    },
    data () {
      return {
        projectCode: '',
        projectType: '',
        //stateId:''
      }
    },
    props: {
      id: String,
      type: String,
      stateId: String
    },
    watch: {
      id: function (value) {
      
        this.projectCode = value
      },
      type: function (value) {
        this.projectType = value
      },
      stateId: function (value) {
        this.stateId = value
      }
    },
    mounted () {},
    methods: {
    }
  }
</script>

<style scoped>
  .sub-header {
    margin: 10px 0;
  }
  .sub-title {
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
  }
</style>
