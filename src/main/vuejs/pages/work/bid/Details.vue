<template>
  <div class="formDetails pd20">
    <el-form ref="form" :model="form" label-width="160px">
      <div class="item">
        <!-- <div class="sequence"><div class="num">1</div>基本信息</div> -->
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="项目名称：">{{form.bidProjectName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码：" >{{form.projectCode}}</el-form-item>
          </el-col>
        </el-row>
         <!--国际航材-->
        <!-- <el-row :gutter="20">
         
          <el-col
            :span="8"
            v-if="form.projetcCode.indexOf('A') !== -1 && form.projectCode.indexOf('I') !== -1"
          >
            <el-form-item label="监管方式：">
                <el-form-item label="客户名称：">{{form.regulate}}</el-form-item>
              
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.$route.query.type === 'F'">
            <el-form-item label="贸易方式：" prop="type">
                <el-form-item label="客户名称：">{{form.type}}</el-form-item>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户名称：">{{form.customerName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：">{{form.contacterName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">{{form.contacterTel}}</el-form-item>
          </el-col>
        </el-row>
      </div>
      <!--投标信息 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="报名方式：">{{form.bidType}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预算金额：">{{form.budgetAmount}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="招标编号：">{{form.bidCode}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开标时间：">{{form.bidOpeningDate}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开标地址：">{{form.bidOpeningSite}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="招标方式：">{{form.bidType}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买标书截止日：">{{form.deadline}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目内容：">
           <div class="quill-editor">
                    <div v-html="form.projectContet" class="ql-editor"></div>
                  </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="代理单位：">{{form.agentCompany}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="代理单位联系人：">{{form.agent}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="代理电话：">{{form.agentTel}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="bidProjectReq.remarks">{{form.remarks}}</el-form-item>
        </el-col>
      </el-row>
      <!--审批意见处理--->
    <div v-if="$route.query.approvalStatus === 'pendingApproval'">
      <ApprovalHandle></ApprovalHandle>
    </div>
      <div v-else class="tar pd20">
        <el-button type="default" @click="$router.go(-1)">返回</el-button>
        <!-- <el-button type="primary" @click="handlePrint">打印</el-button> -->
      </div>
    </el-form>
    <div id="PrintBid" v-if="isShowPrint">
      <PrintBid  
            :form="form"   
            :id="$route.query.id" :targetId="$route.query.applyId" :fileList="fileList"></PrintBid>
    </div>
  </div>
</template>

<script>
import AddBiddingProject from "@/pages/my/project/AddBiddingProject";
import ApprovalHandle from '../ApprovalHandle'
import Api from "@/api/index";
import PrintBid from './PrintBid'
export default {
  components: {
    AddBiddingProject,
    ApprovalHandle,
    PrintBid
  },
  data() {
    const type = this.$route.query.type;
    return {
      isShowPrint:false,
      // 添加或者编辑的标志
      operateFlag: "",

      // 客户下拉列表
      customerList: [],
      // 客户联系人下拉列表
      contacterList: [],
      projectType: "",
      // 国际航材监管方式
      ProjectForeignRegulate: [],
      contacterMobile: "",
      contacterTel: "",
      contacterEmail: "",
      isBiddingProject: true,
      // 项目创建参数
      form: {
        customId: "",
        //isBiddingProject:false,
        approvalProcessId: "",
        projetcCode: [],
        // 运输线路
        haulwayReqs: [],
        // 包装箱列表信息
        packagingInfoReqs: [],
        // 国内航材货物明细
        domesticMaterialDetailReqs: [],
        foreignMaterialDetailReqs: [],
        // 艺术品货物明细
        artDetailReqs: [],
        bidAttachmentReqList: [],
          agentCompany: "",
          agent: "",
          agentTel: "",
        //投标信息
        bidProjectReq: {
          
        },
        // 艺术品任务信息
        taskInfoReqs: []
      },
      tradeTypeOptions: [
        {
          value: "PI",
          label: "进口"
        },
        {
          value: "PE",
          label: "出口"
        },
        {
          value: "TI",
          label: "暂时进口"
        },
        {
          value: "TE",
          label: "暂时出口"
        },
        {
          value: "RI",
          label: "复进口"
        },
        {
          value: "RE",
          label: "复出口"
        }
      ],
      // 项目编码--艺术品
      artOptions: [
        {
          value: "F",
          label: "艺术品",
          children: [
            {
              value: "D",
              label: "国内",
              children: [
                {
                  value: "E",
                  label: "画廊"
                },
                {
                  value: "M",
                  label: "博物馆"
                },
                {
                  value: "A",
                  label: "拍卖行"
                }
              ]
            },
            {
              value: "I",
              label: "国际",
              children: [
                {
                  value: "E",
                  label: "画廊",
                  children: [
                    {
                      value: "IE-PI",
                      label: "进口"
                    },
                    {
                      value: "IE-PE",
                      label: "出口"
                    },
                    {
                      value: "IE-TI",
                      label: "暂时进口"
                    },
                    {
                      value: "IE-TE",
                      label: "暂时出口"
                    },
                    {
                      value: "IE-RI",
                      label: "复进口"
                    },
                    {
                      value: "IE-RE",
                      label: "复出口"
                    }
                  ]
                },
                {
                  value: "M",
                  label: "博物馆",
                  children: [
                    {
                      value: "IM-PI",
                      label: "进口"
                    },
                    {
                      value: "IM-PE",
                      label: "出口"
                    },
                    {
                      value: "IM-TI",
                      label: "暂时进口"
                    },
                    {
                      value: "IM-TE",
                      label: "暂时出口"
                    },
                    {
                      value: "IM-RI",
                      label: "复进口"
                    },
                    {
                      value: "IM-RE",
                      label: "复出口"
                    }
                  ]
                },
                {
                  value: "A",
                  label: "拍卖行",
                  children: [
                    {
                      value: "IA-PI",
                      label: "进口"
                    },
                    {
                      value: "IA-PE",
                      label: "出口"
                    },
                    {
                      value: "IA-TI",
                      label: "暂时进口"
                    },
                    {
                      value: "IA-TE",
                      label: "暂时出口"
                    },
                    {
                      value: "IA-RI",
                      label: "复进口"
                    },
                    {
                      value: "IA-RE",
                      label: "复出口"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      // 项目编码--航材
      materialOptions: [
        {
          value: "A",
          label: "航材",
          children: [
            {
              value: "D",
              label: "国内",
              children: [
                {
                  value: "E",
                  label: "发动机"
                },
                {
                  value: "C",
                  label: "非发动机"
                }
              ]
            },
            {
              value: "I",
              label: "国际",
              children: [
                {
                  value: "E",
                  label: "发动机",
                  children: [
                    {
                      value: "IE-PI",
                      label: "进口"
                    },
                    {
                      value: "IE-PE",
                      label: "出口"
                    },
                    {
                      value: "IE-TI",
                      label: "暂时进口"
                    },
                    {
                      value: "IE-TE",
                      label: "暂时出口"
                    },
                    {
                      value: "IE-RI",
                      label: "复进口"
                    },
                    {
                      value: "IE-RE",
                      label: "复出口"
                    }
                  ]
                },
                {
                  value: "C",
                  label: "非发动机",
                  children: [
                    {
                      value: "IC-PI",
                      label: "进口"
                    },
                    {
                      value: "IC-PE",
                      label: "出口"
                    },
                    {
                      value: "IC-TI",
                      label: "暂时进口"
                    },
                    {
                      value: "IC-TE",
                      label: "暂时出口"
                    },
                    {
                      value: "IC-RI",
                      label: "复进口"
                    },
                    {
                      value: "IC-RE",
                      label: "复出口"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      dfgOptions: [
        {
          value: "DF",
          label: "免税品",
          children: [
            {
              value: "D",
              label: "国内",
              children: [
                {
                  value: "P",
                  label: "采购"
                },
                {
                  value: "T",
                  label: "运输"
                },
                {
                  value: "S",
                  label: "仓储"
                }
              ]
            },
            {
              value: "I",
              label: "国际",
              children: [
                {
                  value: "P",
                  label: "采购"
                },
                {
                  value: "T",
                  label: "运输"
                },
                {
                  value: "S",
                  label: "仓储"
                }
              ]
            }
          ]
        }
      ],
      options: [],
      fileList:[]
    };
  },
  watch: {},
  mounted() {
    
    this.operateFlag =
      this.$route.path === "/router/editProject" ? "edit" : "add";
    const type = this.$route.query.type;
    // 新增航材项目
    if (type === "A") {
      this.options = this.materialOptions;
    } else if (type === "F") {
      // 新增艺术品项目
      this.options = this.artOptions;
    } else if (type === "bid") {
      // 新增投标项目；
      this.options = [
        ...this.artOptions,
        ...this.materialOptions,
        ...this.dfgOptions
      ];
      console.log(this.options, "options");
    } else if (type === "DF") {
      // 新增投标项目；
      this.options = this.dfgOptions;
    }
    this.loadData()
  },
  methods: {
    //打印
      handlePrint(){
        this.isShowPrint = true;
        this.$nextTick(()=>{
            Print('#PrintBid')
            this.isShowPrint = false
         })
      },
    /**
       * 数据回显
       */
      loadData () {
        const params ={
          id:this.$route.query.id
        }
        Api.queryBidProjectById(params).then(data => {
          if (data) {
            this.form = data
            if (data.bidAttachmentRespList && data.bidAttachmentRespList.length > 0) {

              this.form.bidAttachmentReqList = data.bidAttachmentRespList
            } else {
              this.form.bidAttachmentReqList = []
            }
          }
        })
      },
    //金额转成两位小数
    formatNum(str) {
      let newStr = "";
      let count = 0;
      if (str.indexOf(".") === -1) {
        for (let i = str.length - 1; i >= 0; i--) {
          // if(count % 3 === 0 && count !== 0){
          //   newStr = str.charAt(i) + "," + newStr;
          // }else{
          newStr = str.charAt(i) + newStr;
          // }
          count++;
        }
        str = newStr + ".0000"; //自动补小数点后四位
        console.log(str);
        this.form.quotationAmount = str;
      } else {
        for (let i = str.indexOf(".") - 1; i >= 0; i--) {
          // if(count % 3 === 0 && count !== 0){
          //   newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
          // }else{
          newStr = str.charAt(i) + newStr; //逐个字符相接起来
          // }
          count++;
        }
        str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
        console.log(str);
        this.form.quotationAmount = str;
      }
    },

    selectSalesMan(item) {
      this.form.salesman = item.uName;
    },
    changeProjetcNo() {
      // 新增航材项目
      if (this.$route.query.type === "A") {
        if (
          this.form.projetcCode.indexOf("A") !== -1 &&
          this.form.projetcCode.indexOf("I") !== -1
        ) {
          // 国际航材
          this.projectType = "3";
        } else if (
          this.form.projetcCode.indexOf("A") !== -1 &&
          this.form.projetcCode.indexOf("D") !== -1
        ) {
          // 国内航材
          this.projectType = "2";
        }
      }
    },
    /**
     * 客户下拉列表
     * */
    loadCustomerList() {
      Api.customerList({ pageNum: 1, pageSize: 50000, name: "" }).then(res => {
        if (res) {
          this.customerList = res.records;
        }
      });
    },
    /**
     * 查询客户的联系人列表
     * */
    queryCustomerContacters() {
      Api.customerContacters({ id: this.form.customId }).then(res => {
        if (res) {
          this.contacterList = res;
          this.form.contacterId = "";
          this.contacterTel = "";
          this.contacterMobile = "";
          this.contacterEmail = "";
        }
      });
    },
    /**
     * 查询联系人信息
     * */
    queryContacterDetail() {
      Api.contacterDetail({ id: this.form.contacterId }).then(res => {
        if (res) {
          this.contacterTel = res.tel;
          this.contacterMobile = res.phone;
          this.contacterEmail = res.email;
        }
      });
    },
    goBack() {
      const tag = this.$route.query.tag;
      const type = this.$route.query.type;
      if (type == "bid") {
        this.$router.push({
          path: "/router/biddingList"
        });
        return;
      }
      this.$router.go(-1);
      if (tag === 1) {
        this.$router.push({ path: "/router/myProject" });
      } else {
        this.$router.push({
          path: "/router/artworkList"
        });
        this.resrtForm();
      }
    }
  }
};
</script>
