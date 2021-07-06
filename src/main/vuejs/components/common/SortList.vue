<template>
<div>
    
    <div v-if="isOpenAdjust">
        <div class="adjustBtn">
            <span>上下拖动部门调整位置</span>
            <el-button type="info" size="mini" @click="saveAdjust">保存</el-button>
            <el-button type="info" size="mini" @click="cancelAdjust">撤销</el-button>
        </div>
        <draggable v-model="departmentData" :options="{group:'people'}" @start="dragStart" @end="dragEnd"  @dragover="allowDrop">
            <dd class="adjustItem" v-for="(item,index) in departmentData" :key="index">
                {{item.name}} ({{item.personNum?item.personNum:0}}人)
            </dd>
        </draggable>
    </div>
    <div v-else>
        <dd class="item" v-for="(item,index) in departmentData" :key="index">
            {{item.name}} ({{item.personNum?item.personNum:0}}人)
        </dd>
    </div>
  </div>
</template>
<script>
import Api from "@/api/index"
import Util from '@/utils/'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable,
  },
  props:['isOpenAdjust','pageParams', 'departmentList'],
  computed:{
    // departmentData(){      
    //    if(this.departmentList){
    //        return this.departmentList;
    //    }else{
    //      return [];
    //    }
    // },
  },
  data() {
    const userId =JSON.parse(sessionStorage.getItem('jwt'))?JSON.parse(sessionStorage.getItem('jwt')).id:null
    return {      
        departmentData:[]
    }
  },
  mounted() {      
    this.departmentData=this.departmentList
  },
  methods: {
    allowDrop (ev) {
        ev.preventDefault();
    },
    dragStart(){            
    },
    dragEnd(){
    }, 
    /**
     * 取消调整顺序
     * */   
    cancelAdjust(){
       this.$emit('adjustSortChange',false); 
    },
    /**
     *   保存调整顺序
     * */   
    saveAdjust(){
        this.submitSort()
        this.$emit('adjustSortChange',true);
    },
    /**
     * 提交排序
     */
    submitSort(){
        const params = this.departmentData
        Api.updateOrgListOrder(params).then(res=>{
            if(res){
                this.$message({showClose:true,message:'部门顺序调整成功', type:'success'})
                this.$emit('adjustSortChange',true,params.parentId)
            }
        })
    },
  }
}

</script>
<style lang="scss" scoped>
.adjustItem,
.item {
    margin:0;
    padding:10px;
    border-bottom:1px solid #ccc;
}
.adjustItem{
     cursor:move;
}
.adjustBtn{
    padding:10px;
    text-align: center;
    background:#f0f0f0
}
</style>


