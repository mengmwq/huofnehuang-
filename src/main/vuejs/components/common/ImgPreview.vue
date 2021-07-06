<template>
<el-dialog
      :title="title"
      :visible.sync="isShowDialog"
      :style="'height:'+isFullscreen?'100%':height"
      :before-close = "closeDialog"
      :fullscreen="isFullscreen"
      append-to-body
      :width="width">
    <viewer :images="handImg">
     <img v-for="src in pictures" :src="src" :key="src" width="50" height="50px">
	</viewer>
     <!-- <div v-for="(item,index) in pictures" :key="index" class="imgBox">
              <img :src="item.url? item.url : item" alt=""  :key="item.title" :preview="1" :preview-text="item.name">
          </div>-->
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
          default:'图片预览（ 双击图片可放大 ）',
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
                 
          //异步插入的图片
					setTimeout(() => {
						//this.img1.push(data)
						this.$previewRefresh()
					}, 2000);

					//图片查看器打开后，打印本次查看器的实例（事件、方法、属性的示例）
					this.$preview.on('imageLoadComplete',(e,item)=>{
            console.log(this.$preview.self)
            this.$emit('closeDialog', false)
					})
    },
    methods: { 
      handImg(){
        //防止出错
      },
      /** 关闭浮窗*/
      closeDialog: function () {
        this.$emit('closeDialog', false)
      },
      
    }
  }

</script>
<style lang="scss" scoped>
  .imgBox {
     max-width:100%;
     max-height:450px;
     overflow:auto;
  }
</style>
