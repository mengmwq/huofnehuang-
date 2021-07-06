<template>
  <div>
    <div style="margin: 20px 0">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" size="medium" v-showBtn data-authorityType="addExamine-btn" @click="dialogVisible2 = true;operate='add'" icon="el-icon-plus">添加审批流程</el-button>
        </el-col>
        <el-col :span="20" class="text-right" style="float: right;">
          <el-input size="medium" suffix-icon="el-icon-search" clearable placeholder="请输入流程名称" icon="search"
                    v-model="query.name" @keyup.enter.native="loadData" style="width: 200px;"></el-input>
          <el-button type="primary" size="medium" @click="loadData" class="btnTop">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading"
                :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"
                         :label="header.label" :sortable="header.sortable"
                         :formatter="header.formatter"
                         :align="header.align" :min-width="header.width" :column-key="header.prop"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'categoryStr'">
              {{scope.row.categoryStr}}
            </div>
           
           <div v-else-if="header.prop == 'name'">
              <a href="javascript:;"  @click="view(scope.row)"> {{scope.row.name}}</a>
            </div>
            <div v-else-if="header.prop == 'createDt'">
              {{scope.row.createDt | timeFormat}}
            </div>
            <div v-else-if="header.prop == 'updateDt'">
              {{scope.row.updateDt | timeFormat}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>

        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" v-if="tabIndex === 1">
          <template slot-scope="scope">
            <!--<router-link :to="{path: '/router/editAntique'}">-->
            <!--<el-button v-if="tabIndex===1" type="primary" size="mini">编辑</el-button>-->
            <!--</router-link>-->
            
            <el-button v-if="tabIndex===1" type="primary" size="mini" v-showBtn data-authorityType="editExamine-btn" @click="editShenPi(scope.row)">编辑</el-button>
            <el-button v-if="tabIndex===1" type="primary" size="mini" v-showBtn data-authorityType="deleteExamine-btn" @click="del(scope.row)">删除</el-button>
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

        <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
      </el-row>
    </div>
    <!--查看审批流程-->
    <el-dialog
      title="查看审批流程"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible"
      width="50%">
      <el-row>
        <el-col :span="8">
          <span>流程名称：</span><span>{{a.name}}</span>
        </el-col>
        <el-col :span="8">
          <span>流程分类：</span><span>{{a.category | approvalCategoryFilter}}</span>
        </el-col>
        <el-col :span="8">
          <span>流程描述：</span><span>{{a.describe}}</span>
        </el-col>
      </el-row>
      <h4> 审批流程:</h4>
      <el-row class="text-center">
        <el-col :span="24">
          <el-steps :active="1" finish-status="success" simple >
            <el-step v-if="a.tag === 'position'" :title="item.positionName" v-for="(item, index) in a.positionApprovals" :key="index"></el-step>
            <el-step v-if="a.tag === 'user'" :title="item.userName" v-for="(item, index) in a.personApprovals" :key="index"></el-step>
          </el-steps>
        </el-col>
      </el-row>

      <!-- <br>
      <div class="dialog-footer">
        <p class="text-right">
          <el-button type="primary" size="medium" @click="dialogVisible=false" style="width: 100px;" class="btnTop">取消</el-button>
          <el-button type="primary" size="medium" @click="dialogVisible=false" style="width: 100px;" class="btnTop">确认</el-button>
        </p>
      </div> -->
    </el-dialog>
    <!--增加审批流程-->
    <el-dialog
      :title="operate=== 'add' ? '增加审批流程': '编辑审批流程'"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible2"
      @close="clearForm"
      width="80%">
      <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="流程名称：" prop="name">
              <el-input v-model="form.name" clearable placeholder="手动填写"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程分类：" prop="category">
              <el-select filterable v-model="form.category" clearable placeholder="合同审批" size="medium" style="width: 100%;">
                <el-option
                  v-for="item in approvalCategory"
                  :key="item.value"
                  :label="item.cnInfo"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程描述：" prop="describe">
              <el-input v-model="form.describe" clearable placeholder="手动填写"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理层使用：">
              <el-switch
                v-model="form.level"
                active-value="1" inactive-value="0"
                active-color="#13ce66"
                inactive-color="#aaa"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="8" v-if="tabType === 1 ">所属部门：</el-col>
          <el-col :span="16" class="text-left" style="padding-left: 15px;">
            <el-button-group>
              <el-button :type="tabType === 1 ? 'primary' : 'default'" @click="loadTreeData" size="mini">审批人</el-button>
              <el-button :type="tabType === 2 ? 'primary' : 'default'" @click="loadPositionData" size="mini">职位</el-button>
            </el-button-group>
          </el-col>
        </el-row><br/>
        <el-row>
          <el-col  v-if="tabType === 1"  :span="8" style="border-color: #909399;overflow-y: auto;height: 400px;">
            <el-tree
              v-show="tabType === 1"
              class="filter-tree"
              :data="data2"
              :props="{label: 'orgName', children: 'childrens'}"
              default-expand-all
              @node-click="selectOrg"
              ref="tree2">
            </el-tree>

          </el-col>
          <el-col :span="tabType === 1?16:24" style="padding-left: 15px;" :class="{'postBox':tabType===2}" >
            <el-transfer v-model="definitionAppStepsReqs" :data="transferData" filterable target-order="push" :titles="['请选择', '审批顺序']" :props="{key: 'uId', label: 'uName'}"></el-transfer>
          </el-col>
        </el-row>
        <br>
        <div class="dialog-footer">
          <p class="text-right">
            审批人（审批流程从上至下）
          </p>
        </div>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible2=false">取 消</el-button>
          <el-button type="primary" size="small" @click="addApproval('form')">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import moment from 'moment'
  import Api from '@/api/index'
  import * as filters from '@/filters/filter'
  export default {
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    data () {
      return {
        canClick: false,
        approvalCategory: JSON.parse(sessionStorage.getItem('dists')).ApprovalCategory.children,
        filterText: '',
        data2: [],
        a:{},
        tabType: 1,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        operate: '',
        dialogVisible: false,
        dialogVisible2: false,
        type: '',
        definitionAppStepsReqs: [],
        form: {},
        rules: {
          name: [
            {required: true, message: "请填写流程名称", trigger: "blur"}
          ],
        },
        transferData: [],
        editForm: {
          reason: ''
        },
        query: {
          name: '',
          pageNum: 1,
          pageSize: 10
        },
        tableHeader: [{
          prop: 'name',
          label: '流程名称',
          align: 'left',
          show: true
        }, {
          prop: 'categoryStr',
          label: '流程分类',
          align: 'center',
          show: true
        }, {
          prop: 'describe',
          label: '流程描述',
          align: 'left',
          show: true
        }, {
          prop: 'approvalStr',
          label: '审批人（审批人从左到右）',
          width:'200',
          align: 'left',
          show: true
        }, {
          prop: 'createDt',
          label: '创建时间',
          align: 'center',
          width:'160',
          show: true
        }, {
          prop: 'updateDt',
          label: '更新时间',
          width:'160',
          show: true,
          align: 'center'
        }],
        /** 表格数据 */
        listData: [],
        multipleSelection: [],
        positionListData: [],
        /** 总数据数 */
        total: 10,
        /** 表格 loading */
        listLoading: false,
        tabIndex: 1
      }
    },
    mounted () {
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.data2 = data
      })

      this.loadData()
    },
    methods: {
      clearForm() {
        this.form = {
          name: '',
          category: '',
          describe: '',
          level: 0,
        }
        this.tabType = 1;
        this.definitionAppStepsReqs = []
        this.transferData = []
      },
      loadTreeData() {
        this.tabType = 1
        this.definitionAppStepsReqs = []
        this.transferData = []
      },
      loadPositionData () {
        this.tabType = 2
        this.definitionAppStepsReqs = []
        this.getPositionList()
        this.dataFillBack(this.form)

      },
      getPositionList () {
        let _this = this
        Api.getPositionPage({pageNum: 1, pageSize: 50000}).then(data => {
          this.positionListData = data.records
          if (this.positionListData.length > 0) {
            this.positionListData.forEach(function (item) {
              _this.$set(item, 'uId', item.positionId)
              _this.$set(item, 'uName', item.positionName)
            })
            this.transferData = this.positionListData
          }
        })
      },


      view (item) {
        this.dialogVisible = true
        Api.detailApproval({id:item.id}).then((res) => {
          if (res) {
            if (res.type === '1') {
              this.$set(res, 'tag', 'position')
            } else {
              this.$set(res, 'tag', 'user')
            }
            this.a = res

          }
        })
      },
      changeTabData (index) {
        this.tabIndex = index
      },
      /**
       * 加载数据
       */
      loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        let _this = this
        Api.approvalDefinitionPage(this.query).then(data => {
          if (data) {
            this.listData = data.records;
            //categoryStr
            this.listData.forEach(function (item) {
              _this.$set(item, 'categoryStr', filters.approvalCategoryFilter(item.category))
            })
            this.total = data.total;
          }
        }).finally(() => {
          this.listLoading = false
        })
      },
      /** 添加 */
      newApply: function () {
        this.$router.push({path: '/router/AddAntique'})
      },
      /** 编辑 */
      editor: function () {
        this.$router.push({path: '/router/AddAntique'})
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 驳回
       * */
      dealIncome (item) {
        this.currentItem = item
        this.dialogVisible = true
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
      /**
       * 重置筛选条件
       * */
      cleanFilters () {
        this.keyword = ''
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
      /**
       * 打开对话框
       */
      editShenPi(data) {
        this.operate = 'edit'
        this.dialogVisible2 = true;
        this.getPositionList()
        Api.detailApproval({id: data.id}).then(data => {
          if (data) {
            this.form = data;
            this.dataFillBack(this.form)
          }
        })
      },
      dataFillBack (data) {
        let _this = this
        if (data.personApprovals) {
          this.tabType = 1
          data.personApprovals.forEach(function (item) {
            _this.$set(item, 'uId', item.userId)
            _this.$set(item, 'uName', item.userName)
            _this.definitionAppStepsReqs.push(item.userId)
          })

        } else {
          this.tabType = 2
          let _this = this
          if (this.positionListData.length > 0) {
            this.positionListData.forEach(function (item) {
              _this.$set(item, 'uId', item.positionId)
              _this.$set(item, 'uName', item.positionName)
            })
            this.transferData = this.positionListData
          }
          if(data.positionApprovals){
              data.positionApprovals.forEach(function (item) {
              _this.$set(item, 'uId', item.positionId)
              _this.$set(item, 'uName', item.positionName)
              _this.definitionAppStepsReqs.push(item.positionId)
            })
          }
          

        }
      },
      /**
       * 删除
       */
      del (data) {
        this.$confirm('您确定要删除【' + data.name + '】吗?', '提示').then(() => {
          Api.delApproval({id: data.id}).then(data => {
            if (data) {
              this.loadData();
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
            }
          })
        })
      },
      /**
       * 选择部门
       */
      selectOrg (data) {
        this.form.orgIds = [data.orgId];
        Api.getUserListByOrgId({
          orgId: data.orgId
        }).then(data => {
          if (data) {
            this.transferData = this.transferData.concat(data)
            this.transferData = this.uniqueObjArr(this.transferData)
          }

        })
      },
      uniqueObjArr (arr) {
        let result = [];
        let obj = {};
        for(let i =0; i<arr.length; i++){
          if(!obj[arr[i].uId]){
            result.push(arr[i]);
            obj[arr[i].uId] = true;
          }
        }
        return result;
      },
      /**
       * 添加审批
       */
      addApproval (formName) {
        if (this.definitionAppStepsReqs == 0) {
          this.$notify.warning({
            title: '提示',
            message: '您还没有定义审批人员顺序'
          })
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.definitionAppStepsReqs = [];
            if (this.tabType === 1) {
              this.form.type = 0;
              this.definitionAppStepsReqs.forEach(item => {
                this.form.definitionAppStepsReqs.push({
                  userId: item
                })
              });
            } else {
              this.form.type = 1;
              this.definitionAppStepsReqs.forEach(item => {
                this.form.definitionAppStepsReqs.push({
                  positionId: item
                })
              });
            }
            if (this.form.id) {
              Api.updateApproval(this.form).then(data => {
                if (data) {
                  this.form = {};
                  this.dialogVisible2 = false;
                  this.loadData();
                  this.$notify.success({
                    title: '提示',
                    message: '修改成功'
                  })
                }
              })
            } else {
              Api.addApproval(this.form).then(data => {
                if (data) {
                  this.form = {};
                  this.dialogVisible2 = false;
                  this.loadData();
                  this.$notify.success({
                    title: '提示',
                    message: '添加成功'
                  })
                }
              })
            }
          } else {
          this.$message('请完善表单')
        }
      })

      },
      /**
       * 导出excel
       */
      exportExcel () {
        if (this.listData.length > 0) {
          let param = {
            tableHead: this.tableHeader,
            data: this.listData
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '审批列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      },
    }
  }
</script>
<style lang="scss">
  .postBox .el-transfer-panel{
    width:470px;
  }
</style>
<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .item {
    margin: 10px 0
  }

  .item .item-title {
    display: inline-block;
    width: 160px;
    text-align: right;
  }
  
</style>
