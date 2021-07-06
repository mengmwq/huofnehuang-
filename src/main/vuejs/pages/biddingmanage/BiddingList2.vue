<template>
  <div>
    <div class="tab-nav" style="padding: 0 15px;border-bottom: 1px solid #e3e2e2;">
      <div class="nav-item tab" @click="changeTabData(0)">
        <span :class="query.category===0 ? 'tab-active' : ''">进行中</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(1)">
        <span :class="query.category===1 ? 'tab-active' : ''">已完成</span>
      </div>
      <div class="nav-item tab" @click="changeTabData(2)">
        <span :class="query.category===2 ? 'tab-active' : ''">作废</span>
      </div>
    </div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="6">
        <el-button type="primary" size="medium" @click="addNewBidPro" v-showBtn data-authorityType="addBiddingPro-btn"
                   icon="el-icon-plus"> 新增投标项目
        </el-button>
      </el-col>
      <el-col :span="18" class="text-right">
        <el-select filterable v-model="query.stateId" clearable placeholder="状态" size="medium" @change="loadData(null)"
                   style="width:180px">
          <el-option v-for="(item, index) in bindTyleList"
                     :key="index"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-input size="medium" clearable placeholder="时间，采购人，项目名称，项目编号" icon="search" v-model="query.param"
                  @keyup.enter.native="loadData" style="width: 300px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading"
              :cell-style="{color:'#333'}"
    >
      <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                       :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'signUpType'">
            {{scope.row.signUpType | registrationMethod}}
          </div>
          <div v-if="header.prop == 'bidProjectName' && scope.row.stateId==='3'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, bidType: scope.row.bidType, stateId: scope.row.stateId}}">{{scope.row.bidProjectName}}</router-link>
          </div>
          <div v-else-if="header.prop == 'bidProjectName' && scope.row.stateId!=='3'">
              {{scope.row.bidProjectName}}
          </div>
          <div v-else-if="header.prop == 'projectCode' && scope.row.stateId==='3'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, bidType: scope.row.bidType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
          </div>
          <div v-else-if="header.prop == 'projectCode' && scope.row.stateId!=='3'">
              {{scope.row.projectCode}}
          </div>
          <div v-else-if="header.prop == 'bidOpeningDate'">
            {{scope.row.bidOpeningDate | timeFormatOpening}}
          </div>
          <div v-else-if="header.prop == 'stateId'">
            {{scope.row.stateId | biddingFilter}}
          </div>
          <div v-else-if="header.prop == 'deadline'">
            {{scope.row.deadline | timeFormatBid}}
          </div>
          <div v-else-if="header.prop == 'budgetAmount'">
          	{{scope.row.budgetAmount | toThousandsNoZero}} 
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right" v-if="tabIndex === 1">
        <template slot-scope="scope">
              <router-link :to="{path: '/router/biddingDetail', query: {id: scope.row.id, applyId:scope.row.applyId,states:scope.row.states}}">
                 <el-button type="primary" size="mini">详情</el-button>
              </router-link>
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
</template>


