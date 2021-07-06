<template>
   <div>
      <el-table
        class="page-table"
        :data="listData"
        stripe
        highlight-current-row
        :cell-style="{color:'#333'}"
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
                    
                     <div v-else-if="header.prop == 'currency'">
                      {{getDictsKeyName(scope.row,'Currency',scope.row.currency)}}
                    </div>
                    <div v-else-if="header.prop == 'feeType'">
                      {{getDictsKeyName(scope.row,'FeeType',scope.row.feeType)}}
                    </div>
                    <div v-else-if="header.prop == 'type'">
                      {{getDictsKeyName(scope.row,'PROJECT_BILL_TYPE',scope.row.type)}}
                    </div><div v-else-if="header.prop == 'costType'">
                      {{getDictsKeyName(scope.row,'PROJECT_COST_BILL_TYPE',scope.row.costType)}}
                    </div>
                    <div v-else>{{scope.row[header.prop]}}</div>
                </template>
                </el-table-column>
        </template>
        <!-- <el-table-column label="操作" width="150">
        <template slot-scope="scope">
           <el-button type="primary"  size="mini"   @click="addFinance('edit',scope.row)">编辑</el-button>
           <el-button type="primary"  size="mini"   @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
      </el-table>
       <!-- 分页 -->
      <!-- <el-row type="flex" class="page-box" justify="end">
     
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row> -->
   </div>
</template>

<script>
import Api from "@/api/index"
import Util from '@/utils/index'
export default {
  data() {
    return {
      listData:[],
     total:0,
       query:{
         pageSize:10,
         pageNum:1,
         relationId:'',
       },
       tableHeader: [
        {
          prop: "name",
          label: "费用名称",
          show: true
        },
        {
          prop: "costType",
          label: "收支类型",
          show: true
        },{
          prop: "type",
          label: "记录方式",
          show: true
        },{
          prop: "ctUName",
          label: "记录人",
          show: true
        },{
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
          label: "人民币",
          show: true
        }, {
          prop: "unitPrice",
          label: "单价",
          show: true
        }, {
          prop: "num",
          label: "数量",
          show: true
        }, {
          prop: "amount",
          label: "外币",
          show: true
        },
        {
          prop: "createDt",
          label: "操作时间",
          show: true
        },     
        {
          prop: "remarks",
          label: "备注",
          show: true
        },
      ],
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
    handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
    loadData(){
      let params = this.query;
      params.projectCode = this.$route.query.id
      params.status = '1'
      Api.getProjectBalancePage(params).then(res=>{
        this.listData = res;
          // this.listData = res.result;
            this.total = res.total
      })
    },
    
  }
};
</script>
