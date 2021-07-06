<template>
  <div>
      <div class="tar mb10">
         <el-button size="small" type="primary" @click="addFinance('add')" >
              添加收支
            </el-button>
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
                    
                     <div v-else-if="header.prop == 'type'">
                      {{getDictsKeyName(scope.row,'BalanceDetailedType',scope.row.type)}}
                    </div>
                    <div v-else>{{scope.row[header.prop]}}</div>
                </template>
                </el-table-column>
        </template>
        <el-table-column label="操作" width="150">
        <template slot-scope="scope">
           <el-button type="primary"  size="mini"   @click="addFinance('edit',scope.row)">编辑</el-button>
           <el-button type="primary"  size="mini"   @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <ProjectFinanceAdd
       v-if="isShowDialog"
       :isShowDialog="isShowDialog"
       :editForm="editForm"
       @closeDialog="closeDialog"
       @changeDialog="changeDialog">

      </ProjectFinanceAdd>
  </div>
</template>

<script>
import ProjectFinanceAdd from "./ProjectFinanceAdd"
import {ProjectFinance} from '@/model/ProjectFinance'
import Api from "@/api/index";
import * as filters from "@/filters/filter";
import Util from '@/utils/index'
export default {
    components:{
        ProjectFinanceAdd,
    },
  data() {
    const editForm = new ProjectFinance()
    return {
      tableHeader: [
        
        {
          prop: "renown",
          label: "费用名称",
        
          show: true
        },
        {
          prop: "type",
          label: "类型",
         
          show: true
        },
        {
          prop: "createDt",
         
          label: "创建时间",
          //fixed: "left",
          show: true
        },
        {
          prop: "amount",
          label: "金额",
          align:'right',
          show: true
        },
        {
          prop: "receiver",
        
          label: "收款方",
          //fixed: "left",
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
    };
  },
  props: {
    projectCode: String,
    query:Object,
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
    deleteItem (item) {
        this.$confirm(`您确定要删除费用名称【${item.renown}】信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id: item.id,
          }
          Api.removeProjectBalanceDetailed(param).then(() => {

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
          relationId: this.$route.query.id
        }
        Api.getProjectBalanceDetailed(params).then(res => {
          console.log(res,'fsfsaf')
          if (res) {
            this.listData = res;
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