<template>
  <div>
    <el-row type="flex" justify="space-between" class="mb10">
        <el-col  class="text-right">
            <el-button type="primary" size="small" @click="dialogVisible=true">+ 文件上传</el-button>
        </el-col>
    </el-row>
    <el-table
      class="page-table"
      :data="form.applyAttachmentReqs"
      stripe
      highlight-current-row
      :cell-style="{color:'#333'}"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <template v-for="(header, index) in tableHeaderAttachments">
        <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :align="header.align"
          :min-width="header.width"
          :column-key="header.prop"
          show-overflow-tooltip
        >
        </el-table-column>
      </template>

      <el-table-column label="操作" width="170">
        <template slot-scope="scope">
          <template v-if="scope.row.attachmentUrlKey">
            <el-button
              type="primary"
              size="mini"
              @click="showFileDetails(scope.row.attachmentUrlKey)"
              v-if="isHasImg(scope.row.attachmentUrlKey)"
            >预览图片</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="showFileDetails(scope.row.attachmentUrlKey)"
              v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1"
            >预览PDF</el-button>
            <el-button
              type="primary"
              size="mini"
              v-else
              @click="showFileDetails(scope.row.attachmentUrlKey)"
            >下载文件</el-button>
          </template>
          <el-button type="primary" size="small" @click="deleteFileItem(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ImgPreview
      :pictures="pictures"
      :isShowDialog="isShowDialogImg"
      :isFullscreen="false"
      v-if="isShowDialogImg" 
      @closeDialog="closeDialogImg">  
     </ImgPreview>
     <file-upload 
       v-if="dialogVisible" 
        :isShowDialog="dialogVisible" 
        :fileTyeArr="fileTypeList" 
        :hasCallBack="hasCallBack"
        :callBackName="callBackName" 
        @getUploadFile="getUploadFile" 
        @closeDialog="closeDialog">
      </file-upload>
  </div>
</template>

<script>
import Api from "@/api/index";
import FileUpload from '@/components/common/FileUpload'
import ImgPreview from '@/components/common/ImgPreview'
export default {
  name: "FileTableMultiUpload",
  components:{
     FileUpload,
      ImgPreview,
  },
  props: {
    applyAttachment: Array,
    removedAll: Boolean
  },
  data() {
    const applyAttachment = this.applyAttachment
    console.log(applyAttachment,'dddddddddddddddddd')
    const applyAttachmentDefault = applyAttachment?applyAttachment:[]
    return {
      /** 上传数据 */
      uploadData: {
        token: "",
        key: ""
      },
      fileTypeList:[],
      form:{
        applyAttachmentReqs:applyAttachmentDefault,
      },
      fileList: [],
      //附件上传
        hasCallBack: true,
        callBackName: 'getUploadFile',
        dialogVisible:false,
        
        tableHeaderAttachments: [{
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, {
          prop: 'description',
          align: 'center',
          label: '文件描述',
          width: '200',
          show: true
        },],
        //图片预览
        isShowDialogImg:false,
        pictures:null,
    };
  },
  
  mounted() {
    Api.getPicToken().then(data => {
      this.uploadData.token = data;
    });
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
      getDistsKeyName(type){
        return this.fileTypeList.filter(item=>item.value==type)[0].cnInfo;
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
        let _this = this
        this.form.applyAttachmentReqs.push({
          name: form.fileName,
          attachmentUrlKey: form.key,
          type: form.type,
          description: form.description,
          //size: _this.renderSize(form.size)
        })
        this.$emit('attachmentChange',this.form.applyAttachmentReqs)
      },
      //删除报关附件
      deleteFileItem(row,index){
          if(row.id){
            const params  = {
              id:row.id
            }
            Api.deleteAttachment(params).then(res=>{
                this.form.applyAttachmentReqs.splice(index,1)
                this.$emit('attachmentChange',this.form.applyAttachmentReqs)
                console.log(this.form.applyAttachmentReqs,'接口')
            })
          }else{
             this.form.applyAttachmentReqs.splice(index,1)
             this.$emit('attachmentChange',this.form.applyAttachmentReqs)
             console.log(this.form.applyAttachmentReqs,'djd ')
          }
      },
  }
};
</script>