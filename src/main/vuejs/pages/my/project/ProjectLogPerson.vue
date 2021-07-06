<template>
  <div>
     <el-row>
        <el-col :span="12">
          <div class="tab-nav" style="margin:0">
            <div class="nav-item tab" @click="changeTabData(index)"  v-for="(item,index) in tabItem" :key="index">
              <span :class="tabIndex===index ? 'tab-active' : ''"> {{item}}</span>
            </div>
          </div>
        </el-col>
     </el-row>
    
     <!-- 日志列表 -->
    <ProjectLog v-if="tabIndex==0" :listPage="listPage" :stateId="stateId" :tableRow="tableRow"  :query="query"></ProjectLog>
     <!--人员列表 -->
    <ProjectPerson v-if="tabIndex==1"></ProjectPerson>
  
  </div>
</template>

<script>
  import Api from '@/api/index'
  import ProjectLog from './ProjectLog'
  import ProjectPerson from './ProjectPerson'
  
  export default {
    components:{
      ProjectLog,
      ProjectPerson,
    },
    props:{
       stateId:String,
       form:{
         type:Object,
       },
    },
    watch:{
      stateId: function (value) {
        this.stateId = value
      }
    },
    data () {
      const projectCode = this.$route.query.id
      return {
        isShowPrint:false,
        listLoading:false,
        tableRow:0,
        listPage:null,
        query: {
          pageSize: 10,
          pageNum: 1,
          projectCode: projectCode,
          searchStr: "",
          applyDate: ""
        },
        
        tabIndex: 0,
        tabItem:['日志列表','人员列表']
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      /**
     * 加载
     */
      loadData() {
        this.listLoading = true;
        const params = {
          relationId: this.$route.query.id
        }
        Api.getProjectBalanceTotal(params).then(res => {
          console.log(res,'fsfsaf')
          if (res) {

            this.listPage = res;
            if(res.receivable.length>res.expenditure.length){
               this.tableRow = res.receivable.length
            }else{
               this.tableRow = res.expenditure.length
            }
          }
          this.listLoading = false;
        });
        this.listLoading = false;
      },
      printTable(){
        this.isShowPrint = true;
        this.$nextTick(()=>{
           this.$refs.easyPrint.print()
         })
      },
      changeTabData (index) {
        this.tabIndex = index
       
      },
      
    }
  }
</script>
