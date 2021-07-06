<template>
  <div>
    <div class="title">投标详情
      <div class="line"></div>
    </div>
    <el-row class="car-info formDetails">
        <el-col :span="5">
          <div  class="biddingStatusBox">
            <div class="biddingStatus">
                  <div>项目状态</div>
                  <el-dropdown>
				  <span class="el-dropdown-link">
				    {{form.stateId | biddingFilter}}<i class="el-icon-arrow-down el-icon--right"></i>
				  </span>
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item v-if="form.category=== '0'"  @click.native="signUp(form,'0','0')">报名</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '0'"  @click.native="signUp(form,'1','0')">标书审核</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '0'"  @click.native="signUp(form,'2','0')">开标</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '1'"  @click.native="signUp(form,'3','1')">中标</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '1'"  @click.native="signUp(form,'4','1')">未中标</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '2'"  @click.native="signUp(form,'5','2')">流程被驳回</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '2'"  @click.native="signUp(form,'6','2')">未作投标文件</el-dropdown-item>
				    <el-dropdown-item v-if="form.category=== '2'"  @click.native="signUp(form,'7','2')">投标文件未投标</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>
            </div>
            <div class="btnBox text-center">
             <el-button v-if="form.category!=='0'" type="primary" @click="signUp(form,'0','0')" size="small">报名</el-button>
             <el-button v-if="form.category!=='1'" type="primary" @click="signUp(form,'3','1')" size="small">完成</el-button>
             <el-button v-if="form.category!=='2'" type="primary" @click="signUp(form,'5','2')" size="small">作废</el-button>
            </div>
          </div>
            
        </el-col>
        <el-col :span="16">
            <el-form label-position="right" :model="form" ref="form" label-width="140px">
            <el-row>
               <el-col :span="17">
                <el-form-item label="项目名称：">
                  <span>{{form.bidProjectName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="17">
                <el-form-item label="客户名称：">
                  <span>{{form.customerName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目编码：">
                  <span>{{form.projectCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
	            <el-form-item label="预算金额：">
	              <span>{{form.budgetAmount}}</span>
	            </el-form-item>
	          </el-col>
              <el-col :span="16">
                <el-form-item label="项目内容：">
                  <div class="quill-editor">
                    <div v-html="form.projectContet" class="ql-editor"></div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="2">
            <p>
              <el-button type="primary" @click="pageback()" size="small">返回</el-button>
            </p>
            <p>
               <el-button type="primary" size="mini" @click="editNewBidPro(form)">编辑</el-button>
            </p>
        </el-col>
    </el-row>
    <div class="tab-nav" style="padding: 0 15px;">
       <div class="nav-item tab">
        <router-link :to="{path: '/router/seniorityInfo', query: {id: this.id, applyId:form.applyId,states:form.states}}" tag="span">招投标信息</router-link>
      </div>
      <!--<div class="nav-item tab">
        <router-link :to="{path: '/router/bidSignup', query: {id: this.id, applyId:form.applyId,states:form.states}}" tag="span">投标报名</router-link>
      </div>-->
       <div class="nav-item tab">
        <router-link :to="{path: '/router/bidProjectSurvey', query: {id: this.id}}" tag="span">项目勘察</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/bidProjectFinance', query: {bidId: this.id, projectCode:form.projectCode}}" tag="span">实际收支</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/intercourseAccount', query: {id: this.id, projectCode:form.projectCode}}" tag="span">财务申请</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/biddingDocumentList', query: {id: this.id}}" tag="span">标书审核</router-link>
      </div>
      <!--<div class="nav-item tab">
        <router-link :to="{path: '/router/printList', query: {id: this.id}}" tag="span">投标前准备</router-link>
      </div>-->
      <div class="nav-item tab">
        <router-link :to="{path: '/router/feedback', query: {id: this.id}}" tag="span">开标信息</router-link>
      </div>
      <!--<div class="nav-item tab">
        <router-link :to="{path: '/router/resultTracking', query: {id: this.id}}" tag="span">结果跟踪</router-link>
      </div>-->
      <div class="nav-item tab">
        <router-link :to="{path: '/router/bidQuestion', query: {id: this.id}}" tag="span">问题反馈</router-link>
      </div>
      <!--<div class="nav-item tab">
        <router-link :to="{path: '/router/bidAttention', query: {id: this.id}}" tag="span">注意事项</router-link>
      </div>
      <div class="nav-item tab">
        <router-link :to="{path: '/router/bidContractsList', query: {id: this.id, projectCode:form.projectCode}}" tag="span">合同管理</router-link>
      </div>-->
      <div class="nav-item tab">
        <router-link :to="{path: '/router/bidFileManage', query: {id: this.id}}" tag="span">附件管理</router-link>
      </div>
    </div>
    <router-view style="padding: 0 15px;" @bidStatusChange="loadData" :projectInfo="form"></router-view>
    
  </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    data () {
      return {
        id: '',
        form: {},  //详情页面已用
        bindTyleList:{}
      }
    },
    mounted () {
      this.id=this.$route.query.id
      this.loadData()
    },
    methods: {
      /**
       * 已报名操作
       * */
      signUp(item,stateId,category) {
        this.$confirm('您确定【' + item.bidProjectName + '】修改状态吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.id = item.id
          this.form.stateId = stateId  //已经报名
          this.form.category = category
          Api.changeBidProjectStateById(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '修改完成'
              })
              // 重新渲染页面数据
              this.loadData()
            }
          })
        });
      },
      /**
       * 加载详情页面（上）
       */
      loadData () {
        this.listLoading = true
        let param = {id: this.$route.query.id}
        console.log(param)
        Api.queryBidProjectById(param).then(data => {
          if (data) {
            this.form = data
            // this.id= data.id
            // console.log('ok')
            this.listLoading = false
             
            if(this.form.category === '0'){
              this.bindTyleList= [{
			    label: '报名',
			    value: '0'
			  }, {
			    label: '标书审核',
			    value: '1'
			  },{
			    label: '开标',
			    value: '2'
			  }]
            }
             if (this.form.category === '1'){
            	this.bindTyleList = [{
				    label: '中标',
				    value: '3'
				  }, {
				    label: '未中标',
				    value: '4'
				  }]
            }
             if (this.form.category === '2'){
            	this.bindTyleList = [{
				    label: '流程被驳回',
				    value: '5'
				  }, {
				    label: '未作投标文件',
				    value: '6'
				  }, {
				    label: '投标文件未投标',
				    value: '7'
				  }]
            }
          }
        })
      },
      //编辑跳转
      editNewBidPro(item) {
        this.$router.push({path: '/router/editNewBiddingPro', query: {id: item.id}})
      },
      /**返回*/
      pageback(){
        // 跳转回去
        this.$router.push({path: '/router/biddingList'})
      }
    }
  }
</script>

<style lang="scss" scoped>
.biddingStatusBox{
   display: flex;
   flex-direction: column;
   justify-content: center;
    align-items: center;
    height:180px;
  .biddingStatus{
    margin-bottom:20px;
     width:120px;
     height:120px;
     background:#828bc4;
     border-radius:50%;
     color:#fff;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;

  }
}
  
  .title {
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 30px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #FFFFFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
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

