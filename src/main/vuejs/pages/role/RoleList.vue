<template>
    <div>
        <el-row class="mb10" type="flex" justify="end">
            <el-col :span="12" v-showBtn data-authorityType="base-btn">
                <el-input v-model="searchForm.keyword" suffix-icon="el-icon-search" clearable @keyup.enter.native="search" placeholder="角色名称或描述关键字" class="w220" :maxlength="20"
                ></el-input>
               <el-button type="success" @click="search" >查询
                </el-button>
            </el-col>
            <el-col :span="12" style="text-align:right">
                <el-button type="primary" @click="addRole('add')" v-showBtn data-authorityType="base-btn" icon="el-icon-plus">添加角色</el-button>
                <!-- <el-button type="info" icon="el-icon-delete" :disabled="sels.length==0" @click="handleDelete">删除</el-button> -->
            </el-col>
        </el-row>
        <el-row class="page-table-box">
            <el-table class="page-table" v-if="tableStatus"  :data="rolePage && rolePage.result" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"  @sort-change="sortChange">
              <!-- <el-table-column type="selection" min-width="60">
              </el-table-column> -->
              <el-table-column type="index" label="序号" width="120">
              </el-table-column>
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                  <div v-if="header.prop == 'status'">
                     <span v-if="scope.row.status=='0'">正常</span>
                     <span class="text-danger"  v-else >冻结</span>
                  </div>
                  <div v-else-if="header.prop == 'type'">
                     {{getUserTypeName(scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template> -->
              </el-table-column>
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <span v-showBtn data-authorityType="base-btn">
                      <el-button type="success" size="small" @click="handleMember(scope.row)">成员</el-button>
                  </span>
                    <span v-if="scope.row.id!='2'">
                      <el-button type="success" size="small" @click="addRole('edit',scope.row)" v-showBtn data-authorityType="base-btn">修改</el-button>
                      <el-button type="success" size="small" @click="handleAuthority(scope.row)" v-showBtn data-authorityType="base-btn">权限</el-button>
                      <el-button type="success" size="small" @click="handleDelete(scope.row)" v-showBtn data-authorityType="base-btn">删除</el-button>
                  </span>
                  </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" class="page-box" justify="center">
            <el-pagination
                @size-change="handleSizeChange" :total="rolePage ? rolePage.totalCount : 0"
                @current-change="handleCurrentChange"
                layout="total,sizes, ->,prev, pager, next"
                :page-sizes="[10, 25, 50]"
                :page-size="searchForm.pageSize">
            </el-pagination>
        </el-row>
         <role-member v-if="isShowMemberDialog" :isShowDialog="isShowMemberDialog" :editForm="editForm" @closeEditDialog="closeEditDialog"></role-member>
        <role-add v-if="isShowEditDialog" :isShowDialog="isShowEditDialog" :editForm="editForm" @closeEditDialog="closeEditDialog"></role-add>
        <role-authority-edit v-if="isShowEditAuthorityDialog" :isShowDialog="isShowEditAuthorityDialog" :editForm="editForm" @closeEditDialog="closeEditDialog"></role-authority-edit>
    </div>
</template>
<script>
import { Role } from '@/model/Role'
import Api from "@/api/index"
import RoleAdd from './RoleAdd'
import RoleAuthorityEdit from './RoleAuthorityEdit'
import RoleMember from './RoleMember'

export default {
  name: 'UserList',
  components:{
    RoleAdd, RoleAuthorityEdit, RoleMember,
  },
   watch: {
    '$route' (to, from) {
    	if(to.path == '/router/rolelist') {
    		this.search()
    	}
    }
  },
  computed: {
    rolePage() {
      return this.$store.state.role.rolePage
    },
  },
  data () {
    const user = new Role();
    const jwt = JSON.parse(sessionStorage.getItem(jwt))
    return {
      isShowMemberDialog:false, //成员管理
      isShowEditDialog:false, // 编辑角色
      isShowEditAuthorityDialog:false,
      listLoading: false,
      sels: [],
      editForm: null,
      searchForm:{
        pageNumber:1,
        pageSize:10,
        keyword:'',
      },
      // rolePage:{
      //    result:[],
      //    total:0
      // },
      tableStatus:true,
      tableHeader: [{
        prop: 'name',
        label: '角色',
        width: '120',
        show: true
      }, {
        prop: 'intro',
        label: '角色描述',
        width: '120',
        show: true
      }]
    }
  },
  mounted() {
      this.search();
  },
  methods:{
    /**
     * 处理权限
     */
    handleAuthority(row){
      this.editForm = Object.assign({},row)
       if(!row.resourceIds || !row.resourceList){
          this.editForm.resourceList=[]
          this.editForm.resourceIds=[]
       }
       this.isShowEditAuthorityDialog = true
    },

    /**
     *  新增或编辑角色
     */
     addRole(flag,row){
      if(flag=='edit'){
        this.editForm = Object.assign({},row)
      }else{
        this.editForm = new Role()
      }
      this.isShowEditDialog = true
    },
    /**
     *  新增或编辑角色事件改变
     */
    closeEditDialog(){
      this.isShowEditDialog = false
      this.isShowEditAuthorityDialog = false
      this.isShowMemberDialog = false
      this.search()
    },

    /**
     * 处理成员
     */
    handleMember(row){
      this.editForm = Object.assign({},row)
      this.isShowMemberDialog = true
    },
    //表格排序变化
    sortChange({ column, prop, order }){
      if(order){
      	  var s= order.substring(0,1);
	      var sOrder = 'asc';
	      if(s=='d'){
	        sOrder = 'desc';
	      }
	      this.searchForm.tableOrder = prop+' '+sOrder;
	      this.searchForm.pageNumber = 1;
	      this.search();
      	}
    },
    selsChange(sels) {
      this.sels = sels;
    },
    refresh() {
      const params = this.searchForm;
      this.$store.dispatch('getRolePage', params);
    },
    //查询
    search() {
      const params = this.searchForm;
      this.$store.dispatch('getRolePage', params);
    },


    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      const params = this.searchForm;
      this.$store.dispatch('getRolePage', params);
    },
    handleCurrentChange(val) {
       this.searchForm.pageNumber = val;
      const params = this.searchForm;
      this.$store.dispatch('getRolePage', params);
    },
    /**
     * 显示编辑界面
     */
    handleEdit(row) {
      this.editForm = Object.assign({}, row);
      this.$router.push({
        path: '/router/brandedit',
        query: { id: this.editForm.id }
      });
    },
    /**
     * 查看详情
     */
    handleDetails(row){

    },

    /**
     * 批量删除
     */
    handleDelete(row) {
      const roleName = row.name
      const params = {
        id: row.id
      }
      this.$confirm(`确认删除角色【${roleName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.deleteRole(params).then((res) => {
          if (res) {
	          this.listLoading = false;
	          this.search();
	          this.$message({showClose:true, message:`删除角色【${roleName}】成功`, type:'success'});
          }
        });
      }).catch(() => {});
    }
  }
}
</script>
<style scoped>
  .el-button+.el-button {
     margin-left: 0px!important;
  }
</style>
