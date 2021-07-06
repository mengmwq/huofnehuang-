<template>
    <div>
        <el-row class="mb10">
            <el-col :span="24" class="text-left">
                <el-button type="primary" size="small" v-showBtn data-authorityType="addGui-btn" icon="el-icon-plus" @click="addStoreDialog=true;operateFlag = 'add'">新增柜</el-button>
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
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-showBtn data-authorityType="editGui-btn" @click="editGui(scope.row)">编辑</el-button>
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
        :title="operateFlag === 'edit' ? '编辑柜' : '新增柜'"
        :visible.sync="addStoreDialog"
        :close-on-click-modal="canClick"
        @close="cancelSubmit"
        size="small" top="12vh" width="40%">
        <div>
          <el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px">
            <el-form-item label="所属仓:">
              <span>{{name}}</span>
            </el-form-item>
            <el-form-item label="柜位名称:" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="柜位编号:" prop="code">
              <el-input v-model="addForm.code"></el-input>
            </el-form-item>
            <el-form-item label="柜位类型:">
              <el-input v-model="addForm.type"></el-input>
            </el-form-item>
            <el-form-item label="最大承重:">
              <el-input v-model="addForm.maxCapacity"></el-input>
            </el-form-item>
            <el-form-item label="柜位长宽高:">
              <el-input v-model="addForm.length" style="width: 120px"></el-input> x
              <el-input v-model="addForm.wide" style="width: 120px"></el-input> x
              <el-input v-model="addForm.high" style="width: 120px"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input type="textarea" v-model="addForm.remarks" :rows="3" maxlength="500" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelSubmit('addForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="submit('addForm')">确 定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    name: 'gui',
    data () {
      return {
        canClick: false,
        addStoreDialog: false,
        listData: [],
        addForm: {
          warehouseId: '',
          houseId: ''
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
          {prop: 'remarks', align: 'center', label: '备注', show: true}
        ],
        rules: {
          name: [
            { required: true, message: '请输入柜名称', trigger: 'blur'},
          ],
          code: [
            { required: true, message: '请输入柜编号', trigger: 'blur'},
          ],
        }
      }
    },
    props: {
      name: String,
      warehouseId: String,
      houseId: String
    },
    watch: {
      warehouseId: function (value) {
        this.addForm.warehouseId = value
      },
      houseId: function (value) {
        this.addForm.houseId = value
        this.query.houseId = value
        this.loadData()
      },
    },
    mounted () {

    },
    methods: {
      /**
       * 查询柜列表
       * */
      loadData () {
        Api.cabinetInfoPageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
      },
      editGui (item) {
        this.addForm = item
        this.operateFlag = 'edit'
        this.addStoreDialog = true
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operateFlag === 'edit') {
              Api.updateCabinetInfoById(this.addForm).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '柜修改成功'
                  })
                }
                this.loadData()
                this.addStoreDialog = false
                this.$emit('LoadTree')
              })
            } else {
              Api.addCabinetInfo(this.addForm).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '柜添加成功'
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
        this.addForm = {}
        this.addStoreDialog = false
        this.$refs[formName].resetFields();
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
