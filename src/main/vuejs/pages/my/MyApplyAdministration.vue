<template>
  <div>
    <!-- {label:'拒绝',value:'0'},{label:'批准',value:'1'},{label:'待审批',value:'2'},{label:'审批中',value:'3'},{label:'撤回',value:'4'} -->
    <div class="tab-nav" style="padding: 0 15px;border-bottom: 1px solid #e3e2e2;">
      <div class="nav-item tab" @click="changeTabData(3)">
        <span :class="tabIndex==3 ? 'tab-active' : ''">进行中</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(4)">
        <span :class="tabIndex==4 ? 'tab-active' : ''">已撤回</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(1)">
        <span :class="tabIndex==1 ? 'tab-active' : ''">通过</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(0)">
        <span :class="tabIndex==0 ? 'tab-active' : ''">未通过</span>
      </div>
    </div>
    <div style="padding: 0 15px;">
      <!-- 操作栏 -->
      <el-row :gutter="20" class="m10">
        <el-col :span="4">
          <el-dropdown>
            <el-button type="primary" size="medium">
              新建申请 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <router-link v-showBtn data-authorityType="administrationApply-btn" :to="{path: '/router/administrationApply', query: {tag: '1'}}" tag="div">
                <el-dropdown-item>行政支出申请</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="20" class="text-right" style="float: right">
          提交日期：<el-date-picker
          v-model="query.finishTimeStart"
          type="date"
          size="medium"
          style="width:150px"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择开始日期">
        </el-date-picker>
          至
          <el-date-picker
            v-model="query.finishTimeEnd"
            type="date"
            style="width:150px"
            value-format="yyyy-MM-dd"
            size="medium"
            format="yyyy-MM-dd"
            placeholder="选择结束日期">
          </el-date-picker>
          <el-select filterable v-model="query.approvalType" clearable placeholder="审批类型" size="medium" style="width:150px">
            <el-option v-for="(item, index) in categoryList"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-select filterable v-model="query.state" @change="loadData" clearable placeholder="审批状态" size="medium" style="width:150px">
            <el-option v-for="(item, index) in stateList"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select> -->
          <el-input size="medium"  clearable placeholder="审批人名称" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 120px;"></el-input>
          <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :fixed="header.fixed"   :label="header.label" :sortable="header.sortable"
                         :formatter="header.formatter" :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>

          <template slot-scope="scope">
            <div v-if="header.prop == 'name'">
              <router-link v-if="scope.row.targetType=== '007'"  :to="{path: '/router/travelApproval', query: {id: scope.row.id, targetId: scope.row.targetId, targetType: scope.row.targetType,tag: '1'}}">
                {{scope.row.name}}
              </router-link>
              <router-link v-else-if="scope.row.targetType=== '008'"  :to="{path: '/router/reimburseAuditDetail', query: {id: scope.row.id, targetId: scope.row.targetId, targetType: scope.row.targetType,tag: '1'}}">
                {{scope.row.name}}
              </router-link>
              <router-link v-else  :to="{path: '/router/auditDetail', query: {id: scope.row.id, targetId: scope.row.targetId, targetType: scope.row.targetType,tag: '1'}}">
                {{scope.row.name}}
              </router-link>
            </div>
             <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
                 <div v-else-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractCode, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
           <div v-else-if="header.prop == 'targetId'">
              {{scope.row.category==0?scope.row.targetId:''}}
            </div>
            <div v-else-if="header.prop == 'category'">
              {{scope.row.category | approvalCategoryFilter}}
            </div>
            <div v-else-if="header.prop == 'states'">
              {{scope.row.states | approvalApplyStateFilter}}
            </div>
            <div v-else-if="header.prop == 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="tabIndex==4 || tabIndex==0?170:80" fixed="right" v-if="tabIndex!=1">
          <template slot-scope="scope">
            <el-button v-if="tabIndex==3" v-showBtn data-authorityType="reject-btn" type="primary" size="mini" @click="cancel(scope.row)">撤销</el-button>
            <span v-if="tabIndex==4 || tabIndex==0">
                <el-button  v-showBtn data-authorityType="remind-btn" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-showBtn data-authorityType="reSubmit-btn" type="primary" size="mini" @click="newSubmit(scope.row)">重新提交</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="page-box" justify="end">
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

        <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
      </el-row>
    </div>
    <el-dialog
      title="撤销操作"
      :visible.sync="isShowDialog"
      :close-on-click-modal="canClick"
      width="40%">
      <div>
        <el-row >
          <el-col :span="12" v-if="editForm.projectName">
            <span>项目名称：{{editForm.projectName}}</span>
          </el-col>
          <!-- <el-col :span="12">
            <span>审批人：{{editForm.projectName}}</span>
          </el-col> -->
        </el-row>
        <el-row class="m10">
          <el-col :span="24">
            <el-input v-model="editForm.withdrawalReasons" type="textarea" placeholder="请输入撤销原因" maxlength="500" :rows="4" show-word-limit></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm222('editForm')">确 认</el-button>
        <el-button type="primary" size="small" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filter from '@/filters/filter'
  export default {
    data () {
      return {
        canClick: false,
        backFlag: false,
        isShowDialog: false,
        currentItem: null,
        editForm: {
          id : '',
          states : '',
          withdrawalReasons: ''
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          finishTimeStart:'',
          finishTimeEnd:'',
          param:'',
          type: '',
          state: '3', //状态
        },
        tableHeader: [{
          prop: 'positionName',
          label: '审批职位',
          width: '100',
          show: true
        }, {
          prop: 'targetId',
          label: '申请编号',
          align: 'left',
          width:'130',
          show: true
        },{
          prop: 'amount',
          label: '金额',
          width:'80',
          show: true
        },{
          prop: 'name',
          label: '流程名称',
          width: '150',
          show: true
        },{
          prop: 'categoryF',
          label: '类型',
          align: 'left',
          show: true
        }, {
          prop: 'statesF',
          label: '状态',
          align: 'left',
          show: true
        }, {
          prop: 'describe',
          label: '描述',
          align: 'left',
          show: true
        }, {
          prop: 'approvalName',
          label: '审批人',
          width: '100',
          show: true
        }, {
          prop: 'createDt',
          align: 'left',
          label: '提交时间',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        multipleSelection: [],
        /** 总数据数 */
        total: 10,
        /** 表格 loading */
        listLoading: false,
        tabIndex: 3,
        categoryList: filter.approvalTargetTypeArr(),
        stateList: filter.approvalApplyStateArr()  
      
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      handleProjectStatus(item){
         this.$confirm('您确定要将项目【' + item.projectName + '】结案吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            stateId: '045',
            projectCode: item.projectCode,
            }
          Api.updateProjectState(params).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '结案成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '结案失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      //处理编辑
      handleEdit(row){
         console.log(row,'row')
        const targetType = row.targetType
        let path='', 
        msg='此记录暂时不允许在此编辑',
        query ={
           id:row.targetId,
           flag:'myApply',
           edit:null,
        }
      
        if(targetType=='015' || targetType=='016' || targetType=='017' || targetType=='018'){
          query.id = row.carId
          query.registrationNumber = row.registrationNumber
        }
         switch(targetType) {
          case '008' : 
            //报销申请
            path = '/router/editReimburseApply'
            break;
          case '007' :
            //差旅申请
            path = '/router/editTravelApply'
            
            break;
          case '004' :    
            //发票申请
            path = '/router/editInvoiceApply'    
            query.edit = '1'  // 暂时不明确
            break;
          case '005' :    
            //付款申请
            path = '/router/editPaymentApply'
            break;
          case '006' :    
            //借款申请
            path = '/router/editBorrowApply'
            break;
          case '014' :    
            //借款申请
            path = '/router/administrationApplyEdit'
            break;
          case '015' :    
            //保养维修编辑
             path = '/router/maintenanceInfo'
             
             msg= '请到车辆详情页中【保养维修】选项卡中修改'
            break;
          case '016' :    
            //出险记录
             path = '/router/insuranceRecord'
             msg= '请到车辆详情页中【出险记录】选项卡中修改'
            break;
          case '017' :    
            //油卡
             path = '/router/oilCard'
              msg= '请到车辆详情页中【油卡】选项卡中修改'
            break;
          case '018' :    
            //ETC编辑
             path = '/router/ETC'
             msg= '请到车辆详情页中【ETC】选项卡中修改'
             
            break;
          default : 
            break;
        }
        if(path){
          this.$router.push({
            path:path,
            query:query,
          })
        }else{
           this.$notify({
               title:'提示',
               type:'warning',
               message:msg
            })
        }
        
      },
      changeTabData (index) {
        this.tabIndex = index
        this.query.state =index+''
        // switch(index) {
        //   case 1 : this.query.state =  '3'
        //     break;
        //   case 2 : this.query.state = '4'
        //     break;
        //   case 3 : this.query.state =  '1'
        //     break;
        // }
        this.loadData()
      },
      /**
       * 加载
       */
     loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.query.targetType = '014'
        this.listLoading = true
        Api.approvalPage(this.query).then(data => {
          this.listData = data.records;
          let _this = this
          this.listData.forEach(function (item) {
            _this.$set(item, 'statesF', filter.approvalApplyStateFilter(item.states))
            _this.$set(item, 'categoryF', filter.approvalCategoryFilter(item.category))
          })
          this.total = data.total
          this.listLoading = false
        })
      },
      // reject (item) {
      //
      // },
      //撤销功能
      cancel(item){
         this.isShowDialog = true
         let editForm = JSON.parse(JSON.stringify(item))
          editForm.states = '4'
          this.editForm = editForm
      },
      confirm222 () {
       const params = this.editForm
        Api.changeState(params).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '撤销成功'
              })
              this.loadData()
              this.isShowDialog = false
            } else {
              this.$notify.warning({
                title: '提示',
                message: '撤销失败'
              })
            }
          })
      },

      /**重新提交**/
      newSubmit (item) {
        this.$confirm('您确定要重新提交【' + item.name + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.resubmit({id: item.id}).then((res) => {
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

      closeDialog () {
        this.editForm.reason = ''
        this.isShowDialog = false
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
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`)
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.keyword = ''
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
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let data = this.listData
          // data.forEach(function (item) {
          //   item.category = filter.approvalCategoryFilter(item.category)
          //   item.states = filter.approvalApplyStateFilter(item.states)
          // })
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
                a.download = '我的申请列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>
