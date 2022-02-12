<template>
  
   
    <div v-if="form">
        
        <div class="printTitle">
            <div class="left">
                 <!-- 火凤凰(北京)国际艺术品物流有限公司 -->
                 申请日期：
                 <span v-if="form.applyDate">{{form.applyDate | DateFormat}}</span>
                 <span v-else>{{form.createDt | DateFormat}}</span>
              
            </div>
            <div class="center">
                <h2 class="text-center">
                   差旅审批单
                </h2>
                
            </div>
            <div class="right">
                <!-- <i class="qrcode"></i> -->
                <img width="77" src="http://cdn.m56.cn/qrcode" alt="">
                <span>用钉钉扫码</span>
            </div>
        </div>
        
        <table class="printTable">
            <tbody>
                <tr>
                    <th width="110">申请人</th>
                    <td colspan="4">
                        <span>{{form.applyName}}</span>
                         <span v-if="form.orgName">({{form.orgName}})</span>
                        
                    </td>
                    <th  width="110">借款编号</th>
                    <td colspan="4">
                        {{form.loanApplyId}}
                    </td>
                </tr>
                 <tr>
                     <th>项目名称</th>
                    <td colspan="4">
                        {{form.projectName}}
                    </td>
                    <th>项目编号</th>
                    <td colspan="4">
                        {{form.projectCode}}
                    </td>
                    
                </tr>
                <tr>
                    
                    <th>客户名称</th>
                    <td colspan="4">
                      {{form.customerName}}
                    </td>
                    <th>出差事由</th>
                    <td colspan="4">
                        {{form.reason}}
                    </td>
                </tr>
                
                <tr>
                    <th>起止日期</th>
                    <td colspan="4">
                      <span>{{form.beginDate}}  &nbsp;&nbsp;至&nbsp;&nbsp; {{form.endDate}}</span>
                    </td>
                    <th>目的地</th>
                    <td colspan="4">
                      {{form.targetSite}}
                    </td>
                </tr>
                 <tr>
                    <th>出差人</th>
                    <td colspan="4">
                      <span style="margin: 0 5px" v-for="(item, index) in form.travelers" :key="index">{{item.uName}}</span>
                    </td>
                    <th>总人数</th>
                    <td colspan="4">
                        {{form.peopleNumber}}
                    
                    </td>
                </tr>
                <tr>
                   
                    <th>总计金额</th>
                    <td colspan="4">
                      {{form.amount}}
                    </td>
                    <th>实付金额</th>
                    <td colspan="4">
                     
                       {{(form.amount-form.item) | filterData}}
                    </td>
                </tr>
                <tr v-if="form.item">
                     <th>预借款项</th>
                    <td colspan="4">
                        {{form.item}}
                    </td>
                   
                </tr>
                <tr>
                    <td colspan="10" style="padding:0;border:none;width:100%"> 
                        <table class="subTable" v-if="form.travelTrafficDetails.length>0">
                            <tr>
                                 <th width="80">交通明细</th>
                                <td v-for="(item,index) in trafficHeader" :key="index">{{item.label}}</td>
                            </tr>
                            <tr v-for="(item,index) in form.travelTrafficDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.trafficTypeId | trafficTypeFilter}}</td>
                                <td>{{item.itemDate | DateFormat}}</td>
                                <td>{{item.traveler}}</td>
                                <td>{{item.startSite}}</td>
                                <td>{{item.endSite}}</td>
                                <td>{{item.amount}}</td>
                                <td>{{item.remarks}}</td>
                            </tr>
                            <tfoot v-if="form.travelTrafficDetails.length>1">
                                 <tr>
                                    <th  colspan="6">合计</th>
                                    <th>{{getSumAmount(form.travelTrafficDetails,'amount').toFixed(2)}}</th>
                                    <td></td>
                                 </tr>
                            </tfoot>
                        </table>
                        <table class="subTable" v-if="form.travelHotelDetails.length>0">
                             <tr>
                                 <th width="80">住宿明细</th>
                                <td v-for="(item,index) in listStay" :key="index">{{item.label}}</td>
                            </tr>
                            <tr v-for="(item,index) in form.travelHotelDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.beginDate | DateFormat}}</td>
                                <td>{{item.endDate | DateFormat}}</td>
                                <td>{{item | CityLevelArr}}</td>
                                <td>{{item.residents}}</td>
                                <td>{{item.amount}}</td>
                                <td>{{item.roomNum}}</td>
                                <td>{{item.days}}</td>
                                <td>{{item.totalAmount}}</td>
                                <td>{{item.remarks}}</td>
                            </tr>
                            <tfoot v-if="form.travelHotelDetails.length>1">
                                 <tr>
                                    <th  colspan="8">合计</th>
                                    <th>{{getSumAmount(form.travelHotelDetails,'totalAmount')}}</th>
                                    <td></td>
                                 </tr>
                            </tfoot>
                        </table>
                        <table class="subTable" v-if="form.travelMealsDetails.length>0">
                             <tr>
                                 <th width="80">餐费明细</th>
                                <td v-for="(item,index) in listMeal" :key="index">{{item.label}}</td>
                            </tr>
                            <tr v-for="(item,index) in form.travelMealsDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.day | DateFormat}}</td>
                                <td>{{item.amount}}</td>
                                <td>{{item.subsidyAmount}}</td>
                                <td>{{item.totalAmount}}</td>
                            </tr>
                            <tfoot v-if="form.travelMealsDetails.length>1">
                                 <tr>
                                    <th  colspan="4">合计</th>
                                    <th>{{getSumAmount(form.travelMealsDetails,'totalAmount')}}</th>
                                 </tr>
                            </tfoot>
                        </table>
                        <table class="subTable" v-if="form.travelSubsidyDetails.length>0">
                            <thead>
                                <tr>
                                    <th width="80">补贴明细</th>
                                    <td v-for="(item,index) in listSubsidy" :key="index">{{item.label}}</td>
                                </tr>
                            </thead>
                             
                            <tr v-for="(item,index) in form.travelSubsidyDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.beginDate | DateFormat}}</td>
                                 <td>{{item.endDate | DateFormat}}</td>
                                 <td>{{item.days}}</td>
                                <td>{{item.subsidyAmount}}</td>
                                <td>{{item.otherSubsidyAmount}}</td>
                                <td>{{item.totalAmount}}</td>
                                <td>{{item.remarks}}</td>
                                
                            </tr>
                            <tfoot v-if="form.travelSubsidyDetails.length>1">
                                 <tr>
                                    <th  colspan="6">合计</th>
                                    <th>{{getSumAmount(form.travelSubsidyDetails,'totalAmount')}}</th>
                                    <td></td>
                                 </tr>
                            </tfoot>
                        </table>
                        <table class="subTable" v-if="form.travelOtherDetails.length>0">
                             <tr>
                                 <th width="80">其他明细</th>
                                <td v-for="(item,index) in listOther" :key="index">{{item.label}}</td>
                            </tr>
                            <tr v-for="(item,index) in form.travelOtherDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.day | DateFormat}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.amount}}</td>
                                <td>{{item.num}}</td>
                                <td>{{item.totalAmount}}</td>
                                <td>{{item.remarks}}</td>
                                
                            </tr>
                            <tfoot v-if="form.travelOtherDetails.length>1">
                                 <tr>
                                    <th  colspan="5">合计</th>
                                    <th>{{getSumAmount(form.travelOtherDetails,'totalAmount')}}</th>
                                    <td></td>
                                 </tr>
                            </tfoot>
                        </table>
                    </td>
                </tr>
                
                
                 <tr>
          <th colspan="10">
            审批流程
            <span style="margin-left:20px;font-weight:500">(审批时间为空，代表审批处于待审批状态)</span>
          </th>
        </tr>
        <tr>
          <td colspan="10" v-if="approvalInfo" style="padding:0;border:none;width:100%">
            <table class="subTable" v-if="approvalInfo && approvalInfo.approvalDetails">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>审批信息</th>
                  <th>审批时间</th>
                  <!-- <th>审批结果</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in approvalInfo.approvalDetails" :key="index">
                  <td>{{index+1}}</td>
                  <td>
                    <!--状态是已驳回-->
                    <template v-if="item.states ==='0'">{{item.approverName}}</template>

                    <!--状态是已审批 或签-->
                    <!-- <template v-if="item.states ==='1' && index==0">
                                            <span>{{item.positionName}} </span>
                                            <span v-if="item.positionName && item.approverName">：</span>
                                            <span v-if="item.approverName">
                                            {{item.approverName}}
                                            </span>
                    </template>-->
                    <template v-if="item.states!=='2' && item.states!=='3'">
                      <!--状态是已审批 会签-->
                      <template v-if="item.approvalNode && item.approvalNode.type==='0'">
                        <strong
                          v-for="(child, index) in item.approvalNode.approverList"
                          :key="index"
                        >
                          {{child.approverName?child.approverName:child.pendingApprovalName}}
                          <span
                            :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                          >({{getCurNodeStatus(child.states)}})</span>
                          <span
                            :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                            v-if="child.reason"
                          >{{child.reason}}</span>
                        </strong>
                      </template>
                      <!--状态是已审批 或签-->
                      <template v-if="item.approvalNode && item.approvalNode.type==='1'">
                        <template v-for="(child, index) in item.approvalNode.approverList">
                          <strong v-if="child.states==='1' || child.states==='0'" :key="index">
                            {{child.approverName?child.approverName:child.pendingApprovalName}}
                            <span
                              :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                            >({{getCurNodeStatus(child.states)}})</span>
                            <span
                              :class="{'text-danger':child.states==='0','text-success':child.states==='1'}"
                            >{{child.reason}}</span>
                          </strong>
                        </template>
                      </template>
                    </template>
                    <!--状态是待审核,审批中时-->
                    <template
                      v-if="item.states ==='2' || item.states ==='3'"
                    >{{getNodeInfo(item.approvalNode)}}</template>
                    <span
                      v-if="item.approvalNode && (item.approvalNode.approverList[0].pendingApprovalType!=='0' || item.approvalNode.approverList.length>1) "
                    >({{item.approvalNode.type==='1'?'或签':'会签'}})</span>
                  </td>
                  <td>
                    <template
                      v-if="item.states ==='1' || item.states ==='0' "
                    >{{item.updateDt | timeFormat}}</template>
                  </td>
                  <!-- <td>{{child.reason}}</td> -->
                </tr>
              </tbody>
            </table>
          </td>
          <td colspan="9" v-else>尚未提交审批流程，请在“申请”选项卡中列表页提交审批</td>
        </tr>
        <tr v-if="form && form.applyAttachments.length>0">
          <th>附件</th>
          <td colspan="9">{{getAttachmentList(form.applyAttachments)}}</td>
        </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import Api from '@/api/index'

