<template>
 <div class="projectBreakEvenDetails">
    <el-form :inline="true" class="formDetails">
    
      <el-row type="flex">
          <el-col :span="23">
             <el-row v-if="budgetInfo">
              <el-col :span="8">
                  <el-form-item label="项目编号：">
                    {{budgetInfo.projectCode}}
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="执行公司：">
                    {{budgetInfo.orgName}}
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="客户：">
                    {{budgetInfo.customerName}}
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="项目名称：">
                    {{budgetInfo.projectName}}
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="立项日期：">
                    {{budgetInfo.establishedTime | DateFormat}}
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="合同金额：">
                    {{getNumberFormat(budgetInfo.expenditure)}}
                  </el-form-item>
              </el-col>
          </el-row>
          </el-col>
          <el-col :span="1">
            <router-link to="">
                <el-button size="mini" type="primary" @click="$router.go(-1)" >返回</el-button>
            </router-link>
          </el-col>
      </el-row>
  </el-form>
  <div class="payBox">
        <h3>支出明细</h3>
        <el-table class="page-table" v-if="budgetInfo" :data="budgetInfo.statistics"  stripe highlight-current-row  show-summary
         @expand-change="handleExpandChange" 
        v-loading="listLoading" :cell-style="{color:'#333'}"
    >
     <el-table-column type="index" label="序号"></el-table-column>
     <el-table-column type="expand" show-overflow-tooltip>
          <template slot-scope="scope">
             <el-table v-if="scope.row.children" 
                
                :data="scope.row.children" stripe :show-header="false">
                 <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column
                    v-for="(header, index) in tableHeaderSub"
                    :key="scope.$index+index"
                    :min-width="header.width"
                    :prop="header.prop"
                    :label="header.label"
                  >
                  <template slot-scope="scope">
                       <div v-if="header.prop == 'expenditure'">
                        {{getNumberFormat(scope.row.expenditure)}}
                      </div>
                      <div v-else>{{scope.row[header.prop]}}</div>
                  </template>
                  </el-table-column>
                  
                </el-table>
          </template>
        </el-table-column>
      <template v-for="(header, index) in tableHeader" >
       
        <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
            <div v-if="header.prop == 'expenditure'">
              {{getNumberFormat(scope.row.expenditure)}}
            </div>
             <div v-else-if="header.prop == 'totalIncome'">
            {{getNumberFormat(scope.row.totalIncome)}}
          </div>
          <div v-else-if="header.prop == 'totalExpenditure'">
            {{getNumberFormat(scope.row.totalExpenditure)}}
          </div>
          <div v-else-if="header.prop == 'totalGrossProfit'">
            {{getNumberFormat(scope.row.totalGrossProfit)}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      </template>
      <!-- <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addItem(scope.row)">补录</el-button>
           
        </template>
      </el-table-column> -->
    </el-table>
  </div>
  <ProjectBreakEvenAdd v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" 
  @closeDialog="closeDialog"  @dialogChange="dialogChange"/>
 </div>
 
</template>


<script>
  
  import Api from '@/api/index'
  import ProjectBreakEvenAdd  from  './ProjectBreakEvenAdd'
  import Util from '@/utils/'
  export default {
    name:'ProjectBreakEvenDetails',
    components:{
      ProjectBreakEvenAdd,
    },
    data () {
      return {
        budgetInfo:null,
        isShowDialog:false,
        listLoading:false,
        subTableListLoading:false,
        editForm:null,
        listData:[
          {
            orgName:'报关部',
            cost:2000,
            children:[
              {
                costName:'交通费用',
                value:5000,
                person:'王小二',
              },
              {
                costName:'交通费用',
                value:5000,
                person:'王小二',
              },
              {
                costName:'交通费用',
                value:5000,
                person:'王小二',
              },
            ],
          },
          {
            orgName:'报关部',
            cost:2000,
            children:[
              {
                costName:'交通费用',
                value:5000,
                person:'王小二',
              },
              {
                costName:'交通费用',
                value:5000,
                person:'王小二',
              },
              {
                costName:'交通费用',
                value:5000,
                person:'王小二',
              },
            ],
          }
        ],
        tableHeaderSub:[
          {
          prop: 'expenditureName',
          label: '费用名称',
          align: 'left',
           sortable:false,
          show: true
        }, {
          prop: 'expenditure',
          label: '费用(元)',
           sortable:false,
            align: 'left',
          width:'150',
          show: true
        } , {
          prop: 'userName',
          label: '负责人',
           sortable:false,
            align: 'left',
          width:'150',
          show: true
        } 
        ],
       tableHeader: [ {
          prop: 'orgName',
          label: '部门',
          align: 'left',
           sortable:false,
          show: true
        }, {
          prop: 'expenditure',
          label: '费用(元)',
           sortable:false,
            align: 'left',
          width:'150',
          show: true
        } ],
      }
    },
    mounted () {
      //this.loadData()
      this.getBudgetDetails()

    },
    methods: {
      
      getNumberFormat(val){
        return val?Util.numberFormat(val):''
      },
      //获取项目收支明细
      getBudgetDetails(){
        const params = {
           projectCode:this.$route.query.projectCode
        }
        Api.getBudgetDetails(params).then(res=>{
            this.budgetInfo = res
        })
      },  
      closeDialog(){
         this.isShowDialog = false
      },
      dialogChange(){
         //需要重新处理下列表数据
      },
      addItem(row){
        console.log(row,'ror')
          this.editForm = {
             costName:'',
             value:'',
             person:''
          }
          this.isShowDialog = true
      },
      /** 处理拓展行 */
      handleExpandChange(row, expandedRows) {
        console.log(row, expandedRows, "1111");
        this.listLoading = true;
        const params = {
          projectCode:this.$route.query.projectCode,
          orgId:row.orgId,
        }
        Api.getUserBudgetStatistics(params).then(res=>{
           row.children = res
           this.listLoading = false;
        }).catch(err=>{
           this.listLoading = false;
        })
      
      },
    }
  }
</script>

<style lang="scss" scoped>
.projectBreakEvenDetails {

  .el-form{
    padding:20px 30px;
    background-color:#eee;
    border-radius: 10px;
  }

  
}
</style>

