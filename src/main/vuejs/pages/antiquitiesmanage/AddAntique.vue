<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules1" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
        <!-- 基础信息 -->
        <div class="title">申请信息
          <div class="line"></div>
        </div>
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item  label="作品名称：" prop="name">
                <el-input  v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="币种：" prop="currency">
                <el-select v-model="form.currency" clearable placeholder="请选择币种" size="medium" style="width: 100%;">
                    <el-option v-for="(item, index) in currencyTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收藏单位：" prop="collection">
                <el-input v-model="form.collection"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="估值：" prop="valuation">
                <el-input v-model="form.valuation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="藏品号：" prop="collectionCode" >
                <el-input v-model="form.collectionCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量：" prop="netWeight" >
                <el-input v-model="form.netWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作者：" prop="author" >
                <el-input v-model="form.author"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="级别：" prop="level" >
                <el-input v-model="form.level"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="类型：" prop="type" >
                <el-input v-model="form.type"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出土地点：" prop="unearthedPlace" >
                <el-input v-model="form.unearthedPlace"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="尺寸（cm）：" prop="size" >
                <el-input v-model="form.size" placeholder="长 x 宽 x 高"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="完残情况：" prop="residualCondition" >
                <el-input v-model="form.residualCondition"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="材质：" prop="material" >
                <el-input v-model="form.material"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内包装/画框：" prop="innerPacking" >
                <el-input v-model="form.innerPacking"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时代/年代：" prop="age" >
                <el-input v-model="form.age"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内包装尺寸：" prop="dimensions" >
                <el-input v-model="form.dimensions"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量：" prop="number" >
                <el-input v-model="form.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：" prop="remarks" >
                <el-input v-model="form.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>以往展览：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="form.exhibitions" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}">
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'exhibitionName'">
                  <el-input v-model="scope.row.exhibitionName"></el-input>
                </div>
                <div v-else-if="header.prop == 'exhibitionLocale'">
                  <el-input v-model="scope.row.exhibitionLocale"></el-input>
                </div>
                <div v-else-if="header.prop == 'exhibitionTime'">
                  <el-input v-model="scope.row.exhibitionTime"></el-input>
                </div>
                <div v-else-if="header.prop == 'exhibitionCycle'">
                  <el-input v-model="scope.row.exhibitionCycle"></el-input>
                </div>
                <div v-else-if="header.prop == 'remarks'">
                  <el-input v-model="scope.row.remarks"></el-input>
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="left">
              <template slot="header" slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addInvoiceItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteInvoiceItem(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>作品图片：</p>
        <div class="dash-content">
          <el-row style="padding: 10px 20px;">
            <el-col :span="12">
              <el-form-item label="">
                <v-upload :isMultiple='isMultiple' :fileListReqs.sync="fileListReqs"></v-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">4</span>完成：</p>
        <!-- 打印内容结束 -->
        <div class="footer m10">
          <el-button type="primary" size="medium" @click="cancelSubmit('form')">取 消</el-button>
          <el-button v-if="!form.id" type="primary" size="medium" @click="submitForm('form', false)">提 交</el-button>
          <el-button v-if="!form.id" type="primary" size="medium" @click="submitForm('form', true, clear)">提交后继续创建</el-button>
          <el-button v-if="form.id" type="primary" size="medium" @click="submitForm('form', false)">保存</el-button>
        </div>
        <div style="clear: both"></div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  import rules from '@/utils/rules'

  export default {
    components: {
      'v-upload': Upload
    },
    data () {
      return {
        //
        logList: [], //返回的日志操作
        isMultiple: true,
        fileListReqs: [],
        flag: false,
        type: '',
        form: {
          exhibitions: [],
          pictures: [] //urlKey
        },
        /** 表格 loading */
        listLoading: false,
        rules1: {
          'name': [
            { required: true, message: '请填写作品名称', trigger: 'blur' }
          ],
          'currency': [
            { required: true, message: '请选择币种', trigger: 'change' }
          ],
          'valuation': [
            { required: true, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'netWeight': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
          'number': [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字' }
          ],
        },
        stayData: [],
        mealData: [],
        subsidyData: [],
        otherData: [],
        tableHeader: [{
          prop: 'exhibitionName',
          label: '展览名称',
          width: '80',
          show: true
        }, {
          prop: 'exhibitionLocale',
          label: '展览地点',
          align: 'center',
          show: true
        }, {
          prop: 'exhibitionTime',
          label: '展览时间',
          align: 'center',
          show: true
        }, {
          prop: 'exhibitionCycle',
          label: '展览周期',
          align: 'center',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }],
        // 币种
        currencyTypeList: [],

      }
    },
    mounted () {
      // 从数据字典获取币种下拉框数据
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.Currency) {
          this.currencyTypeList = distsObj.Currency.children
        }
      }
      if (this.$route.query.id) {
        this.loadData()
      }

    },
    methods: {
      /**
       * 加载数据
       */
      loadData () {
        this.form.id = this.$route.query.id
        Api.relicDetails(this.$route.query.id).then(data => {
          this.form = data
          this.fileListReqs = data.pictures
          let _this = this
          this.fileListReqs.forEach(function (item) {
            Api.getUrl(item.urlKey).then(data => {
              if (data) {
                _this.$set(item, 'url', data)
                _this.$set(item, 'key', item.urlKey)
              }
            })
          })
          console.log(this.fileListReqs)
        })
      },
      /**
       * 添加展览
       */
      addInvoiceItem () {
        let newItem = {
          exhibitionName: '',
          exhibitionLocale: '',
          exhibitionTime: '',
          exhibitionCycle: '',
          remarks: ''
        }
        this.form.exhibitions.push(newItem)
      },
      /**
       * 删除展览
       */
      deleteInvoiceItem (index) {
        this.form.exhibitions.splice(index, 1)
      },
      /**
       * 表单提交
       */
      submitForm (formName, again ,clear) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.fileListReqs.length > 0) {
              let _this = this
              _this.form.pictures = []
              this.fileListReqs.forEach(function(item){
                _this.form.pictures.push({
                  id: item.id? item.id: '',
                  relicId: item.relicId? item.relicId: '',
                  attachmentName: item.name,
                  urlKey: item.attachmentUrlKey
                })
              })
            }
            if (this.form.id) {
              // 保存
              Api.updateRelic(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '修改文物成功'
                  })
                  Api.operationLogPageList({param: this.$route.query.param}).then(data => {  //操作记录
                    this.logList = data
                    sessionStorage.setItem("logList",JSON.stringify(this.logList));
                  })
                  this.$router.push({path: '/router/inventoryList', })
                }
              })
            } else {
              // 新增
              Api.addRelic(this.form).then(data => {
                if (data) {
                  this.$notify.success({
                    title: '提示',
                    message: '添加文物成功'
                  })
                  Api.operationLogPageList({param: this.form.name}).then(data => {  //操作记录
                    this.logList = data
                    sessionStorage.setItem("logList",JSON.stringify(this.logList));
                  })
                  if (again) {
                    this.form = {
                      exhibitions: []
                    }
                  } else {
                    this.$router.push({path: '/router/inventoryList'})
                  }
                }
                if(clear){
                  this.form = {}
                }
              })
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },
      /**
       * 取消
       */
      cancelSubmit () {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped>
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }

  .footer {
    float: right;
    margin-top: 20px;
  }
</style>
