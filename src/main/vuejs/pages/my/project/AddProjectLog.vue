<template>
  <div>
    <el-dialog
      title="项目日志"
      :visible.sync="isShowDialog"
      :before-close="closeDialog"
      width="35%">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="80px">
         
          <el-form-item label="标题:" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容:">
            <el-input type="textarea" :rows="4" maxlength="1000" show-word-limit v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="选择文件:">
            <el-upload
              class="upload-demo"
              :action="'https://up-z0.qiniup.com'"
              :data="uploadData"
              :limit="1"
              :on-change="onUploadChange"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="default" size="small" @click="cancelAddFile()">取 消</el-button>
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
      const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
      return {
        canClick: false,
        uploadDialog: false,
        userInfo:userInfo,
        fileList: [],
        rules: {
          type: [
            { required: true, message: '请选择文件类型', trigger: 'change' },
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ]
        },
        fileType: [],
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
       
      }
    },
    props: {
      isShowDialog: Boolean,
      form:Object,
      projectId: String,
      hasCallBack: true,
      callBackName: String,
      fileTyeArr: Array
    },
    mounted () {
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      });
      const urlKey = this.form.urlKey
      if(urlKey){
      
        this.fileList.push(
          {
            name:urlKey,
            key:urlKey,
          }
        )
      }
    },
    methods: {
     
      closeDialog(){
        this.$emit('closeDialog')
      },
      handleRemove(file, fileList) {
        this.fileList = []
        this.form.url_key = ''
      },
      onUploadChange(file) {
        var fileName = file.name;
        if (fileName && fileName.lastIndexOf(".") != -1) {
          var fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      uploadSuccess (res, file, fileList) {
        console.log(fileList,'fff')
        this.fileList = fileList
        this.form.url_key = res.key
        this.form.size = (fileList[0].size/1024).toFixed(1)
      },
      /**
       * 表单提交
       */
      submitForm (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
               let params  = this.form 
              if (this.hasCallBack) {
                this.$emit(this.callBackName,params)
                this.cancelAddFile()
              } else {
               
                params.code = this.projectId
                params.ctUId = this.userInfo.ctUId
                const fn = params.id?'updateProjectLog':'addLogProject'
                Api[fn](params).then(data => {
                  if (data) {
                    this.$notify.success({
                      title: '提示',
                      message: '添加项目日志成功'
                    })
                    this.$emit('dialogChange')
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
        // this.form = {}
        // this.fileList = []
        this.$emit('closeDialog')
      },
    }
  }
</script>
