<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" v-showBtn data-authorityType="addIntendInspect-btn" size="medium" @click="addInfo">+ 添加一日三检表记录</el-button>
      </el-col>
      <el-col :span="14" class="text-right" style="float:right">
        <el-input size="medium" clearable placeholder="填表人查询" icon="search" v-model="query.uName" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                       :formatter="header.formatter"
                       :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip >
        <template slot-scope="scope">

          <div v-if="header.prop == 'checkDatetime'">
            {{scope.row.checkDatetime | DateFormat}}
          </div>

          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="selectInfo(scope.row.id)">查看</el-button>
          <el-button type="primary" size="small" @click="download(scope.row)">下载</el-button>
          <el-button type="primary" size="small" @click="printCarT(scope.row.id)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <div id="printContent" ref="printContent" style="display: none">
      <OneDayCheckTable :listData.sync="listData1" :tag="tag"></OneDayCheckTable>
    </div>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import OneDayCheckTable from '@/pages/carmanage/OneDayCheckTable'
  export default {
    components: {
      OneDayCheckTable
    },
    data () {
      return {
        carId: '',
        tag: '',
        registrationNumber: '',
        // uId: '',
        dialogVisible: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          carId: '',
          uName:'',
        },
        tableHeader: [ {
          prop: 'checkDatetime',
          label: '日期',
          align: 'center',
          show: true
        }, {
          prop: 'uName',
          align: 'center',
          label: '填表人',
          show: true
        }
        // , {
        //   prop: 'uId',         //填报人id
        //   align: 'center',
        //   label: '',
        //   show: false
        // }, {
        //   prop: 'id',           //记录id
        //   align: 'center',
        //   label: '',
        //   show: false
        // }, {
        //   prop: 'carId',
        //   align: 'center',
        //   label: '',
        //   show: false
        // }
          ],
        /** 表格数据 */
        listData: [],
        listData1: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.carId = this.$route.query.id
      this.query.carId = this.$route.query.id
      this.registrationNumber = this.$route.query.registrationNumber
      this.loadData()
      // this.form.checkDatetime = moment(this.form.checkDatetime).format('YYYY-MM-DD')
    },
    methods: {

      /**
       * 加载table data
       */
      loadData () {
        this.listLoading = true
        Api.oneDayThirdChecksInfoList(this.query).then(data => {
           if (data) {
             this.listData = data.records
             this.total = data.total
             this.listLoading = false
           }
        })
      },

      //添加-跳转网页
      addInfo () {
        this.$router.push({path: '/router/addIntendInspect',query: {carId: this.carId, registrationNumber: this.registrationNumber}})
      },
      //查看-跳转网页
      selectInfo (id) {
        this.$router.push({path: '/router/selectIntendInspect',query: {carId: this.carId, registrationNumber: this.registrationNumber,select:1,id:id}})
      },
      //打印
      printCarT(id){
        Api.queryOneDayThirdChecksInfo({id : id}).then(data => {
          if (data) {
            let _this = this
            _this.listData1 = []
            for (let i = 0; i < _this.getVal(data).length; i++) {
              let item = _this.getVal(data)[i]
              _this.listData1.push(
                {
                  no: i + 1,
                  project: item.project,
                  key: item.key,
                  option: item.value,
                },
              )
            }
            this.tag = 'print'
            document.getElementById('printContent').style.display = 'inline-block'
            this.$print(this.$refs.printContent)
            document.getElementById('printContent').style.display = 'none'
          }
        })
        // this.$router.push({path: '/router/selectIntendInspect',query: {carId: this.carId, registrationNumber: this.registrationNumber,select:1,id:id,type:'print'}})
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
      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
      },
      formartDate(value) {
        let times = '';
        if (value) {
          times = moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return times;
      },
      canSelected(row, index) {
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){
          return 0;
        } else{
          return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.query.uName = '';
        this.query.pageNum = 1;
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let param = {
            tableHead: this.tableHeader,
            data: this.listData
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      },

      download(param){
        param.checkDatetime = this.formartDate(param.checkDatetime);
        Api.downloadOndDayThirdChecksInfoTwo(param).then((res) => {
          if (res) {
            let reader = new FileReader()
            reader.readAsDataURL(res)
            reader.onload = (e) => {
              let a = document.createElement('a')
              a.download = '车辆一日三检表.xlsx'
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>

