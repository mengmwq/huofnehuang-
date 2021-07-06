<template>
  <div class="approvalBox">
    <div class="title">审批情况</div>
    <div class="pd20" v-if="approvalInfo">
      <el-row type="flex" justify="start">
        <el-col :span="4">
          <div>
            <label for>进度：</label>
            <strong :class="{'text-danger':total.rejectCount>0}">{{approvalInfo.schedule}}</strong>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <label for>同意：</label>
            <strong class="text-success">{{total.agreeCount}}</strong>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <label for>驳回：</label>
            <strong class="text-danger">{{total.rejectCount}}</strong>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <label for>等待：</label>
            <strong>{{total.waitCount}}</strong>
          </div>
        </el-col>
      </el-row>
      <el-table
        class="page-table mt10"
        :data="approvalProgress"
        stripe
        highlight-current-row
        :cell-style="{color:'#333'}"
      >
        <el-table-column type="index" min-width="60" label="序号"></el-table-column>
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
              <div v-if="header.prop == 'states'">
                <span
                  :class="{'text-success':scope.row.states===1,'text-danger':scope.row.states===2}"
                >{{scope.row.attached.VERIFY_STATES_cnInfo}}</span>
              </div>
              <div v-else-if="header.prop == 'reason'">
                {{scope.row.reason}}
                <!-- {{scope.row.states==2?scope.row.reason:''}} -->
              </div>
              <div v-else>{{scope.row[header.prop]}}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
          <div class="tar mt10">
            <el-button type="primary" @click="$router.go(-1)">返回</el-button>
        </div>
    </div>

  </div>
</template>
<script>
import Api from "@/api/index";
export default {
  components: {},
  props: {
    approvalInfoId: {
      type: String
    },
    approvalInfo: {
      type: Object
    }
  },
  data() {
    const userInfo = JSON.parse(sessionStorage.getItem("jwt"));
    return {
      userInfo: userInfo,
      dataInfo: [],
      total: {
        agreeCount:0,
        rejectCount: 0,
        waitCount: 0
      },
      approvalProgress: [],
      tableHeader: [
        {
          prop: "approverName",
          label: "审批人",
          width: "70",
          show: true
        },
        {
          prop: "states",
          label: "审核状态",
          width: "70",
          show: true
        },
        {
          prop: "reason",
          label: "驳回原因",
          width: "70",
          show: true
        }
      ]
    };
  },
  mounted() {
    this.getApprovalProcessList();
  },
  methods: {
    getApprovalProcessList() {
      const path = this.$route.path;
      const targetId = this.$route.query.targetId;
      let params = {
        userId: this.userInfo.id,
        targetId: targetId
      };

      if (targetId) {
        //pageFlag
        const fn =
          path === "/router/approvalProductDetails" ||
          path === "/router/approvalActivityDetails"
            ? "getApprovalProcessList"
            : "getPlanApprovalProcessList";
        Api[fn](params).then(res => {
          this.total.agreeCount = res.filter(item=>item.states==1).length
            this.total.rejectCount = res.filter(item=>item.states==0).length
            this.total.waitCount = res.filter(item=>item.states==2).length
          if (res.length > 0) {
            this.tableHeader[0].label =
              res[0].groupType === 2 ? "审批人" : "博物馆名称";
          }

          this.approvalProgress = res;
          console.log(this.approvalProgress);
        });
      }
    }
  }
};
</script>