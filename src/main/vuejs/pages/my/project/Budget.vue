 <template>
  <div>
    <el-row class="sub-header m10">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="budgetDialogVisible = true">新增预算任务</el-button>
      </el-col>
    </el-row>
    <el-table :data="taskList" style="width: 100%">
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="describe" label="任务描述" width="150"></el-table-column>
      <el-table-column prop="type" label="任务类型">
        <template slot-scope="scope">
          {{scope.row.type | taskTypeFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="level" label="级别标准">
        <template slot-scope="scope">
          {{scope.row.level | taskLevelFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="temp" label="执行部门"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small">编辑</el-button>-->
          <el-button type="primary" size="mini" @click="deleteTaskItem(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增预算任务-->
    <el-dialog
      title="新增预算任务"
      :close-on-click-modal="canClick"
      :visible.sync="budgetDialogVisible"
      size="tiny" top="12vh" width="40%">
      <div>
        <el-form :model="form" ref="form" :rules="rules" label-width="120px">
          <el-form-item label="任务名称:" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="任务级别标准：" prop="level">
            <el-select v-model="form.level" clearable placeholder="级别标准" size="medium" style="width: 100%;">
              <el-option v-for="(item, index) in taskLevelList"
                         :key="index"
                         :label="item.cnInfo"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型：" prop="type">
            <el-select v-model="form.type" clearable placeholder="任务类型" size="medium"
                       style="width: 100%;">
              <el-option v-for="(item, index) in taskTypeList"
                         :key="index"
                         :label="item.cnInfo"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="执行部门：" prop="orgId">
            <el-select v-model="form.orgId" clearable placeholder="执行部门" size="medium"
                       style="width: 100%;">
              <el-option :value="orgId" :label="orgName" style="height: 300px;overflow-y: scroll;padding: 0">
                <el-tree
                  :data="treeData"
                  default-expand-all
                  show-checkbox
                  node-key="orgId"
                  ref="orgTree"
                  :props="{label: 'orgName', children: 'childrens'}"
                  :check-strictly="true"
                  @check-change="handleClick"
                  @node-click="nodeClick">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述:">
            <el-input type="textarea" v-model="form.describe" :rows="3" maxlength="500" show-word-limit></el-input>
          </el-form-item>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelAddArtTask('form')">取 消</el-button>
            <el-button type="primary" size="small" @click="addArtTask('form')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    name: 'Budget',
    data () {
      return {
        canClick: false,
        form: {},
        budgetDialogVisible: false,
        taskList: [],
        /** 任务级别标准 */
        taskLevelList: [],
        /** 任务类型 */
        taskTypeList: [],
        /** 执行部门 */
        excuteDeparts: [],
        rules: {
          name: [
            { required: true, message: '请填写任务名称', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请选择任务级别标准', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ],
          orgId: [
            { required: true, message: '请选择执行部门', trigger: 'change' }
          ]
        },
        temp: '',//表格执行部门转换
        orgId: '',
        orgName: '',
        treeData: []
      }
    },
    props: {
      taskInfoReqs: Array
    },
    watch: {
      taskInfoReqs: function (value) {
        this.taskList = value
      },
      taskList: function (value) {
        this.$emit('update:taskInfoReqs', value)
      }
    },
    mounted () {
      // 任务列表
      if (sessionStorage.getItem('dists')) {
        let dists = JSON.parse(sessionStorage.getItem('dists'));
        if (dists.ArtType) {
          this.taskTypeList = dists.ArtType.children
        }
        if (dists.TaskLevel) {
          this.taskLevelList = dists.TaskLevel.children
        }
      }
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })
    },
    methods: {
      handleClick(data, checked, node){
        if(checked == true){
          this.temp = data.orgName
          this.form.orgId = data.orgId;
          this.orgId = data.orgId;
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        }
      },
      nodeClick(data, checked, node){
        this.temp = data.orgName
        this.form.orgId = data.orgId
        this.orgId = data.orgId
        this.orgName = data.orgName
        this.$refs.orgTree.setCheckedNodes([data]);
      },
      /**
       * 添加艺术品预算任务
       * */
      addArtTask (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.temp = this.temp
            this.taskList.push(this.form)
            this.budgetDialogVisible = false
          } else {
            return false
          }
        })
        this.form = {}
      },
      deleteTaskItem (item, index) {
        this.$confirm('您确定要删除【' + item.name + '】任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.taskList.splice(index, 1)
        })

      },
      cancelAddArtTask (formName) {
        this.$refs[formName].resetFields()
        this.budgetDialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
