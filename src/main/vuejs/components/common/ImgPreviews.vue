<template>
<el-dialog
      :title="title"
      :visible.sync="isShowDialog"
      :style="'height:'+isFullscreen?'100%':height"
      :before-close = "closeDialog"
      :fullscreen="isFullscreen"
      :width="width">
      <div v-for="(item,index) in pictures" :key="index" class="imgBox">
              <img :src="item.url? item.url : item" alt="">
          </div>
</el-dialog>
</template>
<script>
  export default {
    name: 'ImgPreview',
    components: {},
    props:{
      isShowDialog:{
        type:Boolean,
        default:false,
      },
      pictures:{
        type:Array,
        default:[],
      },
      title:{
          type:String,
          default:'图片预览',
      },
      width:{
          type:String,
          default:'50%',
      },
      height:{
          type:String,
          default:'60%'
      },
      isFullscreen:{
          type:Boolean,
          default:false,
      },
    },
    data: function () {
      return {
      }
    },
    mounted(){
    console.log(this.pictures,'sfdsaf')
    },
    methods: { 
      /** 关闭浮窗*/
      closeDialog: function () {
        this.$emit('closeDialog', false)
      },
      
    }
  }

</script>
<style lang="scss" scoped>
  .imgBox {
     width:100%;
     height:500px;
     overflow:auto;
  }
</style>
