<template>
    <div>
        <el-row class="mb10"  v-showBtn data-authorityType="base-btn">
            <el-input v-model="searchForm.keyword" clearable @keyup.enter.native="search" suffix-icon="el-icon-search" placeholder="请输入姓名或电话"  class="w220" :maxlength="50"
                ></el-input>
            <el-button type="success" @click="search" style="margin-left:6px;" >查询
            </el-button>
        </el-row>
        <el-row class="">
            <el-table class="page-table" v-if="tableStatus"  :data="userPage && userPage.result" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}" @filter-change="handleFilterChange" @sort-change="sortChange" >
              <!--<el-table-column type="selection" min-width="60">-->
              <!--</el-table-column>-->
              <el-table-column type="index" label="序号" width="50">
              </el-table-column>

              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" :filters="getfilters(header.filter)" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'block'">
                     <span class="text-danger" v-if="scope.row.block">冻结</span>
                     <span v-else >正常</span>
                  </div>
                  <div v-else-if="header.prop == 'birthday'">
                     {{getAgeByBirthday(scope.row.birthday)}}
                  </div>
                  <div v-else-if="header.prop == 'address'">
                     {{scope.row.prov}} {{scope.row.city}} {{scope.row.district}}
                  </div>
                  <div v-else-if="header.prop == 'sex'">
                     {{getDictsKeyName(scope.row,'Sex',scope.row.sex)}}
                  </div>
                  <div v-else-if="header.prop == 'stuQdCount'">
                    {{scope.row.stuQdCount?scope.row.stuQdCount:0}}次
                  </div>
                  <div v-else-if="header.prop == 'type'">
                    {{getDictsKeyName(scope.row,'IsSelf',scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="240">
                <template slot-scope="scope" style="background:#fff">
                  <!--非本人不允许重置密码及冻结-->
                  <span v-if="scope.row.type !==2">
                      <el-button  type="success" size="small" v-showBtn data-authorityType="resetPwd-btn"  @click="resetPassword(scope.row)" >重置密码</el-button>
                      <span v-if="scope.row.block">
                          <el-button type="success" size="small" v-showBtn data-authorityType="freeze-btn"  @click="unfreezeUser(scope.row)">解冻</el-button>
                      </span>
                        <span v-else>
                          <el-button type="success" size="small" v-showBtn data-authorityType="freeze-btn"  @click="freezeUser(scope.row)">冻结</el-button>
                        </span>
                  </span>
                    <el-button type="success" size="small" v-showBtn data-authorityType="base-btn"  @click="showDetails(scope.row)" >详情</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" class="page-box" justify="center">
            <el-pagination
                @size-change="handleSizeChange" :total="userPage ? userPage.totalCount : 0"
                @current-change="handleCurrentChange"
                layout="total,sizes, ->,prev, pager, next"
                :page-sizes="[10, 25, 50]"
                :page-size="searchForm.pageSize">
            </el-pagination>
        </el-row>
        <TableColumn @change="columnChange" :tableHeader="tableHeader" @tableStatusChange="tableStatusChange"></TableColumn>
        <password-reset v-if="isShowDialog" :isShowDialog="isShowDialog" :editForm="editForm" @closeDialog="closeDialog"></password-reset>
        <user-add v-if="isShowEditDialog" :isShowDialog="isShowEditDialog" :editForm="editForm" @closeEditDialog="closeEditDialog"></user-add>
        <user-details v-if="isShowDetailsDialog" :isShowDialog="isShowDetailsDialog" :editForm="editForm" :contacterId="contacterId" @closeEditDialog="closeDetailsDialog"></user-details>
    </div>
</template>
<script>
import { User } from '@/model/User'
import Api from "@/api/index"
import PasswordReset from './PasswordReset'
import UserAdd from './UserAdd'
import UserDetails from './UserDetails'
import TableColumn from '@/components/common/TableColumn'
import Util from '@/utils/'
export default {
  name: 'UserList',
  components:{
    PasswordReset, UserAdd, TableColumn, UserDetails
  },
   watch: {
    '$route' (to, from) {
    	if(to.path == '/router/userlist') {
        console.log("+++++++++++++++++++[90]this.search()++++++++++++++++++++");
    		//this.search()
    	}
    }
  },
  computed: {
    userPage() {
      return this.$store.state.user.userPage
    },
    now() {
      return this.$route.path === '/router/userlist' ? 0 : 1;
    },
    userTypeList() {
      //return this.$store.state.dictionary.dists.UserType.children;
      return []
    },
  },
  data () {
    const user = new User()
    const jwt = JSON.parse(sessionStorage.getItem(jwt))
    return {
      contacterId:'',
      isShowDetailsDialog:false,   //查看详情
      userId:jwt.Id,
      roleId:jwt.roleId,
      isShowEditDialog:false, // 编辑人员
      isShowDialog:false,   // 密码重置弹窗
      listLoading: false,
      sels: [],
      editForm: null,
      searchForm:{
        pageNumber:1,
        pageSize:10,
        keyword:'',
        tableOrder:'',
        filterMap:null
      },
      flag:false,
      tableStatus:true,
      tableHeader:null,
      sessionStorage: window.sessionStorage
    }
  },
  mounted() {
      console.log("+++++++++++++++++++[133]this.search()++++++++++++++++++++");
      this.search();
  },

  methods:{
    /**
     * 查看详情
     */
    showDetails(row){
       console.log(row,'row')
       this.contacterId = row.id
       this.editForm = JSON.parse(JSON.stringify(row))
       console.log(this.editForm)
       this.isShowDetailsDialog = true
    },

    /**
     * 过滤器 【通过缓存】 取了一个KEY（String） 取了需要过滤的条件（对应的值）
     */
    getfilters(filter){
      if (filter !== "false"){
          if (sessionStorage.getItem('dists')) {
              var dists = JSON.parse(sessionStorage.getItem('dists'));//得到dists对象
              var filterName =  dists[filter];
              var filterChildren = filterName.children;
              var Filter = [];
              for (var i = 0; i < filterChildren.length; i++){
                  Filter.push({text:filterChildren[i].cnInfo,value:filterChildren[i].value});
              }
          }
          return Filter;
      }
    },

    /**
     * 过滤器POST 到后台一个【map】进行查询 key：String val：list[1,2]
     */
    handleFilterChange(filter) {
      var FilterObject = Object.values(filter)[0];
      if(!this.searchForm.filterMap){
        this.searchForm.filterMap = {};
      }
      var mapkey = Object.keys(filter)[0];
      if(FilterObject.length > 0){
        // 【写入Map】key：mapkey  val：FilterObject;
        this.searchForm.filterMap[mapkey]=FilterObject
      }else{
        // 【Map删除】mapkey;
        delete this.searchForm.filterMap[mapkey];
      }
      console.log(this.searchForm.filterMap);
      this.search();
    },


    /**
     * 通过出生日期获取年龄
     */
    getAgeByBirthday(birthday){
      return Util.getAgeByBirthday(birthday)
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
      console.log("++++++++++++++++++【表头切换】触发++++++++++++++++++++++++");
      this.tableHeader = data;
    },
    /**
     * 表头拖拽状态改变
     */
    tableStatusChange(val){
       console.log("++++++++++++++++++【表头拖拽状态改变】触发++++++++++++++++++++++++");
       this.tableStatus = val;
    },
    /**
     *  新增或编辑人员
     */
     addUser(){
      this.editForm = new User()
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
     * 关闭详情弹窗
     */
    closeDetailsDialog(){
      this.isShowDetailsDialog = false
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
        console.log("++++++++++++++++++【表格排序变化】触发++++++++++++++++++++++++");
	      this.search();
      	}
    },
    refresh() {
      const params = this.searchForm;
      this.$store.dispatch('getUserPage', params);
    },
    //查询
    search() {
      const params = this.searchForm;
      this.$store.dispatch('getUserPage', params);
    },

    selsChange(sels) {
      this.sels = sels;
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      const params = this.searchForm;
      this.$store.dispatch('getUserPage', params);
    },
    handleCurrentChange(val) {
      this.searchForm.pageNumber = val;
      const params = this.searchForm;
      this.$store.dispatch('getUserPage', params);
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
    freezeUser(row){

      const userName = row.name
      const params = {userId:row.userId,mobile:row.mobile}
      console.log(params,'freeze')
      this.$confirm(`确认冻结人员【${userName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.freezeAccount(params).then((res) => {
          if (res) {
	          this.listLoading = false;
            console.log("++++++++++++++++++【冻结人员】触发++++++++++++++++++++++++");
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
      const params = {userId:row.userId,mobile:row.mobile}
      this.$confirm(`确认解冻人员【${userName}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        Api.unfreezeAccount(params).then((res) => {
          if (res) {
	          this.listLoading = false;
            console.log("++++++++++++++++++【解冻人员】触发++++++++++++++++++++++++");
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
            console.log("++++++++++++++++++【批量删除】触发++++++++++++++++++++++++");
	          this.search();
	          this.$message({showClose:true, message:`删除人员【${nameStr}】成功`, type:'success'});
          }
        });
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss">
  .el-table__column-filter-trigger i{
    /*color:#f56c6c;*/
    font-size:19px;
  }
</style>

