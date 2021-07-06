<template>
  <div>
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="品名:">
        {{form.goodsName}}
      </el-form-item>
      <el-form-item label="规格:">
        {{form.specifications}}
      </el-form-item>
      <el-form-item label="单价:">
        {{form.unitPrice}}
      </el-form-item>
      <el-form-item label="数量:">
        {{form.num}}
      </el-form-item>
      <el-form-item label="备注:">
        {{form.remark}}
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: "ConsumeApprovalInfo",
    data () {
      return {
        form: {}
      }
    },
    props: {
      info: Object
    },
    watch: {
      info: function (value){
        this.form = value

      }
    }
  }
</script>

<style scoped>

</style>
