<template>
  <el-dialog
      title="详细资料"
      :visible.sync="isShowDialog"
      :before-close = "closeDialog"
      :close-on-click-modal="canClick"
      width="50%">
      <h1>{{editForm.title}} <span class="subTitle">{{getFormatTime(editForm.happenTime)}}</span></h1>

       <div v-html="removeStyle(editForm.content)"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" size="small" class="cancel-btn-big" @click="closeDialog">关闭</el-button>
      </div>
</el-dialog>
</template>
<script>
  import Api from '@/api/index'
  import Util  from '@/utils/'
  export default {
    name: 'MessageDetails',
    components: {},
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        canClick: false,
      }
    },
    computed: {

    },
    mounted () {


    },
    methods: {
      /**
       * 去除style标签
       */
      removeStyle(content){
        return Util.removeStyle(content)
      },
      /**
       * 格式化时间
       */
      getFormatTime(time){
        return Util.getFormatTime(time)
      },
      /**
       * 关闭浮窗
       */
      closeDialog () {
        this.$emit('closeDetailsDialog', false)
      },
    }
  }

</script>
<style lang="scss" scoped>
.subTitle {padding-left:20px; font-size:12px; color:#bbb;}
</style>
