<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb10">
      <el-col :span="14">
        操作时间：
        <el-date-picker
          v-model="query.startTime"
          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
          @change="loadData"
          type="date"
          size="medium"
          placeholder="选择开始日期">
        </el-date-picker>
          至
        <el-date-picker
          v-model="query.endTime"
          value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
          @change="loadData"
          size="medium"
          type="date"
          placeholder="选择结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="10" class="text-right">
        <el-select v-model="query.taskOutStock" clearable placeholder="入库途径" size="medium" style="width:170px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<el-select v-model="query.caId" clearable placeholder="全部仓库" size="medium" style="width:170px">-->
          <!--<el-option-->
            <!--:key="1"-->
            <!--:label="111"-->
            <!--:value="1">-->
          <!--</el-option>-->
          <!--<el-option-->
            <!--:key="2"-->
            <!--:label="222"-->
            <!--:value="2">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-input size="medium" clearable placeholder="货物名称/包装箱号/项目编号/项目名称" icon="search" v-model="query.keyword" @keyup.enter.native="loadData" style="width: 290px;"></el-input>-->
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :formatter="header.formatter" :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope">
           <div v-if="header.prop === 'happenTime'">
             {{scope.row.happenTime | timeFormat}}
           </div>
           <div v-else-if="header.prop === 'operType'">
             {{scope.row.operType | logOperateTypeFilter}}
           </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <!--<el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="">移库</el-button>

        </template>
      </el-table-column>-->
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
  import * as filters from '../../filters/filter'
  import Api from '@/api/index'
  import moment from 'moment'
  export default {
    data () {
      return {
        timeRange: '',
        query: {
          taskOutStock:'',  //下拉
          pageSize:10,
          pageNum:1,
          id : '',
          flg : 'STOCK',
          startTime:'', //开始时间,
          endTime:''//结束
        },
        tableHeader: [{
          prop: 'happenTime',
          label: '操作时间',
          align: 'center',
          show: true
        }, {
          prop: 'userName',
          label: '操作人',
          align: 'center',
          show: true
        }, {
          prop: 'operDescription',
          label: '详细操作',
          align: 'center',
          width: '350',
          show: true
        }, {
          prop: 'userAccount',
          label: '用户账号',
          align: 'center',
          show: true
        }, {
          prop: 'userPhone',
          label: '用户手机',
          align: 'center',
          show: true
        }, {
          prop: 'operType',
          label: '操作类型',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        options: [{
          value: 'TASKOUTSTOCK',
          label: '项目任务出库日志'
        }, {
          value: 'TASKENTRYSTOCK',
          label: '项目任务入库日志'
        }, {
          value: 'MANUALENTERSTOCK',
          label: '手动入库日志'
        }, {
          value: 'MANUALOUTSTOCK',
          label: '手动出库日志'
        }, {
          value: 'CHANGESTOCK',
          label: '移库日志'
        }],
        value: ''
      }
    },



    mounted () {
      this.loadData()
    },
    methods: {
      /** 序号 */
      indexMethod(index){
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
      },

      /**
       * 加载日志
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        // if(this.query.finishTimeEnd!=''&&this.query.finishTimeEnd!=''){
        //   this.query.startTime = moment(this.query.startTime).format('YYYY-MM-DD')
        //   this.query.endTime = moment(this.query.endTime).format('YYYY-MM-DD')
        // }
        Api.operationLogPageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total=res.total
          }
        })
        this.listLoading = false
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
        this.query.pageNumber = 1;
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
          data.forEach(function (item) {
            item.operType = filters.logOperateTypeFilter(item.operType)
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

