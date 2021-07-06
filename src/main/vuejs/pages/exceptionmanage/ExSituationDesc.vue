<template>
  <div>
    <p>{{msg}}</p>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: '异常情况说明'
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
