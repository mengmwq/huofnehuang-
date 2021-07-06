<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right" style="float:right">
        <el-date-picker
          v-model="query.startDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始日期时间">
        </el-date-picker>
        <el-date-picker
          v-model="query.endDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束日期时间">
        </el-date-picker>
        <el-input size="medium" clearable placeholder="请输入申请人" prefix-icon="el-icon-search" icon="search" v-model="query.registrationNumber" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="small" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
     <template v-for="(header, index) in tableHeader">
        <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope"> <div v-if="header.prop == 'createDt'">   {{scope.row.createDt | timeFormat}} </div> <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
     </template>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
    </el-row>
  </div>
</template>


<script>
  import Api from '@/api/index'
  export default {
    name:'Finance',
    data () {
      return {
        dialogVisible: false,
        form: {},
        query: {pageSize: 10,pageNum: 1,carId: '',// param:''
        },
        tableHeader: [   
            {prop: 'ectAmount',label: 'etc金额',show: true}, 
            {prop: 'etcKilometres',label: 'etc公里数',show: true}, 
            {prop: 'gasolineAmount',label: '油卡金额',show: true}, 
            {prop: 'amountKilometres',label: '油卡公里数',show: true}, 
            {prop: 'maintainFee',label: '保养金额',show: true}, 
            {prop: 'maintainMax',label: '下次保养公里数',show: true}, 
            {prop: 'accidentFee',label: '出险金额',show: true}, 
            {prop: 'accidentTotal',label: '出险次数',show: true}
        ],
        /** 表格数据 */
        listData: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.query.carId = this.$route.query.id
      this.loadData()
      console.log(this.query.carId)
    },
    methods: {
       //油卡申请
       oilApply(){

       },
       //报销申请
       reimbursementApply(){

       },
      /**
       * 加载车辆检测表
       */
      loadData () {
        this.listLoading = true
        Api.getCarStatistics(this.query).then(data => {
          if (data) {  
          this.listData = data
          }
          this.listLoading = false
        })
      },
      addInfo () {
        this.$router.push({path: '/router/addCarInspect',query: {carId: this.$route.query.id,registrationNumber: this.$route.query.registrationNumber}})
      },
      selectInfo (id) {
        this.$router.push({path: '/router/addCarInspect',query: {id: id, registrationNumber: this.$route.query.registrationNumber}})
      },
      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
      },
      canSelected(row, index) {
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){return 0;
        } else{return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.param = '';
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
            }})
        }
      },

      /**
       * 下载
       */
      download(param){
        Api.downloadCarCheckingInfo(param).then((res) => {if (res) { 
           let reader = new FileReader()  
           reader.readAsDataURL(res)  
           reader.onload = (e) => {    
             let a = document.createElement('a')    
             a.download = '车辆检测表.xlsx'    
             a.href = e.target.result    
             document.body.appendChild(a)    
             a.click()    
             document.body.removeChild(a)  
             }}
        })
      },

    }
  }
</script>
