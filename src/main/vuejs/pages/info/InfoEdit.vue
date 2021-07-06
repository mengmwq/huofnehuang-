<template>
  <el-dialog
      :title="editForm.id?'编辑公告':'添加公告'"
      :before-close="closeDialog"
      :visible.sync="isShowDialog"
      size="tiny" top="12vh" width="50%">
       <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" >
          <el-form-item label="标题：" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="公告信息：" prop="content" class="editStyle">
            <quill-editor 
                        v-model="editForm.content" 
                        ref="myQuillEditor" 
                        :options="editorOption" 
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                    </quill-editor>
            <!-- <el-input type="textarea" v-model="editForm.content" :rows="4" maxlength="1000" show-word-limit></el-input> -->
          </el-form-item>

          <el-form-item label="文件上传：">
            <FileListMultiUpload :fileList.sync="fileList" :removedAll.sync="removedAll" :applyAttachmentReqList="editForm.noticeAttachments"></FileListMultiUpload>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px;text-align: center">
          <el-button type="primary" size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>


<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import FileListMultiUpload from '@/components/common/FileListMultiUpload'
  export default {
    props:['editForm','isShowDialog'],
    components:{
        FileListMultiUpload,
    },
    computed:{
      editor() {
          return this.$refs.myQuillEditor.quill;
      },
    },
    data () {
      return {
         editorOption:{
                modules:{
                    toolbar:[
                      //['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                      ['bold', 'italic'],
                      // ['blockquote', 'code-block'],
                      //[{ 'list': 'ordered'}, { 'list': 'bullet' }], //列表 - list 
                      //[{ 'indent': '-1'}, { 'indent': '+1' }],  //缩进 - indent
                      // [{ 'direction': 'rtl' }], //文本方向 - direction

                      [{ 'size': ['small', false, 'large', 'huge'] }], 
                      [{ 'color': [] }], 
                      // [{ 'font': [] }],
                      // [{ 'align': [] }],
                      ['clean']
                    ]
                }
            },
          removedAll:false,
          fileList:[],
          rules: {    
            title: [
              { required: true, message: '请输入公告标题', trigger: 'blur'},
            ],  
            content: [
              { required: true, message: '请输入公告内容', trigger: 'blur'},
            ], 
           
        },
      }
    },
    mounted () {
      
    },
    methods: {
      closeDialog(){
          this.$emit('closeDialog')
      },
      onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
        saveHtml:function(event){
          alert(this.content);
        },
      
      /** 确认保存 ： 新增或编辑 */
      confirm(){
          this.$refs.editForm.validate((valid) => {
            if (valid) {     
                let editForm  = this.editForm;

                //处理文件上传
                 if (this.fileList.length > 0) {
                    editForm.noticeAttachments = []
                    this.fileList.forEach(function (item) {
                        editForm.noticeAttachments.push({
                        name: item.name,
                        attachmentUrlKey: item.attachmentUrlKey
                        })
                    })
                    } else {
                    if (this.removedAll) {
                        editForm.noticeAttachments = []
                    }
                    }
                const fn = editForm.id ? 'addInfo' : 'addInfo'
                const msg = editForm.id ? '编辑公告成功' : '添加公告成功'
                Api[fn](editForm).then(res=>{ 
                    this.$notify.success({
                        title: '提示',
                        message: msg
                        })                 
                      this.$emit('notifyChange');  
                   
                }).catch(err=>{            
                })                
            } else {
              return false;
            }
          });                    
      },
    }
  }
</script>

<style lang="scss">
  .editStyle  .el-form-item__content{
   line-height: 24px;
}
</style>