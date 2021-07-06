<template>
  <div>
    <div class="tab-nav" style="padding: 0 15px;border-bottom: 1px solid #e3e2e2;">
      <div class="nav-item tab" @click="changeTabData(3)">
        <span :class="tabIndex==3 ? 'tab-active' : ''">审批中</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(2)">
        <span :class="tabIndex==2 ? 'tab-active' : ''">待审批</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(1)">
        <span :class="tabIndex==1 ? 'tab-active' : ''">批准</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(0)">
        <span :class="tabIndex==0 ? 'tab-active' : ''">拒绝</span>
      </div>
    </div>
    <div style="margin: 20px 0">
      <el-row>
        <el-col :span="24" class="text-right">
          申请时间： <el-date-picker
          v-model="query.finishTimeStart"
          type="date"
          size="medium"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择开始日期">
        </el-date-picker>
          至
          <el-date-picker
            v-model="query.finishTimeEnd"
            type="date"
            size="medium"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择结束日期">
          </el-date-picker>
          <el-select v-model="query.approvalType" clearable placeholder="审批类型" size="medium" style="width:150px">
            <el-option v-for="(item, index) in categoryList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-select v-model="query.state"  @change="loadData" clearable placeholder="审批状态" size="medium" style="width:150px">
            <el-option v-for="(item, index) in stateList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <el-input size="medium" clearable placeholder="提报人姓名" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
          <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="padding: 0 15px;">
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop" :fixed="header.fixed"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
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
            <div v-else-if="header.prop == 'targetType'">
              {{scope.row.targetType | approvalTargetTypeFilter}}
            </div>
            <div v-else-if="header.prop == 'category'">
              {{scope.row.category | approvalCategoryFilter}}
            </div>
            <div v-else-if="header.prop == 'targetId'">
               {{scope.row.category==0?scope.row.targetId:''}}
            </div>
            <div v-else-if="header.prop == 'statesF'">
              {{scope.row.statesF | approvalApplyStateFilter}}
            </div>
            <div v-else-if="header.prop == 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right" v-if="tabIndex === 3">
          <template slot-scope="scope">
            <!--<router-link :to="{path: '/router/auditDetail', query: {id: scope.row.id, targetId: scope.row.targetId, targetType: scope.row.targetType}}">
              <el-button type="primary" size="mini">审批</el-button>
            </router-link>-->
            <el-button type="primary" v-showBtn data-authorityType="audit-btn" size="mini" v-if="scope.row.states === '3'" @click="audit(scope.row)">审批</el-button>
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
  </div>
</template>
<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filter from '@/filters/filter'
  export default {
    data () {
      return {
        query: {
          pageSize: 10,
          pageNum: 1,
          finishTimeStart:'',
          finishTimeEnd:'',
          param:'',
          type: '',
          state: 3, //状态，
          positionId: ''
        },
        tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          width:'150',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          width:'250',
          align: 'left',
          fixed:'left',
          show: true
        }, {
          prop: 'customerName',
          label: '客户名称',
          width:'220',
          align: 'left',
          show: true
        }, 
        //  {
        //   prop: 'contractCode',
        //   label: '合同号',
        //   align: 'left',
        //   show: true
        // }, 
       
        //  {
        //   prop: 'contractCode',
        //   label: '合同编号',
        //   align: 'left',
        //   width:'130',
        //   show: true
        // },
        {
          prop: 'name',
          label: '流程名称',
          show: true
        }, {
          prop: 'targetTypeF',
          label: '事项名称',
          align: 'left',
          show: true
        }, {
          prop: 'categoryF',
          label: '类型',
          align: 'left',
          show: true
        }, 
         {
           prop: 'amount',
           label: '金额',
           align: 'left',
           show: true
         }, 
        {
          prop: 'ctUName',
          label: '申请人',
          show: true
        }, 
        // {
        //   prop: 'applicationReasons',
        //   align: 'left',
        //   label: '申请理由',
        //   show: true
        // },
         {
          prop: 'createDt',
          align: 'left',
          label: '申请时间',
          width:'150',
          show: true
        },{
          prop: 'targetId',
          label: '申请编号',
          align: 'left',
          width:'130',
          show: true
        },],
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
      let jwt = JSON.parse(sessionStorage.getItem('jwt'))
      this.query.positionId = jwt.positionId
      this.loadData()
    },
    methods: {
      changeTabData (index) {
        this.tabIndex = index
        this.query.state = index
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
        let _this = this
        this.query.targetType = '001'
        Api.approvalPageList(this.query).then(data => {
          this.listData = data.records;
          this.listData.forEach(function (item) {
            _this.$set(item, 'statesF', filter.approvalApplyStateFilter(item.states))
            _this.$set(item, 'categoryF', filter.approvalCategoryFilter(item.category))
            _this.$set(item, 'targetTypeF', filter.approvalTargetTypeFilter(item.targetType))
          })
          this.total = data.total

        })
      },

      /**
       * 点击审批，分发至不同的审批详情页面
       * */
      audit (item) {
       
        let param = {id: item.id, targetId: item.targetId, targetType: item.targetType}

        let targetType = item.targetType

         /**
          * 合同审批 001
          * 报价审批 002
          * 投标审批 003
          * 发票审批 004
          * 付款审批 005
          * 借款审批 006
          * 差旅报销审批 007
          * 报销审批 008
          * 异常审批 009
          * 物料消耗审批 010
          * 工具消耗审批 011
          * 航材报关审批 012
          * 标书审批 013
          * 行政审批 014
          * 维修保养 015
          * 出险记录 016
          * 油卡信息 017
          * ETC信息 018
          * */
         
         const  aTargetType =['001','002','003','004','005','006','009','010','011','012','013','014','015','016','017','018']
         if (aTargetType.some(item=>item == targetType)) {
            this.$router.push({path: '/router/auditDetail', query: param})
         } else {

           switch (targetType) {
             case ('007'):
               // 差旅审批
               this.$router.push({path: '/router/travelApproval', query: param})
               break
             case ('008'):
               // 报销审批
               this.$router.push({path: '/router/reimburseAuditDetail', query: param})
               break
           }
         }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },

      /**
       * 同意
       * */
      reject (item) {
        this.$confirm('您确定同意吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.approvalAccept(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '成功'
            })
            this.query.pageNum = 1;
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '失败'
            })
          })
        })
      },

      /**
       * 驳回
       * */
      reject (item) {
        this.$confirm('您确定驳回吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.approvalRefuse(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '成功'
            })
            this.query.pageNum = 1;
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '失败'
            })
          })
        })
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
                a.download = '我的审核列表数据.xlsx'
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
