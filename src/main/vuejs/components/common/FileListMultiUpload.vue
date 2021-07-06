<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="'https://up-z0.qiniup.com'"
      :data="uploadData"
      :limit="5"
      :on-change="onUploadChange"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">附件数量最多5个</div>
    </el-upload>
  </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    name: "FileListMultiUpload",
    data () {
      return {
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
        fileList: []
      }
    },
    props: {
      applyAttachmentReqList: Array,
      removedAll: Boolean
    },
    watch: {
      applyAttachmentReqList: function (value) {
        this.fileList = value
      }
    },
    mounted () {
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      });
    },
    methods: {
      onUploadChange(file) {
        let fileName = file.name;
        if (fileName && fileName.lastIndexOf(".") != -1) {
          let fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      handleRemove(file, fileList) {
        if (fileList && fileList.length > 0) {
          fileList.forEach(function (item) {
            if (!item.attachmentUrlKey && item.response) {
              _this.$set(item, 'attachmentUrlKey', item.response.key)
            }
          })
        }
        this.fileList = fileList
        this.$emit('update:fileList', this.fileList)
        if (this.fileList.length == 0) {
          this.$emit('update:removedAll', true)
        }
      },
      uploadSuccess (res, file, fileList) {
        let _this = this
        console.log(fileList)
        if (fileList && fileList.length > 0) {
          fileList.forEach(function (item) {
            if (!item.attachmentUrlKey && item.response) {
              _this.$set(item, 'attachmentUrlKey', item.response.key)
            }
          })
        }
        this.fileList = fileList
        this.$emit('update:fileList', this.fileList)
      },
    }
  }
</script>

<style scoped>

</style>
