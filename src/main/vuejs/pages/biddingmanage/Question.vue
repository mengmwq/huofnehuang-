<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="12">
          <el-button type="primary" size="small" @click="editItem('add')" class="btnTop">新增</el-button>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-input
          size="small"
          clearable
          placeholder="标题"
          icon="search"
          prefix-icon="el-icon-search"
          v-model="query.searchStr"
          @keyup.enter.native="loadData"
          style="width: 200px;"
        ></el-input>
        <el-button type="primary" size="small" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table
      class="page-table"
      :data="listData"
      stripe
      highlight-current-row
      v-loading="listLoading"
      :cell-style="{color:'#333'}"
    >
      <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
      <template  v-for="(header, index) in tableHeader">
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
            <div v-if="header.prop == 'applyDate'">{{scope.row.applyDate | timeFormat}}</div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editItem('edit',scope.row)">编辑</el-button>
          <el-button type="primary" size="small" @click="deleteItem(scope.row)">删除</el-button>
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
        :total="total"
      ></el-pagination>
      <!-- <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button> -->
    </el-row>
     <QuestionAdd v-if="isShowDialog"
        :isShowDialog="isShowDialog"
        :editForm="form"
        @closeDialog="closeDialog"
        @changeDialog="changeDialog"
    ></QuestionAdd>
  </div>
</template>


<script>
import Api from "@/api/index";
import {Attention} from '@/model/Attention'
import QuestionAdd from './QuestionAdd'
export default {
  name: "Question",
  components:{
    QuestionAdd,
  },
  data() {
    const bidId = this.$route.query.id
    return {
      isShowDialog: false,
      form: {
        title:'',
        content:'',
        remarks:''
      },
      query: {
        pageSize: 10,
        pageNum: 1,
        searchStr: "",
        bidId:bidId,
      },
      tableHeader: [
        {
          prop: "title",
          align: "center",
          label: "标题",
          width: "130",
          show: true
        },
        {
          prop: "content",
          align: "center",
          label: "内容",
          width: "150",
          show: true
        },
        {
          prop: "remarks",
          align: "center",
          label: "备注",
          show: true
        }
      ],
      /** 表格数据 */
      listData: [],
      projectCode: "",
      id: "",
      tag: "bid",
      /** 总数据数 */
      total: 0,
      /** 表格 loading */
      listLoading: false
    };
  },
  mounted() {
    const query = this.$route.query;
    this.id = query.id;
    this.projectCode = query.projectCode;

    this.loadData();
  },
  methods: {
    changeDialog(){
        this.closeDialog()
        this.loadData()
      },
      closeDialog(){
        this.isShowDialog = false
      },
    //删除功能
    deleteItem(row){
        this.$confirm(`您确定要删除标题【${row.title}】的记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
              id:row.id
          }
          Api.removeByIdQuestion(params).then(res=>{
              this.$notify.success({
                    title: '提示',
                    message: `【${row.title}】删除成功`
                })
                this.loadData()
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: `【${row.title}】删除成功失败`
          })
        })
    },
    //添加与编辑注意事项
    editItem(flag,row){
        if(flag=='add'){
            this.form =  {
              title:'',
              content:'',
              remarks:''
            }
        }else if(flag=='edit'){
            this.form = JSON.parse(JSON.stringify(row))
        }
        this.isShowDialog = true;
    },
    /** 序号 */
    indexMethod(index) {
      return index + (this.query.pageNum - 1) * this.query.pageSize + 1;
    },
    /**
     * 加载
     */
    loadData() {
      this.listLoading = true;
      this.query.contractTargetId = this.$route.query.id;

      Api.queryBidMnaQuestion(this.query).then(res => {
        if (res) {
          this.listData = res.records;
          this.total = res.total;
        }
        this.listLoading = false;
      });
    },
    addBYInfo() {
      this.$router.push({ path: "" });
    },
    columnChange(data) {
      this.tableHeader = data;
    },
    tableStatusChange(val) {
      this.tableStatus = val;
    },
    formartDate(value) {
      let times = "";
      if (value) {
        times = moment(value).format("YYYY-MM-DD HH:mm:ss");
      }
      return times;
    },
    /**
     * 重置筛选条件
     * */
    cleanFilters() {
      this.query.searchStr = "";
      this.query.pageNum = 1;
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
          item.contractState = filters.contractStateFilter(item.contractState);
        });
        let param = {
          tableHead: this.tableHeader,
          data: this.listData
        };
        Api.downloadExcel(param).then(res => {
          if (res) {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = e => {
              let a = document.createElement("a");
              a.download = "往来账务列表数据.xlsx";
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
