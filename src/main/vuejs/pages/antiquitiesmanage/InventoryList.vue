<template>
  <div>
    <div style="margin: 20px 0">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" size="medium" v-showBtn data-authorityType="add-btn" @click="newApply" icon="el-icon-plus">增加文物</el-button>
        </el-col>
        <el-col :span="20" class="text-right" style="float: right;">
          <el-input size="medium" prefix-icon="el-icon-search" clearable placeholder="作品名称查询" icon="search"
                    v-model="query.name" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
          <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading"
                :cell-style="{color:'#333'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                         :formatter="header.formatter"
                         :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop === 'happenTime'">
              {{scope.row.happenTime | timeFormat}}
            </div>
            <div v-else-if="header.prop === 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else-if="header.prop == 'currency'">
              {{scope.row.currency | currencyFilter}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" v-if="tabIndex === 1">
          <template slot-scope="scope">
            <router-link :to="{path: '/router/editAntique', query: {id: scope.row.id,param: scope.row.name}}" v-showBtn data-authorityType="edit-btn">
              <el-button v-if="tabIndex===1" type="primary" size="mini">编辑</el-button>
            </router-link>
            <el-button v-if="tabIndex===1" type="primary" size="mini" @click="view(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" width="150" fixed="right" v-if="tabIndex === 2">
          <template slot-scope="scope">
            1999-7-26
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
    </div>
    <div class="tab-nav" style="border-bottom: 1px solid white;">
      <div class="nav-item tab">
        <span :class="tabIndex===1 ? 'tab-active' : ''">操作记录</span>
      </div>
    </div>
    <!--table-->
    <el-table class="page-table" :data="listData2" stripe highlight-current-row v-loading="listLoading2"
              :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader2" v-if="header.show" :key="index" :prop="header.prop"
                       :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop === 'operType'">
            {{scope.row.operType | logOperateTypeFilter}}
          </div>
          <div v-else-if="header.prop === 'happenTime'">
            {{scope.row.happenTime | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="审批时间" width="150" fixed="right">
        <template slot-scope="scope">
          1999-7-26
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" class="page-box" justify="end">
    <el-pagination
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2"
      :current-page="query.pages2"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="query.size2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total2">
    </el-pagination>
    </el-row>
    <el-dialog
      title="详情"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form label-position="right" :model="form" ref="form" label-width="130px">
        <el-row>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">作品名称：</span>
              <span class="item-value">{{form.name}}</span>
            </div>
            <div class="item">
              <span class="item-title">收藏单位：</span>
              <span class="item-value">{{form.collection}}</span>
            </div>
            <div class="item">
              <span class="item-title">收藏号：</span>
              <span class="item-value">{{form.collectionCode}}</span>
            </div>
            <div class="item">
              <span class="item-title">作者：</span>
              <span class="item-value">{{form.author}}</span>
            </div>
            <div class="item">
              <span class="item-title">类型：</span>
              <span class="item-value">{{form.type}}</span>
            </div>
            <div class="item">
              <span class="item-title">尺寸cm：</span>
              <span class="item-value">{{form.size}}</span>
            </div>
            <div class="item">
              <span class="item-title">材质：</span>
              <span class="item-value">{{form.material}}</span>
            </div>
            <div class="item">
              <span class="item-title">时代/年代：</span>
              <span class="item-value">{{form.age}}</span>
            </div>
            <div class="item">
              <span class="item-title">数量：</span>
              <span class="item-value">{{form.number}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <span class="item-title">币种：</span>
              <span class="item-value">{{form.currency | currencyFilter}}</span>
            </div>
            <div class="item">
              <span class="item-title">估值：</span>
              <span class="item-value">{{form.valuation}}</span>
            </div>
            <div class="item">
              <span class="item-title">重量：</span>
              <span class="item-value">{{form.netWeight}}</span>
            </div>
            <div class="item">
              <span class="item-title">级别：</span>
              <span class="item-value">{{form.level}}</span>
            </div>
            <div class="item">
              <span class="item-title">出土地点：</span>
              <span class="item-value">{{form.unearthedPlace}}</span>
            </div>
            <div class="item">
              <span class="item-title">完残情况：</span>
              <span class="item-value">{{form.residualCondition}}</span>
            </div>
            <div class="item">
              <span class="item-title">内包装/画框：</span>
              <span class="item-value">{{form.innerPacking}}</span>
            </div>
            <div class="item">
              <span class="item-title">内包装尺寸：</span>
              <span class="item-value">{{form.dimensions}}</span>
            </div>
            <div class="item">
              <span class="item-title">备注：</span>
              <span class="item-value">{{form.remarks}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <el-carousel height="150px">
              <el-carousel-item v-for="(item, index) in pictures" :key="index">
                <img :src="item.url" style="width: 100%;height: 150px;"/>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
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
        // 感觉像控制弹窗玩的玩意儿
        flag: false,
        dialogVisible: false,
        type: '',
        form: {},
        query: {
          pageSize: 10,
          pages2:'',
          size2:'',
          pageNum: 1,
          name: ''
        },
        pictures: [],
        tableHeader: [{
          prop: 'name',
          label: '作品名称',
          align: 'center',
          show: true,
          width: 80
        }, {
          prop: 'collection',
          label: '收藏单位',
          align: 'center',
          show: true,
          width: 80
        }, {
          prop: 'author',
          label: '作者',
          align: 'center',
          show: true,
          width: 50
        }, {
          prop: 'type',
          label: '类型',
          align: 'center',
          show: true,
          width: 50
        }, {
          prop: 'size',
          label: '尺寸',
          align: 'center',
          show: true,
          width: 80
        }, {
          prop: 'material',
          align: 'center',
          label: '材质',
          show: true,
          width: 50
        }, {
          prop: 'age',
          align: 'center',
          label: '时代',
          show: true,
          width: 100
        }, {
          prop: 'number',
          align: 'center',
          label: '数量',
          show: true,
          width: 50
        }, {
          prop: 'currency',
          align: 'center',
          label: '币种',
          show: true,
          width: 50
        }, {
          prop: 'valuation',
          align: 'center',
          label: '估值',
          show: true,
          width: 100
        }, {
          prop: 'netWeight',
          align: 'center',
          label: '重量',
          show: true
        }, {
          prop: 'level',
          align: 'center',
          label: '级别',
          show: true,
          width: 50
        }, {
          prop: 'unearthedPlace',
          align: 'center',
          label: '出土地',
          show: true,
          width: 70
        }, {
          prop: 'residualCondition',
          align: 'center',
          label: '完残情况',
          show: true,
          width: 80
        }, {
          prop: 'innerPacking',
          align: 'center',
          label: '内包装',
          show: true,
          width: 70
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          show: true,
          width: 50
        }, {
          prop: 'createDt',
          align: 'center',
          label: '入库时间',
          show: true,
          width: 130
        }, {
          prop: 'ctUName',
          align: 'center',
          label: '创建人',
          show: true,
          width: 70
        }],

        tableHeader2: [{
          prop: 'operType',
          label: '类型',
          show: true
        }, {
          prop: 'operDescription',
          label: '操作描述',
          align: 'center',
          show: true
        }, {
          prop: 'happenTime',
          label: '操作时间',
          align: 'center',
          show: true
        }, {
          prop: 'userName',
          label: '操作人',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        /** 表格数据 */
        listData2: [],
        multipleSelection: [],
        /** 总数据数 */
        total: '',
        /** 总数据数 */
        total2: '',
        /** 表格 loading */
        listLoading: false,
        /** 表格 loading */
        listLoading2: false,
        tabIndex: 1
      }
    },
    mounted () {
      this.loadData()
      this.loadData2()
    },
    methods: {
      /**
       * 查看
       */
      view (row) {
        Api.relicDetails(row.id).then(data => {
          if (data) {
            this.form = data
            this.pictures = data.pictures
            let _this = this
            this.pictures.forEach(function (item){
              Api.getUrl(item.urlKey).then(data => {
                if (data) {
                  _this.$set(item, 'url', data)
                }
              })
            })
          }
        })

        this.dialogVisible = true
      },
      getImgUrl(key) {
        let imageUrl = '';
        if (key) {
          Api.getUrl(key).then(data => {
            if (data) {
              imageUrl = data
            }
          })
        }
        return imageUrl

      },
      changeTabData (index) {
        this.tabIndex = index
      },
      /**
       * 加载数据
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.selectReliclist(this.query).then(data => {  //库存列表
          this.listLoading = false
          this.listData = data.records
          this.total = data.total
        })

      },

      /**
       * 加载数据
       */
      loadData2 (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pages2 =1
        }else{
          this.query.pages2 =pageNum
        }
        // 操作日志记录
        // if (sessionStorage.getItem('logList')) {
        //   this.listData2 = (JSON.parse(sessionStorage.getItem('logList')).records);
        //   this.query.pages2 = (JSON.parse(sessionStorage.getItem('logList')).pages);
        // }
        this.listLoading2 = true
        Api.operationLogPageList({param: '4345',pageNum: this.query.pages2,pageSize: this.query.size2}).then(data => {  //操作记录
          this.listLoading2 = false
          this.listData2 = data.records
          this.total2 = data.total
        })
      },

      /** 添加 */
      newApply: function () {
        this.$router.push({path: '/router/AddAntique'})
      },
      /** 编辑 */
      editor: function () {
        this.$router.push({path: '/router/AddAntique'})
      },
      deleteItem (item) {
        this.$confirm('您确定要删除记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
        }).catch(() => {
          this.$notify.warning({
            title: '提示',
            message: '删除失败'
          })
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 驳回
       * */
      dealIncome (item) {
        this.currentItem = item
        this.dialogVisible = true
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
      canSelected (row, index) {
        if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
          return 0
        } else {
          return 1
        }
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.keyword = ''
        this.query.pageNum = 1
      },
      /**
       * handle size change
       */
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleSizeChange2 (val) {
        this.query.size2 = val
        this.loadData2()
      },
      /**
       * handle current change
       */
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      handleCurrentChange2(val) {
        this.query.pages2 = val
        this.loadData2(val)
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let data = this.listData
          data.forEach(function (item) {
            item.currency = filters.currencyFilter(item.currency)
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
      },
    }
  }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .item {
    margin: 10px 0
  }

  .item .item-title {
    display: inline-block;
    width: 160px;
    text-align: right;
  }
</style>
