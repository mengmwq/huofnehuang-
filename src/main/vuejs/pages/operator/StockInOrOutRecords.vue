<template>
  <div>
   <!-- 采购入库记录-->
    <!-- <el-table :data="listData" v-if="hisType === '001'">
      <el-table-column prop="goodsName" label="品名"></el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column prop="specifications" label="规格"></el-table-column>
      <el-table-column prop="unitPrice" label="单价"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column prop="storageLocation" label="存放位置"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
            {{scope.row.operationTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="operationName" label="操作人"></el-table-column>
    </el-table> -->
    <el-table class="page-table"  v-if="hisType === '001'" 
    :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}">
        <template v-for="(header, index) in tableHeader">
          <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else-if="header.prop == 'operationTime'">
              {{scope.row.updateDt | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        </template>
        
      </el-table>
    <!--领用出库记录-->
    <el-table :data="listData" v-if="hisType === '002'">
      <el-table-column prop="goodsName" label="品名"></el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column prop="specifications" label="规格"></el-table-column>
      <el-table-column prop="unitPrice" label="单价"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="operationName" label="操作人"></el-table-column>
    </el-table>
    <!--领用入库记录-->
    <el-table :data="listData" v-if="hisType === '003'">
      <el-table-column prop="goodsName" label="品名"></el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column prop="specifications" label="规格"></el-table-column>
      <el-table-column prop="storageLocation" label="存放位置"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="入库时间">
        <template slot-scope="scope">
          {{scope.row.operationTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="operationName" label="操作人"></el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
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
    name: "StockInOrOutRecords",
    data () {
      return {
        listData: [],
        tableHeader: [{
          prop: 'goodsName',
          label: '品名',
          align: 'center',
          show: true
        }, {
          prop: 'num',
          label: '数量',
          align: 'center',
          show: true
        }, {
          prop: 'specifications',
          label: '规格',
          align: 'center',
          show: true
        }, {
          prop: 'unitPrice',
          label: '单价',
          align: 'center',
          show: true
        }, {
          prop: 'supplierName',
          label: '供应商',
          show: true
        }, {
          prop: 'storageLocation',
          align: 'center',
          label: '存放位置',
          show: true
        }, {
          prop: 'remark',
          align: 'center',
          label: '备注',
          show: true
        }, {
          prop: 'operationTime',
          align: 'center',
          label: '更新时间',
          show: true
        }, {
          prop: 'updUName',
          align: 'center',
          label: '操作人',
          show: true
        }],
        query: {
          pageSize: 10,
          pageNum: 1,
          hisType: '001', // 操作历史类型
          purchaseId: '', // 入库记录id
          type: ''
        },
        total: 0
      }
    },
    props: {
      hisType: {
        type:String,
        default:'001',
      },
      type: String,
     
    },
    watch: {
      hisType: function (value) {
        this.query.hisType = value
      },
      type: function (value) {
        this.query.type = value
      },
    },
    mounted () {},
    methods: {
      loadData() {
        this.query.type = this.type
        this.query.hisType = this.hisType
        Api.operationPageHis(this.query).then(res => {
          this.listData = res.records
          this.total = res.total
        })
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
    }
  }
</script>
