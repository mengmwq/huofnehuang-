<template>
  <div>
      <div class="tar mb10" v-if="stateId !=='045'">
         <!--<el-button size="small" type="primary" @click="addFinance('add')" >
                   添加
         </el-button>
         <el-button size="small" type="primary" @click="addFinance('add')" >
                   打印
         </el-button>-->
      </div>
      <div>
         <h3>税前合计:{{amountTotal.toFixed(2)}}    税后合计:{{remittanceTotal.toFixed(2)}}</h3>
      </div>
      <!-- table -->
      <el-table
        class="page-table"
        :data="listData"
        stripe
        highlight-current-row
        :cell-style="{color:'#333'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <template v-for="(header, index) in tableHeader">
            <el-table-column
                v-if="header.show"
                :key="index"
                :prop="header.prop"
                :label="header.label"
                :sortable="header.sortable"
                :align="header.align"
                :min-width="header.width"
                :column-key="header.prop"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                    <div v-if="header.prop == 'createDt'">{{scope.row.createDt | timeFormat}}</div>
                    <div v-else-if="header.prop == 'updateDt'">{{scope.row.createDt | timeFormat}}</div>
                    <div v-else-if="header.prop == 'type'">
                      {{getDictsKeyName(scope.row,'PROJECT_BILL_TYPE',scope.row.type)}}
                    </div>
                     <div v-else-if="header.prop == 'currency'">
                      {{getDictsKeyName(scope.row,'Currency',scope.row.currency)}}
                    </div>
                    <div v-else-if="header.prop == 'feeType'">
                      {{getDictsKeyName(scope.row,'FeeType',scope.row.feeType)}}
                    </div>
                    <div v-else-if="header.prop == 'status'">
                      {{getDictsKeyName(scope.row,'PROJECT_BILL_STATUS',scope.row.status)}}
                    </div>
                    <div v-else>{{scope.row[header.prop]}}</div>
                </template>
                </el-table-column>
        </template>
        <el-table-column label="操作" width="250" fixed="right" v-if="stateId !=='045'">
        <template slot-scope="scope" fixed="right">
           <el-button type="primary"  size="mini" v-if="scope.row.status === '0'" @click="addFinance('edit',scope.row)">编辑</el-button>
           <el-button type="primary"  size="mini" v-if="scope.row.status === '0'" @click="udateFinance(scope.row)">启用</el-button>
           <el-button type="primary"  size="mini" v-if="scope.row.status === '1'" @click="udateStop(scope.row)">停用</el-button>
           <el-button type="primary"  size="mini" v-if="scope.row.status === '0' && scope.row.type === '1' " @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <ProjectExpenditureBillAdd
       v-if="isShowDialog"
       :isShowDialog="isShowDialog"
       :editForm="editForm"
       @closeDialog="closeDialog"
       @changeDialog="changeDialog">
      </ProjectExpenditureBillAdd>
  </div>
</template>

<script>
import ProjectExpenditureBillAdd from "./ProjectExpenditureBillAdd"
import {ProjectFinance} from '@/model/ProjectFinance'
import Api from "@/api/index";
import * as filters from "@/filters/filter";
import Util from '@/utils/index'
export default {
    components:{
        ProjectExpenditureBillAdd,
    },
  data() {
    const editForm = new ProjectFinance()
    return {
               
      tableHeader: [
        {
          prop: "name",
          label: "费用名称",
          show: true
        }, {
          prop: "unitPrice",
          label: "单价",
          show: true
        }, {
          prop: "num",
          label: "数量",
          show: true
        },
        {
          prop: "amount",
          label: "金额",
          show: true
        },
        {
          prop: "currency",
          label: "币种",
          show: true
        },
        {
          prop: "rate",
          label: "汇率",
          show: true
        },
        {
          prop: "remittance",
          label: "汇后",
          show: true
        },
        {
          prop: "receiver",
          label: "收款方",
          show: true
        },
        {
          prop: "type",
          label: "记录方式",
          show: true
        },
        {
          prop: "ctUName",
          label: "记录人",
          show: true
        },
        {
          prop: "status",
          label: "是否启用",
          show: true
        },
        /**{
          prop: "ctUName",
          label: "记录人",
          show: true
        },*/
        {
          prop: "createDt",
          label: "记录时间",
          show: true
        },
        {
          prop: "updateDt",
          label: "修改时间",
          show: true
        },
        {
          prop: "remarks",
          label: "备注",
          show: true
        },
      ],
      /** 表格数据 */
      listData:[],
      multipleSelection: [],
      /** 总数据数 */
      total: 0,
      /** 表格 loading */
      listLoading: false,
      isShowDialog:false,
      editForm:editForm,
      amountTotal:0,
      remittanceTotal: 0,
    };
  },
  props: {
    stateId:String,
  },
  watch: {
  stateId: function (value) {
    this.stateId = value
  }
 },
  mounted() {
    this.loadData()
  },
  methods: {
     /**
     * 获取字典名称
     */
    getDictsKeyName(row,key,val){
      return Util.getDictsKeyName(row,key,val)
    },
     udateFinance (item) {
        this.$confirm(`您确定要启用费用名称【${item.name}】信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: item.id,
            status: '1',
          }
          Api.updateProjectBillList(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '启用成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '启用失败'
            })
          })
        })
      },
      udateStop (item) {
        this.$confirm(`您确定要停用费用名称【${item.name}】信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: item.id,
            status: '0',
          }
          Api.updateProjectBillList(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '停用成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '停用失败'
            })
          })
        })
      },
      deleteItem (item) {
        this.$confirm(`您确定要删除费用名称【${item.name}】信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: item.id,
            status: '1',
          }
          Api.updateProjectBillList(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '启用成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '启用失败'
            })
          })
        })
      },
    deleteItem (item) {
        this.$confirm(`您确定要删除费用名称【${item.name}】信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: item.id,
          }
          Api.deleteProjectBillList(param).then(() => {

            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },
      addFinance(flag,row){
          if(flag=='add'){
              this.editForm = new ProjectFinance()
          }else if(flag=='edit'){
              this.editForm = JSON.parse(JSON.stringify(row))
          }
          this.isShowDialog = true
      },
      changeDialog(){
         this.loadData()
          this.closeDialog()
          
      },
      closeDialog(){
          this.isShowDialog= false
      },
    /**
     * 加载
     */
      loadData() {
        this.listLoading = true;
        const params = {
          projectCode: this.$route.query.projectCode,
      	  bidId : this.$route.query.bidId,
          costType:'2'
        }
        Api.getProjectBillList(params).then(res => {
          console.log(res,'fsfsaf')
          if (res) {
            this.listData = res;
            this.amountTotal = 0;
            this.remittanceTotal = 0;
            for(var i=0;i<res.length;i++){
            	if(res[i].status === '1'){
            		this.amountTotal = this.amountTotal + res[i].amount 
            		this.remittanceTotal = this.remittanceTotal + res[i].remittance
            	}
            }
            //this.total = res.total;
          }
          this.listLoading = false;
        });
        this.listLoading = false;
      },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.loadData();
    },
  }
};
</script>
<style lang="scss" scoped>
  .financeTable {
     width:100%;
     border-collapse: collapse;
     td,th {
       border:1px solid #ccc;
       padding:5px;
       text-align: center;
     }
  }
</style>