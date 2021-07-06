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
          <!--<p>检测日期： 2019-01-04 13:30:30</p>-->
          <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
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
                <!-- <div v-else-if="header.prop == 'desc'">
                   <el-input v-model="scope.row.desc"></el-input>
                 </div>-->
                 <div v-else>{{scope.row[header.prop]}}</div>
               </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">2</span>资料上传：</p>
        <div class="dash-content">
          <el-row style="padding: 10px;">
            <el-col :span="4" class="text-center">
              <!--<v-upload></v-upload>-->
              <v-upload :imgKeyReq.sync="imgKey"></v-upload>
              <p class="text-center">文件上传</p>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">3</span>完成</p>

      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium"  @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" size="medium" v-if="flag" @click="submitForm('form', 1)">提 交</el-button>
        <el-button type="primary" size="medium" v-if="flag" @click="submitForm('form', 2)">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  export default {
    components: {
      'v-upload': Upload
    },
    data () {
      return {
        imgKey: '',
        flag: true,
        type: '',
        form: {},
        /** 表格 loading */
        listLoading: false,
        rules: {},
        listData: [],
        tableHeader: [ {
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
      this.loadData()
      this.form.registrationNumber = this.$route.query.registrationNumber
    },
    methods: {

      /** 序号 */
      indexMethod(index){
        return index +1
      },

      loadData () {
        if(this.$route.query.id){  //如果有值就查询
          this.flag = false
          Api.queryCarCheckingInfoById({id : this.$route.query.id}).then(data => {
            if (data) {
              let _this = this
              _this.getVal(data)
              /*for (let i = 0; i < _this.getVal(data).length; i++) {
                let item = _this.getVal(data)[i]
                _this.listData.push(
                  {
                    no: i + 1,
                    project: item.project,
                    key: item.key,
                    option: item.value,
                  },
                )
              }*/
            }
          })
        }else {
          let arr = [
            {project: '车辆整体外观是否完好', key: 'afterBackupTyre', desc: '', value: false},
            {project: '车辆轮胎胎压是否正常', key: 'afterBolt', desc: '', value: false},
            {project: '车头，拖车减震气垫充气是否充足正常', key: 'afterCarInside', desc: '', value: false},
            {project: '车辆尿素是否添加', key: 'afterCarState', desc: '', value: false},
            {project: '检查备胎是否正常', key: 'afterLight', desc: '', value: false},
            {project: '检查车辆雨布，捆绑带，网套是否正常', key: 'afterRegistrationNumber', desc: '', value: false},
            {project: '车底有漏油、漏水情况', key: 'afterTransmission', desc: '', value: false},
            {project: '车底内外是否清洁', key: 'afterTyre', desc: '', value: false},
            {project: '发动机有无部件发生泄漏', key: 'beforeBackupTyre', desc: '', value: false},
            {project: '全车灯光是否正常', key: 'beforeBattery', desc: '', value: false},
            {project: '牌照固定是否正常', key: 'beforeCarAttachment', desc: '', value: false},
            {project: '制动效果是否正常', key: 'beforeCoolant', desc: '', value: false},
            {project: '车流量悬挂及减震器是否正常', key: 'beforeCredentials', desc: '', value: false},
            {project: 'GPS监控系统是否正常', key: 'beforeDashboard', desc: '', value: false},
            {project: '离合及换挡操作情况', key: 'beforeEngine', desc: '', value: false},
            {project: '发动机工作情况', key: 'beforeFootboard', desc: '', value: false},
            {project: '变速箱、传动轴、差速器工况', key: 'beforeFuelAmount', desc: '', value: false},
            {project: '冷藏车压缩机启动是否正常', key: 'beforeFuelSystem', desc: '', value: false},
            {project: '车辆是否有易燃易爆危险品(打火机等)', key: 'beforeLight', desc: '', value: false},
            {project: '三脚架，灭火器', key: 'beforeSpecificSystem', desc: '', value: false},
            {project: '油卡', key: 'beforeTyre', desc: '', value: false},
            {project: 'ETC', key: 'beforeWindow', desc: '', value: false},
            {project: '行驶证，运营证', key: 'beforeWiper', desc: '', value: false},
            {project: '保单复印件', key: 'ingCarState', desc: '', value: false},
            {project: '仪表指示（车辆行驶里程数出发前)', key: 'ingDashboard', desc: '', value: false},
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
                desc: item.desc,
                option: item.value,
              },
            )
          }
        }
      },

      getVal(obj) {   //接口返回的对象值并且把对象的属性转为数组,赋值给list
        /*let list = [];
        for(let key in obj) {
          list.push({
            key: key,
            val: obj[key]
          });
        }*/
        let arr = [
          {project: '车辆整体外观是否完好', key: 'checkingFlgItem1', desc: '', value: false},
          {project: '车辆轮胎胎压是否正常', key: 'checkingFlgItem2', desc: '', value: false},
          {project: '车头，拖车减震气垫充气是否充足正常', key: 'checkingFlgItem3', desc: '', value: false},
          {project: '车辆尿素是否添加', key: 'checkingFlgItem4', desc: '', value: false},
          {project: '检查备胎是否正常', key: 'checkingFlgItem5', desc: '', value: false},
          {project: '检查车辆雨布，捆绑带，网套是否正常', key: 'checkingFlgItem6', desc: '', value: false},
          {project: '车底有漏油、漏水情况', key: 'checkingFlgItem7', desc: '', value: false},
          {project: '车底内外是否清洁', key: 'checkingFlgItem8', desc: '', value: false},
          {project: '发动机有无部件发生泄漏', key: 'checkingFlgItem9', desc: '', value: false},
          {project: '全车灯光是否正常', key: 'checkingFlgItem10', desc: '', value: false},
          {project: '牌照固定是否正常', key: 'checkingFlgItem11', desc: '', value: false},
          {project: '制动效果是否正常', key: 'checkingFlgItem12', desc: '', value: false},
          {project: '车流量悬挂及减震器是否正常', key: 'checkingFlgItem13', desc: '', value: false},
          {project: 'GPS监控系统是否正常', key: 'checkingFlgItem14', desc: '', value: false},
          {project: '离合及换挡操作情况', key: 'checkingFlgItem15', desc: '', value: false},
          {project: '发动机工作情况', key: 'checkingFlgItem16', desc: '', value: false},
          {project: '变速箱、传动轴、差速器工况', key: 'checkingFlgItem17', desc: '', value: false},
          {project: '冷藏车压缩机启动是否正常', key: 'checkingFlgItem18', desc: '', value: false},
          {project: '车辆是否有易燃易爆危险品(打火机等)', key: 'checkingFlgItem19', desc: '', value: false},
          {project: '三脚架，灭火器', key: 'checkingFlgItem20', desc: '', value: false},
          {project: '油卡', key: 'checkingFlgItem21', desc: '', value: false},
          {project: 'ETC', key: 'checkingFlgItem22', desc: '', value: false},
          {project: '行驶证，运营证', key: 'checkingFlgItem23', desc: '', value: false},
          {project: '保单复印件', key: 'checkingFlgItem24', desc: '', value: false},
          {project: '仪表指示（车辆行驶里程数出发前)', key: 'checkingFlgItem25', desc: '', value: false},
        ];   //原数组
       /* arr = arr.map(item => {
          let obj = list.find(kItem => kItem.val === '0' || kItem.val === '1');
          debugger
          item.value = obj.val ==1

          return item;
        })
        return arr;*/
       this.listData = []
        let _this = this
       for(let key in obj) {
         for (let i = 0; i < arr.length; i++) {
           if (key === arr[i].key) {
             _this.listData.push(
               {
                 no: i + 1,
                 project: arr[i].project,
                 option: obj[key] == 1,
               },
             )

           }

         }
       }
      },

      /**
       * 表单提交
       */
      submitForm (formName, tag) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              carId: this.$route.query.carId, //车辆id
              delFlg: '0',
            }
            this.listData.forEach(function(item, index) {
              param['checkingFlgItem' + (index+1)] = item.option === true ? '1' : '0'
              param['checkingInfoItem' + (index+1)] = item.desc
            })
            let arr = []
            if (this.imgKey) {
              arr.push({
                attachmentUrlKey: this.imgKey,
                name: this.imgKey
              })
            }
            param.carCheckingAttachmentReqs = arr
            Api.addCarChecking(param).then(data => {
              if (data) {
                this.$notify.success({
                  title: '提示',
                  message: '添加车辆检查数据成功',
                })
                if (tag === 1) {
                  this.$router.push({path: '/router/carInspect', query: {
                      id: this.$route.query.carId,
                      registrationNumber: this.$route.query.registrationNumber
                    }})
                } else {
                  this.loadData()
                  this.imgKey = ''
                }

              }
            })
          } else {
            this.$message('请完善表单')
          }
        })
      },
      cancelSubmit (formName) {
        this.form = {}
      }

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
