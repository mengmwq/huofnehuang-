<template>
  <div>
    <el-dialog
      title="文件上传"
      :visible.sync="isShowDialog"
      :close-on-click-modal="canClick"
      @close="cancelAddFile"
      size="tiny" top="12vh" width="35%">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <!-- <el-form-item label="文件类型:" prop="type">
            <el-select v-model="form.type" @change="changeFileType" clearable placeholder="请选择文件类型" size="medium" style="width:100%">
              <el-option v-for="item in fileType" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <!---->
          <el-form-item label="选择文件:"  ref="uploadForm" prop="key">
            <el-upload
              class="upload-demo"
              multiple
              :action="'https://up-z0.qiniup.com'"
              :data="uploadData"
              :limit="10000000"
              :on-change="onUploadChange"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="文件名称:" prop="fileName">
            <el-input v-model="form.fileName"></el-input>
          </el-form-item>
          <el-form-item label="文件描述:">
            <el-input type="textarea" :rows="3" maxlength="500" show-word-limit v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="cancelAddFile()">取 消</el-button>
          <el-button type="primary" size="small" @click="submitForm('form')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import Api from '@/api/index'
  export default {
    name: "FileUpload",
    data () {
      return {
        canClick: false,
        uploadDialog: false,
        form: {
          key: '',
          type: '',
          fileName: ''
        },
        fileList: [],
        rules: {
          type: [
            { required: true, message: '请选择文件类型', trigger: 'change' },
          ],
          key: [
            { required: true, message: '请上传文件', trigger: 'blur' },
          ],
          fileName: [
            { required: true, message: '请输入文件名称', trigger: 'blur' },
          ]
        },
        fileType: [],
        defaultFileType: [
          {cnInfo: '证件', value: '001'},
          {cnInfo: '文件', value: '002'},
          {cnInfo: '招标文件', value: '003'},
        ],
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
      }
    },
    props: {
      isShowDialog: Boolean,
      orgId: String,
      hasCallBack: true,
      callBackName: String,
      fileTyeArr: Array
    },
    // watch: {
    //   fileTyeArr: function (value) {
    //     if (value) {
    //       this.fileType = value
    //     } else {
    //       this.fileType = this.defaultFileType
    //     }
    //   }
    // },
    mounted () {
    //   if (this.fileTyeArr) {
    //     this.fileType = this.fileTyeArr
    //   } else {
    //     this.fileType = this.defaultFileType
    //   }
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      });
    },
    methods: {
    //   changeFileType() {
    //     this.fileList = []
    //     this.form.key = ''
    //   },
      handleRemove(file, fileList) {
        this.fileList = []
        this.form.key = ''
      },
      onUploadChange(file) {
        var fileName = file.name;
        if (fileName && fileName.lastIndexOf(".") != -1) {
          var fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      uploadSuccess (res, file, fileList) {
        this.fileList = fileList
        this.form.key = res.key
        this.form.size = (fileList[0].size/1024).toFixed(1)
        this.$refs.uploadForm.clearValidate()
      },
      /**
       * 表单提交
       */
      submitForm (formName) {

          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.hasCallBack) {
                this.$emit(this.callBackName, this.form)
                this.cancelAddFile()
              } else {
                this.form.orgId = this.orgId
                Api.addFile(this.form).then(data => {
                  if (data) {
                    this.$notify.success({
                      title: '提示',
                      message: '添加成功'
                    })
                    this.cancelAddFile()
                  }
                })
              }
            } else {
              this.$message('请完善表单')
            }
          })


      },
      cancelAddFile() {
        this.form ={
          key: '',
          type: '',
          fileName: ''
        }
        this.fileList = []
        this.$emit('closeDialog')
      },
    }
  }
</script>
