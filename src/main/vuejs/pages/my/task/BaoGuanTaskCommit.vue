<template>
  <div>
    <el-row class="task-header">
      <el-col :span="6">
        <ul>
          <li>任务名称：{{form.taskInfo.name}}</li>
          <li>客户联系人：{{form.projectBaseInfo.projectContacter.name}}</li>
          <li>项目负责人：{{form.taskInfo.directorName}}</li>
        </ul>
      </el-col>
      <el-col :span="6">
        <ul>
          <li>操作人：{{form.taskInfo.executorName}}</li>
          <li>代理联系人：</li>
          <li>项目领队：{{form.taskInfo.directorName}}</li>
        </ul>
      </el-col>
      <el-col :span="6" class="left-border">
        <ul>
          <li>线路：</li>
          <li>级别标准：{{form.taskInfo.level | taskLevelFilter}}</li>
          <li>贸易方式：{{form.projectBaseInfo.projectCodeLevel4 | tradeTypeFilter}}</li>
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
    <div class="m10">
      <material-detail
        :projectType= projectType
        :operateFlag="'view'"
        :domesticMaterialDetailReqs.sync="goodsData"
        :foreignMaterialDetailReqs.sync="goodsData"
        :artMaterialDetailReqs.sync="goodsData"
      ></material-detail>
    </div>
    <div class="m10">
      <!--如果是报关任务提交，显示报关form，否则显示包装任务form-->
      <div v-if="taskFlag === 'bg'">
        <el-form label-position="right" :model="workCustomsTask" ref="workCustomsTask" label-width="100px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="保证金/税金：">
                <el-input v-model="workCustomsTask.margin"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="币种：">
                <el-select v-model="workCustomsTask.marginCurrency" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="关税保证金：">
                <el-input v-model="workCustomsTask.insurance"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="币种：">
                <el-select v-model="workCustomsTask.insuranceCurrency" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="其他费用：">
                <el-input v-model="workCustomsTask.otherFees"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="币种：">
                <el-select v-model="workCustomsTask.otherFeesCurrency" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="通关建议：">
                <el-input type="textarea" maxlength="500" :rows="4" show-word-limit v-model="workCustomsTask.advise"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input type="textarea" maxlength="500" :rows="4" show-word-limit v-model="workCustomsTask.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="m10">
            <el-col :span="24" class="text-right">
              <!--<el-button type="primary" size="small">异常上报</el-button>-->
              <el-button type="primary" size="small" @click="cancelSubmit">取消</el-button>
              <el-button type="primary" size="small" @click="onSubmit('workCustomsTask')">确认提交</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-else>
        <div class="title">内部包装信息
          <div class="line"></div>
        </div>
        <el-table class="page-table" :data="inderBoxData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
        >  <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column v-for="(header, index) in innerBoxHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                           :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="header.prop == 'packageBoxSn'">
                <el-input v-model="scope.row.packageBoxSn" @keyup.native="checkValue(scope.row)"></el-input>
              </div>
              <div v-else-if="header.prop == 'count'">
                <el-input v-model="scope.row.count"></el-input>
              </div>
              <div v-else-if="header.prop == 'insidePackageCount'">
                <el-input v-model="scope.row.insidePackageCount"></el-input>
              </div>
              <div v-else-if="header.prop == 'weight'">
                <el-input v-model="scope.row.weight"></el-input>
              </div>
              <div v-else-if="header.prop == 'length'">
                <el-input v-model="scope.row.length" placeholder="cm" @keyup.native="calcBillingWeight(scope.row)"></el-input>
              </div>
              <div v-else-if="header.prop == 'width'">
                <el-input v-model="scope.row.width" placeholder="cm" @keyup.native="calcBillingWeight(scope.row)"></el-input>
              </div>
              <div v-else-if="header.prop == 'height'">
                <el-input v-model="scope.row.height" placeholder="cm" @keyup.native="calcBillingWeight(scope.row)"></el-input>
              </div>
              <div v-else-if="header.prop == 'packageType'">
                <el-select v-model="scope.row.packageType" clearable placeholder="请选择包装类型" size="medium" style="width:100%">
                  <el-option v-for="(item, index) in packageTypes"
                             :key="index"
                             :label="item.cnInfo"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-else-if="header.prop == 'billingWeight'">
                <el-input v-model="scope.row.billingWeight"></el-input>
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
                @click="addItem"></el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-minus"
                @click="removeItem(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form label-position="right" :model="baoZForm" ref="baoZForm" label-width="135px" style="margin: 15px 0">
          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="软包总面积(㎡)：">
                    <el-input v-model="baoZForm.softArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="软包总体积(m³)：">
                    <el-input v-model="baoZForm.softVolume"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="内箱总面积(㎡)：">
                    <el-input v-model="baoZForm.innerBoxArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="内箱总体积(m³)：">
                    <el-input v-model="baoZForm.innerBoxVolume"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="外箱总面积(㎡)：">
                    <el-input v-model="baoZForm.outerBoxArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="外箱总体积(m³)：">
                    <el-input v-model="baoZForm.outerBoxVolume"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="软包成本：">
                    <span>￥ {{baoZForm.softCost ? baoZForm.softCost : '自动计算'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="平方价：">
                    <el-input v-model="baoZForm.softUnitPrice" placeholder="元/平方"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="内箱成本：">
                    <span>￥ {{baoZForm.innerBoxCost ? baoZForm.innerBoxCost : '自动计算'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="平方价：">
                    <el-input v-model="baoZForm.innerBoxUnitPrice" placeholder="元/平方"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="外箱成本：">
                    <span>￥ {{baoZForm.outerBoxCost ? baoZForm.outerBoxCost : '自动计算'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="平方价：">
                    <el-input v-model="baoZForm.outerBoxUnitPrice" placeholder="元/平方"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input type="textarea" maxlength="500" :rows="4" show-word-limit v-model="baoZForm.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="m10">
            <el-col :span="24" class="text-right" v-if="this.$route.query.tag !== 'view'">
              <el-button type="primary" size="small" @click="cancelSubmit">取消</el-button>
              <!--<el-button type="primary" size="small">异常上报</el-button>-->
              <el-button type="primary" size="small" @click="onSubmit('baoZForm')">确认提交</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import MaterialDetail from '@/pages/my/project/MaterialDetail'
  export default {
    components: {
      'material-detail': MaterialDetail
    },
    data () {
      return {
        taskFlag: '', // bg: 报关任务，bz包装任务
        taskType: '', // 任务类型type
        templateType: '', // 任务模板类型
        projectType: '', // 项目类型
        form: {
          taskInfo: {},
          projectBaseInfo: {
            projectContacter: {}
          }
        },
        /** 包装任务form */
        baoZForm: {
          softUnitPrice: '',
          softArea: '',
          innerBoxUnitPrice: '',
          innerBoxArea: '',
          outerBoxUnitPrice: '',
          outerBoxArea: ''
        },
        // 包装任务的附加信息
        workPackagingTask: {},
        // 报关预算的附加信息
        workCustomsTask: {},
        // 包装类型
        packageTypes: [],
        currencyTypeList: [],
        /** 货物数据 */
        goodsData: [],
        inderBoxData: [],
        innerBoxHeader: [
          {prop: 'packageBoxSn', label: '包装箱号', show: true},
          {prop: 'count', label: '数量', show: true},
          {prop: 'insidePackageCount', label: '箱内件数', show: true},
          {prop: 'weight', label: '毛重(kg)', show: true},
          {prop: 'length', label: '长(cm)', show: true},
          {prop: 'width', label: '宽(cm)', show: true},
          {prop: 'height', label: '高(cm)', show: true},
          {prop: 'packageType', label: '包装类型', show: true, width: '130'},
          {prop: 'billingWeight', label: '计费重量(kg)', show: true},
          {prop: 'remarks', label: '备注', show: true}
        ],
        listLoading: false,
        disabled: false
      }
    },
    watch: {
      'baoZForm.softUnitPrice': {
        handler: function() {
          this.calcSoftCost()
        }
      },
      'baoZForm.softArea': {
        handler: function() {
          this.calcSoftCost()
        }
      },
      'baoZForm.innerBoxUnitPrice': {
        handler: function() {
          this.calcInnerBoxCost()
        }
      },
      'baoZForm.innerBoxArea': {
        handler: function() {
          this.calcInnerBoxCost()
        }
      },
      'baoZForm.outerBoxUnitPrice': {
        handler: function() {
          this.calcOuterBoxCost()
        }
      },
      'baoZForm.outerBoxArea': {
        handler: function() {
          this.calcOuterBoxCost()
        }
      },
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
        if (distsObj.Currency) {
          this.currencyTypeList = distsObj.Currency.children
        }
      }
      this.loadData()
    },
    methods: {
      /**
       * 加载任务详情数据
       */
      loadData () {
        this.listLoading = true
        Api.taskCompleteDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
            if (!res.projectBaseInfo) {
              this.form.projectBaseInfo = {
                projectContacter: {}
              }
            }
            if (!res.projectBaseInfo.projectContacter) {
              this.form.projectBaseInfo = {
                projectContacter: {}
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
              // y艺术品货物详情
              this.projectType = '1'
              this.goodsData = res.artDetailTasks
            }
            // 包装任务附加信息
            if (res.workPackagingTask) {
              this.baoZForm = res.workPackagingTask
            }
            // 报关任务workCustomsTask实体
            if (res.workCustomsTask) {
              this.workCustomsTask = res.workCustomsTask
            }
          }
        })
        this.listLoading = false
      },
      addItem () {
        let item = {
          packageBoxSn: '',
          insidePackageCount: '',
          weight: '',
          length: '',
          width: '',
          height: '',
          billingWeight: '',
          packageType: '',
          remarks: ''
        }
        this.inderBoxData.push(item)
      },
      removeItem(index) {
        if (this.inderBoxData.length > 0) {
          this.inderBoxData.splice(index, 1)
        }
      },
      checkValue (item1) {
        if (this.inderBoxData.length > 1) {
          if (item1.packageBoxSn) {
            let flag = false
            for (let i = 0; i < this.inderBoxData.length-1; i++) {
              let item = this.inderBoxData[i]
              if (item1.packageBoxSn === item.packageBoxSn) {
                flag = true
                break
              }
            }
            if (flag) {
              this.$notify.warning({
                title: '提示',
                message: '已经存在相同箱号的包装箱'
              })
            }
          }
        }
      },
      calcBillingWeight(item) {
        if (item.length && item.width && item.height) {
          // 体积重量
          let volumeWeight = ''
          volumeWeight = ((parseInt(item.length) * parseInt(item.width) * parseInt(item.height)) / 6000).toFixed(2)

          if (item.weight) {
            if (!volumeWeight) {
              item.billingWeight = item.weight
            } else {
              if (parseFloat(item.weight) > parseFloat(volumeWeight)) {
                item.billingWeight = item.weight
              } else {
                item.billingWeight = volumeWeight
              }
            }
          } else {
            if (item.volumeWeight) {
              item.billingWeight = volumeWeight
            }
          }
        }
        // 如果计费重量不填写，则计费重量保存体积重量的值
        if (!this.packageForm.billingWeight) {
          if (this.packageForm.weight) {
            if (!this.packageForm.volumeWeight) {
              this.packageForm.billingWeight = this.packageForm.weight
            } else {
              if (parseFloat(this.packageForm.weight) > parseFloat(this.packageForm.volumeWeight)) {
                this.packageForm.billingWeight = this.packageForm.weight
              } else {
                this.packageForm.billingWeight = this.packageForm.volumeWeight
              }
            }
          } else {
            if (this.packageForm.volumeWeight) {
              this.packageForm.billingWeight = this.packageForm.volumeWeight
            }
          }
        }
      },
      calcSoftCost () {
        if (this.baoZForm.softUnitPrice && this.baoZForm.softArea) {
          if (typeof(this.baoZForm.softUnitPrice) && typeof(this.baoZForm.softArea)) {
            this.baoZForm.softCost = parseFloat(this.baoZForm.softUnitPrice) * parseFloat(this.baoZForm.softArea)
          }
        } else {
          this.baoZForm.softCost = ''
        }

      },
      calcInnerBoxCost () {
        if (this.baoZForm.innerBoxUnitPrice && this.baoZForm.innerBoxArea) {
          if (typeof(this.baoZForm.innerBoxUnitPrice) && typeof(this.baoZForm.innerBoxArea)) {
            this.baoZForm.innerBoxCost = parseFloat(this.baoZForm.innerBoxUnitPrice) * parseFloat(this.baoZForm.innerBoxArea)
          }
        } else {
          this.baoZForm.innerBoxCost = ''
        }

      },
      calcOuterBoxCost () {
        if (this.baoZForm.outerBoxUnitPrice && this.baoZForm.outerBoxArea) {
          if (typeof(this.baoZForm.outerBoxUnitPrice) && typeof(this.baoZForm.outerBoxArea)) {
            this.baoZForm.outerBoxCost = parseFloat(this.baoZForm.outerBoxUnitPrice) * parseFloat(this.baoZForm.outerBoxArea)
          }
        } else {
          this.baoZForm.outerBoxCost = ''
        }

      },
      // 提交
      onSubmit () {
        if (this.taskFlag === 'bz') {
           // 包装任务提交
           this.submitBaoZhuangTask()
        } else if (this.taskFlag === 'bg') {
           // 报关任务提交
           this.submitBaoGuanTask()

        }
      },
      /**
       * 包装任务提交
       * */
       submitBaoZhuangTask () {
         let _this = this
         if (this.inderBoxData.length > 0) {
           this.inderBoxData.forEach(function (item) {
             _this.$set(item, 'projectCode', _this.form.projectCode)
           })
         }
         let param = {
           id: this.$route.query.id,
           packagingInfoReqs: this.inderBoxData.length > 0 ? this.inderBoxData : [],
           workPackagingTaskReq: this.baoZForm
         }
        Api.submitPackageTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '任务提交成功'
            })
            if (this.$route.query.tag) {
              this.$router.push({path: '/router/myTask'})
            } else {
              this.$router.push({path: '/router/taskList'})
            }

          }
        })
      },
      /**
       * 报关任务提交
       * */
      submitBaoGuanTask () {
        let param = {
          id: this.$route.query.id,
          workCustomsTaskReq: this.workCustomsTask
        }
        Api.submitBaoGuanTask(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '任务提交成功'
            })
            if (this.$route.query.tag) {
              this.$router.push({path: '/router/myTask'})
            } else {
              this.$router.push({path: '/router/taskList'})
            }
          } else {
            this.$notify.warning({
              title: '提示',
              message: '任务提交失败'
            })
          }
        })
      },
      cancelSubmit () {
        if (this.$route.query.tag) {
          this.$router.push({path: '/router/myTask'})
        } else {
          this.$router.push({path: '/router/taskList'})
        }
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
