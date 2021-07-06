<template>
  <div>
  
      <!-- 操作栏 -->
      <el-row :gutter="20" class="m10">
        <el-col :span="8">
          <el-button type="primary" @click="addEmployee" size="small"  data-authorityType="addUser-btn">添加</el-button>
          <el-button type="primary" @click="importExcel" size="small"  data-authorityType="addUser-btn">导入</el-button>
        </el-col>
        <el-col :span="16" class="text-right" style="float: right;">
         <el-select filterable v-model="query.retrievalFlg" clearable placeholder="员工状态" size="small" style="width:150px" @change="loadData">
            <el-option v-for="item in personnelStatusList" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
          </el-select>
          <el-select filterable v-model="query.retrievalFlg" clearable placeholder="隶属机构" size="small" style="width:150px" @change="loadData">
            <el-option v-for="item in orgList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input size="small" clearable placeholder="请输入工号，姓名或电话" prefix-icon="el-icon-search" icon="search" v-model="query.name" @keyup.enter.native="loadData" style="width: 250px;"></el-input>
          <el-button type="primary" size="small" @click="loadData" class="btnTop">查询</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(header, index) in tableHeader">
            <el-table-column  v-if="header.show"  :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'delFlg'">
              <span>{{scope.row.delFlg | accountDelFilter}}</span>
            </div>
            <div v-else-if="header.prop == 'uName'">
              <a href="javascript:;" @click="viewUser(scope.row)">{{scope.row.uName}}</a>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        </template>
        
        <el-table-column label="操作" width="170" fixed="right">
          <template slot-scope="scope">
            <el-button  type="primary"  data-authorityType="editUser-btn" size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button
                type="primary"
                size="mini"
               
                data-authority-type="resetPwd-btn"
                @click="resetPassword(scope.row)"
              >重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="page-box" justify="end">
        <!-- 分页 -->
        <el-pagination
         background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <el-button type="primary" size="small" @click="exportExcel">导出Excel</el-button>
      </el-row>
      <!--重置密码-->
   <PasswordReset
      v-if="isShowDialog"
      :isShowDialog="isShowDialog"
      :editForm="addForm"
      @closeDialog="closeDialog"
      @dataChange="dataChange"
    ></PasswordReset>
  </div>
</template>

