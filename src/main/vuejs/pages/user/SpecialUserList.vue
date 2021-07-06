<template>
    <div>
        <el-row class="mb10" type="flex" justify="end">
            <el-col :span="12" >
               <span v-showBtn data-authorityType="base-btn">
                  <el-input v-model="searchForm.name" suffix-icon="el-icon-search" clearable @keyup.enter.native="search"  placeholder="请输入姓名或证件号"  class="w220" :maxlength="20"
                  ></el-input>
                  <el-button type="success" @click="search" >查询
                  </el-button>
                </span>
                 <!--<el-button type="success" v-showBtn data-authorityType="base-btn">筛选</el-button>-->
            </el-col>
            <el-col :span="12" style="text-align:right">
                <el-button type="primary" @click="editSpecialUser('add')" v-showBtn data-authorityType="add-btn" icon="el-icon-plus">添加用户</el-button>
                <!-- <el-button type="info" icon="el-icon-delete" :disabled="sels.length==0" @click="handleDelete">删除</el-button> -->
            </el-col>
        </el-row>
        <el-row class="page-table-box">
            <el-table class="page-table" v-if="tableStatus"  :data="specialUserPage && specialUserPage.result" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}" @sort-change="sortChange">
              <!-- <el-table-column type="selection" min-width="60">
              </el-table-column> -->
              <el-table-column type="index" label="序号" width="80">
              </el-table-column>
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'cardType'">
                     {{getDictsKeyName(scope.row,'CardType',scope.row.cardType)}}
                  </div>
                  <div v-else-if="header.prop == 'type'">
                     {{getDictsKeyName(scope.row,'SpecialType',scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button type="success" size="small" @click="editSpecialUser('edit',scope.row)" v-showBtn data-authorityType="edit-btn">编辑</el-button>
                  <!-- <el-button type="success" size="small" @click="editSpecialUser('details',scope.row)" v-showBtn data-authorityType="base-btn">详情</el-button> -->
                </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" class="page-box" justify="center">
            <el-pagination
                @size-change="handleSizeChange" :total="specialUserPage ? specialUserPage.totalCount : 0"
                @current-change="handleCurrentChange"
                layout="total,sizes, ->,prev, pager, next"
                :page-sizes="[10, 25, 50]"
                :page-size="searchForm.pageSize">
            </el-pagination>
        </el-row>
        <!--<TableColumn @change="columnChange" :tableHeader="tableHeader" @tableStatusChange="tableStatusChange"></TableColumn>-->
        <password-reset v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" @closeDialog="closeDialog"></password-reset>
        <special-user-add v-if="isShowEditDialog" :editTitle="editTitle" :isShowDialog="isShowEditDialog" :editForm="editForm" @closeEditDialog="closeEditDialog"></special-user-add>
    </div>
</template>
<script>
import { SpecialUser } from '@/model/SpecialUser'
import Api from "@/api/index"
import PasswordReset from './PasswordReset'
import SpecialUserAdd from './SpecialUserAdd'
import TableColumn from '@/components/common/TableColumn'
import Util from '@/utils/'
export default {
  name: 'UserList',
  components:{
    PasswordReset, SpecialUserAdd, TableColumn
  },
   watch: {
    '$route' (to, from) {
    	if(to.path == '/router/specialuserlist') {
    		this.search()
    	}
    }
  },
  computed: {
    specialUserPage() {
      return this.$store.state.specialUser.specialUserPage
    },
    now() {
      return this.$route.path === '/router/specialuserlist' ? 0 : 1;
    },
    userTypeList() {
      //return this.$store.state.dictionary.dists.UserType.children;
      return []
    },
  },
  data () {
    const specialUser = new SpecialUser();
    return {
      editTitle:'',
      isShowEditDialog:false, // 编辑人员
      isShowDialog:false,   // 密码重置弹窗
      listLoading: false,
      sels: [],
      editForm: null,
      searchForm:{
        pageNumber:1,
        pageSize:10,
        name:'',
      },
      // specialUserPage:{
      //    result:[],
      //    total:0
      // },
      tableStatus:true,
      tableHeader: [{
        prop: 'name',
        label: '姓名',
        width: '120',
        sortable:true,
        show: true
      }, {
        prop: 'cardType',
        label: '证件类型',
        width: '120',
        show: true,
        sortable:true,
      }, {
        prop: 'cardId',
        label: '证件号',
        width: '160',
        show: true
      }, {
        prop: 'type',
        label: '特殊身份',
        width: '100',
        show: true,
        sortable:true,
      }, {
        prop: 'stuLimitYear',
        label: '学员限制',
        width: '100',
        show: true,
        sortable:true,
      }, {
        prop: 'volLimitYear',
        label: '义工限制',
        width: '100',
        show: true,
        sortable:true,
      }, {
        prop: 'reason',
        label: '备注',
        width: '180',
        show: true
      }]
    }
  },
  mounted() {
      this.search();
  },
  methods:{
    fn(val){
    },
    /**
     * 获取字典名称
     */
    getDictsKeyName(row,key,val){
      return Util.getDictsKeyName(row,key,val)
    },
    /***
     * 表头切换
     */
    columnChange(data) {
      this.tableHeader = data;
    },
    /**
     * 表头拖拽状态改变
     */
    tableStatusChange(val){
       this.tableStatus = val
    },
    /**
     *  新增或编辑人员
     */
     editSpecialUser(flag,row){

      if(flag=='add'){
        this.editForm = new SpecialUser()
        this.editTitle = '添加特殊用户'
      }else{
        this.editForm = Object.assign({},row)
        if(flag=='details'){
          this.editTitle ='特殊用户详情'
        }else if(flag=='edit'){
          this.editTitle ='编辑特殊用户'
        }

      }

      console.log('editForm',this.editForm)
      this.isShowEditDialog = true
    },
    /**
     *  新增或编辑人员事件改变
     */
    closeEditDialog(){
      this.isShowEditDialog = false
      this.search()
    },
    /**
     *  密码重设事件改变
     */
    closeDialog(){
      this.isShowDialog = false
    },
    /**
     *  重设密码，打开弹窗
     */
    resetPassword(row){
      this.editForm = Object.assign({},row);
      this.isShowDialog = true
    },
    /***
     * 获取人员类型
     */
    getUserTypeName(type){
      const aType = ['工作室', '个人咨询师', '组'];
      return aType[parseInt(type)];
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
    refresh() {
      const params = this.searchForm;
      this.$store.dispatch('getSpecialUserPage', params);
    },
    //查询
    search() {
      const params = this.searchForm;
      this.$store.dispatch('getSpecialUserPage', params);
    },

    selsChange(sels) {
      this.sels = sels;
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      const params = this.searchForm;
      this.$store.dispatch('getSpecialUserPage', params);
    },
    handleCurrentChange(val) {
       this.searchForm.pageNumber = val;
      const params = this.searchForm;
      this.$store.dispatch('getSpecialUserPage', params);
    },
    /**
     * 显示编辑界面
     */
    handleEdit(row) {
      this.editForm = Object.assign({}, row);
      this.$router.push({
        path: '/router/roleedit',
        query: { roleID: this.editForm.id }
      });
    },
    /**
     * 查看详情
     */
    handleDetails(row){

    },
    columnChange(data) {
      this.tableHeader = data;
    },
    /**
     * 冻结人员
     */
    freezeUser(row){
      const userName = row.name
      const params = {id:row.id}
      this.$confirm(`确认冻结人员【${userName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.freezeAccount(params).then((res) => {
          if (res) {
	          this.listLoading = false;
	          this.search();
	          //this.$message({showClose:true, message:`冻结人员【${userName}】成功`, type:'success'});
          }
        });
      }).catch(() => {});
    },
    /**
     * 解冻人员
     */
    unfreezeUser(row){
      const userName = row.name
      const params = {id:row.id}
      this.$confirm(`确认解冻人员【${userName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.unfreezeAccount(params).then((res) => {
          if (res) {
	          this.listLoading = false;
	          this.search();
	          //this.$message({showClose:true, message:`解冻人员【${userName}】成功`, type:'success'});
          }
        });
      }).catch(() => {});
    },
    /**
     * 批量删除
     */
    handleDelete() {
      const selected = this.sels
      if (selected.length <= 0) {
        this.sendMessage(`请选中一条记录`, 'error');
        return;
      }

      let ids = selected.map(item => item.id);
      const nameStr = selected.map(item => item.name).toString();

      this.$confirm(`确认删除人员【${nameStr}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.deleteUser(ids).then((res) => {
          if (res) {
	          this.listLoading = false;
	          this.search();
	          this.$message({showClose:true, message:`删除人员【${nameStr}】成功`, type:'success'});
          }
        });
      }).catch(() => {});
    }
  }
}
</script>
