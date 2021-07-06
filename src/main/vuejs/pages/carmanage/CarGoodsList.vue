<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" size="medium" @click="addCarLink" v-showBtn data-authorityType="addCar-btn">+ 新增车辆</el-button>
        <!--<el-button type="primary" size="medium" v-showBtn data-authorityType="batchPrint-btn" @click="dialogVisible=true">批量打印</el-button>-->
      </el-col>
      <el-col :span="14" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="请输入车牌号" prefix-icon="el-icon-search" icon="search" v-model="query.registrationNumber" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table"  :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column label="序号" type="index" width="48" :index="indexMethod"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
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
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" v-showBtn data-authorityType="edit-btn" size="small" @click="editCarLink(scope.row)">编辑</el-button>
          <el-button type="primary" v-showBtn data-authorityType="delete-btn" size="small" @click="deleteCar(scope.row)">删除</el-button>
          <el-button type="primary" v-showBtn data-authorityType="print-btn" size="small" @click="print">打印</el-button>
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
    <el-dialog
      title="批量打印"
      :visible.sync="dialogVisible"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="30%">
      <div style="text-align: center">
        <el-form :model="form" label-width="120px">
          <el-form-item label="日期">
            <el-date-picker style="width: 100%"
              v-model="form.value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="打印类型">
            <el-select v-model="form.region" placeholder="请选择打印类型" style="width: 100%">
              <el-option label="一日三检备查表" value="1"></el-option>
              <el-option label="一日三检备查表" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="dialogVisible=false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
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
          registrationNumber: ''
        },
        tableHeader: [ {
          prop: 'registrationNumber',
          label: '车牌号',
          align: 'center',
          show: true
        }, {
          prop: 'engineSn',
          label: '发动机号码',
          align: 'center',
          show: true
        }, {
          prop: 'carTypeId',
          label: '车辆类型',
          align: 'center',
          show: true
        }, {
          prop: 'length',
          label: '长x宽x高',
          align: 'center',
          width:'140',
          show: true
        }, 
        // {
        //   prop: 'width',
        //   label: '宽',
        //   align: 'center',
        //   show: true
        // }, {
        //   prop: 'height',
        //   label: '高',
        //   align: 'center',
        //   show: true
        // },
         {
          prop: 'currentMileageNumber',
          label: '上次保养公里',
          align: 'center',
          width: '110',
          show: true
        }, {
          prop: 'nextMileageNumber',
          align: 'center',
          label: '下次保养公里',
          width: '110',
          show: true
        }, {
          prop: 'policyEndDate',
          align: 'center',
          label: '保险到期日',
          width: '100',
          show: true
        }, {
          prop: 'policyCompany',
          align: 'center',
          label: '保险公司',
          width: '100',
          show: true
        }, {
          prop: 'isAccident',
          align: 'center',
          label: '是否出险',
          width: '100',
          show: true
        }, {
          prop: 'premium',
          align: 'center',
          label: '保险费用',
          width: '100',
          show: true
        }, {
          prop: 'taxesPolicyEndDate',
          align: 'center',
          label: '商业保险到期日',
          width: '100',
          show: true
        }, {
          prop: 'taxesPolicyCompany',
          align: 'center',
          label: '商业保险公司',
          width: '100',
          show: true
        }, {
          prop: 'taxesPremium',
          align: 'center',
          label: '商业保险费用',
          width: '100',
          show: true
        }, {
          prop: 'leader',
          align: 'center',
          label: '部门负责人',
          width: '100',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '创建日期',
          width: '100',
          show: true
        }, {
          prop: 'updateDt',
          align: 'center',
          label: '修改日期',
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
        this.query.type = '3'
        Api.selectCarList(this.query).then(data => {
          this.listData = data.records;
          this.total = data.total
          this.listLoading = false
        })
      },

      /**添加跳转**/
      addCarLink () {
        this.$router.push({path: '/router/addCar',
          query:{
            type:'3'
          },
        })//1代表添加，带参验证
      },

      /**编辑跳转**/
      editCarLink (item) {
        this.$router.push({path: '/router/editCar', query: {id: item.id,temp:1}})
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

<style scoped>

</style>

