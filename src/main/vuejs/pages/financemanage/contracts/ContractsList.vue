<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="small" v-if="$route.path==='/router/contactsList'" v-showBtn data-authorityType="add-btn" @click="addContracts" icon="el-icon-plus">新增合同</el-button>
        <el-button type="primary" size="small" v-else @click="addContracts" icon="el-icon-plus">新增合同</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: right;">
        <span v-if="$route.path=='/router/contractsList'">
          申请日期：
        <el-date-picker size="small" type="date" v-model="query.applyDateStart" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        style="width: 200px"
                        placeholder="开始日期">
        </el-date-picker>
                                              &nbsp;至&nbsp;
        <el-date-picker size="small"  type="date" v-model="query.applyDateEnd" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        style="width: 200px"
                        placeholder="结束日期">
        </el-date-picker>
        </span>
        <el-select filterable v-model="query.states" clearable @change="loadData(null)" placeholder="合同状态" size="small" style="width:140px">
          <el-option
            v-for="item in contractState"
            :key="item.value"
            :label="item.cnInfo"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="small" clearable placeholder="合同名称/项目编号/标题" icon="search" v-model="query.titleOrProjectCode" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="small" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table"  stripe highlight-current-row 
    height="420"
    :data="listData"
    :cell-style="{color:'#333'}">
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :fixed="header.fixed" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
           <div v-if="header.prop === 'proNo'">
             <router-link :to="{path: '/router/'}">{{scope.row.proNo}}</router-link>
           </div>
          
            <div v-else-if="header.prop == 'projectName'">
              <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.contractId, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
              <div>{{scope.row.projectCode}}</div>
            </div>
            <div v-else-if="header.prop === 'contractName'">
            <router-link :to="{path: '/router/contractsDetails', query: {id: scope.row.id, type: 'detail'}}">
              {{scope.row.contractName}}
            </router-link>
            <div>{{scope.row.contractCode}}</div>
          </div>
          <div v-else-if="header.prop === 'states'">
            <div v-if="scope.row.attached && scope.row.attached.ContractState">{{scope.row.attached.ContractState[scope.row.states].cnInfo}}</div> 
          </div>
          <div v-else-if="header.prop === 'contractLimit'">
            {{scope.row.contractLimit | DateFormat}}
            <div class="gray">{{scope.row.contractTypeId}}</div>
          </div>
          <div v-else-if="header.prop === 'applyDate'">
            {{scope.row.applyDate | DateFormat}}
            <div class="gray">{{scope.row.ctUName}}</div>
          </div>
          <div v-else-if="header.prop === 'approvalTime'">
            {{scope.row.approvalTime | DateFormat}}
            <div class="gray">
               {{scope.row.positionName}}
               {{scope.row.approvalName}}
            </div>
          </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="100" fixed="right"  v-if="$route.path==='/router/contractsList'">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            
              <el-dropdown-item v-showBtn data-authorityType="delete-btn" @click.native="deleteHT(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item v-showBtn data-authorityType="end-btn" @click.native="zhongzhi(scope.row)">终止</el-dropdown-item>
              <el-dropdown-item v-showBtn data-authorityType="position-btn" @click.native="onSubmit1(scope.row)">存放位置</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.states !== '004'" v-showBtn data-authorityType="complete-btn" @click.native="onSubmit3(scope.row)">完成</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
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
      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>

    <!-- <el-dialog
    title="合同存放"
    :close-on-click-modal="canClick"
    :visible.sync="dialogVisible1"
    size="tiny" top="12vh" width="30%">
    <div style="text-align: center">
      <el-form :model="form" label-width="120px">
        <el-form-item label="存放位置">
          <el-input v-model="form.storageLocation"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 20px">
        <el-button type="primary" size="small" @click="dialogVisible1=false">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit1()">确 定</el-button>
      </div>
    </div>
  </el-dialog>

    <el-dialog
      title="终止"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible2"
      size="tiny" top="12vh" width="30%">
      <div style="text-align: center">
        <el-form :model="form" label-width="120px">
          <el-form-item label="终止原因">
            <el-input v-model="form.reasonsTermination"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible2=false">取 消</el-button>
          <el-button type="primary" size="small" @click="onSubmit2()">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="完成"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible3"
      size="tiny" top="12vh" width="30%">
      <div style="text-align: center">
        <el-form :model="form" label-width="120px">
          <el-form-item label="确认合同是否已执行完成">
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible3=false">取 消</el-button>
          <el-button type="primary" size="small" @click="onSubmit3()">确 定</el-button>
        </div>
      </div>
    </el-dialog> -->

  </div>
