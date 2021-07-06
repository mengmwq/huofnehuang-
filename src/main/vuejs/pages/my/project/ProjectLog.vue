<template>
  <div>
    <el-row type="flex" justify="space-between" :gutter="10" class="mb10">
        <el-col :span="8" v-if="stateId !=='045'">
            <el-button size="small" type="primary" @click="addLog('add')">添加日志</el-button>
        </el-col>
         <el-col :span="16" class="tar">
             <el-input size="medium" clearable placeholder="按内容查询" prefix-icon="el-icon-search" icon="search" v-model="query.content" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
              <el-button size="small" type="primary" @click="loadDataLog">查询</el-button>
         </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <template  v-for="(header, index) in tableHeader">
        <el-table-column v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :formatter="header.formatter" :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop === 'happenTime'">
            {{scope.row.happenTime | timeFormat}}
          </div>
          <div v-if="header.prop === 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
          <div v-else-if="header.prop === 'operType'">
            {{scope.row.operType | logOperateTypeFilter}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      </template>
      <el-table-column label="操作" width="230" fixed="right" v-if="stateId !=='045'">
        <template slot-scope="scope">
           <el-button type="primary"  size="mini" @click="addLog('edit',scope.row)" >编辑</el-button>
           <el-button type="primary"  size="mini"  @click="deleteItem(scope.row)">删除</el-button>
         <template v-if="scope.row.urlKey">
          
            <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.urlKey)" v-if="isHasImg(scope.row.urlKey)">预览图片</el-button>
            <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.urlKey)" v-else-if="scope.row.urlKey.indexOf('pdf')!=-1 || scope.row.urlKey.indexOf('PDF')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.urlKey)">下载文件</el-button>
          </template>
          
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
    </el-row>
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    <AddProjectLog  v-if="isShowDialog" :isShowDialog="isShowDialog" :form="form" :projectId="$route.query.id" @closeDialog="closeDialog" @dialogChange="dialogChange" />
  </div>
</template>

<script>
  import Api from '@/api/index'
  import AddProjectLog from './AddProjectLog'
  import ImgPreview from '@/components/common/ImgPreview'
  export default { 
    components:{
      AddProjectLog,ImgPreview
    },
	  props: {
	    stateId:String,
	  },
	  watch: {
	  stateId: function (value) {
	    this.stateId = value
	  }
	 },
    data () {
      return {
         isShowDialogImg:false,
        pictures:null,
        isShowDialog:false,
        id: '',
        active: '1',
        taskType: '',
        templateType: '',
        projectType: '',
        projectCode: '',
        projectName: '',
        form: {
          key: '',
          type: '',
          title: '',
          ctUId:'',
          code:'',
        },
        query: {
          pageNum: 1,
          pageSize: 10,
          content: '',
          code:'',
        },
        tableHeader: [{
          prop: 'title',
          label: '标题',
          align: 'center',
          show: true
        }, {
          prop: 'content',
          label: '内容',
          align: 'center',
          show: true
        }, {
          prop: 'urlKey',
          label: '附件',
          align: 'center',
          width: '80',
          show: true
        }, {
          prop: 'createDt',
          label: '录入时间',
          align: 'center',
          width: '80',
          show: true
        }, {
          prop: 'ctUName',
          label: '录入人',
          align: 'center',
          width: '80',
          show: true
        }, ],
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
      this.id = this.$route.query.id
      this.query.id = this.$route.query.id
      this.taskType = this.$route.query.type
      this.templateType = this.$route.query.templateType
      this.loadDataLog()
    },
    methods: {
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        // 判断是否图片
        isHasImg(key){
           const aFileType = ['.jpg','.jpeg','.png']
            return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
        },
        //文件预览处理
        showFileDetails(key){
          let img = ''
          Api.getUrl(key).then(data => {
            if (data) {
              if(this.isHasImg(key)){
                //图片预览处理；
                 img = data
                  this.pictures = []
                  this.pictures.push(img)
                  this.isShowDialogImg = true
              }else{
                //除图片的其他文件；
                   window.open(data)
              }
            }
          })

        },
        //删除日志
        deleteItem(item){
           this.$confirm('您确定要删除日志【' + item.title + '】吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let param = {
                id: item.id,
              }
              Api.removeProjectLog(param).then((data) => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '项目日志删除成功'
                  })
                  this.loadDataLog()

                } else {
                  this.$notify.warning({
                    title: '提示',
                    message: '项目日志删除失败'
                  })
                }
              })

            })
        },
      //添加或编辑日志
      addLog(flag,row){
        if(flag=='add'){
           this.form= {
              key: '',
              type: '',
              title: '',
              ctUId:'',
              code:'',
            }
        }else{
          this.form = JSON.parse(JSON.stringify(row))
        }
        this.isShowDialog =true
      },
      dialogChange(){
        this.closeDialog()
        this.loadDataLog()
      },
      closeDialog(){
        this.isShowDialog = false
      },
      /**
       * 加载
       */
      loadDataLog () {
        this.listLoading = true
        this.query.code = this.$route.query.id
        Api.getProjectLogList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total=res.total
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
                a.download = '项目日志列表数据.xlsx'
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

<style scoped>

</style>
