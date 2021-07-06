<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content" style="padding: 10px 20px;">
          <p>车牌号码： {{form.registrationNumber}}</p>
          <el-row>
            <el-col :span="8">
              <el-form-item label="日期：" prop="checkDatetime">
                <el-date-picker type="date" placeholder="" v-model="form.checkDatetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div ref="printContent">
            <OneDayCheckTable :listData.sync="listData"></OneDayCheckTable>
            <!--<el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
            >
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'option'">
                    <el-switch
                      style="display: block"
                      v-model="scope.row.option"
                      active-color="#13ce66"
                      inactive-color="#aaa"
                      active-text="是"
                      inactive-text="否">
                    </el-switch>
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>-->
          </div>
        </div>
        <p class="step-title"><span class="step-icon">2</span>资料上传：</p>
        <div class="dash-content">
          <el-row style="padding: 10px;">
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync="imgKey"></v-upload>
              <p class="text-center">文件上传</p>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">3</span>完成</p>

      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="cancelSubmit('form')">取 消</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 1)">提 交</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form', 2)">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import moment from 'moment'
  import Api from '@/api/index'
  import OneDayCheckTable from '@/pages/carmanage/OneDayCheckTable'
  export default {
    components: {
      'v-upload': Upload,
      OneDayCheckTable
    },
    data () {
      return {
        imgKey:'',
        type: '',
        jwt: {},
        //额外的数据
        form: {
          carId:'', //车辆id
          registrationNumber: '', //车牌号
          // uId:this.$route.query.uId, //用户id
          checkDatetime:'' //日期
        },
        /** 表格 loading */
        listLoading: false,
        rules: {
          checkDatetime:[
            { required: true, message: '请选择日期', trigger: 'change'},
          ],
        },
        //表格插入数据
        listData: [],
        //定义表格
        tableHeader: [{
          prop: 'no',
          label: '序号',
          width: '60',
          align: 'center',
          show: true
        }, {
          prop: 'project',
          label: '检查项目',
          width: '400',
          align: 'center',
          show: true
        }, {
          prop: 'option',
          label: '选项',
          align: 'center',
          show: true
        }]

      }
    },
    mounted () {
      this.form.carId = this.$route.query.carId
      this.form.registrationNumber = this.$route.query.registrationNumber
      if (sessionStorage.getItem('jwt')) {
        this.jwt = JSON.parse(sessionStorage.getItem('jwt'))
      }
      this.loadData()
      // this.$nextTick(() => {
      //   if(this.$route.query.type) {  //如果有值就打印
      //     //window.print()
      //     this.$print(this.$refs.printContent)
      //   }
      // })

    },
    methods: {
      /**
       *
       */
      loadData () {
        if(this.$route.query.id){  //如果有值就查询
          Api.queryOneDayThirdChecksInfo({id : this.$route.query.id}).then(data => {
            if (data) {
              this.form.checkDatetime = data.checkDatetime
              this.form.checkDatetime = moment(this.form.checkDatetime).format("YYYY-MM-DD");
              let _this = this
              for (let i = 0; i < _this.getVal(data).length; i++) {
                let item = _this.getVal(data)[i]
                _this.listData.push(
                  {
                    no: i + 1,
                    project: item.project,
                    key: item.key,
                    option: item.value,
                  },
                )
              }
              this.form.checkDatetime = moment(data.checkDatetime).format('YYYY-MM-DD')
            }
          })
        }else {
          let arr = [
            {project: '收车后_备胎', key: 'afterBackupTyre', value: false},
            {project: '收车后_螺栓', key: 'afterBolt', value: false},
            {project: '收车后_车厢内部', key: 'afterCarInside', value: false},
            {project: '收车后_车辆本身', key: 'afterCarState', value: false},
            {project: '收车后_灯光', key: 'afterLight', value: false},
            {project: '收车后_号牌', key: 'afterRegistrationNumber', value: false},
            {project: '收车后_变速器', key: 'afterTransmission', value: false},
            {project: '收车后_轮胎', key: 'afterTyre', value: false},
            {project: '出车前_备胎', key: 'beforeBackupTyre', value: false},
            {project: '出车前_蓄电池', key: 'beforeBattery', value: false},
            {project: '出车前_随车器具', key: 'beforeCarAttachment', value: false},
            {project: '出车前_冷却液', key: 'beforeCoolant', value: false},
            {project: '出车前_证件', key: 'beforeCredentials', value: false},
            {project: '出车前_仪表', key: 'beforeDashboard', value: false},
            {project: '出车前_发动机', key: 'beforeEngine', value: false},
            {project: '出车前_踏板', key: 'beforeFootboard', value: false},
            {project: '出车前_燃油量', key: 'beforeFuelAmount', value: false},
            {project: '出车前_机油和燃油系统', key: 'beforeFuelSystem', value: false},
            {project: '出车前_照明', key: 'beforeLight', value: false},
            {project: '出车前_专项系统', key: 'beforeSpecificSystem', value: false},
            {project: '出车前_轮胎', key: 'beforeTyre', value: false},
            {project: '出车前_风窗', key: 'beforeWindow', value: false},
            {project: '出车前_刮水器', key: 'beforeWiper', value: false},
            {project: '行驶中_车辆状况', key: 'ingCarState', value: false},
            {project: '行驶中_仪表情况', key: 'ingDashboard', value: false},
            {project: '行驶中_左后部位', key: 'ingLeftBack', value: false},
            {project: '行驶中_左前部位', key: 'ingLeftFont', value: false},
            {project: '行驶中_右后部位', key: 'ingRightBack', value: false},
            {project: '行驶中_右前部位', key: 'ingRightFont', value: false},
            {project: '行驶中_轮胎状况', key: 'ingTyre', value: false},
          ]
          let _this = this
          _this.listData = []
          for (let i = 0; i < arr.length; i++) {
            let item = arr[i]
            _this.listData.push(
              {
                no: i + 1,
                project: item.project,
                key: item.key,
                option: item.value,
              },
            )
          }
        }
      },
      /**
       * 表单提交
       */
      submitForm (formName,tag) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.form.checkDatetime = moment(this.form.checkDatetime).format('YYYY-MM-DD')
            let param = {
              carId: this.form.carId, //车辆id
              registrationNumber: this.form.registrationNumber, //车牌号
              uId: this.jwt.uId, //用户id
              checkDatetime: this.form.checkDatetime //日期
            }
            this.listData.forEach(function(item) {
              param[item.key] = item.option === true ? '1' : '0'
            })
            let arr = []
            if (this.imgKey) {
              arr.push({
                attachmentUrlKey: this.imgKey,
                name: this.imgKey
              })
            }
            param.oneDayThiChecksAttachmentReqs = arr
            Api.addOneDayThirdChecksInfo(param).then(data => {
              if (data) {
                this.$notify.success({
                  title: '提示',
                  message: '一日三检添加成功',
                })
                if (tag === 1) {
                  this.$router.push({path: '/router/intendInspect', query: {
                      id: this.$route.query.carId,
                      registrationNumber: this.$route.query.registrationNumber
                    }})
                } else {
                  this.loadData()
                  this.imgKey = ''
                  this.form.checkDatetime = ''
                }


              }
            })
          } else {
            this.$notify.warning({
              title: '提示',
              message: '请完善表单',
            })
          }
        })
      },
      cancelSubmit (formName) {
        this.form = {}
        this.$router.push({path: '/router/intendInspect', query: {
            id: this.$route.query.carId,
            registrationNumber: this.$route.query.registrationNumber
          }})
      },

      getVal(obj) {   //接口返回的对象值并且把对象的属性转为数组,赋值给list
        let list = [];
        for(let key in obj) {
          list.push({
            key: key,
            val: obj[key]
          });
        }

        let arr = [
          {project: '收车后_备胎', key: 'afterBackupTyre', value: false},
          {project: '收车后_螺栓', key: 'afterBolt', value: false},
          {project: '收车后_车厢内部', key: 'afterCarInside', value: false},
          {project: '收车后_车辆本身', key: 'afterCarState', value: false},
          {project: '收车后_灯光', key: 'afterLight', value: false},
          {project: '收车后_号牌', key: 'afterRegistrationNumber', value: false},
          {project: '收车后_变速器', key: 'afterTransmission', value: false},
          {project: '收车后_轮胎', key: 'afterTyre', value: false},
          {project: '出车前_备胎', key: 'beforeBackupTyre', value: false},
          {project: '出车前_蓄电池', key: 'beforeBattery', value: false},
          {project: '出车前_随车器具', key: 'beforeCarAttachment', value: false},
          {project: '出车前_冷却液', key: 'beforeCoolant', value: false},
          {project: '出车前_证件', key: 'beforeCredentials', value: false},
          {project: '出车前_仪表', key: 'beforeDashboard', value: false},
          {project: '出车前_发动机', key: 'beforeEngine', value: false},
          {project: '出车前_踏板', key: 'beforeFootboard', value: false},
          {project: '出车前_燃油量', key: 'beforeFuelAmount', value: false},
          {project: '出车前_机油和燃油系统', key: 'beforeFuelSystem', value: false},
          {project: '出车前_照明', key: 'beforeLight', value: false},
          {project: '出车前_专项系统', key: 'beforeSpecificSystem', value: false},
          {project: '出车前_轮胎', key: 'beforeTyre', value: false},
          {project: '出车前_风窗', key: 'beforeWindow', value: false},
          {project: '出车前_刮水器', key: 'beforeWiper', value: false},
          {project: '行驶中_车辆状况', key: 'ingCarState', value: false},
          {project: '行驶中_仪表情况', key: 'ingDashboard', value: false},
          {project: '行驶中_左后部位', key: 'ingLeftBack', value: false},
          {project: '行驶中_左前部位', key: 'ingLeftFont', value: false},
          {project: '行驶中_右后部位', key: 'ingRightBack', value: false},
          {project: '行驶中_右前部位', key: 'ingRightFont', value: false},
          {project: '行驶中_轮胎状况', key: 'ingTyre', value: false},
        ];   //原数组
        arr = arr.map(item => {
          let obj = list.find(kItem => kItem.key === item.key);
          if (obj) {
            item.value = obj.val;
             if(item.value ==1){
               item.value = true
             }else {
               item.value = false
             }
          }
          return item;
        })
        return arr;
      },


    }
  }
</script>

<style scoped>
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }

  .footer {
    float: right;
    margin-top: 20px;
  }
</style>
