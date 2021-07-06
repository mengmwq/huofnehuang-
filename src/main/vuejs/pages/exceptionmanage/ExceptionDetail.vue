<template>
  <div>
    <div class="title">异常详情
      <div class="line"></div>
    </div>
    <div class="car-info formDetails">
      <el-form label-position="right" :model="form" ref="form" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目编码：">
              <span>{{form.projectCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报时间：">
              <span>{{form.reportDatetime | timeFormat}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称：">
              <span>{{form.projectName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报人员：">
              <span>{{form.reporterName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商名称：">
              <span>{{form.supplierName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：">
              <span>{{form.remarks}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="情况说明：">
              <span class="text-left">{{form.content}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="tab-nav" style="padding: 0 15px;">
      <div class="nav-item tab">
        <router-link :to="{path: '/router/exSituationDesc', query: {id: form.id, msg: form.content}}" tag="span">情况说明</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/exDealResult', query: {id: form.id, msg: form.result}}" tag="span">处理结果</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/exFileManage', query: {id: id}}" tag="span">文件管理</router-link>
      </div>
    </div>
    <router-view style="padding: 0 15px;"></router-view>
    <el-row style="margin-top: 20px;margin-right: 13px">
      <el-col :span="24" class="text-right">
        <router-link :to="{path: '/router/exceptionList'}">
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
      this.id = this.$route.query.id;
      Api.errorDetail({id: this.id}).then(data => {
        this.form = data;
      });
    },
    methods: {
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
