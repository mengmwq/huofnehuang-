<template>
  <div id="home">
    <!-- <el-row :gutter="10" class="m10">
      <el-col class="pd10" :span="24">
        
      </el-col>
    </el-row> -->
    <el-row >
    <el-col  class="job-content" >
        <div>
          <!-- <el-row class="text-left">
            <el-col :span="24">
              <div class="mb10"><i class="el-icon-s-order"></i> 公告信息</div>
            </el-col>
          </el-row> -->
          <el-table class="page-table" :data="noticeList" stripe highlight-current-row
                      :cell-style="{color:'#333'}" max-height="200">
              <template v-for="(header, index) in tableHeader" >
                  <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div v-if="header.prop == 'title'">
                        <a href="javascript:;" @click="showNoticeInfo(scope.row)">{{scope.row.title}}</a>
                      </div>
                      <div v-else-if="header.prop == 'createDt'">
                        {{scope.row.createDt | timeFormat}}
                      </div>
                      <div v-else>{{scope.row[header.prop]}}</div>
                    </template>
                  </el-table-column>
              </template>
              
            </el-table>
        </div>
      </el-col>
     </el-row>
    <el-row>
      <el-col class="job-content pd10">
        <div>
          <el-row class="text-left">
            <el-col :span="24">
              <span><i class="el-icon-s-custom"></i> 我的工作</span>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-around" class="m10">
            <el-col :span="6" class="item-job">
                  <router-link :to="{path: '/router/myTask'}" tag="div">
                    <i class="icon-my-task"></i>
                    <p>
                      <el-badge v-if="inCompleted.myTaskCount" :value="inCompleted.myTaskCount" :max="10" class="item">
                          我的任务
                        </el-badge>
                        <span v-else>我的任务</span>
                    </p>
                  </router-link>
                </el-col>
                <el-col :span="6" class="item-job">
                  <router-link :to="{path: '/router/myProject'}" tag="div">
                    <i class="icon-my-project"></i>
                    <p>我的项目</p>
                  </router-link>
                </el-col>
                <el-col :span="6" class="item-job">
                  <router-link :to="{path: '/router/myAudit'}" tag="div">
                    <i class="icon-my-audit"></i>
                    <p><el-badge v-if="inCompleted.myApprovalCount" :value="inCompleted.myApprovalCount" :max="10" class="item">
                          	业务审批
                        </el-badge>
                        <span v-else>业务审批</span></p>
                  </router-link>
                </el-col>
                <el-col :span="6" class="item-job">
                  <router-link :to="{path: '/router/myAuditAdministration'}" tag="div">
                    <i class="icon-my-audit"></i>
                    <p><el-badge v-if="inCompleted.myAdminApprovalCount" :value="inCompleted.myAdminApprovalCount" :max="10" class="item">
                          	行政审批
                        </el-badge>
                        <span v-else>行政审批</span></p>
                  </router-link>
                </el-col>
                <el-col :span="6" class="item-job">
                  <router-link :to="{path: '/router/myApply'}" tag="div">
                    <i class="icon-my-apply"></i>
                    <p>业务申请</p>
                  </router-link>
                </el-col>
                <el-col :span="6" class="item-job">
                  <router-link :to="{path: '/router/MyApplyAdministration'}" tag="div">
                    <i class="icon-my-apply"></i>
                    <p>行政申请</p>
                  </router-link>
                </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="tab-nav" style="margin:0">
      <div class="nav-item tab" @click="changeTabData(1)">
        <span :class="tabIndex===1 ? 'tab-active' : ''">完成任务动态</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(2)">
        <span :class="tabIndex===2 ? 'tab-active' : ''">项目验收概况</span>
      </div>
    </div>
    <el-table v-if="tableStatus" class="page-table" :data="tabIndex === 1?taskListData:projectListData" stripe highlight-current-row
                      :cell-style="{color:'#333'}" max-height="200">
        <template v-for="(header, index) in tableHeaderProject" >
            <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'title'">
                  <a href="javascript:;" @click="showNoticeInfo(scope.row)">{{scope.row.title}}</a>
                </div>
                <div v-else-if="header.prop == 'createDt'">
                  {{scope.row.createDt | timeFormat}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
        </template>
      </el-table>
   
    <el-row class="m10">
      <el-row class="text-left">
        <el-col :span="24">
          <span>
            <i class="el-icon-s-custom"></i>
            <span>项目与人员安排</span>
            <el-select  v-model="orgId" placeholder="请选择部门" size="medium" style="margin-left:10px;width: 250px">
              <el-option :value="orgId" :label="orgName" style="height: 300px;overflow-y: scroll;padding: 0">
                <el-tree
                  :data="treeData"
                  show-checkbox
                  node-key="orgId"
                  default-expand-all
                  ref="orgTree"
                  :props="{label: 'orgName', children: 'childrens'}"
                  :check-strictly="true"
                  @check-change="handleClick"
                  @node-click="nodeClick">
                </el-tree>
              </el-option>
            </el-select>
            <el-date-picker
              size="medium"
              v-model="timeRange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" size="medium" @click="getProjectInfo">查 询</el-button>
          </span>
        </el-col>
      </el-row>
    </el-row>

    <el-row style="margin: 30px 0" :gutter="15">
      <el-col :span="3" v-for="(item, index) in projectInfo" :key="index" class="mb10">
        <div :class="item.id ? 'busy' : 'free'"  @click="showTaskDetail(item)">
          <span class="mb10">{{item.projectCode}}</span>
          <span>{{item.projectName}}</span>
          <!-- <span>{{item.describe}}</span> -->
        </div>
      </el-col>
    </el-row>
    <el-row class="m10">
      <el-row>
        <el-col :span="24" class="text-left">
          <span><i class="el-icon-s-custom"></i> 我的日历</span>
        </el-col>
      </el-row>
      <el-row class="m10">
        <el-col :span="12" class="text-left">
            <el-button :type="index===1 ? 'primary': 'default'" size="small" @click="getCalendar(1)">个人</el-button>
            <el-button :type="index===0 ? 'primary': 'default'" size="small" @click="getCalendar(0)">部门</el-button>
        </el-col>
        <!-- <el-col :span="12" class="text-right">
             <el-button type="primary" @click="addDayTask">添加日历信息</el-button>
        </el-col> -->
      </el-row>
     <full-calendar class="test-fc" :events="fcEvents" 
      first-day='1' lang="zh"
      @changeMonth="changeMonth"
      @eventClick="eventClick"
      @dayClick="dayClick"
      @moreClick="moreClick">
        <template slot="fc-event-card" slot-scope="p">
            <p v-if="p.event.colour" :style="'background-color:'+p.event.colour">{{ p.event.title }}</p>
             <p v-esle>{{ p.event.title }}</p>
        </template>
    </full-calendar>
    </el-row>
    <TaskDetail v-if="isShowTaskDetail"
    :isShowTaskDetail="isShowTaskDetail"
    :taskDetail="taskDetail"
     @closeDialog="closeDialog"/>
     <TaskDay v-if="isShowDayTaskDetail"
    :dialogVisable="isShowDayTaskDetail"
    :editForm="editForm"
    :type="index"
    @dialogChange="dialogChange"
     @closeDialog="closeDialog"/>
    <InfoDetails :editForm="noticeInfo"  :dialogVisable="dialogVisable" @closeDialog="closeDialog" v-if="dialogVisable"/>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import {DayInfo} from '@/model/DayInfo'
  import InfoDetails from '@/pages/info/InfoDetails'
  import TaskDetail from './TaskDetail'
  import fullCalendar from 'vue-fullcalendar'
  import TaskDay from './TaskDay'
    export default {
      components:{
        InfoDetails,TaskDetail,TaskDay,'full-calendar': require('vue-fullcalendar'),
      },
      data () {
        const dayInfo = new DayInfo()
        const currentDate = this.DateFormat(new Date())
        return {
          inCompleted:{
            taskCount:0, // 未完成任务数量；
            checkCount:0,// 审批数量
          },
          fcEvents:[],
          editForm:dayInfo,
          taskDetail:null,
          isShowTaskDetail:false,
          isShowDayTaskDetail:false,
          tableStatus:true,
          noticeInfo:null,
          dialogVisable:false,
          currentDate: currentDate,
          tabIndex: 1,
          index: 1,
          taskListData: [],
          projectListData: [],
          noticeList: [],
          peopleListData: [],
          projectInfo:[],
          listData: [],
          calendarData: [],
          orgName: '',
          orgId: '',
          treeData: [],
          timeRange: '',
          query: {
            pageSize: 10,
            pageNum: 1,
          },
          peopleQuery: {
            orgId: null,
            startTime: null,
            endTime: null,
            uid: null
          },
          loginUserOrgId: '',
          loginUserUId: '',
          tableHeaderProject: [{
            prop: 'projectName',
            label: '名称',
            align: 'center',
            show: true
          }, {
            prop: 'name',
            label: '发布单位',
            width: '120',
            show: true
          },{
            prop: 'describe',
            label: '描述',
            width: '120',
            show: true
          }, {
            prop: 'createDt',
            label: '发布时间',
            width: '80',
            show: true
          }],
          tableHeader: [{
            prop: 'title',
            label: '公告标题',
            align: 'center',
            width:'240',
            show: true
          }, {
            prop: 'orgName',
            label: '发布单位',
            width: '90',
            show: true
          }, {
            prop: 'createDt',
            label: '发布时间',
            width: '90',
            show: true
          }],
        }
      },
      mounted () {
        
        if (sessionStorage.getItem('jwt')) {
          let userInfo = JSON.parse(sessionStorage.getItem('jwt'))
          this.loginUserOrgId = userInfo.orgId
          this.loginUserUId = userInfo.uId

        }
        this.getHomeCount()
        // 组织机构
        Api.getTreeFormOrgInfo().then(data => {
          this.treeData = data
        })
        // 获取公告列表
        Api.pageInfo(this.query).then(data => {
          this.noticeList = data.records;
        })
        this.loadTask();
       // this.loadPeople();
        this.getProjectInfo()
        
        const curMonthDate =  this.getCurMonthDate()
        this.getPersonalDate(curMonthDate.startTime,curMonthDate.endTime)
      },
      methods: {
        //获取任务数与审批数
        getHomeCount(){
          Api.getHomeCount().then(res=>{
            this.inCompleted = res;
          })
        },
        //获取项目列表 信息
        getProjectInfo(){
          const  params = this.peopleQuery
           params.orgId = this.orgId;
          params.startTime = this.timeRange[0];
          params.endTime = this.timeRange[1];
          delete params['uid']
           Api.getHomeProjectList(params).then(res=>{
             console.log(res,'projectInfo')
                this.projectInfo = res
           })
        },
        getCurMonthDate(currentDate){
           var now = new Date(); //当前日期 
          if(currentDate){
            now = new Date(Date.parse(currentDate)); //当前日期 
          }
         console.log(now,currentDate)
          var nowMonth = now.getMonth(); //当前月 
          var nowYear = now.getFullYear(); //当前年 
          //本月的开始时间
          var monthStartDate = new Date(nowYear, nowMonth, 1); 
          //本月的结束时间
          var monthEndDate = new Date(nowYear, nowMonth+1, 0);
          var timeStart=moment(monthStartDate).format('YYYY-MM-DD')
          var timeEnd=moment(monthEndDate).format('YYYY-MM-DD')
          return {
            startTime:timeStart,
            endTime:timeEnd
          }
        },
        dialogChange(currentDate){
          this.closeDialog()
          const curMonthDate =  this.getCurMonthDate(currentDate)
          this.getPersonalDate(curMonthDate.startTime,curMonthDate.endTime)
        },
        addDayTask(){
           this.editForm  = new DayInfo()
           this.isShowDayTaskDetail = true
        },
       'changeMonth' (start, end, current) {
          this.currentDate = current
          this.getPersonalDate(start,end)
       
          console.log('changeMonth', start, end, current)
        },
        'eventClick' (event, jsEvent, pos) {
          this.editForm = event;
          this.isShowDayTaskDetail = true
          console.log('eventClick', event, jsEvent, this.editForm)
        },
        'dayClick' (day, jsEvent) {
          let editForm = new DayInfo()
          
          console.log(day,editForm)
          editForm.startTimeString = moment(day).format('YYYY-MM-DD')
          editForm.endTimeString = moment(day).format('YYYY-MM-DD')
          // editForm.startTimeString = day
          // editForm.endTimeString = day
          this.editForm  = editForm
           //this.currentDate = this.DateFormat(day)
          console.log('dayClick', day, jsEvent)
          this.isShowDayTaskDetail = true
        },
        'moreClick' (day, events, jsEvent) {
          console.log('moreCLick', day, events, jsEvent)
        },
        showTaskDetail(row){
          this.taskDetail = JSON.parse(JSON.stringify(row))
          this.isShowTaskDetail = true
        },
        closeDialog(){
          this.dialogVisable = false
          this.isShowTaskDetail = false
          this.isShowDayTaskDetail = false
        },
        showNoticeInfo(row){
          console.log(row,'row')
            this.noticeInfo =row
            this.dialogVisable = true
        },
        /**
         * 加载任务动态
         */
        loadTask() {
          Api.homeTaskList({
            pageNum: 1,
            pageSize: 30
          }).then(data => {
            this.taskListData = data;
          });
          
        },
        /**
         * 加载人员信息
         */
        loadPeople() {
          this.peopleQuery.orgId = this.orgId;
          this.peopleQuery.startTime = this.timeRange[0];
          this.peopleQuery.endTime = this.timeRange[1];
          delete this.peopleQuery['uid']
          Api.homePeopleTaskInfo(this.peopleQuery).then(data => {
            this.peopleListData = data;
          });
        },
        getCalendar (index) {
          this.index = index
          const curMonthDate =  this.getCurMonthDate()
          this.getPersonalDate(curMonthDate.startTime,curMonthDate.endTime)
        },
        getPersonalDate(startTime,endTime){
            let params = {
                startTime: startTime + ' 00:00:00',
                endTime: endTime + ' 23:59:59'
                
            }
            const index = this.index;
            if(index=='1'){
                 params.uid= this.loginUserUId
                 params.type = index
              }else if(index=='0'){
                 params.orgId= this.loginUserOrgId
                 params.type = index
              }
            Api.getPersonalDate(params).then(data => {
              if (data) {
                this.fcEvents = data.map(function (item) {
                  item.title = item.name?item.name+'('+item.taskName+')':item.taskName
                  item.start =  moment(item.startTime).format('YYYY-MM-DD')
                  item.end =  moment(item.endTime).format('YYYY-MM-DD')
                  return item
                })
              }
          });
        },
        
        DateFormat (val) {

          if (val) {
            let d = val;
            let year = d.getFullYear();
            let month = this.change(d.getMonth() + 1);
            let day = this.change(d.getDate());
            return year + '-' + month + '-' + day
          }
        },
        change (t) {
          if (t < 10) {
            return '0' + t
          } else {
            return t
          }
        },
        handleClick(data, checked, node){
          if(checked == true){
            this.orgId = data.orgId;
            this.orgName = data.orgName
            this.$refs.orgTree.setCheckedNodes([data]);
          } else {
            this.orgId = ''
            this.orgName = ''
          }
        },
        nodeClick(data, checked, node){
          if (checked) {
            this.orgId = data.orgId
            this.orgName = data.orgName
            this.$refs.orgTree.setCheckedNodes([data]);
          } else {
            this.orgId = ''
            this.orgName = ''
          }

        },
        changeTabData (index) {
          console.log(index,'index')
          this.tabIndex = index
          if(index===2 && this.projectListData.length==0){
            Api.homeProjectList({
            pageNum: 1,
            pageSize: 30
          }).then(data => {
            this.projectListData = data;
          });
          }
          
        },
      }
    }
</script>
<style lang="scss">
.comp-full-calendar{
  max-width:100%;
}
  .header-center {
    font-size:30px;
    .next-month,.prev-month{
       font-family: "Microsoft Yahei";
    }
    
  }
</style>
<style scoped>

#home i{font-size: 16px}
#home .job-content{height: 220px;}
#home .item-job{
  text-align: center;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
}
.pd10{padding: 10px;
  background: #f5f6f5;
}
.summary-list .el-row{
  padding: 5px 0;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.free{display: flex;
  flex-direction: column;
  align-content: center;background: #8CC63E; color: #fff; border-radius: 4px;text-align: center;
  padding: 10px 0;height: 66px;font-size: 14px;
   cursor: pointer;}
.busy{
  display: flex;
  flex-direction: column;
  align-content: center;background: #828BC4; color: #fff;border-radius: 4px;text-align: center;
  padding: 10px 0;height: 66px;font-size: 14px;
  cursor: pointer;}
.notice-header{
  background: #333;
  color: #fff;
  padding: 5px;
}
.ellipsis {
  width: 840px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
