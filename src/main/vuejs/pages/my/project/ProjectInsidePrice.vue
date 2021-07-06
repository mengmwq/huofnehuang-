<template>
  <!--添加货物-->
  <el-dialog title="生成内部报价" :before-close="closeDialog" :visible.sync="isShowDialog" width="60%">
    <el-row>
       <el-col class="text-right">
          <strong>报价币种：</strong>
           <span>{{offCurrencyName}}</span>
       </el-col>
    </el-row>
    <el-table
      class="page-table mb10"
      :data="selectedPriceTable"
      stripe
      highlight-current-row
      show-summary
      :summary-method="getSummaries"
      :cell-style="{color:'#333'}"
    >
      <template v-for="(header, index) in tableHeader">
        <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :align="header.align"
          :sortable="header.sortable"
          :min-width="header.width"
          :fixed="header.fixed"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
        <div v-if="header.prop == 'rate'" >
                 <el-input-number
              v-model.trim="scope.row.rate"
              style="width:150px;"
              :min="0"
              :max="20"
              :maxlength="6"
              @change="rateChange(scope.row)"
            ></el-input-number>
              </div>
              <div v-else-if="header.prop == 'company'">
              {{scope.row.company | currencyFilter}}
            </div>
              <div v-else-if="header.prop == 'ratePrice'" >
                 {{parseFloat(scope.row.price * scope.row.rate).toFixed(2)}}
              </div>
             <div v-else>{{scope.row[header.prop]}}</div>
         </template>
        </el-table-column>
      </template>
    </el-table>
    
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确 认</el-button>
        <el-button type="default" size="small" @click="closeDialog('editForm')">取 消</el-button>
      </div>
    
  </el-dialog>
</template>
<script>
import Api from "@/api/index";

export default {
  name: "ProjectInsidePrice",
  components: {},
  props: {
    offCurrencyName: {
      type: String
    },
    selectedPriceTable: {
      type: Array
    },
    isShowDialog: {
      type: Boolean
    }
  },
  data: function() {
    return {
      tableHeader: [{
          prop: 'code',
          label: '预算编号',
          align: 'left',
          show: true
        }, {
          prop: 'name',
          label: '成本名称',
          align: 'center',
          show: true
        },{
          prop: 'price',
          label: '成本报价',
          align: 'right',
          show: true
        },{
          prop: 'company',
          label: '成本币种',
          align: 'center',
          
          show: true
        },{
          prop: 'rate',
          label: '汇率',
          align: 'center',
          width:'180',
          show: true
        },{
          prop: 'ratePrice',
          label: '兑换报价',
          align: 'right',
          show: true
        }],
     
      editForm: {
        cargoMovingCode: "",
        applicationForm: "",
        entryId: "",
        businessSheet: ""
      },
      rules: {
        cargoMovingCode: [
          { required: true, message: "请输入出入库单号", trigger: "blur" }
        ],
        applicationForm: [
          { required: true, message: "请输入申请单号", trigger: "blur" }
        ],
        entryId: [{ required: true, message: "请输入金二核注清单号", trigger: "blur" }],
        
      }
    };
  },
  computed: {},
  mounted() {
   
  },
  methods: {
    rateChange(row){
      row.ratePrice = parseFloat(row.price * row.rate).toFixed(2)
       this.getSummaries()
       
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if ( column.property && !values.every(value => isNaN(value)) && column.property=='price'|| column.property=='ratePrice' ) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           
            sums[index] =parseFloat(sums[index]).toFixed(2)
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
    handleGoodsCount(){
       const goodsInfo  = JSON.parse(JSON.stringify(this.goodsInfo))
       const editForm = this.editForm
       goodsInfo.map(item=>{
          delete item.attached
          item.cargoMovingCode=editForm.cargoMovingCode
          item.applicationForm=editForm.applicationForm
          item.entryId=editForm.entryId
          item.businessSheet=editForm.businessSheet
          if(item.inStorageNumber){
              item.initialNumber = item.inStorageNumber
          }
          return item;
       })
       return goodsInfo
    },
    /**
     * 提交
     */
    confirm(formName) {
        const rate = this.selectedPriceTable.some(item=>!item.rate)
        if(rate){
          this.$notify({
            title:'提示',
             type:'warning',
             message:'请正确输入成本汇率！',
          })
           return;
        }
        this.$emit('changeDialog',this.selectedPriceTable)
    },
  
    /**
     * 关闭浮窗
     */
    closeDialog: function(formName) {
      this.$emit("closeDialog");
    }
  }
};
</script>
