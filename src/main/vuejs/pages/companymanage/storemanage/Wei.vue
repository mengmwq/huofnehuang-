<template>
  <div>
    <el-row class="mb10">
        <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" v-showBtn data-authorityType="addWei-btn" icon="el-icon-plus" @click="addStoreDialog=true;operateFlag = 'add'">新增位</el-button>
        </el-col>
    </el-row>
    <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                         :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="header.prop == 'size'">
              {{scope.row.length}} x {{scope.row.wide}} x {{scope.row.high}}
            </div>
            <div v-else-if="header.prop == 'status'">
              {{scope.row.status | weiFilter}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" v-showBtn data-authorityType="editWei-btn" @click="editWei(scope.row)">编辑</el-button>
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
          :title="operateFlag === 'edit' ? '编辑位' : '新增位'"
          @close="cancelSubmit"
          :close-on-click-modal="canClick"
          :visible.sync="addStoreDialog"
          size="small" top="12vh" width="40%">
        <div>
            <el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
              <el-form-item label="所属柜:">
                <span>{{name}}</span>
              </el-form-item>
              <el-form-item label="位名称:" prop="name">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item label="位编号:" prop="code">
                <el-input v-model="addForm.code"></el-input>
              </el-form-item>
              <el-form-item label="位类型:">
                <el-input v-model="addForm.type"></el-input>
              </el-form-item>
              <el-form-item label="最大承重:">
                <el-input v-model="addForm.maxCapacity"></el-input>
              </el-form-item>
              <el-form-item label="位长宽高:">
                <el-input v-model="addForm.length" style="width: 120px"></el-input> x
                <el-input v-model="addForm.wide" style="width: 120px"></el-input> x
                <el-input v-model="addForm.high" style="width: 120px"></el-input>
              </el-form-item>
              <el-form-item v-if="operateFlag === 'edit'" label="状态:">
                <el-select filterable v-model="addForm.status"  clearable  style="width:100%" placeholder="状态">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.cnInfo" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <div class="text-center" style="margin-top: 20px">
                <el-button type="primary" size="small" @click="cancelSubmit('addForm')">取 消</el-button>
                <el-button type="primary" size="small" @click="submit('addForm')">确 定</el-button>
              </div>
            </el-form>
        </div>
    </el-dialog>
</div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    name: 'wei',
    data () {
      return {
        canClick: false,
        addStoreDialog: false,
        listData: [],
        addForm: {
          warehouseId: '',
          houseId: '',
          cabinetId: ''
        },
        query: {
          pageSize: 10,
          pageNum: 1
        },
        total: 0,
        operateFlag: '',
        tableHeader: [
          {prop: 'code', label: '柜位编号', width: '100', show: true},
          {prop: 'name', label: '柜位名称', width: '100', show: true},
          {prop: 'type', align: 'center', label: '柜位类型', show: true},
          {prop: 'maxCapacity', align: 'center', label: '最大承重', show: true},
          {prop: 'size', align: 'center', label: '柜位长宽高（m）', width: '180', show: true},
          {prop: 'status', align: 'center', label: '状态', show: true}
        ],
        statusList: [
          {cnInfo: '空位', value: '0'},
          {cnInfo: '入库核准中', value: '1'},
          {cnInfo: '满位', value: '2'},
          {cnInfo: '出库核准中', value: '3'},
          ],
        rules: {
          name: [
            { required: true, message: '请输入位名称', trigger: 'blur'},
          ],
          code: [
            { required: true, message: '请输入位编号', trigger: 'blur'},
          ],
        }
      }
    },
    props: {
      name: String,
      warehouseId: String,
      houseId: String,
      cabinetId: String
    },
    watch: {
      warehouseId: function (value) {
        this.addForm.warehouseId = value
      },
      houseId: function (value) {
        this.addForm.houseId = value
      },
      cabinetId: function (value) {
        this.addForm.cabinetId = value
        if (this.addForm.cabinetId) {
          this.loadData()
        }
      },
    },
    mounted () {
     // this.loadData()
    },
    methods: {
      /**
       * 查询柜下面的所有位列表
       * */
      loadData () {
        this.query.id = this.addForm.cabinetId
        Api.queryPageGrideListByCabinetId(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
      },
      editWei (item) {
        this.addForm = item
        this.operateFlag = 'edit'
        this.addStoreDialog = true
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operateFlag === 'edit') {
              Api.updateGrideInfoById(this.addForm).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '位修改成功'
                  })
                }
                this.loadData()
                this.addStoreDialog = false
                this.$emit('LoadTree')
              })
            } else {
              Api.addGrideInfo(this.addForm).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '位添加成功'
                  })
                }
                this.loadData()
                this.addStoreDialog = false
                this.$emit('LoadTree')
              })
            }

          } else {
            return false;
          }
        });
      },
      cancelSubmit (formName) {
        this.addStoreDialog = false
        this.$refs[formName].resetFields();
        let temp = this.addForm.cabinetId;
        this.addForm = {}
        this.addForm.cabinetId = temp;
        this.loadData()
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
