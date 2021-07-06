<template>
  <el-dialog
    title="选择审核流程"
    :visible.sync="isShowDialog"
    :before-close="closeDialog"
    fullscreen
    class="bigScreen"
  >

   <ProcessDefinition pageFlag="selectProcess" @confirmProcess="confirmProcess" :category="category"></ProcessDefinition>
  </el-dialog>
</template>
<script>
import Api from '@/api/index'
import ProcessDefinition from './processDefinition/Index'
export default {
  components: {
    ProcessDefinition,
  },
  props:{
    isShowDialog:{
      type:Boolean,
      default:false,
    },
    category:{
      type:String,
      default:''
    },

    
  },
  data () {
    
    return {
      
    }
  },
  mounted () {
  },
  methods: {
    confirmProcess(processInfo){
      this.$emit('confirmProcess',processInfo)
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>
