<template>
<div>

      title="成员管理"
      :visible.sync="isShowDialog"
      :close-on-click-modal="canClick"
      :before-close = "closeDialog"
      width="60%">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="isShowUserDialog=true" class="mb10">添加管理员</el-button>
      <el-table class="page-table" style="max-height: 500px;overflow-y: auto" :data="adminUserPage" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}">

              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'sex'">
                     {{getDictsKeyName(scope.row,'Sex',scope.row.sex)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="success" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="info"  class="cancel-btn-big" @click="closeDialog">取消</el-button>
        <el-button type="success" class="confirm-btn-big" @click="confirm('editForm')">关闭</el-button>
      </div>  -->
1

      title="添加管理员"
      :visible.sync="isShowUserDialog"
      :close-on-click-modal="canClick"
      :before-close = "closeUserDialog"
      width="50%">
      <el-input
       style="width:180px"
       size="mini"
    placeholder="请输入姓名/手机号/机构"
    prefix-icon="el-icon-search"
    v-model.trim="searchForm.keyword">
  </el-input>
  <el-button type="success" size="mini" class="mb10" @click="search">查询</el-button>
      <el-table class="page-table" :data="userPage" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}" @selection-change="selsUserChange">
              <el-table-column label="#" width="60">
                  <template slot-scope="scope">
                      <el-radio :label="scope.row.id" v-model="radio"  @change.native="selsUserChange(scope.row)">&nbsp;</el-radio>
                  </template>
              </el-table-column>
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <template slot-scope="scope">

                   <div v-if="header.prop == 'sex'">
                     {{getDictsKeyName(scope.row,'Sex',scope.row.sex)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" size="small" class="cancel-btn-big" @click="closeUserDialog">取消</el-button>
        <el-button type="success" size="small"  class="confirm-btn-big" @click="addUserInRole()">添加</el-button>
      </div>
1
</div>
</template>
<script>
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'
  import Util from '@/utils/'
  export default {
    name: 'RoleMember',
    components: {},
    computed:{

    },
    props: ['isShowDialog', 'editForm'],
    data: function () {
      return {
        canClick: false,
        /**
         * 添加管理员窗体
         */
        isShowUserDialog:false,
        searchForm:{
          pageNumber:1,
          pageSize:10,
          keyword:'',
        },
        radio:'',
        userPage:[],
        adminUserPage:[],
        keyword:'',
        sels:[],
        selsUser:null,
        listLoading:false,
        tableHeader: [{
            prop: 'realname',
            label: '姓名',
            width: '120',
            show: true
        }, {
            prop: 'sex',
            label: '性别',
            width: '120',
            show: true
        },{
            prop: 'mobile',
            label: '手机号',
            width: '120',
            show: true
        }, {
            prop: 'orgName',
            label: '机构',
            width: '120',
            show: true
        }, {
            prop: 'positionOrg',
            label: '角色',
            width: '120',
            show: true
        }]
      }
    },

    mounted () {
       this.getAllUserByRoleId()
    },
    methods: {
      /**
       * 删除成员
       */
    handleDelete(row){
      const params = {
         roleId : this.editForm.id,
         userId : row.id
      }
      let msg =`电话是【${row.mobile}】的成员`;
      if(row.realname){
         msg =`姓名是【${row.realname}】的成员`
      }
      this.$confirm(`确认删除${msg}吗？`, "提示", {
        type: "warning"
      })
        .then(() => {
           Api.cancelUserInRole(params).then(res=>{
           if(res){
                  this.$message({showClose:true,message:`${msg}删除成功`, type:'success'})
                  this.getAllUserByRoleId()
              }
            })
        })
        .catch(err => {});

    },
    /**
     * 获取字典名称
     */
    getDictsKeyName(row,key,val){
      return Util.getDictsKeyName(row,key,val)
    },
      /**
       * 为某角色删除成员
       */
      cancelUserInRole(row){
         const params = {
           roleId : editForm.id,
           userId : row.id
         }
         Api.cancelUserInRole(params).then(res=>{
            if(res){
              this.$message({showClose:true, message:`成员用户【${row.name}】删除成功`, type:'success'})
              this.getAllUserByRoleId()
            }
         })
      },
     /**
      * 根据角色ID查询所有已注册未冻结的成员列表
      */
     getAllUserByRoleId(){
       const params = {roleId:this.editForm.id, keyword:this.keyword}
       Api.getAllUserByRoleId(params).then(res=>{
          if(res){
             this.adminUserPage = res.data;
          }
        })
     },
     /**
      * 添加用户到成员管理
      */
     addUserInRole(){
        const selected = this.selsUser
        console.log(selected,'selected')
        if(selected){
          const params = {
            userId: selected.id,
            roleId: this.editForm.id
          }
          Api.insertUserInRole(params).then(res=>{
              if(res){
                  this.$message({showClose:true, message:'成员用户添加成功', type:'success'})
                  this.isShowUserDialog = false
                  this.getAllUserByRoleId()
              }
          })

        }else{
           this.$message({showClose:true, message:'请至少选择一条记录', type:'error'})
        }
     },

    selsChange(sels) {
      this.sels = sels;
    },


    selsUserChange(sels) {
      console.log(sels,'sels')
      this.selsUser = sels;
    },
    //查询
    search() {
      const params = this.searchForm;
      if(params.keyword){
          Api.getAllUserByKeyword(params).then(res=>{
            if(res){
              this.userPage = res.data
            }
          })
      }else{
        this.$message({showClose:true,message:'请输入查询关键字',type:'error'})
      }

    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.search()
    },
    handleCurrentChange(val) {
       this.searchForm.pageNumber = val;
      this.search()
    },
      /**
       * 确认保存 ： 新增或编辑
       */
      confirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                const editForm  = this.editForm;

                let fn = editForm.id ? 'updateRole' : 'insertRoleInfo'

                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`角色【${editForm.name}】添加成功`
                      });
                      this.closeDialog();
                    }
                }).catch(err=>{
                })
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
      closeUserDialog(){
        this.isShowUserDialog = false
      },
    }
  }

</script>