export default {
   
       name: "TravelPrint",

    // 制作打印模版组件时，props区域尽量保留。
   
    props: {
        id:{
            type: String,
        },
        //审批详情
        approvalInfo:{
            type: Object
        },
        //申请详情表单
        form:{
            type: Object,
        }, 
        //发票编码
        targetId:{
            type:String,
        },
        // 附件信息
        fileList:{
            type:Array,
        },
        // 每页多少行
        onePageRow: {
            type: Number,
            default: 10
        },
        // 是否插入空白行
        blankLines: {
            type: Boolean,
            default: true
        },

        getChineseNumber: Function // 求数字的中文写法，从easyPrint组件传入
    },
    
    data() {
        return {
           info:null,
           listData:[],
           trafficHeader: 
            [
                {prop: 'trafficTypeId', label: '工具类型', align: 'center', show: true},
                {prop: 'itemDate', label: '日期', align: 'center', show: true},
                {prop: 'traveler', label: '人员', align: 'center', show: true},
                {prop: 'startSite', label: '起点', align: 'center', show: true},
                {prop: 'endSite', label: '终点', align: 'center', show: true},
                {prop: 'amount', label: '票价', align: 'center', show: true},
                {prop: 'remarks', label: '备注', align: 'center', show: true}
            ],
            listStay: [
            {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
            {prop: 'endDate', label: '结束日期', align: 'center', show: true},
            {prop: 'cityLevel', label: '类别', align: 'center', show: true},
            {prop: 'residents', label: '住宿人数', align: 'center', show: true},
            {prop: 'amount', label: '单价', align: 'center', show: true},
            {prop: 'roomNum', label: '房间数', align: 'center', show: true},
            {prop: 'days', label: '天数', align: 'center', show: true},
            {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
            {prop: 'remarks', label: '备注', align: 'center', show: true}
            ],
            listMeal: [
            {prop: 'day', label: '日期', align: 'center', show: true},
            {prop: 'amount', label: '金额', align: 'center', show: true},
            {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
            {prop: 'totalAmount', label: '金额合计', align: 'center', show: true}
            ],
            listSubsidy: [
            {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
            {prop: 'endDate', label: '结束日期', align: 'center', show: true},
            {prop: 'days', label: '合计天数', align: 'center', show: true},
            {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
            {prop: 'otherSubsidyAmount', label: '其他补贴', align: 'center', show: true},
            {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
            {prop: 'remarks', label: '备注', align: 'center', show: true}
            ],
            listOther: [
            {prop: 'day', label: '日期', align: 'center', show: true},
            {prop: 'name', label: '名称', align: 'center', show: true},
            {prop: 'amount', label: '单价', align: 'center', show: true},
            {prop: 'num', label: '数量', align: 'center', show: true},
            {prop: 'totalAmount', label: '总价', align: 'center', show: true},
            {prop: 'remarks', label: '备注', align: 'center', show: true}
            ],
        };
    },
    mounted(){
      console.log(this.approvalInfo,)
     
       
    },
    filters:{
      CityLevelArr(item){
        if(!item.cityLevel){
          return '';
        }
        return item.attached.CityLevel[item.cityLevel].cnInfo
      },

    },
    methods: {
        getSumAmount(arr,attr){
            let sum =0;
            arr.map(item=>{
                sum+= item[attr]
            })
            return sum
        },
        //获取附件名称
        getAttachmentList(arr) {
        if (arr.length > 0) {
            return arr.map(item => item.name).toString();
        } else {
            return "";
        }
        },
        getCurNodeStatus(status) {
        const statusName = ["已驳回", "已通过", "审批中"];
        return statusName[status];
        },
        //获取节点信息
        getNodeInfo(node) {
        console.log(node, node.approverList, "getNOdelIst");
        if (node && node.approverList) {
            const approverList = node.approverList
            .map(item => item.pendingApprovalName)
            .toString();
            return approverList;
        } else {
            return "";
        }
        }
    }
};
</script>
<style lang="scss">
.printTitle {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .right,.center{
        display: flex;
        flex-direction: column;
    }
}
.printTable,.subTable {
    
    border-collapse: collapse;
    width:100%;
    th,td {
        border:1px solid #ccc;
        padding:5px;
        height:30px;
    }
    .approvalItem {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .left {
            display: flex;
            flex-direction: column; 
        }
    
    }
}
.subTable td {
    text-align: center;
}

    
</style>
