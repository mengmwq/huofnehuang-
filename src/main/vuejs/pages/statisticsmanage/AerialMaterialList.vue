<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4" v-if="$route.path!='/router/projectDetail'">
        <el-button type="primary" size="medium" v-showBtn data-authorityType="addMaterial-btn" @click="addAerialMaterial">+ 新增航材报关</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
         <el-select filterable v-model="query.importExportType" clearable placeholder="进出类型" size="medium" style="width:150px" @change="loadData">
            <el-option v-for="item in importExportTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        <el-date-picker
          v-model="query.startTime"
          type="date"
          size="medium"
          placeholder="选择开始申报日期">
        </el-date-picker>
        至
        <el-date-picker
          v-model="query.endTime"
          size="medium"
          type="date"
          placeholder="选择结束申报日期">
        </el-date-picker>
        <el-input size="medium" clearable placeholder="报关单号/运单号" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}">
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
            </div>
            <div v-else-if="header.prop == 'customsNo'">
	          <router-link :to="{path: '/router/AddAerialMaterial',query:{id: scope.row.id}}">
	            {{scope.row.customsNo}}
	          </router-link>
	        </div>
            <div v-else-if="header.prop == 'projectCode'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
            </div>
          <div v-else-if="header.prop == 'declareDate'">
            {{scope.row.declareDate | timeFormatBid}}
          </div>
           <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
          <div v-else-if="header.prop === 'contractCode'">
            <router-link :to="{path: '/router/AddContracts', query: {id: scope.row.contractId, type: 'detail'}}">
              {{scope.row.contractCode}}
            </router-link>
          </div>
          <div v-else-if="header.prop == 'importExportType'">
            {{scope.row.attached.ImportAndExportType[scope.row.importExportType].cnInfo}}
          </div>
          <div v-else-if="header.prop == 'shipMode'">
            {{scope.row.shipMode | transportFilter}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" fixed="right" v-if="$route.path!='/router/projectDetail'">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="deleteAerial(scope.row)">删除</el-button>
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
      <el-button type="primary" size="small" v-if="$route.path!='/router/projectDetail'" @click="exportExcel">导出excel</el-button>
    </el-row>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'

  export default {
    data () {
      const projectCode = this.$route.query.id
      let show = true;
      if(this.$route.path=='/router/projectDetail'){
         show=false
      }
      return {
        timeRange: '',
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          endTime : '',
          startTime : '',
          projectCode:projectCode?projectCode:''
        },
        tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          width:'150',
          show: show
        }, {
          prop: 'projectName',
          label: '项目名称',
          fixed:'left',
           align: 'left',
          width:'320',
          show: show
        }, {
          prop: 'importExportType',
          label: '进出类型',
          fixed:'left',
          align: 'left',
          width:'80',
          show: show
        }, {
          prop: 'customsNo',
          align: 'center',
          label: '报关单号',
          width:'200',
          show: true
        }, {
          prop: 'mainCode',
          label: '提运单号',
          align: 'center',
          width:'200',
          fixed:'left',
          show: true
        }, {
          prop: 'customerName',
          label: '客户名称',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'quantity',
          align: 'center',
          label: '件数',
          width: '100',
          show: true
        }, {
          prop: 'weight',
          align: 'center',
          label: '重量',
          width: '100',
          show: true
        },{
          prop: 'declareDate',
          align: 'center',
          label: '申报日期',
          width: '100',
          show: true
        },  {
          prop: 'customsTax',
          align: 'center',
          label: '报关费',
          width: '60',
          show: true
        }, {
          prop: 'delayedDecFee',
          align: 'center',
          label: '滞报费',
          width: '60',
          show: true
        }, {
          prop: 'lateFee',
          align: 'center',
          label: '滞纳费',
          width: '60',
          show: true
        }, {
          prop: 'quarantineFee',
          align: 'center',
          label: '检疫费',
          width: '60',
          show: true
        }, {
          prop: 'inspectionFee',
          align: 'center',
          label: '查验费',
          width: '60',
          show: true
        }, {
          prop: 'valueAddTax',
          align: 'center',
          label: '送货费',
          width: '60',
          show: true
        }, {
          prop: 'warehousingCharges',
          align: 'center',
          label: '仓储费',
          width: '60',
          show: true
        }, {
          prop: 'otherExpenses',
          align: 'center',
          label: '其他费用',
          width: '60',
          show: true
        }, {
          prop: 'remark',
          align: 'center',
          label: '备注',
          width: '150',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        importExportTypeArr:[{
              value: '001',
              label: '进口'
            }, {
              value: '002',
              label: '出口'
            }],
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {

      /**
       * 加载
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.query.state = '4'
        this.listLoading = true
        if(this.query.startTime!='' ){
          this.query.startTime = moment(this.query.startTime).format('YYYY-MM-DD')
        }
        if( this.query.endTime!=''){
          this.query.endTime = moment(this.query.endTime).format('YYYY-MM-DD')
        }
        if(this.query.startTime === 'Invalid date'){
        	this.query.startTime = '';
        }
        if(this.query.endTime === 'Invalid date'){
        	this.query.endTime = '';
        }
        Api.customsPage(this.query).then(data => {
          this.listData = data.records;
          this.total = data.total
          this.listLoading = false
        })
      },

      /***删除**/
      deleteAerial (item) {
        this.$confirm('您确定要删除['+item.chineseName+']的信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.customsDelete(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },


      addAerialMaterial () {
        this.$router.push({path: '/router/AddAerialMaterial'})
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
      canSelected(row, index) {
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
        this.keyword = '';
        this.query.pageNum = 1;
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
                a.download = '航材报关列表数据.xlsx'
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

