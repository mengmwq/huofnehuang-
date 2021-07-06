<template>
  <div>
    <el-row type="flex" :gutter="20">
      <el-col :span="7">
        <div class="title text-left">添加角色</div>
        <div class="border">
          <div class="orgTree">
            <el-row>
              <el-col :span="24" class="text-left"
                ><span>角色名称：</span></el-col
              >
              <el-col :span="24">
                <el-input
                  placeholder="角色名称"
                  v-model="addForm.roleName"
                ></el-input>
              </el-col>
            </el-row>
            <el-row class="m10">
              <el-col :span="24">
                <el-input
                  placeholder="描述"
                  :rows="6"
                  type="textarea"
                  maxlength="500"
                  show-word-limit
                  v-model="addForm.roleDescription"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="title text-left">权限设置</div>
        <div class="border content">
          <el-row class="mb10">
            <el-col :span="24" class="text-left">
              <el-button-group>
                <el-button
                  :type="treeType === 1 ? 'primary' : 'default'"
                  @click="treeType = 1"
                  >UI资源</el-button
                >
                <el-button
                  :type="treeType === 2 ? 'primary' : 'default'"
                  @click="treeType = 2"
                  >组织机构</el-button
                >
                <el-button
                  :type="treeType === 3 ? 'primary' : 'default'"
                  @click="treeType = 3"
                  >appUI资源</el-button
                >
              </el-button-group>
            </el-col>
          </el-row>
          <div>
            <!-- UI资源 -->
            <el-row :gutter="20" v-show="treeType === 1">
              <el-col :span="20">
                <el-tree
                  style="height: 800px; overflow-y: scroll"
                  :data="uiData"
                  ref="uiTree"
                  show-checkbox
                  node-key="id"
                  @check="check"
                  :props="{ label: 'name', children: 'childrenResources' }"
                  :render-content="renderContent"
                  :default-checked-keys="uiCheckedKeys"
                >
                </el-tree>
              </el-col>
              <el-col :span="4">
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="unfold('uiTree')"
                    >全部展开</el-button
                  >
                </p>
                <p>
                  <el-button type="primary" size="small" @click="fold('uiTree')"
                    >全部收缩</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="selectAll('uiTree')"
                    >全&emsp;&emsp;选</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="unSelectAll('uiTree')"
                    >取消全选</el-button
                  >
                </p>
              </el-col>
            </el-row>
            <!-- 组织机构 -->
            <el-row :gutter="20" v-show="treeType === 2">
              <el-col :span="20">
                <el-tree
                  style="height: 800px; overflow-y: scroll"
                  :data="data"
                  ref="orgTree"
                  show-checkbox
                  node-key="orgId"
                  @check="(data, item) => (this.checkedKeys = item.checkedKeys)"
                  :props="{ label: 'orgName', children: 'childrens' }"
                  default-expand-all
                  :default-checked-keys="checkedKeys"
                >
                </el-tree>
              </el-col>
              <el-col :span="4">
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="unfold('orgTree')"
                    >全部展开</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="fold('orgTree')"
                    >全部收缩</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="selectAll('orgTree')"
                    >全&emsp;&emsp;选</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="unSelectAll('orgTree')"
                    >取消全选</el-button
                  >
                </p>
              </el-col>
            </el-row>
            <!-- appUI资源 -->
            <el-row :gutter="20" v-show="treeType === 3">
              <el-col :span="20">
                <el-tree
                  style="height: 800px; overflow-y: scroll"
                  :data="uiAppData"
                  ref="uiAppTree"
                  show-checkbox
                  node-key="id"
                  @check="
                    (data, item) => (this.appCheckedKeys = item.checkedKeys)
                  "
                  :props="{ label: 'name', children: 'childrenAppResources' }"
                  :render-content="appRenderContent"
                  :default-checked-keys="appCheckedKeys"
                >
                </el-tree>
              </el-col>
              <el-col :span="4">
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="unfold('uiAppTree')"
                    >全部展开</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="fold('uiAppTree')"
                    >全部收缩</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="selectAll('uiAppTree')"
                    >全&emsp;&emsp;选</el-button
                  >
                </p>
                <p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="unSelectAll('uiAppTree')"
                    >取消全选</el-button
                  >
                </p>
              </el-col>
            </el-row>
          </div>
          <el-row class="m10">
            <el-col :span="24" class="text-right">
              <el-button type="primary" size="small" @click="$router.go(-1)"
                >返回</el-button
              >
              <el-button type="primary" size="small" @click="confirm"
                >确认</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from "@/api/index";

