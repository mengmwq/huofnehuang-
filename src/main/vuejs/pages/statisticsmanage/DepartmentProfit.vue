<template>
  <div>
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-date-picker
          v-model="query.startDate"
          style="width:240px;"
          type="date"
           clearable
          format='yyyy-MM-dd'
          value-format ="yyyy-MM-dd"
          size="medium"
          placeholder="起始年月日">
        </el-date-picker>
        <label for="">至</label>
        <el-date-picker
          v-model="query.endDate"
           style="width:240px;"
           clearable
          type="date"
          format='yyyy-MM-dd'
          value-format ="yyyy-MM-dd"
          size="medium"
          placeholder="截止年月日">
        </el-date-picker>
        <el-select v-model="query.orgId" filterable clearable placeholder="选择分公司" size="medium" @change="search(null)">
            <el-option v-for="item in companyList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
          </el-select>
          <el-select v-model="query.status" clearable placeholder="项目状态" size="medium" style="width:120px" @change="search(null)">
            <el-option v-for="item in projectStateList" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
          </el-select>
        <el-input size="medium" clearable placeholder="请输入部门名称" prefix-icon="el-icon-search" icon="search" v-model="query.orgName" @keyup.enter.native="search" style="width: 220px;"></el-input>
        <el-button type="primary" size="medium" @click="search" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" 
    
    stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <template v-for="(header, index) in tableHeader">

          <el-table-column   v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            <template slot-scope="scope">
            <div v-if="header.prop == 'proNo'">
                {{scope.row.proNo}}
            </div>
            <div v-else-if="header.prop == 'profitRatio'">
                   {{scope.row.costPrice !== 0 ? ((scope.row.profitAmount/scope.row.amountSum)*100).toFixed(2) : 0}}%
             </div>
            <div v-else-if="header.prop == 'orgName'">
                    <router-link :to="{path: '/router/personProfit', query: {orgId: scope.row.orgId,orgName:scope.row.orgName}}">{{scope.row.orgName}}</router-link>
                    </div>
            <div v-else>{{scope.row[header.prop]}}</div>
            </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" class="page-box" justify="end">
      
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button> -->
    </el-row>
  </div>
</template>

<script>
  import {Org}  from '@/model/Org'
  import Api from '@/api/index'
    export default {
      computed:{
        orgList(){
          console.log(this.$store.state.organization.allOrganizationInfo,'sfsfa')
          return this.$store.state.organization.allOrganizationInfo;
        },
        projectStateList(){
           return this.$store.state.dictionary.dists.PROJECT_TYPE.children;
        },
      },
       data () {
         const orgId = this.$route.query.orgId
         return {
           isShowTree:false,
           orgId:orgId,
            defaultProps: {
              children: "childrenOrgs",
              label: "name"
            },
           query: {
              pageSize: 10,
              pageNum: 1,
              customerName:'',
              endDate:'',
              orgId:orgId,
              orgName:'',
              projectName:'',
              sort:'',
              startDate:'',
              status:'045',
              userId:'',
              userName:'',
              year:'',
           },
           listLoading: false,
           tableHeader: [{
             prop: 'orgName',
             label: '部门名称',
             width: '150',
             align: 'left',
             show: true
           },{
             prop: 'parentName',
             label: '公司名称',
             width: '150',
             align: 'left',
             show: true
           }, 
           {
             prop: 'amountSum',
             label: '收入（元）',
             align: 'right',
             show: true
           }, 
           {
             prop: 'payAmount',
             label: '支出（元）',
             align: 'right',
             show: true
           },
           {
             prop: 'profitAmount',
             label: '利润',
             align: 'right',
             show: true
           }, 
           {
             prop: 'profitRatio',
             label: '利润率',
             align: 'right',
             show: true
           }],
           total: 30,
           listData: [],
          companyList:[],
          treeData:[],
          defaultProps: {
            children: 'childrens',
            label: 'orgName'
          },
         }
       },
       mounted () {
         this.getOrgList()
         this.search()
         this.getCompanyfo()
       },
       methods: {
         handleChange(val){

         },
          getOrgList(){
            // 组织机构
            Api.getTreeFormOrgInfo().then(data => {
              this.treeData = data[0].childrens
            })
          },
          //明细求和
          getSummaries(param) {
            //需要求和的字段
            const property = ['profitAmount','costPrice','amountSum']
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
              if (index === 0) {
                sums[index] = '合计：';
                return;
              }
              const values = data.map(item => Number(item[column.property]));

              if (!values.every(value => isNaN(value)) && (property.some(item=>item==column.property))){
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
                
                sums[index] = sums[index].toFixed(2)
              } else {
                sums[index] = '';
              }
            });

            return sums;
          },
         //获取分公司列表
         getCompanyfo(){
            Api.getCompanyfo().then(res=>{
                this.companyList = res
            })
          },
         search  (pageNum=1) {
          if(typeof pageNum =='object'){
            this.query.pageNum =1
          }else{
            this.query.pageNum =pageNum
          }
           this.listLoading = true
           Api.getOrgExpIncomeStatistics(this.query).then(data => {
             this.listData = data.result;
             this.total = data.totalCount
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

