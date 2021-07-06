<template>
  <div>
    <!-- 操作栏 -->
    <!-- <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="品名查询" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
      </el-col>
    </el-row> -->
    <!-- table -->
    <el-table
            class="page-table"
            :data="listData"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{color:'#333'}"
          >
            <template>
              <template v-for="(header, index) in tableHeader">
                <el-table-column
                  v-if="header.show"
                  :key="index"
                  :prop="header.prop"
                  :label="header.label"
                  :sortable="header.sortable"
                  :align="header.align"
                  :min-width="header.width"
                  :column-key="header.prop"
                  show-overflow-tooltip
                >
                  
                </el-table-column>
              </template>
            </template>
            
          </el-table>
           <!-- 分页 -->
    <!-- <el-row type="flex" class="page-box" justify="end">
     
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
    </el-row> -->
    
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  export default {
    data () {
      return {
        canClick: false,
        dialogVisible: false,
        editForm: {},
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          name: '',
          supplierId: ''
        },
        tableHeader: [
        {
          prop: "name",
          label: "专业技能",
          align: "center",
          show: true
        },
        {
          prop: "remark",
          label: "备注",
          align: "center",
          show: true
        }
      ],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: ''
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      clearForm (){
        this.editForm = {}
        this.loadData()
      },

      /**
       * 加载商品信息列表
       */
      loadData () {
        // if(typeof pageNum =='object'){
        //   this.query.pageNum =1
        // }else{
        //   this.query.pageNum =pageNum
        // }
        this.listLoading = true
       
        const params = {
          id :this.$route.query.id
        }
       
        Api.supplierDetailInfoOuterWorker(params).then((res) => {
          if (res) {
            this.listData = res.outworkerSkills?res.outworkerSkills:[]
          }
        })
        this.listLoading = false
      },
      
      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
      },
     
    }
  }
</script>

