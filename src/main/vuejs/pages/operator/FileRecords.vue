<template>
  <div>
    <el-table :data="listData">
      <el-table-column prop="createDt" label="时间">
        <template slot-scope="scope">
          {{scope.row.createDt | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="attachmentName" label="文件名称">
         <template slot-scope="scope" v-if="scope.row.attachmentName">
           <a href="javascript:;" v-if="scope.row.attachmentName.indexOf('jpg')!=-1 || scope.row.attachmentName.indexOf('png')!=-1" @click="previewImg(scope.row)">{{scope.row.attachmentName}}</a>
          <a href="javascript:;" @click="openHref(scope.row)" v-else>{{scope.row.attachmentName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="文件类型">
        <template slot-scope="scope">
          {{scope.row.type | fileTypeFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="ctUName" label="操作人"></el-table-column>
      <el-table-column prop="操作" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.key" @click="downLoadItem(scope.row)"> 下载 </el-button>
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
     :isShowDialog="isShowDialog"
     :isFullscreen="false"
     v-if="isShowDialog" @closeDialog="closeDialog"  />
  </div>
</template>

<script>
  import Api from '@/api/index'
 import ImgPreview from '@/components/common/ImgPreview'
  export default {
    name: "FileRecords",
    components:{
      ImgPreview,
    },
    data () {
      return {
        pictures:null,
        isShowDialog:false,
        listData: [],
        query: {
          pageSize: 10,
          pageNum: 1,
          purchaseId: '', // 入库记录id
          type: ''
        },
        total: 0
      }
    },
    props: {
      type: String
    },
    watch: {
      type: function (value) {
        this.query.type = value
      },
    },
    mounted () {},
    methods: {
      //关闭图片预览；
        closeDialog(){
            this.isShowDialog = false
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
              this.isShowDialog = true
            }
          })

        },
      loadData() {
        this.query.type = this.type
        Api.operationAttachmentList(this.query).then(res => {
          this.listData = res.records
          this.total = res.total
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
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
    }
  }
</script>

<style scoped>

</style>
