<template>
  <div>
    <el-row class="mb10">
      <!-- 操作 -->
      <el-col :span="12">
       <!-- <el-button-group>
          <el-button type="success">报名签到（6）</el-button>
          <el-button type="info">活动变更（2）</el-button>
          <el-button type="info">系统通知（10）</el-button>
        </el-button-group>-->&nbsp;&nbsp;&nbsp;
        <el-button type="success" @click="batchDelete">删除</el-button>
        <el-button type="success" @click="batchRead('batch')">标记已读</el-button>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-row class="page-table-box">
      <!-- 表格 -->
      <el-table class="page-table" :data="notifyPage && notifyPage.result" stripe
                highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}" @selection-change="selsChange">
        <el-table-column type="selection" min-width="60"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                         :label="header.label" :sortable="header.sortable" :min-width="header.width">
             <template slot-scope="scope">
                  <div v-if="header.prop == 'happenTime'">
                     {{getFormatTime(scope.row.happenTime)}}
                  </div>
                  <div v-else-if="header.prop == 'title'">
                     <a href="javascript:;" @click="showDetails(scope.row)" :class="{'readed':scope.row.receiver.read}">{{scope.row.title}}</a>
                  </div>
               <div v-else>{{scope.row[header.prop]}}</div>
              </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页 -->
    <el-row type="flex" class="page-box" justify="center">
      <el-pagination
        @size-change="handleSizeChange" :total="notifyPage ? notifyPage.totalCount : 0"
        @current-change="handleCurrentChange"
        layout="total,sizes, ->,prev, pager, next"
        :page-sizes="[10, 25, 50]"
        :page-size="searchForm.pageSize">
      </el-pagination>
    </el-row>
     <message-details v-if="isShowDetailsDialog" :isShowDialog="isShowDetailsDialog" :editForm="editForm"  @closeDetailsDialog="closeDetailsDialog"></message-details>

    <!-- <!--<TableColumn @change="columnChange" :tableHeader="tableHeader" @tableStatusChange="tableStatusChange"></TableColumn>--> -->
  </div>
</template>
<script>
  // import TableColumn from '@/components/common/TableColumn'
  import Util from '@/utils/'
  import Api from '@/api/index'
  import MessageDetails from './MessageDetails'
  export default {
    name: 'MessageCenter',
    components: {
      MessageDetails
    },
    computed: {
      notifyPage() {
        return this.$store.state.notify.notifyPage
      }
    },
    data () {
      const jwt = JSON.parse(sessionStorage.getItem(jwt))
      const userId = jwt.id
      return {
        isShowDetailsDialog:false,
        userId:userId,
        /**
         * 查询条件
         */
        searchForm:{
          "clear": true,
          "pageNumber": 1,
          "pageSize": 10,
          "type": "",
          "userId": userId
        },
        tableStatus: true,
        tableHeader: [{
          prop: 'title',
          label: '标题',
          width: '520',
          show: true
        }, {
          prop: 'happenTime',
          label: '时间',
          width: '120',
          show: true
        }],
        listLoading: false,
        sels:[],
      }
    },
    mounted () {
      this.search()
    },
    methods: {
       /**
       * 关闭详情弹窗
       */
      closeDetailsDialog(){
        this.isShowDetailsDialog = false
      },
      showDetails(row){
        this.editForm = Object.assign({},row)
        this.batchRead('one',row)
        this.isShowDetailsDialog = true
      },
      /**
       * 选中改变
       */
      selsChange(sels) {
        this.sels = sels;
      },
      /**
       * 批量删除消息
       */
      batchDelete(){
         const selected = this.sels
         if(selected.length>0){

            const params = {
                userId:this.userId,
                messageIds:selected.map(item=>item.id).toString()
            }
            const title = selected.map(item=>item.title).toString()
            //**查询未读数量 */
            const unReadCount = selected.map(item=>!item.receiver.read)
            console.log(readedCount)
             const msg = `删除消息【${title}】`
              this.$confirm(`此操作将${msg}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                  Api.batchDelMsg(params).then(res=>{
                    if(res){
                      /**
                        * 消息数量改变：仅处理未读数量
                        */
                      
                      // this.$emit('messageCountChange',readCount)
                      // this.search()
                      //删除成功做未读消息处理
                      this.submitReaded(unReadCount)
                      //this.$message({showClose:true, message:'标记已读', type:'success'})
                    }
                  })
              })
            
         }else{
            this.$message({showClose:true, message:'请至少选择一条消息', type:'error'})
         }
      },
      /**
       * 提交未读记录
       */
      submitReaded(unReaded){
        const params = {
            userId:this.userId,
            messageIds:unReaded.map(item=>item.id).toString()
        }
        Api.batchRead(params).then(res=>{
          if(res){
            /**
              * 消息数量改变
              */
            this.$emit('messageCountChange',unReaded.length)
            this.search()
          }
        })
      },
      /**
       * 批量标记已读
       */
      batchRead(flag,row){
         let selected = flag=='batch'?this.sels:[row]
         let unReaded= selected.filter(item=>!item.receiver.read)
        
         //是否选择了一条消息
         if(selected.length==0){
            this.$message({showClose:true, message:'请至少选择一条消息', type:'error'})
            return false
         }
         /**
          *  flag 值 one,代表单条查看，batch代表批量已读
          */
         if(unReaded.length==0 && flag =='batch'){
            this.$message({showClose:true, message:'所选消息已读过', type:'error'})
            return false
         }
         /**
          * 所选消息既有大于已读也有未读的时候, 只提交标记未读的记录
          */
         if(unReaded.length>0){
            this.submitReaded(unReaded)
         }
         
      },
      /**
       * 格式化时间
       */
      getFormatTime(time){
        return Util.getFormatTime(time)
      },
      /***
       * 表头切换
       */
      columnChange (data) {
        this.tableHeader = data
      },

      /**
       * 表头拖拽状态改变
       */
      tableStatusChange (val) {
        this.tableStatus = val
      },

      /**
       * handle size change
       */
      handleSizeChange (val) {
        this.searchForm.pageSize = val
        this.search()
      },

      /**
       * handle current change
       */
      handleCurrentChange (val) {
        this.searchForm.pageNumber = val
        this.search()
      },

      /**
       * 查询
       */
      search() {
      const params = this.searchForm;
      this.$store.dispatch('getNotifyPage', params);
    },

    
      // search1 () {
      //   this.listData.result = []
      //   for (let i = (this.searchForm.pageNumber - 1) * this.searchForm.pageSize; i < this.searchForm.pageNumber * this.searchForm.pageSize; i++) {
      //     this.listData.result.push({
      //       title: '火凤凰重要通知，非常重要，一定要看！！！' + (i + 1),
      //       time: '2018-12-02 12:12:12'
      //     })
      //   }
      // }
    }
  }
</script>
<style>
.readed {
  color:#333;
  text-decoration: none
}
</style>
