<template>
  <div>
    <!-- 操作栏 data-authorityType="addNotice-btn"-->
    <el-row :gutter="20" class="m10">
      <el-col :span="10">
        <el-button type="primary" size="medium" @click="addNotice('add')" v-showBtn data-authorityType="addNotice-btn">添加公告</el-button>
        <!-- <el-button type="primary" size="medium" @click="handleDelete" v-showBtn data-authorityType="addNotice-btn">删除公告</el-button> -->
      </el-col>
      <el-col :span="14" class="text-right" style="float: right;">
        <el-input size="medium" clearable placeholder="请输入标题关键词" prefix-icon="el-icon-search" icon="search" v-model="query.searchStr" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table"  :data="listData" stripe highlight-current-row 
    v-loading="listLoading" :cell-style="{color:'#333'}"
    @selection-change="selsChange" >
  <el-table-column type="selection" min-width="54" >
              </el-table-column>
    <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
    
    <template v-for="(header, index) in tableHeader" >
        <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                     :align="header.align" :formatter="header.formatter" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
      <template slot-scope="scope">
        <div v-if="header.prop == 'title'" @click="infoDetail(scope.row),dialogVisible2 = true">
          <router-link :to="{}" >
          {{scope.row.title}}
          </router-link>
        </div>
        <div v-else-if="header.prop == 'createDt'" >
          {{scope.row.createDt | timeFormat}}
        </div>
      <div v-else>{{scope.row[header.prop]}}</div>
      </template>
    </el-table-column>
    </template>
    
    <el-table-column label="操作" width="80" fixed="right">
    <template slot-scope="scope">
    <!-- <el-button type="primary" v-showBtn data-authorityType="addNotice-btn" size="small" @click="addNotice('edit',scope.row)">编辑</el-button> -->
    <el-button type="primary" v-showBtn data-authorityType="addNotice-btn" size="small" @click="deleteNotice(scope.row)">删除</el-button>
    </template>
    </el-table-column>
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
    </el-row>
     <!-- 添加/编辑公告-->
    <InfoEdit v-if="isShowDialog" 
    :isShowDialog="isShowDialog" 
    :editForm ="editForm"
    @closeDialog="closeDialog" @notifyChange="notifyChange" />
    <!-- 公告详情 -->
    <InfoDetails v-if="isShowDialogDetails" 
    :dialogVisable="isShowDialogDetails" 
    :editForm ="editForm"
    @closeDialog="closeDialog" />
    
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  import InfoEdit from './InfoEdit'
  import InfoDetails from './InfoDetails'
  export default {
    components: {
      FileListMultiUpload,InfoEdit,InfoDetails
    },
    data () {
      return {
        isShowDialog:false,
        isShowDialogDetails:false,
        canClick: false,
        fileList: [],
        removedAll: false,
        infoDetail1:'',
        dialogVisible: false,
        dialogVisible2: false,
        titleInfo:'', //弹框标题
        sels:[],
        editForm: {
          title: '',
          content: '',
          noticeAttachments: []
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          searchStr: ''
        },
        tableHeader: [ {
          prop: 'title',
          label: '标题',
          align: 'left',
          width:'300',
          show: true
        }, {
          prop: 'orgName',
          label: '发布单位',
          align: 'left',
          show: true
        },
         {
          prop: 'content',
          label: '信息内容',
          align: 'left',
          show: false
        }, 
        {
          prop: 'ctUName',
          label: '创建人',
          align: 'left',
          show: true
        }, {
          prop: 'createDt',
          label: '创建时间',
          align: 'left',
          show: true
        }],
        tableHeader2: [ {
          prop: 'name',
          label: '文件名称',
          align: 'left',
          show: true
        }, {
          prop: 'ctUName',
          label: '上传人员',
          align: 'left',
          show: true
        }, {
          prop: 'createDt',
          label: '上传时间',
          align: 'left',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        listData2: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        listLoading2: false
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      deleteNotice(item) {
        this.$confirm('您确定要删除【 ' + item.title + ' 】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteNotice({id: item.id}).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      //修改公告
      notifyChange(){
        this.closeDialog()
        this.loadData()
      },
      //关闭公告弹窗
      closeDialog(){
        this.isShowDialog = false
        this.isShowDialogDetails =false
      },
    //添加公告；
     addNotice(flag,row){
       if(flag=='add'){
         this.editForm= {
         id:null,
          title: '',
          content: '',
          noticeAttachments: []
        }
       }else if(flag=='edit'){
         this.editForm = JSON.parse(JSON.stringify(row))
       }
       
       this.isShowDialog=true
       
     },
      /**
     * 批量删除
     */
    handleDelete() {
      const selected = this.sels
      if (selected.length <= 0) {
        this.$message({
           showClose:true,
           message:`请选中一条公告`,
           type: 'error',
        });
        return;
      }

      let ids = selected.map(item => item.id);
      const nameStr = selected.map(item => item.title).toString();

      this.$confirm(`确认删除公告【${nameStr}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        //this.listLoading = true;
        Api.deleteQuestionInfoList(ids).then((res) => {
         
          if(this.listData.length==selected.length){
              this.query.pageNum =1
          }
          this.loadData();
          this.$message({showClose:true, message:`删除公告【${nameStr}】成功`, type:'success'});
        });
      }).catch(() => {
        
      });
      
    },
      clearForm () {
        this.form = {
          title: '',
          content: '',
          noticeAttachments: []
        }
        this.fileList = []
        this.removedAll = false
      },
      /** 序号 */
      indexMethod(index){
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
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
        Api.pageInfo(this.query).then(data => {
          this.listData = data.records;
          this.total = data.total
          this.listLoading = false
        })
      },

      infoDetail(item){
        this.editForm = JSON.parse(JSON.stringify(item))
        this.isShowDialogDetails  = true;
        // this.titleInfo = item.title
        // Api.detailInfo({ id : item.id}).then(data => {
        //   this.infoDetail1 = data;
        //   this.listData2 = data.noticeAttachments
        // })
      },

      OK(){
        //fileList
        let _this = this
        if (this.fileList.length > 0) {
          _this.form.noticeAttachments = []
          this.fileList.forEach(function (item) {
            _this.form.noticeAttachments.push({
              name: item.name,
              attachmentUrlKey: item.attachmentUrlKey
            })
          })
        } else {
          if (this.removedAll) {
            this.form.noticeAttachments = []
          }
        }
        Api.addInfo(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
          this.loadData()
        }
        })
      },
      selsChange(sels) {
      this.sels = sels;
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
                a.download = '列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      }
    }
  }
</script>

