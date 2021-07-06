<template>
  <div>
    <div class="tabBox mb10">
        <div class="sys-tab">
            <div class="tab"  v-for="item in tabs" :key="item" :class="{'active': curTab === item}" @click="handleTabs(item)">
            <strong class="title" >
              {{item}}
              <template v-if="item==='待审批'">
                 ({{pendingApprovalCount}})
              </template>
            </strong>
        </div>
        </div>
        <div class="progressBox" v-if="curTab==='申请'">
            <div class="mr10">审批名称：{{approvalProcessInfo.approvalProcessName}}</div>
            <el-button type="primary" size="small" class="ml10" @click="isShowProcessDialog=true">选择流程</el-button>
        </div>
    </div>
    
  </div>
</template>
<script>
import Api from '@/api/index'
export default {
  components: {
  },
  computed: {
    // 待审批数量
    pendingApprovalCount () {
      const pendingApprovalCount = this.$store.state.approval.approvalCount
      return pendingApprovalCount
    }
  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      progressName: '',
      isShowDialog: false,   //审批进度
      isShowProcessDialog:false, //选择审批流程
      tabs: ['待我指派', '指派我', '我执行', '我发起', '已完成'],
      curTab: '待审批',
      userInfo: userInfo,
      contacterId: '',
      listLoading: false,
      sels: [],
      editForm:null,
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        approvalType:'005',
        approvalState:'2',  //  '1' 已审批 ，‘2’待审批 
        param: '', //申请名称或提报人姓名
        positionId:"f9acc921-a99d-40a5-acc9-21a99d40a53c",  //岗位ID,?
        state:3,   //审批状态
      },

      tableStatus: true,
      tableHeader: [
        {
          prop: 'name',
          label: '标题',
          width: '80',
          show: true
        },
        {
          prop: 'summary',
          label: '摘要',
          width: '140',
          show: true
        },
        {
          prop: 'ctUName',
          label: '申请人',
          width: '90',
          show: true
        },
        {
          prop: 'createDt',
          label: '申请时间',
          width: '100',
          show: true
        },
        {
          prop: 'updateDt',
          label: '完成时间',
          width: '90',
          show: false
        },
        {
          prop: 'progress',
          label: '审批进度',
          width: '50',
          show: true
        },
        {
          prop: 'status',
          label: '状态',
          width: '70',
          show: false
        },
        {
          prop: 'approvalTime',
          label: '审批时间',
          width: '90',
          show: false
        },
        {
          prop: 'approvalName',
          label: '审批人',
          width: '120',
          show: false
        },
        {
          prop: 'refuseReasons',
          label: '驳回原因',
          width: '90',
          show: false
        }
      ],
      listData:[],
      total:0
    }
  },
  mounted () {
    const curTab = sessionStorage.getItem('curApprovalTab')
    if (curTab) {
      this.curTab = curTab
    }
    this.search()
    //获取审批数量
    this.$store.dispatch('getApprovalCount',{states:2})
  },

  methods: {
    //申请列表数据改变
    applicationChange(){
       this.approvalProcessInfo = {
        approvalProcessName:'',
        approvalProcessId:'',
        remark:'',
        ids:[], //申请列表
      }
      this.search()
    },
    confirmProcess(processInfo){
      this.closeDialog()
      this.approvalProcessInfo.approvalProcessName = processInfo.name
      this.approvalProcessInfo.approvalProcessId = processInfo.id
    },
    search(){
      console.log('search1')
      const approvalTable = this.$refs.approvalTable
      this.$nextTick( ()=> {
         this.$refs.approvalTable.search()
      })
    },
    // 显示审批进度
    showApprovalProgress (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.isShowDialog = true
    },
    closeDialog () {
      this.isShowDialog = false
      this.isShowProcessDialog = false
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
      sessionStorage.setItem('curApprovalTab', item)
      if (item !== '申请') {
        // 处理表格列
        if (item === '待审批') {
          // 申请人
          this.tableHeader[2].show = true
          // 完成时间
          this.tableHeader[4].show = false
          this.$store.dispatch('getApprovalCount',{states:2})
        } else {
            // 已审批，我发起，抄送我
          // 申请人
          this.tableHeader[2].show = false
          // 完成时间
          this.tableHeader[4].show = true
        }
        this.search()
      }
      
    }

  }
}
</script>
<style lang="scss" scoped>

.tabBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .progressBox{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.sys-tab {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tab {
        background:#4d4d4d;
        margin-right:10px;
        padding:4px 30px;
        color:#fff;
        font-size:14px;
        cursor: pointer;
    }
    .active{
        background:#C1272D;
    }
    
}
</style>

