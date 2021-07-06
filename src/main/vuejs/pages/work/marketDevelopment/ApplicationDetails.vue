<template>
      <el-form label-width="140px" :model="editForm" :rules="rules" ref="editForm">
        <div class="titleBar">
            <div class="titleName">
                基本信息：
            </div>
        </div>
        <el-row class="pd20">
           <el-col :span="12">
             <el-form-item label="需求部门：" prop="department">
                <el-input v-model.trim="editForm.name" :maxlength="20" placeholder="请输入"></el-input>
            </el-form-item>
           </el-col>
            <el-col :span="12">
             <el-form-item label="岗位名称：" prop="name">
                <el-input v-model.trim="editForm.name" :maxlength="30" placeholder="请输入"></el-input>
            </el-form-item>
           </el-col>
            <el-col :span="8">
              <el-form-item label="招聘人数：" prop="count">
                  <el-input-number style="width:100%" v-model="editForm.count" controls-position="right" @change="handleChange" :min="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="招聘类型：" prop="price">
                  <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :span="8">
              <el-form-item label="到岗日期：" prop="validDate">
                  <el-date-picker
                    v-model="editForm.validDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
              </el-form-item>
            </el-col>
        </el-row>
        <div class="titleBar">
            <div class="titleName">
                任职资格：
            </div>
        </div>
        <el-row class="pd20">
           <el-col :span="12">
             <el-form-item label="性别要求：" prop="department">
                <el-radio-group v-model="radio2">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                    <el-radio :label="2">不限</el-radio>
                </el-radio-group>
            </el-form-item>
           </el-col>
            <el-col :span="12">
             <el-form-item label="年龄要求：" prop="name">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="60"></el-input-number>
            </el-form-item>
           </el-col>
        </el-row>
         <el-form-item label="学历要求：" prop="department">
            <el-input v-model.trim="editForm.name" :maxlength="30" placeholder="30个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="专业要求：" prop="department">
            <el-input v-model.trim="editForm.major" :maxlength="30" placeholder="30个字符以内"></el-input>
        </el-form-item>
            <el-form-item label="经验要求：" prop="department">
            <el-input v-model.trim="editForm.name" :maxlength="30" placeholder="30个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="语言要求：" prop="department">
            <el-input v-model.trim="editForm.major" :maxlength="30" placeholder="30个字符以内"></el-input>
        </el-form-item>
            <el-form-item label="其他要求：" prop="department">
            <el-input v-model.trim="editForm.name" :maxlength="30" placeholder="30个字符以内"></el-input>
        </el-form-item>
        <div class="titleBar">
            <div class="titleName">
                岗位职责：
            </div>
        </div>
        <el-form-item label="" prop="remark" class="adjustMargin">
            <el-input type="textarea"  v-model.trim="editForm.remark" show-word-limit maxlength="100" placeholder="请输入名称"></el-input>
        </el-form-item>
        <div class="titleBar">
            <div class="titleName">
                薪资建议：
            </div>
        </div>
        <el-row>
            
            <el-col :span="8">
              <el-form-item label="试用期工资：" prop="department">
                <el-input v-model="editForm.department" maxlength="10">
                    <template slot="prepend">￥</template>
                    <template slot="append">/月</template>
                </el-input
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试用期限：" prop="department">
                <el-date-picker
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="正式期工资：" prop="department">
                <el-input v-model="editForm.department" maxlength="10">
                     <template slot="prepend">￥</template>
                    <template slot="append">/月</template></el-input
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同期限：" prop="department">
                <el-input-number  controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>个月
              </el-form-item>
            </el-col>
        </el-row>
         <el-form-item label="其他：" prop="department">
            <el-input v-model.trim="editForm.name" :maxlength="30" placeholder="30个字符以内"></el-input>
        </el-form-item>
        <div class="tar">
            <el-button type="default"  @click="cancel">取消</el-button>
            <el-button type="primary"  @click="confirm('editForm')">确认</el-button>
        </div>
      </el-form>
</template>
<script>
  import Api from '@/api/index'
  export default {
  
    data: function () {
      return {
        editForm: {
  
        },
        rules: {
          name: [
              { required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          count: [
              { required: true, message: '请输入数量', trigger: 'blur'}
          ],
          validDate: [
              { required: true, message: '请选择有效日期', trigger: ['change', 'blur']}
          ],
          location: [
               { required: true, message: '请输入存放库位', trigger: 'blur'}
          ],
          department: [
              { required: true, message: '请输入部门', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      handleChange () {
  
      },
      cancel () {
        this.$router.push({
          path: '/router/jobApproval'
        })
      },
      /**
       * 确认保存 ： 新增或编辑
       */
      confirm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const editForm = this.editForm

            let fn = editForm.id ? 'updateUser' : 'insertUser'

            Api[fn](editForm).then(res => {
              if (res) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: `人员【${editForm.name}】添加成功`
                })
                this.cancel()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: `人员【${editForm.name}】添加失败`
                })
              }
            }).catch(err => {
            })
          } else {
            return false
          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
    .titleBar {
        position: relative;
        border-bottom:1px dashed #C1272D;
        height:20px;
        margin-bottom:30px;
        .titleName {
            color:#C1272D;
            position: absolute;
            top:10px;
            left:0;
            background:#fff;
            padding-right:10px;
        }
    }
    .adjustMargin{
        .el-form-item__content{
            margin-left:0!important;
        }
    }
</style>
