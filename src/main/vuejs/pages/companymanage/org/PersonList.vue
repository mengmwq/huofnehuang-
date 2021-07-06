<template>
  <div>
      <!-- 操作栏 -->
      <div class="mb10 searchBox">
          <el-input size="small" clearable placeholder="请输入姓名" suffix-icon="el-icon-search" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width:160px;"></el-input>
          <el-button type="primary" class="ml10" size="small" @click="loadData" >查询</el-button>
          <!--<el-button type="primary" class="ml10" size="small" @click="addPerson" >添加人员</el-button>-->
      </div>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" style="width:100%" :cell-style="{color:'#333'}" >
        <template v-for="(header, index) in tableHeader">
           <el-table-column  v-if="header.show"  :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'delFlg'">
              <span>{{scope.row.delFlg | accountDelFilter}}</span>
            </div>
            <div v-else-if="header.prop == 'uName'">
              <a href="javascript:;" @click="viewUser(scope.row)">{{scope.row.uName}}</a>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        </template>
      </el-table>
      <el-row type="flex" class="page-box" justify="end">
        <!-- 分页 -->
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-row>
  </div>
</template>

<script>
  import ValidForm  from '@/utils/ValidForm'
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  export default {
    props:{
      org:{
        type:Object
      },
    },
    data () {
      return {
        
        query: {
          pageSize: 10,
          pageNum: 1,
          name: '',
          orgId:this.org.orgId

        },
        tableHeader: [ {
          prop: 'uName',
          label: '姓名',
          width:70,
          show: true
        }, {
          prop: 'tel',
          label: '电话',
          width:100,
          show: true
        }, {
          prop: 'roleName',
          label: '角色',
          width:120,
          show: true
        }, {
          prop: 'orgName',
          label: '隶属机构',
          width:120,
          show: true,
        }],
        
        /** 表格数据 */
        listData: [],
        /** 总数据数 */
        total: 0,
       
        /** 表格 loading */
        listLoading: false,
      }
    },
    watch:{
      org:function(){
         this.loadData()
      },
    },
    mounted () {
      this.loadData()
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
    },
    methods: {
      addPerson(){
        this.$router.push({
          path:'/router/userManageList',
        })
      },
      /**
       * 查看详情
       * */
      viewUser (item) {
        this.$emit('selectPersonChange',item)
      },
      /**
       * 加载用户列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.getUserPage(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
      },
      canSelected (row, index) {
        if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
          return 0
        } else {
          return 1
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.name = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
    }
  }
</script>

<style scoped>
  .searchBox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 178px;
    text-align: center;
  }
  .orgName{
    position: relative;
  }
  .orgName:before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
    position: absolute;
    left: 77px;
    top: 14px;
  }
</style>