<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import PasswordReset from './PasswordReset'
  export default {
    components: {
      PasswordReset
    },
    computed: {
      personnelStatusList () {
        return [
          {
            value: 0,
            cnInfo: '实习'
          }
        ]
      }

    },
    data () {
      return {
        isShowDialog: false,
        orgList: [],
        canClick: false,
        classifyFlag: false,
        temp: '', // 显示。交换
        // 新增/编辑用户标志
        operateFlag: '',
        flag: false,
        orgName: '',
        orgId: '',
        expandedKeys: [],
        checkedKeys: [],
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        type: '',
        addForm: {
          picKey: '',
          uCode: '',
          loginAccount: '',
          uName: '',
          tel: '',
          pwd: '',
          orgId: '',
          roleId: '',
          positionId: '',
          uClass: '',
          isLeaderLevel: false,
          email: '',
          englishName: '',
          delFlg: '',
          sex: ''
        },
        currentItem: {},
        dialogImageUrl: '',
        query: {
          pageSize: 10,
          pageNum: 1,
          name: ''
        },
        query1: {
          pageSize: 10,
          pageNum: 1,
          executor: '',
          searchStr: ''
        },
        tableHeader: [{
          prop: 'orgName',
          label: '隶属机构',
          show: true,
          align: '100'
        }, {
          prop: 'uName',
          label: '姓名',
          align: 'left',
          show: true
        }, {
          prop: 'tel',
          label: '电话',
          align: 'center',
          show: true
        }, {
          prop: 'loginAccount',
          label: '登录账号',
          align: 'center',
          show: true
        }, {
          prop: 'roleName',
          label: '岗位',
          align: 'left',
          show: true
        }, {
          prop: 'workId',
          label: '工号',
          align: 'left',
          show: true
        }, {
          prop: 'delFlg',
          label: '员工状态',
          align: 'center',
          show: true
        }],
  
        /** 表格数据 */
        listData: [],
        multipleSelection: [],
        /** 性别 */
        SexType: [],
        /** 账号状态 */
        DelFlagStatus: [],
        /** 责任人列表 */
        UserClassType: [],
        /** 总数据数 */
        total: 0,
        /** 查看总数据数 */
        total1: 0,
        /** 表格 loading */
        listLoading: false,
        tabIndex: 1,
        rolesArr: [],
  
        /** 上传数据 */
        uploadData: {
          token: '',
          key: ''
        },
        fileList: [],
        imageUrl: ''
      }
    },
    mounted () {
      this.loadData()
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.SexType) {
          this.SexType = distsObj.SexType.children
        }
        if (distsObj.DelFlagStatus) {
          this.DelFlagStatus = distsObj.DelFlagStatus.children
        }
        if (distsObj.UserClassType) {
          this.UserClassType = distsObj.UserClassType.children
        }
      }
      Api.getPicToken().then(data => {
        this.uploadData.token = data
      })
    },
    methods: {
      /**
     * 表格改变
     */
      dataChange () {
        this.loadData()
        this.closeDialog()
      },
      /**
     *  重设密码，打开弹窗
     */
      resetPassword (row) {
        this.addForm = Object.assign({}, row)
        this.isShowDialog = true
      },
    /**
     *  密码重设事件改变
     */

      closeDialog () {
        this.isShowDialog = false
        this.isShowEditDialog = false
      },
      changeTabData (index) {
        this.tabIndex = index
      },
      importExcel () {
  
      },
      /**
       * 新增人员工
       * */
      addEmployee () {
        this.$router.push({
          path: '/router/addEmployeeFiles'
        })
      },
      /**
       * 查看详情
       * */
      viewUser (item) {
        this.query1.executor = item.uId
        this.dialogVisible = true
        Api.getUserById({id: item.uId}).then((res) => {
          this.currentItem = res
        })
        this.addForm.picKey = item.picKey
        this.getImgUrl(item.picKey)
        this.$set(this.currentItem, 'imgUrl', this.imageUrl)
        this.loadData()
      },
      /**
       * 编辑人员
       * */
      editUser (item) {
        this.getImgUrl(item.picKey)
        this.operateFlag = 'update'
        this.addForm = JSON.parse(JSON.stringify(item))
        // this.addForm.orgId = item.orgName
        this.dialogVisible2 = true
      },
      /**
       * 停用人员
       * */
      deleteUser (item) {
        this.$confirm('您确定要停用改用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.deleteUser({uid: item.uId}).then((res) => {
            if (res) {
              this.loadData()
              this.$notify.success({
                title: '提示',
                message: '停用成功'
              })
            } else {
              this.$notify.warning({
                title: '提示',
                message: '停用失败'
              })
            }
          })
        }).catch(() => {
        })
      },
      upheadPhoto () {
        this.dialogVisible3 = true
      },
      handleRemove2 (file, fileList) {
        console.log(file, fileList)
      },
      /**
       * 加载用户列表
       */
      loadData (pageNum = 1) {
        if (typeof pageNum === 'object') {
          this.query.pageNum = 1
        } else {
          this.query.pageNum = pageNum
        }
        this.listLoading = true
        Api.getUserPage(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
        this.listLoading = false
      },
      /**
       * 添加用户
       * */
      onSubmit (formName) {
        if (!this.addForm.orgId) {
          this.$notify.warning({
            title: '提示',
            message: '请选择隶属机构'
          })
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operateFlag === 'add') {
              this.insertUser()
            } else {
              this.updateUser()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /**
       * 新增用户
       * */
      insertUser () {
        this.addForm.isLeaderLevel = this.addForm.isLeaderLevel === true ? '1' : '0'
        Api.addUser(this.addForm).then((res) => {
          if (res) {
            this.loadData()
            this.$notify.success({
              title: '提示',
              message: '人员添加成功'
            })
            this.dialogVisible2 = false
            this.fileList = []
            this.uploadData = {}
          }
        })
      },
      /**
       * 编辑用户
       * */
      updateUser () {
        this.addForm.isLeaderLevel = this.addForm.isLeaderLevel === true ? '1' : '0'
        Api.updateUser(this.addForm).then((res) => {
          if (res) {
            this.loadData()
            this.$notify.success({
              title: '提示',
              message: '人员修改成功'
            })
            this.dialogVisible2 = false
          }
        })
      },
      /**
       * 添加用户表单重置
       * */
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.dialogVisible2 = false
      },
      handleClick (data, checked, node) {
        if (checked == true) {
        /** 通过组织id获取用户类型**/
          Api.getUserTypesListByOrgId({orgId: data.orgId}).then((res) => {
            if (res) {
              // addForm.uClass
              this.rolesArr = res
            }
          })

          this.addForm.orgId = data.orgId
          this.addForm.orgName = data.orgName
          this.orgId = data.orgId
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data])
        } else {
          this.orgId = ''
          this.orgName = ''
          this.addForm.orgId = ''
        }
      },
      nodeClick (data, checked, node) {
        if (checked) {
          this.addForm.orgId = data.orgId
          this.addForm.orgName = data.orgName
          this.orgId = data.orgId
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data])
        } else {
          this.orgId = ''
          this.orgName = ''
          this.addForm.orgId = ''
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      columnChange: function (data) {
        this.tableHeader = data
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        return times
      },
      canSelected (row, index) {
        if (row.jobState === 'TCQX' || row.jobState === 'MDPB') {
          return 0
        } else {
          return 1
        }
      },
     /* handleSuccess (res, file) {
        this.addForm.picKey = res.key
        this.getImgUrl(res.key)
      }, */
      onUploadChange (file) {
        let fileName = file.name
        if (fileName && fileName.lastIndexOf('.') != -1) {
          let fileType = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
          this.uploadData.key = new Date().getTime() + fileType
        }
      },
      handleAvatarSuccess (res, file) {
        this.addForm.picKey = res.key
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      getImgUrl (key) {
        this.imageUrl = ''
        if (key) {
          Api.getUrl(key).then(data => {
            if (data) {
              this.imageUrl = data
              // this.fileList = [{url: data}];
            }
          })
        }
      },

      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.name = ''
        this.query.pageNum = 1
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      handleSizeChange1 (val) {
        this.query1.pageSize = val
        this.loadData()
      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let arr = this.listData
          arr.forEach(function (item) {
            item.delFlg = item.delFlg === '1' ? '停用' : '启用'
          })
          let param = {
            tableHead: this.tableHeader,
            data: arr
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '用户列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      }
    }
  }
</script>
