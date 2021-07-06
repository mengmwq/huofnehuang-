<template>
  <div>
    <el-row :gutter="20" class="mb10">
      <el-col :span="12" class="text-left">
        <span>运输路线：</span>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="transRouteDialogVisible=true" v-if="form.stateId!='045'">新增路线</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="haulwayList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="from" label="起点"></el-table-column>
        <el-table-column prop="to" label="终点"></el-table-column>
        <el-table-column prop="type" label="运输方式">
          <template slot-scope="scope">
            {{scope.row.type | transportFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="distance" label="里程"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="deleteRoad(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--新增运输线路-->
    <el-dialog
      title="新增运输线路"
      :visible.sync="transRouteDialogVisible"
      :close-on-click-modal="canClick"
      @close="resetTrasRouteForm"
      size="tiny" top="12vh" width="35%">
      <div>

        <el-form :model="addRouteForm" ref="addRouteForm" :rules="routeRules" label-width="125px">

          <el-form-item label="起点:" prop="from">
            <el-input v-model="addRouteForm.from"></el-input>
          </el-form-item>
          <el-form-item label="终点:" prop="to">
            <el-input v-model="addRouteForm.to"></el-input>
          </el-form-item>
          <el-form-item label="运输方式:" prop="transportationModeId">
            <el-select v-model="addRouteForm.transportationMode" @change="select" value-key="value" clearable placeholder="请选择运输方式" size="medium" style="width:100%">
              <el-option v-for="(item, index) in transportationMode"
                         :key="index" :label="item.cnInfo"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="里程（公里）:">
            <el-input v-model="addRouteForm.distance" :placeholder="placeholderDistance"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="addRouteForm.remarks" type="textarea" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelAddTransRoute('addRouteForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="sureAddTransRoute('addRouteForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <div id="container" class="mymap"></div>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import AMap from 'AMap'; //在页面中引入高德地图
  export default {
    name: "TransRoute",
    data () {
      return {
        canClick: false,
        transRouteDialogVisible: false,
        haulwayList: [],
        // 新增运输线路参数
        addRouteForm: {
          from: '',
          to: '',
          distance: '',
          transportationModeId: '',
          type: ''
        },
        routeRules: {
          from: [
            { required: true, message: '请填写起点', trigger: 'blur' }
          ],
          to: [
            { required: true, message: '请选择终点', trigger: 'blur' }
          ],
          transportationModeId: [
            { required: true, message: '请选择运输方式', trigger: 'blur' }
          ],
        },
        // 运输方式
        transportationMode: [],
        placeholderDistance: ''
      }
    },
    props: {
      haulwayReqs: Array,
      operateFlag: String,
      form: Object
    },
    watch: {
      form: function (obj) {
        if (obj.haulwayList) {
          this.haulwayList = obj.haulwayList
        } else {
          this.haulwayList = []
        }
      },
      haulwayReqs: function (value) {
        if (value) {
          this.haulwayList = value
        }
      },
      haulwayList: function (value) {
        if (this.operateFlag === 'pro-add') {
          this.$emit('update:haulwayReqs', value)
        }
      },
      'addRouteForm.transportationModeId': function (value) {
        // 如果是陆运就计算距离
        if (value ==1) {
          if (this.addRouteForm.from && this.addRouteForm.to) {
            this.getDistance()
          }
        } else {
          this.addRouteForm.distance = ''
        }
      }
      /*'addRouteForm.from' : function (value) {
        if (this.addRouteForm.to) {
          this.getDistance()
        }
      },
      'addRouteForm.to' : function (value) {
        if (this.addRouteForm.from) {
          this.getDistance()
        }
      },*/
    },
    mounted () {
      // 获取字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.TransportationMode) {
          this.transportationMode = distsObj.TransportationMode.children
        }
      }
    },
    methods: {

      deleteRoad(index){
        this.$confirm('您确定要删除第['+(index+1)+']种线路吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          if (this.operateFlag === 'pro-add') {
            this.haulwayList.splice(index, 1)
          } else if (this.operateFlag === 'pro-detail-edit') {
            this.haulwayList.splice(index, 1)
            this.form.haulwayReqs = this.haulwayList
            delete this.form['haulwayList']
            Api.updateProject(this.form).then((res) => {
              if (res) {
                this.$notify.success({
                  title: '提示',
                  message: '信息更新成功'
                })
                this.transRouteDialogVisible = false
                this.$emit('loadProjectDeail')
              } else {
                this.$notify.warning({
                  title: '提示',
                  message: '信息更新失败'
                })
              }
            })
          }


        })

      },

      getDistance(){
        let _this = this
        let map = ''
        if (!map) {
          map = new AMap.Map('container', {
            zoom: 9
          });
        }
        //_this.addRouteForm.distance = '计算中...'
        _this.placeholderDistance = '计算中...'
        map.plugin('AMap.Driving', function() {
          var driving = new AMap.Driving({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: AMap.DrivingPolicy.LEAST_TIME
          })

          var points = [
            { keyword: _this.addRouteForm.from, city: _this.addRouteForm.from },
            { keyword: _this.addRouteForm.to, city: _this.addRouteForm.to }
          ]

          driving.search(points, function (status, result) {
            // 未出错时，result即是对应的路线规划方案
            if (result) {
              _this.placeholderDistance = ''
              _this.addRouteForm.distance = parseInt(result.routes[0].distance * 0.001)
              _this.addRouteForm.distance = _this.addRouteForm.distance.toFixed(0)
            } else {
              _this.addRouteForm.distance = ''
            }
          })
          })
      },

      select(item){
        //胡乱定义了个值 好让表格里的运输方式显示中文
        this.addRouteForm.type = item.cnInfo
        this.addRouteForm.transportationModeId = item.value
        if (item.value ==1) {
          if (this.addRouteForm.from && this.addRouteForm.to) {
            this.getDistance()
          }
        } else {
          this.addRouteForm.distance = ''
        }
        console.log(this.addRouteForm)
      },

      /**
       * 添加运输路线
       * */
      sureAddTransRoute (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operateFlag === 'pro-add') {
              this.haulwayList.push(this.addRouteForm)
              this.transRouteDialogVisible = false
            } else if (this.operateFlag === 'pro-detail-edit') {
              this.haulwayList.push(this.addRouteForm)
              this.form.haulwayReqs = this.haulwayList
              delete this.form['haulwayList']
              Api.updateProject(this.form).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '信息更新成功'
                  })
                  this.transRouteDialogVisible = false
                  this.$emit('loadProjectDeail')
                } else {
                  this.$notify.warning({
                    title: '提示',
                    message: '信息更新失败'
                  })
                }
              })
            }

          } else {
            return false;
          }
        });
      },
      /**
       * 取消添加运输路线
       * */
      cancelAddTransRoute (formName) {
        this.$refs[formName].resetFields();
        this.transRouteDialogVisible = false
      },
      resetTrasRouteForm () {
        this.addRouteForm = {}
      },
    }

  }
</script>
