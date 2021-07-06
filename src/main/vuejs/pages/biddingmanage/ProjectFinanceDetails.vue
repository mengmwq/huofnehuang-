<template>
  <div>
      <div>
        <h2 class="text-center">项目收支表</h2>
        <table class="financeTable">
           <tbody>
              <tr>
                 <th>项目名称：</th>
                 <td>{{form? form.projectName:''}}</td>
              </tr>
              <tr>
                 <th>客户名称：</th>
                 <td>{{form? form.customerName:''}}</td>
              </tr>
              <tr>
                 <th>项目编号：</th>
                 <td>{{form?form.projectCode:''}}</td>
              </tr>
              <tr>
                 <th>销售代表：</th>
                 <td>{{form?form.salesman:''}}</td>
              </tr>
              <tr>
                 <th>录入人员：</th>
                 <td>{{form?form.ctUName:''}}</td>
              </tr>
           </tbody>
        </table>
      </div>
      <table class="financeTable" v-if="listPage">
         <thead>
            <tr style="background:#eee;">
              <th class="borderRight"></th>
              <th colspan="5" class="borderRight">收入项</th>
              <th colspan="3" class="borderRight">支出项</th>
              <th colspan="2" >毛利</th>
            </tr>
            <tr style="background:#eee;">
              <th class="borderRight">序号</th>
              <th v-for="(item,index) in tableHeader" :key="index" :class="{'borderRight':index==4 || index==7}">
                {{item.label}}
              </th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="(item,index) in tableRow" :key="index"> 
             <td class="borderRight">{{index+1}}</td>
             <td>
              <span v-if="listPage.receivable[index]">{{listPage.receivable[index].amountName}}</span>
             </td>
             <td>
              <span v-if="listPage.receivable[index]">{{listPage.receivable[index].amount}}</span>
             </td>
             <td>
              <span v-if="listPage.accepted[index]">{{listPage.accepted[index].amountName}}</span>
             </td>
             <td>
              <span v-if="listPage.accepted[index]">{{listPage.accepted[index].amount}}</span>
             </td>
             <td class="borderRight">
             </td>
             <td>
              <span v-if="listPage.expenditure[index]">{{listPage.expenditure[index].amountName}}</span>
             </td>
             <td>
              <span v-if="listPage.expenditure[index]">{{listPage.expenditure[index].receiver}}</span>
             </td>
             <td class="borderRight">
              <span v-if="listPage.expenditure[index]">{{listPage.expenditure[index].amount}}</span>
             </td>
             <td></td>
             <td></td>
            </tr>
         </tbody>
         <tfoot>
            <tr>
              <th class="borderRight">合计</th>
              <td></td>
              <td>{{listPage.receivableTotal}}</td>
              <td></td>
              <td>{{listPage.acceptedTotal}}</td>
              <td class="borderRight">{{listPage.receivableTotal-listPage.acceptedTotal}}</td>
              <td></td>
              <td></td>
              <td class="borderRight">{{listPage.expenditureTotal}}</td>
              <td>{{listPage.grossProfit}}</td>
              <td>
                <template v-if="listPage.grossProfit && listPage.receivableTotal">
                    {{((listPage.grossProfit/listPage.receivableTotal)*100).toFixed(2)}}%
                </template>
                <template v-if="listPage.grossProfit==0 || listPage.receivableTotal==0">
                  0
                </template>
              </td>
            </tr>
         </tfoot>
      </table>
  </div>
</template>

<script>
import moment from "moment";
import vueEasyPrint from "vue-easy-print";
import Api from "@/api/index";
import * as filters from "@/filters/filter";
export default {
  data() {
    return {
      
      tableHeader: [
        {
          prop: "id",
          label: "费用名称",
          align:'right',
          show: true
        },
        {
          prop: "id",
          label: "应收/合同金额",
          align:'right',
          show: true
        },
        {
          prop: "applyName",
          align:'right',
          label: "进账单位名称",
          //fixed: "left",
          show: true
        },
        {
          prop: "applyName",
          align:'right',
          label: "已收金额",
          //fixed: "left",
          show: true
        },
        {
          prop: "uncollectedAmount",
          align:'right',
          label: "合同未收金额",
          //fixed: "left",
          show: true
        },
        {
          prop: "customerName",
          label: "费用名称",
          align:'center',
          show: true
        },
        {
          prop: "approvalState",
          label: "收款方",
           align:'center',
          show: true
        },
        {
          prop: "receiptInfo",
          label: "支出金额",
          align:'right',
          show: true
        },
        {
          prop: "rate",
          label: "毛利润",
          align:'right',
          show: true
        },
        {
          prop: "profitRate",
          label: "利润率",
          align:'right',
          show: true
        },
      ],
       listPage:null,
       tableRow:0,
      /** 表格数据 */
      listData:[],
      multipleSelection: [],
      /** 总数据数 */
      total: 0,
      /** 表格 loading */
      listLoading: false,
      isShowPrint:false,
    };
  },
  mounted() {
    this.loadData()
  },
  printTable(){
    this.isShowPrint = true;
    this.$nextTick(()=>{
       this.$refs.easyPrint.print()
     })
  },
  props: {
      form:Object,
    },
    watch: {
      form: function (value) {
      	if(this.form){
        	this.form = value
        }
      }
    },
  methods: {
    /**
     * 加载
     */
      loadData() {
        this.listLoading = true;
        this.$route.query.id
        const params = {
          relationId: this.$route.query.id
        }
        Api.getProjectBalanceTotal(params).then(res => {
          if (res) {
            this.listPage = res;
            if((res.receivable.length >= res.expenditure.length + res.accepted.length) ||(
            res.receivable.length >= res.expenditure.length && res.receivable.length >= res.accepted.length)){
              this.tableRow = res.receivable.length
            }else if(res.expenditure.length >= res.receivable.length + res.accepted.length||(
            res.expenditure.length >= res.receivable.length && res.expenditure.length >= res.accepted.length)){
              this.tableRow = res.expenditure.length
            }else if(res.accepted.length >= res.receivable.length + res.expenditure.length){
              this.tableRow = res.accepted.length
            }
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
    /**
     * 导出excel
     */
    exportExcel() {
      if (this.listData.length > 0) {
        let data = this.listData;
        data.forEach(function(item) {
          item.approvalState = filters.approvalStateFilter(item.approvalState);
        });
        let param = {
          tableHead: this.tableHeader,
          data: this.listData
        };
        // debugger
        Api.downloadExcel(param).then(res => {
          if (res) {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = e => {
              let a = document.createElement("a");
              a.download = "列表数据.xlsx";
              a.href = e.target.result;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };
          }
        });
      }
    }
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
     th.borderRight,
     td.borderRight{
       border-right:1px solid red!important;
     }
  }
</style>