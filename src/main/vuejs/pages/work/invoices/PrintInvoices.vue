<template>
  <div v-if="form" class="printBg">
    <div class="printTitle">
      <div class="left">
        <!-- 火凤凰(北京)国际艺术品物流有限公司 -->
        申请日期：{{form.applyDate | DateFormat}}
      </div>
      <div class="center">
        <h2 class="text-center">
          发票审批单
          <!-- {{$route.query.targetType | approvalTargetTypeFilter}} -->
        </h2>
      </div>
      <!-- <div class="right">
        <img width="77" src="http://cdn.m56.cn/qrcode" alt />
        <span>用钉钉扫码</span>
      </div> -->
    </div>
    <table class="printTable">
      <tbody>
        <tr>
          <th width="110">申请人</th>
          <td colspan="4">
            <!--页面录入的申请人-->
            <span>{{form.applicantName}}</span>
          </td>
          <th width="110">审批编号</th>
          <td colspan="4">{{form.id}}</td>
        </tr>

        <tr>
          <th>项目名称</th>
          <td colspan="4">{{form.projectName}}</td>
          <th>项目编号</th>
          <td colspan="4">{{form.projectCode}}</td>
        </tr>
        <tr>
          <th>客户名称</th>
          <td colspan="4">{{form.customerName}}</td>
          <th>合同编号</th>
          <td colspan="4">{{form.contractCode}}</td>
        </tr>
        <!-- 发票审批-->
        <tr v-if="form.payeeOpenBank">
          <th>开户银行</th>
          <td colspan="4">{{form.payeeOpenBank}}</td>
          <th>账号</th>
          <td colspan="4">{{form.payeeAccount}}</td>
        </tr>
        <tr>

          <!-- <th>金额大写</th>
                    <td colspan="4">
                        {{form.chineseAmount}}
                    </td>
                </tr>
          <tr>-->
          <th>开票类型</th>
          <td colspan="4">{{form.receiptType | invoiceType1}}</td>
          <th>开票金额</th>
          <td colspan="4">{{form.amount}}</td>
        </tr>
        <tr>
          <td colspan="10" style="padding:0;border:none;width:100%">
            <table class="subTable" v-if="form.receiptApplyDetailList">
              <tr>
                <td>序号</td>
                <td>货物或应税劳务名称</td>
                <td>规则型号</td>
                <td>单位</td>
                <td>数量</td>
                <td>价税合计</td>
              </tr>
              <tr v-for="(item,index) in form.receiptApplyDetailList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.detailItem}}</td>
                <td>{{item.specification}}</td>
                <td>{{item.unit}}</td>
                <td>{{item.number}}</td>
                <td>{{item.sumPrice}}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <th colspan="10">
            审批流程
            <span style="margin-left:20px;font-weight:500">(审批时间为空，代表审批处于待审批状态)</span>
          </th>
        </tr>
        <tr>
          <td colspan="10" v-if="approvalInfo" style="padding:0;border:none;width:100%">
            <table class="subTable" v-if="approvalInfo && approvalInfo.approvalDetails">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>审批信息</th>
                  <th>审批时间</th>
                  <!-- <th>审批结果</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in approvalInfo.approvalDetails" :key="index">
                  <td>{{index+1}}</td>
                  <td>
                    <!--状态是已驳回-->
                    <template v-if="item.states ==='0'">{{item.approverName}}</template>

                    <!--状态是已审批 或签-->
                    <!-- <template v-if="item.states ==='1' && index==0">
                                            <span>{{item.positionName}} </span>
                                            <span v-if="item.positionName && item.approverName">：</span>
                                            <span v-if="item.approverName">
                                            {{item.approverName}}
                                            </span>
                    </template>-->
                    <template v-if="item.states!=='2' && item.states!=='3'">
                      <!--状态是已审批 会签-->
                      <template v-if="item.approvalNode && item.approvalNode.type==='0'">
                        <strong
                          v-for="(child, index) in item.approvalNode.approverList"
                          :key="index"
                        >
                          {{child.approverName?child.approverName:child.pendingApprovalName}}
                          <span
                            :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                          >({{getCurNodeStatus(child.states)}})</span>
                          <span
                            :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                            v-if="child.reason"
                          >{{child.reason}}</span>
                        </strong>
                      </template>
                      <!--状态是已审批 或签-->
                      <template v-if="item.approvalNode && item.approvalNode.type==='1'">
                        <template v-for="(child, index) in item.approvalNode.approverList">
                          <strong v-if="child.states==='1' || child.states==='0'" :key="index">
                            {{child.approverName?child.approverName:child.pendingApprovalName}}
                            <span
                              :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                            >({{getCurNodeStatus(child.states)}})</span>
                            <span
                              :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                            >{{child.reason}}</span>
                          </strong>
                        </template>
                      </template>
                    </template>
                    <!--状态是待审核,审批中时-->
                    <template
                      v-if="item.states ==='2' || item.states ==='3'"
                    >{{getNodeInfo(item.approvalNode)}}</template>
                    <span
                      v-if="item.approvalNode && (item.approvalNode.approverList[0].pendingApprovalType!=='0' || item.approvalNode.approverList.length>1) "
                    >({{item.approvalNode.type==='1'?'或签':'会签'}})</span>
                  </td>
                  <td>
                    <template
                      v-if="item.states ==='1' || item.states ==='0' "
                    >{{item.updateDt | timeFormat}}</template>
                  </td>
                  <!-- <td>{{child.reason}}</td> -->
                </tr>
              </tbody>
            </table>
          </td>
          <td colspan="9" v-else>尚未提交审批流程，请在“申请”选项卡中列表页提交审批</td>
        </tr>
        <tr v-if="form && form.applyAttachmentList.length>0">
          <th>附件</th>
          <td colspan="9">
            {{getAttachmentList(form.applyAttachmentList)}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Api from "@/api/index";

export default {
  // 制作打印模版组件时，props区域尽量保留。

  props: {
    // 查询条件
    searchQuery: {
      type: Object
    },
    id: {
      type: String
    },
    //审批详情
    approvalInfo: {
      type: Object
    },
    //申请详情表单
    form: {
      type: Object
    },
    //发票编码
    targetId: {
      type: String
    },
    // 附件信息
    fileList: {
      type: Array
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
    }
  },

  data() {
    return {
      //info:null,
      approvalDetails: null,
      listData: [],
      //发票审批
      tableHeader_invoice: [
        {
          prop: "detailItem",
          label: "货物或应税劳务名称",
          align: "center",
          show: true
        },
        {
          prop: "specification",
          label: "规则型号",
          align: "center",
          show: true
        },
        { prop: "unit", label: "单位", align: "center", show: true },
        { prop: "number", label: "数量", align: "center", show: true },
        { prop: "sumPrice", label: "价税合计", align: "center", show: true }
      ],
      //付款审批
      tableHeader_pay: [
        {
          prop: "feeTypeName",
          label: "费用名称",
          align: "center",
          width: "200",
          show: true
        },
        {
          prop: "amount",
          label: "金额",
          align: "center",
          width: "100",
          show: true
        },
        {
          prop: "remarks",
          label: "备注",
          align: "center",
          width: "200",
          show: true
        }
      ]
    };
  },
  mounted() {
    //this.loadData()
  },

  methods: {
    //获取附件名称
    getAttachmentList(arr){
        if(arr.length>0){

            return arr.map(item=>item.name).toString()
        }else{
            return ''
        }
    },
    getCurNodeStatus(status) {
      const statusName = ["已驳回", "已通过", "审批中"];
      return statusName[status];
    },
    //获取节点信息
    getNodeInfo(node) {
      console.log(node, node.approverList, "getNOdelIst");
      if (node && node.approverList) {
        const approverList = node.approverList
          .map(item => item.pendingApprovalName)
          .toString();
        return approverList;
      } else {
        return "";
      }
    }
    // loadData() {
    //     const applyId = this.targetId
    //     console.log(applyId,'applyId')
    //     if(applyId){
    //         Api.approvalDetailWithStep({id: this.targetId}).then(data => {

    //             if (data) {
    //                 this.approvalDetails = data

    //             }
    //         })
    //     }

    //   }
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
.progress {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 2px solid #ddd;
    position: relative;
    margin-left: 30px;
    padding-bottom: 30px;
    &:nth-last-child(1) {
      border-left: none;
      align-items: top !important;
    }
    .left {
      display: flex;
      justify-content: flex-start;
      align-items: top;
      .name {
        position: absolute;
        left: -19px;
        width: 36px;
        height: 36px;
        overflow: hidden;
        border-radius: 50%;
        background: #ccc;
        text-align: center;
        color: #fff;
        line-height: 36px;
      }

      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 25px;
        .top {
          font-weight: 700;
        }
        .bottom {
          color: #888;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          .b-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            margin-bottom: 10px;
            .headImg {
              width: 40px;
              height: 40px;
              overflow: hidden;
              border-radius: 50%;
              background: #22aedd;
              text-align: center;
              color: #fff;
              line-height: 40px;
            }
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .bgRed {
    background: red !important;
  }
  .bgGreen {
    background: #1bb677 !important;
  }
}
</style>
