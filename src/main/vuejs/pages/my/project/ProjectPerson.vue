<template>
  <div>
    <el-row type="flex" justify="space-between" :gutter="10" class="mb10">
        <el-col :span="8">
            <!-- <el-button size="small" type="primary" @click="addLog">添加日志</el-button> -->
        </el-col>
         <el-col :span="16" class="tar">
             <el-input size="medium" clearable placeholder="按用户名查询" prefix-icon="el-icon-search" icon="search" v-model="query.userName" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
              <el-button size="small" type="primary" @click="loadData">查询</el-button>
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
          <div v-else-if="header.prop === 'operType'">
            {{scope.row.operType | logOperateTypeFilter}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      </template>
      
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
    <AddProjectLog  v-if="isShowDialog" :isShowDialog="isShowDialog" :projectId="$route.query.id" @closeDialog="closeDialog" @dialogChange="dialogChange" />
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

        },
        query: {
          pageNum: 1,
          pageSize: 10,
          userName:'',
          projectCode:'',
        },
        tableHeader: [{
          prop: 'userName',
          label: '用户名称',
          show: true
        }, {
          prop: 'orgName',
          label: '组织名称',
          show: true
        }, {
          prop: 'taskName',
          label: '任务名称',
          width: '80',
          show: true
        }, {
          prop: 'userTel',
          label: '用户电话',
          width: '80',
          show: true
        },],
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
      this.loadData()
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
      addLog(){
        this.isShowDialog =true
      },
      dialogChange(){
        this.closeDialog()
        this.loadData()
      },
      closeDialog(){
        this.isShowDialog = false
      },
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        this.query.projectCode = this.$route.query.id
      
        Api.getTaskUser(this.query).then((res) => {
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
