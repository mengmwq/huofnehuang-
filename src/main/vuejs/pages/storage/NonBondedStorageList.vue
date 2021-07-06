 <template>
  <div>
    <el-row class="mb10 query">
      <el-col :span="10">
        <el-button
          type="primary"
          size="medium"
          @click="addItem"
          icon="el-icon-plus"
        >创建库存</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="inStorage"
         
        >入库</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="outStorage"
         
        >出库</el-button>
        <!-- <el-button type="primary" size="medium" v-showBtn data-authorityType="stockPrint-btn" @click="printStorageBill">打印库存清单</el-button> -->
      </el-col>
      <el-col :span="14" class="text-right" style="float: right">
       
        <el-input
          v-model="query.name"
          size="medium"
          prefix-icon="el-icon-search"
          placeholder="商品名称"
          style="width:160px;"
          :maxlength="50"
        ></el-input>
        <el-button
          type="primary"
          style="margin-left:6px;"
          size="medium"
          @click="loadData"
          data-authority-type="role-select-button"
        >查询</el-button>
      </el-col>
    </el-row>
    <el-row class="page-table-box">
      <el-table
        class="page-table"
        :data="listData"

        stripe
        highlight-current-row
        v-loading="listLoading"
        :cell-style="{color:'#333'}"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(header, index) in tableHeader">
          <el-table-column
            v-if="header.show"
            :key="index"
            :prop="header.prop"
            :label="header.label"
            :sortable="header.sortable"
            :min-width="header.width"
            :fixed="header.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="header.prop == 'materialCode'" >
                 <a href="javascript:;" @click="showDetails(scope.row)">{{scope.row.materialCode}}</a>
              </div>
              <div v-else-if="header.prop == 'transferTime'">{{scope.row.transferTime | timeFormatBid}}</div> 
              <div v-else-if="header.prop == 'initialDate'">{{scope.row.initialDate | timeFormatBid}}</div> 
              <div v-else-if="header.prop == 'cargoMovingData'">{{scope.row.cargoMovingData | timeFormatBid}}</div>
              <div v-else-if="header.prop == 'cargoMovingType'">{{getDictsKeyName(scope.row,'TYPE',scope.row.cargoMovingType)}}</div>
              <div v-else-if="header.prop == 'receipt'">{{getDictsKeyName(scope.row,'CHK_RESULT',scope.row.receipt)}}</div>
               <div v-else-if="header.prop == 'applicants'">{{getDictsKeyName(scope.row,'APPLICANTS_TYPE',scope.row.applicants)}}</div>
              <div v-else-if="header.prop == 'type'">{{getDictsKeyName(scope.row,'MESSAGE_TYPE',scope.row.type)}}</div>
               <div v-else-if="header.prop == 'functionCode'">{{getDictsKeyName(scope.row,'FUNCTION_CODE',scope.row.functionCode)}}</div>
              <div v-else-if="header.prop == 'status'">{{getDictsKeyName(scope.row,'NON_BONDED_STATUS',scope.row.status)}}</div>
              <div v-else-if="header.prop == 'senderType'">{{getDictsKeyName(scope.row,'SEND_TYPE',scope.row.senderType)}}</div>
              <div v-else-if="header.prop == 'materialProperties'">{{getDictsKeyName(scope.row,'GOODS_NATURE',scope.row.materialProperties)}}</div>
              <div v-else-if="header.prop == 'dataType'">{{getDictsKeyName(scope.row,'DATA_TYPE',scope.row.dataType)}}</div>
              <div v-else-if="header.prop == 'qualifiedType'">{{getDictsKeyName(scope.row,'CHK_CODE',scope.row.qualifiedType)}}</div>
              <div v-else>{{scope.row[header.prop]}}</div>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              size="mini"
             
              @click="showDetails(scope.row)"
            >详情</el-button> -->
             <el-button
              type="primary"
              size="mini"
            
              @click="editItem(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              size="mini"
            
              @click="deleteItem(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" class="page-box" justify="end">
      <el-pagination
        background
        @size-change="handleSizeChange"
        :total="total"
        @current-change="handleCurrentChange"
        layout="total,sizes, ->,prev, pager, next"
        :page-sizes="[10, 25, 50]"
        :page-size="query.pageSize"
      ></el-pagination>
      <!-- <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button> -->
    </el-row>
    <!--<TableColumn @change="columnChange" :tableHeader="tableHeader" @tableStatusChange="tableStatusChange"></TableColumn>-->
    <NoBondedStorageIn 
       v-if="isShowDialog"
      :isShowDialog="isShowDialog" 
      :goodsInfo ="goodsInfo"
      @closeDialog="closeDialog"  @changeDialog="changeDialog" 
    />
    <NoBondedStorageOut 
       v-if="isShowDialogOut"
      :isShowDialog="isShowDialogOut" 
      :goodsInfo ="goodsInfo"
      @closeDialog="closeDialog"  @changeDialog="changeDialog" 
    />
  </div>
</template>
<script>
import Api from "@/api/index";
import NoBondedStorageIn from "./NoBondedStorageIn";
import NoBondedStorageOut from "./NoBondedStorageOut";

import * as filters from "@/filters/filter";
import Util from '@/utils/'

