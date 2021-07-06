<template>
  <el-dialog
      title="角色权限"
      :visible.sync="isShowDialog"
      :before-close = "closeDialog"
      :close-on-click-modal="canClick"
      width="50%">
      <el-form label-width="100px" :model="editForm"  ref="editForm" class="demo-form-inline">
            <el-tabs type="border-card">
            <el-tab-pane label="UI资源" style="height:300px;overflow:auto">
                <el-tree ref="uiTree" @check="uiTreeCheck"
                        :data="uiTree"
                        show-checkbox
                        node-key="id"
                        class="roleTabbox"

                        :render-content="renderContent"
                        :check-strictly="ui_strictly"
                        :default-expanded-keys="expandedKeys"
                        :default-expand-all="false"
                        :default-checked-keys="checkedKeys"
                        :props="uiTreeProps">
                </el-tree>
            </el-tab-pane>
            <el-tab-pane label="业务控制" >
                <!-- <el-tree ref="dataTree" @check="daraTreeCheck"
                        :data="dataTree"
                        show-checkbox
                        class="roleTabbox"
                        node-key="id"
                        :default-expanded-keys="expandedDataKeys"
                        :default-expand-all="false"
                        :default-checked-keys="checkedDataKeys"
                        :props="dataTreeProps">
                </el-tree>    -->
            </el-tab-pane>
            </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确认</el-button>
        <el-button type="success" size="small" @click="closeDialog">取消</el-button>
      </div>
  </el-dialog>
</template>
<script>
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'
  import {UiResources} from '@/model/UiResources'
  export default {
    name: 'RoleAuthorityEdit',
    components: {},
    computed: {
      uiTree() {
        return this.$store.state.resourceInfo.allResourceInfo;
      },
      dataTree() {
      //return this.$store.state.organization.allOrganizationInfo;
      return []
      }
    },
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        canClick: false,
        dataTreeProps: {
            children: 'childrenOrgs',
            label: 'name'
        },
        ui_strictly: false,
        loadingBtn:false,
        uiTreeProps: {
            children: 'childrenResources',
            label: 'name'
        },
        expandedKeys: [],
        expandedDataKeys: [],
        showUiTree: true,
        showDataTree: true,
        checkedKeys: [],
        checkedDataKeys: []
      }
    },
    mounted () {
        /**
        * 获取UI资源树
        */
      this.$store.dispatch('selectAllResourceInfo')
    /**
     *  UI数据回显  : 只需要处理全选中的即可
     */
     this.checkedKeys = this.editForm.resourceIdsShow
      this.getRoleByRoleId(this.editForm.id)
    },
    methods: {
      /**
       * 通过roleId 获取业务控制数据
       */
      getRoleByRoleId(roleId){
         if(roleId){
            const params = {id :roleId}
             Api.getRoleById(params).then(res=>{
                if(res){
                    console.log(res.data,'role')
                }
             })
         }
      },
      submitForm(editForm){
        let fn = editForm.id ? 'updateRole' : 'insertRoleInfo'
        Api[fn](editForm).then(res=>{
            if(res){
                this.$message({
                showClose: true,
                type: 'success',
                message:`权限【${editForm.name}】添加成功`
              });
              this.closeDialog();
            }
        })
      },
      /**
       * 确认保存 ： 新增或编辑
       */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                let editForm  = this.editForm
                console.log(editForm.resourceIds,'ids')
                if(this.checkedKeys.length>0){
                  //** 编辑时处理默认值 */
                  if(editForm.resourceIdsShow.length>0 || editForm.resourceIds.length>0){
                    editForm.resourceIds=[]   //用于存储半选中加全选中的
                    editForm.resourceList=[]
                    editForm.resourceIdsShow=[]  //用于存储全选中的
                  }
                  //半选中节点 ：先存储半选中的父级
                  const halfCheckedNodes = this.$refs.uiTree.getHalfCheckedNodes()
                  halfCheckedNodes.map((item) => {
                        editForm.resourceIds.push(item.id)
                      })
                  //全选中节点
                  const checkedNodes =this.$refs.uiTree.getCheckedNodes()
                      checkedNodes.map((item) => {
                        //editForm.resourceList.push(item)   //后台暂时没有使用此字段
                        editForm.resourceIds.push(item.id)
                        editForm.resourceIdsShow.push(item.id)

                      })
                      this.submitForm(editForm)
                }else{
                  this.$message({showClose:true,message:'请选择UI资源',type:'error'})
                }
            } else {
              return false;
            }
          });
      },
      /**
       * 关闭浮窗
       */
      closeDialog: function () {
        this.$emit('closeEditDialog', false)
      },
      daraTreeCheck (data, keys) {
        this.checkedDataKeys = keys.checkedKeys
      },
      uiTreeCheck (data, keys) {
        this.checkedKeys = keys.checkedKeys
      },
      renderContent(h, { node, data, store }) {
          return ( <span class = "el-tree-node__label" > { data.name } - { data.url=='/' ? data.elementId : data.url } </span>);
      },
      ui_unstrictly() {
          this.ui_strictly = false
      },
    }
  }

</script>
