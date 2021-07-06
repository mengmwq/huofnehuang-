<template>
  <div id="ApprovalIndex">
    <div class="approvalBox mt10">
        <div class="sys-title">业务 Business</div>
        <div class="pd20 approvalMatters" v-if="isShow">
          <div class="item" v-for="(item, index) in markets" :key="index" @click="showApproval(item)">
            <i :class="'iconfont '+item.icon"></i>
            <strong>{{item.name}}</strong>
            <span class="count" v-if="item.count">{{item.count}}</span>
          </div>
        </div>
      </div>
    
    <div class="approvalBox mt10">
      <div class="sys-title">财务 Finance</div>
      <div class="pd20 approvalMatters" v-if="isShow">
        <div class="item" v-for="(item, index) in finance" :key="index" @click="showApproval(item)">
          <i :class="'iconfont '+item.icon"></i>
          <strong>{{item.name}}</strong>
          <span class="count" v-if="item.count">{{item.count}}</span>
        </div>
      </div>
    </div>
    <div class="approvalBox mt10">
      <div class="sys-title">车辆 Vehicle</div>
      <div class="pd20 approvalMatters" v-if="isShow">
        <div class="item" v-for="(item, index) in vehicle" :key="index" @click="showApproval(item)">
          <i :class="'iconfont '+item.icon"></i>
          <strong>{{item.name}}</strong>
          <span class="count" v-if="item.count">{{item.count}}</span>
        </div>
      </div>
    </div>
    <div class="approvalBox mt10">
      <div class="sys-title">人事 Personnel matters</div>
      <div class="pd20 approvalMatters" v-if="isShow">
        <div class="item" v-for="(item, index) in matters" :key="index" @click="showApproval(item)">
          <i :class="'iconfont '+item.icon"></i>
          <strong>{{item.name}}</strong>
          <span class="count" v-if="item.count">{{item.count}}</span>
        </div>
      </div>
    </div>
    <div class="approvalBox mt10">
          <div class="sys-title">行政 Administration</div>
          <div class="pd20 approvalMatters" v-if="isShow">
            <div class="item" v-for="(item, index) in administrationMatters" :key="index" @click="showApproval(item)">
              <i :class="'iconfont '+item.icon"></i>
              <strong>{{item.name}}</strong>
              <span class="count" v-if="item.count">{{item.count}}</span>
            </div>
          </div>
        </div>
    
    <div class="approvalBox mt10">
          <div class="sys-title">仓库 Library</div>
          <div class="pd20 approvalMatters" v-if="isShow">
            <div class="item" v-for="(item, index) in library" :key="index" @click="showApproval(item)">
              <i :class="'iconfont '+item.icon"></i>
              <strong>{{item.name}}</strong>
              <span class="count" v-if="item.count">{{item.count}}</span>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import Api from '@/api/index'
