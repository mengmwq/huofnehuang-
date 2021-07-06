<template>
  <div id="homePage">
    <div class="myInfo">
      <div class="baseInfo">
        <div class="left">
          <img v-if="imageUrl" :src="imageUrl" alt />
          <p v-else>暂无头像</p>
        </div>
        <div class="right">
          <div class="infoList">
            <h3>{{userInfo.uName}}</h3>
            <ul>
              <li>工号：{{userInfo.uCode}}</li>
              <li class="liOption">
                <span>公司：{{userInfo.orgName}}</span>
                <span>入职时间：{{userInfo.entryDate| timeFormatBid}}</span>
              </li>
              <li class="liOption">
                <span>部门：{{userInfo.depName}} </span>
                <span>职务：{{userInfo.positionName}}</span>
              </li>
            </ul>
          </div>
          <div class="tar mt10">
            <!-- <router-link :to="{path:'/router/employeeFiles'}"  class="text-danger">
            <i class="el-icon-caret-right"></i>
              <span>查看员工档案</span>
            </router-link>-->
            <a href="javascript:;" class="text-danger ml10" @click="showSalarySlip">
              <i class="el-icon-caret-right"></i>
              <span>查看工资条</span>
            </a>
          </div>
        </div>
      </div>
      <div class="holiday">
        <div class="left">
          <div class="yearHoliday">
            <div class="top">年假</div>
            <div class="bottom">
              <span>已请：{{holiday.usedYearDays}}天</span>
              <span>剩余：{{holiday.noUsedYearDays}}天</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="holidayList">
            <!-- <h3 class="text-danger">过期：{{holiday.expirationDate}}</h3> -->
            <ul>
              <li>
                <strong>{{holiday.matterDays}}</strong>
                <span>事假</span>
              </li>
              <li>
                <strong>{{holiday.marriageDays}}</strong>
                <span>婚假</span>
              </li>
              <li>
                <strong>{{holiday.sickLeaveDays}}</strong>
                <span>病假</span>
              </li>
              <li>
                <strong>{{holiday.funeralLeaveDays}}</strong>
                <span>丧假</span>
              </li>
            </ul>
          </div>
          <div class="tar mt10">
            <a href="javascript:;" class="text-danger">
              <i class="el-icon-caret-right"></i>
              <span>查看请假记录</span>
            </a>
          </div>
        </div>
      </div>
      <div class="notify">
        <div class="pd10">
          <el-table
            class="page-table"
            :data="notifyPage && notifyPage.records"
            stripe
            highlight-current-row
            :cell-style="{color:'#333',fontSize:'12px'}"
            :show-header="isShowHeader"
          >
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
                  <div v-if="header.prop == 'title'">
                    <a
                      href="javascript:;"
                      class="aStyle"
                      @click="showNoticeInfo(scope.row)"
                    >{{scope.row.title}}</a>
                  </div>
                  <div v-else-if="header.prop == 'createDt'">{{scope.row.createDt | timeFormat}}</div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <!-- <ul class="notifyUl">
            <li v-for="(item, index) in notifyPage.records" :key="index">
              <span>{{item.createDt | timeFormat}}</span>
              <span>{{item.title}}</span>
              <span>{{item.orgName}}</span>
            </li>
          </ul>-->
          <div class="tar mt10" v-if="notifyPage.total>4">
            <a href="javascript:;" class="text-danger" @click="moreNotify">
              <i class="el-icon-caret-right"></i>
              <span>更多公告</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="approvalInfo mt10">
      <div v-for="(item, index) in approvalInfo" :key="index" :class="'item '+item.className" @click="goApproval">
        <i :class="'iconfont '+item.icon"></i>
        <strong>{{item.name}}</strong>
        <span>{{item.count}}</span>
      </div>
    </div>-->
    <div class="mt10">
      <div class="sys-title">审批快速入口</div>
      <div class="pd20 approvalEnter">
        <div class="waitApproval">
          <div
            v-for="(item, index) in approvalInfo"
            :key="index"
            :class="'item '+item.className"
            @click="goApproval"
          >
            <div class="left">
              <i :class="'iconfont '+item.icon"></i>
            </div>
            <div class="right">
              <!-- <span>{{item.count}}</span> -->
              <strong>{{item.name}}</strong>
            </div>
          </div>
        </div>
        <div class="detailsBox">
          <dl class="details">
            <dt>人事行政</dt>
            <dd>
              <div class="left">
                <i class="el-icon-arrow-left"></i>
                <div class="detailItem">
                  <div class="item" v-for="(item, index) in personnelInfo" :key="index">
                    <i class="iconfont icon-file"></i>
                    <strong>{{item.name}}</strong>
                    <!-- <span>{{item.count}}</span> -->
                  </div>
                </div>
              </div>
              <div class="right">
                <i class="el-icon-arrow-right"></i>
              </div>
            </dd>
          </dl>
          <dl class="details">
            <dt>财务</dt>
            <dd>
              <div class="left">
                <i class="el-icon-arrow-left"></i>
                <div class="detailItem">
                  <div class="item" v-for="(item, index) in financeInfo" :key="index">
                    <i class="iconfont icon-file"></i>
                    <strong>{{item.name}}</strong>
                    <!-- <span>{{item.count}}</span> -->
                  </div>
                </div>
              </div>
              <div class="right">
                <i class="el-icon-arrow-right"></i>
              </div>
            </dd>
          </dl>
          <dl class="details">
            <dt>市场业务</dt>
            <dd>
              <div class="left">
                <i class="el-icon-arrow-left"></i>
                <div class="detailItem">
                  <div class="item" v-for="(item, index) in bussinessInfo" :key="index">
                    <i class="iconfont icon-file"></i>
                    <strong>{{item.name}}</strong>
                    <!-- <span>{{item.count}}</span> -->
                  </div>
                </div>
              </div>
              <div class="right">
                <i class="el-icon-arrow-right"></i>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="mt10">
      <div class="sys-title">项目概况</div>
      <div class="projectInfo">
        <div v-for="(item, index) in projectInfo" :key="index" :class="'item '+item.className">
          <i :class="'iconfont '+item.icon"></i>
          <div class="right">
            <div class="top">{{item.count}}</div>
            <div class="bottom">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt10">
      <div class="sys-title">任务概况</div>
      <div class="pd20 white">
        <div class="taskInfo">
          <div v-for="(item, index) in taskInfo" :key="index" :class="'item '+item.className">
            <div class="top">{{item.count}}</div>
            <div class="bottom">{{item.name}}</div>
          </div>
        </div>
        <div class="taskList mt20">
          <div class="taskItem" v-for="(item,index) in statusList" :key="index">
            <div class="taskTitle">
              <span>{{item.cnInfo}}：</span>
              <strong v-if="taskPage.taskNumberMap">{{taskPage.taskNumberMap[item.value]}}</strong>
            </div>
            <div class="taskBody">
              <template v-if="taskPage.taskMap[item.value].length>0">
                <div
                  class="taskContent"
                  @dblclick="showTaskDetails(sItem)"
                  v-for="sItem in taskPage.taskMap[item.value]"
                  :key="sItem.taskCode"
                >
                  <div class="header">
                    <label>
                      <i class="dot"></i>
                      <span>{{sItem.taskCode}}</span>
                    </label>
                    <!-- <span>{{sItem.attached.TaskType_cnInfo}}</span> -->
                  </div>
                  <div class="content">
                    <p>{{sItem.taskName}}</p>
                  </div>
                  <div class="footer">{{sItem.inputAssignUserName}}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SalarySlip v-if="isShowDialog" :isShowDialog="isShowDialog" @closeDialog="closeDialog"></SalarySlip>
    <InfoDetails
      :editForm="noticeInfo"
      :dialogVisable="dialogVisable"
      @closeDialog="closeDialog"
      v-if="dialogVisable"
    ></InfoDetails>
  </div>
