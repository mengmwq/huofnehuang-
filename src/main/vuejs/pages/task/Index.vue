<template>
  <div id="ApprovalIndex">
    <div class="approvalBox">
      <!-- <div class="sys-title">人事 Personnel matters</div> -->
      <div class="pd20 approvalMatters">
        <div class="item" v-for="(item, index) in matters" :key="index" @click="showApproval(item)">
          <i :class="'iconfont '+item.icon"></i>
          <strong>{{item.name}}</strong>
          <span class="count" v-if="index===1">10</span>
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
          icon: 'icon-renwuguanli',
          name: '我的任务',
          path: '/router/tasksList'
        },
       
        {
          icon: 'icon-xiangmuguanli',
          name: '免税品项目',
          path: '/router/ArtDfgList'
        },
        {
          icon: 'icon-xiangmuguanli',
          name: '航材项目',
          path: '/router/airMaterialList'
        },
        {
          icon: 'icon-xiangmuguanli',
          name: '艺术品项目',
          path: '/router/entryApproval'
        },
         {
          icon: 'icon-huaban',
          name: '仓储管理',
          path: '/router/jobApproval'
        },
        {
          icon: 'icon-cheliangguanli',
          name: '车辆管理',
          path: '/router/entryApproval'
        },
        {
          icon: 'icon-toubiaoguanli',
          name: '投标管理',
          path: '/router/entryApproval'
        },
        {
          icon: 'icon-yichangguanli',
          name: '异常管理',
          path: '/router/entryApproval'
        }
      ],

    }
  },
  mounted () {
    //this.loadData()
  },
  methods: {
    showApproval (item) {
      this.$router.push({
        path: item.path
      })
    }
  }
}
</script>
<style lang="scss">
#ApprovalIndex {
  .approvalMatters {
    display: flex;
    justify-content:space-around;
    align-items: left;
    background:#eee;
    flex-wrap: wrap;
    .item {
      width:20%;
      margin: 20px;
      height: 80px;
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
