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
          </span>
        <el-button type="primary" size="medium" @click="search" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" 
     @sort-change="sortChange" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}" >
      <template v-for="(header, index) in tableHeader">

          <el-table-column   v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            <template slot-scope="scope">
            <div v-if="header.prop == 'projectNumber'">
                <a href="javascript:;" @click="viewUser(scope.row)">{{scope.row.projectNumber}}</a>
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
    <el-dialog
      :title="'明细'"
      :before-close = "closeDialog"
      :visible.sync="JobDialog"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="50%">
      <div>
          <el-table class="page-table" :data="detailed" stripe highlight-current-row  :cell-style="{color:'#333'}">
            <el-table-column label="#" type="index" width="40"></el-table-column>
            <el-table-column v-for="(header, index) in detailedHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-dialog>
      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
  </div>
</template>

<script>
  
  import Api from '@/api/index'
    export default {
    
       data () {
        const query = this.$route.query
         return {
             checkedKeys:query.id?[query.id]:[],
           query: {
              pageSize: 10,
              pageNum: 1,
              customerName:'',
              endDate:'',
              orgId:query.orgId?query.orgId:'',
              orgName:query.orgName?query.orgName:'',
              projectName:'',
              sort:'',
              startDate:'',
              status:'',
              userId:'',
              userName:'',
              year:'',
           },
           listLoading: false,
           tableHeader: [{
             prop: 'supplierName',
             label: '供应商名称',
             width: '150',
             align: 'left',
             show: true
           },{
             prop: 'projectNumber',
             label: '关联项目数量',
             width: '150',
             align: 'left',
             sortable:'custom',
             show: true
           },{
             prop: 'totalIncome',
             label: '关联金额',
             width: '150',
             align: 'left',
             sortable:'custom',
             show: true
           }, {
             prop: 'orgName',
             label: '所属分公司',
             align: 'left',
             show: true
           }],
           detailedHeader:[{
             prop: 'projectCode',
             label: '项目编号',
             width: '150',
             align: 'left',
             show: true
           },{
             prop: 'projectName',
             label: '项目名称',
             width: '150',
             align: 'left',
             show: true
           },{
             prop: 'supplierName',
             label: '供应商名称',
             width: '150',
             align: 'left'
           },{
             prop: 'totalIncome',
             label: '关联金额',
             width: '150',
             align: 'left',
             show: true
           }, {
             prop: 'orgName',
             label: '所属分公司',
             width: '150',
             align: 'left',
             show: true
           }],
           total: 30,
           listData: [],
           treeData:[],
          companyList:[],
          detailed:[],
          JobDialog:false,
          canClick: false,
         }
       },
       mounted () {
        this.getOrgList()
         this.search()
         this.getCompanyfo()
       },
       methods: {
          closeDialog(){
	        this.JobDialog = false;
	      },
         viewUser (item) {
         this.JobDialog= true
          let param = {
          	customerName: item.supplierName,
            orgId: item.orgId
          }
          Api.getSupplierDetailedStatistics(param).then((res) => {
            this.detailed = res
          })
	    },
           getOrgList(){
            // 组织机构
            Api.getTreeFormOrgInfo().then(data => {
              this.treeData = data
            })
          },
           handleClick(data, checked, node){
               if(checked == true){
                    this.query.orgId = data.orgId;
                    this.query.orgName = data.orgName;
                    this.orgId = data.orgId;
                    this.orgName = data.orgName
                    this.$refs.orgTree.setCheckedNodes([data]);
                    } else {
                    this.orgId = ''
                    this.orgName = ''
                    this.query.orgId = ''
                    this.query.orgName= ''
                    }
            },
            nodeClick(data, checked, node){
                
                if (checked) {
                    this.query.orgId = data.orgId
                    this.query.orgName = data.orgName
                    this.orgId = data.orgId
                    this.orgName = data.orgName
                    this.$refs.orgTree.setCheckedNodes([data]);
                    } else {
                    this.orgId = ''
                    this.orgName = ''
                    this.query.orgId = ''
                    this.query.orgName= ''
                    }

            },
          //明细求和
          getSummaries(param) {
            //需要求和的字段
            const property = ['totalIncome','costPrice','payAmount','amountSum']
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
           Api.getSupplierStatistics(this.query).then(data => {
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
      sortChange({ column, prop, order }) {
	      if (order) {
	        this.tableStatus = false
	        var s = order.substring(0, 1);
	        var sOrder = "asc";
	        if (s == "d") {
	          sOrder = "desc";
	        }
	        this.query.sort = prop + " " + sOrder;
	        this.query.pageNumber = 1;
	       
	        this.search();
	        this.tableStatus = true
	      }
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

<style scoped>
  
  .orgName{
    position: relative;
  }
  .orgName:before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
    position: absolute;
    left: 77px;
    top: 14px;
  }
</style>