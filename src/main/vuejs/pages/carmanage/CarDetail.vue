<template>
  <div>
    <div class="title">车辆信息
      <div class="line"></div>
    </div>
    <div class="car-info ">
      <el-row>
        <el-col :span="8">
          <div class="car-img">
            <img :src="imageUrl" width="100%" height="100%"/>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form label-position="right" :model="form" ref="form" label-width="130px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="车牌号码：">
                  <span>{{form.registrationNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车辆类型：">
                  <span>{{form.carTypeId | carTypeFilter}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所有人：">
                  <span>{{form.carOwner}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="住址：">
                  <span>{{form.carOwnerAddr}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="使用性质：">
                  <span>{{form.useType}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品牌类型：">
                  <span>{{form.brand}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="车辆识别代码：">
                  <span>{{form.carSn}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发动机号码：">
                  <span>{{form.engineSn}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="注册日期：">
                  <span>{{form.registionDate | timeFormat}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发证日期：">
                  <span>{{form.certificateDate | timeFormat}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="档案编号：">
                  <span>{{form.certificateCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="核定载人数：">
                  <span>{{form.peopleNumber}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="总质量：">
                  <span>{{form.totalWeight}} KG</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="整备质量：">
                  <span>{{form.zbWeight}} KG</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="核定载质量：">
                  <span>{{form.hdWeight}} KG</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="外廓尺寸：">
                  <span>{{form.info}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="准牵引总质量：">
                  <span>{{form.zqyTotalWeight}} KG</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注：">
                  <span>{{form.remarks}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="检验有效期：">
                  <span>{{form.termOfValidity | timeFormat }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="燃油性质：">
                  <span>{{form.fuelTypeId}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="强制报废日期：">
                  <span>{{form.overDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门负责人：">
                  <span>{{form.leader}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="车辆第一负责人:">
                  <span>{{form.firstLeader}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车辆第二负责人：">
                  <span>{{form.secondLeader}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="tab-nav" style="padding: 0 15px;">
      <div class="nav-item tab">
        <router-link :to="{path: '/router/transportCarInfo', query: {id: id, registrationNumber: registrationNumber}}" tag="span">车辆信息</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/oilCard', query: {id: id,registrationNumber:registrationNumber}}" tag="span">加油申请</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/etc', query: {id: id,registrationNumber:registrationNumber}}" tag="span">过路费申请(ETC)</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/finance', query: {id: id,registrationNumber:registrationNumber}}" tag="span">统计收支项</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/maintenanceInfo', query: {id: id,registrationNumber:registrationNumber}}" tag="span">保养维修</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/insuranceRecord', query: {id: id,registrationNumber:registrationNumber}}" tag="span">出险记录</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/regulationRecord', query: {id: id,registrationNumber:registrationNumber}}" tag="span">违章记录</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/aboutProject', query: {id: id,registrationNumber:registrationNumber}}" tag="span">有关项目</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/intendInspect', query: {id: id,registrationNumber:registrationNumber}}" tag="span">一日三检表</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/carInspect', query: {id: id,registrationNumber:registrationNumber}}" tag="span">检测表</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/fileManage', query: {id: id,registrationNumber:registrationNumber}}" tag="span">文件管理</router-link>
      </div>
    </div>
    <router-view style="padding: 0 15px;"></router-view>
   
    <el-row style="margin-top: 20px;margin-right: 13px">
      <el-col :span="24" class="text-right">
        <router-link :to="{path: '/router/carList'}" tag="span">
          <el-button type="primary" size="medium">返回</el-button>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Api from '@/api/index'
export default {
  data () {
    return {
      id: '',
      registrationNumber: '',
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
        zqyTotalWeight:'', //准牵引总质量 0
      },
      imageUrl: ''
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.registrationNumber = this.$route.query.registrationNumber
    this.loadData()
  },
  methods: {
    //加载数据
    loadData () {
      this.listLoading = true
      Api.queryCarInfoById({
        id: this.id
      }).then(data => {
        //this.form = data.records
        this.form = data
        let _this = this
        if (data.carAttachments && data.carAttachments.length > 0) {
          data.carAttachments.forEach(function (item) {
            if (item.attchmentTypeId === '004') {
              Api.getUrl(item.attachmentUrlKey).then(data => {
                if (data) {
                  _this.imageUrl = data
                }
              })
            }
          })
        }
        this.listLoading = false
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
    height: 30px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }
  .car-info{
    background: #D3EDFA;
    padding: 10px;
    border-radius: 8px;
  }
  .car-info .car-img{
    padding: 20px 10px 10px 20px;
  }
  .el-form-item {
    margin-bottom: -10px!important;
  }
</style>
