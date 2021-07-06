<template>
  <div>
    <p>{{msg}}</p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: '异常处理结果'
      }
    },
    mounted () {
      this.msg = this.$route.query.msg;
    },
    methods: {}
  }
</script>

<style scoped>

</style>

