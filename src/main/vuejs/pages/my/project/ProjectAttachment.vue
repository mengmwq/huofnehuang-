<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="12">
        <el-button type="primary" size="medium" @click="isShowDialog=true" v-if="stateId !=='045'">上传附件</el-button>
      </el-col>
      <!--<el-col :span="12" class="text-right">
        <el-button type="primary" size="medium" @click="batchDownload">批量下载</el-button>
      </el-col>-->
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop === 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
           <!-- <div  v-else-if="header.prop ==='name'">
           <a href="javascript:;" v-if="scope.row.attachmentUrlKey.indexOf('jpeg')!=-1 || scope.row.attachmentUrlKey.indexOf('jpg')!=-1 || scope.row.attachmentUrlKey.indexOf('png')!=-1" @click="previewImg(scope.row)">{{scope.row.name}}</a>
           <a href="javascript:;" @click="openHref(scope.row)" v-else>{{scope.row.name}}</a>
        </div> -->
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作"  v-if="stateId !=='045'">
        <template slot-scope="scope">
          <el-button type="primary" size="small"  @click="deleteItem(scope.row)">删除</el-button>
          <template v-if="scope.row.attachmentUrlKey">
            <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-if="isHasImg(scope.row.attachmentUrlKey)">预览图片</el-button>
            <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.attachmentUrlKey)">下载文件</el-button>
          </template>
        </template>
      </el-table-column>
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
<ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    <file-upload v-show="isShowDialog" :isShowDialog="isShowDialog" :hasCallBack="hasCallBack" :callBackName="callBackName" @onSubmit="onSubmit" @closeDialog="closeDialog"></file-upload>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import FileUpload from '@/pages/resource/filemanage/FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
  export default {
    props: {
	  stateId:String,
	  projectCode: String
	},
	watch: {
	 stateId: function (value) {
	  this.stateId = value
	 }
	},
    components: {
      'file-upload': FileUpload,ImgPreview,
    },
    data () {
      return {
        JobDialog: false,
        isShowDialogImg:false,
        pictures:null,
        isShowDialog:false,
        
        hasCallBack: true,
        callBackName: 'onSubmit',
        form: {
          projectCode:'',  //项目编号
          attachmentUrlKey:'',   //临时附件key
          name:'',  //名称
          remarks:''   //描述
        },
        query: {
           pageSize: 10,
           pageNum: 1,
          // keyword: '',
          // type: '',
          // caId: '',
           projectCode:''
        },

        tableHeader: [{
          prop: 'name',
          label: '附件名称',
          width: '120',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }, {
          prop: 'ctUName',
          label: '上传人',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'createDt',
          label: '上传时间',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        multipleSelection: [],
        fileList: [],
        props: {
          projectCode: String
        },

      }
    },
    mounted () {
      this.query.projectCode = this.$route.query.id
      this.form.projectCode = this.$route.query.id
      this.loadData()


    },
    methods: {
      /**
       * 删除（停用）信息
       * */
      deleteItem (item) {
        this.$confirm('您确定要删除【' + item.name + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteProjectAttachment(param).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '项目附件删除成功'
              })
              this.loadData()

            } else {
              this.$notify.warning({
                title: '提示',
                message: '项目附件删除失败'
              })
            }
          })

        })
      },
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
      closeDialog () {
        this.isShowDialog = false
        this.loadData()
      },
      /**
       * 加载项目附件
       */
      loadData () {
        this.listLoading = true
        Api.projectAccessoryList(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
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
      /**
       * 提交
       * */
      onSubmit (form) {
        this.confirm(form)
      },

      /** 确认添加 */
      confirm: function (form) {
        //子组件form 提交过来的参数
       /* description: "4545uuuuuuuuuuuuuuuu"
        fileName: "45464"
        key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
        size: "7.9"
        type: "001"*/
        this.form.attachmentUrlKey = form.key
        this.form.name = form.fileName
        this.form.remarks = form.description
        this.form.type = form.type
        Api.projectAccessoryAdd(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加附件成功'
            })
            this.closeDialog()
          }
        })
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      downloadFile(item) {

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
            if (item.attachmentUrlKey) {
              let key = item.attachmentUrlKey
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
      batchDownload () {
        if (this.multipleSelection.length === 0) {
          this.$notify.warning({
            title: '提示',
            message: '请勾选下载项'
          })
          return
        }
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      }
    }
  }
</script>

<style scoped>

</style>

