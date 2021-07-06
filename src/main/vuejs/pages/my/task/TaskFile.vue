<template>
  <div>
    <el-row class="mb10">
      <el-col :span="12" class="text-left">
        <el-button type="primary" @click="add" icon="el-icon-plus" size="small">上传附件</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="fileListData" stripe highlight-current-row :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(header, index) in fileHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
         <template slot-scope="scope">
           <div v-if="header.prop === 'createDt'">
             {{scope.row.createDt | timeFormat}}
           </div>
            <!-- <div  v-else-if="header.prop ==='attachmentName'">
              <a href="javascript:;" v-if="scope.row.key.indexOf('jpg')!=-1 || scope.row.key.indexOf('png')!=-1" @click="previewImg(scope.row)">{{scope.row.attachmentName}}</a>
              <a href="javascript:;" @click="openHref(scope.row)" v-else>{{scope.row.attachmentName}}</a>
            </div> -->
           <div v-else>{{scope.row[header.prop]}}</div>
         </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <!--<router-link :to="{path: '/router/', query: {id: scope.row.id}}">-->
            <!--<el-button type="primary" size="mini">查看</el-button>-->
          <!--</router-link>-->
          <template v-if="scope.row.key">
            <el-button type="primary"  size="mini" v-if="scope.row.key.indexOf('jpg')!=-1 || scope.row.key.indexOf('png')!=-1" @click="previewImg(scope.row)">预览图片</el-button>
            <el-button type="primary"  size="mini" @click="openHref(scope.row)" v-else-if="scope.row.key.indexOf('pdf')!=-1 || scope.row.key.indexOf('PDF')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else @click="downLoadItem(scope.row)">下载文件</el-button>
          </template>
          <el-button type="primary" size="mini" @click="deleteItem(scope.row)">删除</el-button>
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
    <file-upload v-show="JobDialog" :isShowDialog="JobDialog" :hasCallBack="hasCallBack" :callBackName="callBackName" @onSubmit="onSubmit" @closeDialog="closeDialog"></file-upload>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import FileUpload from '@/pages/resource/filemanage/FileUpload'
   import ImgPreview from '@/components/common/ImgPreview'
  export default {
    name: 'TaskFile',
    components: {
      'file-upload': FileUpload,ImgPreview,
    },
    data () {
      return {
         isShowDialogImg:false,
        pictures:null,
        //添加和编辑标志
        operateFlag: '',
        //弹窗控制
        JobDialog: false,
        hasCallBack: true,
        callBackName: 'onSubmit',
        fileListData: [],
        multipleSelection: [],
        query: {
          pageNum: 1,
          pageSize: 10,
          taskId: '',
        },
        form:{
          attachmentName:'', //附件名称     *
          description:'', //附件说明     *
          key:'11', //附件key       * 临时写的死数据
          taskId: '', //任务编码
          type:'',  //附件类别      *
          projectCode: '' //临时参数
          // explain:'',
          // progresses:'',
          // taskId:'',
        },
        total: 0,
        fileHeader: [{
          prop: 'attachmentName',
          label: '附件名称',
          width: '150',
          show: true
        },{
          prop: 'ctUName',
          align: 'center',
          label: '上传人',
          width: '180',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '上传时间',
          width: '120',
          show: true
        }],

      }
    },
    props: {
      projectCode: String
    },
    watch: {
      projectCode: function(newValue) {
        this.form.projectCode = newValue
      }
    },
    mounted() {
      this.query.taskId = this.$route.query.id
      this.form.taskId = this.$route.query.id
      this.queryFileData()

    },
    methods: {
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        //除图片外，直接打开新页查看；
        openHref(row){
          Api.getUrl(row.key).then(data => {
            if (data) {
              window.open(data)
            }
          })
        },
        //图片预览
        previewImg(row){
          let img = ''
          Api.getUrl(row.key).then(data => {
            if (data) {
              img = data
              this.pictures = []
              this.pictures.push(img)
              console.log(this.pictures,'poo')
              this.isShowDialogImg = true
            }
          })

        },
      closeDialog () {
        this.JobDialog = false
        this.queryFileData()
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 附件table数据
       */
      queryFileData () {
        this.listLoading = true
        Api.listAccessory(this.query).then(data => {
          if (data) {
            this.fileListData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },

      /**
       * 提交
       * */
      onSubmit (form) {
        //子组件form 提交过来的参数
        /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
        this.form.key = form.key
        this.form.attachmentName = form.fileName
        this.form.description = form.description
        this.form.type = form.type

        Api.addAccessory(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '任务添加附件成功'
            })
            this.closeDialog()
          }
        })
      },

      downLoadItem (item) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          Api.getUrl(item.key).then(data => {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = item.key;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          });
        } else {
          //window.location.href = data;
          let key = item.key
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
       * 删除（停用）信息
       * */
      deleteItem (item) {
        this.$confirm('您确定要删除【' + item.attachmentName + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteTaskFile(param).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.queryFileData()

            } else {
              this.$notify.warning({
                title: '提示',
                message: '删除失败'
              })
            }
          })

        })
      },

      /**控制弹窗增加与编辑 */
      add () {
        this.JobDialog = true
        this.operateFlag = 'add'
      },

      handleSizeChange (val) {
        this.query.pageSize = val
        this.queryFileData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.queryFileData()
      },
    }
  }
</script>

<style scoped>

</style>
