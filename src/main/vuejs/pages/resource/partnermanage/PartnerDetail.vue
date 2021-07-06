<template>
  <div>
    <div class="title">战略合作伙伴详情
      <div class="line"></div>
    </div>
    <div class="car-info formDetails">
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="E-MAIL：">
              <span>{{form.email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：">
              <span>{{form.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司电话：">
              <span>{{form.tel}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="tab-nav" style="padding: 0 15px;">
      <div class="nav-item tab">
        <router-link :to="{path: '/router/partnerSeniorityInfo', query: {id: id}}" tag="span">资质信息</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/partnerContacts', query: {id: id}}" tag="span">联系人</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/partnerContract', query: {id: id}}" tag="span">往来合同</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/partnerAccount', query: {id: id}}" tag="span">往来账务</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/partnerFileManage', query: {id: id}}" tag="span">文件管理</router-link>
      </div>
    </div>
    <router-view style="padding: 0 15px;"></router-view>
    <el-row style="margin-top: 20px;margin-right: 13px">
      <el-col :span="24" class="text-right">
        <router-link :to="{path: '/router/partnerList'}">
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
        form: {}
      }
    },
    mounted () {
      this.loadData()
      this.id = this.$route.query.id
    },
    methods: {
      /**
       * 加载伙伴详情
       */
      loadData () {
        this.listLoading = true
        Api.partnerDetail({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
           // sessionStorage.setItem('partnerQualifications', JSON.stringify(res))
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

