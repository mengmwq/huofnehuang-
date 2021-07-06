<template>
  <div id="data-observation">
      <el-row :gutter="20" class="m10">
	      <el-col :span="24" class="text-right">
		        <el-date-picker
		          v-model="startDate"
		          style="width:240px;"
		          type="date"
		           clearable
		          format='yyyy-MM-dd'
		          value-format ="yyyy-MM-dd"
		          size="medium"
		          placeholder="起始年月日">
		        </el-date-picker>
		        <label for="">至</label>
		        <el-date-picker
		          v-model="endDate"
		           style="width:240px;"
		           clearable
		          type="date"
		          format='yyyy-MM-dd'
		          value-format ="yyyy-MM-dd"
		          size="medium"
		          placeholder="截止年月日">
		        </el-date-picker>
		        <el-button type="primary" size="medium" @click="init" class="btnTop">查询</el-button>
	        </el-col>
        </el-row>
    <el-row type="flex" class="mb10" justify="space-between" :gutter="10">
        <el-col :span="3">
            <div class="total-item tuhuang">
            全项目
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item first">
              总收入：
              <!-- <strong>{{statistical.topicAmount}}</strong> -->
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(statistical.totalIncome)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item second">
              总支出：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(statistical.totalExpenditure)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item third">
              总毛利润：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(statistical.totalGrossProfit)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item fourth">
             	总毛利润率：
              <strong><CountTo :start-val="0" :end-val="parseInt(statistical.grossProfit)" :duration="1950" class="card-panel-num"/>%</strong>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="mb10" justify="space-between" :gutter="10">
        <el-col :span="3">
            <div class="total-item tuhuang">
		已结案项目
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item first">
              总收入：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(closedStatistical.totalIncome)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item second">
              总支出：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(closedStatistical.totalExpenditure)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item third">
              总毛利润：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(closedStatistical.totalGrossProfit)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item fourth">
             	总毛利润率：
              <strong><CountTo :start-val="0" :end-val="parseInt(closedStatistical.grossProfit)" :duration="1950" class="card-panel-num"/>%</strong>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="mb10" justify="space-between" :gutter="10">
        <el-col :span="3">
            <div class="total-item tuhuang">
            操作完成项目
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item first">
              总收入：
              <!-- <strong>{{statistical.topicAmount}}</strong> -->
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(completeStatistics.totalIncome)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item second">
              总支出：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(completeStatistics.totalExpenditure)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item third">
              总毛利润：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(completeStatistics.totalGrossProfit)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item fourth">
             	总毛利润率：
              <strong><CountTo :start-val="0" :end-val="parseInt(completeStatistics.grossProfit)" :duration="1950" class="card-panel-num"/>%</strong>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="mb10" justify="space-between" :gutter="10">
          <el-col :span="3">
            <div class="total-item tuhuang">
            	操作中项目
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item first">
              	总收入：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(progressStatistics.totalIncome)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item second">
              	总支出：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(progressStatistics.totalExpenditure)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item third">
              	总毛利润：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(progressStatistics.totalGrossProfit)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item fourth">
             	总毛利润率：
              <strong><CountTo :start-val="0" :end-val="parseInt(progressStatistics.grossProfit)" :duration="1950" class="card-panel-num"/>%</strong>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="mb10" justify="space-between" :gutter="10">
          <el-col :span="3">
            <div class="total-item tuhuang">
            	报价中项目
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item first">
              	总收入：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(quotationStatistics.totalIncome)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item second">
              	总支出：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(quotationStatistics.totalExpenditure)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item third">
              	总毛利润：
              <strong>￥<CountTo :start-val="0" :end-val="parseInt(quotationStatistics.totalGrossProfit)" :duration="1950" class="card-panel-num"/></strong>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="total-item fourth">
             	总毛利润率：
              <strong><CountTo :start-val="0" :end-val="parseInt(quotationStatistics.grossProfit)" :duration="1950" class="card-panel-num"/>%</strong>
            </div>
          </el-col>
        </el-row>
    <el-row type="flex" justify="space-between" :gutter="10">
      <el-col :span="16">
        <div class="mapBox">
            <div class="mapTitle">
                <h3>公司分布</h3>
            </div>
            <div class="map">
                  <ChinaMap :resources="companyAreaList" v-if="companyAreaList.length > 0"/>
            </div>

            <div class="leftBar"></div>
            <div class="rightBar"></div>
            <img :src="dotPng" class="leftDot" alt="">
            <img :src="dotPng" class="rightDot" alt="">
            
        </div>
      </el-col>
      <el-col :span="8">
         <div class="provinceDataBox">
          <div class="title">营收排行（万元）</div>
          <div class="provinceList">
            <BarChart :resources="revenueRankingList" v-if="revenueRankingList.length>0" height="370px"/>
          </div>
        </div>
        
      </el-col>
    </el-row>
      <!-- <el-col :span="8">
        <div class="dayRank">
          <div class="title">营收项目 Top10</div>
          <ul class="groupList">
            <li v-for="(item,index) in revenueProjectsList" :key="index">
              <div class="projectName">
                <i class="number"
                  :class="{'first':index==0,'second':index==1,'third':index==2}"
                >{{index+1}}</i>
                <el-tooltip
                  class="item"
                  v-if="item.projectName.length>12"
                  effect="dark"
                  :content="item.projectName"
                  placement="top-start"
                >
                  <strong class="groupName">{{item.projectName.substring(0,12)}}...</strong>
                </el-tooltip>
                <strong class="groupName" v-else>{{item.projectName}}</strong>
              </div>
               <span>{{item.orgName}}</span>
              <span>约{{item.income}}万</span>
            </li>
          </ul>
        </div>
      </el-col> -->
    </el-row>
   
  </div>
