<template>
  <div>
    <!-- 操作栏 -->
    <el-row class="project-header">
      <el-col :span="4">
        <div class="project-status">
          <div>出库状态<br/>{{workHouse.retrievalFlg === '0' ? '未出库' : '已出库'}}</div>
        </div>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>任务名称：{{taskInfo.name}}</li>
          <li>项目名称：{{taskInfo.projectName}}</li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>项目编号：{{taskInfo.projectCode}}</li>
          <li>备注：{{taskInfo.remarks}}</li>
        </ul>
      </el-col>
    </el-row>
    <br>
    <!-- table -->
    <el-row>
      <el-col :span="4" >
        <p>待出库货物清单：</p>
      </el-col>
    </el-row>
    <!--包装箱信息-->
    <AddPackage
      :operateFlag="'stock-in-record'"
      :packagingInfoReqs.sync="packagingInfoTasks"></AddPackage>
    <!--货物信息-->
    <MaterialDetail
      :projectType="projectType"
      :operateFlag="'stock-in-record'"
      :domesticMaterialDetailReqs.sync="goodsData"
      :foreignMaterialDetailReqs.sync="goodsData"
      :artMaterialDetailReqs.sync="goodsData"
    ></MaterialDetail>
    <!--内部包装箱信息-->
    <InnerPackageInfo :operateFlag="'task-detail-view'" :innerBoxData="innerPackagingInfoTasks"></InnerPackageInfo>
    <el-row class="m10">
      <el-col :span="2">经办人：</el-col>
      <el-col :span="8">
        <el-select v-model="agentId" placeholder="请选择指人员" style="width:100%">
          <el-option v-for="(item, index) in userList" :key="index"
                     :label="item.uName"
                     :value="item.uId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 15px">
      <el-col :span="2">备注：</el-col>
      <el-col :span="8">
        <el-input type="textarea" v-model="remarks" :rows="4" maxlength="500" show-word-limit></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: center">
      <el-col :span="24">
        <router-link :to="{path: '/router/storageTask'}" >
          <el-button type="primary" size="small">取消</el-button>
        </router-link>
        <el-button type="primary" size="small" @click="submitStockOut">确认提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import moment from 'moment'
  import AddPackage from '@/pages/my/project/AddPackage'
  import MaterialDetail from '@/pages/my/project/MaterialDetail'
  import InnerPackageInfo from '@/pages/my/task/InnerPackageInfo'
  import Api from '@/api/index'
  export default {
    components: {
      AddPackage,
      MaterialDetail,
      InnerPackageInfo
    },
    data () {
      return {
        uploadDialog: false,
        taskInfo: {},
        workHouse: {},
        currentItem: '',
        projectCode: '',
        projectName: '',
        projectType: '',
        // 货物类型:提交的时候需要传 1:艺术品2：国内航材3:国际航材4:包裹
        goodsType: '',
        goodsData: [],
        packagingInfoTasks: [],
        innerPackagingInfoTasks: [],
        remarks: '',
        agentId: '',
        userList: [],
      }
    },
    mounted () {
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
      this.loadData()
    },
    methods: {

      /**
       * 加载任务信息
       */
      loadData () {
        this.listLoading = true
        Api.taskCompleteDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            if (res.taskInfo) {
              this.taskInfo = res.taskInfo
              this.projectCode = res.taskInfo.projectCode
              this.projectName = res.taskInfo.projectName
            }
            if (res.foreignMaterialDetailTasks) {
              // 国际航材货物详情
              this.goodsData = res.foreignMaterialDetailTasks
              this.projectType = '3'
            } else if (res.detailTasks) {
              // 国内航材货物详情
              this.projectType = '2'
              this.goodsData = res.detailTasks
            } else if (res.artDetailTasks) {
              this.projectType = '1'
              this.goodsData = res.artDetailTasks
            }
            // 包装箱信息
            if (res.packagingInfoTasks) {
              this.packagingInfoTasks = res.packagingInfoTasks
            }
            // 内部包装箱信息
            if (res.innerPackagingInfoTasks) {
              this.innerPackagingInfoTasks = res.innerPackagingInfoTasks
            }
            if (res.workHouse) {
              this.workHouse = res.workHouse
            }
          }
        })
        this.listLoading = false
      },
      /**
       * 出库提交
       * */
      submitStockOut () {
        let param = {
          id: this.$route.query.id,
          agentId: this.agentId, // 经办人Id
          remarks: this.remarks
        }
        Api.submitStockOutTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '出库提交成功'
            })
            this.$router.push({path: '/router/storageTask'})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .project-header {
    background-color: #b3d4fc;
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
    background-color: #66b1ff;
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
