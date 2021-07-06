<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="190px">
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
              <el-form-item  label="项目编号：" prop="name1">
                <el-row>
                  <el-col :span="24">
                    <el-select filterable v-model="form.type" clearable placeholder="请选择项目编号" size="medium" style="width: 100%;">
                      <el-option
                        :key="1"
                        :label="111"
                        :value="1">
                      </el-option>
                      <el-option
                        :key="2"
                        :label="111"
                        :value="2">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="件数：">
                <el-row>
                  <el-col :span="24"><el-select filterable v-model="form.type" clearable placeholder="根据项目单号带人" size="medium" style="width: 100%;">
                    <el-option
                      :key="1"
                      :label="111"
                      :value="1">
                    </el-option>
                    <el-option
                      :key="2"
                      :label="111"
                      :value="2">
                    </el-option>
                  </el-select></el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="主单号：" prop="date">
                <el-input v-model="form.owner">通过姓名回显</el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量：" prop="date">
                <el-input ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="境内收发货人：" prop="date">
                <el-input v-model="form.owner">通过姓名回显</el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暂时进口到期日：" prop="useType">
                <el-date-picker type="date" placeholder="请选择注册日期" v-model="form.registerDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="消费使用单位：" prop="VIN">
                <el-input v-model="form.VIN"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              &nbsp;
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发货单位：" prop="registerDate">
                <el-input v-model="form.VIN"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暂时进口编号：" prop="certificateDate">
                <el-input v-model="form.engineNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="报关单号：" prop="date">
                <el-input v-model="form.engineNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="放行期日：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总价：" prop="maxPassengers">
                <el-input clearable placeholder="请输入数字" v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关税：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="贸易方式：" prop="date">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暂时出口到期日：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进口延期次数：" prop="maxPassengers">
                <el-input clearable placeholder="请输入数字" v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暂时出口编号：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启运港：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="暂时复出境报关单号：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的港：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出口延期次数：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="担保方式：" prop="maxPassengers">
                <el-select filterable v-model="form.type" clearable placeholder="保证金" size="medium" style="width: 100%;">
                  <el-option
                    :key="1"
                    :label="111"
                    :value="1">
                  </el-option>
                  <el-option
                    :key="2"
                    :label="111"
                    :value="2">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请结案日期：" prop="maxPassengers">
                <el-input v-model="form.maxPassengers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
             &nbsp;
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否结案：" prop="maxPassengers">
              <el-switch
                v-model="value3"
                active-text="是"
                inactive-text="否">
              </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="1">
              &nbsp;
            </el-col>
            <el-col :span="23">
              <div>货物信息：</div>
              <el-table class="page-table" :data="listData2" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
              >
                <el-table-column v-for="(header, index) in tableHeader2" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                                 :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>银行保函：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="travelData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'">
                  <el-input v-model="scope.row.name"></el-input>
                </div>
                <div v-else-if="header.prop == 'ruleType'">
                  <el-input v-model="scope.row.ruleType"></el-input>
                </div>
                <div v-else-if="header.prop == 'unit'">
                  <el-date-picker
                    v-model="form.insuranceDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
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
            <!--<el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.tag === 'new'" size="mini" @click="deleteInvoiceItem(scope.row)">删除</el-button>
                <el-button type="primary" v-if="scope.row.tag !== 'new'" size="mini" @click="addInvoiceItem()">增加</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>关税保证保险单：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table class="page-table" :data="stayData" stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listStay" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'name'">
                  <el-input v-model="scope.row.name"></el-input>
                </div>
                <div v-else-if="header.prop == 'ruleType'">
                  <el-input v-model="scope.row.ruleType"></el-input>
                </div>
                <div v-else-if="header.prop == 'unit'">
                  <el-input v-model="scope.row.name"></el-input>
                </div>
                <div v-else-if="header.prop == 'number'">
                  <el-date-picker
                    v-model="form.insuranceDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
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
                  @click="addInvoiceItem3"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteInvoiceItem3(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <!--<el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.tag === 'new'" size="mini" @click="deleteInvoiceItem(scope.row)">删除</el-button>
                <el-button type="primary" v-if="scope.row.tag !== 'new'" size="mini" @click="addInvoiceItem()">增加</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
        <!-- 打印内容结束 -->
        <div class="footer m10">
          <el-button type="primary" size="medium" @click="cancelSubmit('form')">取 消</el-button>
          <el-button type="primary" size="medium" @click="submitForm('form')">提 交</el-button>
          <el-button type="primary" size="medium" @click="submitForm('form')">提交后继续创建</el-button>
        </div>
        <div style="clear: both"></div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  export default {
    components: {
      'v-upload': Upload
    },
    data () {
      return {
        value3: true,
        value4: true,
        //
        flag: false,
        type: '',
        form: {},
        /** 表格 loading */
        listLoading: false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        travelData: [],
        listData2: [],
        stayData: [],
        tableHeader: [{    // 2号表格数据
          prop: 'no',
          label: '序号',
          width: '80',
          show: true
        }, {
          prop: 'name',
          label: '包含单号*',
          align: 'center',
          show: true
        }, {
          prop: 'ruleType',
          label: '担保额度',
          align: 'center',
          show: true
        }, {
          prop: 'unit',
          label: '担保期限',
          align: 'center',
          show: true
        }],
        tableHeader2: [{        //一号表格
          prop: 'no',
          label: '商品名称',
          width: '80',
          align: 'center',
          show: true
        }, {
          prop: 'carNo',
          label: '商品编号',
          align: 'center',
          show: true
        }, {
          prop: 'carType',
          label: '数量',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'length',
          label: '单位',
          align: 'center',
          show: true
        }, {
          prop: 'width',
          label: '金额',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'height',
          label: '币值',
          align: 'center',
          show: true
        }],
        listStay: [{             //3号表格(住宿)数据
          prop: 'no',
          label: '序号',
          width: '80',
          show: true
        }, {
          prop: 'name',
          label: '包含单号*',
          align: 'center',
          show: true
        }, {
          prop: 'ruleType',
          label: '担保额度',
          align: 'center',
          show: true
        }, {
          prop: 'unit',
          label: '保险费',
          align: 'center',
          show: true
        }, {
          prop: 'number',
          label: '担保期限',
          align: 'center',
          show: true
        }],
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]

      }
    },
    mounted () {
      this.loadData()
      this.loadData2()
    },
    methods: {
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        this.listLoading = false
      },
      loadData2 () {
        this.listLoading = true
        // this.listData2.push({
        //   no: '你好',
        //   carNo: '不好',
        //   carType: '这那帮'
        // })
        this.listLoading = false
      },
      addInvoiceItem () {
        let newItem = {
          no: '',
          name: '',
          ruleType: '',
          unit: '',
          number: '',
          total: ''
        }
        this.travelData.push(newItem)
      },
      addInvoiceItem3 () {
        let newItem = {
          no: '',
          name: '',
          ruleType: '',
          unit: '',
          number: '',
          ticket: '',
          comment: '',
          sunMoney: ''
        }
        this.stayData.push(newItem)
      },
      deleteInvoiceItem (item) {
        this.travelData.splice(this.travelData.indexOf(item), 1)
      },
      deleteInvoiceItem3 (item) {
        this.stayData.splice(this.stayData.indexOf(item), 1)
      },
      /**
       * 表单提交
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('form: ' + this.form)
          } else {
            this.$message('请完善表单')
          }
        })
      },
      cancelSubmit (formName) {
        this.form = {}
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`)
      }
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
