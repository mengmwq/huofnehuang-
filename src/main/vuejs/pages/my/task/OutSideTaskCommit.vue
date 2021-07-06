<template>
  <div>
    <el-row class="task-header">
      <el-col :span="6">
        <ul>
          <li>项目名称：{{form.taskInfo.name}}</li>
          <li>客户联系人：</li>
          <li>项目负责人：{{form.taskInfo.directorName}}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul>
          <li>操作人：{{form.taskInfo.executor}}</li>
          <li>代理联系人：</li>
          <li>项目领队：</li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>线路：</li>
          <li>级别标准：{{form.taskInfo.level | taskLevelFilter}}</li>
          <li>贸易方式：</li>
          <li></li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>进口口岸：</li>
          <li>目的地：</li>
          <li></li>
          <li></li>
        </ul>
      </el-col>
    </el-row>
    <!--包装箱信息-->
    <div class="m10">
      <AddPackage
        :projectType="projectType"
        :operateFlag="'view'"
        :packagingInfoReqs.sync="packagingInfos">
      </AddPackage>
    </div>
    <div class="m10">
      <material-detail
        :projectType= projectType
        :operateFlag="'view'"
        :domesticMaterialDetailReqs.sync="goodsData"
        :foreignMaterialDetailReqs.sync="goodsData"
        :artMaterialDetailReqs.sync="goodsData"
      ></material-detail>
    </div>
    <!--内部包装箱信息-->
    <inner-package-info :innerBoxData="innerBoxData" :operateFlag="'task-detail-view'"></inner-package-info>
    <!--工作类容及特殊要求-->
    <div class="m10">
      <div class="title">工作内容及特殊要求
        <div class="line"></div>
      </div>
      <el-table class="page-table" :data="contentData" stripe highlight-current-row :cell-style="{color:'#333'}"
      >  <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column v-for="(header, index) in contentHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'operationDt'">
              <el-date-picker style="width:100%"
                              v-model="scope.row.operationDt"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              format="yyyy-MM-dd HH:mm:ss"
                              placeholder="操作时间">
              </el-date-picker>
            </div>
            <div v-else-if="header.prop == 'place'">
              <el-input v-model="scope.row.place"></el-input>
            </div>
            <div v-else-if="header.prop == 'content'">
              <el-input v-model="scope.row.content"></el-input>
            </div>
            <div v-else-if="header.prop == 'tool'">
              <el-input v-model="scope.row.tool"></el-input>
            </div>
            <div v-else-if="header.prop == 'material'">
              <el-input v-model="scope.row.material"></el-input>
            </div>
            <div v-else-if="header.prop == 'remarks'">
              <el-input v-model="scope.row.remarks"></el-input>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addContent"></el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="() => {contentData.splice(scope.$index, 1)}"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--人员-->
    <div class="m10">
      <div class="title">人员成本
        <div class="line"></div>
      </div>
      <el-table class="page-table" :data="userCostData" stripe highlight-current-row  :cell-style="{color:'#333'}"
      >  <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column v-for="(header, index) in userCostHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'type'">
              <el-input v-model="scope.row.type"></el-input>
            </div>
            <div v-else-if="header.prop == 'days'">
              <el-input v-model="scope.row.days"></el-input>
            </div>
            <div v-else-if="header.prop == 'number'">
              <el-input v-model="scope.row.number"></el-input>
            </div>
            <div v-else-if="header.prop == 'day'">
              <el-input v-model="scope.row.day"></el-input>
            </div>
            <div v-else-if="header.prop == 'accommodation'">
              <el-input v-model="scope.row.accommodation"></el-input>
            </div>
            <div v-else-if="header.prop == 'traffic'">
              <el-input v-model="scope.row.traffic"></el-input>
            </div>
            <div v-else-if="header.prop == 'other'">
              <el-input v-model="scope.row.other"></el-input>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addCostUser"></el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="() => {userCostData.splice(scope.$index, 1)}"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--车辆-->
    <div class="m10">
      <div class="title">车辆成本
        <div class="line"></div>
      </div>
      <el-table class="page-table" :data="carCostData" stripe highlight-current-row  :cell-style="{color:'#333'}"
      >  <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column v-for="(header, index) in carCostHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">

            <div v-if="header.prop == 'license'"><!-- filterable @blur="selectBlur"-->
              <el-select v-model="scope.row.license"  placeholder="选择车辆" size="medium" style="width: 100%;">
                <el-option
                  v-for="(item, index) in carList"
                  @click.native="selectCar(scope.row, item)"
                  :key="index"
                  :label="item.registrationNumber"
                  :value="item.registrationNumber">
                </el-option>
              </el-select>
              <!--<el-input v-model="scope.row.license"></el-input>-->
            </div>
            <div v-else-if="header.prop == 'models'">
              <el-input v-model="scope.row.models"></el-input>
            </div>
            <div v-else-if="header.prop == 'km'">
              <el-input v-model="scope.row.km"></el-input>
            </div>
            <div v-else-if="header.prop == 'unitPrice'">
              <el-input v-model="scope.row.unitPrice"></el-input>
            </div>
            <div v-else-if="header.prop == 'remarks'">
              <el-input v-model="scope.row.remarks"></el-input>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addCarCost"></el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="() => {carCostData.splice(scope.$index, 1)}"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具-->
    <div class="m10">
      <div class="title">工具成本
        <div class="line"></div>
      </div>
      <el-table class="page-table" :data="toolCostData" stripe highlight-current-row  :cell-style="{color:'#333'}"
      >  <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column v-for="(header, index) in toolHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'type'">
              <el-input v-model="scope.row.type"></el-input>
            </div>
            <div v-else-if="header.prop == 'toolType'">
              <el-input v-model="scope.row.toolType"></el-input>
            </div>
            <div v-else-if="header.prop == 'days'">
              <el-input v-model="scope.row.days"></el-input>
            </div>
            <div v-else-if="header.prop == 'unitPrice'">
              <el-input v-model="scope.row.unitPrice"></el-input>
            </div>
            <div v-else-if="header.prop == 'total'">
              <el-input v-model="scope.row.total"></el-input>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addToolCost"></el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="() => {toolCostData.splice(scope.$index, 1)}"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--其他-->
    <div class="m10">
      <div class="title">其他费用
        <div class="line"></div>
      </div>
      <el-table class="page-table" :data="otherCostData" stripe highlight-current-row :cell-style="{color:'#333'}"
      >  <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column v-for="(header, index) in otherCostHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'project'">
              <el-input v-model="scope.row.project"></el-input>
            </div>
            <div v-else-if="header.prop == 'cost'">
              <el-input v-model="scope.row.cost"></el-input>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addOtherCost"></el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="() => {otherCostData.splice(scope.$index, 1)}"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--费用总计-->
    <div class="m10">
      <el-row>
        <el-col :span="24">
          费用总计： <el-input v-model="submitParam.cost" style="width: 300px"></el-input>
          <el-button type="primary" size="medium" @click="getTotalCost">获取总费用</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row class="m10">
      <el-col :span="24">
        <p>备注:</p>
        <el-input type="textarea" maxlength="500" :rows="4" show-word-limit v-model="submitParam.remarks"></el-input>
      </el-col>
    </el-row>
    <el-row class="m10" v-if="this.$route.query.tag !== 'view'">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="small" @click="cancelSubmit">取消</el-button>
        <el-button type="primary" size="small" @click="onSubmit()">确认提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import AddPackage from '@/pages/my/project/AddPackage'
  import MaterialDetail from '@/pages/my/project/MaterialDetail'
  import InnerPackageInfo from '@/pages/my/task/InnerPackageInfo'
  export default {
    components: {
      'material-detail': MaterialDetail,
      'inner-package-info': InnerPackageInfo,
      AddPackage
    },
    data () {
      return {
        submitParam: {
          cost: '', // 费用总计
          supplierId: '', // 供应商
        },
        taskFlag: '', // bg: 报关任务，bz包装任务
        taskType: '', // 任务类型type
        templateType: '', // 任务模板类型
        projectType: '', // 项目类型
        form: {
          taskInfo: {}
        },
        // 工作内容
        contentData: [],
        // 人员成本
        userCostData: [],
        // 车辆成本
        carCostData: [],
        // 工具成本
        toolCostData: [],
        // 其他成本
        otherCostData: [],
        // 车辆成本选择的车辆
        carList: [],
        contentHeader: [
          {prop: 'operationDt', label: '操作时间', show: true},
          {prop: 'place', label: '地点', show: true},
          {prop: 'content', label: '操作内容', show: true},
          {prop: 'tool', label: '工具', show: true},
          {prop: 'material', label: '材料', show: true},
          {prop: 'remarks', label: '备注', show: true},
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
        carCostHeader: [
          {prop: 'license', label: '车牌号', show: true},
          {prop: 'models', label: '车型', show: true},
          {prop: 'km', label: '里程（公里）', show: true, width: '130'},
          {prop: 'unitPrice', label: '单价', show: true},
        ],
        toolHeader: [
          {prop: 'type', label: '类型', show: true},
          {prop: 'toolType', label: '工具类型', show: true},
          {prop: 'days', label: '天数', show: true},
          {prop: 'unitPrice', label: '单价', show: true}
        ],
        otherCostHeader: [
          {prop: 'project', label: '项目', show: true},
          {prop: 'cost', label: '费用', show: true}
        ],
        /** 包装任务form */
        baoZForm: {
          softUnitPrice: '',
          softArea: '',
          innerBoxUnitPrice: '',
          innerBoxArea: '',
          outerBoxUnitPrice: '',
          outerBoxArea: ''
        },
        // 包装箱信息
        packagingInfos: [],
        // 包装类型
        packageTypes: [],
        /** 货物数据 */
        goodsData: [],
        // 内部包装箱信息
        innerBoxData: [],
        listLoading: false
      }
    },
    watch: {
    },
    mounted () {
      this.taskFlag = this.$route.path === '/router/baoGuanTaskCommit' ? 'bg' : 'bz'
      this.taskType = this.$route.query.type
      this.templateType = this.$route.query.templateType
      // 获取字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.PackageType) {
          this.packageTypes = distsObj.PackageType.children
        }
      }
      this.loadTaskDetail()
      Api.selectCarList({pageNum: 1, pageSize: 50000}).then(data => {
        this.carList = data.records;
      })
    },
    methods: {
      selectBlur(e, item) {
        item.license = e.target.value
      },
      /**
       * 选择车辆
       */
      selectCar (item1, item) {
        let index = this.carCostData.indexOf(item1)
        this.carCostData[index].models = item.transportationVehiclesType
      },
      /**
       * 加载任务详情数据
       */
      loadTaskDetail () {
        this.listLoading = true
        Api.taskCompleteDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            if (res.foreignMaterialDetailTasks) {
              // 国际航材货物详情
              this.goodsData = res.foreignMaterialDetailTasks
              this.projectType = '3'
            } else if (res.detailTasks) {
              // 国内航材货物详情
              this.projectType = '2'
              this.goodsData = res.detailTasks
            } else if (res.artDetailTasks) {
              // 艺术品货物详情
              this.projectType = '1'
              this.goodsData = res.artDetailTasks
            }
            if (res.packagingInfoTasks) {
              this.packagingInfos = res.packagingInfoTasks
            }
            // 内部包装箱信息
            if (res.innerPackagingInfoTasks) {
               this.innerBoxData = res.innerPackagingInfoTasks
            }
            if (res.workOutsideTask) {
              this.submitParam.cost = res.workOutsideTask.cost
              this.submitParam.supplierId = res.workOutsideTask.supplierId
            }
            if (res.workOutsideTaskContents) {
              // 工单内容
              this.contentData = res.workOutsideTaskContents
              this.contentData.forEach(function(item) {
                item.operationDt = moment(item.operationDt).format('YYYY-MM-DD HH:mm:ss')
              })
            }
            if (res.workOutsideTaskUsers) {
              // 人员成本
              this.userCostData = res.workOutsideTaskUsers
            }
            if (res.workOutsideTaskVehicles) {
              // 车辆成本
              this.carCostData = res.workOutsideTaskVehicles
            }
            if (res.workOutsideTaskTools) {
              // 工具成本
              this.toolCostData = res.workOutsideTaskTools
            }
            if (res.workOutsideTaskOthers) {
              // 其他成本
              this.otherCostData = res.workOutsideTaskOthers
            }
          }
        })
        this.listLoading = false
      },
      /**
       * 添加工作内容
       * */
      addContent () {
        let item = {
          operationDt: '',
          place: '',
          content: '',
          tool: '',
          material: '',
          remarks: ''
        }
        this.contentData.push(item)
      },
      /**
       * 添加人员成本
       * */
      addCostUser () {
        let item = {
          type: '',
          days: '',
          number: '',
          day: '',
          accommodation: '',
          traffic: '',
          other: ''
        }
        this.userCostData.push(item)
      },
      /**
       * 添加车辆成本
       * */
      addCarCost () {
        let item = {
          license: '',
          models: '',
          km: '',
          unitPrice: '',
          remarks: ''
        }
        this.carCostData.push(item)
      },
      /**
       * 添加工具成本
       * */
      addToolCost () {
        let item = {
          type: '',
          toolType: '',
          days: '',
          unitPrice: ''
        }
        this.toolCostData.push(item)
      },
      /**
       * 添加其他成本
       * */
      addOtherCost () {
        let item = {
          project: '',
          cost: ''
        }
        this.otherCostData.push(item)
      },
      getTotalCost () {
        let _this = this
        // 人员成本
        let userCost = 0
        if (this.userCostData.length > 0) {
          this.userCostData.forEach(function (item) {
            if (item.days && item.number && item.day) {
              userCost += parseInt(item.days) * parseInt(item.number) * parseInt(item.day)
            }
            if (item.accommodation) {
              userCost += parseFloat(item.accommodation)
            }
            if (item.traffic) {
              userCost += parseFloat(item.traffic)
            }
            if (item.other) {
              userCost += parseFloat(item.other)
            }
           // userCost += parseInt(item.days) * parseInt(item.number) * parseInt(item.day) + parseFloat(item.accommodation) + parseFloat(item.traffic) + parseFloat(item.other)
          })
        }
        // 车辆成本
        let carCost = 0
        if (this.carCostData.length > 0) {
          this.carCostData.forEach(function (item) {
            if (item.km && item.unitPrice) {
              carCost += parseInt(item.km) * parseInt(item.unitPrice)
            }
          })
        }
        // 工具成本
        let toolCost = 0
        if (this.toolCostData.length > 0) {
          this.toolCostData.forEach(function (item) {
            if (item.days && item.unitPrice) {
              toolCost += parseInt(item.days) * parseInt(item.unitPrice)
            }
          })
        }
        // 其他成本
        let otherCost = 0
        if (this.otherCostData.length > 0) {
          this.otherCostData.forEach(function (item) {
            if (item.cost) {
              otherCost += parseInt(item.cost)
            }

          })
        }
        this.submitParam.cost = userCost + carCost + toolCost + otherCost
      },
      // 提交
      onSubmit () {
        if ( !this.submitParam.cost) {
          this.getTotalCost()
        }
        this.submitParam.workOutsideTaskContentReqs = this.contentData // 工单内容
        this.submitParam.workOutsideTaskUserReqs = this.userCostData // 人员成本
        this.submitParam.workOutsideTaskVehicleReqs = this.carCostData // 车辆成本
        this.submitParam.workOutsideTaskToolReqs = this.toolCostData // 工具成本
        this.submitParam.workOutsideTaskOtherReqs = this.otherCostData // 其他成本
        let param = {
          id: this.$route.query.id,
          workOutsideTaskReq: this.submitParam
        }
        Api.submitOutsideTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '任务提交成功'
            })
            this.$router.push({path: '/router/taskList'})
          }
        })
      },
      cancelSubmit () {
         this.$router.push({path: '/router/taskList'})
      }

    }
  }
</script>

<style scoped>
  .task-header {
    background-color: #FEEFF6;
    padding: 20px 10px;
    border-radius: 5px;
    font-size: 14px;
    color: #6F6E74;
    position: relative;
  }
  .task-header li {
    line-height: 30px;
    list-style:none;
  }
  .task-status {
    width: 110px;
    height: 110px;
    background-color: #8CC63E;
    border-radius: 110px;
    text-align: center;
    color: #fff;
    margin: 20px auto;
  }
  .task-status div {
    display: inline-block;
    margin-top: 35px;
  }
  .left-border {
    border-left: 1px dashed #848387;
  }
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 8%;
    margin-top: -11px;
  }
  .edit {
    position: absolute;
    bottom: 20px;
    right: 0;
  }
</style>
