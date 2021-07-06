<template>
  <div>
      <!-- 操作栏 -->
      <el-row :gutter="20" class="m10">
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="small"  v-showBtn data-authorityType="add-btn" @click="add" icon="el-icon-plus">新增</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table class="page-table" :data="listData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
       <template slot-scope="scope">
            <div v-if="header.prop === 'time'">
              {{scope.row.time | timeFormat}}
            </div>
            <div v-else-if="header.prop == 'currency'">
              {{scope.row.currency | currencyFilter}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" >
          <template slot-scope="scope" >
            <el-button type="primary" size="mini" @click="edit(scope.row)" v-showBtn data-authorityType="update-btn" class="btnTop">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteItem(scope.row)" v-showBtn data-authorityType="delete-btn" class="btnTop">删除</el-button>
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
      :title="operateFlag === 'add' ? '增加' : '编辑'"
      :before-close = "closeDialog"
      :visible.sync="JobDialog"
      :close-on-click-modal="canClick"
      size="tiny" top="12vh" width="50%">
      <div>
        <el-form :model="form" ref="form" :rules="rules" class="demo-form-inline" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间" prop="maintainDate">
                <el-date-picker type="date" placeholder="选择时间"  v-model.trim="form.time" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="币种：">
                <el-select v-model.trim="form.currency" placeholder="请选择币种">
                  <el-option v-for="(item,index) in currencyList" :key="index" :label="item.cnInfo" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆类型:">
                <el-input v-model.trim="form.vehicleType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运费:">
                <el-input v-model.trim="form.freight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税点:">
                <el-input v-model.trim="form.taxPoint"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总金额:">
                <el-input v-model.trim="form.totalSum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remarks"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-table class="page-table" :data="form.routes" stripe highlight-current-row  :cell-style="{color:'#333'}">
            <el-table-column label="#" type="index" width="40"></el-table-column>
            <el-table-column v-for="(header, index) in goodsHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'startingPlace'">
                  <el-input v-model.trim="scope.row.startingPlace"></el-input>
                </div>
                <div v-else-if="header.prop == 'destination'">
                  <el-input v-model.trim="scope.row.destination"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="70">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addCusGoods"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteGoodsItem(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="text-center" style="margin-top: 20px">
          <el-button type="primary" size="small" @click="JobDialog=false">取 消</el-button>
          <el-button type="primary" size="small" @click="onSubmit()">确 定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment'
  import {TransportationManagement} from'@/model/TransportationManagement'
  import Api from '@/api/index'
  export default {
    data () {
      return {
        canClick: false,
        //添加和编辑标志
        operateFlag: '',
        //弹窗控制
        JobDialog: false,
        rules: {
          'tel': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^(1[3-9][0-9])[0-9]{8}$/, message: '请输入正确手机号' }
          ],
        },
        form:{
          id:'',
          time:'',
          vehicleType:'',
          freight:'',
          taxPoint:'',
          totalSum:'',
          currency:'',
          remarks:'',
          routes: [],
        },
        query: {
          pageSize: 10,
          pageNum: 1,
          projectCode:'',
          nameOrTel:'',     //根据手机号或姓名搜索
        },
        tableHeader: [{
          prop: 'time',
          label: '时间',
          align: 'center',
          show: true
        }, {
          prop: 'vehicleType',
          label: '车辆类型',
          align: 'center',
          show: true
        }, {
          prop: 'freight',
          label: '运费',
          align: 'center',
          show: true
        }, {
          prop: 'taxPoint',
          label: '税点',
          align: 'center',
          show: true
        }, {
          prop: 'totalSum',
          label: '总金额',
          align: 'center',
          show: true
        }, {
          prop: 'currency',
          label: '币制',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        goodsHeader: [{
          prop: 'startingPlace',
          label: '起始地',
          align: 'center',
          show: true
        }, {
          prop: 'destination',
          label: '目的地',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        multipleSelection: [],
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        props: {
          projectCode: String,
	    },
      }
    },
    mounted () {
        this.loadData()
    },
    computed: {
        currencyList() {
         return this.$store.state.dictionary.dists.Currency.children;
        },
    },
    methods: {
      /**加载**/
      loadData () {
        this.listLoading = true
        this.query.type = '1'
        Api.pageTransportationManagement(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },

      /**
       * 提交
       * */
      onSubmit () {
        if (this.operateFlag === 'add') {
          this.confirm()
        } else {
          this.editor()
        }
      },

      /**
       * 确定编辑
       * */
      editor () {
      	this.form.type = '1'
      	this.form.time = moment(this.form.time).format('YYYY-MM-DD')
        Api.updateTransportationManagement(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
            this.JobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },

      /** 确认添加 */
      confirm: function () {

      	this.form.type = '1'
      	this.form.time = moment(this.form.time).format('YYYY-MM-DD')
        Api.addTransportationManagement(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            this.JobDialog = false
            // 重新渲染页面数据
            this.loadData()
          }
        })
      },

      /**
       * 删除（停用）信息
       * */
      deleteItem (item) {
        this.$confirm('您确定要删除【' + item.time + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.removeTransportationManagement(param).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '删除成功'
              })
              this.loadData()
            } else {
              this.$notify.warning({
                title: '提示',
                message: '删除失败'
              })
            }
          })

        })
      },

      /**控制弹窗增加与编辑 */
      add () {
      	this.form = new TransportationManagement()
        this.JobDialog = true
        this.operateFlag = 'add'
      },
      closeDialog(){
        this.JobDialog = false;
      },
      edit (item) {
      	
        this.JobDialog = true
        this.operateFlag = 'edit'
        // this.editorDialog = true
        this.form = item
        this.form.routes = JSON.parse(item.routes);
      },
      addCusGoods () {
        let item = {
          startingPlace: '',
          destination:'',
        }
        if(!this.form.routes){
          this.form.routes = []
          this.form.routes.push(item)
        }else{
          this.form.routes.push(item)
        }
        
      },
      deleteGoodsItem(index){
       this.form.routes.splice(index,1)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      },
    }
  }
</script>

<style scoped>
</style>