export default {
  name: "NonBondedStorageList",
  components: {
    NoBondedStorageIn,NoBondedStorageOut
  },
  watch: {},
  computed: {
    //报文业务类型
    statusList(){
        return this.$store.state.dictionary.dists.NON_BONDED_STATUS.children;
    },
    now() {
      return this.$route.path === "/router/storage" ? 0 : 1;
    }
  },
  data() {
    return {

      isShowStorageEmptyDialog: false, // 可用位置弹窗
      isShowDialog: false, // 入库弹窗
      isShowDialogOut:false,// 出库
      listLoading: false,
      sels: [],
      stockInfo: {},
      goodsInfo:null,
      editForm: null,
      query: {
        name: '', //商品名称
        pageNum: 1,
        pageSize: 10
      },
      listData: [],
      total: 0,

      tableHeader: [
        
        {
          prop: "materialCode",
          label: "料号",
          width: "120",
          fixed:'left',
          show: true
        },
      {
          prop: "itemCode",
          label: "项号",
          width: "120",
          show: true
        },
        {
          prop: "name",
          label: "商品名称",
          width: "120",
          show: true
        },
         {
          prop: "price",
          label: "单价",
          width: "120",
          show: false
        },
        {
          prop: "totalPrice",
          label: "总价",
          width: "120",
          show: true
        },
        {
          prop: "initialNumber",
          label: "数量",
          width: "120",
          show: true
        },
        {
          prop: "applicants",
          label: "申报单位",
          width: "120",
          show: true
        },
       
        {
          prop: "materialProperties",
          label: "料件性质",
          width: "120",
          show: true
        },
        {
          prop: "materialBelongs",
          label: "料件所属",
          width: "120",
          show: true
        },
        {
          prop: "cargoForm",
          label: "货物形态",
          width: "120",
          show: true
        },
       
        {
          prop: "warehouse",
          label: "库别",
          width: "120",
          show: false
        },
        {
          prop: "storageLocation",
          label: "储位",
          width: "120",
          show: true
        },
        {
          prop: "qualifiedType",
          label: "合格类型",
          width: "120",
          show: true
        },
        
      ]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    //出库操作
    outStorage(){
       const selected = this.sels
       if(selected.length==0){
         this.$notify({
                title: '提示',
                type:'warning',
                message: "请至少选择所要出库的记录！"
              });
          return;
       }
        if(selected.length>0){
          const count = selected.some(item=>item.initialNumber==0)
          if(count){
              this.$notify({
                  title: '提示',
                  type:'warning',
                  message: "出库的记录存在商品数量为0情况！"
                });
            return;
          }
         
       }
       this.goodsInfo = JSON.parse(JSON.stringify(selected))
       console.log(this.goodsInfo,';this.goodsInfo')
       this.isShowDialogOut = true
    },
    //入库操作
    inStorage(){
       const selected = this.sels
       if(selected.length==0){
         this.$notify({
                title: '提示',
                type:'warning',
                message: "请至少选择所要入库的记录！"
              });
          return;
       }
       this.goodsInfo = JSON.parse(JSON.stringify(selected))
       console.log(this.goodsInfo,';this.goodsInfo')
       this.isShowDialog = true
    },
    changeDialog(){
      this.closeDialog()
      this.loadData()
    },
    closeDialog(){
       this.isShowDialog = false
       this.isShowDialogOut  = false
    },
    //删除入库信息
    deleteItem(row){
      this.$confirm(`您确定将商品名称【${row.name}】的信息删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id:row.id
          }
            Api.removeBonded(params).then(res=>{
               this.$notify({
                title: '提示',
                type:'success',
                message: "删除操作成功！"
              });
            this.loadData()
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
    },
    //查看详情
    showDetails(row){
       this.$router.push({
         path:'/router/nobondedDetails',
         query:{
           id:row.id,
           flag:'details'
         },
       })
    },
    //编辑
    editItem(row){
       this.$router.push({
         path:'/router/editNobonded',
         query:{
           id:row.id,
           flag:'edit',
         },
       })
    },
    addItem(){
       this.$router.push({
         path:'/router/addNobonded',
         query:{
           flag:'add',
         },
       })
    },
    //获取数据字典名称通过KEY
    getDictsKeyName(row,key,value){
      return Util.getDictsKeyName(row,key,value)
    },
    //获取格式化时间
    getFormatTime(time,format){
      return Util.getFormatTime(time,format)
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
      Api.queryPageNotBonded(this.query).then(res => {
        if (res) {
          this.listData = res.records;
          let _this = this;
          this.listData.forEach(function(item) {
            _this.$set(
              item,
              "channelStr",
              filters.stockChannelFilter(item.channel)
            );
          });
          this.total = res.total;
        }
      });
    },
    /** 添加入库 */
    inStorage1() {
      const selected = this.sels
      if (selected.length === 0) {
        this.$notify.warning({
          title: "提示",
          message: "请勾选需要入库的记录"
        });
        return;
      } 
      this.$confirm('您确定要进行出库操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            Api.WarehousingNotBonded(selected).then(res=>{
               this.$notify({
                title: '提示',
                type:'success',
                message: "入库操作成功！"
              });
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
      
    },
    /** 添加出库 */
    outStorage1() {
      const selected = this.sels
      if (selected.length === 0) {
        this.$notify.warning({
          title: "提示",
          message: "请勾选需要出库的记录"
        });
        return;
      } 
       this.$confirm('您确定要进行出库操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            Api.checkoutNotBonded(selected).then(res=>{
               this.$notify({
                title: '提示',
                type:'success',
                message: "出库操作成功！"
              });
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
      
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
      this.loadData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.loadData(val);
    },
    columnChange(data) {
      this.tableHeader = data;
    },
    /** 表格排序变化 */
    sortChange({ column, prop, order }) {
      if (order) {
        var s = order.substring(0, 1);
        var sOrder = "asc";
        if (s == "d") {
          sOrder = "desc";
        }
        this.query.tableOrder = prop + " " + sOrder;
        this.query.pageNum = 1;
        this.loadData();
      }
    },
    refresh() {
      this.loadData();
    },
  }
};
</script>
