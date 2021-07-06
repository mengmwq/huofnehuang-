 <template>
  <div>
    <el-row class="mb10">
      <el-col :span="24" class="text-right">
        时间范围：<el-date-picker
          v-model="query.startTime"
          clearable
          type="date"
          size="medium"
          style="width: 150px"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择开始日期"
        >
        </el-date-picker>
        至
        <el-date-picker
          v-model="query.endTime"
          clearable
          type="date"
          style="width: 150px"
          value-format="yyyy-MM-dd"
          size="medium"
          format="yyyy-MM-dd"
          placeholder="选择结束日期"
        >
        </el-date-picker>
        <el-select
          v-model="query.status"
          clearable
          placeholder="结案状态"
          size="medium"
          @change="loadData"
          style="width: 150px"
        >
          <el-option
            v-for="(item, index) in closingCaseStatusList"
            :key="index"
            :label="item.cnInfo"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="query.customsNo"
          clearable
          size="medium"
          prefix-icon="el-icon-search"
          placeholder="报关单号"
          style="width: 200px"
          :maxlength="50"
        ></el-input>
        <el-input
          v-model="query.projectCode"
          clearable
          size="medium"
          prefix-icon="el-icon-search"
          placeholder="项目编号"
          style="width: 200px"
          :maxlength="50"
        ></el-input>
        <el-button type="primary" size="medium" @click="loadData"
          >查询
        </el-button>
      </el-col>
    </el-row>
    <el-table
      class="page-table"
      v-if="listPage"
      :data="listPage.result"
      highlight-current-row
      v-loading="listLoading"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- <el-table-column type="selection" width="55" :selectable='canSelected'></el-table-column> -->
      <template v-for="(header, index) in tableHeader">
        <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :min-width="header.width"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="header.prop == 'projectName'">
              <router-link
                :to="{
                  path: '/router/projectDetail',
                  query: { id: scope.row.projectCode },
                }"
                >{{ scope.row.projectName }}</router-link
              >
            </div>

            <div v-else-if="header.prop == 'projectCode'">
              <router-link
                :to="{
                  path: '/router/projectDetail',
                  query: {
                    id: scope.row.projectCode,
                    projectType: scope.row.projectType,
                    stateId: scope.row.stateId,
                  },
                }"
                >{{ scope.row.projectCode }}</router-link
              >
            </div>
            <div v-else-if="header.prop == 'customsNo'">
              <router-link
                :to="{
                  path: '/router/addCustoms',
                  query: { id: scope.row.customsManageId },
                }"
              >
                {{ scope.row.customsNo }}
              </router-link>
            </div>
            <div v-else-if="header.prop == 'startDt'">
              {{ scope.row.startDt | DateFormat }}
            </div>
            <div v-else-if="header.prop == 'endDt'">
              {{ scope.row.endDt | DateFormat }}
            </div>
            <div v-else-if="header.prop == 'status'">
              <span v-if="scope.row.status === '0'">未结案</span>
              <span v-if="scope.row.status === '1'">已结案</span>
            </div>
            <div v-else>{{ scope.row[header.prop] }}</div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-if="scope.row.status === '0'"
            @click="closeCase(scope.row)"
            >结案</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <el-pagination
        background
        @size-change="handleSizeChange"
        :total="listPage.totalCount"
        @current-change="handleCurrentChange"
        layout="total,sizes, ->,prev, pager, next"
        :page-sizes="[10, 25, 50]"
        :page-size="query.pageSize"
      >
      </el-pagination>
      <el-button type="primary" size="mini" @click="exportExcel"
        >导出Excel</el-button
      >
    </el-row>
  </div>
