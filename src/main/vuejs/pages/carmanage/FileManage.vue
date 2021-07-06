<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="4">
        <el-button type="primary" size="medium" icon="el-icon-upload" @click="dialogVisible=true">文件上传</el-button>
      </el-col>
      <el-col :span="20" class="text-right" style="float: left">
        <el-input size="medium" clearable placeholder="名称搜索" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'attchmentTypeId'">
            {{scope.row.attchmentTypeId | carFileTypeFilter}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <template v-if="scope.row.attachmentUrlKey">
            <el-button type="primary"  size="mini" v-if="scope.row.attachmentUrlKey.indexOf('jpeg')!=-1 || scope.row.attachmentUrlKey.indexOf('jpg')!=-1 || scope.row.attachmentUrlKey.indexOf('png')!=-1" @click="previewImg(scope.row)">预览图片</el-button>
            <el-button type="primary"  size="mini" @click="openHref(scope.row)" v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else @click="downLoadItem(scope.row)">下载文件</el-button>
            <el-button type="primary"  size="mini" @click="deleteCar(scope.row)">删除</el-button>
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
      <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    <file-upload v-show="dialogVisible" :isShowDialog="dialogVisible" :fileTyeArr="carFileType" :hasCallBack="hasCallBack"
                 :callBackName="callBackName" @getUploadFile="getUploadFile" @closeDialog="closeDialog"></file-upload>
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import FileUpload from '@/pages/resource/filemanage/FileUpload'
  import * as filters from '@/filters/filter'
     import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components: {
      'file-upload' : FileUpload,ImgPreview
    },
    data () {
      return {
         isShowDialogImg:false,
        pictures:null,
        dialogVisible: false,
        hasCallBack: true,
        callBackName: 'getUploadFile',
        form: {},
        query: {
          pageSize: 10,
          pageNum: 1,
          name: '',
          carId: ''
        },
        carFileType: [],
        tableHeader: [ {
          prop: 'name',
          label: '文件名',
          align: 'center',
          show: true
        }, {
          prop: 'attchmentTypeId',
          label: '类型',
          align: 'center',
          show: true
        }, {
          prop: 'createDt',
          align: 'center',
          label: '日期',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
      this.query.carId = this.$route.query.id
      let arr = filters.carFileTypeArr()
      let _this = this
      arr.forEach(function (item) {
        _this.$set(item, 'cnInfo', item.label)
      })
      this.carFileType = arr
      this.loadData()
    },
    methods: {
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        //除图片外，直接打开新页查看；
        openHref(row){
          Api.getUrl(row.attachmentUrlKey).then(data => {
            if (data) {
              window.open(data)
            }
          })
        },
        //图片预览
        previewImg(row){
          let img = ''
          Api.getUrl(row.attachmentUrlKey).then(data => {
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
        this.dialogVisible = false
      },
      getUploadFile (form){

        //子组件form 提交过来的参数
        /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
        this.form = {
          name: form.fileName,
          attachmentUrlKey: form.key,
          attchmentTypeId: form.type,
          carId: this.$route.query.id
        }
        Api.addCarAttachment(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '车辆附件添加成功'
            })
          }
          this.$router.push({path: '/router/carDetail',  query: {id: this.$route.query.id, registrationNumber: this.$route.query.registrationNumber}})

        })
      },
      deleteCar (i) {
        this.$confirm('您确定要删除该信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: i.id
          }
          Api.deleteAttachmentById(param).then(() => {
            this.loadData()
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
        })
      },
      /**
       * 加载文件列表
       */
      loadData () {
        this.listLoading = true
        Api.queryCarAttachmentListByCarId(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
          }
          this.listLoading = false
        })
        this.listLoading = false
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
          times = moment(value).format('YYYY-MM-DD HH:mm:ss');
        }
        return times;
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.query.name = ''
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
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          //数据转换；
          let datas = this.listData;
          datas.forEach(function (item) {
            item.attchmentTypeId = filters.carFileTypeFilter(item.attchmentTypeId)

          });
          let param = {
            tableHead: this.tableHeader,
            data: datas
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '车辆附件列表数据.xlsx'
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


