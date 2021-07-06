<template>
  <div>
    <!-- 操作栏 -->
    <el-row class="project-header">
      <el-col :span="4">
        <div class="project-status">
          <div>入库状态<br/>{{workHouse.retrievalFlg === '0' ? '未入库' : '已入库'}}</div>
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
    <el-row>
      <el-col :span="4" >
        <p>待入库货物清单：</p>
      </el-col>
      <el-col :span="20">
        <p v-if="stockInfos">仓位名称：[{{stockInfos.name}}] &nbsp;&nbsp;&nbsp;   尺寸：[{{stockInfos.length}} x {{stockInfos.wide}} x {{stockInfos.high}}]</p>
      </el-col>
    </el-row>
    <!--包装箱信息-->
   <AddPackage
            :operateFlag= "'stock-in'"
            :stockInfos.sync="stockInfos"
            :packagingInfoReqs.sync="packagingInfoTasks"></AddPackage>
    <!--货物信息-->
    <MaterialDetail
            :projectType="projectType"
            :operateFlag="'stock-in'"
            :stockInfos.sync="stockInfos"
            :domesticMaterialDetailReqs.sync="goodsData"
            :foreignMaterialDetailReqs.sync="goodsData"
            :artMaterialDetailReqs.sync="goodsData"
    ></MaterialDetail>
    <!--内部包装箱信息-->
    <InnerPackageInfo :operateFlag="'task-detail-view'" :innerBoxData="innerPackagingInfoTasks"></InnerPackageInfo>

    <el-row style="margin-top: 20px;text-align: center">
      <el-col :span="24">
        <router-link :to="{path: '/router/storageTask'}">
          <el-button type="primary" size="small">取 消</el-button>
        </router-link>

        <el-button type="primary" size="small" @click="submitStockIn">确认提交</el-button>
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
        form: {},
        stockInfos: '',
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
        storageReqs: []
      }
    },
    mounted () {
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
               this.goodsType = '3'
            } else if (res.detailTasks) {
              // 国内航材货物详情
               this.projectType = '2'
               this.goodsType = '2'
              this.goodsData = res.detailTasks
            } else if (res.artDetailTasks) {
              this.projectType = '1'
              this.goodsType = '1'
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
       * 入库提交
       * */
      submitStockIn () {
        const packagingInfoTasks = this.packagingInfoTasks 
        //判断包装箱信息是否都已经入库
        const isPackagingStockIn = packagingInfoTasks.some(item=>!item.grideId)
        console.log(packagingInfoTasks,'包装箱是否有未入库',isPackagingStockIn,)
        if(isPackagingStockIn){
            this.$notify.warning({
                title: '提示',
                message: '请确认包装箱信息都已经入库'
              })
            return;
        }
        const goodsData = this.goodsData
        //判断货物信息是否都已经入库
        const isGoodsDataStockIn = goodsData.some(item=>!item.grideId)
        console.log(goodsData,'货物信息是否有未入库',isGoodsDataStockIn)
        if(isGoodsDataStockIn){
            this.$notify.warning({
                title: '提示',
                message: '请确认货物信息都已经入库'
              })
            return;
        }
        
        let param = {
          id: this.$route.query.id,
          storageReqs: []
        }
        let _this = this

        if (this.goodsData.length > 0) {
          this.goodsData.forEach(function(item) {
            param.storageReqs.push({
              taskTargetId: item.id,
              grideId: item.grideId,
              channel: '001', // 入库途径,001:项目任务入库 002:项目任务出库 003:手动入库 004:手动出库 005:移库入库 006:移库出库
              goodsType: _this.goodsType, // 货物信息的goodsType根据查询的货物来源来处理
              projectCode: _this.projectCode,
              projectName: _this.projectName
            })
          })
        }
        if (this.packagingInfoTasks.length > 0) {
          this.packagingInfoTasks.forEach(function(item) {
            param.storageReqs.push({
              boxSn: item.packageBoxSn,
              taskTargetId: item.id,
              grideId: item.grideId,
              channel: '001', // 入库途径,001:项目任务入库 002:项目任务出库 003:手动入库 004:手动出库 005:移库入库 006:移库出库
              goodsType: '4', // 包装箱的goodsType固定传4
              projectCode: _this.projectCode,
              projectName: _this.projectName
            })
          })
        }
        if (param.storageReqs.length == 0) {
          this.$notify.warning({
            title: '提示',
            message: '没有数据进行入库'
          })
          return
        } else {
          let flag = false
          for (let i = 0; i < param.storageReqs.length; i++) {
            if (param.storageReqs[i].grideId) {
              flag = true
              break
            }
          }
          if (!flag) {
            this.$notify.warning({
              title: '提示',
              message: '入库前请选择仓位'
            })
            return
          }
        }
        Api.submitStockInTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '入库提交成功'
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
