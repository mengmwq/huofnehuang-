<template>
  <div class="approvalBox">
    <div class="title">审批情况</div>
    <el-form label-width="100px" :model="editForm" :rules="rules" ref="editForm" class="pd20">
      <el-form-item label="审批流程：" v-if="isAdministrator">
        <el-radio-group v-model="editForm.type" v-if="isAdministrator">
          <el-radio :label="0">
            默认 
            <template v-if="approvalDefinitionDefault.name">
              <span class="ml10">（ {{approvalDefinitionDefault.name}} ）</span>
            </template>
            </el-radio>
          <el-radio :label="1">
            <!-- remote
              :remote-method="getApprovalDefinitionProcessList"
              filterable -->
            自定义
            <el-select
              v-model="definitionApproval.name"
              
              clearable
              size="small"
              style="width:300px;"
              placeholder="自定义流程名，流程可修改"
            >
              <el-option
                @click.native="handleProcessId(item)"
                v-for="item in processList"
                :key="item.definitionProcessId"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-radio>
        </el-radio-group>
        <template v-else>
          {{approvalDefinitionDefault.name}}
        </template>
      </el-form-item>
      <template v-if="editForm.type==1">
        <EditProcess @dataChange="approverChange" :definitionSteps="definitionApproval.definitionSteps"></EditProcess>
        <div class="tar mb10">
          <el-input
            size="small"
            v-model.trim="definitionApproval.name"
            style="width:320px;"
            placeholder="为自定义流程起个名称"
          ></el-input>
          <el-button size="small" type="primary" @click="saveApprovalDefinition">保存为自定义流程</el-button>
        </div>
      </template>
      <template v-if="editForm.type==0">
        <el-form-item label="审批意见：">
          <el-radio-group v-model="editForm.idea">
            <el-radio :label="1">同意
              <el-select
                v-if="$route.path=='/router/approvalActivityDetails'"
                v-model="editForm.receptionist"
                filterable
                clearable
                remote
                :remote-method="getPersonList"
                size="small"
                class="ml10"
                style="width:300px;"
                placeholder="选择接待负责人"
              >
                <el-option
                  @click.native="handlePersonId(item)"
                  v-for="item in personList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-radio>
            <el-radio :label="0">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            v-model.trim="editForm.reason"
            show-word-limit
            :maxlength="80"
            placeholder="请输入驳回理由"
          ></el-input>
        </el-form-item>
      </template>

      <div class="tar mt20">
        <el-button type="primary" @click="confirmApproval">确认</el-button>
        <el-button type="default" @click="$router.go(-1)">取消</el-button>
      </div>
    </el-form>
    <SelectApprover
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :approverType="approverType"
      :editForm="editForm"
      @closeDialog="closeDialog"
      @dataChange="dataChange"
    ></SelectApprover>
  </div>
