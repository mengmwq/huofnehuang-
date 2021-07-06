<template>
  <div v-if="form1">
    <ContractApprovalInfo :info="form1"></ContractApprovalInfo>
    <div class="title">
      附件信息
      <div class="line"></div>
    </div>
    <ol style="padding: 0 4%">
      <li v-for="(item, index) in fileList" :key="index">
        <span>{{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
        <span v-if="item.key" style="margin-left:40px;" @click="showFileDetails(item.key)">
          <el-button type="primary" size="mini" v-if="isHasImg(item.key)">预览图片</el-button>
          <el-button type="primary" size="mini" v-else-if="item.key.indexOf('pdf')!=-1">预览PDF</el-button>
          <el-button type="primary" size="mini" v-else>下载文件</el-button>
        </span>
      </li>
    </ol>

    <!--审批意见处理--->
    <div v-if="$route.query.approvalStatus === 'pendingApproval'">
      <ApprovalHandle></ApprovalHandle>
    </div>
    <div v-else class="tar pd20">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" size="medium" @click="handlePrint">打印</el-button>
    </div>
    <ImgPreview
      :pictures="pictures"
      :isShowDialog="isShowDialogImg"
      :isFullscreen="false"
      v-if="isShowDialogImg"
      @closeDialog="closeDialogImg"
    />
    <div id="printContent" v-show="isShowPrint">
      <PrintContract
        :form="form"
        :approvalInfo="approvalInfo"
        :id="$route.query.id"
        :targetId="$route.query.applyId"
      ></PrintContract>
    </div>
  </div>
</template>

<script>
import ContractApprovalInfo from "@/pages/approval/ContractApprovalInfo";
import ApprovalHandle from "../ApprovalHandle";
import moment from "moment";
import Api from "@/api/index";

import ImgPreview from "@/components/common/ImgPreview";
import PrintContract from './PrintContract'
export default {
  components: {
    ApprovalHandle,
    ContractApprovalInfo,
    ImgPreview,
    PrintContract
  },
  data() {
    const query = this.$route.query;
    const projectCode = query.projectCode;
    const bidId = query.bidId;
    return {
      isShowDialogImg: false,
      pictures: null,
      // 判断是入库还是出库
      flag: false,
      removedAll: false,
      //判断添加还是编辑
      operateFlag: "add",

      fileList: [],

      type: "",
      form1: {},
      form: {
        appendixUrlKey: "", //合同附件
        applyDate: "", //申请日期
        company1CreditCode: "", //信用代码号1
        company1Name: "", //对方单位名称1
        company2CreditCode: "", //信用代码号2
        company2Name: "", //对方单位名称2
        contractCode: "", //合同号
        contractLimit: "", //合同期限
        contractName: "", //合同名称
        contractPrice: "", //合同金额
        contractTypeId: "", //合同类型
        definitionAppProcessId: "", //审批申请表ID-----------------------无
        foreignContractNumber: "", //外来合同编号
        id: "", //合同主键-------------------------------无
        orgId: "", //组织ID-------------------------------（部门？？？？？）
        outline: "", //合同摘要
        projectCode: projectCode ? projectCode : "", //项目编码
        bidId: bidId ? bidId : "", //投标项目ID;
        provinceId: "", //省份ID-------------------------------（省份？？？？？）
        reasonsTermination: "", //终止原因-------------------------无
        remarks: "", //备注
        states: "", //状态-----------------------------------------无
        storageLocation: "", //合同存放地点-----------------------------------------无
        title: "", //标题
        agreementPrice: "", //  协议价格                   2号表格
        contractId: "", //  合同ID-----------------------------------------无
        contractTargetId: "",
        currencyId: "", //  币种ID
        from: "", //  起点
        goodsName: "", //  货品名称
        to: "", //  终点
        transportationModeId: "", //运输方式id
        agreementPrice: "",
        agreementPriceReqs: [], //集合数组
      },
      tableHeader: [
        {
          prop: "name",
          align: "center",
          label: "货物名称",
          width: "100",
          show: true,
        },
        {
          prop: "from",
          align: "center",
          label: "起点",
          width: "100",
          show: true,
        },
        {
          prop: "to",
          align: "center",
          label: "终点",
          width: "100",
          show: true,
        },
        {
          prop: "transportationModeId",
          align: "center",
          label: "运输方式",
          width: "100",
          show: true,
        },
        {
          prop: "agreementPrice",
          align: "center",
          label: "协议价格",
          width: "100",
          show: true,
        },
        {
          prop: "currency",
          align: "center",
          label: "币种",
          width: "100",
          show: true,
        },
      ],
      /** 表格数据 */
      listData: [],

      /** 总数据数 */
      total: 0,
      /** 表格 loading */
      listLoading: false,
      // 运输方式
      transportationMode: [],
      // 币种
      currencyTypeList: [],
      // 审批流程列表
      shenPiList: [],
      // 项目编号
      projectList: [],
      // 合同类型
      contractType: [],
      // 合同对象类型
      contractTargetTypeList: [],
      // 供应商下拉客户下拉战略合作伙伴下拉
      supplierList: [],

      orgId: "",
      orgName: "",
      treeData: [],
      typeShow: "", //检测是否为详情页的变量
      isShowPrint: false,
      approvalInfo:null
    };
  },
  mounted() {
    console.log(this.approvalInfo,'hhhdhdhhdhdhhdhhhdh')
    this.typeShow = this.$route.query.type;
    this.flag = this.$route.path === "/router/PutInStock";

    if (this.$route.query.id) {
      this.load();
    }
  },
  methods: {
    //获取打印信息
    getPrintInfo(applyId) {
      if (applyId) {
        Api.approvalDetailWithStep({ id: applyId }).then((data) => {
          if (data) {
            console.log(data, "approvalDetails");
            this.approvalInfo = data;
          }
        });
      }
    },
    //打印
    handlePrint() {
     
      this.isShowPrint = true;
      this.$nextTick(() => {
        Print("#printContent");
        this.isShowPrint = false;
      });
    },
    remoteMethod(query = "") {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
          pageNum: 1,
          pageSize: 10,
          searchStr: query,
          myProjectList: false,
        };
        Api.projectList(params).then((res) => {
          console.log(res, "resss");
          this.projectList = res.records;
        });
      }, 200);
    },
    //关闭图片预览；
    closeDialogImg() {
      this.isShowDialogImg = false;
    },
    // 判断是否图片
    isHasImg(key) {
      const aFileType = [".jpg", ".jpeg", ".png"];
      return aFileType.some(
        (item) => key.toLowerCase().lastIndexOf(item) != -1
      );
    },
    //文件预览处理
    showFileDetails(key) {
      let img = "";
      Api.getUrl(key).then((data) => {
        if (data) {
          if (this.isHasImg(key)) {
            //图片预览处理；
            img = data;
            this.pictures = [];
            this.pictures.push(img);
            this.isShowDialogImg = true;
          } else {
            //除图片的其他文件；
            window.open(data);
          }
        }
      });
    },
    load() {
      Api.contractDetail({ id: this.$route.query.id }).then((data) => {
        if (data) {
          this.form1 = data;
          if (data.contractAttachments && data.contractAttachments.length > 0) {
            this.fileList = data.contractAttachments;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.title {
  color: #c2272d;
  margin-bottom: 10px;
  overflow: hidden;
  height: 40px;
}

.title .line {
  border-bottom: 2px dashed #dfdfdf;
  position: relative;
  left: 80px;
  margin-top: -11px;
}

.footer {
  float: right;
  margin-top: 20px;
}
.w-trans {
  width: 180px;
}
</style>
