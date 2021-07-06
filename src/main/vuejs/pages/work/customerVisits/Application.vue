<template>
  <div>
    <div class="mt10" v-if="flag==='list'">
        <el-button type="primary" size="small"  @click="editItem('add')">添加</el-button>
        <el-button type="primary" size="small"  @click="deleteItem">删除</el-button>
    </div>
    <el-row>
      <el-table
        class="page-table mt10"
        v-if="tableStatus"
        :data="approvalProductPage && approvalProductPage.result"
        stripe
        highlight-current-row
        v-loading="listLoading"
        max-height="400"
        :cell-style="{color:'#333'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <template v-for="(header, index) in tableHeader">
          <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :min-width="header.width"
          :column-key="header.prop"
          show-overflow-tooltip>
        
          <template slot-scope="scope">
            <div v-if="header.prop == 'productName'">
               <a href="javascript:;" @click="showApprovalDetails(scope.row)">{{scope.row.productName}}</a>
            </div>
            <div v-else-if="header.prop == 'schedule'">
                <a href="javascript:;" @click="showJobApplicationAdd(scope.row)" :class="getStyle(scope.row.states)">{{scope.row.schedule}}</a>
            </div>
            <div v-else-if="header.prop == 'priceRange'" >
                {{scope.row.priceMin}}
                <template v-if="scope.row.priceMax">
                  ~ {{scope.row.priceMax}}
                </template>/人起
            </div>
             <div v-else-if="header.prop == 'museumNames'">
            	<template v-if="scope.row.museumNames">
                 {{scope.row.museumNames.toString()}}
              </template>
            </div>
            <div v-else-if="header.prop == 'openingMonth'">
              <template v-if="scope.row.museumNames">
                {{scope.row.openingMonth.toString()}}月
              </template>
            	 
            </div>
            
            <div v-else-if="header.prop == 'createAt'">
            	 {{getFormatTime(scope.row.createAt)}}
            </div>
            <div v-else-if="header.prop == 'approvalTime'">
            	 {{getFormatTime(scope.row.approvalTime)}}
            </div>
            <div v-else-if="header.prop == 'status'">
              <template v-if="scope.row.attached">
                {{scope.row.attached.ContractTemplateStatus_cnInfo}}
              </template>
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        </template>
        <el-table-column label="操作" width="70" fixed="right">
          <template slot-scope="scope" style="background:#fff">
           <el-button type="primary" v-if="flag==='list'" size="mini"  @click="editItem('edit',scope.row)">编辑</el-button>
           <el-button type="primary" v-if="flag==='details'" size="mini"  @click="editItem('details',scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="remark mt10" v-if="flag==='list'">
          <el-input v-model.trim="editForm.remark" show-word-limit :maxlength="60" placeholder="请输入备注，非必填"></el-input>
          <el-button type="primary" class="ml10"  @click="editItem(scope.row)">提交</el-button>
      </div>
      <template v-if="flag==='details'"> 
         <div v-if="editForm.remark">
           <strong>备注：</strong>
          {{editForm.remark}}
         </div>
      </template>
    </el-row>
  </div>
