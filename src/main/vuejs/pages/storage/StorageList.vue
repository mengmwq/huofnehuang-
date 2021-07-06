 <template>
    <div>
        <el-row class="mb10 query">
          <el-col :span="10">
            <el-button type="primary" size="medium" v-showBtn data-authorityType="addStockIn-btn" @click="inStorage" icon="el-icon-plus">添加入库</el-button>
            <el-button type="primary" size="medium" v-showBtn data-authorityType="addStockOut-btn" @click="outStorage" icon="el-icon-plus">添加出库</el-button>
            <el-button type="primary" size="medium" v-showBtn data-authorityType="useable-btn" @click="emptyStorage">可用位置</el-button>
            <el-button type="primary" size="medium" v-showBtn data-authorityType="stockPrint-btn" @click="printStorageBill">打印库存清单</el-button>
          </el-col>
          <el-col :span="14" class="text-right" style="float: right">
            <el-select filterable v-model="query.retrievalFlg" clearable  size="medium" placeholder="入库途径" style="width:110px">
                <el-option v-for="(item,index) in channelList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
            <el-input v-model="query.searchStr"  size="medium" prefix-icon="el-icon-search" placeholder="货物名称/项目编号"  style="width:300px;" :maxlength="50"
            ></el-input>
            <el-button type="primary" style="margin-left:6px;"  size="medium" @click="loadData" data-authorityType="role-select-button">查询
            </el-button>
          </el-col>
        </el-row>
        <el-row class="page-table-box">
            <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading"
                      :cell-style="{color:'#333'}" @selection-change="handleSelectionChange" @sort-change="sortChange">
              <el-table-column type="selection" width="55" :selectable='canSelected'></el-table-column>
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'projectName'">
                    <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode}}">{{scope.row.projectName}}</router-link>
                  </div>
                  <div v-else-if="header.prop == 'goodsName'">
                    <a href="javascript:;" @click="showGoodsDetails(scope.row)">{{scope.row.goodsName}}</a>
                  </div>
                  
                  <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
                  <div v-else-if="header.prop == 'channelStr'">
                    {{scope.row.channelStr}}
                  </div>

                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" v-showBtn data-authorityType="moveStock-btn" @click="moveStorage(scope.row)">移库</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" class="page-box" justify="end">
            <el-pagination
                background
                @size-change="handleSizeChange" :total="total"
                @current-change="handleCurrentChange"
                layout="total,sizes, ->,prev, pager, next"
                :page-sizes="[10, 25, 50]"
                :page-size="query.pageSize">
            </el-pagination>
            <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>
        </el-row>
        <!--<TableColumn @change="columnChange" :tableHeader="tableHeader" @tableStatusChange="tableStatusChange"></TableColumn>-->
        <StorageMove v-show="isShowDialog" :isShowDialog="isShowDialog" :stockInfo="stockInfo" @closeDialog="closeDialog" />
        <StorageEmpty v-show="isShowStorageEmptyDialog" :isShowDialog="isShowStorageEmptyDialog" @closeDialog="closeDialog"/>
        <el-dialog
            title="货物详情"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose">
              <MaterialDetail
                  :operateFlag="'pro-detail'"
                  :projectType="projectType"
                  :projectCode="projectCode"
          ></MaterialDetail>
          </el-dialog>
    </div>

</template>
<script>

