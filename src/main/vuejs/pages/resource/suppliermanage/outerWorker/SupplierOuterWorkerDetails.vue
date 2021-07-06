<template>
  <div>
      <div class="title">供应商详情
          <div class="line"></div>
      </div>
      <div class="car-info formDetails">
          <el-row type="flex" justify="space-between" :gutter="10">
              <el-col :span="22">
                  <el-form label-position="right" :model="form" ref="form" label-width="140px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="名称：">
                      <span>{{form.name}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="地址：">
                      <span>{{form.address}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="身份证号：" prop="idNo" >
                      {{form.idNo}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="身份证地址：" prop="address">
                      {{form.address}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="公司电话：">
                      <span>{{form.tel}}</span>
                    </el-form-item>
                  </el-col>
                   <el-col :span="12">
                    <el-form-item label="E-MAIL：">
                      <span>{{form.email}}</span>
                    </el-form-item>
                  </el-col>
                  
                   <el-col :span="24">
                    <el-form-item label="备注：">
                      <span>{{form.remark}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              </el-col>
              <el-col :span="2"  class="text-center">
                  <router-link :to="{path: '/router/supplierOuterWorkerList'}">
                  <el-button class="mt20" type="primary" size="mini">返回</el-button>
                </router-link>
              </el-col>
          </el-row>
          
      </div>
      <div class="tab-nav" style="padding: 0 15px;">
          <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerSeniorityInfo', query: {id: id,type:$route.query.type}}" tag="span">资质信息</router-link>
          </div>
          
          <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerPastExperience', query: {id: id,type:$route.query.type}}" tag="span">过往经历</router-link>
          </div>
          <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerContacts', query: {id: id,type:$route.query.type}}" tag="span">紧急联系人</router-link>
          </div>
           <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerSkills', query: {id: id,type:$route.query.type}}" tag="span">技能特长</router-link>
          </div>
          <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerContract', query: {id: id,type:$route.query.type}}" tag="span">往来合同</router-link>
          </div>
          
          <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerAccount', query: {id: id,type:$route.query.type}}" tag="span">往来账务</router-link>
          </div>
           <!-- <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerAboutProject', query: {id: id,type:$route.query.type}}" tag="span">有关项目</router-link>
          </div> -->
          <div class="nav-item tab">
              <router-link :to="{path: '/router/outerWorkerFileManage', query: {id: id,type:$route.query.type}}" tag="span">文件管理</router-link>
          </div>
          <!--<div class="nav-item tab">
            <router-link :to="{path: '/router/supplierServiceInfo', query: {id: id,type:$route.query.type}}" tag="span">{{$route.query.type!='0'?'供应商服务信息':'供应商商品信息'}}</router-link>
          </div> -->
      </div>
      <router-view style="padding: 0 15px;"></router-view>
  </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    data () {
      return {
        id: '',
        form: {}
      }
    },
    mounted () {
      this.loadData()
      this.id = this.$route.query.id
    },
    methods: {
      //返回
      back(){
        this.$router.push({path: '/router/supplierListOuterWorker'})
      },

      /**
       * 加载供应商详情
       */
      loadData () {
        this.listLoading = true
        Api.supplierBaseInfoOuterWorker({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
          }
        })
        this.listLoading = false
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
</style>
