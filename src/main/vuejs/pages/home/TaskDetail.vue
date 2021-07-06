<template>
  <el-dialog
      :title="`项目【${taskDetail.projectName}】任务列表`"
      :before-close="closeDialog"
      :visible.sync="isShowTaskDetail"
      size="tiny" top="12vh" width="70%">
     
      
      <el-table  class="page-table" :data="taskTable" stripe highlight-current-row
                      :cell-style="{color:'#333'}" max-height="400">
        <template v-for="(header, index) in tableHeader" >
            <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'title'">
                  <a href="javascript:;" @click="showNoticeInfo(scope.row)">{{scope.row.title}}</a>
                </div>
                <div v-else-if="header.prop == 'createDt'">
                  <span>{{scope.row.createDt | DateFormat}}</span>
                  <span v-if="scope.row.completionDate"> ~ {{scope.row.completionDate | DateFormat}}</span>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
        </template>
      </el-table>
    </el-dialog>
</template>


<script>
  import Api from '@/api/index'
  export default {
    props:['taskDetail','isShowTaskDetail'],
    data () {
      return {
        taskTable:[],
        tableHeader: [{
            prop: 'name',
            label: '任务名称',
            align: 'center',
            width:'200',
            show: true
          },
          // {
          //   prop: 'title',
          //   label: '任务描述',
          //   align: 'center',
          //   width:'200',
          //   show: true
          // }, 
          {
            prop: 'executorName',
            label: '执行人',
            width: '120',
            show: true
          }, {
            prop: 'directorName',
            label: '协同人',
            width: '120',
            show: true
          }, {
            prop: 'createDt',
            label: '占用时间',
            width: '110',
            show: true
          }],
      }
    },
    mounted () {
      console.log(this.taskDetail,'dddd')
      this.getProjectTaskDetail()
    },
    methods: {
      getProjectTaskDetail(){
        const params = {
            projectCode :this.taskDetail.projectCode
        }
        Api.peopleTaskInfo(params).then(res=>{
            this.taskTable = res;
        })
      },
      closeDialog(){
          this.$emit('closeDialog')
      },
       
    }
  }
</script>

