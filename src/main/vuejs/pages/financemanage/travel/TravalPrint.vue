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
                   {{$route.query.targetType | approvalTargetTypeFilter}}
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
                <tr v-if="form.loanApplyId">
                    <th>借款单编号</th>
                    <td colspan="9">
                        {{form.loanApplyId}}
                    </td>
                </tr>
                <tr>
                    <th>申请人</th>
                    <td colspan="4">
                        <span v-if="info">{{info.ctUName}}</span>
                         <span v-if="form.positionName">({{form.positionName}})</span>
                        
                    </td>
                    <th>申请人部门</th>
                    <td colspan="4">
                        {{form.orgName}}
                    </td>
                </tr>
                 <tr>
                    <th>项目编号</th>
                    <td colspan="4">
                        {{form.projectCode}}
                    </td>
                    <th>出差事由</th>
                    <td colspan="4">
                        {{form.reason}}
                    </td>
                </tr>
                <tr>
                    <th>项目名称</th>
                    <td colspan="4">
                        {{form.projectName}}
                    </td>
                    <th>客户名称</th>
                    <td colspan="4">
                      {{form.customerName}}
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
                                    <th>{{getSumAmount(form.travelTrafficDetails,'amount')}}</th>
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
                                <td>{{item.attached.CityLevel[item.cityLevel].cnInfo}}</td>
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
                   
                    <th>总计金额</th>
                    <td colspan="4">
                      {{form.amount}}
                    </td>
                    <th>实付金额</th>
                    <td colspan="9">
                       {{form.amount-form.item}}
                    </td>
                </tr>
                <tr v-if="form.item">
                     <th>预借款项</th>
                    <td colspan="4">
                        {{form.item}}
                    </td>
                   
                </tr>
                <!-- <tr>
                    <th>开票金额</th>
                    <td colspan="4">
                        {{form.amount}}
                    </td>
                    <th>金额大写</th>
                    <td colspan="4">
                        {{form.chineseAmount}}
                    </td>
                </tr>
                <tr>
                    <th>开票类型</th>
                    <td colspan="4">
                       {{form.receiptType | invoiceType1}}
                    </td>
                </tr> -->
                
                 <tr v-if="fileList.length>0">
                    <th>附件</th>
                    <td colspan="9">
                         <template v-for="item in fileList">
                            {{item.name}}
                        </template>
                    </td>
                </tr>
                <tr>
                     <th rowspan="9">审批流程</th>
                </tr>
                <template v-if="info">
                 <tr v-for="(item,index) in info.approvalDetails" :key="index">
                    <td colspan="9" v-if="index>0">
                            <div class="approvalItem" >
                                <div class="left">
                                    <div class="reason">
                                        {{item.reason}}
                                    </div>
                                    <div class="approvalPerson">
                                       {{item.approverName?item.approverName:item.positionName}} {{item.states=='1'?'已同意':''}} 
                                    </div>
                                </div>
                                <div class="right">
                                     {{item.updateDt |  timeFormat}}
                                </div>
                            </div>
                        
                        
                    </td>
                </tr>
                </template>
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
        // 查询条件
        searchQuery:{
             type: Object,
        },
        id:{
            type: String,
        },
        //审批详情
        // info:{
        //     type: Object
        // },
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
        console.log(this.fileList,'fff')
        this.loadData()
       
    },

    computed: {
        pages() {
            const form  = this.form
            const tableRows  = form.travelTrafficDetails.length +  form.travelHotelDetails.length + form.travelMealsDetails.length + form.travelSubsidyDetails.length +form.travelOtherDetails.length + info.approvalDetails.length;
            // 求当前数据能打印的页数
            var pages_ = Math.ceil(
                tableRows / this.onePageRow
            ); // 向上取整数
            return pages_ <= 0 ? 1 : pages_;
        },
        chineseTotal() {
            // 计算中文合计，如果忘记传入
            return this.getChineseNumber != null
                ? this.getChineseNumber(this.tableData.total_amount)
                : "您还没有传入getChineseNumber";
        }
    },

    methods: {
        getSumAmount(arr,attr){
            let sum =0;
            arr.map(item=>{
                sum+= item[attr]
            })
            return sum
        },
        loadData() {
            Api.approvalDetailWithStep({id: this.targetId}).then(data => {
                if (data) {
                    this.info = data
                }
            })
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
