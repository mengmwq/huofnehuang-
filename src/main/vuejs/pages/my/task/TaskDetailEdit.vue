<template>
  <div>
    <el-dialog
      title="任务基本信息编辑"
      :visible.sync="isShowDialog"
      :before-close="closeDialog"
      width="35%">
      <div>
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
         
          <el-form-item label="任务名称:" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="任务类型:" prop="taskType">
            <el-input v-model="editForm.taskType"></el-input>
          </el-form-item>
           <el-form-item label="级别标准:" prop="title">
             <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="执行部门:" prop="title">
            
          </el-form-item>
          <el-form-item label="内容:">
            <el-input type="textarea" :rows="4" maxlength="1000" show-word-limit v-model="editForm.content"></el-input>
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
    props:{
      eidtForm:{
        type:String,
      }
    },
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
      eidtForm:Object,
      projectId: String,
      hasCallBack: true,
      callBackName: String,
      fileTyeArr: Array
    },
    mounted () {
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      });
    },
    methods: {
     
      closeDialog(){
        this.$emit('closeDialog')
      },
      changeFileType() {
        this.fileList = []
        this.editForm.url_key = ''
      },
      handleRemove(file, fileList) {
        this.fileList = []
        this.editForm.url_key = ''
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
        this.editForm.url_key = res.key
        this.editForm.size = (fileList[0].size/1024).toFixed(1)
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
                Api.addLogProject(params).then(data => {
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
        this.form = {}
        this.fileList = []
        this.$emit('closeDialog')
      },
    }
  }
</script>

<style scoped>

</style>