import Api from "@/api/index"
import TableColumn from '@/components/common/TableColumn'
import StorageMove from '@/pages/storage/StorageMove'
import StorageEmpty from '@/pages/storage/StorageEmpty'
import MaterialDetail from '@/pages/my/project/MaterialDetail'
import * as filters from '@/filters/filter'
export default {
  name: 'StorageList',
  components:{
    StorageMove, StorageEmpty, TableColumn,MaterialDetail
  },
   watch: {
  },
  computed: {
    now() {
      return this.$route.path === '/router/storage' ? 0 : 1;
    },

  },
  data () {
    return {
      dialogVisible:false,
      projectCode:'',
      projectType:'',
      isShowStorageEmptyDialog:false, // 可用位置弹窗
      isShowDialog:false,   // 移库弹窗
      listLoading: false,
      sels: [],
      stockInfo: {},
      editForm: null,
      channelList: filters.stockChannelArr(), /** 入库途径 */
      query:{
        retrievalFlg: '',  //出入库标致
        searchStr:'',  //关键字
        pageNum: 1,
        pageSize: 10
      },
      listData: [],
      total: 0,
      tableHeader: [{
        prop: 'goodsName',
        label: '货物名称',
        align: 'center',
        width: '160',
        show: true
      }, {
        prop: 'warehouseName',
        label: '库名',
        width: '120',
        show: true
      }, {
        prop: 'houseName',
        label: '仓名',
        width: '160',
        show: true
      },{
        prop: 'cabinetName',
        label: '柜名',
        width: '60',
        show: true
      }, {
        prop: 'grideName',
        label: '位名',
        width: '60',
        show: true
      }, {
        prop: 'projectCode',
        label: '项目编号',
        width: '140',
        show: true
      }, {
        prop: 'projectName',
        label: '项目名称',
        width: '200',
        show: true
      }, {
        prop: 'boxSn',
        label: '包装箱号',
        width: '80',
        show: true
      }, {
        prop: 'number',
        label: '数量',
        width: '80',
        show: true
      }, {
        prop: 'insidePackageCount',
        label: '箱内件数',
        width: '80',
        show: true
      }, {
        prop: 'weight',
        label: '毛重(kg)',
        width: '80',
        show: true
      }, {
        prop: 'volume',
        label: '体积(m³)',
        width: '80',
        show: true
      }, {
        prop: 'channelStr',
        label: '出入库途径',
        width: '200',
        show: true
      }]
    }
  },
  mounted() {
    this.loadData();
  },
  methods:{
    //显示浮窗并赋值参数 
      showGoodsDetails(row){
         this.projectCode = row.projectCode
         this.projectType = row.projectType
         this.dialogVisible = true
      },
      //关闭货物详情窗口；
      handleClose(){
        this.dialogVisible = false
        this.loadData()
      },
    /**
     * 加载库存清单列表
     * */
    loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
      Api.manualStocakPageList(this.query).then((res) => {
        if (res) {
          this.listData = res.records
          let _this = this
          this.listData.forEach(function (item) {
              _this.$set(item, 'channelStr', filters.stockChannelFilter(item.channel))
          })
          this.total = res.total
        }
      })
    },
    /** 添加入库 */
    inStorage(){
       this.$router.push({
          path:'/router/addStorageIn',
       })
    },
    /** 添加出库 */
    outStorage(){
      if (this.sels.length === 0) {
        this.$notify.warning({
          title: '提示',
          message: '请勾选需要出库的记录'
        })
        return
      } else {
        let flag = false
        for (let i = 0; i < this.sels.length; i++) {
          if (this.sels[i].channel === '001' || this.sels[i].channel === '002') {
            flag = true
            break
          }
        }
        if (flag) {
          this.$notify.warning({
            title: '提示',
            message: '出库只能出手动入库的数据'
          })
          return
        } else {
          this.$store.dispatch('setStockOutIds', this.sels)
        }

      }
       this.$router.push({
          path:'/router/addStorageOut',
       })
    },
    /** 可用位置 */
    emptyStorage(){
       this.isShowStorageEmptyDialog = true
    },
    /** 打印库存清单 */
    printStorageBill(){

    },
    /***
     * 表头切换
     */
    columnChange(data) {
      this.tableHeader = data;
    },

    handleSelectionChange(sels) {
      this.sels = sels;
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.loadData()
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.loadData(val)
    },
    columnChange(data) {
      this.tableHeader = data;
    },
    /** 表格排序变化 */
    sortChange({ column, prop, order }){
      if(order){
      	  var s= order.substring(0,1);
	      var sOrder = 'asc';
	      if(s=='d'){
	        sOrder = 'desc';
	      }
	      this.query.tableOrder = prop+' '+sOrder;
	      this.query.pageNum = 1;
	      this.loadData();
      	}
    },
    refresh() {
      this.loadData()
    },
    /** 移库 */
    moveStorage(row){
       this.stockInfo = row
       this.isShowDialog = true
    },
    canSelected (row, index) {
      if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
        return 0
      } else {
        return 1
      }
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
              a.download = '库存清单列表数据.xlsx'
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          }
        })
      }
    },
    /**
     * 关闭浮窗
     */
    closeDialog: function() {
      this.isShowStorageEmptyDialog = false
      this.isShowDialog = false
      this.loadData();
    },
  }
}
</script>