</template>


<script>
  import * as filters from '@/filters/filter'
  import moment from 'moment'
  import Api from '@/api/index'
  export default {
    data () {
      const bidId = this.$route.query.id

      return {
        canClick: false,
        dialogVisible1:false,     //合同位置弹框
        dialogVisible2:false,     //终止弹框
        dialogVisible3:false,     //完成弹框

        form: {
          storageLocation:'' ,//合同存放位置
          reasonsTermination:'' ,//终止原因
          states:'',    //状态
          id:'',
          
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          applyDateEnd:'', //申请结束时间
          applyDateStart:'', //申请开始日期
          states:'', //合同状态
          titleOrProjectCode: '',//根据项目编码或者合同名称模糊搜索
          bidId:bidId?bidId:'', //来自投标详情页
        },
        tableHeader: [{
          prop: 'contractName',
          label: '合同名称',
          width: '190',
          //fixed:'left',
          align: 'left',
          show: true
        }, {
          prop: 'contractCode',
          label: '合同编号',
          width: '150',
          align: 'left',
          show: false
        }, {
          prop: 'projectCode',
          label: '项目编号',
          align: 'left',
          width: '150',
          show: false
        }, {
          prop: 'projectName',
          label: '项目名称',
          align: 'left',
          // fixed:'left',
          width: '220',
          show: true
        }, {
          prop: 'customerName',
          label: '客户名称',
          align: 'left',
          width: '200',
          show: true
        }, {
          prop: 'title',
          label: '标题',
          align: 'left',
          show: false
        }, {
          prop: 'orgName',     //未知
          label: '部门',
          width: '100',
          align: 'left',
          show: bidId?false:true
        }, {
          prop: 'states',
          align: 'left',
          label: '合同状态',
          width: '76',
          show: true
        }, {
          prop: 'contractTypeId',
          align: 'left',
          label: '合同类型',
          width: '100',
          show: false
        }, {
          prop: 'contractLimit',
          label: '合同期限',
          align: 'left',
          width:'90',
          show: true
        },{
          prop: 'storageLocation',
          label: '存放位置',
          align: 'left',
          show: false
        },  {
          prop: 'ctUName',        //未做
          align: 'left',
          label: '申请人',
          width: '100',
          show: false
        }, {
          prop: 'applyDate',
          align: 'left',
          label: '申请时间',
          width: '90',
          show: true
        }, {
          prop: 'approvalName',           //未做
          align: 'left',
          label: '审批人',
          width: '100',
          show: false
        }, {
          prop: 'positionName',           //未做
          align: 'left',
          label: '审批岗位',
          width: '100',
          show: false
        }, {
          prop: 'approvalTime',           //未做
          align: 'left',
          label: '审批时间',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading contractState*/
        listLoading: false,
      }
    },
    mounted () {
      this.loadData()
    },
    computed: {
      contractState(){
        return this.$store.state.dictionary.dists.ContractState.children
      },
    },
    methods: {

      /**
       * 加载合同列表数据
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.query.type = '1'
        this.listLoading = true
        Api.pageContract(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },

      addContracts () {
        const query = this.$route.query
        let params=null;
        if(query){
          params = {
            bidId:query.id,
            projectCode:query.projectCode
          }
        }
        params.contractsType='1'
        this.$router.push({
          path: '/router/AddContracts',
          query:params,
        })
      },

      


      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.query.titleOrProjectCode = ''
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
                a.download = '合同列表数据.xlsx'
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