export default {
  data() {
    return {
      addForm: {
        roleName: "",
        roleDescription: "",
      },
      treeType: 1,
      expandedKeys: [],
      uiExpandedKeys: [],
      checkedKeys: [],
      uiCheckedKeys: [],
      appCheckedKeys: [],
      orgIds: [],
      resourceIds: [],
      data: [],
      uiData: [],
      uiAppData: [],
    };
  },
  watch: {
    uiData: function (value) {
      if (value.length > 0) {
        if (this.addForm.resourceIds) {
          let arr1 = this.addForm.resourceIds; //后台返回的id组成的数组
          let newArr1 = [];
          let _this = this;
          arr1.forEach((item) => {
            _this.setUITreeChecked(item, value, newArr1);
          });
          this.uiCheckedKeys = newArr1;
        }
      }
    },
  },
  mounted() {
    // 修改加载数据
    this.addForm.roleId = this.$route.query.roleId;
    // UI资源
    this.getTreeFormUI();
    // 组织机构
    this.getTreeFormOrgInfo();
    // App界面
    this.getAppTreeFormUI();
    if (this.addForm.roleId) {
      this.loadData();
    }
  },

  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class="el-tree-node__label">
          {" "}
          {data.name} -{" "}
          {!data.url ? data.elementId : data.url === "/" ? "" : data.url}{" "}
        </span>
      );
    },
    appRenderContent(h, { node, data, store }) {
      return (
        <span class="el-tree-node__label">
          {" "}
          {data.name} -{" "}
          {!data.url ? data.elementId : data.url === "/" ? "" : data.url}{" "}
        </span>
      );
    },
    getTreeFormUI() {
      Api.getTreeFormUI().then((data) => {
        this.uiData = data;
      });
    },
    getAppTreeFormUI() {
      Api.getAPPTreeFormUI().then((data) => {
        this.uiAppData = data;
      });
    },
    getTreeFormOrgInfo() {
      Api.getTreeFormOrgInfo().then((data) => {
        this.data = data;
      });
    },
    loadData() {
      Api.getRoleById(this.addForm.roleId).then((data) => {
        this.addForm = data;
        if (this.addForm.resourceIds) {
          // this.resourceIds = this.addForm.resourceIds
          let arr1 = this.addForm.resourceIds; //后台返回的id组成的数组
          let newArr1 = [];
          let _this = this;
          arr1.forEach((item) => {
            _this.setUITreeChecked(item, _this.uiData, newArr1);
          });
          this.uiCheckedKeys = newArr1;
        }
        if (data.orgIds) {
          this.orgIds = data.orgIds;
          this.checkedKeys = data.orgIds;
        }
        if (this.addForm.appResourceIds) {
          let arr1 = this.addForm.appResourceIds; //后台返回的id组成的数组
          let newArr1 = [];
          let _this = this;
          arr1.forEach((item) => {
            _this.setUITreeChecked(item, _this.uiAppData, newArr1);
          });
          this.appCheckedKeys = newArr1;
        }
      });
    },
    setOrgTreeChecked(id, data, newArr) {
      let _this = this;
      data.forEach((item) => {
        if (item.orgId == id) {
          if (!item.childrens) {
            newArr.push(item.orgId);
          }
        } else {
          if (item.childrens) {
            _this.setOrgTreeChecked(id, item.childrens, newArr);
          }
        }
      });
    },
    setUITreeChecked(id, data, newArr) {
      let _this = this;
      data.forEach((item) => {
        if (item.id == id) {
          if (!item.childrenResources) {
            newArr.push(item.id);
          }
        } else {
          if (item.childrenResources) {
            _this.setUITreeChecked(id, item.childrenResources, newArr);
          }
        }
      });
    },
    arrayUnique(array) {
      // n为hash表，r为临时数组
      let n = {},
        r = [];
      for (let i = 0; i < array.length; i++) {
        // 如果hash表中没有当前项
        if (!n[array[i]]) {
          // 存入hash表
          n[array[i]] = true;
          // 把当前数组的当前项push到临时数组里面
          r.push(array[i]);
        }
      }
      return r;
    },
    /**
     * 确定
     */
    confirm: function () {
      if (this.addForm.roleName === "") {
        this.$notify.error({
          title: "提示",
          message: "角色名称不能为空",
        });
        return;
      }
      if (this.addForm.roleDescription === "") {
        this.$notify.error({
          title: "提示",
          message: "角色描述不能为空",
        });
        return;
      }
      let _this = this;
      this.addForm.orgIds = this.checkedKeys;
      /*const orghalfCheckedNodes = this.$refs.orgTree.getHalfCheckedNodes()

        orghalfCheckedNodes.map((item) => {
          _this.addForm.orgIds.push(item.orgId)
        })

        const checkKeys = this.$refs.orgTree.getCheckedKeys()
        this.addForm.orgIds = this.addForm.orgIds.concat(checkKeys)
        this.addForm.orgIds = this.arrayUnique(this.addForm.orgIds)*/

      this.addForm.resourceIds = this.uiCheckedKeys;
      const halfCheckedNodes = this.$refs.uiTree.getHalfCheckedNodes();

      halfCheckedNodes.map((item) => {
        _this.addForm.resourceIds.push(item.id);
      });
      const uiCheckKeys = this.$refs.uiTree.getCheckedKeys();
      this.addForm.resourceIds = this.addForm.resourceIds.concat(uiCheckKeys);
      this.addForm.resourceIds = this.arrayUnique(this.addForm.resourceIds);

      this.addForm.appResourceIds = this.appCheckedKeys;
      const checkedNodes = this.$refs.uiAppTree.getHalfCheckedNodes();

      checkedNodes.map((item) => {
        _this.addForm.appResourceIds.push(item.id);
      });
      const checkKeys = this.$refs.uiAppTree.getCheckedKeys();
      this.addForm.appResourceIds = this.addForm.appResourceIds.concat(
        checkKeys
      );
      this.addForm.appResourceIds = this.arrayUnique(
        this.addForm.appResourceIds
      );

      // console.log(this.addForm.resourceIds)
      //获取选中节点

      if (this.addForm.roleId) {
        // 修改
        Api.updateRole(this.addForm).then((data) => {
          if (data === true) {
            this.$notify.success({
              title: "提示",
              message: "修改角色成功",
            });
            //this.$router.push({path: '/router/postList'})
            this.$router.go(-1);
          }
        });
      } else {
        // 添加
        Api.addRole(this.addForm).then((data) => {
          if (data === true) {
            this.$notify.success({
              title: "提示",
              message: "添加角色成功",
            });
            //this.$router.push({path: '/router/postList'})
            this.$router.go(-1);
          }
        });
      }
    },

    /**
     * 选中
     */
    check: function (data, item) {
      this.uiCheckedKeys = item.checkedKeys;
    },

    /**
     * 全部展开
     */
    unfold: function (tree) {
      for (let i = 0; i < this.$refs[tree].store._getAllNodes().length; i++) {
        this.$refs[tree].store._getAllNodes()[i].expanded = true;
      }
    },

    /**
     * 折叠
     */
    fold: function (tree) {
      for (let i = 0; i < this.$refs[tree].store._getAllNodes().length; i++) {
        this.$refs[tree].store._getAllNodes()[i].expanded = false;
      }
    },

    /**
     * 全选
     */
    selectAll: function (tree) {
      let values = [];
      if (tree === "uiTree") {
        this.uiData.forEach((item) => {
          values.push(item.id);
        });
        this.$refs[tree].setCheckedKeys(values);
        this.uiCheckedKeys = this.$refs[tree].getCheckedKeys();
      } else if (tree === "uiAppTree") {
        this.uiAppData.forEach((item) => {
          values.push(item.id);
        });
        this.$refs[tree].setCheckedKeys(values);
        this.appCheckedKeys = this.$refs[tree].getCheckedKeys();
      } else {
        this.data.forEach((item) => {
          values.push(item.orgId);
        });
        this.$refs[tree].setCheckedKeys(values);
        this.checkedKeys = this.$refs[tree].getCheckedKeys();
      }
    },

    /**
     * 取消全选
     */
    unSelectAll: function (tree) {
      if (tree === "uiTree") {
        this.uiCheckedKeys = [];
      } else {
        this.checkedKeys = [];
      }
      this.$refs[tree].setCheckedKeys([]);
    },
  },
};
</script>

<style lang='scss' scoped>
.orgCont {
  .orgTitle {
    margin: 0;
    padding: 0;
  }

  .subTitle {
    font-size: 14px;
    font-weight: 500;
  }

  .departmentBox {
    margin: 0;
    padding: 0;

    dd {
      margin: 0;
      //padding:0;
    }

    .item {
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }
  }
}

.tabBox {
  .el-button--primary {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 10px 40px;
    margin-left: 30px;
  }
}

.orgTree {
  height: 460px;
  padding: 20px;
  overflow: auto;
}

.title {
  background: #383838;
  padding: 5px 10px;
  color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.content {
  background: #eee;
  padding: 20px;
}

.border {
  border: 1px solid #eee;
}

.body {
  padding: 30px 50px 20px 30px;
  height: 450px;
}

.operationBtn {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    margin-bottom: 20px;
    text-align: center;
  }
}

.tree-node {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.treeSearch {
  position: absolute;
  left: 180px;
  top: 70px;
  width: 200px;
  z-index: 999;
}

.treeBox {
  height: 360px;
  overflow: auto;
  background: #eee;

  .el-tree {
    background: #eee;
  }
}
</style>

