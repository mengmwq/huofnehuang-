<template>
  <div>
    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="130px">
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
              <el-form-item label="车辆号码：" prop="registrationNumber">
                <el-row>
                  <el-col :span="12"><el-input v-model="form.registrationNumber" style="width: 95%;"></el-input></el-col>
                  <el-col :span="12"><el-select v-model="form.plateTypeId" clearable placeholder="车牌类型" size="medium" style="width: 100%;">
                    <el-option v-for="(item, index) in plateTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                    </el-option>
                  </el-select></el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆类型：" prop="">
                <el-select v-model="form.carTypeId" clearable placeholder="车辆类型" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in carTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所有人：" prop="">
                <el-input v-model="form.carOwner"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="住址：" prop="">
                <el-input v-model="form.carOwnerAddr"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用性质：" prop="">
                <el-input v-model="form.useType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌型号：" prop="brand">
                <el-input v-model="form.brand"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆识别代码：" prop="">
                <el-input v-model="form.carSn"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发动机号：" prop="">
                <el-input v-model="form.engineSn"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="注册日期：" prop="registionDate">
                <el-date-picker type="date" placeholder="" v-model="form.registionDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发证日期：" prop="certificateDate">
                <el-date-picker type="date" placeholder="" v-model="form.certificateDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="档案编号：" prop="">
                <el-input v-model="form.certificateCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核定载人数："  prop="peopleNumber">
                <el-input placeholder="请输入数字" v-model="form.peopleNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="总质量(kg)："  prop="totalWeight">
                <el-input placeholder="请输入数字" v-model="form.totalWeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="整备质量(kg)：" prop="zbWeight">
                <el-input placeholder="请输入数字" v-model="form.zbWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="核定载质量(kg)："  prop="hdWeight">
                <el-input placeholder="请输入数字" v-model="form.hdWeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外廓尺寸：" prop="length">
                <!--<el-input placeholder="长" v-model="form.size"></el-input>-->
                <el-row>
                  <el-col :span="8"><el-input placeholder="长 （单位cm）" v-model="form.length" style="width: 95%"></el-input>×</el-col>
                  <el-col :span="8"><el-input placeholder="宽 （单位cm）" v-model="form.width" style="width: 95%"></el-input>×</el-col>
                  <el-col :span="8"><el-input placeholder="高 （单位cm）" v-model="form.height" ></el-input></el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="准牵引总质量："  prop="zqyTotalWeight">
                <el-input placeholder="请输入数字（kg）" v-model="form.zqyTotalWeight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注：" prop="">
                <el-input v-model="form.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检验有效期：" prop="termOfValidity">
                <el-date-picker type="date" placeholder="" v-model="form.termOfValidity"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="燃油性质：" prop="">
                <el-input v-model="form.fuelTypeId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="强制报废日期：" prop="overDate">
                <el-date-picker type="date" placeholder="" v-model="form.overDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门负责人：" prop="">
                <el-input v-model="form.leader"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆第一负责人：">
                <el-input v-model="form.firstLeader"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆第二负责人：">
                <el-input v-model="form.secondLeader"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>运输车辆信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="道路运输证编号：" prop="">
                <el-input v-model="form.trainTransportCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称：" prop="">
                <el-input v-model="form.company"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="地址：" prop="">
                <el-input v-model="form.companyAddr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营许可证：" prop="">
                <el-input v-model="form.businessLicense"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆类型：" prop="">
                <el-select v-model="form.transportationVehiclesType" clearable placeholder="车辆类型" size="medium" style="width: 100%;">
                  <el-option v-for="(item, index) in carTypeList" :key="index" :label="item.cnInfo" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="吨(座)位：" prop="">
                <el-input v-model="form.tonnage"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆（毫米）：" prop="">
                <el-input v-model="form.info"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营范围：" prop="">
                <el-input v-model="form.businessRange"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发证日期：" prop="businessCertificateDate">
                  <el-date-picker type="date" placeholder="" v-model="form.businessCertificateDate"
                                  style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">3</span>交强保险信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="保单号码：" prop="">
                <el-input v-model="form.policyNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保险到期日：" prop="policyEndDate">
                <el-date-picker type="date" placeholder="" v-model="form.policyEndDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保险公司：" prop="">
                <el-input  v-model="form.policyCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保险费用(元)：" prop="premium">
                <el-input placeholder="输入数字" v-model="form.premium" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保险金额(元)：" prop="insuredAmount">
                <el-input placeholder="输入数字" v-model="form.insuredAmount" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">4</span>商业保险信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="保单号码：" prop="">
                <el-input v-model="form.taxesPolicyNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保险到期日：" prop="">
                <el-date-picker type="date" placeholder="" v-model="form.taxesPolicyEndDate"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保险公司：" prop="">
                <el-input  v-model="form.taxesPolicyCompany"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保险费用(元)：" prop="">
                <el-input placeholder="输入数字" v-model="form.taxesPremium" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保险金额(元)：" prop="">
                <el-input placeholder="输入数字" v-model="form.taxesInsuredAmount" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">5</span>资料上传：</p>
        <div class="dash-content">
          <el-row style="padding: 10px;">
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync='drivingLicense' @change="(key) => {makeCarAttachmentReqs(key, '001')}"></v-upload>
              <p>行驶证</p>
            </el-col>
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync='transportLicense' @change="(key) => {makeCarAttachmentReqs(key, '002')}"></v-upload>
              <p>道路运输许可证</p>
            </el-col>
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync='insurance' @change="(key) => {makeCarAttachmentReqs(key, '003')}"></v-upload>
              <p>保险单</p>
            </el-col>
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync='carFacade' @change="(key) => {makeCarAttachmentReqs(key, '004')}"></v-upload>
              <p>车辆照片（正）</p>
            </el-col>
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync='carSide'  @change="(key) => {makeCarAttachmentReqs(key, '005')}"></v-upload>
              <p>车辆照片（侧）</p>
            </el-col>
            <el-col :span="4" class="text-center">
              <v-upload :imgKeyReq.sync='other' @change="(key) => {makeCarAttachmentReqs(key, '006')}"></v-upload>
              <p>其他</p>
            </el-col>
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">6</span>完成</p>
      </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <router-link :to="{path: '/router/carList'}">
          <el-button type="primary" size="medium">取 消</el-button>
        </router-link>
        <el-button type="primary" size="medium" @click="submitForm('form')">提 交</el-button>
      </div>
      <div style="clear: both"></div>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/common/Upload'
  import Api from '@/api/index'
  import moment from 'moment'
  export default {
    components: {
      'v-upload': Upload
    },
    data () {
      return {
        //
        flag: false,
        type: '',
        form: {
          brand:'',  //品牌型号 0
          businessCertificateDate:'',  //经营许可证发证日期 0
          businessLicense:'', //经营许可证 0
          businessRange:'', //经营范围 0
          carOwner	:'', //车辆所有人 0
          carOwnerAddr:'', //车辆所有人地址 0
          carSn:'', //车辆识别代码 0
          carTypeId:'', //车辆类型ID 0
          certificateCode:'', //档案编号 0
          certificateDate:'', //发证日期 0
          company:'', //企业名称 0
          companyAddr:'', //企业地址 0
          delFlg:'0', //删除标志 ？？？
          engineSn:'', //发动机号码 0
          fuelTypeId:'', //燃油性质ID 0
          hdWeight:'', //核定载质量 0
          height:'', //高 0
          info:'', //车辆(毫米) 0
          insuredAmount:'', //保险金额 0
          leader:'', //负责人 0
          length:'', //长 0
          overDate:'', //强制报废日期 0
          peopleNumber:'', //核定载人数 0
          plateTypeId:'', //车牌类型ID 0
          policyCompany:'', //保险公司 0
          policyEndDate:'', //保险到期日 0
          policyNo:'', //保单号码 0
          premium:'', //保险费用 0
          registionDate:'', //注册日期 0
          registrationNumber:'', //车牌号（非空）0
          remarks:'', //备注 0
          termOfValidity:'',//检验有效期
          tonnage:'', //吨（座）位 0
          totalWeight:'', //总质量 0
          trainTransportCode:'', //道路运输证编号 0
          transportationVehiclesType:'', //运输车辆类型 0
          useType:'', //使用性质 0
          width:'', //宽 0
          zbWeight:'', //整备质量 0
          zqyTotalWeight:'', //准牵引总质量 0,
          carAttachmentReqs: []
        },

        /**表单校验**/
        rules: {
          overDate: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          termOfValidity: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          businessCertificateDate: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          certificateDate: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          policyEndDate: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          registionDate: [
            { required: true, message: '不为空', trigger: 'blur' }
          ],
          registrationNumber: [
            { required: true, message: '不为空', trigger: 'blur' },
            { max: 10, message: '长度在10个字符以内', trigger: 'blur'}
          ],
          /*premium: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],*/
          /*insuredAmount: [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^\d+(\.\d{1,4})?$/, message: '请输入数字，小数点后最多四位' }
          ],*/
          zqyTotalWeight: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
          zbWeight: [
            { required: false, message: '', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
          hdWeight: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
          peopleNumber: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
          totalWeight: [
            { required: false, message: '' ,trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请至少选择一个活动性质', trigger: 'blur' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },

        /** 表格 loading */
        listLoading: false,
        // 车牌类型
        plateTypeList: [],
        // 车辆类型
        carTypeList: [],
        drivingLicense: '',
        transportLicense: '',
        insurance: '',
        carFacade: '',
        carSide: '',
        other: ''

      }
    },
    mounted () {
      // 从数据字典获取币种下拉框数据
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.PlateType) {
          this.plateTypeList = distsObj.PlateType.children
        }
      if (distsObj.CarType) {
          this.carTypeList = distsObj.CarType.children
        }
      }
      if (this.$route.query.id) {
        this.loadData()
      }

    },
    methods: {
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
       * 加载车辆信息
       */
      loadData () {
        Api.queryCarInfoById({id: this.$route.query.id}).then(data => {
          if (data) {

            this.form = data
            this.$set(this.form, 'carAttachmentReqs', [])

            let _this = this
            if (data.carAttachments && data.carAttachments.length > 0) {
              this.form.carAttachmentReqs = data.carAttachments
              data.carAttachments.forEach(function (item) {
                switch (item.attchmentTypeId) {
                  case('001'):  _this.drivingLicense = item.attachmentUrlKey;break
                  case('002'):  _this.transportLicense = item.attachmentUrlKey;break
                  case('003'):  _this.insurance = item.attachmentUrlKey;break
                  case('004'):  _this.carFacade = item.attachmentUrlKey;break
                  case('005'):  _this.carSide = item.attachmentUrlKey;break
                  case('006'):  _this.other = item.attachmentUrlKey;break
                }
              })
            }
            //this.form = data
          }
        })
      },
      isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)){
          return true;
        }else{
          return false;
        }
      },
      makeCarAttachmentReqs(key, attchmentTypeId) {
        let name = ''
        switch (attchmentTypeId) {
          case('001'): name = '行驶证';break
          case('002'): name = '道路运输许可证';break
          case('003'): name = '保险单';break
          case('004'): name = '车辆照片(正)';break
          case('005'): name = '车辆照片(侧)';break
          case('006'): name = '其他';break
        }
        let param = {
          attachmentUrlKey: key,
          attchmentTypeId: attchmentTypeId,
          name: name
        }
        if (this.$route.query.id) {
         param.carId = this.$route.query.id
        }
        let _this = this
        let currentIndex = ''
        let flag = false
        if (this.form.carAttachmentReqs.length > 0) {
          for (let i = 0; i < _this.form.carAttachmentReqs.length; i++) {
            let item = _this.form.carAttachmentReqs[i]
            if (item.attchmentTypeId === attchmentTypeId){
              currentIndex = i
              flag = true
              break
            }
          }
          if (flag) {
            _this.form.carAttachmentReqs[currentIndex].attachmentUrlKey = key
          } else {
            this.form.carAttachmentReqs.push(param)
          }
        } else {
          this.form.carAttachmentReqs.push(param)
        }
        console.log(this.form.carAttachmentReqs)
      },

      /**
       * 表单提交
       */
      submitForm (formName) {
        //金额保留两位小数
        if (this.form.insuredAmount) {
          this.form.insuredAmount = parseFloat(this.form.insuredAmount).toFixed(2)
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            /**进行正则表达式的校验**/
            if(!this.isNum(this.form.length)){
              this.$notify.warning({
                title: '提示',
                message: '请检查【长】是否填写规范'
              })
              return       //校验失败return返回
            }
            if(!this.isNum(this.form.width)){
              this.$notify.warning({
                title: '提示',
                message: '请检查【宽】是否填写规范'
              })
              return
            }
            if(!this.isNum(this.form.height)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[高]是否填写规范'
              })
              return
            }
            /*if(!this.isNum(this.form.premium)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[保险费用]是否填写规范'
              })
              return
            }*/
            /*if(!this.isNum(this.form.insuredAmount)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[保险金额]是否填写规范'
              })
              return
            }*/
            if(!this.isNum(this.form.zqyTotalWeight)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[准牵引总质量]是否填写规范'
              })
              return
            }
            if(!this.isNum(this.form.zbWeight)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[整备质量]是否填写规范'
              })
              return
            }
            if(!this.isNum(this.form.hdWeight)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[核定载质量]是否填写规范'
              })
              return
            }
            if(!this.isNum(this.form.peopleNumber)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[核定载人数]是否填写规范'
              })
              return
            }
            if(!this.isNum(this.form.totalWeight)){
              this.$notify.warning({
                title: '提示',
                message: '请检查[总质量]是否填写规范'
              })
              return
            }

            /**校验成功执行下列语句**/
            this.$route.query.temp===1 || this.$route.query.id ? this.edit1():this.add1()
            }
            else {
            this.$message('请完善表单')
          }
        })
      },

      /** 添加数据 */
      add1: function () {
        this.form.overDate = moment(this.form.overDate).format('YYYY-MM-DD')
        this.form.termOfValidity = moment(this.form.termOfValidity).format('YYYY-MM-DD')
        this.form.businessCertificateDate = new Date(this.form.businessCertificateDate).getTime()
        this.form.certificateDate = new Date(this.form.certificateDate).getTime()
        this.form.policyEndDate = new Date(this.form.policyEndDate).getTime()
        this.form.taxesPolicyEndDate = new Date(this.form.taxesPolicyEndDate).getTime()
        this.form.registionDate = new Date(this.form.registionDate).getTime()
		this.form.type = this.$route.query.type
        Api.addCar(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加成功'
            })
            // 跳转回去
            if(this.form.type === '1'){
            	this.$router.push({path: '/router/carList'})
            }else if(this.form.type === '4'){
            	this.$router.push({path: '/router/carCustomsList'})
            }else if(this.form.type === '3'){
            	this.$router.push({path: '/router/carGoodsList'})
            }else if(this.form.type === '5'){
            	this.$router.push({path: '/router/carAdminList'})
            }else if(this.form.type === '2'){
            	this.$router.push({path: '/router/carAerialList'})
            }
          }
        })
      },

      /** 编辑数据 */
      edit1: function () {
        this.form.id = this.$route.query.id
        this.form.overDate = moment(this.form.overDate).format('YYYY-MM-DD')
        this.form.termOfValidity = moment(this.form.termOfValidity).format('YYYY-MM-DD')
        this.form.businessCertificateDate = new Date(this.form.businessCertificateDate).getTime()
        this.form.certificateDate = new Date(this.form.certificateDate).getTime()
        this.form.taxesPolicyEndDate = new Date(this.form.taxesPolicyEndDate).getTime()
        this.form.policyEndDate = new Date(this.form.policyEndDate).getTime()
        this.form.registionDate = new Date(this.form.registionDate).getTime()
		
        delete this.form['carAttachments']

        Api.updateCarInfo(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '车辆信息修改成功'
            })
            // 跳转回去
            this.$router.push({path: '/router/carList'})
          }
        })
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
