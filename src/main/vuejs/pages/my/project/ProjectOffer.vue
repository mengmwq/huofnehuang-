<template>
  <div>
    <!-- table -->
    <el-row class="sub-header">
      <el-col :span="12">
        <div  class="sub-title">正式报价：</div>
      </el-col>
      <el-col :span="12" class="text-right"  v-if="templateRadio" >
          <el-button type="primary" size="small" @click="priceTemplate('cancel')">
              取消报价模板
          </el-button>
          <el-button type="primary" size="small" @click="priceTemplate('add')">
              作为正式报价模板
          </el-button>
      </el-col>
    </el-row>
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}">
      <el-table-column label="" width="40">
        <template slot-scope="scope">
            <el-radio :label="scope.row.code" v-model="templateRadio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
        </template>
    </el-table-column>
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'isRegular'">
            {{scope.row.isRegular | offerRegularFilter}}
          </div>
          <div v-else-if="header.prop == 'applyStates'">
            {{scope.row.applyStates | approvalApplyStateFilter}}
          </div>
          <div v-else-if="header.prop == 'createDt'">
            {{scope.row.createDt | timeFormat}}
          </div>
          <div v-else-if="header.prop == 'offerDt'">
            {{scope.row.offerDt | timeFormat}}
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template slot-scope="scope">
          <!--没有提交申请的时候applyId没有值，设为正式之后，不能再提交申请-->
          <el-button type="primary" size="mini" v-if="!scope.row.applyId && stateId !=='045'" @click="dialogVisible = true;form.id = scope.row.id">提交申请</el-button>
          <router-link :to="{path: '/router/projectOfferPreview',  query: {targetId: scope.row.id}}">
            <el-button type="primary" size="mini">预览</el-button>
          </router-link>
          <el-button type="primary" size="mini" v-if="scope.row.applyStates == 1" @click="openDownLoadWin(scope.row)">下载</el-button>
          <!--提交了申请，审核通过了之后才会有设为正式的按钮-->
          <el-button type="primary" size="mini" v-if="stateId !=='045'"  @click="setZS(scope.row)">设为正式</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="page-box" justify="end">
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <el-dialog
      title="提交申请"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      size="tiny" top="12vh" width="30%">
      <div style="text-align: center">
        <el-form :model="form" ref="form" :rules="rules" label-width="100px">
          <el-form-item label="审批流程：" prop="approvalProcessId">
                  <el-select  v-model="form.approvalProcessId" placeholder="请选择审批流程" size="medium" style="width:100%" @click.native="showSelectApproval">
                    <el-option :label="form.approvalProcessName" :value="form.approvalProcessId"></el-option>
                  </el-select>
                </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remarks" :rows="4" maxlength="500" show-word-limit></el-input>
          </el-form-item>
          <div style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelApply('form')">取 消</el-button>
            <el-button type="primary" size="small" @click="offerApply('form')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      title="下载报价pdf"
      :close-on-click-modal="canClick"
      :visible.sync="downLoadDialogVisible"
      @close="radio='1'"
      size="tiny" top="12vh" width="30%">
      <div style="text-align: center">
        <div>
          <el-radio v-model="radio" label="1">中文报价明细</el-radio>
          <el-radio v-model="radio" label="2">英文报价明细</el-radio>
        </div>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="downLoadDialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="sureDownLoad">确 定</el-button>
        </div>

      </div>
    </el-dialog>
    <SelectApprovalProcess v-if="isShowProcessDialog" :isShowDialog="isShowProcessDialog" @closeDialog="closeDialog" category="3"  @confirmProcess="confirmProcess"></SelectApprovalProcess>
  </div>
</template>


