<template>
  <!-- <div style="min-width: 1360px;"> -->
  <div>
    <el-row class="project-header" type="flex" justify="space-between" :gutter="10">
      <el-col :span="5">
        <div class="project-status text-center">
          <!-- <PieChart v-if="projectProcess" :option="projectProcess" style="width:200px;height:200px;" /> -->
          <div class="projectProcessStatus">
            <span>项目状态</span>
            <span v-if="form.stateId=='023'">未成立</span>
            <span v-else>{{form.stateId | projectStateFilter}}</span>
          </div>
        </div>
        <div class="btnBox text-center">
           <el-button type="primary" size="mini" v-if="form.stateId=='023' || form.stateId=='004'"  @click.native="operateTask(form, '005')">成立</el-button>
               <el-button type="primary" size="mini" v-if="form.stateId!='011' && form.stateId!='012' && form.stateId!='045'"  @click="operateTask(form, '011')">作废</el-button>
               <el-button type="primary" size="mini" v-if="form.stateId!='012' && form.stateId!='045' && form.stateId!='011'"   @click="operateTask(form, '012')">完成</el-button>
          </div>
      </el-col>
      <el-col :span="17">
        <el-row class="projectDetails">
          <el-col :span="12"><strong>项目名称：</strong>{{form.projectName}}</el-col>
          <el-col :span="12"><strong>客户名称：</strong>{{form.customerName}}</el-col>
          <el-col :span="12"><strong>项目编号：</strong>{{form.projectCode}}</el-col>
          <el-col :span="12"><strong>项目归属：</strong>{{form.customName}}</el-col>
          <el-col :span="12"><strong>完成时间：</strong>{{form.finishDate | timeFormat}}</el-col>
          <el-col :span="12"><strong>销售代表：</strong>{{form.salesman}}</el-col>

          <el-col :span="12"><strong>是否报关：</strong>{{form.isCustoms ? '是': '否'}}</el-col>
          <!-- <el-col :span="12"><strong>结算币种：</strong>{{form.currency | currencyFilter}}</el-col> -->
          <el-col :span="24">
            <div
            
              class="pro-desc"
              style="cursor: pointer"
            ><strong>项目描述：</strong>{{form.description}}</div>
          </el-col>
          <el-col :span="24" v-if="form.remarks"><strong>备注：</strong>{{form.remarks}}</el-col>
        </el-row>
      </el-col>
      <el-col :span="2" class="text-right">
        <p>
          <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
        </p>
        <p>
          <el-button type="primary" size="mini" @click="commonality=true" v-if="form.stateId!='045'">编辑</el-button>
        </p>
        <p>
          <el-button type="primary" @click="deleteTask(form)" size="mini" v-if="form.stateId!='045'">删除</el-button>
        </p>
        <p>
          <el-button
            type="primary"
            size="mini"
            :icon="transRouteIsShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="edit"
          ></el-button>
        </p>
      </el-col>
    </el-row>

    <div class="project-header" v-show="transRouteIsShow">
      <TransRoute
        :id="id"
        :form="form"
        :operateFlag="'pro-detail-edit'"
        @loadProjectDeail="loadProjectDeail"
      ></TransRoute>
    </div>

    <el-row style="margin-top: 40px;">
      <el-tabs v-model="active" type="card" @tab-click="handleClick">
        <el-tab-pane label="货物信息" name="1">
          <ProjectCargoInfo :id="id" :type="type" :stateId="form.stateId"></ProjectCargoInfo>
        </el-tab-pane>
        <el-tab-pane label="预计收支" name="2">
          <ProjectBudget :id="id" :projectName="form.projectName" :priceStateId="form.stateId" :offerCurrency="form.offerCurrency" :projectDetails="form" :offCurrencyName="offCurrencyName" :type="type" @currencyChange="currencyChange"></ProjectBudget>
        </el-tab-pane>
        <el-tab-pane  label="实际收支"  name="3">
          <ProjectFinance :projectCode="projectCode" :form="form" ref="child6"></ProjectFinance>
        </el-tab-pane>
        <el-tab-pane label="财务申请" name="4">
          <ProjectIntercourseAccount :id="$route.query.id" :stateId="form.stateId" :projectCode="projectCode"></ProjectIntercourseAccount>
        </el-tab-pane>
        <el-tab-pane label="任务列表" name="5">
          <ProjectTask :projectCode="projectCode"></ProjectTask>
        </el-tab-pane>
        <el-tab-pane label="项目附件" name="6">
          <ProjectAttachment :projectCode="projectCode" :stateId="form.stateId"></ProjectAttachment>
        </el-tab-pane>
        <el-tab-pane label="报关相关" name="7">
        <!--艺术品报关-->
        <CustomsManage ref="projectCustomsManage" v-if="type=='1'" :id="id" :type="type"></CustomsManage>
        <!--航材报关-->
        <AerialMaterialList ref="projectCustomsManage" v-if="type=='2' || type=='3'" :id="id" :type="type"></AerialMaterialList>
        <!-- <ProjectOffer ref="projectOffer" :id="id" :type="type"></ProjectOffer> -->
        </el-tab-pane>
        <el-tab-pane label="联系人表" name="8">
          <ProjectContact :stateId="form.stateId" :projectCode="projectCode"></ProjectContact>
        </el-tab-pane>
        <el-tab-pane label="投标信息" name="9">
          <ProjectBid ref="projectBid" :projectCode="projectCode"></ProjectBid>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="10">
          <ProjectOperationalLog></ProjectOperationalLog>
        </el-tab-pane>
        <el-tab-pane label="项目日志" name="11">
          <ProjectLogPerson :stateId="form.stateId" ref="projectLog"></ProjectLogPerson>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!--更新公共信息 -->
    <el-dialog
      title="更新公共信息"
      :close-on-click-modal="canClick"
      :visible.sync="commonality"
      size="tiny"
      top="12vh"
      width="50%"
    >
      <div>
        <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户名称：">
                <el-select
                  v-model="form.customId"
                  disabled
                  placeholder="请选择客户"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="contacterId">
                <el-select
                  v-model="form.contacterId"
                  clearable
                  filterable
                  placeholder="请选择联系人"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in contacterList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="完成时间：">
                <el-date-picker
                  type="datetime"
                  placeholder="完成时间"
                  v-model="form.finishDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否报关：">
                <el-switch
                  style="display: inline-block"
                  v-model="form.isCustoms"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称：" prop="projectName">
                <el-input type="text" v-model="form.projectName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务员：">
                <el-select v-model="form.salesmanId" placeholder="请选择业务员" style="width: 100%;">
                  <el-option
                    v-for="item in salesmanList"
                    :key="item.uId"
                    :label="item.uName"
                    @click.native="selectSalesMan(item)"
                    :value="item.uId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目描述：">
                <el-input
                  type="textarea"
                  :rows="4"
                  maxlength="500"
                  show-word-limit
                  v-model="form.description"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input
                  type="textarea"
                  :rows="4"
                  maxlength="500"
                  show-word-limit
                  v-model="form.remarks"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelUpdateCommonInfo('form')">取 消</el-button>
            <el-button type="primary" size="small" @click="updateCommonInfo('form')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!--更新项目状态-->
    <el-dialog
      :close-on-click-modal="canClick"
          :title="editForm.stateId === '011'? '项目作废': '项目进度'"
          :visible.sync="updateDialogVisible"
          size="tiny" top="12vh" width="40%">
      <div>
        <el-form :model="editForm" ref="editForm" label-width="120px">
          <el-form-item label="项目名称:">
            <span>{{currentItem.projectName}}</span>
          </el-form-item>
          <el-form-item label="作废原因:" v-if="editForm.stateId === '011'">
            <el-input type="textarea" :rows="4" maxlength="500" show-word-limit v-model="editForm.remarks"></el-input>
          </el-form-item>
          <el-form-item label="项目进度:" v-else>
           
            <el-input-number v-model="editForm.process" controls-position="right"  :min="0" :max="100"></el-input-number>
          </el-form-item>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelUpdate('editForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="sureUpdate('editForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProjectCargoInfo from "./ProjectCargoInfo";
import ProjectBudget from "./ProjectBudget";
//import ProjectOffer from "./ProjectOffer";
import ProjectAttachment from "./ProjectAttachment";
import ProjectLogPerson from "./ProjectLogPerson";
import ProjectContact from "./ProjectContact";
import ProjectTask from "./ProjectTask";
import ProjectFinance from "./ProjectFinance";
import ProjectBid from "./ProjectBid";
import TransRoute from "@/pages/my/project/TransRoute";
import ProjectOperationalLog from "./ProjectOperationalLog";
//import PieChart from "@/components/charts/PieChart";
import ProjectIntercourseAccount from "./ProjectIntercourseAccount";
import CustomsManage from "@/pages/taskmanage/CustomsManage";
import AerialMaterialList from "@/pages/statisticsmanage/AerialMaterialList"
import Api from "@/api/index";

export default {
  components: {
    AerialMaterialList,
    CustomsManage,
    //PieChart,
    ProjectCargoInfo,
    ProjectBudget,
    //ProjectOffer,
    ProjectAttachment,
    ProjectLogPerson,
    ProjectContact,
    ProjectTask,
    ProjectFinance,
    TransRoute,
    ProjectBid,
    ProjectOperationalLog,
    ProjectIntercourseAccount
  },
  data() {
    return {
      currentItem: '',
      offCurrencyName:'', //币种
      editForm: {
          stateId: ''
        },
        projectDetails:null,
      updateDialogVisible:false,
      canClick: false,
      commonality: false,
      active: "1",
      id: "",
      rules: {},
      type: "", // 任务类型
      projectCode: "",
      form: {},
      transRouteIsShow: false,
      // 客户下拉列表
      customerList: [],
      // 客户联系人下拉列表
      contacterList: [],
      salesmanList: [],
      // 币种
      currencyTypeList: [],
      processOption: null
    };
  },
  mounted() {
    if (this.$route.query.active) {
      this.active = this.$route.query.active;
    }
    this.id = this.$route.query.id;
    this.type = this.$route.query.projectType;
    this.projectCode = this.$route.query.id;
    this.loadProjectDeail();
    //加载业务员下拉列表
    Api.getUserPage({ pageNum: 1, pageSize: 50000 }).then(res => {
      if (res) {
        this.salesmanList = res.records;
      }
    });
    if (sessionStorage.getItem("dists")) {
      let dists = JSON.parse(sessionStorage.getItem("dists"));
      if (dists.Currency) {
        this.currencyTypeList = dists.Currency.children;
      }
    }
    this.loadCustomerList();
  },
  methods: {
    //修改币种
    currencyChange(val){
       const params = {
          id:this.id,
          currency:val,
       }
       Api.updateCurrencyById(params).then(res=>{

         this.loadProjectDeail();
       })
    },
    /**
     * 删除项目
     * */
    deleteTask(item) {
      this.$confirm("您确定要删除【" + item.projectName + "】吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          Api.deleteProject({ id: item.projectCode }).then(res => {
            if (res) {
              this.$notify.success({
                title: "提示",
                message: "删除成功"
              });
              this.$router.go(-1)
            } else {
              this.$notify.warning({
                title: "提示",
                message: "删除失败"
              });
            }
          });
        })
        .catch(() => {});
    },
    //项目完结
    operateTask(item, stateId) {
      this.currentItem = item;
      this.editForm.stateId = stateId;
      this.editForm.projectCode = item.projectCode;
      let projectName = item.projectName;
      if (stateId === "005" || stateId === "012") {
        let tips =
          stateId === "005"
            ? "您确定要成立【" + projectName + "】吗?"
            : "您确定要完结【" + projectName + "】吗?";
        let successTips =
          stateId === "005"
            ? "【" + projectName + "】项目成立成功"
            : "【" + projectName + "】项目完结成功";
        let failTips =
          stateId === "005"
            ? "【" + projectName + "】项目成立失败"
            : "【" + projectName + "】项目完结失败";
        this.$confirm(tips, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let param = {
            projectCode: item.projectCode,
            stateId: stateId
          };
          Api.updateProjectState(param).then(res => {
            if (res) {
              this.$notify.success({
                title: "提示",
                message: successTips
              });
              this.loadProjectDeail();
              // 项目完结之后，tab显示完结，查询完结的数据
              // if (stateId == "012") {
              //   this.tabIndex = 2;
              //   this.query.stateId = "012";
              //   this.loadData();
              // } else {
              //   this.query.stateId = "001";
              //   this.loadData();
              // }
            } else {
              this.$notify.warning({
                title: "提示",
                message: failTips
              });
            }
          });
        });
      } else {
        this.updateDialogVisible = true;
      }
    },
    cancelUpdate (formName) {
        this.$refs[formName].resetFields()
        this.updateDialogVisible = false
      },
      sureUpdate () {
        const editForm = this.editForm
        let successTips = ''
        let failTips = ''
        let param = {
          projectCode: editForm.projectCode,
          stateId: editForm.stateId
        }
        if (editForm.stateId === '011') {
          // 项目作废
          if (!editForm.remarks) {
            this.$notify.warning({
              title: '提示',
              message: '请填写项目作废原因'
            })
            return
          }
          successTips = '项目作废成功'
          failTips = '项目作废失败'
          param.remarks = editForm.remarks
          delete param['process']
        } else {
          // 项目进度
          if (!editForm.process) {
            this.$notify.warning({
              title: '提示',
              message: '请填写项目进度'
            })
            return
          }
          successTips = '项目进度更新成功'
          failTips = '项目进度更新失败'
          param.process = editForm.process
          delete param['remarks']
          delete param['stateId']
        }
        Api.updateProjectState(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: successTips
            })
            this.updateDialogVisible = false
            this.loadProjectDeail();
          } else {
            this.$notify.warning({
              title: '提示',
              message: failTips
            })
          }
        })
      },
    setProcessOption() {
      var percent = 22; //百分数
      var color_percent0 = "",
        color_percent100 = "",
        dotArray = [];

      calculateDot(percent); //80%显示4个点，

      function calculateDot(data) {
        if (data <= 20) {
          dotArray.push(80);
          color_percent0 = "rgba(12,255,0,1)";
          color_percent100 = "rgba(12,255,0,.3)";
        } else if (data > 20 && data <= 40) {
          dotArray.push(...[80, 80]);
          color_percent0 = "rgba(12,255,0,1)";
          color_percent100 = "rgba(12,255,0,.3)";
        } else if (data > 40 && data <= 60) {
          dotArray.push(...[80, 80, 80]);
          color_percent0 = "rgba(255,123,0,1)";
          color_percent100 = "rgba(255,123,0,.3)";
        } else if (data > 60 && data <= 80) {
          dotArray.push(...[80, 80, 80, 80]);
          color_percent0 = "rgba(255,0,36,1)";
          color_percent100 = "rgba(255,0,36,.3)";
        } else if (data > 80 && data <= 100) {
          dotArray.push(...[80, 80, 80, 80, 80]);
          color_percent0 = "rgba(255,0,36,1)";
          color_percent100 = "rgba(255,0,36,.3)";
        }
      }

      return {
        //backgroundColor: '#000',
        title: {
          x: "50%",
          y: "45%",
          textAlign: "center",
          top: "68%", //字体的位置
          text: "项目进度",
          textStyle: {
            fontWeight: "normal",
            color: "#FFF",
            fontSize: 20
          },
          subtextStyle: {
            //副标题的文字的样式
            fontWeight: "bold",
            fontSize: 18,
            color: "#3ea1ff"
          }
        },
        xAxis: {
          show: false, //是否展示x轴
          min: function(value) {
            //调整x轴上面数据的位置
            return value.min - 7;
          },
          max: function(value) {
            return value.max + 7;
          },
          splitLine: {
            lineStyle: {
              show: true,
              type: "dashed"
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              fontSize: 12,
              color: "#000"
            }
          },
          data: ["1", "2", "3", "4", "5"]
        },
        yAxis: {
          show: false,
          name: "万元",
          max: 200,
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            startAngle: 225,
            color: [
              {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0.4,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: color_percent0 // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: color_percent100 // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              "none"
            ],
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
            legendHoverLink: false, //是否启用图例 hover 时的联动高亮。
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 75,
                name: "1"
              },
              {
                value: 25,
                name: "2"
              }
            ]
          },
          {
            name: " ",
            type: "pie",
            radius: ["48%", "47%"],
            avoidLabelOverlap: false, //是否启用防止标签重叠策略
            startAngle: 225,

            hoverAnimation: false,
            legendHoverLink: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 75,
                name: "1"
              },
              {
                value: 25,
                name: "2"
              }
            ]
          },
          {
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            startAngle: 315,
            color: ["rgba(34,34,34,.9)", "#ff7a00", "transparent"],
            hoverAnimation: false,
            legendHoverLink: false,
            clockwise: false, //饼图的扇区是否是顺时针排布。
            itemStyle: {
              normal: {
                borderColor: "transparent",
                borderWidth: "20"
              },
              emphasis: {
                borderColor: "transparent",
                borderWidth: "20"
              }
            },
            z: 10,
            label: {
              normal: {
                show: false,
                position: "center"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: ((100 - percent) * 270) / 360,

                label: {
                  normal: {
                    formatter: percent + "%",
                    position: "center",
                    show: true,
                    textStyle: {
                      fontSize: "90",
                      fontWeight: "normal",
                      color: "#fff"
                    }
                  }
                },
                name: ""
              },
              {
                value: 1,
                name: ""
              },
              {
                value: 100 - ((100 - percent) * 270) / 360,
                name: ""
              }
            ]
          }
        ]
      };
    },
    open(content) {
      this.$alert(
        '<strong style="word-break: break-all;word-break: break-word;">' +
          content +
          "</strong>",
        "项目描述",
        {
          dangerouslyUseHTMLString: true
        }
      );
    },
    edit() {
      this.transRouteIsShow = !this.transRouteIsShow;
    },
    selectSalesMan(item) {
      this.form.salesman = item.uName;
    },
    loadProjectDeail() {
      let _this = this;
      Api.projectDetailWithHaulway({ id: this.id }).then(res => {
        if (res) {
          this.form = res;
          this.projectCode = res.projectCode;
          console.log(res,'projectDetals')
          this.type = res.projectType;
          this.offCurrencyName = res.attached && res.attached['Currency'][this.form.offerCurrency].cnInfo;
          const projectProcess = res.process ? res.process : 0;
          this.projectProcess = this.setProcessOption(projectProcess);
          this.queryCustomerContacters();

          if (res.haulwayList) {
            res.haulwayList.forEach(function(item) {
              _this.$set(item, "type", item.transportationModeId);
            });
            this.form.haulwayReqs = res.haulwayList;
          } else {
            this.form.haulwayReqs = [];
          }
        }
      });
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
        }
      });
    },
    updateCommonInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          Api.updateProject(this.form).then(res => {
            if (res) {
              this.$notify.success({
                title: "提示",
                message: "基础信息更新成功"
              });
              this.commonality = false;
              this.loadProjectDeail();
            }
          });
        } else {
          this.$message("请完善表单");
        }
      });
    },
    cancelUpdateCommonInfo(formName) {
      this.form = {};
      this.loadProjectDeail();
      this.commonality = false;
    },
    handleClick(tab, event) {
      this.active = tab.name;
      if (tab.name === "3") {
        //this.$refs.projectOffer.loadData();
      }
      if (tab.name === "6") {
        //this.$refs.child6.loadData();
      }
      if (tab.name === "9") {
        this.$refs.projectBid.loadData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.project-header {
  background-color: #e2dff0;
  padding:20px;
  border-radius: 5px;
  font-size: 14px;
  color: #6f6e74;
  position: relative;
}
.project-header li {
  line-height: 30px;
  list-style: none;
}
.project-status {
  width: 120px;
  height: 120px;
  background-color: #828bc4;
  border-radius: 120px;
  text-align: center;
  color: #fff;
  margin: 10px auto;
  .btnBox {
    margin-top: 120px;
    display: flex;
    justify-content: flex-start;
  }
  .projectProcessStatus{
    height: 110px;
     display: flex;
     flex-direction: column;
     justify-content: center;	
     justify-items: center;
     .processBtn{
        cursor: pointer;
     }
  }
}
// .project-status div {
//   display: inline-block;
//   margin-top: 35px;
// }
.left-border {
  border-left: 1px dashed #848387;
}
.edit {
  position: absolute;
  bottom: 20px;
  right: 0;
}
.pro-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.projectDetails .el-col {
  margin-bottom: 10px;
}
</style>