</template>
<script>
import Api from '@/api/index'
import Util from '@/utils/'
import {Format} from '@/utils/TimeFormat'
export default {
  props:{
     flag:{
       type:String,
       default:'list'
     }
  },
  computed: {
    // 待审批数量
    approvalCount () {
      const approvalCount = this.$store.state.approval.approvalCount
      return approvalCount
    },
    approvalProductPage () {
      const approvalProductPage = this.$store.state.approval.approvalProductPage
      return approvalProductPage
    }
  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      userInfo: userInfo,
      listLoading: false,
      sels: [],
      editForm: {
        remark: '',
        jobs: []
      },
      searchForm: {
        pageNumber: 1,
        pageSize: 20,
        keywords: '',
        states: 2,
        userId: userInfo.id,
        // createUser2bId:'',
        createOrgId: '',
        targetType: 0
      },

      tableStatus: true,
      tableHeader: [
        {
          prop: 'orgName',
          label: '客户单位',
          width: '120',
          show: true
        },
        {
          prop: 'customerName',
          label: '客户名称',
          width: '120',
          show: true
        },{
          prop: 'customerName',
          label: '客户职位',
          width: '120',
          show: true
        },
        {
          prop: 'mobile',
          label: '联系电话',
          width: '120',
          show: true
        },

        {
          prop: 'visitDate',
          label: '拜访日期',
          width: '90',
          show: true
        },
        {
          prop: 'cost',
          label: '费用',
          width: '120',
          show: true
        },
        {
          prop: 'createName',
          label: '申请人',
          width: '70',
          show: true
        },
        {
          prop: 'userName',
          label: '提报人',
          width: '120',
          show: true
        }
      ]
    }
  },
  mounted () {
    const curTab = sessionStorage.getItem('curProductApprovalTab')
    if (curTab) {
      this.curTab = curTab
    }
    this.search()
    //this.getApprovalOrgList()
  },

  methods: {
    handleSelectionChange (val) {
      this.sels = val
    },
    // 显示审批进度
    showJobApplicationAdd (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.isShowDialog = true
    },
    closeDialog () {
      this.isShowDialog = false
    },
    // 审批组织下拉列表
    getApprovalOrgList (query = '') {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        const params = {
          pageNumber: 1,
          pageSize: 10,
          createOrgName: query,
          targetType: 0, // 请审批类型0;策划;1:活动;
          userId: this.userInfo.id
        }
        Api.getApprovalOrgList(params).then(res => {
          this.approvalOrgList = res.result
        })
      }, 200)
    },
    // 撤回审批
    cancleApproval (row) {
      console.log(row)
      const nameStr = row.productName
      this.$prompt('请输入理由', `撤回产品【${nameStr}】`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '最大长度200个字符！',
        inputPattern: /^.{2,200}$/,
        inputErrorMessage: '最大长度200个字符！'
      }).then(({ value }) => {
        console.log(value)
          // 输入修改原因；
        const params = {
          reason: value,
          approvalInfoId: row.approvalInfoId,
          targetId: row.targetId,
          targetType: row.targetType,
          userId: this.userInfo.id
        }
        Api.updateApprovalProcessWithdraw(params).then((res) => {
          this.getApprovalProductPage()
          this.$message({showClose: true, message: `产品【${nameStr}】撤回申请成功`, type: 'success'})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
     // 提交审批
    sumbitApproval (row) {
      console.log(row)
      const nameStr = row.productName
      this.$prompt('请输入理由', `申请产品【${nameStr}】`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '最大长度200个字符！',
        inputPattern: /^.{2,200}$/,
        inputErrorMessage: '最大长度200个字符！'
      }).then(({ value }) => {
        console.log(value)
          // 输入修改原因；
        const params = {
          applicationReasons: value,
          approvalInfoId: row.approvalInfoId,
          targetId: row.targetId,
          targetType: row.targetType,
          userId: this.userInfo.id,
          states: row.states
        }
        Api.updateAgainApprovalProcess(params).then((res) => {
          this.getApprovalProductPage()
          this.$message({showClose: true, message: `产品【${nameStr}】提交申请成功`, type: 'success'})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    getStyle (status) {
        // 0：拒绝 1：批准 2：审批中3:撤回
      if (status === 1) {
        return {'text-success': true}
      } else if (status === 0) {
        return {'text-danger': true}
      }
    },
    // 审批详情页面
    showApprovalDetails (row) {
      this.$router.push({
        path: '/router/approvalProductDetails',
        query: {
          approvalInfoId: row.approvalInfoId,
          targetId: row.targetId,
          processId: row.processId
        }
      })
    },
    dataChange () {
      this.closeDialog()
      this.search()
    },

    handleTabs (item) {
      this.curTab = item
      sessionStorage.setItem('curProductApprovalTab', item)
      if (item == '我发起的') {
        this.searchForm.createUser2bId = this.userInfo.id
        this.searchForm.states = null
      } else {
        this.searchForm.createUser2bId = ''
      }
      if (item === '已同意' || item === '已驳回') {
        this.searchForm.states = 1
         // 驳回原因
        if (item === '已驳回') {
          this.searchForm.states = 0
          this.tableHeader[11].show = true
        } else {
          this.tableHeader[11].show = false
        }
         // 处理显示审批人，审批时间
        this.tableHeader[9].show = true
        this.tableHeader[10].show = true
         // 将进度隐藏
        this.tableHeader[8].show = false
      } else if (item === '我发起的' || item === '待审批') {
          // 处理进度显示
        if (item === '待审批') {
          this.searchForm.states = 2
          this.tableHeader[8].show = false
        } else {
          this.tableHeader[8].show = true
        }
         // 隐藏审批人，审批时间
        this.tableHeader[9].show = false
        this.tableHeader[10].show = false
        this.tableHeader[11].show = false
      }
      this.search()
    },
    // 提交启用与停用协议
    submitAgreementStatus (row, statusName) {
      console.log(row)

      this.$confirm(
        `您确定要将协议【${row.name}】的状态置为${statusName}吗？`,
        `${statusName}提示`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const params = {
            id: row.id
          }
          const fn = statusName == '启用' ? 'updateContractTakeEffectTemplate' : 'updateContractTemplateInvalid'
          // 请求接口处理；
          Api[fn](params).then(res => {
            this.search()
            this.$notify.success({
              title: '操作提示',
              message: `协议【${row.name}】状态修改成功！`
            })
          })
        })
        .catch(err => {})
    },
    // 批量删除协议
    deleteItem (item) {
      const selected = this.sels
      if (selected.length == 0) {
        this.$notify.warning({
          title: '删除提示',
          message: '请至少选择一条的记录！'
        })
        return
      }
      const nameStr = selected.map(item => item.name)
      this.$confirm(`您确定要删除岗位名称【${nameStr}】吗?`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = selected.map(item => item.id)
        Api.deleteYXContractTemplates(params).then(res => {
          if (res) {
            if (this.approvalProductPage.result.length == selected.length) {
              this.searchForm.pageNumber = 1
            }
            this.search()
            this.$notify.success({
              title: '删除提示',
              message: `岗位名称【${nameStr}】删除成功`
            })
          }
        })
      }).catch(() => {})
    },
    // 编辑
    editItem (flag, row) {
      const  query = flag==='add'?null:{id: row.id}
      let path = 'addCustomerVisits'
      if (flag === 'edit') {
        path = 'editCustomerVisits'
      }else if (flag === 'details') {
        path = 'customerVisitsDetails'
      }
      this.$router.push({
        path: '/router/'+path,
        query: query
      })
    },
    getFormatTime (time, format = 'yyyy-MM-dd hh:mm:ss') {
      return time ? Format(time, format) : ''
    },
    /** 处理拓展行 */
    handleExpandChange (row, expandedRows) {
      let params = this.searchFormVersion
      params.templateId = row.id,
          params.type = row.type,

        this.listLoading = true
      Api.getYXContractTemplateHistoryList(params).then(res => {
        this.listLoading = false
        row.children = res
          // row.templateVersionPage = res;
      })
    },
    /** 设置运营管理员 */
    setOperationSpecialist (type) {
      const selected = this.sels
      const len = selected.length

      if (len == 0) {
        this.$notify({
          message: '请至少选择一条记录',
          type: 'error'
        })
        return false
      } else {
        const sName = selected.map(item => item.name).toString()
        let msg = ''
        if (type == 1) {
          msg = `确认要将【${sName}】设置为管理员吗？`
        } else if (type == 0) {
          msg = `确认要将【${sName}】设置为普通组员吗？`
        } else if (type == 2) {
          msg = `确认要将【${sName}】设置为社区管理员吗？`
        }
        this.$confirm(msg, '提示', {
          type: 'warning'
        })
        .then(() => {
          // this.listLoading = true;
          const userIds = selected.map(item => item.userId)
          const params = {
            userIds: userIds,
            roleType: type
          }
          Api.updateKidsUserRoleType(params).then(res => {
            this.getApprovalProductPage()
            // this.listLoading = false;
              // this.$message({showClose:true, message:`停用会员【${userName}】成功`, type:'success'});
          })
        })
        .catch(() => {})
      }
    },

    /**
     * 过滤器 【通过缓存】 取了一个KEY（String） 取了需要过滤的条件（对应的值）
     */
    getfilters (filter) {
      if (filter !== 'false') {
        if (sessionStorage.getItem('dists')) {
          var dists = JSON.parse(sessionStorage.getItem('dists')) // 得到dists对象
          var filterName = dists[filter]
          var filterChildren = filterName.children
          var Filter = []
          for (var i = 0; i < filterChildren.length; i++) {
            Filter.push({
              text: filterChildren[i].cnInfo,
              value: filterChildren[i].value
            })
          }
        }
        return Filter
      }
    },

    /**
     * 过滤器POST 到后台一个【map】进行查询 key：String val：list[1,2]
     */
    handleFilterChange (filter) {
      var FilterObject = Object.values(filter)[0]
      if (!this.searchForm.filterMap) {
        this.searchForm.filterMap = {}
      }
      var mapkey = Object.keys(filter)[0]
      if (FilterObject.length > 0) {
        // 【写入Map】key：mapkey  val：FilterObject;
        this.searchForm.filterMap[mapkey] = FilterObject
      } else {
        // 【Map删除】mapkey;
        delete this.searchForm.filterMap[mapkey]
      }
      console.log(this.searchForm.filterMap)
      this.search()
    },

    /**
     * 通过出生日期获取年龄
     */
    getAgeByBirthday (birthday) {
      return Util.getAgeByBirthday(birthday)
    },
    /**
     * 获取字典名称
     */
    getDictsKeyName (row, key, val) {
      return Util.getDictsKeyName(row, key, val)
    },
    /***
     * 表头切换
     */
    columnChange (data) {
      console.log('++++++++++++++++++【表头切换】触发++++++++++++++++++++++++')
      this.tableHeader = data
    },
    /**
     * 表头拖拽状态改变
     */
    tableStatusChange (val) {
      console.log(
        '++++++++++++++++++【表头拖拽状态改变】触发++++++++++++++++++++++++'
      )
      this.tableStatus = val
    },
    /**
     * 表格改变
     */
    dataChange () {
      this.getApprovalProductPage()
      this.closeDialog()
    },

    /**
     *  重设密码，打开弹窗
     */
    resetPassword (row) {
      this.editForm = Object.assign({}, row)
      this.isShowDialog = true
    },
    refresh () {
      this.search()
    },
    // 处理我发起的与其他审批区分开
    handleSearch (params) {
      if (this.curTab === '我发起的') {
        console.log(this.curTab, 'this.curTab')
        this.$store.dispatch('getMyApprovalProductPage', params)
      } else {
        this.$store.dispatch('getApprovalProductPage', params)
      }
    },
    // 查询
    search () {
      let params = this.searchForm
      params.pageNumber = 1
      console.log(params, 'sss')
      this.handleSearch(params)
    },

    selsChange (sels) {
      this.sels = sels
    },
    getApprovalProductPage () {
      let params = this.searchForm
      this.handleSearch(params)
    },
    handleSizeChange (val) {
      let params = this.searchForm
      params.pageSize = val
      this.handleSearch(params)
    },
    handleCurrentChange (val) {
      let params = this.searchForm
      params.pageNumber = val
      this.handleSearch(params)
    },

    /**
     * 显示编辑界面
     */
    handleEdit (index, row) {
      this.editForm = Object.assign({}, row)
      this.$router.push({
        path: '/router/roleedit',
        query: { roleID: this.editForm.id }
      })
    },
    columnChange (data) {
      this.tableHeader = data
    },

    // 表格排序变化
    sortChange ({ column, prop, order }) {
      if (order) {
        var s = order.substring(0, 1)
        var sOrder = 'asc'
        if (s == 'd') {
          sOrder = 'desc'
        }
        this.searchForm.sort = prop + ' ' + sOrder
        this.searchForm.pageNumber = 1
        console.log(
          '++++++++++++++++++【表格排序变化】触发++++++++++++++++++++++++'
        )
        this.search()
      }
    }

  }
}
</script>
<style lang="scss" scoped>
    .remark{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>

