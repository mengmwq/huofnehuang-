<template>
  <el-dialog
      title="ETC申请"
      :before-close="closeDialog"
      :visible.sync="isShowDialog"
      size="tiny" top="12vh" width="50%">
       <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm" >
          <el-row>
             <el-col :span="12">
                <el-form-item label="项目编码：" prop="projectCode">
               
                <el-select filterable v-model="editForm.projectCode" 
                 remote
                    :remote-method="remoteMethod"
                 clearable placeholder="项目名称/编号/客户名称" size="medium" style="width: 100%;">
                  <el-option
                   
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectCode"
                    :value="item.projectCode">
                    <span style="float: left">{{ item.projectName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectCode }}</span>
                  </el-option>
                  
                </el-select>
              </el-form-item>
             </el-col>
             <!-- <el-col :span="12">
               <el-form-item label="申请人：" prop="approvalId">
                 <el-select filterable clearable v-model="editForm.applyerId" 
                 remote
                 :remote-method="getUserList"
                  placeholder="申请人" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in userList" :key="index" :label="item.uName" :value="item.uId"></el-option>
                </el-select>
                </el-form-item>
             </el-col> -->
             <el-col :span="12">
                <el-form-item label="金额：" prop="amount">
                  <el-input v-model="editForm.amount"  maxlength="10"></el-input>
                </el-form-item>
             </el-col>
            
             <el-col :span="12">
                <el-form-item label="本次公里数：" prop="kilometres">
                  <el-input v-model="editForm.kilometres" maxlength="10"></el-input>
                </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="始发地：" prop="startingPlace">
                  <el-input v-model="editForm.startingPlace" maxlength="20"></el-input>
                </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="目的地" prop="destination">
                  <el-input v-model="editForm.destination" maxlength="20"></el-input>
                </el-form-item>
             </el-col>
             
             <el-col :span="12">
               <el-form-item label="审批流程：" prop="approvalProcessId">
                <el-select  filterable v-model="editForm.approvalProcessId" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option v-for="item in approvalList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
             </el-col>
          </el-row>
        </el-form>
        <div style="margin-top: 20px;text-align: center">
          <el-button type="default" size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>


<script>
  import Api from '@/api/index'
  import ValidForm from '@/utils/ValidForm'
  export default {
    props:['editForm','isShowDialog'],
    components:{
      
    },
    computed:{
     
    },
    data () {
      return {
        projectList:[],
        approvalList:[],
        userList:[],
        rules: {    
          projectCode: [
            { required: false, message: '请选择项目编码', trigger: 'change'},
          ],  
          amount: [
            { required: true, message: '请输入金额', trigger: 'blur'},
            { pattern: ValidForm.floatNumReg, message: '请输入正确的金额'}
            
          ], 
           startingPlace: [
            { required: true, message: '请输入始发地', trigger: 'blur'},
          ],
           destination: [
            { required: true, message: '请输入目的地', trigger: 'blur'},
          ], 
          approvalProcessId: [
            { required: false, message: '请选择审批流程', trigger: 'change'},
          ],  
        },
      }
    },
    mounted () {
        this.remoteMethod()
        this.getApprovalList()
        this.getUserList()
    },
    methods: {
        getUserList(query=''){
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              name:query,
              
          }
          Api.getUserPage(params).then(res=>{
            console.log(res,'resss')
            this.userList = res.records
          })
          
        }, 200);
      },
      getApprovalList(){
        //审批流程
        Api.approvalList({category: '7'}).then(data => {
          this.approvalList = data;
        }).finally(() => {
          this.listLoading = false
        })
      },
      //项目编码
      remoteMethod(query='') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              searchStr:query,
              myProjectList:false
          }
          Api.projectList(params).then(res=>{
            console.log(res,'resss')
            this.projectList = res.records
          })
          
        }, 200);
      },
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
                editForm.carId =  this.$route.query.id;
                //处理文件上传
                //  if (this.fileList.length > 0) {
                //     editForm.noticeAttachments = []
                //     this.fileList.forEach(function (item) {
                //         editForm.noticeAttachments.push({
                //         name: item.name,
                //         attachmentUrlKey: item.attachmentUrlKey
                //         })
                //     })
                //     } else {
                //     if (this.removedAll) {
                //         editForm.noticeAttachments = []
                //     }
                //     }
                const fn = editForm.id ? 'updateETCById' : 'addETC'
                const msg = editForm.id ? '编辑ETC申请成功' : '添加ETC申请成功'
                Api[fn](editForm).then(res=>{ 
                    this.$notify.success({
                        title: '提示',
                        message: msg
                        })                 
                      this.$emit('changeDialog');  
                   
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