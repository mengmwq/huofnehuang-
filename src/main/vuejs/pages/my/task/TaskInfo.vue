<template>
  <div id="taskInfo">
    <!--航材出口/出口进口运输 航材模板类型暂时设为007，到时根据后端来处理-->
    <div class="m10" v-if="templateType === '007'">
      <el-row>
        <el-col :span="3"><span class="item-title">验收标准：</span></el-col>
        <el-col :span="8">
          <p style="margin: 0">1.包装完整，上传图片</p>
          <p style="margin: 0">2.检查环境，上传图片</p>
          <p style="margin: 0">3.填写分寸单据，上传图片</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3"><span class="item-title">任务描述：</span></el-col>
        <el-col :span="8">提货到沈阳 {{taskType}}</el-col>
      </el-row>
    </div>

    <!--包装箱信息-->
    <div class="m10">
      <AddPackage
        :projectType="projectType"
        :operateFlag="'view'"
        :packagingInfoReqs.sync="packagingInfoReqs">
      </AddPackage>
    </div>
    <!--货物信息 -->
    <div class="m10">
      <material-detail
        :projectType="projectType"
        :operateFlag="'view'"
        :domesticMaterialDetailReqs.sync="goodsData"
        :foreignMaterialDetailReqs.sync="goodsData"
        :artMaterialDetailReqs.sync="goodsData"
      ></material-detail>
    </div>
    <!--内部包装信息-->
    <div class="m10">
      <InnerPackageInfo
        :projectType="projectType"
        :operateFlag="'task-detail-view'"
        :innerBoxData="innerBoxData">
      </InnerPackageInfo>
    </div>
    <!--软包面积体积成本 包装任务拥有-->
    <div style="margin: 20px 0" v-if="templateType === '001'">
      <el-row>
        <el-col :span="8"><span class="item-title1">软包总面积：</span>{{workPackagingTask.softArea}}平米</el-col>
        <el-col :span="8"><span class="item-title1">软包总体积：</span>{{workPackagingTask.softVolume}}立方</el-col>
        <el-col :span="8"><span class="item-title1">内箱总面积：</span>{{workPackagingTask.innerBoxArea}}平米</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title1">内箱总体积：</span>{{workPackagingTask.innerBoxVolume}}立方</el-col>
        <el-col :span="8"><span class="item-title1">外箱总面积：</span>{{workPackagingTask.outerBoxArea}}平米</el-col>
        <el-col :span="8"><span class="item-title1">外箱总体积：</span>{{workPackagingTask.outerBoxVolume}}立方</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title1">软包成本：</span>￥{{workPackagingTask.softCost}}</el-col>
        <el-col :span="8"><span class="item-title1">平方价：</span>{{workPackagingTask.softUnitPrice}}元/平方</el-col>
        <el-col :span="8"><span class="item-title1">内箱成本：</span>￥{{workPackagingTask.innerBoxCost}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title1">平方价：</span>{{workPackagingTask.innerBoxUnitPrice}}元/平方</el-col>
        <el-col :span="8"><span class="item-title1">外箱成本：</span>￥{{workPackagingTask.outerBoxCost}}</el-col>
        <el-col :span="8"><span class="item-title1">平方价：</span>{{workPackagingTask.outerBoxUnitPrice}}元/平方</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title1">总费用：</span>￥{{workPackagingTask.overallCost}}</el-col>
        <el-col :span="8"><span class="item-title1">完成时间：</span>{{workPackagingTask.createDt | timeFormat}}</el-col>
        <el-col :span="8"><span class="item-title1" v-i="taskInfo">操作人：{{taskInfo.executorName?taskInfo.executorName:''}}</span></el-col>

      </el-row>
      <el-row>
        <el-col :span="24"><span class="item-title1">备注：</span>{{workPackagingTask.remarks}}</el-col>
      </el-row>
    </div>
    <!--任务内容 外勤任务 -->
    <!--<div class="m10" v-if="templateType === '002'">
      <span>任务内容：</span>
      <el-table class="page-table" :data="taskContentData" stripe highlight-current-row :cell-style="{color:'#333'}"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="date" label="操作时间"></el-table-column>
        <el-table-column prop="address" label="地点"></el-table-column>
        <el-table-column prop="content" label="操作内容" width="120"></el-table-column>
      </el-table>
    </div>-->
    <!--工作内容及特殊要求 外勤任务-->
    <div class="m10" v-if="templateType === '002'">
      <span>工作内容及特殊要求：</span>
      <el-table class="page-table" :data="workContentData" stripe highlight-current-row :cell-style="{color:'#333'}"
      >
        <el-table-column label="操作时间">
          <template  slot-scope="scope">
              {{scope.row.operationDt | timeFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="place" label="地点"></el-table-column>
        <el-table-column prop="content" label="操作内容" width="120"></el-table-column>
        <el-table-column prop="tool" label="工具"></el-table-column>
        <el-table-column prop="material" label="材料"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </el-table>
      <!--车辆-->
      <div class="m10">
        <div class="title">车辆成本
          <div class="line"></div>
        </div>
        <el-table class="page-table" :data="carCostData" stripe highlight-current-row  :cell-style="{color:'#333'}"
        >  <el-table-column type="index" label="序号" width="88"></el-table-column>
          <el-table-column v-for="(header, index) in carCostHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                           :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
       <!--人员成本-->
      <div class="m10">
        <div class="title">人员成本
          <div class="line"></div>
        </div>
        <el-table class="page-table" :data="userCostData" stripe highlight-current-row  :cell-style="{color:'#333'}"
        >  <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column v-for="(header, index) in userCostHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                           :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--批文-->
    <div class="m10" v-if="templateType === '006'">
      <el-row>
        <el-col :span="8"><span class="item-title">到达目的时间：</span>2019-01-02 12:30</el-col>
        <el-col :span="8"><span class="item-title">预计到岗时间：</span>2019-01-02 12:30</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">批文正文：</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">完成时间：</span></el-col>
        <el-col :span="8"><span class="item-title">操作人：</span></el-col>
      </el-row>
    </div>
    <!--报关-->
    <div class="m10" v-if="templateType === '003'">
      <el-row>
        <el-col :span="8"><span class="item-title">预计离港时间：</span>{{workCustomsTask.departureDt | timeFormat}}</el-col>
        <el-col :span="8"><span class="item-title">预计到港时间：</span>{{workCustomsTask.arrivalDt | timeFormat}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">起运港：</span>{{workCustomsTask.departurePort}}</el-col>
        <el-col :span="8"><span class="item-title">目的港：</span>{{workCustomsTask.arrivalPort}}</el-col>
        <el-col :span="8"><span class="item-title">运输路线：</span>{{workCustomsTask.line}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">国运单号：</span>{{workCustomsTask.internationalCode}}</el-col>
        <el-col :span="8"><span class="item-title">项目时效等级：</span>{{workCustomsTask.level | projectLevelFilter}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">保证金/税金：</span>{{workCustomsTask.margin}}</el-col>
        <el-col :span="8"><span class="item-title">币种：</span>{{workCustomsTask.marginCurrency | currencyFilter}}</el-col>
        <el-col :span="8"><span class="item-title">完成时间：</span></el-col>
        <el-col :span="8"><span class="item-title">操作人：</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">关税保证保险：</span>{{workCustomsTask.insurance}}</el-col>
        <el-col :span="8"><span class="item-title">币种：</span>{{workCustomsTask.insuranceCurrency | currencyFilter}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">其他费用：</span>{{workCustomsTask.otherFees}}</el-col>
        <el-col :span="8"><span class="item-title">币种：</span>{{workCustomsTask.otherFeesCurrency | currencyFilter}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><span class="item-title">通关建议：</span>{{workCustomsTask.advise}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><span class="item-title">备注：</span>{{workCustomsTask.remarks}}</el-col>
      </el-row>
    </div>
    <!--入库-->
    <div class="m10" v-if="taskType === '013'">
      <el-row>
        <el-col :span="8"><span class="item-title">入库时间：</span>{{inStorageInfo.actualTime | timeFormat }}</el-col>
        <el-col :span="8"><span class="item-title">件数：</span>{{inStorageInfo.quantity}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">数量：</span>{{inStorageInfo.number}}</el-col>
        <el-col :span="8"><span class="item-title">重量：</span>{{inStorageInfo.weight}}</el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="8"><span class="item-title">货物信息：</span>{{inStorageInfo.remarks}}</el-col>
        <el-col :span="8"><span class="item-title">包装材质：</span>{{inStorageInfo.remarks}}</el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12"><span class="item-title">特殊注意事项：</span>{{inStorageInfo.specialPrecautions}}</el-col>
      </el-row>
      <div class="ru-ku-table m10">
        <span class="mb10">入库记录：</span>
        <el-table  class="page-table" :data="storeRecordData" style="width: 100%" :cell-style="{color:'#333'}">
          <el-table-column prop="name" label="货物名称"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="number" label="箱内件数"></el-table-column>
          <el-table-column prop="date" label="毛重（kg）" width="120"></el-table-column>
          <el-table-column prop="volume" label="体积"></el-table-column>
          <el-table-column prop="inStoreNumber" label="本次入库数" width="120"></el-table-column>
          <el-table-column prop="inStoreLocation" label="仓库位置" width="200"></el-table-column>
        </el-table>
        <span class="mb10">入库信息：</span>
        <el-row>
           <el-col :span="8"><span class="item-title">入库编号：</span>{{taskInfo.code}}</el-col>
            <el-col :span="8"><span class="item-title">入库时间：</span>{{inStorageInfo.actualTime | timeFormat }}</el-col>
        </el-row>
      </div>
    </div>
    <!--出库-->
    <div class="m10" v-if="taskType === '014'">
      <el-row>
        <el-col :span="8"><span class="item-title">出库时间：</span>{{outStorageInfo.actualTime}}</el-col>
        <el-col :span="8"><span class="item-title">件数：</span>{{outStorageInfo.quantity}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">数量：</span>{{outStorageInfo.number}}</el-col>
        <el-col :span="8"><span class="item-title">重量：</span>{{outStorageInfo.weight}}</el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="8"><span class="item-title">货物信息：</span>{{outStorageInfo.actualTime}}</el-col>
        <el-col :span="8"><span class="item-title">包装材质：</span>{{outStorageInfo.actualTime}}</el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12"><span class="item-title">特殊注意事项：</span>{{outStorageInfo.specialPrecautions}}</el-col>
    
        <el-col :span="8"><span class="item-title">备注：</span>{{outStorageInfo.remark}}</el-col>
       
      </el-row> 
      <el-row>
        <el-col :span="8"><span class="item-title">完成时间：</span>{{outStorageInfo.actualTime}}</el-col>
        <el-col :span="8"><span class="item-title">操作人：</span>{{outStorageInfo.actualTime}}</el-col>
      </el-row>
    </div>
    <!--保险详情-->
    <div class="m10" v-if="templateType === '004'">
      <el-row>
        <el-col :span="8"><span class="item-title">运输线路：</span>{{workInsuranceTask.line}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">保险单编号：</span>{{workInsuranceTask.code}}</el-col>
        <el-col :span="8"><span class="item-title">保险日期：</span>{{workInsuranceTask.startDt}} - {{workInsuranceTask.endDt}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">总赔偿限额：</span>{{workInsuranceTask.maxLimits}}</el-col>
        <el-col :span="8"><span class="item-title">币种：</span>{{workInsuranceTask.currency}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">保险费：</span>{{workInsuranceTask.insurancePremium}}</el-col>
        <el-col :span="8"><span class="item-title">投保公司：</span>{{workInsuranceTask.insuranceCompany}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><span class="item-title">完成时间：</span></el-col>
        <el-col :span="8"><span class="item-title">操作人：</span></el-col>
      </el-row>
    </div>
    <!--航材提货-->
    <div class="m10" v-if="templateType === '007' || templateType === '008'">
      <div v-if="templateType === '008'">
        <el-row>
          <el-col :span="8"><span class="item-title">装货时间：</span>{{workMaterialTask.loadingDt | timeFormat}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span class="item-title">装货联系人：</span>{{workMaterialTask.loader}}</el-col>
          <el-col :span="4"><span class="item-title">卸货联系人：</span>{{workMaterialTask.unloader}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span class="item-title">装货人电话：</span>{{workMaterialTask.loaderTel}}</el-col>
          <el-col :span="8"><span class="item-title">卸货人电话：</span>{{workMaterialTask.unloaderTel}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span class="item-title">装货地点：</span>{{workMaterialTask.loadingSite}}</el-col>
          <el-col :span="8"><span class="item-title">备注：</span>{{workMaterialTask.remarks}}</el-col>
        </el-row>
      </div>
      <el-row v-else>
        <el-col :span="8"><span class="item-title">完成时间：</span></el-col>
        <el-col :span="8"><span class="item-title">操作人：</span></el-col>
      </el-row>
    </div>
    <div class="ru-ku-table m10" v-if="templateType === '出入库'">
      <span class="mb10">入库记录：</span>
      <el-table  class="page-table" :data="storeRecordData" style="width: 100%" :cell-style="{color:'#333'}">
        <el-table-column prop="name" label="货物名称"></el-table-column>
        <el-table-column prop="count" label="数量"></el-table-column>
        <el-table-column prop="number" label="箱内件数"></el-table-column>
        <el-table-column prop="date" label="毛重（kg）" width="120"></el-table-column>
        <el-table-column prop="volume" label="体积"></el-table-column>
        <el-table-column prop="inStoreNumber" label="本次入库数" width="120"></el-table-column>
        <el-table-column prop="inStoreLocation" label="仓库位置" width="200"></el-table-column>
      </el-table>
      <span class="mb10">入库信息：</span>
      <el-row>
        <el-col :span="8"><span class="item-title">入库编号：</span>{{taskInfo.code}}</el-col>
        <el-col :span="8"><span class="item-title">入库时间：</span>{{inStorageInfo.actualTime}}}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import AddPackage from '@/pages/my/project/AddPackage'
  import MaterialDetail from '@/pages/my/project/MaterialDetail'
  import Budget from '@/pages/my/project/Budget'
  import InnerPackageInfo from '@/pages/my/task/InnerPackageInfo'
  export default {
    components: {
      AddPackage,
      MaterialDetail,
      Budget,
      InnerPackageInfo
    },
    data () {
      return {
        /** 包装箱数据 */
        packagingInfoReqs: [],
        /** 内部包装箱数据 */
        innerBoxData: [],
        /** 货物数据 */
        goodsData: [],
        /** 任务内容 */
        taskContentData: [],
        /** 工作内容及特殊要求 */
        workContentData: [],
        // 车辆成本
        carCostData: [],
        // 人员成本
        userCostData: [],
        carCostHeader: [
          {prop: 'license', label: '车牌号', show: true},
          {prop: 'models', label: '车型', show: true},
          {prop: 'km', label: '里程（公里）', show: true, width: '130'},
          {prop: 'unitPrice', label: '单价', show: true},
        ],
        userCostHeader: [
          {prop: 'type', label: '类型', show: true},
          {prop: 'days', label: '单价（人天）', show: true, width: '130'},
          {prop: 'number', label: '人数', show: true},
          {prop: 'day', label: '天数', show: true},
          {prop: 'accommodation', label: '住宿', show: true},
          {prop: 'traffic', label: '交通', show: true},
          {prop: 'other', label: '其他', show: true},
        ],
        taskInfo:{
          executorName:'',
        },
        /** 入库记录 */
        storeRecordData: [],
        listLoading: false,
        projectCode: '',
        projectName: '',
        projectType: '',
        // 包装任务的附加信息
        workPackagingTask: {},
        // 报关预算的附加信息
        workCustomsTask: {},
        // 批文附加信息
        workOfficialDocTask: {},
        // 保险附加信息
        workInsuranceTask: {},
        // 航材附加信息
        workMaterialTask: {},
        //入库信息
        inStorageInfo:{},
        //出库信息
      }
    },
    props: {
      id: String,
      taskType: String,
      templateType: String,
      detailInfo: {
        type: Object,
        default: {}
      }
    },
    watch: {
      id: function (value) {
        this.id = value
      },
      detailInfo: function (res) {
        const taskInfo = res.taskInfo
        if (taskInfo) {
          this.taskInfo = taskInfo
          this.projectCode = taskInfo.projectCode
          this.projectName = taskInfo.projectName
        }
        //inStorageInfo
        if(res.workHouse){
          if(this.taskType=='013'){
               this.inStorageInfo = res.workHouse
          }else if(this.taskType =='014'){
               this.outStorageInfo = res.workHouse
          }
         
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
          this.packagingInfoReqs = res.packagingInfoTasks
        }
        // 内部包装箱信息
        if (res.innerPackagingInfoTasks) {
          this.innerBoxData = res.innerPackagingInfoTasks
        }
        // 包装任务附加信息
        if (res.workPackagingTask) {
          this.workPackagingTask = res.workPackagingTask
        }
        // 报关任务附加信息
        if (res.workCustomsTask) {
          this.workCustomsTask = res.workCustomsTask
        }
        // 批文附加信息
        if (res.workOfficialDocTask) {
          this.workOfficialDocTask = res.workOfficialDocTask
        }
        // 保险附加信息
        if (res.workInsuranceTask) {
          this.workInsuranceTask = res.workInsuranceTask
        }
        // 航材附加信息
        if (res.workMaterialTask) {
          this.workMaterialTask = res.workMaterialTask
        }
        // 外勤任务-特殊任务内容
        if (res.workOutsideTaskContents) {
          this.workContentData = res.workOutsideTaskContents
        }
        // 车辆成本
        if (res.workOutsideTaskVehicles) {
          this.carCostData = res.workOutsideTaskVehicles
        }
        // 人员成本
        if (res.workOutsideTaskUsers) {
          this.userCostData = res.workOutsideTaskUsers
        }
      },
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style scoped>
  .el-col{
    margin: 10px 0;
  }
  .item-title{
    display: inline-block;
    width: 140px;
    text-align: right;
    padding-right: 10px;
  }

</style>
