<template>
  <div>
    <div class="titleBar mt10">
        <div class="titleName">审批意见</div>
    </div>
    <div >
      <el-radio-group v-model="form.status">
        <el-radio :label="0">同意</el-radio>
        <el-radio :label="1">驳回</el-radio>
      </el-radio-group>
      <el-input type="textarea" class="mt10"  v-model.trim="form.reason" show-word-limit :maxlength="60" placeholder="请输入原因"></el-input>
    </div>
    <div class="tar mt10">
      <el-button type="default" class="ml10"  @click="goBack">返回</el-button>
      <el-button type="primary" class="ml10"  @click="sumbitApproval()">提交</el-button>
    </div>
  </div>
</template>
<script>
import Api from '@/api/index'
export default {
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      userInfo: userInfo,
      listLoading: false,
      form:{
        status:0,
        reason:"",
        id:''
      },
    }
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    },
     // 提交审批
    sumbitApproval (row) {
      // 输入修改原因；
      let params = this.form
      const status = params.status
      if(status===1 && !params.reason){
        this.$message({
           showClose:true,
           message:'审批驳回时，必须要输入原因！',
           type:'error'
        })
        return;
      }
      params.id = this.$route.query.currentNodeId  //审批当前节点 ID;
      const fn = status ===1?'approvalRefuse':'approvalAccept' 
      const msg = status ===1?'审批驳回操作成功！':'审批同意操作成功！'
      Api[fn](params).then((res) => {
        this.$router.go(-1)
        this.$message({showClose: true, message: `${msg}`, type: 'success'})
        //获取审批数量
        this.$store.dispatch('getApprovalCount',{states:2})
      })
    }

  }
}
</script>
<style lang="scss" scoped>
    .remark{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>

