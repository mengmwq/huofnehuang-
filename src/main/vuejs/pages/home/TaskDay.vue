<template>
  <el-dialog
      :title="editForm.id?'编辑任务信息':'添加任务信息'"
      :before-close="closeDialog"
      :visible.sync="dialogVisable"
      size="tiny" top="12vh" width="50%">
     
      <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" >
        <el-form-item label="任务名称：" prop="taskName">
            <el-input type="textarea"  v-model="editForm.taskName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-row>
             <el-col :span="12">
               <el-form-item label="开始日期：">
                 <el-date-picker size="medium" v-model="editForm.startTimeString" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                
              </el-form-item>
             </el-col>
              <el-col :span="12">
              <el-form-item label="结束日期：">
                <el-date-picker size="medium" v-model="editForm.endTimeString" value-format="yyyy-MM-dd"  type="date"></el-date-picker>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row>
             <el-col :span="12">
                <el-form-item label="执行人：" prop="userId" >
                  <el-select v-model="editForm.userId" filterable clearable  placeholder="请选择">
                    <el-option
                      @click.native="userChange(item)"
                      v-for="item in departmentPersonList"
                      :key="item.uId"
                      :label="item.uName"
                      :value="item.uId">
                    </el-option>
                  </el-select>
                </el-form-item>
             </el-col>
              <!-- <el-col :span="12">
              <el-form-item label="颜色标识：" prop="colour">
                  <el-color-picker v-model="editForm.colour" show-alpha></el-color-picker>
                </el-form-item>
             </el-col> -->
          </el-row>
         
         
        </el-form>
        <div style="margin-top: 20px;text-align: center">
          
          <el-button type="primary" size="small" @click="closeDialog">取 消</el-button>
          <el-button v-if="editForm.id" type="primary" size="small" @click="deleteItem">删除</el-button>
          <el-button type="primary" size="small" @click="confirm">确 定</el-button>
           
        </div>
      
    </el-dialog>
</template>


<script>
  import Api from '@/api/index'
  export default {
    props:['editForm','dialogVisable','type'],
    computed:{
       departmentPersonList() {
         console.log(this.$store.state.user.departmentPerson,'ddd')
          return this.$store.state.user.departmentPerson
        },
    },
    data () {
      const userInfo  = JSON.parse(sessionStorage.getItem('jwt'))
      return {
        orgId:userInfo.orgId,
        rules: {
            taskName:[
                { required: true, message: '请输入任务名称', trigger: 'blur'},
            ],
            startTimeString:[
                { required: true, message: '请选择开始时间', trigger: 'change'},
            ],
            endTimeString:[
                {required: true, message: '请选择开始时间', trigger: 'change'},
            ],
            userId:[
                { required: true, message: '请选择执行人', trigger: 'change'},
            ],
        },
      }
    },
    mounted () {
      this.getDepartmentPersonList()
    },
    methods: {
      startTimeChange(val){
        console.log(val,'sss')
      },
      deleteItem(){
        const editForm  = this.editForm;
        this.$confirm(`确认要删除【${editForm.name}】的任务信息吗？`, '提示', {
          type: 'warning'
        }).then(() => {
         const params = {
           id:editForm.id
         }
          Api.deleteDayTask(editForm).then((res) => {
             this.$emit('dialogChange',editForm.startTimeString);
          });
        }).catch(() => {});
          
      },
      userChange(item){
         console.log(item.uName)
          this.editForm.name = item.uName
      },
      getDepartmentPersonList(){
          const params = {
            orgId :this.orgId
          }
         this.$store.dispatch('getDepartmentPersonList',params)
      },
      confirm(){
          this.$refs.editForm.validate((valid) => {
            if (valid) {
                let editForm  = this.editForm;
                const type = this.type
                editForm.type = type;
                if(type == 0){
                  editForm.orgId = this.orgId
                }

                let fn = editForm.id ? 'updateDayTask' : 'addDayTask'
                
                Api[fn](editForm).then(res=>{
                    if(res){
                        this.$message({
                        showClose: true,
                        type: 'success',
                        message:`添加成功`
                      });
                      this.$emit('dialogChange',editForm.startTimeString);
                    }else{
                      this.$message({
                        showClose: true,
                        type: 'error',
                        message:`添加失败`
                      });
                    }
                }).catch(err=>{
                })
            } else {
          
              return false;
            }
          });
      },
      closeDialog(){
          this.$emit('closeDialog')
      },
       
    }
  }
</script>

