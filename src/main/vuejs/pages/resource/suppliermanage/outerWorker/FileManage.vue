<template>
  <div>
    <!-- 操作栏 -->
    <el-row :gutter="20" class="m10">
      <el-col :span="24" class="text-right">
        <el-input size="medium" clearable placeholder="名称搜索" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
        <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
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

          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope" v-if="scope.row.key">
          <!-- <el-button type="primary" size="mini" @click="downloadItem(scope.row)">下载</el-button> -->
          <el-button type="primary"  size="mini" v-if="isHasImg(scope.row.key)" @click="showFileDetails(scope.row.key)">预览图片</el-button>
            <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.key)" v-else-if="scope.row.key.indexOf('pdf')!=-1 || scope.row.key.indexOf('PDF')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.key)">下载文件</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end" v-if="this.$route.path === '/router/supplierFileManage'">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNumber"
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
  </div>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components:{
      ImgPreview
    },
    data () {
      return {
         isShowDialogImg:false,
        pictures:null,
        form: {},
        query: {
          pageSize: 10,
          pageNumber: 1,
          name: '',
          type: '',
          caId: '',
          date: ''
        },
      /*{
        prop: 'contractNo',
                label: '合同编号',
              align: 'center',
              show: true
      }, {
        prop: 'proNo',
                label: '项目编号',
                align: 'center',
                show: true
      }, {
        prop: 'operator',
                label: '经办人',
                align: 'center',
                show: true
      }, {
        prop: 'department',
                label: '部门',
                align: 'center',
                show: true
      }, {
        prop: 'description',
                align: 'center',
                label: '文件描述',
                width: '100',
                show: true
      },*/
        tableHeader: [{
          prop: 'attachmentName',
          label: '文件名称',
          show: true
        },  {
          prop: 'createDt',
          align: 'center',
          label: '上传时间',
          width: '120',
          show: true
        }],
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
      /**
       * 加载附件列表
       */
      loadData () {
        this.listLoading = true
        // 客户附件列表
        if (this.$route.path === '/router/customerFileManage') {
          let params = {
            id: this.$route.query.id,
            name: this.query.name
          }

          Api.selectCustomerAttachmentsOuterWorker(params).then((res) => {
            if (res) {
              let _this = this
              this.listData = res
              this.listData.forEach(function (item) {
                item.updateDt = _this.formartDate(item.createDt)
              })
            }
          })
        }
        // 合作伙伴附件列表
        if (this.$route.path === '/router/partnerFileManage') {
          let params = {
            id: this.$route.query.id,
            name: this.query.name
          }
          Api.selectPartnerAttachments(params).then((res) => {
            if (res) {
              let _this = this
              this.listData = res
              this.listData.forEach(function (item) {
                item.updateDt = _this.formartDate(item.createDt)
              })
            }
          })
        }
        // 供应商附件列表
        if (this.$route.path === '/router/supplierFileManage') {
          let params = {
            supplierId: this.$route.query.id,
            attachmentName: this.query.name
          }

          Api.selectSupplierAttachments(params).then((res) => {
            if (res) {
              let _this = this
              this.listData = res.records
              this.listData.forEach(function (item) {
                item.updateDt = _this.formartDate(item.createDt)
              })
              this.total = res.total
            }
          })
        }
        this.listLoading = false
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
          times = moment(value).format('YYYY-MM-DD HH:mm')
        }
        return times
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.name = ''
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
      downloadItem (item) {
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
      }
    }
  }
</script>

<style scoped>
</style>