<script>
  import Api from '@/api/index'
  import moment from 'moment'

  import SelectApprovalProcess from '@/pages/work/SelectApprovalProcess'
  export default {
    components:{
      SelectApprovalProcess
    },
    props: {
      id: String,
      type: String,
      stateId:String,
    },
    watch: {
      id: function (value) {
        this.query.projectCode = value;
        this.loadData();
      },
      type: function (value) {
        this.projectType = value
      },
      stateId: function (value) {
        this.stateId = value
      }
    },
    data () {
      return {
        isShowProcessDialog:false,
        radio: '1',
        canClick: false,
        flag: false, //设为正式按钮隐藏、显示
        projectCode: '',
        projectType: '',
        dialogVisible: false,
        downLoadDialogVisible: false,
        form: {
          approvalProcessId:'',
          approvalProcessName:''
        },
        //stateId:'',
        query: {
          pageSize: 10,
          pageNum: 1,
          projectCode: '',
        },
        tableHeader: [{
          prop: 'code',
          label: '正式报价编号',
          width: '120',
          show: true
        }, {
          prop: 'applyStates',
          label: '审批状态',
          align: 'center',
          show: true
        }, {
          prop: 'approvalName',
          label: '审批人',
          align: 'center',
          show: true
        }, {
          prop: 'positionName',
          label: '审批岗位',
          align: 'center',
          show: true
        }, {
          prop: 'quotation',
          label: '报价人',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'isRegular',
          label: '标识',
          align: 'center',
          show: true
        }, {
          prop: 'groupName',
          align: 'center',
          label: '预算组',
          width: '100',
          show: true
        }, {
          prop: 'createDt',
          label: '生成时间',
          align: 'center',
           width: '150',
          show: true
        }, {
          prop: 'offerDt',
          align: 'center',
          label: '正式报价时间',
          width: '150',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        // 审批流程列表
        shenPiList: [],
        templateSelection:null,
        templateRadio:false,
        rules: {
          approvalProcessId: [
            {required: true, message: "请选择审批流程", trigger: "change"}
          ],
        }
      }
    },
    mounted () {
      this.loadApprovalDefinitionList();
    },
    methods: {
      closeDialog(){
        this.isShowProcessDialog =false
      },
        //确认审批流程
      confirmProcess(processInfo){
        console.log(processInfo)
        this.form.approvalProcessName = processInfo.name
        this.form.approvalProcessId = processInfo.id
        this.closeDialog()
      },
      //显示审批流程
      showSelectApproval(){
        this.isShowProcessDialog = true;
      },
      //正式报价模板
      priceTemplate(flag){
         
         if(flag=='add'){
           const selected = this.templateSelection;
            if(selected){
              this.$emit('priceTemplateChange',selected)
            }
         }else if(flag=='cancel'){
            this.templateSelection=null,
            this.templateRadio=false,
            this.$emit('priceTemplateChange','')
         }
      },
      //选中模板
      getTemplateRow(index,row){ //获取选中数据
          this.templateSelection = row;
      },
      /**
       * 打开下载弹框
       * */
      openDownLoadWin (item) {
        this.currentItem = item
        this.downLoadDialogVisible = true
      },
      sureDownLoad () {
        //flag: true英文 false中文
        let str = this.radio === '1' ? '中文' : '英文'
        let param = {
          offerId: this.currentItem.id,
          flag: !(this.radio === '1')
        }
        Api.offerExport(param).then(res => {
          if (res) {
            let reader = new FileReader()
            reader.readAsDataURL(res)
            reader.onload = (e) => {
              let a = document.createElement('a')
              a.download = str+ '报价明细.pdf'
              a.href = e.target.result
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          }
          this.downLoadDialogVisible = false
        })
      },

      /**
       * 加载审批流程
       */
      loadApprovalDefinitionList () {
        Api.approvalList({category: '3'}).then(data => {
          this.shenPiList = data;
        }).finally(() => {
          this.listLoading = false
        })
      },
      /**
       * 正式报价
       */
      loadData () {
        this.listLoading = true;
        Api.pageWithProjectCode(this.query).then(res => {
          if (res) {
            this.listData = res.records;
            this.total = res.total
          }
          this.listLoading = false
        });
      },
      /**
       * 设为正式
       * @param item
       */
      setZS (item) {
        if (item.isRegular ==='1') {
          this.$notify.success({
            title: '提示',
            message: `【${item.code}】已经为正式报价了`
          });
          return
        }
        this.$confirm(`您确认将【${item.code}】设为正式吗？`, "提示", {
          type: "warning"
        }).then(() => {
          Api.offerChangeState({
            id: item.id
          }).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '设为正式成功'
              });
              this.flag = true
              this.loadData()
            }
          })
        }).catch(err => {});
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
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
      /**
       * 提交申请
       */
      offerApply (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Api.offerApply(this.form).then(data => {
              if (data) {
                this.$notify.success({
                  title: '提示',
                  message: '提交申请成功'
                });
                this.dialogVisible = false
                this.loadData();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      cancelApply (formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>
  
  .sub-title {
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
  }
</style>

