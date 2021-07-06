<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="6">
        &nbsp; <!--<el-button type="primary" size="medium" @click="addNewBidPro" icon="el-icon-plus"> 新增投标项目</el-button>-->
      </el-col>
      <el-col :span="18" class="text-right">
        <el-input size="medium" clearable placeholder="输入电话号码" icon="search" v-model="query.param" @keyup.enter.native="loadData" style="width: 300px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'signUpType'">
            {{scope.row.signUpType | registrationMethod}}
          </div>
          <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
              <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
          <div v-else-if="header.prop == 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>

      <!--<el-table-column label="操作" width="100" fixed="right" v-if="tabIndex === 1">-->
        <!--<template slot-scope="scope">-->
          <!--<el-dropdown>-->
            <!--<el-button type="primary" size="small">-->
              <!--操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--</el-button>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--&lt;!&ndash;<router-link :to="{path: '/router/editProject', query: {id: scope.row.projectCode}}" tag="div">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-dropdown-item>编辑</el-dropdown-item>&ndash;&gt;-->
              <!--&lt;!&ndash;</router-link>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-dropdown-item>编辑</el-dropdown-item>&ndash;&gt;-->
              <!--<router-link :to="{path: '/router/biddingDetail', query: {id: scope.row.id}}" tag="div">-->
                <!--<el-dropdown-item >查看</el-dropdown-item>-->
              <!--</router-link>-->
              <!--<el-dropdown-item @click.native="dialogVisible1=true,loadExamine(scope.row)">审批</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="editNewBidPro(scope.row)">编辑</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="onSubmit3(scope.row)">已报名</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="documenting(scope.row)">文件制作</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="printList(scope.row)">打印清单</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="tenderMakeAll(scope.row)">标书制作汇总</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="bidBack(scope.row)">投标现场情况反馈</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="bidTailAfter(scope.row)">投标结果情况跟踪</el-dropdown-item>-->
              <!--<el-dropdown-item @click.native="okFile(scope.row)">完成归档</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作" width="210" fixed="right">-->
      <!--<template slot-scope="scope">-->
      <!--<router-link :to="{path: '/router/biddingDetail', query: {id: id}}">-->
      <!--<el-button type="primary" size="small">查看</el-button>-->
      <!--</router-link>-->
      <!--<el-button type="primary" size="small" @click="dialogVisible1=true,loadExamine(scope.row)">审批</el-button>-->
      <!--<el-button type="primary" size="small" @click="dialogVisible=true">打印</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
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
  import Upload from '@/components/common/Upload'
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  export default {
    data () {
      return {
        tabIndex: 1,
        timeRange: '',
        form: {},      //已报名操作已用
        form1: {},    //加载审批已用
        form2: {},    //打印框已用
        form3: {},    //标书制作已用
        formTailAfter : {},  //跟踪已用
        formBack : {
          bidderInfoReqList:[]
        },  //反馈已用
        dialogVisible: false,      //打印弹框已用
        dialogVisible1: false,     //审批弹框已用
        dialogVisibleTender: false, //标书制作汇总已用
        dialogVisibleTailAfter: false,//跟踪已用
        dialogVisibleBack: false,//反馈已用
        options: [{
          value: '1',
          label: '顺利'
        }, {
          value: '0',
          label: '不顺利'
        }],
        value: '',

        query: {
          pageSize: 10,
          pageNum: 1,
          param:'',
          projectCode:''
        },
        tableHeader: [{
          prop: 'signUpType',
          label: '报名方式',
          align: 'center',
          show: true
        }, {
          prop: 'projectContet',
          label: '项目内容',
          align: 'center',
          show: true
        }, {
          prop: 'bidCode',
          label: '招标编号',
          align: 'center',
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
          align: 'center',
          width:'150',
          show: true
        }, {
          prop: 'bidProjectName',
          align: 'center',
          label: '项目名称',
           width:'200',
          show: true
        }, 
        // {
        //   prop: 'purchaser',
        //   align: 'center',
        //   label: '采购方',
        //   show: true
        // }, {
        //   prop: 'purchaserTel',
        //   label: '采购电话',
        //   align: 'center',
        //   show: true
        // }, 
        {
          prop: 'bidType',
          label: '招标方式',
          align: 'center',
          show: true
        }, {
          prop: 'budgetAmount',
          align: 'center',
          label: '预算金额',
          show: true
        }, {
          prop: 'packageNumber',
          align: 'center',
          label: '购买标书数',
          width:'120',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '开始时间',
           width:'150',
          show: true
        },{
          prop: 'agentCompany',
          align: 'center',
          label: '代理单位',
          show: true
        }, 
         {
          prop: 'agent',                         //未做
          align: 'center',
          label: '代理联系人',
          width:'150',
          show: true
        }, 
        {
          prop: 'agentTel',
          align: 'center',
          label: '代理电话',
          width:'120',
          show: true
        }, 
        {
          prop: 'signUpInfo',
          align: 'center',
          label: '报名情况',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          show: true
        }],
        // 标书制作汇总表格      （审批公用，未做，后改）
        tableHeader1: [{
          prop: 'name',
          align: 'center',
          label: '文件名称',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '上传时间',
          show: true
        }, {
          prop: 'ctUName',
          align: 'center',
          label: '上传人员',
          show: true
        }],

        // 跟踪
        tableHeaderTailAfter: [{
          prop: 'name',
          align: 'center',
          label: '文件名称',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '上传时间',
          show: true
        }, {
          prop: 'ctUId',
          align: 'center',
          label: '上传人员',
          show: true
        }],

        // 反馈
        tableHeaderBack: [{
          prop: 'name',
          align: 'center',
          label: '文件名称',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '上传时间',
          show: true
        }, {
          prop: 'ctUName',
          align: 'center',
          label: '上传人员',
          show: true
        }],

        // 反馈2（填写）供应商列表
        tableHeaderBack2: [{
          prop: 'bidderCompanyName',
          align: 'center',
          label: '供应商名称',
          show: true
        }, {
          prop: 'bidder',
          align: 'center',
          label: '供应商代表姓名',
          show: true
        }, {
          prop: 'tel',
          align: 'center',
          label: '联系方式',
          show: true
        }, {
          prop: 'grade',
          align: 'center',
          label: '得分',
          show: true
        }, {
          prop: 'openBidPrice',
          align: 'center',
          label: '开标价',
          show: true
        }],

        /** 表格数据 */
        listData: [],     //列表
        listData1: [],    //审批
        listData2: [],  //标书制作汇总
        listDataTailAfter: [], //跟踪
        listDataBack: [], //反馈
        //listDataBack2: [], //反馈2(填写)

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
        /** 表格 文件制作汇总 审批下拉loading */
        shenPiList :[]
      }
    },
    props: {
      projectCode: String,
    },
    watch: {
      projectCode: function (value) {
        this.query.projectCode = value
      },
    },
    mounted () {
      this.loadData()
    },
    methods: {
      /** 序号 */
      indexMethod(index){
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
      },
      /** 标书制作汇总序号 */
      indexMethod2(index){
        return index+1
      },

      /**
       * 加载列表
       */
      loadData () {
        this.listLoading = true
        Api.queryBidProjectByProjectCode(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            // this.id= data.id
            // console.log('ok')
            this.listLoading = false
          }
        })
      },


      columnChange: function(data) {
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
        if(row.jobState == 'TCQX' || row.jobState == 'MDPB'){
          return 0;
        } else{
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
          let data = this.listData
          data.forEach(function (item) {
            item.signUpType = filters.registrationMethod(item.signUpType)
          })
          let param = {
            tableHead: this.tableHeader,
            data: data
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
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>