export default {
  data () {
    return {
      // 审批事项
      matters: [
        {
          icon: 'icon-ruzhishenqing',
          name: '入职',
          path: '/router/entryApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-zhaopin',
          name: '招聘',
          path: '/router/jobApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-zhuanzheng1',
          name: '转正',
          path: '/router/regularApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-lizhi1',
          name: '离职',
          path: '/router/quitApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-wenjianjia',
          name: '公文',
          path: '/router/entryApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-caiwu',
          name: '福利',
          path: '/router/entryApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-meiyuan9',
          name: '薪资',
          path: '/router/entryApproval',
          count:0,
          key:'000',
        }
      ],
      isShow:true,
      administrationMatters: [
        {
          icon: 'icon-hangzhengzhichulieyin',
          name: '行政支出',
          path: '/router/expenditureApplication',
          count:0,
          key:'014',
        },
        {
          icon: 'icon-zhang',
          name: '章证',
          path: '/router/sealApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-wupinlingyong',
          name: '物品领用',
          path: '/router/officialApproval',
          count:0,
          key:'000',
        },
        {
          icon: 'icon-mingpian1',
          name: '名片',
          path: '/router/entryApproval',
          count:0,
          key:'000',
        },
        
      ],
      markets: [
        // {
        //   icon: 'icon-gen',
        //   name: '客户走访',
        //   //path: '/router/customerVisits'
        //   path: '',
        //   count:0,
        //   key:'000',
        // },
        // {
        //   icon: 'icon-shichangkaituo',
        //   name: '市场开拓',
        //    path: '',
        //    count:0,
        //   key:'000',
        //   //path: '/router/marketDevelopment'
        // },
        {
          icon: 'icon-toubiaoguanli',
          name: '投标',
          path: '/router/bidApproval',
          count:0,
          key:'003',
        },
        {
          icon: 'icon-baojia',
          name: '报价',
          path: '/router/offerApproval',
          count:0,
          key:'002',
        },
        {
          icon: 'icon-hetong',
          name: '合同',
          path: '/router/contractApproval',
          count:0,
          key:'001',
        },
        {
          icon: 'icon-shouye-ruzhubaoguanhang',
          name: '报关',
          path: '/router/customsApproval',
          count:0,
          key:'000',
        }
      ],
      library:[
        {
          icon: 'icon-wuliao',
          name: '物料',
          path: '/router/materialApplication',
          count:0,
          key:'010',
        },
        {
          icon: 'icon-gongju',
          name: '工具',
          path: '/router/toolsApplication',
          count:0,
          key:'011',
        }
      ],
      finance: [
        {
          icon: 'icon-fukuanshenpi',
          name: '付款',
          path: '/router/paymentApplication',
          count:0,
          key:'005',
        },
        {
          icon: 'icon-fapiao',
          name: '发票',
          path: '/router/invoicesApplication',
          count:0,
          key:'004',
        },
        {
          icon: 'icon-weibiaoti--',
          name: '借款',
          path: '/router/borrowApplication',
          count:0,
          key:'006',
        },
        {
          icon: 'icon-baoxiaoshenpi',
          name: '报销',
          path: '/router/reimburseApplication',
          count:0,
          key:'008',
        },{
          icon: 'icon-chalvbaoxiao',
          name: '差旅',
          path: '/router/travelApplication',
          count:0,
          key:'007',
        },
      ],
      vehicle:[
        {
          icon: 'icon-jiayouka',
          name: '油卡',
          path: '/router/oilCardApplication',
          count:0,
          key:'017',
        },
        {
          icon: 'icon-etcjiaofei',
          name: '过路费(ETC)',
          path: '/router/etcApplication',
          count:0,
          key:'018',
        },{
          icon: 'icon-weixiubaoyang',
          name: '维修保养',
          path: '/router/maintainApplication',
          count:0,
          key:'015',
        },
        {
          icon: 'icon-chuxiandengji',
          name: '出险记录',
          path: '/router/insuranceApplication',
          count:0,
          key:'016',
        }
      ],

    }
  },
  mounted () {
    //this.loadData()
    this.getApprovalTypeCount()
  },
  methods: {
    handleApproveCount(arr,obj){
      return this[arr].map(item=>{
          if(item.key=== obj.key){
             item.count = obj.value
             
          }
          return item
       })
       
    },
     //获取统计数量
    getApprovalTypeCount(){
       Api.getApprovalTypeCount({}).then(res=>{
          if(res.length>0){
            res.forEach((item,index)=>{
               //业务模块处理；
               this.handleApproveCount('finance',item)
               this.handleApproveCount('vehicle',item)
               this.handleApproveCount('library',item)
               this.handleApproveCount('markets',item)
                this.handleApproveCount('administrationMatters',item)
            })
          
          }
          this.isShow = true;
          console.log(res,'getApprovalTypeCount')
       })
    },
    showApproval (item) {
      sessionStorage.setItem('curApprovalTab','待审批')
      this.$router.push({
        path: item.path
      })
    }
  }
}
</script>
<style lang="scss">
#ApprovalIndex {
  // .title {
  //   height: 30px;
  //   color: #fff;
  //   background: #4d4d4d;
  //   font-size: 14px;
  //   font-weight: 700;
  //   line-height: 30px;
  //   padding-left: 10px;
  // }
  .approvalMatters {
    display: flex;
    justify-content: flex-start;
    align-items: left;
    background:#eee;
    .item {
      //width: calc(20% - 20px);
      width:144px;
      margin: 10px;
      height: 60px;
      background: #ccc;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      i {
        padding-right: 20px;
        font-size: 30px;
      }
      .count{
          position: absolute;
          top:0;
          right:0;
          display: inline-block;
          width:20px;
          height:20px;
          border-radius: 50%;
          background:  #c2292f;
          color:#fff;
          text-align: center;
      }
    }
    .item:hover {
      background: #c2292f;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
