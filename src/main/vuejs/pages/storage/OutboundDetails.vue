<template>
  <div>
    <!-- 操作栏 -->
    <el-row class="project-header">
      <el-col :span="4">
        <div class="project-status">
          <div>{{tag}}库状态<br/>待{{tag}}库</div>
        </div>
      </el-col>
      <el-col :span="8" class="left-border">
        <ul>
          <li>项目编号：{{projectCode}}</li>
          <li>备注：{{workHouse.remarks}}</li>
        </ul>
      </el-col>
      <el-col :span="8" class="left-border">
        <ul>
          <li>项目名称：{{taskInfo.projectName}}</li>
          <li>到货时间：{{workHouse.actualTime | timeFormat}}</li>
        </ul>
      </el-col>
      <el-col :span="4">
         <el-button  type="primary"  size="small" @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="4" >
        <p>待{{tag}}库货物清单：</p>
      </el-col>
    </el-row>
    <div>
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
    </div>

    <el-row>
      <el-col :span="4" >
        <p>{{tag}}库记录：</p>
      </el-col>
    </el-row>
    <div>
      <!--包装箱信息-->
      <AddPackage
        :operateFlag="'stock-in-record'"
        :packagingInfoReqs.sync="storagePackagingInfoTasks"
      ></AddPackage>
      <!--货物信息-->
      <MaterialDetail
        :projectType="projectType"
        :operateFlag="'stock-in-record'"
        :domesticMaterialDetailReqs.sync="storageGoodsData"
        :foreignMaterialDetailReqs.sync="storageGoodsData"
        :artMaterialDetailReqs.sync="storageGoodsData"
      ></MaterialDetail>
      <!--内部包装箱信息-->
      <InnerPackageInfo :operateFlag="'task-detail-view'" :innerBoxData="storageInnerPackagingInfoTasks"></InnerPackageInfo>
    </div>
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
        taskType: '',
        form: {},
        num: '1',
        /** 表格 loading */
        listLoading: false,
        tag: '',
        artDetailTasks:[],
        currentItem: '',
        projectCode: '',
        projectName: '',
        projectType: '',
        taskInfo: {},
        workHouse: {},
        goodsData: [],
        storageGoodsData: [],
        packagingInfoTasks: [],
        storagePackagingInfoTasks: [],
        innerPackagingInfoTasks: [],
        storageInnerPackagingInfoTasks: [],
      }
    },
    mounted () {
      this.taskType = this.$route.query.taskType
      this.tag = this.$route.query.taskType === '013' ? '入' : '出'
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
            this.artDetailTasks = res.artDetailTasks
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

            // 入库记录-包装箱
            if (res.storagePackagingInfoTasks) {
              this.storagePackagingInfoTasks = res.storagePackagingInfoTasks
            }
            // 入库记录-内包装箱
            if (res.storageInnerPackagingInfoTasks) {
              this.storageInnerPackagingInfoTasks = res.storageInnerPackagingInfoTasks
            }

            if (res.storageDetailTasks) {
              this.storageGoodsData = res.storageDetailTasks
            }
            if (res.storageForeignMaterialDetailTasks) {
              this.storageGoodsData = res.storageForeignMaterialDetailTasks
            }
            if (res.storageArtDetailTasks) {
              this.storageGoodsData = res.storageArtDetailTasks
            }
          }
        })
        this.listLoading = false
      },
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
