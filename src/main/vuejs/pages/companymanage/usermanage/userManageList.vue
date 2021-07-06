<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button
          type="primary"
          @click="AddPeople"
          size="medium"
          v-showBtn
          data-authority-type="addUser-btn"
          icon="el-icon-plus"
        >添加人员</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        <el-input
          size="medium"
          clearable
          placeholder="请输入姓名"
          suffix-icon="el-icon-search"
          icon="search"
          v-model="query.name"
          @keyup.enter.native="loadData"
          style="width: 300px;"
        ></el-input>
        <el-button
          type="primary"
          size="medium"
          @click="loadData"
          style="width: 100px;"
          class="btnTop"
        >查询</el-button>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="(header, index) in tableHeader"
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
          <div v-if="header.prop == 'delFlg'">
            <span>{{scope.row.delFlg | accountDelFilter}}</span>
          </div>
          <div v-else-if="header.prop == 'uName'">
            <a href="javascript:;" @click="viewUser(scope.row)">{{scope.row.uName}}</a>
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button v-if="tabIndex===1" type="primary" size="mini" @click="viewUser(scope.row)">查看</el-button> -->
          <el-button
            type="primary"
            v-showBtn
            data-authority-type="editUser-btn"
            size="mini"
            @click="editUser(scope.row)"
          >编辑</el-button>
          <el-button
            type="primary"
            v-showBtn
            data-authority-type="deleteUser-btn"
            size="mini"
            @click="deleteUser(scope.row)"
          >停用</el-button>
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
      <el-button type="primary" size="small" @click="exportExcel">导出Excel</el-button>
    </el-row>
    <!--//查看弹出框-->
    <el-dialog
      title="人员详情"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div>
        <el-row>
          <el-col :span="4">
            <div class="demo-image">
              <div class="block">
                <span class="demonstration"></span>
                <el-image style="width: 100px; height: 100px" :src="imageUrl"></el-image>
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <el-row style="height: 50px">
              <p></p>
              <el-col :span="6">
                <span>员工编号：</span>
                <span>{{currentItem.uCode}}</span>
              </el-col>
              <el-col :span="6">
                <span>姓名：</span>
                <span>{{currentItem.uName}}</span>
              </el-col>
              <el-col :span="6">
                <span>性别：</span>
                <span>{{currentItem.sex | sexFilter}}</span>
              </el-col>
              <el-col :span="6">
                <span>隶属：</span>
                <span>{{currentItem.orgName}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <span>登录账号：</span>
                <span>{{currentItem.loginAccount}}</span>
              </el-col>
              <el-col :span="6">
                <span>账号状态：</span>
                <span>{{currentItem.delFlg | accountDelFilter}}</span>
              </el-col>
              <el-col :span="6">
                <span>手机号码：</span>
                <span>{{currentItem.tel}}</span>
              </el-col>
              <el-col :span="6">
                <span>角色：</span>
                <span>{{currentItem.roleName}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div>
        <div>
          <div class="tab-nav" style="padding: 0 15px;border-bottom: 1px solid #e3e2e2;"></div>
          <div style="padding: 0 15px;">
            <!-- 操作栏 -->
            <el-row :gutter="20" class="m10">
              <el-col :span="24" class="text-right">
                <el-input
                  size="medium"
                  clearable
                  placeholder="项目编码/项目名称"
                  prefix-icon="el-icon-search"
                  icon="search"
                  v-model="query1.searchStr"
                  @keyup.enter.native="loadData"
                  style="width: 200px;"
                ></el-input>
                <el-button
                  type="primary"
                  size="medium"
                  @click="loadData"
                  style="width: 100px;"
                  class="btnTop"
                >查询</el-button>
              </el-col>
            </el-row>
            <!-- table -->
            <el-table
              class="page-table"
              :data="listData1"
              stripe
              highlight-current-row
              v-loading="listLoading"
              :cell-style="{color:'#333'}"
            >
              <el-table-column
                v-for="(header, index) in tableHeader2"
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
                  <div v-if="header.prop == 'projectEvent'">
                    <router-link :to="{path: '/router/'}">{{scope.row.projectEvent}}</router-link>
                  </div>
                  <div v-else-if="header.prop == 'projectCode'">
                    <router-link
                      :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}"
                    >{{scope.row.projectCode}}</router-link>
                  </div>
                  <div v-else-if="header.prop == 'states'">{{scope.row.states|taskStatesFilter }}</div>
                  <div
                    v-else-if="header.prop == 'completionDate'"
                  >{{scope.row.completionDate|timeFormat }}</div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" class="page-box" justify="end">
              <!-- 分页 -->
              <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="query.pageNum1"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="query.pageSize1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1"
              ></el-pagination>

              <el-button type="primary" size="small" @click="exportExcel1">导出excel</el-button>
            </el-row>
          </div>
        </div>
      </div>
      <!-- <div class="dialog-footer text-right" style="margin-top: 20px">
          <el-button type="primary" size="medium" @click="dialogVisible=false" style="width: 100px;" class="btnTop">确认</el-button>
      </div>-->
    </el-dialog>
    <!--//添加人员弹出框-->
    <el-dialog
      :title="operateFlag === 'add' ? '新增人员' : '编辑人员'"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="canClick"
      width="70%"
    >
      <!--上传头像-->
      <el-form
        label-position="right"
        :model="addForm"
        ref="addForm"
        :rules="rules"
        label-width="130px"
      >
        <el-row :gutter="10">
          <el-col :span="4" class="avatar-content">
            <el-upload
              class="avatar-uploader"
              :data="uploadData"
              action="https://up-z0.qiniup.com"
              :show-file-list="false"
              :on-change="onUploadChange"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button type="text" style="width: 150px;" class="btnTop">点击方框上传头像</el-button>
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                <el-form-item label="员工编号：" prop="uCode">
                  <el-input v-model="addForm.uCode" :disabled="operateFlag=== 'update'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中文名：" prop="uName">
                  <el-input v-model="addForm.uName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="性别：" prop="sex">
                  <el-select
                    v-model="addForm.sex"
                    clearable
                    placeholder="请选择性别"
                    size="medium"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(item, index) in SexType"
                      :key="index"
                      :label="item.cnInfo"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="英文名：" prop="englishName">
                  <el-input v-model="addForm.englishName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录账号：" prop="loginAccount">
                  <el-input v-model="addForm.loginAccount" maxlength="11"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录密码：" prop="pwd">
                  <el-input v-model="addForm.pwd"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="隶属：" prop="orgName" class="orgName">
                  <el-select
                    v-model="addForm.orgName"
                    placeholder="请选择机构"
                    size="medium"
                    style="width: 100%;"
                  >
                    <el-option
                      :value="orgId"
                      :label="orgName"
                      style="height: 300px;overflow-y: scroll;padding: 0"
                    >
                      <el-tree
                        :data="treeData"
                        show-checkbox
                        default-expand-all
                        node-key="orgId"
                        ref="orgTree"
                        :props="{label: 'orgName', children: 'childrens'}"
                        :default-expanded-keys="expandedKeys"
                        :default-checked-keys="checkedKeys"
                        :check-strictly="true"
                        @check-change="handleClick"
                        @node-click="nodeClick"
                      ></el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色：" prop="roleId">
                  <el-select
                    v-model="addForm.roleId"
                    clearable
                    placeholder="请选择角色"
                    size="medium"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in postList"
                      :key="item.roldId"
                      :label="item.roleName"
                      :value="item.roleId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码：" prop="tel">
                  <el-input v-model="addForm.tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号状态：" prop="delFlg">
                  <el-select
                    v-model="addForm.delFlg"
                    clearable
                    placeholder="选择账号状态"
                    size="medium"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(item, index) in DelFlagStatus"
                      :key="index"
                      :label="item.cnInfo"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="岗位：" prop="positionId">
                  <el-select
                    v-model="addForm.positionId"
                    clearable
                    placeholder="请选择岗位"
                    size="medium"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in jobList"
                      :key="item.positionId"
                      :label="item.positionName"
                      :value="item.positionId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="员工分类：" prop="uClass">
                  <el-select
                    v-model="addForm.uClass"
                    clearable
                    placeholder="选择员工分类"
                    size="medium"
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(item, index) in UserClassType"
                      :disabled="item.value!== '003' &&  rolesArr.indexOf(item.value) !== -1"
                      :key="index"
                      :label="item.cnInfo"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="邮箱号：" prop="email">
                  <el-input v-model="addForm.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职日期" prop="entryDate">
                  <el-date-picker
                    type="date"
                    placeholder="请选择入职日期"
                    v-model="addForm.entryDate"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    size="medium"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <!--<el-col :span="12">
                <el-form-item label="是否为领导：">
                  <el-switch
                    v-model="addForm.isLeaderLevel"
                    active-color="#13ce66"
                    inactive-color="#aaa">
                  </el-switch>
                </el-form-item>
              </el-col>-->
            </el-row>
          </el-col>
        </el-row>
        <div class="dialog-footer text-center">
          <el-button
            v-if="operateFlag==='add'"
            type="primary"
            size="medium"
            @click="resetForm('addForm')"
            style="width: 100px;"
            class="btnTop"
          >取消</el-button>
          <el-button
            v-else
            type="primary"
            size="medium"
            @click="dialogVisible2=false"
            style="width: 100px;"
            class="btnTop"
          >取消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="onSubmit('addForm')"
            style="width: 100px;"
            class="btnTop"
          >确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ValidForm from "@/utils/ValidForm";
import moment from "moment";
import Api from "@/api/index";
import * as filters from "@/filters/filter";
import { timeFormat } from '../../../filters/filter';
export default {
  data() {
    return {
      canClick: false,
      classifyFlag: false,
      temp: "", //显示。交换
      // 新增/编辑用户标志
      operateFlag: "",
      flag: false,
      orgName: "",
      orgId: "",
      treeData: [],
      expandedKeys: [],
      checkedKeys: [],
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      type: "",
      addForm: {
        picKey: "",
        uCode: "",
        loginAccount: "",
        uName: "",
        tel: "",
        pwd: "",
        orgId: "",
        roleId: "",
        positionId: "",
        uClass: "",
        isLeaderLevel: false,
        email: "",
        englishName: "",
        delFlg: "",
        sex: "",
        entry_date: "",
      },
      isShowDialog: false,
      currentItem: {},
      dialogImageUrl: "",
      query: {
        pageSize: 10,
        pageNum: 1,
        name: "",
      },
      query1: {
        pageSize: 10,
        pageNum: 1,
        executor: "",
        searchStr: "",
      },
      tableHeader: [
        {
          prop: "orgName",
          label: "隶属机构",
          show: true,
          align: "100",
        },
        {
          prop: "uName",
          label: "姓名",
          align: "left",
          show: true,
        },
        {
          prop: "uCode",
          label: "员工编号",
          align: "center",
          show: true,
        },
        {
          prop: "loginAccount",
          label: "登录账号",
          align: "center",
          show: true,
        },
        {
          prop: "roleName",
          label: "角色",
          align: "left",
          show: true,
        },
        {
          prop: "delFlg",
          label: "状态",
          align: "center",
          show: true,
        },
      ],
      tableHeader2: [
        {
          prop: "projectCode",
          label: "项目编码",
          show: true,
          width: "150",
          align: "center",
        },
        {
          prop: "projectName",
          label: "项目名称",
          align: "center",
          show: true,
        },
        {
          prop: "name",
          label: "所做任务",
          align: "center",
          show: true,
        },
        {
          prop: "states",
          label: "完成状态",
          align: "center",
          show: true,
        },
        {
          prop: "completionDate",
          label: "完成时间",
          align: "center",
          show: true,
        },
        {
          prop: "remark",
          label: "备注",
          align: "center",
          show: true,
        },
      ],
      /** 表格数据 */
      listData: [],
      listData1: [],
      multipleSelection: [],
      /** 性别 */
      SexType: [],
      /** 账号状态 */
      DelFlagStatus: [],
      /** 责任人列表 */
      UserClassType: [],
      /** 角色 */
      postList: [],
      /** 岗位 */
      jobList: [],
      /** 总数据数 */
      total: 0,
      /** 查看总数据数 */
      total1: 0,
      /** 表格 loading */
      listLoading: false,
      tabIndex: 1,
      rolesArr: [],
      rules: {
        uCode: [{ required: true, message: "请输入员工编号", trigger: "blur" }],
        uName: [{ required: true, message: "请输入中文名", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { pattern: ValidForm.mobileReg, message: "请输入正确的手机号" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        delFlg: [
          { required: true, message: "请选择账号状态", trigger: "change" },
        ],
        positionId: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
        uClass: [
          { required: true, message: "请选择员工分类", trigger: "change" },
        ],
        loginAccount: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          { pattern: ValidForm.mobileReg, message: "请输入正确的手机号" },
        ],
        email: [
          { required: false, message: "请输入邮箱号", trigger: "blur" },
          { pattern: ValidForm.emailReg, message: "请输入正确的邮箱号" },
        ],
        entryDate: [
          { required: true, message: "请输入入职日期", trigger: "blur" },
        ],
      },
      /** 上传数据 */
      uploadData: {
        token: "",
        key: "",
      },
      fileList: [],
      imageUrl: "",
    };
  },
  mounted() {
    this.loadData();
    if (sessionStorage.getItem("dists")) {
      let distsObj = JSON.parse(sessionStorage.getItem("dists"));
      if (distsObj.SexType) {
        this.SexType = distsObj.SexType.children;
      }
      if (distsObj.DelFlagStatus) {
        this.DelFlagStatus = distsObj.DelFlagStatus.children;
      }
      if (distsObj.UserClassType) {
        this.UserClassType = distsObj.UserClassType.children;
      }
    }
    Api.getRolePage({ pageNum: 1, pageSize: 20000 }).then((data) => {
      this.postList = data.records;
    });
    Api.getPositionPage({ pageNum: 1, pageSize: 20000 }).then((data) => {
      this.jobList = data.records;
    });
    // 组织机构
    Api.getTreeFormOrgInfo().then((data) => {
      this.treeData = data;
    });
    Api.getPicToken().then((data) => {
      this.uploadData.token = data;
    });
  },
  methods: {
    changeTabData(index) {
      this.tabIndex = index;
    },
    /**
     * 新增人员
     * */
    AddPeople() {
      this.imageUrl = "";
      this.addForm = {};
      this.fileList = [];
      this.operateFlag = "add";
      this.dialogVisible2 = true;
    },
    /**
     * 查看详情
     * */
    viewUser(item) {
      this.query1.executor = item.uId;
      this.dialogVisible = true;
      Api.getUserById({ id: item.uId }).then((res) => {
        this.currentItem = res;
      });
      this.addForm.picKey = item.picKey;
      this.getImgUrl(item.picKey);
      this.$set(this.currentItem, "imgUrl", this.imageUrl);
      this.loadData();
    },

    loadData(pageNum = 1) {
      if (typeof pageNum == "object") {
        this.query1.pageNum = 1;
      } else {
        this.query1.pageNum = pageNum;
      }
      Api.getTaskInfosByUserId(this.query1).then((res) => {
        this.listData1 = res.records;
        this.total1 = res.total;
      });
    },
    /**
     * 编辑人员
     * */
    editUser(item) {
      this.getImgUrl(item.picKey);
      this.operateFlag = "update";
      this.addForm = JSON.parse(JSON.stringify(item));
      console.log( this.addForm,'编辑的数据')
      this.addForm.entryDate= timeFormat(this.addForm.entryDate)
      // this.addForm.orgId = item.orgName
      this.dialogVisible2 = true;
    },
    /**
     * 停用人员
     * */
    deleteUser(item) {
      this.$confirm("您确定要停用改用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Api.deleteUser({ uid: item.uId }).then((res) => {
            if (res) {
              this.loadData();
              this.$notify.success({
                title: "提示",
                message: "停用成功",
              });
            } else {
              this.$notify.warning({
                title: "提示",
                message: "停用失败",
              });
            }
          });
        })
        .catch(() => {});
    },
    upheadPhoto() {
      this.dialogVisible3 = true;
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
    },
    /**
     * 加载用户列表
     */
    loadData(pageNum = 1) {
      if (typeof pageNum == "object") {
        this.query.pageNum = 1;
      } else {
        this.query.pageNum = pageNum;
      }
      this.listLoading = true;
      Api.getUserPage(this.query).then((res) => {
        if (res) {
          this.listData = res.records;
          this.total = res.total;
        }
      });
      this.listLoading = false;
    },
    /**
     * 添加用户
     * */
    onSubmit(formName) {
      if (!this.addForm.orgId) {
        this.$notify.warning({
          title: "提示",
          message: "请选择隶属机构",
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.operateFlag === "add") {
            this.insertUser();
          } else {
            this.updateUser();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 新增用户
     * */
    insertUser() {
      this.addForm.isLeaderLevel =
        this.addForm.isLeaderLevel === true ? "1" : "0";
      Api.addUser(this.addForm).then((res) => {
        if (res) {
          this.loadData();
          this.$notify.success({
            title: "提示",
            message: "人员添加成功",
          });
          this.dialogVisible2 = false;
          this.fileList = [];
          this.uploadData = {};
        }
      });
    },
    /**
     * 编辑用户
     * */
    updateUser() {
      this.addForm.isLeaderLevel =
        this.addForm.isLeaderLevel === true ? "1" : "0";
      Api.updateUser(this.addForm).then((res) => {
        if (res) {
          this.loadData();
          this.$notify.success({
            title: "提示",
            message: "人员修改成功",
          });
          this.dialogVisible2 = false;
        }
      });
    },
    /**
     * 添加用户表单重置
     * */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible2 = false;
    },
    handleClick(data, checked, node) {
      if (checked == true) {
        /**通过组织id获取用户类型**/
        Api.getUserTypesListByOrgId({ orgId: data.orgId }).then((res) => {
          if (res) {
            // addForm.uClass
            this.rolesArr = res;
          }
        });

        this.addForm.orgId = data.orgId;
        this.addForm.orgName = data.orgName;
        this.orgId = data.orgId;
        this.orgName = data.orgName;
        this.$refs.orgTree.setCheckedNodes([data]);
      } else {
        this.orgId = "";
        this.orgName = "";
        this.addForm.orgId = "";
      }
    },
    nodeClick(data, checked, node) {
      if (checked) {
        this.addForm.orgId = data.orgId;
        this.addForm.orgName = data.orgName;
        this.orgId = data.orgId;
        this.orgName = data.orgName;
        this.$refs.orgTree.setCheckedNodes([data]);
      } else {
        this.orgId = "";
        this.orgName = "";
        this.addForm.orgId = "";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    columnChange: function (data) {
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
    canSelected(row, index) {
      if (row.jobState === "TCQX" || row.jobState === "MDPB") {
        return 0;
      } else {
        return 1;
      }
    },
    /* handleSuccess (res, file) {
        this.addForm.picKey = res.key
        this.getImgUrl(res.key)
      },*/
    onUploadChange(file) {
      let fileName = file.name;
      if (fileName && fileName.lastIndexOf(".") != -1) {
        let fileType = fileName.substring(
          fileName.lastIndexOf("."),
          fileName.length
        );
        this.uploadData.key = new Date().getTime() + fileType;
      }
    },
    handleAvatarSuccess(res, file) {
      this.addForm.picKey = res.key;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    getImgUrl(key) {
      this.imageUrl = "";
      if (key) {
        Api.getUrl(key).then((data) => {
          if (data) {
            this.imageUrl = data;
            //this.fileList = [{url: data}];
          }
        });
      }
    },

    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    /**
     * 重置筛选条件
     * */
    cleanFilters() {
      this.name = "";
      this.query.pageNum = 1;
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.loadData(val);
    },
    handleSizeChange1(val) {
      this.query1.pageSize = val;
      this.loadData();
    },
    handleCurrentChange1(val) {
      this.query1.pageNum = val;
      this.loadData(val);
    },
    /**
     * 导出excel
     */
    exportExcel() {
      if (this.listData.length > 0) {
        let arr = this.listData;
        arr.forEach(function (item) {
          item.delFlg = item.delFlg === "1" ? "停用" : "启用";
        });
        let param = {
          tableHead: this.tableHeader,
          data: arr,
        };
        Api.downloadExcel(param).then((res) => {
          if (res) {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = (e) => {
              let a = document.createElement("a");
              a.download = "用户列表数据.xlsx";
              a.href = e.target.result;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };
          }
        });
      }
    },
    exportExcel1() {
      if (this.listData1.length > 0) {
        let data = this.listData1;
        data.forEach(function (item) {
          item.states = filters.taskStatesFilter(item.states);
        });
        let param = {
          tableHead: this.tableHeader2,
          data: this.listData1,
        };
        Api.downloadExcel(param).then((res) => {
          if (res) {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = (e) => {
              let a = document.createElement("a");
              a.download = "人员任务数据.xlsx";
              a.href = e.target.result;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 178px;
  text-align: center;
}
.orgName {
  position: relative;
}
.orgName:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 77px;
  top: 14px;
}
</style>
