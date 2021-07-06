<template>
  <div>
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="项目编号" prefix-icon="el-icon-search" icon="search" v-model="query.projectCode" @keyup.enter.native="search" style="width: 220px;"></el-input>
        <el-button type="primary" size="medium" @click="search" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
           <div v-if="header.prop == 'proNo'">
             {{scope.row.proNo}}
           </div>
           <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
           <div v-else>{{scope.row[header.prop]}}</div>
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
  </div>
</template>

<script>
 
  import Api from '@/api/index'
    export default {
       data () {
         return {
           query: {
             pageSize: 10,
             pageNum: 1,
             projectCode: '',
             projectName: ''
           },
           listLoading: false,
           tableHeader: [{
             prop: 'projectCode',
             label: '项目编号',
             width: '150',
             align: 'center',
             show: true
           }, {
             prop: 'projectName',
             label: '项目名称',
             align: 'center',
             show: true
           }, {
             prop: 'cost',
             label: '成本（万元）',
             align: 'center',
             show: true
           }, {
             prop: 'income',
             label: '收入（万元）',
             align: 'center',
             show: true
           }, {
             prop: 'profitMargin',
             label: '利润率',
             align: 'center',
             show: true
           }],
           total: 30,
           listData: []

         }
       },
       mounted () {
         this.search()
       },
       methods: {
         search  (pageNum=1) {
          if(typeof pageNum =='object'){
            this.query.pageNum =1
          }else{
            this.query.pageNum =pageNum
          }
           this.listLoading = true
           Api.projectStatistics(this.query).then(data => {
             this.listData = data.records;
             this.total = data.total
             this.listLoading = false
           })
         },
         handleSizeChange (val) {
           this.query.pageSize = val
           this.search()
         },
         handleCurrentChange (val) {
           this.query.pageNum = val
           this.search(val)
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
       }
    }
</script>

