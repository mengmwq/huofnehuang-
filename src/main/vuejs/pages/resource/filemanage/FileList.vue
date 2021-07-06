<template>
<div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
        <el-col :span="8">
            <el-button type="primary" size="medium" v-showBtn data-authorityType="upload-btn" @click="isShowDialog=true" icon="el-icon-plus">上传文件</el-button>
            <!--<el-button type="primary" size="medium" @click="batchDelete" >批量删除</el-button>-->
        </el-col>
        <el-col :span="16" class="text-right" style="float: right;">
          <el-select v-model="query.type" clearable placeholder="文件类型" size="medium" style="width:170px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
            <el-input size="medium" clearable placeholder="请输入文件名称" icon="search" v-model="query.fileName" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
            <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
        </el-col>
    </el-row>
    <!-- table -->
    <el-table class="page-table" :data="fileTableData" stripe highlight-current-row :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="header.prop == 'typeStr'">
                {{scope.row.typeStr}}
              </div>
              <div v-else-if="header.prop == 'size'">
                <span v-if="scope.row.size">{{scope.row.size}}KB</span>
                <span v-else></span>
              </div>
              <div v-else-if="header.prop == 'updateDt'">
                {{scope.row.updateDt | timeFormat}}
              </div>
              <div v-else>{{scope.row[header.prop]}}</div>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" v-showBtn data-authorityType="delete-btn" @click="deleteItem(scope.row)">删除</el-button>
                <!-- <el-button type="primary" size="mini" v-if="scope.row.key" v-showBtn data-authorityType="download-btn" @click="downLoadItem(scope.row)">下载</el-button> -->
                <template v-if="scope.row.key">
                  <span v-showBtn data-authorityType="download-btn">
                      <el-button type="primary"  size="mini" v-if="scope.row.key.indexOf('jpg')!=-1 || scope.row.key.indexOf('png')!=-1" @click="previewImg(scope.row)">预览图片</el-button>
                  <el-button type="primary"  size="mini" @click="openHref(scope.row)" v-else-if="scope.row.key.indexOf('pdf')!=-1 || scope.row.key.indexOf('PDF')!=-1">预览PDF</el-button>
                  <el-button type="primary"  size="mini"  v-else @click="downLoadItem(scope.row)">下载文件</el-button>
                  </span>
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

        <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
    </el-row>
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
  <file-upload v-show="isShowDialog" :isShowDialog="isShowDialog" :orgId="orgId" @closeDialog="closeDialog"></file-upload>
</div>
</template>


<script>
  import moment from 'moment'
 // import Upload from '@/components/common/Upload'
 import ImgPreview from '@/components/common/ImgPreview'
  import Api from '@/api/index'
  import FileUpload from './FileUpload'

  export default {
    components: {
      'file-upload': FileUpload,ImgPreview
    },
    data () {
      return {
        isShowDialogImg:false,
        pictures:null,
        isShowDialog: false,
        form: {
          orgId: ''
        },
        orgId: '',
        query: {
          pageSize: 10,
          pageNum: 1,
          fileName:'',
          type:''
        },
        tableHeader: [{
          prop: 'fileName',
          label: '文件名',
          width: '200',
          show: true
        }, {
          prop: 'description',
          label: '文件描述',
          width: '200',
          align: 'center',
          show: true
        }, {
          prop: 'typeStr',
          label: '类型',
          align: 'center',
          show: true
        }, {
          prop: 'size',
          label: '文件大小',
          align: 'center',
          show: true
        }, {
          prop: 'orgName',
          label: '目录',
          align: 'center',
          show: true
        }, {
          prop: 'updateDt',
          align: 'center',
          label: '修改时间',
          width: '150',
          show: true
        }, {
          prop: 'ctUName',
          align: 'center',
          label: '创建者',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        fileTableData: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        currentItem: '',
        multipleSelection: [],
        options: [{
          value: "001",
          label: "证件"
        }, {
          value: "002",
          label: "文件"
        }, {
          value: "009",
          label: "招标文件"
        }],
        value: '',

      }
    },

    mounted () {
      if (sessionStorage.getItem('jwt')) {
        let user = JSON.parse(sessionStorage.getItem('jwt'))
        this.orgId = user.orgId
        // this.query.orgId = user.orgId
      }
      this.loadData()
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
        this.isShowDialog = false
        this.loadData()
      },
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.filePage(this.query).then(data => {
          if (data) {
            this.fileTableData = data.records;
            let _this = this
            this.fileTableData.forEach(function (item) {
              //item.typeStr = filters.taskTypeFilter(item.type)
              switch (item.type){
                case '001':  _this.$set(item, 'typeStr', '证件');break;
                case '002':  _this.$set(item, 'typeStr', '文件');break;
                case '003':  _this.$set(item, 'typeStr', '招标文件');break;

              }
              // _this.$set(item, 'typeStr', item.type === '001' ? '证件' : '文件')
            })
            this.total = data.total
          }

        })
        this.listLoading = false
      },

      // /** 批量删除 */
      // batchDelete: function () {
      //   if (this.multipleSelection.length === 0) {
      //     this.$notify.warning({
      //       title: '提示',
      //       message: '请勾选您要删除的数据'
      //     })
      //     return
      //   }
      //   this.$confirm('您确定要删除这些数据吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$notify.success({
      //       title: '提示',
      //       message: '删除成功'
      //     })
      //   }).catch(() => {
      //     this.$notify.warning({
      //       title: '提示',
      //       message: '删除失败'
      //     })
      //   })
      // },


      /***删除**/
      deleteItem (item) {
        this.$confirm('您确定要删除['+item.fileName+']的信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteFile(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
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
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.query.keyword = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.fileTableData.length > 0) {
          let param = {
            tableHead: this.tableHeader,
            data: this.fileTableData
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '文件列表数据.xlsx'
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
</style>

