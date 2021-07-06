<template>
  <div>
    <!-- 操作栏 -->
    <el-row class="project-header">
      <el-col :span="4">
        <div class="project-status">
          <div>入库状态<br/>待入库</div>
        </div>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>项目编号：{{taskInfo.projectCode}}</li>
          <li>备注：{{taskInfo.remarks}}</li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>项目名称：{{taskInfo.projectName}}</li>
          <li>到货时间：{{workHouse.actualTime | timeFormat}}</li>
        </ul>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="4" >
        <p>待{{inOrOut==='in' ? '入库' : '出库'}}货物清单：</p>
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

    <el-row>
      <el-col :span="4" >
        <p>{{inOrOut==='in' ? '入库' : '出库'}}记录：</p>
      </el-col>
    </el-row>
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

    <el-row style="margin-top: 20px;text-align: center">
      <el-col :span="24">
        <router-link :to="{path: '/router/storageTask'}">
          <el-button type="primary" size="small">取消</el-button>
        </router-link>
        <el-button type="primary" size="small" @click="auditInOrOut()">核准</el-button>
        <el-button type="primary" size="small" @click="dialogVisible=true">拒绝</el-button>
      </el-col>
    </el-row>

    <!--拒绝dialog-->
    <el-dialog
            title="拒绝"
            :close-on-click-modal="canClick"
            :visible.sync="dialogVisible"
            size="small" width="40%">
      <el-row class="m10">
        <el-col :span="12">
          <p class="info">项目编号： {{projectCode}}</p>
        </el-col>
        <el-col :span="12">
          <p class="info">任务名称： {{taskInfo.name}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input type="textarea"
                    :rows="4"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入拒绝原因"
                    v-model="form.rejection">
          </el-input >
        </el-col>
      </el-row>
      <div style="margin-top: 20px;text-align: center">
        <el-button type="primary" size="small" @click="dialogVisible=false;form.reason=''">取 消</el-button>
        <el-button type="primary" size="small" @click="sureRefuse()">确 定</el-button>
      </div>
    </el-dialog>
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
        canClick: false,
        dialogVisible: false,
        inOrOut: '',
        taskType: '',
        taskInfo: {},
        form: {},
        workHouse: {},

        currentItem: '',
        projectCode: '',
        projectName: '',
        projectType: '',
        // 货物类型:提交的时候需要传 1:艺术品2：国内航材3:国际航材4:包裹
        goodsType: '',
        goodsData: [],
        storageGoodsData: [],
        packagingInfoTasks: [],
        storagePackagingInfoTasks: [],
        innerPackagingInfoTasks: [],
        storageInnerPackagingInfoTasks: [],
      }
    },
    mounted () {
      this.inOrOut = this.$route.path === '/router/stockInAudit' ? 'in' : 'out'
      this.taskType = this.$route.query.taskType
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
            } else {
              this.goodsType = '4'
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
      auditInOrOut () {
        if (this.inOrOut === 'in') {
           // 入库核准
          Api.importApproved({id: this.$route.query.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '入库核准成功'
              })
              this.$router.push({path: '/router/storageTask'})
            } else {
              this.$notify.warning({
                title: '提示',
                message: '入库核准失败'
              })
            }
          })
        } else {
          // 出库核准
          Api.exportApproved({id: this.$route.query.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '出库核准成功'
              })
              this.$router.push({path: '/router/storageTask'})
            } else {
              this.$notify.warning({
                title: '提示',
                message: '出库核准失败'
              })
            }
          })
        }
      },
      /**
       * 拒绝，驳回操作
       * */
      sureRefuse () {
        this.form.id = this.$route.query.id
        this.form.retrievalFlg = '5'
        Api.changeStockState(this.form).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '拒绝成功'
            })
            this.$router.push({path: '/router/storageTask'})
          } else {
            this.$notify.warning({
              title: '提示',
              message: '拒绝失败'
            })
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
