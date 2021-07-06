<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">

        <!--<div class="title">申请信息-->
        <!--<div class="line"></div>-->
        <!--</div>-->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编号：" prop="name">
                <el-select v-model="form.type" clearable placeholder="请选择项目编码" size="medium" style="width:100%">
                  <el-option
                    :key="1"
                    :label="111"
                    :value="1">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同号：" prop="no">
                <el-select v-model="form.type" clearable placeholder="请选择" size="medium" style="width:100%">
                  <el-option
                    :key="1"
                    :label="111"
                    :value="1">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款单位：" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款金额：" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款公司：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款银行账号：" prop="type">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请日期：" prop="applyDate">
                <el-date-picker type="date" placeholder="请选择日期" v-model="form.applyDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省份：" prop="provence">
                <el-input v-model="form.provence"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row style="padding: 10px 20px;">
              <el-col :span="12">
                  <el-form-item label="汇款凭证：">
                    <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      multiple
                      :limit="3"
                      :on-exceed="handleExceed"
                      :file-list="fileList">
                      <el-button size="small" type="primary" icon="el-icon-upload">附件上传</el-button>
                    </el-upload>
                  </el-form-item>
              </el-col>
            </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>通知设置：</p>
        <div style="padding: 0 20px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批流程：" prop="remark">
                <el-select v-model="form.type" clearable placeholder="请选择审批流程" size="medium" style="width:100%">
                  <el-option
                    :key="1"
                    :label="111"
                    :value="1">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="cancelSubmit('form')">返 回</el-button>
        <el-button type="primary" size="medium" @click="submitForm('form')">提 交</el-button>
        <el-button type="primary" size="medium" @click="submitAddCreate('form')">提交后继续创建</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // 判断是入库还是出库
        flag: false,
        type: '',
        form: {},
        tableHeader: [{
          prop: 'goodsName',
          align: 'center',
          label: '货物名称',
          width: '100',
          show: true
        }, {
          prop: 'count',
          align: 'center',
          label: '数量',
          width: '100',
          show: true
        }, {
          prop: 'piece',
          align: 'center',
          label: '箱内件数',
          width: '100',
          show: true
        }, {
          prop: 'weight',
          align: 'center',
          label: '毛重（kg）',
          width: '100',
          show: true
        }, {
          prop: 'volume',
          align: 'center',
          label: '体积（m³）',
          width: '100',
          show: true
        }, {
          prop: 'putNum',
          align: 'center',
          label: '本次入库数',
          width: '100',
          show: true
        }, {
          prop: 'position',
          align: 'center',
          label: '仓库位置',
          width: '360',
          show: true
        }],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]

      }
    },
    mounted() {
      this.loadData()
      this.flag = this.$route.path === '/router/PutInStock'
    },
    methods: {
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        for (let i = 0; i < 2; i++) {
          this.listData.push({
            goodsName: '画',
            count: '2',
            piece: '18',
            weight: '50',
            volume: 81,
            type: '任务出库'
          })
        }
        this.listLoading = false
      },
      /**
       * 表单提交
       */
      submitForm (formName) {
        this.form.title = parseFloat(this.form.title).toFixed(2)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('form: ' + this.form)
          } else {
            this.$message('请完善表单')
          }
        })
      },
      submitAddCreate (formName) {

      },
      cancelSubmit(formName) {
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
  .w-trans{
    width: 180px;
  }
</style>