</template>


<script>
import SalarySlip from "@/pages/work/personnel/SalarySlip";
import InfoDetails from "@/pages/info/InfoDetails";
import Api from "@/api/index";
import * as filters from "@/filters/filter";
export default {
  components: {
    SalarySlip,
    InfoDetails,
  },
  computed: {
    statusList() {
      // return this.$store.state.dictionary.dists.TaskStatus.children
      return [
        {
          value: "1",
          cnInfo: "新建",
        },
        {
          value: "2",
          cnInfo: "进行中",
        },
        {
          value: "3",
          cnInfo: "已解决",
        },
        {
          value: "4",
          cnInfo: " 已关闭",
        },
      ];
    },
  },
  data() {
    const userInfo = JSON.parse(sessionStorage.getItem("jwt"));
    console.log(userInfo, "w shi ");

    return {
      isShowHeader: false,
      headImg: require("@/assets/img/head.png"),
      isShowDialog: false,
      userInfo: userInfo,
      dialogVisable: false,
      noticeInfo: null,
      holiday: {
        expirationDate: "0000-00-00",
        usedYearDays: 0,
        noUsedYearDays: 0,
        matterDays: 0,
        marriageDays: 0,
        sickLeaveDays: 0,
        funeralLeaveDays: 0,
      },
      notifyPage: {
        records: [],
        total: 0,
      },
      approvalInfo: [
        {
          icon: "icon-daishenpi",
          name: "待审批",
          count: 0,
          className: "red",
        },
        {
          icon: "icon-chaosongwode1",
          name: "抄送给我",
          count: 0,
          className: "green",
        },
        {
          icon: "icon-pxwofaqide",
          name: "我发起的",
          count: 0,
          className: "blue",
        },
      ],
      projectInfo: [
        {
          icon: "icon-meiyuan9",
          name: "报价中",
          count: 0,
          className: "red",
        },
        {
          icon: "icon-shezhi",
          name: "执行中",
          count: 0,
          className: "green",
        },
        {
          icon: "icon-jisuanqi",
          name: "结算中",
          count: 0,
          className: "blue",
        },
        {
          icon: "icon-leijiwanchengchanzhi",
          name: "累计完成",
          count: 0,
          className: "yellow",
        },
      ],
      //人事
      personnelInfo: [
        {
          count: 0,
          name: "入职",
          path: "/router/entryApproval",
        },
        {
          count: 0,
          name: "招聘",
          path: "/router/jobApproval",
        },
        {
          count: 0,
          name: "转正",
          path: "/router/regularApproval",
        },
        {
          count: 0,
          name: "离职",
          path: "/router/quitApproval",
        },
        {
          count: 0,
          name: "公文",
          path: "/router/entryApproval",
        },
        {
          count: 0,
          name: "福利",
          path: "/router/entryApproval",
        },
        {
          count: 0,
          name: "薪资",
          path: "/router/entryApproval",
        },
        {
          count: 0,
          name: "章证",
          path: "/router/sealApproval",
        },
        // {
        //   count: 1,
        //   name: '物品领用',
        //   path: '/router/officialApproval'
        // },
        // {
        //   count: 1,
        //   name: '名片',
        //   path: '/router/entryApproval'
        // }
      ],
      //行政
      administrationInfo: [],
      //业务
      bussinessInfo: [
        {
          count: 0,
          name: "客户走访",
          path: "/router/customerVisits",
        },
        {
          count: 0,
          name: "市场开拓",
          path: "/router/marketDevelopment",
        },
      ],
      imageUrl: "",
      financeInfo: [
        {
          count: 0,
          name: "付款审批",
          path: "/router/paymentApplication",
        },
        {
          count: 0,
          name: "发票审批",
          path: "/router/officialApproval",
        },
      ],
      taskInfo: [
        {
          name: "待我指派的",
          count: 0,
          className: "blue",
        },
        {
          name: "指派给我的",
          count: 0,
          className: "blue",
        },
        {
          name: "我在执行的",
          count: 0,
          className: "blue",
        },
        {
          name: "待我验收的",
          count: 0,
          className: "blue",
        },
        {
          name: "总计",
          count: 0,
          className: "yellow",
        },
        {
          name: "累计完成任务数量",
          count: 0,
          className: "red",
        },
      ],
      taskPage: {
        attached: {},
        pageSize: 5,
        pageNumber: 1,
        totalCount: 1,
        totalTask: 1,
        taskMap: {
          "1": [
            // {
            //   attached: {
            //     TaskType_cnInfo: '运输文物',
            //     TaskStatus: {
            //       '1': {
            //         attached: {},
            //         key: 'TaskStatus.NEW',
            //         keyHash: -1302849271,
            //         parentKeyHash: null,
            //         cnInfo: '新建',
            //         usInfo: null,
            //         value: '1',
            //         intValue: 1,
            //         parentKey: null,
            //         rootKey: null,
            //         children: null,
            //         i18nInfo: [
            //           {
            //             attached: {},
            //             id: null,
            //             localeStr: 'zh_CN',
            //             locale: 'zh_CN',
            //             info: '新建',
            //             explanation: null,
            //             dictionaryHashCode: -1302849271
            //           }
            //         ],
            //         extProperties: null,
            //         cnexplanation: null
            //       }
            //     },
            //     TaskStatus_cnInfo: '新建',
            //     TaskType: {
            //       '1': {
            //         attached: {},
            //         key: 'TaskType.PREPARATION_CATERING',
            //         keyHash: -2096201002,
            //         parentKeyHash: null,
            //         cnInfo: '运输文物',
            //         usInfo: null,
            //         value: '1',
            //         intValue: 1,
            //         parentKey: null,
            //         rootKey: null,
            //         children: null,
            //         i18nInfo: [
            //           {
            //             attached: {},
            //             id: null,
            //             localeStr: 'zh_CN',
            //             locale: 'zh_CN',
            //             info: '运输文物',
            //             explanation: null,
            //             dictionaryHashCode: -2096201002
            //           }
            //         ],
            //         extProperties: null,
            //         cnexplanation: null
            //       }
            //     }
            //   },
            //   taskId: 'e9110e9c-32b4-4b44-910e-9c32b4fb44dc',
            //   templateId: 'b0621dde-245d-4789-a21d-de245d8789ec',
            //   templateName: '运输文物',
            //   taskType: 1,
            //   taskName: '07.18-运输文物任务',
            //   taskDesc:
            //     '07.18-运输文物用餐安排，需要明确供应商、用餐地点、用餐时间和人均成本。',
            //   inputWorkload: null,
            //   inputPlanFinishDate: null,
            //   inputActivityId: '260aa62f-7928-41d5-8aa6-2f792871d574',
            //   inputActivityName: null,
            //   activityEndDate: null,
            //   inputAssignTeamId: '4dc3085d-61af-4c06-8308-5d61af7c0690',
            //   inputAssignTeamName: '1号执行队',
            //   inputAssignUserId: '60eca9c3-407f-470c-aca9-c3407f170c4f',
            //   inputAssignUserName: '孙泽龙',
            //   inputSystemJson:
            //     '[{"attached":{},"day":2,"supplierId":0,"dinnerTime":["12:00","13:00"],"dinnerPlace":"xxx餐厅","timeRange":"中午"}]',
            //   inputJson: null,
            //   taskStatus: 1,
            //   checkLevel: null,
            //   checkPoints: null,
            //   checkBoolAccept: null,
            //   checkRejectReason: null,
            //   inputNote: null,
            //   inputFileJson: null,
            //   taskCode: 'CB-2020-47',
            //   createAt: 1580622672000,
            //   updateAt: 1580622708000,
            //   delFlag: false,
            //   createUserId: 'a95e8578-f5d6-4544-9e85-78f5d6e544e8',
            //   createUserName: null,
            //   executiveRejectionFlag: null,
            //   executiveRejectionReason: null,
            //   keywords: null,
            //   relatedToTMe: null,
            //   queryTaskStatus: null,
            //   noInputAssignUserId: false,
            //   unassigned: false,
            //   queryInputAssignUserId: null,
            //   pageNumber: null,
            //   pageSize: null
            // }
          ],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
        },
        taskNumberMap: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      },
      tableHeader: [
        {
          prop: "title",
          label: "公告标题",
          align: "center",
          width: "240",
          show: true,
        },
        {
          prop: "orgName",
          label: "发布单位",
          width: "90",
          show: false,
        },
        {
          prop: "createDt",
          label: "发布时间",
          width: "80",
          show: true,
        },
      ],
    };
  },
  mounted() {
    this.getImgUrl(this.userInfo.picKey);
    this.getNoticeList();
  },
  methods: {
    getImgUrl(key) {
      this.imageUrl = "";
      if (key) {
        Api.getUrl(key).then((data) => {
          if (data) {
            this.imageUrl = data;
          }
        });
      }
    },
    goApproval() {
      this.$router.push({
        path: "/router/approvalIndex",
      });
    },
    moreNotify() {
      this.$router.push({
        path: "/router/notice",
      });
    },
    showNoticeInfo(row) {
      console.log(row, "row");
      this.noticeInfo = row;
      this.dialogVisable = true;
    },
    getNoticeList() {
      const params = {
        pageSize: 4,
        pageNumber: 1,
      };
      // 获取公告列表
      Api.pageInfo(params).then((data) => {
        this.notifyPage = data;
      });
    },
    showSalarySlip() {
      this.isShowDialog = true;
    },
    closeDialog() {
      this.isShowDialog = false;
      this.dialogVisable = false;
    },
  },
};
</script>
<style lang="scss">
$color-red: #c2292f;
$color-green: #1cb576;
$color-blue: #838bc3;
$color-yellow: #f8932f;
$color-task-new: #e2dfee;
$color-task-continuing: #fffcdb;
$color-task-completed: #e8f0c7;
$color-task-colsed: #fdece3;
$color-eee: #eee;
#homePage {
  .myInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .baseInfo {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 6px;
      width: 32.5%;
      height: 180px;
      .left {
        img {
          width: 90px;
          height: 90px;
          display: block;
          border-radius: 50%;
        }
      }
      .right {
        width: calc(100% - 120px);
        .infoList {
          padding-left: 10px;
          border-left: 1px dashed #ddd;
          margin-left: 10px;
          h3,
          ul,
          li {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          li {
            margin-top: 10px;
          }
          .liOption {
            display: flex;
            justify-content: space-between;
            justify-items: center;
          }
        }
      }
    }
    .holiday {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      width: 32.5%;
      height: 180px;
      .yearHoliday {
        border-radius: 50%;
        background: #4c5559;
        width: 120px;
        height: 120px;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .top {
          width: 120px;
          height: 60px;
          line-height: 70px;
          background: #c2292f;
          border-top-left-radius: 120px;
          border-top-right-radius: 120px;
          text-align: center;
          font-size: 24px;
        }
        .bottom {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          margin-top: 10px;
        }
      }
      .right {
        width: calc(100% - 160px);
        .holidayList {
          padding-left: 10px;
          //border-left: 1px dashed #ddd;
          margin-left: 10px;
          h3,
          ul,
          li {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          li {
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            strong {
              font-size: 24px;
            }
          }
          ul {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 65px;
          }
          h3 {
            padding-bottom: 10px;
            text-align: center;
          }
        }
      }
    }
    .notify {
      width: 32.5%;
      height: 180px;
      background: #fff;
      .notifyUl {
        margin: 0;
        padding: 0;
        list-style: none;
        li {
          height: 24px;
          line-height: 24px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          cursor: pointer;
          &:nth-child(odd) {
            background: #eee;
          }
          &:hover {
            background: #c2292f;
            color: #fff;
          }
        }
      }
    }
  }
  .approvalInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      background: #fff;
      width: 32.5%;
      height: 120px;
      border-radius: 6px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
      &:hover {
        background: #ddd;
      }
      i {
        font-size: 40px;
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #c2292f;
        line-height: 80px;
        text-align: center;
        color: #fff;
      }

      strong {
        font-size: 20px;
      }
      span {
        font-size: 32px;
      }
    }
    .red {
      i {
        background: $color-red;
      }
      span {
        color: $color-red;
      }
    }
    .green {
      i {
        background: $color-green;
      }
      span {
        color: $color-green;
      }
    }
    .blue {
      i {
        background: $color-blue;
      }
      span {
        color: $color-blue;
      }
    }
  }
  .approvalEnter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .waitApproval {
      display: flex;
      justify-content: space-around;
      align-items: left;
      height: 200px;
      flex-direction: column;
      width: 150px;

      .item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
        border-radius: 8px;
      }
      .item:hover {
        background: #f8932f;
      }
      .left {
        padding: 16px 0;
        width: 65px;
        text-align: center;

        .iconfont {
          font-size: 24px;
          padding: 6px;
          border-radius: 50%;
          color: #fff;
          border: 1px solid #fff;
        }
      }
      .right {
        width: 85px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        color: #fff;
        span {
          font-size: 20px;
        }
        strong {
          font-size: 12px;
        }
      }
    }
  }
  .projectInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #fff;
    .item {
      width: 24%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #fff;
      border-radius: 6px;
      height: 100px;
      cursor: pointer;
      i {
        font-size: 40px;
        display: inline-block;
        width: 60px;
        height: 60px;
        border: 1px solid #fff;
        border-radius: 50%;
        line-height: 60px;
        text-align: center;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100px;
        .top {
          font-size: 30px;
        }
        .bottom {
          font-size: 20px;
        }
      }
    }
  }
  .taskInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 20px;
    // background: #fff;
    .item {
      width: 15.6%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 6px;
      height: 80px;
      cursor: pointer;
      .top {
        font-size: 24px;
      }
      .bottom {
        font-size: 16px;
      }
    }
  }
  .taskList {
    display: flex;
    justify-content: space-between;
    // padding: 20px;
    // background: #fff;
    .taskItem {
      width: 23%;
      padding: 10px;

      .taskTitle {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-bottom: 10px;
        font-size: 18px;
        border-bottom: 1px dashed #000;
      }
      .dot {
        display: inline-block;
        line-height: 8px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      &:nth-child(1) {
        background: $color-task-new;
        .dot {
          background: $color-blue;
        }
      }
      &:nth-child(2) {
        background: $color-task-continuing;
        .dot {
          background: $color-yellow;
        }
      }
      &:nth-child(3) {
        background: $color-task-completed;
        .dot {
          background: $color-green;
        }
      }
      &:nth-child(4) {
        background: $color-task-colsed;
        .dot {
          background: $color-red;
        }
      }
    }
    .taskBody {
      .taskContent {
        margin-top: 10px;
        padding: 10px;
        background: #fff;

        cursor: pointer;
        .header {
          display: flex;
          justify-content: space-between;
          label {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            i {
              margin-right: 8px;
            }
          }
        }
        .footer {
          margin-top: 10px;
          text-align: right;
        }
      }
      .taskItem:hover {
        background: #eff0e8;
      }
    }
  }
  .detailsBox {
    width: calc(100% - 180px);
  }
  .details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #444;
    padding-bottom: 10px;
    dt {
      font-size: 18px;
    }
    dd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .detailItem {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          overflow-x: hidden;

          .item {
            cursor: pointer;
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-right: 40px;

            i {
              font-size: 40px;
              padding-right: 10px;
              color: #999;
            }
            span {
              position: absolute;
              left: 20px;
              top: 0;
              display: inline-block;
              width: 20px;
              height: 20px;
              background: #c2292f;
              color: #fff;
              border-radius: 50%;
              text-align: center;
            }
            &:hover {
              i {
                color: #333;
              }
            }
          }
        }
      }
      .right {
      }
      .el-icon-arrow-right,
      .el-icon-arrow-left {
        font-size: 26px;
        color: $color-red;
      }
    }
  }
  .white {
    background: #fff;
  }
  .red {
    background: $color-red;
  }
  .green {
    background: $color-green;
  }
  .blue {
    background: $color-blue;
  }
  .yellow {
    background: $color-yellow;
  }
}
</style>
