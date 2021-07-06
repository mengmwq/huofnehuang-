<template>
    <div>
        <el-row class="mb10">
            <el-col :span="6">
                <el-button type="success" @click="addPerson" icon="el-icon-plus">添加</el-button>
                <el-button type="info" icon="el-icon-delete" :disabled="sels.length==0" @click="handleDelete">删除</el-button>
            </el-col>
            <el-col :span="18" style="text-align:right;">
                <el-select filterable v-model="searchForm.type" clearable placeholder="请选择所属机构">
                    <el-option v-for="(item,index) in personTypeList" :key="index" :value="item.id" :label="item.cnInfo"></el-option>
                </el-select>
                <el-input v-model="searchForm.keywords" suffix-icon="el-icon-search" placeholder="请输入机构、姓名或"  style="width:300px;" :maxlength="50"
                ></el-input>
                <el-button type="success" style="margin-left:6px;" @click="search" data-authorityType="role-select-button">查询
                </el-button>
            </el-col>
        </el-row>
        <el-row class="page-table-box">
            <el-table class="page-table" v-if="tableStatus"  :data="personPage && personPage.result" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}" @selection-change="selsChange"  @sort-change="sortChange">
              <el-table-column type="selection" min-width="60">
              </el-table-column>
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'status'">
                     <span v-if="scope.row.status=='0'">正常</span>
                     <span class="text-danger"  v-else >冻结</span>
                  </div>
                  <div v-else-if="header.prop == 'type'">
                     {{getPersonTypeName(scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="resetPassword(scope.row)" data-authorityType="role-update-button">重置密码</el-button>
                  <el-button type="danger" size="small" v-if="scope.row.status==0" @click="freezePerson(scope.row)" data-authorityType="role-update-button">冻结人员</el-button>
                  <el-button type="success" size="small" v-if="scope.row.status==1" @click="unfreezePerson(scope.row)" data-authorityType="role-update-button">解冻人员</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" class="page-box" justify="center">
            <el-pagination
                @size-change="handleSizeChange" :total="personPage ? personPage.totalCount : 0"
                @current-change="handleCurrentChange"
                layout="total,sizes, ->,prev, pager, next"
                :page-sizes="[10, 25, 50]"
                :page-size="searchForm.pageSize">
            </el-pagination>
        </el-row>
        <!--<TableColumn @change="columnChange" :tableHeader="tableHeader" @tableStatusChange="tableStatusChange"></TableColumn>-->
        <password-reset v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" @closeDialog="closeDialog"></password-reset>
        <person-add v-if="isShowEditDialog" :isShowDialog="isShowEditDialog" :editForm="editForm" @closeEditDialog="closeEditDialog"></person-add>
    </div>
</template>
<script>
import { Person } from '@/model/Person'
import Api from "@/api/index"
import PasswordReset from './PasswordReset'
import PersonAdd from './PersonAdd'
import TableColumn from '@/components/common/TableColumn'
export default {
  name: 'PersonList',
  components:{
    PasswordReset, PersonAdd, TableColumn
  },
   watch: {
    '$route' (to, from) {
    	if(to.path == '/router/personlist') {
    		this.search()
    	}
    }
  },
  computed: {
    // personPage() {
    //   //return this.$store.state.person.personPage
    //   return []
    // },
    now() {
      return this.$route.path === '/router/personlist' ? 0 : 1;
    },
    personTypeList() {
      //return this.$store.state.dictionary.dists.UserType.children;
      return []
    },
  },
  data () {
    const person = new Person();
    return {
      isShowEditDialog:false, // 编辑人员
      isShowDialog:false,   // 密码重置弹窗
      listLoading: false,
      sels: [],
      editForm: null,
      searchForm:person,
      personPage:{
         result:[],
         total:0
      },
      tableStatus:true,
      tableHeader: [{
        prop: 'orgName',
        label: '机构名称',
        width: '120',
        show: true
      },{
        prop: 'name',
        label: '姓名',
        width: '120',
        show: true
      }, {
        prop: 'telephone',
        label: '电话',
        width: '120',
        show: true
      }, {
        prop: 'loginAccount',
        label: '登录账号',
        width: '120',
        show: true
      }, {
        prop: 'roleName',
        label: '角色',
        width: '120',
        show: true
      }, {
        prop: 'work',
        label: '岗位',
        width: '120',
        show: true
      }, {
        prop: 'status',
        label: '状态',
        width: '120',
        show: true
      }]
    }
  },
  mounted() {
      this.search();
  },
  methods:{
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
     addPerson(){
      this.editForm = new Person()
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
    getPersonTypeName(type){
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
      this.$store.dispatch('getPersonPage', params);
    },
    //查询
    search() {
      const params = this.searchForm;
      this.$store.dispatch('getPersonPage', params);
    },

    selsChange(sels) {
      this.sels = sels;
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      const params = this.searchForm;
      this.$store.dispatch('getPersonPage', params);
    },
    handleCurrentChange(val) {
       this.searchForm.pageNumber = val;
      const params = this.searchForm;
      this.$store.dispatch('getPersonPage', params);
    },
    /**
     * 显示编辑界面
     */
    handleEdit(index, row) {
      this.editForm = Object.assign({}, row);
      this.$router.push({
        path: '/router/roleedit',
        query: { roleID: this.editForm.id }
      });
    },
    columnChange(data) {
      this.tableHeader = data;
    },
    /**
     * 冻结人员
     */
    freezePerson(row){
      const personName = row.name
      const params = {id:row.id}
      this.$confirm(`确认冻结人员【${personName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.freezeAccount(params).then((res) => {
          if (res) {
	          this.listLoading = false;
	          this.search();
	          //this.$message({showClose:true, message:`冻结人员【${personName}】成功`, type:'success'});
          }
        });
      }).catch(() => {});
    },
    /**
     * 解冻人员
     */
    unfreezePerson(row){
      const personName = row.name
      const params = {id:row.id}
      this.$confirm(`确认解冻人员【${personName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.unfreezeAccount(params).then((res) => {
          if (res) {
	          this.listLoading = false;
	          this.search();
	          //this.$message({showClose:true, message:`解冻人员【${personName}】成功`, type:'success'});
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