<script>
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'

  export default {
    components: {
      FileListMultiUpload
    },
    data() {
      return {
        printFlag: false,
        canClick: false,
        
       
        tabIndex: 1,
        timeRange: '',
        form: {
          purchaser: '',
          bidDocumentAtt: {},
          bidAttorney: {},
          bidderIdCard: {},
          qualificationAtt: {}
        },      //已报名操作已用
        form1: {},    //加载审批已用
        form2: {},    //打印框已用
        //标书制作已用
        form3: {
          bidingDocumentAttachmentReqList: []
        },
        
         //反馈已用
        dialogVisible: false,      //打印弹框已用
        dialogVisible1: false,     //审批弹框已用
        dialogVisibleTender: false, //标书制作汇总已用
        dialogVisibleTailAfter: false,//跟踪已用
        dialogVisibleBack: false,//反馈已用
        
        value: '',

        query: {
          pageSize: 10,
          pageNum: 1,
          param: '',
          stateId:'',
          category:0,
          biddingType:'A'
        },
        tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width:'60',
          show: true
        }, {
          prop: 'bidProjectName',
          align: 'left',
          label: '项目名称',
          width:'120',
          show: true
        },  {
          prop: 'customerName',
          align: 'left',
          label: '客户名称',
          width:'120',
          show: true
        }, {
          prop: 'budgetAmount',
          align: 'right',
          label: '预算金额',
          show: true
        }, {
          prop: 'deadline',
          align: 'center',
          label: '购买标书截止日',
          show: true
        }, {
          prop: 'bidOpeningDate',
          align: 'center',
          label: '开标时间',
          show: true
        }, {
          prop: 'stateId',
          label: '状态',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],     //列表
        listData1: [],    //审批
        listDataTailAfter: [], //跟踪
        /** 总数据数 */
        total: 0,
        /** 表格列表 loading */
        listLoading: false,
        /** 表格审批 loading */
        listLoading1: false,
        /** 表格 文件制作汇总loading */
        listLoading3: false,
        /** 表格 跟踪loading */
        listLoadingTailAfter: false,
        /** 表格 反馈loading */
        listLoadingBack: false,
        /** 表格 反馈2(填写)loading */
        listLoadingBack2: false,
       
        bindTyleList: [{
		    label: '报名',
		    value: '0'
		  }, {
		    label: '标书审核',
		    value: '1'
		  },{
		    label: '开标',
		    value: '2'
		  }],
        //yesnoBidding
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      clearData() {
        this.fileList = 0
        this.removedAll = false
      },
      /** 序号 */
      indexMethod(index) {
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
      },
     changeTabData(index){
       this.query.category = index
       if(this.query.category === 0){
       	this.bindTyleList = [{
		    label: '报名',
		    value: '0'
		  }, {
		    label: '标书审核',
		    value: '1'
		  },{
		    label: '开标',
		    value: '2'
		  }]
       }
       if(this.query.category === 1){
       	this.bindTyleList = [{
		    label: '中标',
		    value: '3'
		  }, {
		    label: '未中标',
		    value: '4'
		  }]
       }
       if(this.query.category === 2){
       	this.bindTyleList = [{
		    label: '流程被驳回',
		    value: '5'
		  }, {
		    label: '未作投标文件',
		    value: '6'
		  }, {
		    label: '投标文件未投标',
		    value: '7'
		  }]
       }
       this.loadData()
     },


      /**
       * 加载列表
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.queryBidProjectList(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            // this.id= data.id
            // console.log('ok')
            this.listLoading = false
          }
        })
      },

      /**加载审批***/
      loadExamine(item) {
        let param = {
          id: item.id,
        }
        this.listLoading1 = true
        Api.queryBidProjectById(param).then(data => {
          if (data) {
            this.form1 = data
            this.listData1 = data.bidAttachmentRespList
            // this.total = data.total
            // this.id= data.id
            console.log(this.form1)
            console.log(this.listData1)
            this.listLoading1 = false
          }
        })
      },


      

      /**
       * 完成归档
       * */
      okFile(item) {
        this.$confirm('确认您是否已完成【' + item.bidProjectName + '】归档', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.id = item.id
          // this.form.stateId = '013'  //归档
          Api.fileBidProjectByBidProjectId(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '已确认归档'
              })
              // 重新渲染页面数据
              this.loadData()
            }
          })
        });
      },

      /**
       * 已投标
       * */
      HasBid(item) {
        this.$confirm('确认您是否确认【' + item.bidProjectName + '】已投标？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.id = item.id
          this.form.stateId = '010'
          Api.changeBidProjectStateById(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '已确认投标'
              })
              // 重新渲染页面数据
              this.loadData()
            }
          })
        });
      },

      /**
       * 文件制作
       * */
      documenting(item) {
        this.$confirm('确认您是否已开始制作【' + item.bidProjectName + '】投标文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.id = item.id
          this.form.stateId = '005'  //文件制作中
          this.form.purchaser = item.purchaser;
          Api.updateBidProject(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '已确认制作'
              })
              // 重新渲染页面数据
              this.loadData()
            }
          })
        });
      },

      

      

      //添加跳转
      addNewBidPro() {
        this.$router.push({
          path: '/router/addBidProject',
          query:{
            type:'A',
          }
        })
      },
      

      columnChange: function (data) {
        this.tableHeader = data;
      },
      tableStatusChange(val) {
        this.tableStatus = val;
      },
      formartDate(value) {
        let times = '';
        if (value) {
          times = moment(value).format("YYYY-MM-DD HH:mm:ss");
        }
        return times;
      },
      houseIded(row, index) {
        if (row.jobState == 'TCQX' || row.jobState == 'MDPB') {
          return 0;
        } else {
          return 1;
        }
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters() {
        this.query.param = '';
        this.query.pageNum = 1;
      },
      handleSizeChange(val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      /**
       * 导出excel
       */
      exportExcel() {
        if (this.listData.length > 0) {
          let data = this.listData
          data.forEach(function (item) {
            item.signUpType = filters.registrationMethod(item.signUpType)
            item.stateId = filters.biddingFilter(item.stateId)
          })
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
                a.download = '投标列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>