</template>
<script>
import Api from '@/api/index'
import SelectApprover from './SelectApprover'
import EditProcess from './EditProcess'
export default {
  components: {
    SelectApprover,
    EditProcess
  },
  props: {
    approvalInfoId: {
      type: String
    },
    approvalInfo: {
      type: Object
    }
  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      // 自定义流程模型
      definitionApproval: {
        definitionProcessId: '',
        name: '',
        definitionSteps: []
      },
      personList: [],
      isAdministrator: false, // 是否为管理员
      approvalDefinitionDefault: {
        definitionProcessId: '',
        name: ''
      }, // 审批情况
      userInfo: userInfo,
      isShowDialog: false,
      approverType: 0,
      editForm: {
        name: '',
        idea: 1,
        type: 0,
        reason: '',
        processName: null, // 流程名称Id
        receptionist: null, // 接待人
        receptionistId: null// 接待
      },
      processList: [],
      rules: {
        name: [
          {
            required: true
          }
        ]
      }
    }
  },
  mounted () {
    this.getIsAdministrator()
    // 获取接待负责人；
    this.getPersonList()
    // 获取自定义审批流程列表
    this.getApprovalDefinitionProcessList()

    // this.getApprovalDefinitionDefault();
  },
  methods: {
    // 处理接待人ID
    handlePersonId (item) {
      this.editForm.receptionistId = item.id
    },
    // 处理审批流程iD；
    handleProcessId (item) {
      this.definitionApproval.definitionProcessId = item.processId
      this.definitionApproval.definitionSteps = []
      this.definitionApproval.definitionSteps = item.stepsList
    },
    // 最终确认审批
    confirmApproval () {
      const editForm = this.editForm
      const approvalDefinitionDefault = this.approvalDefinitionDefault

      if (editForm.type === 0) {
         // 默认流程
        let reason = editForm.reason
         // 后台要求临时写死
        if (editForm.idea === 1) {
          reason = '临时写死'
        } else {
          if (!reason) {
            this.$notify.error({
              title: '审批提示',
              message: `请输入驳回原因！`
            })
            return
          }
        }
         // 单个审批操作；
        const params = {
          approvalInfoId: this.approvalInfo.approvalInfoId,  // approvalDefinitionDefault  审核ID
          processId: this.$route.query.processId,
          reason: reason,
          states: editForm.idea,
          userId: this.userInfo.id
        }
        Api.updateApprovalProcess(params).then(res => {
          this.$notify.success({
            title: '审批提示',
            message: `审批操作成功`
          })
             // 获取未审批数量
          this.$store.dispatch('getApprovalCount', {userId: this.userInfo.id})
          this.$router.go(-1)
        })
      } else if (editForm.type === 1) {
        const definitionApproval = this.definitionApproval

         // 自定义流程
        const params = {
          approvalInfoId: this.approvalInfo.approvalInfoId,
          definitionProcess: definitionApproval,
          userId: this.userInfo.id
        }
         // 发起内部审批流程；
        Api.insertMuseumApproval(params).then(res => {
          this.$notify.success({
            title: '审批提示',
            message: `审批操作成功`
          })
          this.$router.go(-1)
             // 获取未审批数量
          this.$store.dispatch('getApprovalCount', {userId: this.userInfo.id})
        })
      }
    },
    // 是否为管理员
    getIsAdministrator () {
      Api.getApprovalMuseumDirectorCount().then(res => {
        this.isAdministrator = res
      })
    },
    // 接待负责人列表
    getPersonList (query = '') {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        const params = {
          pageNumber: 1,
          pageSize: 10,
          orgId: this.userInfo.orgId,
          keywords: query
        }
        Api.getSubAccountPage(params).then(res => {
          if (res) {
            this.personList = res.result
          }
        })
      }, 200)
    },
    // 提交审批定义
    saveApprovalDefinition () {
      const definitionApproval = this.definitionApproval
      const name = definitionApproval.name
      if (!name) {
        this.$notify.error({
          title: '操作提示',
          message: `请为自定义流程起个名称`
        })
        return
      }
     // const params = definitionApproval
      Api.insertApprovalDefinitionTarget(definitionApproval)
        .then(res => {
          this.$notify.success({
            showClose: true,
            type: 'success',
            message: `审批流程【${name}】添加成功`
          })
          this.getApprovalDefinitionProcessList()
        })
        .catch(err => {})
    },
    // 审核-获取默认系统流程
    getApprovalDefinitionDefault () {
      const userId = this.userInfo.id
      const params = {
        createUser2bId: userId
      }
      Api.getApprovalDefinitionDefault(params).then(res => {
        if (res) {
          this.approvalDefinitionDefault = res
           // 处理是否是自定义流程；
        }
      })
    },
    // 获取自定义审批列表
    getApprovalDefinitionProcessList (query = '') {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        const params = {
          pageNumber: 1,
          pageSize: 6,
          name: query,
          createUser2bId: this.userInfo.id
        }
        Api.getApprovalProcessPage(params).then(res => {
          if (res) {
            this.processList = res
          }
        })
      }, 200)
    },
    // 审批人信息改变。
    approverChange (definitionSteps) {
      this.definitionApproval.definitionSteps = definitionSteps
    },
    closeDialog () {
      this.isShowDialog = false
    },
    dataChange (item) {
      this.closeDialog()
      // this.search();
    }
  }
}
</script>
