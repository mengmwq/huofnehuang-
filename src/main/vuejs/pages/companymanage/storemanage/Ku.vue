<template>
  <div>
      <el-row class="mb10">
          <el-col :span="24" class="text-left">
              <el-button type="primary" size="small" v-showBtn data-authorityType="addKu-btn" icon="el-icon-plus" @click="addStoreDialog=true;operateFlag = 'add'">新增库</el-button>
          </el-col>
      </el-row>
      <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
      >
        <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
          <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                           :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="header.prop == 'roomSize'">
                {{scope.row.length}} x {{scope.row.wide}} x {{scope.row.high}}
              </div>
              <div v-else-if="header.prop == 'doorSize'">
                {{scope.row.tocumenLength}} x {{scope.row.tocumenWide}} x {{scope.row.tocumenHigh}}
              </div>
              <div v-else-if="header.prop == 'elevatorDoorSize'">
                {{scope.row.elevatorLength}} x {{scope.row.elevatorWide}} x {{scope.row.elevatorHigh}}
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
          <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" v-showBtn data-authorityType="editKu-btn" @click="editKu(scope.row)">编辑</el-button>
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
        :close-on-click-modal="canClick"
            :title="operateFlag === 'edit' ? '编辑库' : '新增库'"
            :visible.sync="addStoreDialog"
            @close="cancelSubmit('addForm')"
            size="small" top="12vh" width="50%">
        <div>
            <el-form :model="addForm" ref="addForm" :rules="rules" label-width="140px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="库房名称:" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="库房面积:" prop="area">
                    <el-input v-model="addForm.area"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="库房地址:">
                    <el-cascader placeholder="省市区" style="width: 100%;"
                                 :options="options"
                                 :props="defaultProps"
                                 v-model="addForm.areaArr">
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="详细地址:">
                      <el-input v-model="addForm.address"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="库房编号:" prop="code">
                      <el-input placeholder="请确保编号唯一" v-model="addForm.code" @blur="examine"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="库房类型:">
                      <el-input v-model="addForm.type"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="库房长宽高:" prop="length">
                      <el-input v-model="addForm.length" style="width: 120px"></el-input> x
                      <el-input v-model="addForm.wide" style="width: 120px"></el-input> x
                      <el-input v-model="addForm.high" style="width: 120px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="电梯轿厢长宽高:" prop="elevatorLength">
                    <el-input v-model="addForm.elevatorLength" style="width: 120px"></el-input> x
                    <el-input v-model="addForm.elevatorWide" style="width: 120px"></el-input> x
                    <el-input v-model="addForm.elevatorHigh" style="width: 120px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="库门长宽高:" prop="tocumenLength">
                    <el-input v-model="addForm.tocumenLength" style="width: 120px"></el-input> x
                    <el-input v-model="addForm.tocumenWide" style="width: 120px"></el-input> x
                    <el-input v-model="addForm.tocumenHigh" style="width: 120px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注:">
                      <el-input type="textarea" :rows="4" maxlength="500" show-word-limit v-model="addForm.remarks"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
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
  import areaData from '@/api/area'
  export default {
    name: 'ku',
    data () {
      return {
        canClick: false,
        addStoreDialog: false,
        listData: [],
        query: {
          pageSize: 10,
          pageNum: 1
        },
        defaultProps: {
          label: 'value',
          children: 'children'
        },
        total: 0,
        addForm: {
          areaArr: []
        },
        operateFlag: '',
        tableHeader: [
          {prop: 'code', label: '库房编号', width: '100', show: true},
          {prop: 'name', label: '库房名称', width: '100', show: true},
          {prop: 'type', align: 'center', label: '库房类型', show: true},
          {prop: 'area', align: 'center', label: '面积（㎡）', width: '120', show: true},
          {prop: 'roomSize', align: 'center', label: '库房长宽高（m）', width: '180', show: true},
          {prop: 'doorSize', align: 'center', label: '库门长宽高（m）', width: '180', show: true},
          {prop: 'elevatorDoorSize', align: 'center', label: '电梯轿箱长宽高（m）', width: '180', show: true},
          {prop: 'createDt', align: 'center', label: '建立时间', show: true},
          {prop: 'updateDt', align: 'center', label: '更新时间', show: true},
          {prop: 'ctUName', align: 'center', label: '创建人', show: true},
          {prop: 'updUName', align: 'center', label: '修改人', show: true}
        ],
        options: [],
        rules: {
          name: [
            { required: true, message: '请输入库房名称', trigger: 'blur'},
          ],
          code: [
            { required: true, message: '请输入库房编号', trigger: 'blur'},
          ],
          // length: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // wide: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // high: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // elevatorLength: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // elevatorWide: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // elevatorHigh: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // tocumenLength: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          // tocumenWide: [
          //   { required: false, message: '', trigger: 'blur'},
          //   { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          // ],
          area: [
            { required: false, message: '', trigger: 'blur'},
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
        }
      }
    },
    mounted () {
      this.options = areaData.data
      this.loadData()
    },
    methods: {
      /** 序号 */
      indexMethod(index){
        return index + ((this.query.pageNum - 1) * this.query.pageSize) + 1
      },

      /** 校验编号是否唯一 */
      examine(){
        Api.getWarehouseByCode({code : this.addForm.code}).then((res) => {
          if (!res) {
            this.$notify.warning({
              title: '提示',
              message: '警告！库房编码重复！！！'
            })
          }
        })

      },

      /**校验是否填写数字**/
      isNum (str) {
        if (str) {
          let reg=/^[0-9]*$/;   /**定义验证表达式*/
          return reg.test(str);     /**进行验证*/
        }else {
          return true
        }
      },

      /**
       * 查询库列表
       * */
      loadData () {
        Api.warehousePageList(this.query).then((res) => {
          if (res) {
            this.listData = res.records
            this.total = res.total
          }
        })
      },
      /**
       * 添加库
       * */
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.addForm.areaArr.length > 0) {
              this.addForm.province = this.addForm.areaArr[0]
              this.addForm.city = this.addForm.areaArr[1]
              this.addForm.district = this.addForm.areaArr[2]
            }
            if (this.operateFlag === 'edit') {
              /**进行正则表达式的校验**/
              if(!this.isNum(this.addForm.length)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库房长】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.wide)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库房宽】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.high)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库房高】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.elevatorLength)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【电梯轿厢长】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.elevatorWide)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【电梯轿厢宽】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.elevatorHigh)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【电梯轿厢高】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.tocumenLength)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库门长】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.tocumenWide)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库门宽】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.tocumenHigh)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库门高】是否填写规范'
                })
                return       //校验失败return返回
              }

              /**校验成功执行下列语句**/
              Api.updateWarehouseInfoById(this.addForm).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '库房修改成功'
                  })
                }
                this.addStoreDialog = false
                this.addForm = {}
                this.loadData()
                this.$emit('LoadTree')
              })
            } else {
              /**进行正则表达式的校验**/
              if(!this.isNum(this.addForm.length)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库房长】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.wide)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库房宽】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.high)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库房高】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.elevatorLength)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【电梯轿厢长】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.elevatorWide)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【电梯轿厢宽】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.elevatorHigh)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【电梯轿厢高】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.tocumenLength)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库门长】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.tocumenWide)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库门宽】是否填写规范'
                })
                return       //校验失败return返回
              }
              if(!this.isNum(this.addForm.tocumenHigh)){
                this.$notify.warning({
                  title: '提示',
                  message: '请检查【库门高】是否填写规范'
                })
                return       //校验失败return返回
              }

              /**校验成功执行下列语句**/
              Api.getWarehouseByCode({code : this.addForm.code}).then((res) => { //先校验编码是否唯一 然后再执行添加
                if (!res) {
                  this.$notify.warning({
                    title: '提示',
                    message: '警告！库房编码重复！！！'
                  })
                  return
                }
              })

              Api.addWarehouseInfo(this.addForm).then((res) => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '库房添加成功'
                  })
                }
                this.addStoreDialog = false
                this.addForm = {}
                this.loadData()
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
      editKu (item) {
        this.addForm = item
        this.addForm.areaArr = [item.province, item.city, item.district]
        this.operateFlag = 'edit'
        this.addStoreDialog = true
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
