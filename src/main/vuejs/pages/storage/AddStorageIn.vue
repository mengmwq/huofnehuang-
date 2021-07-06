<template>
  <div>
    <!-- <div class="formTitle">
    <div class="title">添加出库</div>
  </div> -->
    <el-timeline class="mt20">
      <el-timeline-item timestamp="基本信息" placement="top" size="large" color="#C1272D">
        <el-card>
          <el-form
            label-width="100px"
            :model="addForm"
            :rules="rules"
            ref="addForm"
            class="demo-form-inline mt20"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目编码：">
                  <el-select v-model="addForm.grideReq.projectCode" filterable clearable placeholder="项目编码" size="medium" style="width: 100%;">
                    <el-option
                      v-for="(item, index) in projectList"
                      :key="index"
                      @click.native="selectProject(item)"
                      :label="item.projectCode"
                      :value="item.projectCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称：">
                  <span>{{projectName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="入库时间：">
                  <el-date-picker v-model="date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input
                    type="textarea"
                    :rows="3"
                    show-word-limit
                    v-model.trim="addForm.stockInfo.remark"
                    :maxlength="500"
                    placeholder
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="货物信息" placement="top" size="large" color="#C1272D">
        <el-card>
          <el-row class="mb10">
            <el-col :span="4" class="text-left">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addGoods">添加货物</el-button>
            </el-col>
          </el-row>
          <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}">
            <el-table-column type="index" label="序号" min-width="60"></el-table-column>
            <el-table-column prop="stockInfo.goodsName" label="货物名称" width="130" align="center"></el-table-column>
            <el-table-column prop="stockInfo.number" label="数量" align="center"></el-table-column>
            <el-table-column prop="stockInfo.insidePackageCount" label="箱内件数" align="center"></el-table-column>
            <el-table-column prop="stockInfo.weight" label="毛重" align="center"></el-table-column>
            <el-table-column prop="stockInfo.volume" label="体积" align="center"></el-table-column>
            <el-table-column label="仓库位置" align="center">
              <template slot-scope="scope">
                {{scope.row.grideReq.kuName}} -> {{scope.row.grideReq.cangName}} -> {{scope.row.grideReq.guiName}} -> {{scope.row.grideReq.weiName}}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-row type="flex" class="mt20" justify="end">
      <el-button size="small" type="primary" @click="submit">提交</el-button>
      <el-button size="small" type="primary" @click="back">取消</el-button>
    </el-row>

    <!--添加货物-->
    <el-dialog
      title="添加货物"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="100px" :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="货物名称" prop="stockInfo.goodsName">
          <el-input v-model.trim="addForm.stockInfo.goodsName" :maxlength="50" placeholder="请输入货物名称"></el-input>
        </el-form-item>
        <el-form-item label="包装箱号" prop="boxSn">
          <el-input v-model.trim="addForm.stockInfo.boxSn" placeholder="请输入包装箱号"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model.trim="addForm.stockInfo.number" :maxlength="10" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="箱内件数" prop="insidePackageCount">
          <el-input v-model.trim="addForm.stockInfo.insidePackageCount" :maxlength="10" placeholder="请输入箱内件数"></el-input>
        </el-form-item>
        <el-form-item label="毛重" prop="weight">
          <el-input v-model.trim="addForm.stockInfo.weight" :maxlength="50" placeholder="请输入毛重"></el-input>
        </el-form-item>
        <el-form-item label="体积" prop="volume">
          <el-input v-model.trim="addForm.stockInfo.volume" placeholder="请输入体积"></el-input>
        </el-form-item>
        <el-form-item label="仓库位置">
          <el-select v-model="addForm.grideReq.warehouseId" clearable placeholder="请选择库" size="medium" style="width: 110px;" >
            <el-option v-for="(item, index) in kuList" :key="index" :label="item.name" :value="item.id" @click.native="selectKu(item)">
            </el-option>
          </el-select>
          <el-select v-model="addForm.grideReq.houseId" clearable placeholder="请选择仓" size="medium" style="width: 110px;">
            <el-option v-for="(item, index) in cangList" :key="index" :label="item.name" :value="item.id" @click.native="selectCang(item)">
            </el-option>
          </el-select>
          <el-select v-model="addForm.grideReq.cabinetId" clearable placeholder="请选择柜" size="medium" style="width: 110px;">
            <el-option v-for="(item, index) in guiList" :key="index" :label="item.name" :value="item.id" @click.native="selectGui(item)">
            </el-option>
          </el-select>
          <el-select v-model="addForm.grideReq.grideId" clearable placeholder="请选择位" size="medium" style="width: 110px;">
            <el-option v-for="(item, index) in weiList" :key="index" :label="item.name" :value="item.id"
                       :disabled="item.disabled" @click.native="selectWei(item)">
            </el-option>
          </el-select>
          <el-row>
            <el-col :span="4" >
              <p>仓位信息：</p>
            </el-col>
            <el-col :span="20">
              <p v-if="stockInfos">仓位名称：[{{stockInfos.name}}] &nbsp;&nbsp;&nbsp;   尺寸：[{{stockInfos.length}} x {{stockInfos.wide}} x {{stockInfos.high}}]</p>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" size="small" @click="confirm('addForm')">确 认</el-button>
          <el-button type="primary" size="small" @click="closeDialog('addForm')">取 消</el-button>
        </div>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
  import { Org } from "@/model/Org";
  import Api from "@/api/index";
  import ValidForm from "@/utils/ValidForm";

  export default {
    name: "StorageAdd",
    components: {

    },
    props: [],
    data: function() {
      return {
        canClick: false,
        num: '',
        date: '',
        isShowTree: false,
        dialogVisible: false,
        projectCode: '',
        projectName: '',
        projectList: [],
        stockInfos: '',
        listData: [],
        editForm: {
          roleId: "",
          orgId: "",
          projectCode: "",
          realname: "",
          type: "",
          goodsName: "",
          projectName: "",
          contractNumber: "",
          attachments: []
        },
        addForm: {
          // 库存信息
          stockInfo: {
            goodsName: ''
          },
          // 位置信息
          grideReq: {
            channel: '003', // 入库途径,001:项目任务入库 002:项目任务出库 003:手动入库 004:手动出库 005:移库入库 006:移库出库
            goodsType: '', // 货物类型 1:艺术品2：国内航材3:国际航材4:包裹
            taskTargetId: '',
            projectCode: ''
          },
        },
        kuList: [],
        cangList: [],
        guiList: [],
        weiList: [],
        // 记录已选中的位，用于做位列表的过滤
        selectedWeiList: [],
        rules: {
          'stockInfo.goodsName': [{ required: true, message: "请填写货物名称", trigger: "blur" }],
          orgId: [
            { required: true, message: "请选择隶属机构", trigger: "change" }
          ],
          username: [
            { required: true, message: "请输入登录账号", trigger: "blur" }
          ],
          realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
          mobile: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            { pattern: ValidForm.mobileReg, message: "请正确输入手机号码" }
          ],
          type: [
            { required: true, message: "请选择证件类型", trigger: "change" }
          ],
          identityCard: [
            { required: true, message: "请输入证件号", trigger: "change" },
            {
              pattern: ValidForm.identityCardReg,
              message: "请正确输入证件号码!",
              trigger: "change"
            }
          ],
          email: [
            {
              pattern: ValidForm.emailReg,
              message: "请正确输入电子邮件!",
              trigger: "change"
            }
          ]
        }
      };
    },
    computed: {
      customerTypeList() {
        return [];
        //return this.$store.state.dictionary.dists.UserType.children;
      },
      roleList() {
        return [];
        //return this.$store.state.role.roleList;
      },
      orgList() {
        return this.$store.state.organization.allOrganizationInfo;
      }
    },
    mounted() {
      // 项目列表
      Api.projectAll({}).then(data => {
        this.projectList = data;
      })
      // 库列表
      Api.selectWarehouseInfoList({}).then((res) => {
        if (res) {
          this.kuList = res
        }
      })

    },
    methods: {
      //返回跳转
      back(){
        this.$router.push({path: '/router/storage'})
      },

      addGoods () {
        /*if (this.num == 0) {
          this.$notify.warning({
            title: '提示',
            message: '已没有可用的位置，不能再添加货物'
          })
          return
        }*/
        this.dialogVisible = true
      },
      /**
       * 选择项目
       */
      selectProject (item) {
        this.addForm.grideReq.projectCode = item.projectCode
        this.addForm.grideReq.projectName = item.projectName
        this.projectName = item.projectName
      },
      /**
       * 点击库加载仓列表
       * */
      selectKu (item) {
        this.stockInfos = item
        this.$set(this.addForm.grideReq, 'kuName', item.name)
        Api.queryHouseInfoListByWarehouseId({
          id: item.id,
          code: item.code
        }).then((res) => {
          if (res) {
            this.cangList = res
          }
        })
      },
      /**
       * 点击仓加载柜列表
       * */
      selectCang (item) {
        this.stockInfos = item
        this.$set(this.addForm.grideReq, 'cangName', item.name)
        Api.queryCabinetInfoListByHouseId({
          id: item.id,
          code: item.code
        }).then((res) => {
          if (res) {
            this.guiList = res
          }
        })

      },
      /**
       * 点击柜加载位列表
       * */
      selectGui (item) {
        this.stockInfos = item
        this.$set(this.addForm.grideReq, 'guiName', item.name)
        Api.queryEmptyGrideListByCabinetId({
          id: item.id,
          code: item.code
        }).then((res) => {
          if (res) {
            this.weiList = res
            let _this = this
            this.weiList.forEach(function (item) {
              _this.selectedWeiList.forEach(function (item1) {
                if (item.id === item1.id) {
                  _this.$set(item, 'disabled', true)
                } else {
                  _this.$set(item, 'disabled', false)
                }
              })
            })
          }
        })


      },
      /**
       * 点击位加载位信息
       * */
      selectWei (item) {
        this.stockInfos = item
        this.$set(this.addForm.grideReq, 'weiName', item.name)
        this.selectedWeiList.push(item)
      },


      /**
       *
       */
      confirm(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.listData.push(this.addForm)
            this.dialogVisible = false
          } else {
            return false;
          }
        });
      },
      /**
       * 手动入库的提交
       * */
      submit () {
        Api.manualAddStocak(this.listData).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '入库提交成功'
            })
            this.listData = []
            this.$router.push({path: '/router/storage'})
          }
        })
      },
      /**
       * 关闭浮窗
       */
      closeDialog: function(formName) {
        this.$refs[formName].resetFields();
        this.addForm= {
          // 库存信息
          stockInfo: {
            goodsName: ''
          },
          // 位置信息
          grideReq: {
            channel: '003', // 入库途径,001:项目任务入库 002:项目任务出库 003:手动入库 004:手动出库 005:移库入库 006:移库出库
              goodsType: '', // 货物类型 1:艺术品2：国内航材3:国际航材4:包裹
              taskTargetId: '',
              projectCode: ''
          },
        }
        this.stockInfos = ''
        this.dialogVisible = false
      },
      /**
       * 发送信息
       */
      sendMessage(info, type) {
        const message = { value: info, type: type, time: new Date() };
        this.$store.dispatch("setMessageList", message);
      }
    }
  };
</script>
<style lang="scss">
  .el-timeline {
    margin:0;
    padding:0;
  }
</style>
