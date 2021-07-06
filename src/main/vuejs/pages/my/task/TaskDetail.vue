<template>
  <div>
    <el-row class="project-header">
      <el-col :span="4">
        <div class="project-status">
          <div>任务状态<br/>进行中</div>
        </div>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>任务名称：{{detailInfo.taskInfo.name}}</li>
          <li>任务类型：{{getDictsKeyName(detailInfo.taskInfo,'TasType',detailInfo.taskInfo.type)}}</li>
          <li></li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>项目名称：{{detailInfo.taskInfo.projectName}}</li>
          <li>级别标准：{{getDictsKeyName(detailInfo.taskInfo,'TaskLevel',detailInfo.taskInfo.level)}}</li>
          <li>&nbsp;</li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>预计完成时间：{{detailInfo.taskInfo.completionDate | dateFormat}}</li>
          <li>执行部门：{{detailInfo.taskInfo.orgName}}</li>
          <li></li>
          <li></li>
        </ul>
      </el-col>
      <el-col :span="2">
          <el-button  type="primary"  size="small" @click="$router.go(-1)">返回</el-button>
          <el-button  type="primary" style="margin-top:20px;" icon="el-icon-edit"   size="small" @click="editDetails(detailInfo.taskInfo)"></el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-tabs v-model="active" type="card" @tab-click="handleClick">
        <el-tab-pane label="任务信息" name="1">
          <TaskInfo
             v-if="detailInfo"
             :id="id"
             :taskType="taskType"
             :projectType="projectType"
             :detailInfo="detailInfo"
             :templateType="templateType"
          ></TaskInfo>
        </el-tab-pane>
        <el-tab-pane label="执行日志" name="2">
          <ExecuteLog></ExecuteLog>
        </el-tab-pane>
        <el-tab-pane label="任务进度" name="3">
          <TaskProgress
            :projectCode="projectCode"
            :projectName="projectName"
          ></TaskProgress>
        </el-tab-pane>
        <el-tab-pane label="任务附件" name="4">
          <TaskFile :projectCode="projectCode">任务附件</TaskFile>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <TaskDetailEdit v-if="isShowDialog" 
    :isShowDialog="isShowDialog" 
    :editForm = "editForm"
    @closeDialog="closeDialog" 
    @dialogChange="dialogChange" />
  </div>
</template>

<script>

  import TaskInfo from './TaskInfo'
  import ExecuteLog from './ExecuteLog'
  import TaskProgress from './TaskProgress'
  import TaskDetailEdit from './TaskDetailEdit'
  import TaskFile from './TaskFile'
  import Api from '@/api/index'
  import Util from '@/utils/'
  export default {
    components: {TaskInfo, ExecuteLog, TaskProgress, TaskFile,TaskDetailEdit},
    data () {
      return {
        editForm:{},
        isShowDialog:false,
        id: '',
        active: '1',
        taskType: '',
        templateType: '',
        projectType: '',
        projectCode: '',
        projectName: '',
        detailInfo: {
          taskInfo: {}
        },
        // 货物详情
        materialData: [],
        packagingInfoTasks: [],
        innerPackagingInfoTasks: [],
      }
    },
    mounted () {
      this.id = this.$route.query.id
      this.taskType = this.$route.query.type
      this.templateType = this.$route.query.templateType
      this.loadData()
    },
    methods: {
      editDetails(row){
        this.editForm = JSON.parse(JSON.stringify(row))
        this.isShowDialog = true
      },
      closeDialog(){
        this.isShowDialog = false
      },
      dialogChange(){
        this.closeDialog()
         this.loadData()
      },
      //获取数据字典名称通过KEY
      getDictsKeyName(row,key,value){
        return Util.getDictsKeyName(row,key,value)
      },
      /**
       * 加载任务详情数据
       */
      loadData () {
        this.listLoading = true
        Api.taskCompleteDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.detailInfo = res
            this.projectCode = res.taskInfo.projectCode
            this.projectName = res.taskInfo.projectName
            /*
            if (res.foreignMaterialDetailTasks) {
              // 国际航材货物详情
              this.materialData = res.foreignMaterialDetailTasks
              this.projectType = '3'
            } else if (res.detailTasks) {
              // 国内航材货物详情
              this.projectType = '2'
              this.materialData = res.detailTasks
            }
            // 包装箱信息
            if (res.packagingInfoTasks) {
              this.packagingInfoTasks = res.packagingInfoTasks
            }
            // 内部包装箱信息
            if (res.innerPackagingInfoTasks) {
              this.innerPackagingInfoTasks = res.innerPackagingInfoTasks
            }*/
          }
        })
        this.listLoading = false
      },
      handleClick (tab, event) {
        console.log(tab, event)
      }
    }
  }
</script>

<style scoped>
  .project-header {
    background-color: #EAF2CB;
    padding: 20px 10px;
    border-radius: 5px;
    font-size: 14px;
    color: #6F6E74;
    position: relative;
  }
  .project-header li {
    line-height: 30px;
    list-style:none;
  }
  .project-status {
    width: 110px;
    height: 110px;
    background-color: #8CC63E;
    border-radius: 110px;
    text-align: center;
    color: #fff;
    margin: 20px auto;
  }
  .project-status div {
    display: inline-block;
    margin-top: 35px;
  }
  .left-border {
    border-left: 1px dashed #848387;
  }
  .edit {
    position: absolute;
    bottom: 20px;
    right: 0;
  }
</style>
