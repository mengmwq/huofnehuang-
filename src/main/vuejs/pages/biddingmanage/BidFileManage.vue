<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="查询" icon="search" v-model="query.keyword" @keyup.enter.native="SelectloadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="SelectloadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row  :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
           <div v-if="header.prop == 'attchmentTypeId'">
             {{scope.row.attchmentTypeId | bidFileTypeFilter}}
           </div>
           <div v-else-if="header.prop == 'projectCode'">
                  <router-link :to="{path: '/router/projectDetail', query: {id: scope.row.projectCode, projectType: scope.row.projectType, stateId: scope.row.stateId}}">{{scope.row.projectCode}}</router-link>
                </div>
           <div v-else-if="header.prop == 'createDt'">
             {{scope.row.createDt | timeFormat}}</div>
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="deleteFile(scope.row)">删除</el-button>
          <!-- <el-button type="primary" size="small" v-if="scope.row.attachmentUrlKey" @click="downLoadItem(scope.row)">下载</el-button> -->
          <template v-if="scope.row.attachmentUrlKey">
            <el-button type="primary"  size="mini"  @click="showFileDetails(scope.row.attachmentUrlKey)" v-if="isHasImg(scope.row.attachmentUrlKey)">预览图片</el-button>
            <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  @click="showFileDetails(scope.row.attachmentUrlKey)" v-else>下载文件</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">

      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components:{
      ImgPreview
    },
    data () {
      return {
          isShowDialogImg:false,
        pictures:null,
        dialogVisible: false,
        form: {},
        query: {
          id : ''
        },
        tableHeader: [{
          prop: 'name',
          align: 'center',
          label: '文件名称',
          show: true
        },  {
          prop: 'attchmentTypeIdF',
          label: '类型',
          align: 'center',
          show: true
        }, {
          prop: 'projectCode',
          align: 'center',
          label: '项目编号',
          width:'150',
          show: true
        }, {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '上传日期',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        /** 表格数据2 */
        listData2: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false
      }
    },
    mounted () {
      this.query.id=this.$route.query.id
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
      /**模糊查询*/
      SelectloadData(){
          if(this.query.keyword){
            /*this.listData.forEach(function (item2) {
              if(item2.name === item){
                this.listData2.push(item2)
                debugger
              }
            })
            this.listData = this.listData2*/
            this.listData = this.listData.filter(item => item.name.indexOf(this.query.keyword) !== -1)
          } else {
            this.loadData()
          }
      },

      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        let param = {id: this.$route.query.id}
        Api.queryBidAttachmentLists(param).then(data => {
          if (data) {
            this.listData = data
            let _this = this
            this.listData.forEach(function (item) {
              _this.$set(item, 'attchmentTypeIdF', filters.bidFileTypeFilter(item.attchmentTypeId))
            })
            this.total = data.total
            this.listLoading = false
          }
        })

      },
      /**
       * 删除
       */
      deleteFile (item) {
        this.$confirm('您确定要删除【' + item.name + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteFileAttachment({id: item.id}).then((res) => {
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

      // /**删除功能**/
      // deleteFile (item) {
      //   this.$confirm('您确定要删除['+item.projectCode+']吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     let param = {
      //       id: item.id,
      //     }
      //     Api.deleteFileAttachment(param).then(() => {
      //       this.loadData()
      //       this.$notify.success({
      //         title: '提示',
      //         message: '删除成功'
      //       })
      //     }).catch(() => {
      //       this.$notify.warning({
      //         title: '提示',
      //         message: '删除失败'
      //       })
      //     })
      //   })
      // },

      addBYInfo () {
        this.$router.push({path: ''})
      },
      columnChange (data) {
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
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.keyword = ''
        this.query.pageNumber = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNumber = val
        this.loadData()
      },
      /**
       * 导出excel
       */
      exportExcel () {
      },
      downLoadItem (item) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          Api.getUrl(item.attachmentUrlKey).then(data => {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = item.attachmentUrlKey;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          });
        } else {
          //window.location.href = data;
          let key = item.attachmentUrlKey
          if (key) {
            Api.downloadFile(key).then((res) => {
              if (res) {
                if (window.navigator.msSaveOrOpenBlob) {
                  navigator.msSaveBlob(res, item.key)
                } else {
                  /*var link = document.createElement('a')
                  link.href = window.URL.createObjectURL(res)
                  link.download = key
                  link.click()
                  window.URL.revokeObjectURL(link.href)*/
                  const elink = document.createElement('a')
                  elink.download = key
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(res)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href) // 释放URL 对象
                  document.body.removeChild(elink)
                }
              }
            });
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>

