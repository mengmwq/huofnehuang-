<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <!-- <el-button type="primary" size="small" @click="editCarLink">查看</el-button> -->
      <el-col :span="24" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="请输入车牌号" prefix-icon="el-icon-search" icon="search" v-model="query.registrationNumber" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table"  :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <!-- <el-table-column label="序号" type="index" width="48" :index="indexMethod"></el-table-column> -->
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :fixed="header.fixed" :label="header.label" :sortable="header.sortable"
                       :align="header.align" :formatter="header.formatter" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>

      <template slot-scope="scope">
           <div v-if="header.prop == 'registrationNumber'">
             <router-link :to="{path: '/router/carDetail',  query: {id: scope.row.id, registrationNumber: scope.row.registrationNumber}}">
               {{scope.row.registrationNumber}}
             </router-link>
           </div>
            <div v-else-if="header.prop == 'length'">
               <template v-if="scope.row.width && scope.row.length && scope.row.height">
                 {{scope.row.length}} X {{scope.row.width}} X {{scope.row.height}}
               </template>
              
           </div>
           <div v-else-if="header.prop == 'policyEndDate'">
               {{scope.row.policyEndDate | DateFormat}}
           </div>
          
            <div v-else-if="header.prop == 'createDt'">
               {{scope.row.createDt | DateFormat}}
           </div>
           <div v-else-if="header.prop == 'updateDt'">
               {{scope.row.updateDt | DateFormat}}
           </div>
           <div v-else-if="header.prop == 'isAccident'">
               {{scope.row.isAccident ? '是' : '否'}}
           </div>
           <div v-else-if="header.prop == 'carTypeId'">
               {{scope.row.carTypeId | carTypeFilter}}
           </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.g7Gpsno" size="small" @click="editCarLink(scope.row)">查看</el-button>
          
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
    </el-row>
  </div>
</template>


<script>
  import Api from '@/api/index'
  export default {
    data () {
      return {
        canClick: false,
        dialogVisible: false,
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          registrationNumber: '',
          type:'',
          delFlg:'',
        },
        tableHeader: [ {
          prop: 'registrationNumber',
          label: '车牌号',
          align: 'center',
          show: true,
          fixed:true,
        }, {
          prop: 'brand',
          label: '品牌型号',
          align: 'center',
          show: true
        }, {
          prop: 'carOwner',
          label: '所属机构',
           width:'340',
          align: 'center',
          show: true
        }, {
          prop: 'company',
          label: '来源机构',
          align: 'center',
          width:'240',
          show: true
        }, {
          prop: 'length',
          label: '车长',
          align: 'center',
          width: '120',
          show: true
        }, {
          prop: 'hdWeight',
          align: 'center',
          label: '额定载重',
          width: '100',
          show: true
        }, {
          prop: 'nextMileageNumber',
          align: 'center',
          label: '车型',
          width: '110',
          show: true
        }, {
          prop: 'useType',
          align: 'center',
          label: '使用类型',
          width: '100',
          show: true
        }, {
          prop: 'use',
          align: 'center',
          label: '车辆用途',
          width: '100',
          show: true
        }, {
          prop: 'team',
          align: 'center',
          label: '车队',
          width: '100',
          show: true
        }, {
          prop: 'gpsStatus',
          align: 'center',
          label: 'Gps状态',
          width: '100',
          show: true
        }, {
          prop: 'status',
          align: 'center',
          label: '车辆状态',
          width: '100',
          show: true
        }, {
          prop: 'volumn',
          align: 'center',
          label: '额定体积',
          width: '100',
          show: true
        }, {
          prop: 'city',
          align: 'center',
          label: '所在区域',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false
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
       * 加载智慧领航船舶数据库
       */
      loadData () {
        this.listLoading = true
        Api.getG7CarInfoPage(this.query).then(data => {
          this.listData = data.records;
          this.total = data.total
          this.listLoading = false
        })
      },

      /**添加跳转**/
      addCarLink () {
        this.$router.push({path: '/router/addCar',
          query:{
            type:'1'
          },
        })//1代表添加，带参验证
      },

      /**编辑跳转**/
      editCarLink (item) {
        this.$router.push({path: '/router/carTracking', query: {'carnum':item.registrationNumber,'gpsno':item.g7Gpsno,}})
      },

      /**删除**/
      deleteCar (item) {
        this.$confirm('您确定要删除车['+item.registrationNumber+']辆信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteCar(param).then(() => {

            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            this.query.pageNum = 1;
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },
      columnChange (data) {
        this.tableHeader = data;
      },
      tableStatusChange (val) {
        this.tableStatus = val;
      },
      formartDate(value) {
        let times = '';
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss');
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
        this.query.registrationNumber = '';
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
            }
          })
        }
      },

      //打印
      print(){
        window.print()
      }

    }
  }
</script>

