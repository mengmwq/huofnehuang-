<template>
<div>
  <el-row type="flex" :gutter="20" >
    <el-col :span="8">
      <div class="title text-center">机构树</div>
      <div class="border">
        <div class="orgTree">
          <span v-showBtn data-authority-type="base-btn">
            <el-input placeholder="组织机构名称" v-model="searchTreeName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </span>
          <el-tree
            :data="orgInfoList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="orgTree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="nodeClick">
            <div class="tree-node" slot-scope="{ node, data }">
              <span :title="node.label">{{ getOrgName(node.label) + '(' + data.number + ')' }}</span>
              <span>
              <el-button
                size="mini"
                type="primary"
                circle
                v-showBtn data-authorityType="add-btn"
                icon="el-icon-plus"
                @click="() => append(data)">
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
    <el-col :span="16" class="orgMain">
    <div class="tab-nav">
      <div class="nav-item tab">
        <span :class="tabIndex === 0 ? 'tab-active' : ''">基本信息</span>
      </div>
    </div>
    <div class="border content" v-if="tabIndex === 0">
        <el-form label-width="120px"  :model="editForm" :rules="rules" ref="editForm" class="demo-form-inline">
          <el-row>
            <el-col :span="12">
              <el-form-item label="*名称：">
                <el-input v-model.trim="editForm.orgName" :maxlength="20" placeholder="手动填写"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门负责人：">
                <el-input v-model.trim="editForm.uId" :maxlength="20" placeholder="手动填写"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主管业务：">
                <el-input v-model.trim="editForm.bussiness" :maxlength="200" placeholder="手动填写"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第一责任人：">
                <span>{{editForm.fplName ? editForm.fplName : '无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话：">
                <span>{{editForm.fplPhone ? editForm.fplPhone : '无'}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第二责任人：">
                <span>{{editForm.splName ? editForm.splName : '无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话：">
                <span>{{editForm.splPhone ? editForm.splPhone : '无'}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item size="large" class="tar mt20">
            <template v-if="editForm.orgId">
              <!--<el-button type="primary" v-if="editForm.number==='0'" @click.stop="addPerson">添加人员</el-button>-->
              <el-button type="primary" v-showBtn data-authorityType="submit-btn" @click.stop="showPerson">部门人员</el-button>
            </template>
            <el-button type="primary" v-else :disabled="!editForm.orgId" v-showBtn data-authorityType="submit-btn" @click.stop="showPerson">部门人员</el-button>
            <el-button type="primary" v-showBtn data-authorityType="submit-btn" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
  
   <transition name="el-fade-in-linear">
      <Person v-if="isShowPerson" :isShowPerson="isShowPerson" :org="editForm" @closeDialog="closeDialog" @personChange="personChange"></Person>
   </transition>
</div>
</template>
<script>
  import ValidForm from "@/utils/ValidForm";
  import Api from '@/api/index'
  import moment from 'moment'
  import * as filters from '@/filters/filter'
  import Person  from './Person'
  export default {
    components:{
      Person
    },
    watch: {
      searchTreeName (val) {
        this.$refs.orgTree.filter(val)
      }
    },
    props:{
      isShowPerson:{
        type:Boolean
      },
    },
    data () {
      return {
       // isShowPerson:false, //是否显示部门人员
        orgName: '',
        tabIndex:0,
        editForm: {},
        searchTreeName: "",
        orgInfoList: [],
        defaultProps: {
          children: 'childrens',
          label: 'orgName'
        },
        imageUrl:'',
        query: {
          pageSize: 10,
          pageNum: 1,
          name: '',
          orgId:'',
        },
        addForm: {
          picKey: '',
          uCode: '',
          loginAccount: '',
          uName: '',
          tel: '',
          pwd: '',
          orgId: '',
          roleId: '',
          positionId: '',
          uClass: '',
          isLeaderLevel: false,
          email: '',
          englishName: '',
          delFlg: '',
          sex: ''
        },
        dialogVisible:false,
        total:0,
        listLoading: false,
        userListData:[],
        /** 性别 */
        SexType: [],
        /** 账号状态 */
        DelFlagStatus: [],
        /** 责任人列表 */
        UserClassType: [],
        /** 岗位 */
        postList: [],
        /** 岗位 */
        jobList: [],
        
        canClick: false,
        rolesArr: [],
        userOrgs: [],
        treeData: [],
        operateFlag:'',
        orgId:'',
        expandedKeys: [],
        checkedKeys: [],
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
        rules: {
          name: [
            {
              required: true,
              message: "请输入机构名称",
              trigger: ["blur", "change"],
            }
          ],
          type: [
            {required: true, message: "请选择机构类型", trigger: "change"}
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
          orgTel: [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
        }
      };
    },
    mounted () {
      this.getOrganizationInfoList()
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.SexType) {
          this.SexType = distsObj.SexType.children
        }
        if (distsObj.DelFlagStatus) {
          this.DelFlagStatus = distsObj.DelFlagStatus.children
        }
        if (distsObj.UserClassType) {
          this.UserClassType = distsObj.UserClassType.children
        }
      }
      Api.getRolePage({pageNum:1, pageSize: 20000}).then(data => {
        this.postList = data.records
      })
      Api.getPositionPage({pageNum:1, pageSize: 20000}).then(data => {
        this.jobList = data.records
      })
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      });
    },
    methods: {
      getOrgName(orgName){
         return orgName.length>10?orgName.substring(0,10)+'...':orgName
      },
      personChange(){
        this.getOrganizationInfoList()
      },
      closeDialog(){
        //this.isShowPerson = false
        this.$emit('showMask',false)
      },
      showPerson(){
         const orgId = this.editForm.orgId
         if(orgId){
           //this.isShowPerson = true
           this.$emit('showMask',true)
         }
         
      },
      addPerson(){
        this.$router.push({
          path:'/router/userManageList',
        })
      },
      changeTabData (index) {
        this.tabIndex = index
        // if(index === 1){
        //   this.query.orgId = this.editForm.orgId
        //   this.userLoadData();
        // } 
      },
      /**
       * 获取机构树
       */
      getOrganizationInfoList () {
        Api.getTreeFormOrgInfo().then((res) => {
          if (res) {
            this.orgInfoList = res
          }
        })
      },
      /**
       * 节点点击事件
       */
      nodeClick (data) {
        console.log(data,'nodeClick')
        this.editForm = data;
        // if(this.tabIndex === 1){
        // 	this.query.orgId = this.editForm.orgId
        // 	this.userLoadData();
        // }
      },
      handleClick(data, checked, node){
        if(checked == true){

          /**通过组织id获取用户类型**/
          Api.getUserTypesListByOrgId({orgId: data.orgId}).then((res) => {
            if(res){
              // addForm.uClass
              this.rolesArr = res
            }
          })

          this.addForm.orgId = data.orgId;
          this.addForm.orgName = data.orgName;
          this.orgId = data.orgId;
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        } else {
          this.orgId = ''
          this.orgName = ''
          this.addForm.orgId = ''
        }
      },
      /**
       * 树节点过滤查询
       */
      filterNode (value, data) {
        if (!value) return true
        return data.orgName.indexOf(value) !== -1;
      },
      /**
       * 增加节点
       */
      append (data) {
        this.editForm = {
          parentOrgId: data.orgId
        }
        event.stopPropagation();
      },
      /**
       * 删除节点
       */
      remove (data) {
        const params = {
          orgId: data.orgId
        };
        this.$confirm(`确认删除【${data.orgName}】吗？`, "提示", {
          type: "warning"
        }).then(() => {
            Api.deleteOrg(params).then(res => {
              if (res) {
                this.getOrganizationInfoList();
                this.$notify.success({
                  title: '提示',
                  message: `删除机构【${data.orgName}】成功`
                })
              }
            });
        }).catch(err => {});
      },
      /**
       * 确定
       */
      onSubmit () {
      	if(!this.editForm.orgName){
      		return
      	}
        if (this.editForm.orgId) {
          // 编辑
          Api.updateOrg(this.editForm).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '修改组织机构成功'
              })
              this.getOrganizationInfoList()
            }
          })
        } else {
          // 新增
          Api.addOrg(this.editForm).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '添加组织机构成功'
              })
              this.getOrganizationInfoList()
            }
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .orgMain {
    .tab-nav{
      margin:0;
    }
    .tab-nav > .nav-item{
      height:36px;
      line-height: 36px;
    }
  }
  
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
    height: 450px;
    padding: 20px;
    overflow: auto;
  }

  .title {
    background: #c1272d;
    //padding: 5px 10px;
    color: #fff;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
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
    .userFloating{
      position:absolute;
	  right:0;
	  top:30%;
	  height:50px;
	  width:50px;
	  background:red;
    }
  }
</style>

