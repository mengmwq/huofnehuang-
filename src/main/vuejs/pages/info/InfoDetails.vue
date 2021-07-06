<template>
  <el-dialog
      :title="editForm.title"
      :before-close="closeDialog"
      :visible.sync="dialogVisable"
        fullscreen
    class="halfScreen">
      <div class="notifyTitle mb10" v-if="listData.length>0">
        <span>{{listData[0].createDt | timeFormat}}</span>
        <strong>发布人：{{listData[0].ctUName}}</strong>
      </div>
      <div class="mb10" v-html="editForm.content"></div>
      
      <!-- <p v-for="(item, index) in listData" :key="index">
        <img :src="item.fileUrl" v-if="isHasImg(item.attachmentUrlKey) && item.fileUrl" width="100%" height="200" alt="">
      </p> -->
      <el-table class="page-table" v-if="listData.length>0"  :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
      >
        <el-table-column label="序号" type="index" width="80" ></el-table-column>
        <template v-for="(header, index) in tableHeader">
                <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :formatter="header.formatter" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>

                <template slot-scope="scope">
                    <div v-if="header.prop == 'createDt'">
                    {{scope.row.createDt | timeFormat}}
                    </div>
                    <div v-else>{{scope.row[header.prop]}}</div>
                </template>
                </el-table-column>
                
        </template>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <template v-if="scope.row.attachmentUrlKey">
                <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-if="isHasImg(scope.row.attachmentUrlKey)">预览图片</el-button>
                <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.attachmentUrlKey)" v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1">预览PDF</el-button>
                <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.attachmentUrlKey)">下载文件</el-button>
              </template>
            </template>
        </el-table-column>
        
      </el-table>
      <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    </el-dialog>

</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  
  import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components:{
      ImgPreview,
    },
    props:['editForm','dialogVisable'],
    data () {
      return {
        isShowDialogImg:false,
        pictures:[],
        canClick: false,
        tableHeader: [ {
          prop: 'name',
          label: '文件名称',
          align: 'center',
          show: true
        }, {
          prop: 'ctUName',
          label: '上传人员',
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
        /** 表格 loading */
        listLoading: false,
      }
    },
    mounted () {
       this.getNoticeFile()
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
      closeDialog(){
          this.$emit('closeDialog')
      },
      
      getNoticeFile(){
        const editForm = this.editForm
        const params =  { id : editForm.id}
        Api.detailInfo(params).then(res => {
          const result = res.noticeAttachments
          this.listData =  result
          // this.listData = result.map(item=>{
          //     item.fileUrl = this.getImgUrl(item.attachmentUrlKey)
          //     return item;
          // })
        })
      },
    }
  }
</script>

<style scoped>
.notifyTitle {
  display:flex;
  justify-content: space-between;
}
</style>

