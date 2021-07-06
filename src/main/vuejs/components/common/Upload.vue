<template>
  <div>
    <el-upload
      v-if="isMultiple"
      :action="'https://up-z0.qiniup.com'"
      :data="uploadData"
      :limit="5"
      :on-change="onUploadChange"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      list-type="picture-card"
      :file-list="fileList">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">数量最多5个</div>
    </el-upload>

    <!--<el-upload v-if="isMultiple"
               action="https://up-z0.qiniup.com"
               :data="uploadData"
               list-type="picture-card"
               :file-list="fileList"
               :on-change="onUploadChange"
               :on-success="handleSuccess"
               :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>-->
    <el-upload v-else
               class="avatar-uploader"
               action="https://up-z0.qiniup.com"
               :show-file-list="false"
               :data="uploadData"
               :on-change="onUploadChange"
               :on-success="handleAvatarSuccess"
               :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" width="100" height="100">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>

</template>

<script>
  import Api from '@/api/index'
  export default {
    data() {
      return {
        imageUrl: '',
        imgKey: '',
        fileList: [],
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
      };
    },
    props: {
      imgKeyReq: String,
      isMultiple: Boolean,
      fileListReqs: Array
    },
    watch: {
      imgKeyReq: function (value) {
        this.imgKey = value
        if (!value) {
          this.imageUrl = ''
        } else {
          Api.getUrl(value).then(data => {
            if (data) {
              this.imageUrl = data
            }
          })
        }
      },
      imgKey: function (value) {
        this.$emit('update:imgKeyReq', value)
      },
      fileListReqs: function (array) {
        this.fileList = array
      },
      fileList: function (array) {
        let _this = this
        array.forEach(function (item) {
          if (item.id) {
            if (item.key) {
              _this.$set(item, 'attachmentUrlKey', item.key)
              _this.$set(item, 'name', item.attachmentName)
            }
          } else {
            if (item.response) {
              _this.$set(item, 'attachmentUrlKey', item.response.key)
            }
          }
        })
        this.$emit('update:fileListReqs', array)
      }
    },
    mounted () {
      if (!this.uploadData.token) {
        Api.getPicToken().then(data => {
          this.uploadData.token = data
        });
      }

    },
    methods: {
      onUploadChange(file) {
        let fileName = file.name;
        if (fileName && fileName.lastIndexOf(".") != -1) {
          let fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.imgKey = res.key
        this.$emit('change', res.key)
      },
      handleSuccess (res, file, fileList) {
        let _this = this
        if (fileList && fileList.length > 0) {
          fileList.forEach(function (item) {
            if (item.id) {
              if (item.key) {
                _this.$set(item, 'attachmentUrlKey', item.key)
              }
            } else {
              if (item.response) {
                _this.$set(item, 'attachmentUrlKey', item.response.key)
              }
            }

          })
        }
        this.fileList = fileList
        this.$emit('update:fileListReqs', this.fileList)
      },
      handleRemove(file, fileList) {
        let _this = this
        if (fileList && fileList.length > 0) {
          fileList.forEach(function (item) {
            if (item.id) {
              if (item.key) {
                _this.$set(item, 'attachmentUrlKey', item.key)
              }
            } else {
              if (item.response) {
                _this.$set(item, 'attachmentUrlKey', item.response.key)
              }
            }
          })
        }
        this.fileList = fileList
        console.log( this.fileList)
        this.$emit('update:fileListReqs', this.fileList)
        if (this.fileList.length == 0) {
          this.$emit('update:removedAll', true)
        }
      },
      beforeAvatarUpload(file) {
        /*const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;*/
      }
    }
  }
</script>

<style scoped>

</style>
