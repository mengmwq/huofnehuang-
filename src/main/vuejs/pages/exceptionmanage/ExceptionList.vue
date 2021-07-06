<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <!--<el-button type="primary" size="medium" @click="deal()">+ 新增异常信息</el-button>-->
      </el-col>
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="查询" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <template  v-for="(header, index) in tableHeader">
          <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :formatter="header.formatter"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
           <div v-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
                <div v-else-if="header.prop == 'projectName'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectName}}</router-link>
                </div>
            <div v-else-if="header.prop == 'reportDatetime'">
                 {{scope.row.reportDatetime | timeFormat}}
                </div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      </template>
      
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/router/exSituationDesc', query: {id: scope.row.id, msg: scope.row.content}}">
            <el-button type="primary" size="small" >查看</el-button>
          </router-link>
          <el-button type="primary" v-showBtn data-authorityType="deal-btn" size="small" @click="deal(scope.row)">处理</el-button>
          <el-button type="primary" v-showBtn data-authorityType="delete-btn" size="small" @click="delateEx(scope.row)">删除</el-button>

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
    <!--异常处理-->
    <el-dialog
      :title="opeateFlag === 'edit' ? '异常处理' : '新增异常信息'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="55%">
      <div style="text-align: center">
        <el-form :model="form" label-width="130px" ref="form">
          <div class="car-info">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目编码：" style="text-align: left;">
                  <span>{{dealError.projectCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报时间：" style="text-align: left;">
                  <span>{{dealError.reportDatetime | timeFormat}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称：" style="text-align: left;">
                  <span>{{dealError.projectName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报人员：" style="text-align: left;">
                  <span>{{dealError.reporterName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="供应商名称：" style="text-align: left;">
                  <span>{{dealError.supplierName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注：" style="text-align: left;">
                  <span>{{dealError.remarks}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="情况说明：" style="text-align: left;">
                  <span class="text-left">{{dealError.content}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="处理时间：">
                <el-date-picker type="datetime" placeholder="请选择申报日期" v-model="form.handleTime"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="medium"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="处理结果">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容："
                  v-model="form.result">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="备注信息"
                  v-model="form.remarks">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="相关文件：">
                <v-upload></v-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="">
                <el-table class="page-table" :data="listData1" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                >
                  <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop" :label="header.label" :sortable="header.sortable"
                                   :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                  </el-table-column>
                  <!--<el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="" >查看</el-button>
                      <el-button type="primary" size="mini" @click="" >下载</el-button>
                    </template>
                  </el-table-column>-->
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批流程：" prop="type">
                <el-select v-model="form.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in shenPiList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="errorSubmit">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  
  export default {
    components: {
      'v-upload': Upload
    },
    data () {
      return {
        canClick: false,
        dialogVisible: false,
        timeRange: '',
        opeateFlag: '',
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: ''
        },
        tableHeader: [{
          prop: 'projectCode',
          label: '项目编号',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          align: 'center',
          width:'130',
          show: true
        },{
          prop: 'customerName',
          label: '客户名称',
          align: 'center',
          width:"120",
          show: true
        },  {
          prop: 'supplierName',
          label: '供应商名称',
          align: 'center',
          width:"120",
          show: true
        }, {
          prop: 'reportDatetime',
          label: '上报时间',
          align: 'center',
          width:'150',
          show: true
        }, {
          prop: 'reporterName',
          label: '提报人',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'content',
          align: 'center',
          label: '情况说明',
          width: '150',
          show: true
        }, {
          prop: 'remarks',
          align: 'center',
          label: '备注',
          width: '150',
          show: true
        }],
        tableHeader1: [{
          prop: 'no',
          align: 'center',
          label: '序号',
          width: '80',
          show: true
        }, {
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, {
          prop: 'desc',
          align: 'center',
          label: '描述',
          width: '200',
          show: true
        }, {
          prop: 'fileSize',
          align: 'center',
          label: '文件大小',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        listData1: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        // 审批流程列表
        shenPiList: [],
        dealError: {},
      }
    },
    mounted () {
      this.loadData();
      this.loadShenPiList();
    },
    methods: {
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        Api.errorPage(this.query).then(data => {
          this.listData = data.records;
          this.total = data.total
          this.listLoading = false
        });
      },
      /**
       * 获取审批流程下拉数据
       * */
      loadShenPiList () {
        Api.approvalList({category: '4'}).then(data => {
          this.shenPiList = data;
        });
      },
      /**
       * 异常提交
       */
      errorSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            Api.errorSubmit(this.form).then(data => {
              if (data) {
                this.dialogVisible = false;
                this.loadData();
                this.$notify.success({
                  title: '提示',
                  message: '已提交申请'
                });
              }
            });
          } else {
            this.$message('请完善表单')
          }
        })
      },
      newException () {
        this.$router.push({path: '/router/newException'})
      },
      /**
       * 异常处理
       * */
      deal (item) {
        this.dealError = item;
        this.form.id = item.id;
        if (item) {
          this.opeateFlag = 'edit'
        } else {
          this.opeateFlag = 'add'
        }
        this.dialogVisible = true
      },
      /**
       * 删除异常
       * */
      delateEx (item) {
        this.$confirm('您确定要删除异常信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.errorDelete({id: item.id}).then(data => {
            if (data) {
              this.loadData();
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
            }
          });
        });
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
        this.keyword = ''
        this.query.pageNum = 1
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
                a.download = '异常列表数据.xlsx'
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
  .car-info{
    background: #D3EDFA;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .car-info .el-form-item{margin-bottom: 0}
  .car-info .el-form-item span{display: inline-block}
</style>
