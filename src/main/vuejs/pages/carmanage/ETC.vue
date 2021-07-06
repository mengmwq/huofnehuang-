<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="12">
        <el-button type="primary"  size="small" @click="ETCApply('add')">ETC申请</el-button>
      </el-col>
      <el-col :span="12" class="text-right" style="float:right">
        <el-input size="medium" clearable placeholder="请输入申请人" prefix-icon="el-icon-search" icon="search" v-model="query.userName" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="small" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
     <template v-for="(header, index) in tableHeader">
        <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope"> 
           <div v-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
           <div v-else-if="header.prop == 'createDt'">   {{scope.row.createDt | timeFormat}} </div> 
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
     </template>
      <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <span v-if="scope.row.ctUId===userInfo.uId">
              <el-button v-if="scope.row.approvalStatus==3"  type="primary" size="mini" @click="cancel(scope.row)">撤销</el-button>
              <span v-if="scope.row.approvalStatus==4 || scope.row.approvalStatus==0">
                  <el-button  type="primary" size="mini" @click="ETCApply('edit',scope.row)">编辑</el-button>
                  <el-button v-if="scope.row.approvalProcessId"  type="primary" size="mini" @click="newSubmit(scope.row)">重新提交</el-button>
                  <el-button  type="primary" size="mini" @click="deleteCar(scope.row)">删除</el-button>
              </span>
            </span>
            
          </template>
        </el-table-column>
      
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
      background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button> -->
    </el-row>
    <ETCApply
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :editForm="editForm"
      @closeDialog="closeDialog"
      @changeDialog="changeDialog"
     ></ETCApply>
     <ApplyCancel
      v-if="isShowDialogCancel"
      :isShowDialog="isShowDialogCancel"
      :editForm="editForm"
      @closeDialog="closeDialog"
      @changeDialog="changeDialog"
     ></ApplyCancel>
  </div>
</template>


<script>
  import Api from '@/api/index'
  import {OilCard} from '@/model/OilCard'
   import ApplyCancel from './ApplyCancel'
  import ETCApply from './ETCApply'
  export default {
    name:'ETC',
    components:{
      ETCApply,
      ApplyCancel,

    },
    data () {
      const etc = new OilCard()
      const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      return {
        userInfo:userInfo,
        isShowDialogCancel:false,
        isShowDialog:false,
        dialogVisible: false,
        form: {},
        editForm:etc,
        query: {
          pageSize: 10,pageNum: 1,carId: '',// param:''
          "approvalStatus": "",
          "param": "",
          "projectName": "",
          "userName": "",
        },
        tableHeader: [   
             {prop: 'projectName',label: '项目名称',show: true}, 
            {prop: 'amount',label: '金额',show: true}, 
            {prop: 'userName',label: '申请人',show: true}, 
            {prop: 'approvalProcessName',label: '审批流程',show: true}, 
            {prop: 'createDt',label: '申请时间 ',show: true}, 
            // {prop: 'type',label: '类型',show: true},
             {prop: 'kilometres',label: '本次公里数',show: true}, 
            {prop: 'startingPlace',label: '始发地',show: true},
            {prop: 'destination',label: '目的地',show: true}
        ],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.query.carId = this.$route.query.id
      this.loadData()
      console.log(this.query.carId)
    },
    
    methods: {
    /**删除**/
    deleteCar (i) {
        this.$confirm('您确定要删除该信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: i.id
          }
          Api.deleteETCById(param).then(() => {
            this.loadData()
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },
      //撤销功能
      cancel(item){
         this.isShowDialogCancel = true
         const editForm = {
          id : item.approvalId,
          states : '4',
          withdrawalReasons: '',
          projectName:item.projectName,
        }
        this.editForm = editForm
      },
      /**重新提交**/
      newSubmit (item) {
        this.$confirm('您确定要重新提交【' + item.projectName + '】 ETC申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.resubmit({id: item.approvalId}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '重新提交成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '重新提交失败'
              })
              this.loadData()
            }
          })
        })
      },
      changeDialog(){
        this.closeDialog()
        this.loadData()
      },
      closeDialog(){
        this.isShowDialog = false;
        this.isShowDialogCancel = false
      },
       //油卡申请
       ETCApply(flag,row){
          if(flag=='add'){
              this.editForm = new OilCard()
          }else{
             this.editForm = JSON.parse(JSON.stringify(row))
          }
          this.isShowDialog = true;
       },
      /**
       * 加载ETC
       */
      loadData () {
        this.listLoading = true
        Api.ETCDetailList(this.query).then(data => {
          if (data) {  
          this.listData = data.records  
          this.total = data.total
          }
          this.listLoading = false
        })
      },
      addInfo () {
        this.$router.push({path: '/router/addCarInspect',query: {carId: this.$route.query.id,registrationNumber: this.$route.query.registrationNumber}})
      },
      selectInfo (id) {
        this.$router.push({path: '/router/addCarInspect',query: {id: id, registrationNumber: this.$route.query.registrationNumber}})
      },
      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
      },
      canSelected(row, index) {
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){return 0;
        } else{return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.param = '';
        this.query.pageNum = 1;
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let param = {  
            tableHead: this.tableHeader,  
            data: this.listData
          }
          Api.downloadExcel(param).then((res) => {  
            if (res) {    
              let reader = new FileReader()    
            reader.readAsDataURL(res)    
            reader.onload = (e) => {      
              let a = document.createElement('a')      
              a.download = '列表数据.xlsx'      
              a.href = e.target.result      
            document.body.appendChild(a)      
            a.click()      
            document.body.removeChild(a)    
            }  
            }})
        }
      },

      /**
       * 下载
       */
      download(param){
        Api.downloadCarCheckingInfo(param).then((res) => {if (res) { 
           let reader = new FileReader()  
           reader.readAsDataURL(res)  
           reader.onload = (e) => {    
             let a = document.createElement('a')    
             a.download = '车辆检测表.xlsx'    
             a.href = e.target.result    
             document.body.appendChild(a)    
             a.click()    
             document.body.removeChild(a)  
             }}
        })
      },

    }
  }
</script>
