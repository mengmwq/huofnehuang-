<template>
  <div>
    <el-table :data="listData">
      <template  v-for="(header, index) in tableHeader">
       <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
                <template slot-scope="scope">
                   <div v-if="header.prop == 'createDt'">
                  {{scope.row.createDt | timeFormat}}
                  </div>
                  <div v-else-if="header.prop == 'updateDt'">
                    {{scope.row.updateDt | timeFormat}}
                  </div>

                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
      </template>
     
      <!-- <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="goodsName" label="品名"></el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column prop="specifications" label="规格"></el-table-column>
      <el-table-column prop="operationTime" label="消耗时间">
        <template slot-scope="scope">
            {{scope.row.createDt | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="operationTime" label="操作时间">
        <template slot-scope="scope">
          {{scope.row.updateDt | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="ctUName" label="操作人"></el-table-column>
      <el-table-column prop="approvalName" label="审批人"></el-table-column> -->
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
    name: "ConsumeRecords",
    data () {
      return {
        listData: [],
        query: {
          pageSize: 10,
          pageNum: 1,
          purchaseId: '', // 入库记录id
          type: ''
        },
        total: 0,
        tableHeader: [{
            prop: 'goodsName',
            label: '品名',
            align: 'center',
            show: true
          },{
            prop: 'num',
            label: '数量',
            width: '120',
            show: true
          }, {
            prop: 'specifications',
            label: '规格',
            width: '120',
            show: true
          }, {
            prop: 'createDt',
            label: '消耗时间',
            width: '120',
            show: true
          }, {
            prop: 'remark',
            label: '备注',
            width: '120',
            show: true
          }, {
            prop: 'updateDt',
            label: '操作时间',
            width: '120',
            show: true
          }, {
            prop: 'ctUName',
            label: '操作人',
            width: '120',
            show: true
          }, {
            prop: 'approvalName',
            label: '审批人',
            width: '120',
            show: true
          }]
      }
    },
    props: {
      type: String
    },
    watch: {
      type: function (value) {
        this.query.type = value
      },
    },
    mounted () {},
    methods: {
      loadData() {
        this.query.type = this.type
        Api.operationPageConsume(this.query).then(res => {
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
        this.loadData()
      },
    }
  }
</script>
