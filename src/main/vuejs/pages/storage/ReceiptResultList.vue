 <template>
  <div>
    <el-row class="mb10">
      <el-col :span="24" class="text-right">
        <el-select v-model="query.type" filterable  clearable placeholder="类型" size="medium" style="width:160px;">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.cnInfo" :value="item.value" ></el-option>
        </el-select>
        <el-select v-model="query.chkResult"  filterable clearable placeholder="状态" size="medium" style="width: 160px;">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.cnInfo" :value="item.value" ></el-option>
        </el-select>
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
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column type="expand" >
          <template slot-scope="scope" class="subHeader">
            <div v-if="scope.row.nonBondeds">
              <el-table  :data="scope.row.nonBondeds" stripe :show-header="true">
                <el-table-column type="index" width="55" label="序号"></el-table-column>
              <el-table-column
                v-for="(header, index) in tableHeaderChildren"
                :key="index"
                :prop="header.prop"
                :label="header.label"
                :sortable="header.sortable"
              >
            <template slot-scope="scope">
              <div v-if="header.prop == 'applicants'">{{getDictsKeyName(scope.row,'APPLICANTS_TYPE',scope.row.applicants)}}</div> 
            
              <div v-else>{{scope.row[header.prop]}}</div>
            </template>
              </el-table-column>
            </el-table>
            </div>
          </template>
        </el-table-column>
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
              <div v-else-if="header.prop == 'createDt'">{{scope.row.createDt | timeFormat}}</div>
              <div v-else-if="header.prop == 'type'">{{getDictsKeyName(scope.row,'TYPE',scope.row.type)}}</div> 
              <div v-else-if="header.prop == 'chkResult'">{{getDictsKeyName(scope.row,'NON_BONDED_STATUS',scope.row.chkResult)}}</div> 
            
              <div v-else>{{scope.row[header.prop]}}</div>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
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
        </el-table-column> -->
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
  name: "ReceiptResultList",
  components: {
    NoBondedStorageIn,NoBondedStorageOut
  },
  watch: {},
  computed: {
    //报文业务类型
    statusList(){
        return this.$store.state.dictionary.dists.NON_BONDED_STATUS.children;
    },
    typeList(){
        return this.$store.state.dictionary.dists.TYPE.children;
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
        type: '', //类型
        pageNum: 1,
        pageSize: 10,
        chkResult:'', //状态

      },
      listData: [],
      total: 0,
      
      tableHeaderChildren:[
        {
          prop: 'name',
          label: '名称',
          width: '120',
          show: true
        }, {
          prop: 'initialNumber',
          label: '数量',
          width: '120',
          show: true,
        
        }, {
          prop: 'applicants',
          label: '申请单位',
          width: '160',
          show: true
        }, {
          prop: 'applicationForm',
          label: '申请单号',
          width: '160',
          show: true
        }
      ],
      tableHeader: [
        
        {
          prop: "ctUName",
          label: "操作人",
          width: "120",
          show: true
        },
      {
          prop: "createDt",
          label: "创建时间",
          width: "120",
          show: true
        },
        {
          prop: "type",
          label: "类型",
          width: "120",
          show: true
        },
         {
          prop: "chkResult",
          label: "状态",
          width: "120",
          show: true
        },
        // {
        //   prop: "nonBondeds",
        //   label: "实体",
        //   width: "120",
        //   show: true
        // },
        {
          prop: "result",
          label: "错误提示",
          width: "120",
          show: true
        },
        
       
        // {
        //   prop: "materialProperties",
        //   label: "料件性质",
        //   width: "120",
        //   show: true
        // },
        // {
        //   prop: "materialBelongs",
        //   label: "料件所属",
        //   width: "120",
        //   show: true
        // },
        // {
        //   prop: "cargoForm",
        //   label: "货物形态",
        //   width: "120",
        //   show: true
        // },
       
        // {
        //   prop: "warehouse",
        //   label: "库别",
        //   width: "120",
        //   show: false
        // },
        // {
        //   prop: "storageLocation",
        //   label: "储位",
        //   width: "120",
        //   show: true
        // },
        // {
        //   prop: "qualifiedType",
        //   label: "合格类型",
        //   width: "120",
        //   show: true
        // },
        
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
      Api.queryNonBondedReceipt(this.query).then(res => {
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
