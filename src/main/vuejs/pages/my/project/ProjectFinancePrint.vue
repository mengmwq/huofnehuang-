<template>
  <div v-if="form">
    <h2 class="text-center">项目收支表</h2>
    <table class="printTable" v-if="form">
      <tr>
        <th>项目名称：</th>
        <td>{{form.projectName}}</td>
      </tr>
      <tr>
        <th>客户名称：</th>
        <td>{{form.customerName}}</td>
      </tr>
      <tr>
        <th>项目编号：</th>
        <td>{{form.projectCode}}</td>
      </tr>
      <tr>
        <th>销售代表：</th>
        <td>{{form.salesman}}</td>
      </tr>
    </table>
    <table class="printTable mt20">
        <thead>
            <tr>
                <th v-for="(header, index) in tableHeader" :key="index">{{header.label}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
               <td>{{index+1}}</td>
               <td>{{index+1}}</td>
               <td>{{index+1}}</td>
               <td>{{index+1}}</td>
               <td>{{index+1}}</td>
               <td>{{index+1}}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>合计：</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tfoot>
    </table>
    
  </div>
</template>

<script>
import Api from "@/api/index";

export default {
  name: "PaymentPrint",
  // 制作打印模版组件时，props区域尽量保留。

  props: {
    // 查询条件
    searchQuery: {
      type: Object
    },
    //申请详情表单
    form: {
      type: Object
    },
    tableData:{
        type:Array,
        default(){
            return []
        },
    },
    // 每页多少行
    onePageRow: {
      type: Number,
      default: 10
    },
    // 是否插入空白行
    blankLines: {
      type: Boolean,
      default: true
    },

    getChineseNumber: Function // 求数字的中文写法，从easyPrint组件传入
  },

  data() {
    return {
      tableHeader: [
          {
          prop: "id",
          label: "序号",
          show: true
        },
        {
          prop: "id",
          label: "应收金额",
          align: "right",
          show: true
        },
        {
          prop: "applyName",
          align: "right",
          label: "已收金额",
         
          //fixed: "left",
          show: true
        },
        {
          prop: "customerName",
          label: "支出名称",
          align: "center",
        
          show: true
        },
        {
          prop: "approvalState",
          label: "收款代理",
          align: "center",
         
          show: true
        },
        {
          prop: "receiptInfo",
          label: "支出金额",
          align: "right",
        
          show: true
        },
        {
          prop: "rate",
          label: "毛利润",
          align: "right",
          show: true
        }
      ],
      /** 表格数据 */
      listData: [],

      /** 表格 loading */
      listLoading: false
    };
  },
  mounted() {
    console.log(this.fileList, "fff");
    //this.loadData()
  },

  computed: {
    pages() {
      // 求当前数据能打印的页数
      var pages_ = Math.ceil(this.tableData.detail.length / this.onePageRow); // 向上取整数
      return pages_ <= 0 ? 1 : pages_;
    },
    chineseTotal() {
      // 计算中文合计，如果忘记传入
      return this.getChineseNumber != null
        ? this.getChineseNumber(this.tableData.total_amount)
        : "您还没有传入getChineseNumber";
    }
  },

  methods: {
    loadData() {
      Api.approvalDetailWithStep({ id: this.id }).then(data => {
        if (data) {
          this.info = data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.printTitle {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .right,
  .center {
    display: flex;
    flex-direction: column;
  }
}
.printTable,
.subTable {
  border-collapse: collapse;
  width: 100%;
  th,
  td {
    border: 1px solid #ccc;
    padding: 5px;
    height: 30px;
  }
  .approvalItem {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .left {
      display: flex;
      flex-direction: column;
    }
  }
}
.subTable td {
  text-align: center;
}
</style>
