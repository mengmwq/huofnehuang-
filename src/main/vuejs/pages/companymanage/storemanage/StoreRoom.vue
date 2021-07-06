<template>
  <div>
    <el-row type="flex" :gutter="20">
      <el-col :span="6">
        <div class="title text-center">仓库树</div>
        <div class="border">
          <div class="orgTree">
          <span v-showBtn data-authority-type="base-btn">
            <el-input placeholder="仓库名称" v-model="searchTreeName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </span>
            <el-tree
              :data="warehouseList"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              class="mt20"
              ref="orgTree"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="nodeClick">
              <div class="tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
              <el-button
                size="mini"
                type="primary"
                circle
                v-showBtn data-authorityType="add-btn"
                icon="el-icon-plus"
                @click="() => add(data)">
              </el-button>
              <el-button
                size="mini"
                type="primary"
                circle
                v-showBtn data-authorityType="delete-btn"
                icon="el-icon-minus"
                @click="() => remove(data)">
              </el-button>
            </span>
              </div>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="tabBox">
          <el-button type="primary" size="large">基本信息</el-button>
        </div>
        <div class="border content">
          <!--新增库--><!--v-if="warehouseList.length == 0"-->
          <v-ku @LoadTree="getTreeList" ref="ku"></v-ku>
          <!--新增仓-->
          <v-cang @LoadTree="getTreeList" v-show="levelFlg==='LevelOne'"
                  ref="cang" :name="name" :warehouseId="warehouseId"></v-cang>
          <!--新增柜-->
          <v-gui @LoadTree="getTreeList" v-show="levelFlg==='LevelTwo'"
                  ref="gui" :name="name" :warehouseId="warehouseId" :houseId="houseId"></v-gui>
          <!--新增位-->
          <v-wei @LoadTree="getTreeList" v-show="levelFlg==='LevelThree'"
                  ref="wei" :name="name" :warehouseId="warehouseId" :houseId="houseId" :cabinetId="cabinetId"></v-wei>
          <!--<el-row class="m10">
            <el-col :span="24" class="text-right">
              <el-button type="primary" size="small">确认</el-button>
            </el-col>
          </el-row>-->
        </div>
      </el-col>
    </el-row>
  </div>

</template>
<script>
  import { Org } from '@/model/Org'
  import Cang from './Cang'
  import Ku from './Ku'
  import Gui from './Gui'
  import Wei from './Wei'
  import ValidForm from '@/utils/ValidForm'
  import Api from '@/api/index'
  export default {
    components: {
      'v-cang': Cang,
      'v-ku': Ku,
      'v-gui': Gui,
      'v-wei': Wei
    },
    watch: {
      searchTreeName (val) {
        this.$refs.orgTree.filter(val)
      }
    },
    computed: {
    },
    data() {
      return {
        addStoreDialog: false,
        editForm: {},
        levelFlg: '',
        searchTreeName: '',
        warehouseList: [],
        defaultProps: {
          children: 'childrensList',
          label: 'name'
        },
        name: '',
        warehouseId: '',
        houseId: '',
        cabinetId: '',
        rules: {
          name: [
            {
              required: true,
              message: "请输入机构名称",
              trigger: ["blur", "change"]
            }
          ],
          type: [
            { required: true, message: "请选择机构类型", trigger: "change" }
          ],
          conName: [
            {
              required: true,
              message: "请输入联系人",
              trigger: ["blur", "change"]
            }
          ],
          conMobile: [
            {
              required: true,
              pattern: ValidForm.mobileReg,
              message: "请正确输入联系电话",
              trigger: ["blur", "change"]
            }
          ],
          loginAccount: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ]
        }
      };
    },
    beforeCreate() {},
    mounted() {
      this.getTreeList()
    },
    methods: {
      /**
       * 获取机构树
       */
      getTreeList () {
        Api.getWarehouseTreeInfo({}).then((res) => {
          if (res) {
            this.warehouseList = res
          }
        })
      },
      /**
       * 节点点击事件
       */
      nodeClick (data) {
        console.log(data)
        // this.editForm = data;
      },
      /**
       * 树节点过滤查询
       */
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1;
      },
      /**
       * 增加节点
       */
      add (data) {
        this.levelFlg = data.levelFlg
        this.name = data.name
        if (data.levelFlg === 'LevelOne') {
          this.warehouseId = data.id
        } else if (data.levelFlg === 'LevelTwo') {
          this.warehouseId = data.warehouseId
          this.houseId = data.id
        } else if (data.levelFlg === 'LevelThree') {
          this.warehouseId = data.warehouseId
          this.houseId = data.houseId
          this.cabinetId = data.id
        }

        event.stopPropagation();
      },
      /**
       * 删除节点
       */
      remove (data) {
        const params = {
          id: data.id
        };

        if (data.levelFlg === 'LevelOne') {
          this.$confirm(`确认删除【${data.name}】吗？`, "提示", {
            type: "warning"
          }).then(() => {
            Api.deleteWarehouseById(params).then(res => {
              if (res) {
                this.getTreeList();
                this.$notify.success({
                  title: '提示',
                  message: `删除【${data.name}】成功`
                })
                this.$refs.ku.loadData()
              }
            });
          }).catch(err => {});

        } else if (data.levelFlg === 'LevelTwo') {
          this.$confirm(`确认删除【${data.name}】吗？`, "提示", {
            type: "warning"
          }).then(() => {
            Api.deleteHouseById(params).then(res => {
              if (res) {
                this.getTreeList();
                this.$notify.success({
                  title: '提示',
                  message: `删除【${data.name}】成功`
                })
                this.$refs.cang.loadData()
              }
            });
          }).catch(err => {});

        } else if (data.levelFlg === 'LevelThree') {
          this.$confirm(`确认删除【${data.name}】吗？`, "提示", {
            type: "warning"
          }).then(() => {
            Api.deleteCabinetInfoById(params).then(res => {
              if (res) {
                this.getTreeList();
                this.$notify.success({
                  title: '提示',
                  message: `删除【${data.name}】成功`
                })
                this.$refs.gui.loadData()
              }
            });
          }).catch(err => {});

        } else {
          if (data.status != '0') {
            this.$notify.warning({
              title: '提示',
              message: `【${data.name}】不是空位，不能删除`
            })
            return
          }
          this.$confirm(`确认删除【${data.name}】吗？`, "提示", {
            type: "warning"
          }).then(() => {
            Api.deleteGrideInfoById(params).then(res => {
              if (res) {
                this.getTreeList();
                this.$notify.success({
                  title: '提示',
                  message: `删除【${data.name}】成功`
                })
                this.$refs.wei.loadData()
              }
            });
          }).catch(err => {});

        }
      },
    }
  };
</script>
<style lang="scss" scoped>
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
      padding:10px 40px;
      margin-left:30px;
    }
  }
  .orgTree {
    height: 460px;
    padding: 20px;
    overflow: auto;
  }
  .title {
    background: #c1272d;
    padding: 5px 10px;
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .content {
    background:#eee;
    padding:20px;
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
    width:100%;
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