</template>
<script>
import Api from "@/api/index";
import Util from "@/utils/";
import { Format } from "@/utils/TimeFormat";
import ChinaMap from '@/components/map/Map'
import BarChart from '@/components/charts/BarChart'
import CountTo from 'vue-count-to'
export default {
  name: "BreakEvenAnalysis",
  components: {ChinaMap,CountTo,BarChart},
  computed: {},
  data() {
    const jwt = JSON.parse(sessionStorage.getItem(jwt));
    const oDate = new Date()
    const curYear = oDate.getFullYear()
    console.log(curYear,'curYear')
    return {
      dotPng:'',
      listLoading:false,
      isShowDialog:false,
      quietGroupList:[],
      quietGroup:{
        totalCount:0,
      },
      closedStatistical:{
        totalExpenditure: 0,
        totalGrossProfit: 0,
        totalIncome: 0,
        grossProfit:0,
      },
      progressStatistics:{
        totalExpenditure: 0,
        totalGrossProfit: 0,
        totalIncome: 0,
        grossProfit:0,
      },
      completeStatistics:{
        totalExpenditure: 0,
        totalGrossProfit: 0,
        totalIncome: 0,
        grossProfit:0,
      },
      quotationStatistics:{
        totalExpenditure: 0,
        totalGrossProfit: 0,
        totalIncome: 0,
        grossProfit:0,
      },
      startDate:'',
      endDate:'',
      curYear:oDate,
      tableHeader: [ {
          prop: 'orgName',
          label: '分公司',
          align: 'left',
           width:'140',
          show: true
        }, {
          prop: 'project',
          label: '项目(进行/完成/总数)',
          align: 'left',
          width:'140',
          show: true,
          childrenHeader:[
            {
              prop: 'continue',
              label: '进行',
              align: 'left',
              show: true,
            },
            {
              prop: 'complete',
              label: '完成',
              align: 'left',
              show: true,
            },
            {
              prop: 'count',
              label: '总数',
              align: 'left',
              show: true,
            },
          ]
        }, {
          prop: 'quotationOrder',
          label: '报价订单',
          align: 'left',
          show: true
        }, {
          prop: 'totalIncome',
          label: '收入(元)',
          align: 'right',
          show: true
        }, {
          prop: 'totalExpenditure',
          label: '支出(元)',
          align: 'right',
          show: true
        }, {
          prop: 'totalGrossProfit',
          label: '毛利(元)',
          align: 'right',
          show: true
        }, {
          prop: 'grossProfit',
          label: '利润率',
          align: 'right',
          show: true
        },],
        listData:[],
      revenueRankingList:[],
      revenueProjectsList:[],
      companyList:[],  //分公司收列表
      companyAreaList:[
      ],
      statistical:{
        totalExpenditure: 0,
        totalGrossProfit: 0,
        totalIncome: 0,
        grossProfit:0,
      },
      hotTopic:[],
    };
  },
  mounted() {
    this.init()
  },

  methods: {
    init(year){
      let curYear = year
      if(!curYear){
        curYear = (new Date()).getFullYear()
      }
      //获取营收项目10
      this.getRevenueRankingStatistics(year)
      this.getSummaryStatistics(year)
      this.getClosedSummaryStatistics(year)
      this.getProgressStatistics(year)
      this.getQuotationStatistics(year)
      this.getCompleteStatistics(year)
      this.getCompanyStatistics(year)
      this.getLongitudeCompanyStatistics(year)
    },
    yearChange(val){
       this.init(val)
    },
    //获取地图上分公司
    getLongitudeCompanyStatistics(year){
      const params = {
      	startDate:this.startDate,
      	endDate:this.endDate,
      	status:'045'
      }
      Api.getLongitudeCompanyStatistics(params).then(res=>{
         this.companyAreaList = res
      })
    },
    getNumberFormat(val){
        return val?Util.numberFormat(val):'0'
      },
    //获取分公司
    getCompanyStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      }
      Api.getCompanyStatistics(params).then(res=>{
          this.companyList = res
      })
    },
    //获取已结案当前信息的总收入对比
    getClosedSummaryStatistics(year){
      const params = {
      	startDate:this.startDate,
      	endDate:this.endDate,
      	status:'045'
      }
      Api.getSummaryStatistics(params).then(res=>{
         this.closedStatistical = res
         if(this.closedStatistical.totalIncome === 0){
         	this.closedStatistical.grossProfit = 0;
         }else{
            this.closedStatistical.grossProfit = parseFloat((this.closedStatistical.totalGrossProfit/this.closedStatistical.totalIncome)*100).toFixed(2)
         }
      })
    },
    //获取已结案当前信息的总收入对比
    getSummaryStatistics(year){
      const params = {
      	startDate:this.startDate,
      	endDate:this.endDate,
      }
      Api.getSummaryStatistics(params).then(res=>{
         this.statistical = res
         if(this.statistical.totalIncome === 0){
         	this.statistical.grossProfit = 0;
         }else{
            this.statistical.grossProfit = parseFloat((this.statistical.totalGrossProfit/this.statistical.totalIncome)*100).toFixed(2)
         }
      })
    },
    //获取当前进行中项目信息的总收入对比
    getProgressStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      	status:'005'
      }
      Api.getSummaryStatistics(params).then(res=>{
         this.progressStatistics = res
         if(this.progressStatistics.totalIncome === 0){
         	this.progressStatistics.grossProfit = 0;
         }else{
            this.progressStatistics.grossProfit = parseFloat((this.progressStatistics.totalGrossProfit/this.progressStatistics.totalIncome)*100).toFixed(2)
         }
      })
    },
    //获取当前进行中项目信息的总收入对比
    getQuotationStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      	status:'004'
      }
      Api.getSummaryStatistics(params).then(res=>{
         this.quotationStatistics = res
         if(this.quotationStatistics.totalIncome === 0){
         	this.quotationStatistics.grossProfit = 0;
         }else{
            this.quotationStatistics.grossProfit = parseFloat((this.quotationStatistics.totalGrossProfit/this.quotationStatistics.totalIncome)*100).toFixed(2)
         }
      })
    },
    //获取当前信息的总收入对比
    getCompleteStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      	status:'012'
      }
      Api.getSummaryStatistics(params).then(res=>{
         this.completeStatistics = res
         if(this.completeStatistics.totalIncome === 0){
         	this.completeStatistics.grossProfit = 0;
         }else{
            this.completeStatistics.grossProfit = parseFloat((this.completeStatistics.totalGrossProfit/this.completeStatistics.totalIncome)*100).toFixed(2)
         }
      })
    },
    //获取当前信息的总收入对比
    getSummaryStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      }
      Api.getSummaryStatistics(params).then(res=>{
         this.statistical = res
         if(this.statistical.totalIncome === 0){
         	this.statistical.grossProfit = 0;
         }else{
            this.statistical.grossProfit = parseFloat((this.statistical.totalGrossProfit/this.statistical.totalIncome)*100).toFixed(2)
         }
      })
    },
    //获取营收排行
    getRevenueRankingStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      }
      Api.getRevenueRankingStatistics(params).then(res=>{
          this.revenueRankingList =res.map(item=>{
             item.value = item.totalIncome
             item.name = item.orgName
             return item
          })
      })
    },
    //获取营收项目10
    getRevenueProjectsStatistics(year){
      const params = {
        startDate:this.startDate,
      	endDate:this.endDate,
      }
      Api.getRevenueProjectsStatistics(params).then(res=>{
          this.revenueProjectsList = res
      })
    },

    numberFormat(value){
      return Util.numberFormat(value)
    },
    showDetails(row){
       this.$router.push({
         path:'/router/projectBreakEven',
         query:{
            year:new Date(this.curYear).getFullYear(),
            orgId:row.orgId,
            orgName:row.orgName
         }
       })
    },
    /**  沉寂群数据有变化  */
    dataChange(){
       this.getStGroupOverdueList();
    },
    /**获取群统计数量 */
    getStGroupAmount(){
       Api.getStGroupAmount().then(res=>{
          this.statistical = res
       })
    },
    getStGroupCityList(){
      Api.getStGroupCityList({}).then(res=>{
          let arr = []
          if(res.length>0){
              res.map(item => {
                let sItem = {
                  name: item.projectName,
                  value: item.groupUserAmount,
                  code:item.groupCity,
                };
                arr.push(sItem);
              });
              this.companyAreaList = arr;
          }
      })
    },
    /** 查询群活跃排名 */
    getStRevenueProjectsList(){
      const params = {}
       Api.getStRevenueProjectsList(params).then(res=>{
          this.revenueProjectsList = res
       })
    },
    /**  查询过期30天的群 */
    getStGroupOverdueList(){
      const params= {
        pageNumber:1,
        pageSize:5,
      }
      Api.getStGroupOverdueList(params).then(res=>{
          this.quietGroup = res
      })
    },
    /** 近期火热关键词 */
     selectHotCommunityTopic(){
       Api.selectHotCommunityTopic({}).then(res=>{
          this.hotTopic = res
       })
     },
    /** 关闭浮窗 */
    closeDialog(){
       this.isShowDialog = false
    },
    /** 查询更多群  */
    showMoreGroup(){
      this.isShowDialog = true
      // this.$router.push({
      //    path:'/router/group',
      //    query:{
      //       type:'1'
      //    }
      // })
    },
    /**
     * 确认解散群
     */
    disbandmentGroup(row) {
      const nameStr =  row.groupName
      const params =[row.groupId]
      this.$confirm(`确认解散群【${nameStr}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        Api.deleteKidsGroups(params).then((res) => {
          this.getStGroupOverdueList();
          this.$message({showClose:true, message:`解散群【${nameStr}】成功`, type:'success'});
        });
      }).catch(() => {});
    },
  
  }
};
</script>
<style lang="scss" scoped>
$color-primary: #64d2c2;
$color-red: #f05b2d;
$color-yellow: #fab048;
$color-purple: #9d5ba2;
$color-blue: #33CCFF;
$color-tuhuang: #A0522D;
$color-hover: #2c3232;
$color-gray: #4c4d4e;
$color-bg: #191a1b;
#data-observation {
  background: $color-bg;
  .total-item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #fff;
    text-align: center;
    strong {
      font-size: 24px;
      font-weight: 700;
    }
  }
  .mapBox {
    border: 1px solid $color-primary;
    position: relative;
    padding:10px;
   
    height:380px;
    overflow: hidden;
    .mapTitle{
        position: absolute;
        left:20px;
        top:10px;
        h3,p {
            margin:0;
            padding:0;
        }
        h3 {
            font-size:14px;
            color:$color-primary;
        }
        p {
            font-size:12px;
            color:$color-yellow
        }
    }
    .map {
       width:100%;
       
    }
    .leftBar{
        position:absolute;
        left:10px;
        top:10px;
        height:312px;
        border-left:1px solid $color-primary;
    }
    .leftDot  {
        position: absolute;
        bottom:10px;
        left:7px;
    }
    .rightBar{
        height:312px;
        border-right:1px solid $color-primary;
        position: absolute;
        bottom:10px;
        right:10px;
       
    }
    .rightDot  {
        position: absolute;
        top:10px;
        right:7px;
    }
  }
  .provinceDataBox {
    border: 1px solid $color-primary;
    .title {
      background: $color-primary;
      height: 30px;
      line-height: 30px;
      color: #333;
      text-align: center;
      font-weight: 700;
    }
  }
  .dayRank {
    border: 1px solid $color-primary;
    
    .title {
      background: $color-primary;
      height: 30px;
      line-height: 30px;
      color: #333;
      text-align: center;
      font-weight: 700;
    }
    .groupList {
      margin: 0;
      padding: 10px;
      list-style: none;
      height:410px;
      
      li {
        display: flex;
        justify-content: space-between;
        color: $color-primary;
        border-bottom: 1px dotted $color-primary;
        height: 40px;
        line-height: 40px;
        font-size: 12px;

        .projectName {
          display:block;
          width:180px;
        }
        .number {
         
          margin-right: 10px;
          display: inline-block;
          text-align: center;
          padding: 2px;
          height: 18px;
          width: 18px;
          line-height: 18px;
          background: $color-gray;
          color: #fff;
          border-radius: 4px;
          font-style: normal;
          font-size: 12px;
        }
      }
      li:hover {
        background: $color-hover;
      }
    }
  }
  .tagsBox {
    border: 1px solid $color-primary;
    height:215px;
    overflow: auto;
    padding: 10px;
    .tagsTitle {
      color: $color-primary;
      margin-left: 3px;
      margin-bottom: 10px;
    }
    .tagsCont {
      .el-tag {
        margin: 3px;
        background-color: transparent !important;
        color: $color-primary;
        border-color: $color-primary;
      }
    }
  }
  .groupBox{
    border: 1px solid $color-primary;
    padding: 10px;
    height:215px;
    .groupTitle{
        color: $color-primary;
        margin-left: 3px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    .groupTable{
        width:100%;
        thead tr,tbody tr {
            font-size:12px;
             height:20px;
            line-height: 20px;
        }
        thead tr {
            background-color:$color-primary;
             color:#333;
        }
        tbody tr{
            border-bottom:1px dotted $color-primary;
             color:$color-primary;
        }
        tbody tr:hover{
            background:$color-hover;
        }
        td,th {
            padding:5px;
        }
    }
  }
  .year{
    background-color:#fff;
    span {
      color:#000;
    }
  }
  .first {
    background: $color-red !important;
  }
  .second {
    background: $color-yellow !important;
  }
  .third {
    background: $color-purple !important;
  }
  .fourth {
    background: $color-blue !important;
  }
  .tuhuang {
    background: $color-tuhuang !important;
  }
  .aLink{
      color:$color-primary;
      text-decoration: none;
  }
  .aLink:hover {
      color:#fff;
       text-decoration: underline;
  }
  .mt10 {
      margin-top:10px;
  }
}
</style>

