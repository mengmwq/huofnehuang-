<template>
  <el-dialog
    :title="approverType==='0'?'选择审批人':'选择抄送人'"
    :visible.sync="isShowDialog"
    :before-close="closeDialog"
    width="50%"
  >
    <el-row class="SelectApprover" type="flex" :gutter="10">
      <el-col :span="12">
        <div class="selectApprover">
          <el-tag
            v-for="tag in selectApprovers"
            :key="tag.pendingApprovalName"
            closable
            @close="handleClose(tag)"
            class="mr10 mb10"
            type="info"
          >{{tag.pendingApprovalName}}</el-tag>
          <div class="customInput">
            <input
              type="text"
              clearable
              v-model="searchForm.name"
              @keyup="getPersonList"
              placeholder="搜索名称、手机号"
            />
            <div class="approversList" v-if="isShowApproverList">
              <!-- <div class="title">企业联系人</div> -->
              <dl
                class="approverItem"
                v-for="(item,index) in approversList"
                :key="index"
                @click="handleApprovalor(item)"
              >
                <dt>
                  <strong>{{item.uName}}</strong>
                </dt>
                <dd class="approvalorDescription">
                  <span>{{item.orgName}}</span>
                  <i>{{item.roleName}}</i>
                </dd>
              </dl>
            </div>
          </div>
          <ol class="pd20 text-danger">
            <li>
                搜索名称，手机号功能仅支持选择人；
            </li>
            <li v-if="approverType==='0'">
              选择人后，不能再选择角色或岗位；
            </li>
            <li v-if="approverType==='0'">
              选择角色或岗位，也是如此！
            </li>
            <li v-if="approverType==='1'">
                抄送人只支持选择人员；
            </li>
            <li>
              删除已选择的，点击名称后“X”删除
            </li>
          </ol>
        </div>
        <div class="mt10 mb10">
          <el-button
            type="primary"
            size="small"
            :disabled="selectApprovers.length==0"
            @click="confirm"
          >确认({{selectApprovers.length}}/50)</el-button>
          <el-button type="default" size="small" @click="closeDialog">取消</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="ApproverGroup" v-if="curTab=='默认'">
          <dl>
            <dt>
              <h4 class="companyName">
                <i class="iconfont icon-zuzhijigou1"></i>
                <strong>{{orgName}}</strong>
              </h4>
            </dt>
            <template v-for="(item,index) in options">
              <dd v-if="!(approverType==='1' && (item==='工作岗位' || item==='角色'))" :key="index" @click="handleTabContent(item)">
                <i class="el-icon-arrow-right"></i>
                <span>按{{item}}选择</span>
              </dd>
            </template>
            
          </dl>
        </div>
        <div class="orgPerson" v-if="curTab!='默认'">
          <h4 class="companyName" @click="handleBackTab">
            <i class="el-icon-arrow-left"></i>
            <strong>{{orgName}}</strong> 
           
          </h4>
          <div  v-if="!isShowPerson" class="mb10 ml10">
             <span  v-if="curSelectApproversTypeName">{{curSelectApproversTypeName}}</span>
          </div>
          <template v-if="!isShowPerson">
            <div class="tabContent" v-if="curTab=='组织机构'">
              <OrgList @dataChange="orgPersonChange" :orgId="orgId"></OrgList>
            </div>
            <div class="tabContent" v-if="curTab=='角色'">
               <!-- <ul class="rolesList">
                  <li v-for="(item,index) in rolesList" :key="index" @click="rolePersonChange(item)">
                     <i class="el-icon-arrow-right"></i>
                     <span>{{item.name}}</span>
                  </li>
               </ul> -->
               <el-checkbox-group v-model="selectedRoles" @change="modifyApprovers('角色')" class="adjustElCheckBox">
                    <el-checkbox  v-for="(item,index) in rolesList" :label="item" :key="index" @click="curTab ='角色'">{{item.roleName}} ({{item.roleDescription}})</el-checkbox>
                  </el-checkbox-group>
            </div>
            <div class="tabContent" v-if="curTab=='工作岗位'">
              <el-checkbox-group v-model="selectedPosts" @change="modifyApprovers('工作岗位')" class="adjustElCheckBox">
                    <el-checkbox  v-for="(item,index) in postList" :label="item" :key="index" @click="curTab ='工作岗位'">{{item.positionName}}</el-checkbox>
                  </el-checkbox-group>
            </div>
          </template>
          <div class="personsBox" v-else>
            <div class="mb10">
              <strong>{{orgName}} </strong>
              /
              <span>{{curPostionName}}</span></div>
            <template v-if="persons.length>0">
                <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <div class="mt10 personsList tabContent">
                <el-checkbox-group v-model="checkedPersons" @change="handleCheckedPersonChange" class="adjustElCheckBox">
                  <el-checkbox
                    v-for="(item,index) in persons"
                    :label="item"
                    :key="index"
                  >
                    <div class="personItem">
                      <span>{{item.uName}}</span>
                      <span style="margin-left:20px;color:#999;">{{item.positionName}}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
            <div v-else class="pd20">暂无人员</div>
          </div>
        </div>
       
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import Api from '@/api/index'
import OrgList from '@/components/org/OrgList'
export default {
  components: {
    OrgList
  },
  computed: {
    // postList(){
    //   return this.$store.state.dictionary.dists.Position.children
    // }
  },
  props: ['isShowDialog', 'editForm', 'approverType','orgId','orgName'],
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      postList: [], // 岗位列表
      selectedRoles: [],
      selectedPosts: [],
      // 人员选择部；
      checkAll: false,
      checkedPersons: [],
      persons: [],
      isIndeterminate: false,
      rolesList: [],
      isShowPerson: false,
      curPostionName: '',
      curTab: '默认',
      options: ['组织机构', '角色', '工作岗位'],
      userInfo: userInfo,
      curApprover: '',
      isShowApproverList: false,
      searchForm: {
        pageSize: 20,
        pageNum: 1,
        name: '',  //用户名称,手机号
        orgId: this.orgId ? this.orgId : ''
      },
      selectApprovers: [],
      approversList: []
    }
  },
  watch: {
    'searchForm.name': function (val) {
      if (!val || val === '工作岗位' || val === '角色') {
        this.approversList = []
      }
    }
  },
  mounted () {},
  methods: {
    // 修改审批人
    modifyApprovers (flag) {
      console.log(flag)
      if (flag === '角色') {
        console.log(this.selectedRoles, ' this.selectedRoles')
        this.selectedRoles.forEach(item => {
          const isHasItem = this.selectApprovers.some(sItem => sItem.pendingApprovalId === item.roleId)
          if (!isHasItem) {
              // pendingApprovalType = 0//待审批类型 0:人1:角色2:岗位
            const row = {
              pendingApprovalType: 1,
              type: this.approverType,  //审批人类型：审批人 0， 抄送人：1
              pendingApprovalId:item.roleId,
              pendingApprovalName:item.roleName,
            }
            this.selectApprovers.push(row)
          }
        })
      } else if (flag === '工作岗位') {
        console.log(this.selectedPosts, ' this.selectedPosts')
        this.selectedPosts.forEach(item => {
          const isHasItem = this.selectApprovers.some(sItem => sItem.pendingApprovalId === item.positionId)
          if (!isHasItem) {
              // pendingApprovalType = 0//待审批类型 0:人1:角色2:岗位
            // item.pendingApprovalType = 2
            // item.pendingApprovalId = item.id ? item.id : item.position
            // item.name = item.position
            //this.selectApprovers.push(item)
            const row = {
              pendingApprovalType: 2,
              type: this.approverType,  //审批人类型：审批人 0， 抄送人：1
              pendingApprovalId:item.positionId,
              pendingApprovalName:item.positionName,
            }
            this.selectApprovers.push(row)
          }
        })
      }
    },
    // 获取岗位列表
    getPositionByOrgId () {
      const params = {
        orgId: this.orgId,
        pageNumber: 1,
        pageSize: 200
      }
      Api.getPositionPageByOrg(params).then(res => {
        this.postList = res
      })
    },
    // 获取角色列表
    getUsingRoleListByOrgId () {
      const params = {
        orgId: this.orgId,
        roleName:''
      }
      Api.getRoleListByOrgId(params).then(res => {
        console.log(res[0],'roleLIst')
        this.rolesList = res
      })
    },
    handleBackTab () {
      this.curTab = '默认'
      this.isShowPerson = false
      this.curPostionName = ''
    },
    handleCheckAllChange (val) {
      console.log(val, 'all')
      this.checkedPersons = val ? this.persons : []
      this.isIndeterminate = false
      this.handlePersonfromOrgList()
      // this.$emit('personChange',this.checkedPersons,'组织机构')
    },
    handleCheckedPersonChange (value) {
      console.log(value, 'personValue')
      let checkedCount = value.length
      this.checkAll = checkedCount === this.persons.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.persons.length
      // this.$emit('personChange',this.checkedPersons,'组织机构')
      this.handlePersonfromOrgList()
    },
    // 从组织机构中选择审批人处理；
    handlePersonfromOrgList () {
      console.log(this.checkedPersons,this.selectApprovers,'this.selectApprovers')
      this.checkedPersons.forEach(item => {
        const isHasItem = this.selectApprovers.some(sItem => sItem.pendingApprovalId === item.uId)
        if (!isHasItem) {
          // item.pendingApprovalType = 0
          // item.pendingApprovalName = item.uName
          const row = {
              pendingApprovalType: 0,
              type: this.approverType,  //审批人类型：审批人 0， 抄送人：1
              pendingApprovalId:item.uId,
              pendingApprovalName:item.uName,
            }
            this.selectApprovers.push(row)
        }
      })
    },
    // 角色人员
    rolePersonChange (item) {
      this.curTab = '角色'
      this.isShowPerson = true
      this.curPostionName = item.name
      this.getPersonList('角色', item.name)
    },
    // 组织人员改变；
    orgPersonChange (item) {
      console.log(item, 'orgPersonChange')
      this.isShowPerson = true
      this.curPostionName = item.orgName
      this.getPersonList('组织机构', item.orgId)
    },
    // 岗位人员
    postPersonChange (item) {
      this.curTab = '工作岗位'
      this.isShowPerson = true
      this.curPostionName = item.cnInfo
      this.getPersonList('工作岗位', '工作岗位')
    },
    handleTabContent (item) {
      let curTab = item
      const selectApprovers = this.selectApprovers
      if(selectApprovers && selectApprovers.length>0){
        //待审批类型 0:人1:角色2:岗位
         const pendingApprovalType = selectApprovers[0].pendingApprovalType
         if(pendingApprovalType===0 && item!=='组织机构'){
            this.$message({
               showClose:true,
               message:'已选择审批人类型是人员，只能按组织机构选择',
               type:'error'
            })
            curTab = '组织机构'
            return;
            
         }else if(pendingApprovalType===1 && item!=='角色'){
            this.$message({
               showClose:true,
               message:'已选择审批人类型是角色，只能按角色选择',
                type:'error'
            })
            curTab = '角色'
            return;
         }else if(pendingApprovalType===2 && item!=='工作岗位'){
            this.$message({
               showClose:true,
               message:'已选择审批人类型是工作岗位，只能按工作岗位选择',
                type:'error'
            })
            curTab = '工作岗位'
            return;
         }
      }
      this.curTab = curTab
      if (curTab == '角色') {
        this.getUsingRoleListByOrgId()
      } else if (curTab == '工作岗位') {
        this.getPositionByOrgId()
      }
      this.curSelectApproversTypeName = '按' + curTab + '选择'
    },
    // 获取人员列表；
    getPersonList (flag, value) {
      let params = this.searchForm
      if (flag == '组织机构') {
        params.orgId = value
      } else if (flag == '角色' || flag == '工作岗位') {
        params.keyword = this.curPostionName
      }
      Api.getUserPageByOrg(params).then(res => {
        if (value) {
          // 区分是来源于组织机构，角色，岗位 ，还是直接搜索人员；
          this.persons = res.records
          this.isShowPerson = true
        } else {
          this.approversList = res.records
          this.isShowApproverList = true
        }
      })
    },

    // 处理选中的审批人
    handleApprovalor (item) {
      console.log(this.approverType)
      this.isShowApproverList = false
      this.searchForm.name = ''
      item.pendingApprovalType = 0
      //this.selectApprovers.push(item)
      // 人员列表中
      const params = {
        pendingApprovalType: 0, //待审批类型 0:人1:角色2:岗位
        type: this.approverType,
        pendingApprovalName: item.uName,
        pendingApprovalId:item.uId,
      };
      this.selectApprovers.push(params);
    },
    handleClose (tag) {
      this.selectApprovers.splice(this.selectApprovers.indexOf(tag), 1)
      this.checkedPersons.splice(this.checkedPersons.indexOf(tag), 1)
    },
    confirm () {
      const selectedApprovers = this.selectApprovers
      // const pendingApprovalType = 0//待审批类型 0:人1:角色2:岗位
      this.$emit('dataChange', selectedApprovers, this.approverType)
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="scss">
.SelectApprover {
  .customInput {
    display: inline-block;
    position: relative;
    input {
      //height:30px;
      padding: 6px;
      outline: 0;
      border: none;
      width: 200px;
      font-size: 15px;
    }
    .approversList {
      position: absolute;
      left: 0;
      top: 36px;
      width: 250px;
      background: #fff;
      border: 1px solid #eee;
      z-index: 500;
      max-height: 300px;
      overflow: auto;
      //padding:10px;
      .title {
        border-bottom: 1px solid #eee;
      }
      .approverItem,
      dd,
      dt {
        margin: 0;
      }
      .approverItem:nth-child(2n-1),
      .approverItem:hover {
        background-color: #eee;
      }
      .approverItem {
        padding: 10px;
      }
    }
  }
  .selectApprover {
    border-right: 1px solid #eee;
    padding: 10px;
    width: 92%;
    height: 360px;
    overflow-y: auto;
  }
  .ApproverGroup {
    dl {
      margin: 0;
      dt {
        margin-bottom: 30px;
      }
      dd {
        font-size: 14px;
        margin: 0px;
        padding-left: 10px;
        height: 45px;
        line-height: 45px;
        cursor: pointer;
        //font-weight: 700;
      }
      dd:hover {
        background: #eee;
      }
    }
    .companyName {
      i {
        color: #c3282f;
        // border-radius: 50%;
        // padding: 8px;
        font-size: 24px;
       // color: #fff;
      }
    }
  }
  .companyName {
    cursor: pointer;
    margin:5px auto;
  }
  .approvalorDescription {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .adjustElCheckBox {
    margin-left:30px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    .el-checkbox {
        height:30px;
    }
    .el-checkbox+ .el-checkbox {
      margin-left: 0;
    }
  }
  .personItem{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rolesList{
    margin:0;
    padding:0;
     li {
       line-height: 2.2;
       list-style: none;
       cursor: pointer;
       margin:0;
       padding-left:20px;
     }
     li:hover  {
       background:#ddd;
     }
  }
  .additional{
    .additionalContent{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-checkbox__label{
        color:#999;
      }
    }

  }
  .tabContent{
    max-height: 350px;
    overflow: auto;
  }
}
</style>