</template>
<script>
import Api from "@/api/index";
import Util from "@/utils/";
export default {
  name: "GuaranteeFreeList",
  computed: {
    //结案状态
    closingCaseStatusList() {
      return this.$store.state.dictionary.dists.ClosingCaseStatus.children;
    },
  },
  data() {
    return {
      dialogVisible: false,
      projectCode: "",
      projectType: "",
      isShowStorageEmptyDialog: false, // 可用位置弹窗
      isShowDialog: false, // 移库弹窗
      listLoading: false,
      sels: [],
      stockInfo: {},
      editForm: null,
      query: {
        startTime: null,
        endTime: null,
        projectCode: "",
        customsNo: "",
        pageNum: 1,
        pageSize: 10,
      },
      listData: [],
      listPage: {
        result: [],
        totalCount: 0,
      },
      total: 0,
      tableHeader: [
        {
          prop: "customsNo",
          label: "报关单号",
          align: "center",
          show: true,
        },
        {
          prop: "projectCode",
          label: "项目编号",
          width: "140",
          show: true,
        },
        {
          prop: "projectName",
          label: "项目名称",
          width: "120",
          show: true,
        },
        {
          prop: "customerName",
          label: "客户名称",
          width: "120",
          show: true,
        },
        {
          prop: "goodsValue",
          label: "货值总金额",
          width: "120",
          show: true,
        },
        {
          prop: "guaranteeNo",
          label: "保函序号",
          width: "120",
          show: true,
        },
        {
          prop: "startDt",
          label: "申报日期",
          width: "90",
          show: true,
        },
        {
          prop: "endDt",
          label: "到期时间",
          width: "90",
          show: true,
        },
        {
          prop: "status",
          label: "状态",
          width: "90",
          show: true,
        },
        {
          prop: "remarks",
          label: "备注",
          width: "90",
          show: true,
        },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    //警示提醒 一个月 红色行，二个月 黄色行
    tableRowClassName({ row, rowIndex }) {
      const curTime = new Date().getTime();
      const nTime = row.endDt - curTime;
      if (nTime > 0 && row.status === "0") {
        const day = Math.floor(nTime / 86400000);
        console.log(rowIndex, day);
        if (day > 30 && day <= 60) {
          return "warning-yellow-row";
        } else if (day <= 30) {
          return "warning-red-row";
        }
      } else if (row.status === "0") {
        return "warning-red-row";
      }
      return "";
    },
    //结案操作
    closeCase(row) {
      const customsNo = row.customsNo;
      this.$confirm(`此操作将报关单号【${customsNo}】结案, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = {
            id: row.id,
          };
          Api.updateExemption(params).then((res) => {
            this.$notify({
              title: "提示",
              type: "success",
              message: "结案操作成功!",
            });
            this.loadData();
          });
        })
        .catch(() => {
          this.$notify({
            title: "提示",
            type: "info",
            message: "已取消结案操作！",
          });
        });
    },
    //显示浮窗并赋值参数
    showGoodsDetails(row) {
      this.projectCode = row.projectCode;
      this.projectType = row.projectType;
      this.dialogVisible = true;
    },
    //关闭货物详情窗口；
    handleClose() {
      this.dialogVisible = false;
      this.loadData();
    },
    /**
     * 加载库存清单列表
     * */
    loadData(pageNum = 1) {
      if (typeof pageNum == "object") {
        this.query.pageNum = 1;
      } else {
        this.query.pageNum = pageNum;
      }
      Api.getExemptionPage(this.query).then((res) => {
        if (res) {
          this.listPage = res;
        }
      });
    },

    /***
     * 表头切换
     */
    columnChange(data) {
      this.tableHeader = data;
    },

    handleSelectionChange(sels) {
      this.sels = sels;
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.loadData(val);
    },
    columnChange(data) {
      this.tableHeader = data;
    },
    /** 表格排序变化 */
    sortChange({ column, prop, order }) {
      if (order) {
        var s = order.substring(0, 1);
        var sOrder = "asc";
        if (s == "d") {
          sOrder = "desc";
        }
        this.query.tableOrder = prop + " " + sOrder;
        this.query.pageNum = 1;
        this.loadData();
      }
    },
    refresh() {
      this.loadData();
    },
    /** 移库 */
    moveStorage(row) {
      this.stockInfo = row;
      this.isShowDialog = true;
    },
    canSelected(row, index) {
      if (row.jobState === "TCQX" || row.jobState === "MDPB") {
        return 0;
      } else {
        return 1;
      }
    },
    /**
     * 导出excel
     */
    exportExcel() {
      if (this.listPage.result.length > 0) {
        const params = this.query;
        Api.exemptionListExport(params)
          .then((res) => {
            // let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
            let blob = new Blob([res], { type: "application/vnd.ms-excel;" });
            const fileName = "免担保.xls";
            Util.downFile(blob, fileName);
          })
          .catch((err) => {
            this.$notify({
              title: "提示",
              message: "数据导出异常，请联系相关管理员！",
              type: "error",
            });
          });
      }
    },
    /**
     * 关闭浮窗
     */
    closeDialog: function () {
      this.isShowStorageEmptyDialog = false;
      this.isShowDialog = false;
      this.loadData();
    },
  },
};
</script>
