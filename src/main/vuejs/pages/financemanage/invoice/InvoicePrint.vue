<template>
    <div v-if="form" class="printBg">
        <div class="printTitle">
            <div class="left">
                 <!-- 火凤凰(北京)国际艺术品物流有限公司 -->
                 申请日期：{{form.applyDate | DateFormat}}
            </div>
            <div class="center">
                <h2 class="text-center">
                   {{$route.query.targetType | approvalTargetTypeFilter}}
                </h2>
                
            </div>
            <div class="right">
                <img width="77" src="http://cdn.m56.cn/qrcode" alt="">
                <span>用钉钉扫码</span>
            </div>
        </div>
        <table class="printTable">
            <tbody>
                <tr>
                    <th>审批编号</th>
                    <td colspan="9">
                        {{targetId}}
                    </td>
                </tr>
                <tr>
                    <th>申请人</th>
                    <td colspan="4">
                        <span v-if="info">{{info.ctUName}}</span>
                    </td>
                    <th>申请人部门</th>
                    <td colspan="4">
                        {{form.targetId}}
                    </td>
                </tr>
                <tr>
                    <th>部门</th>
                    <td colspan="9">
                        {{form.targetId}}
                    </td>
                </tr>
                 <tr v-if="$route.query.targetType=='006' 
                	|| $route.query.targetType=='005' || $route.query.targetType=='018'
                	|| $route.query.targetType=='017'">
                    <th>项目编号</th>
                    <td colspan="4">
                        {{form.projectCode}}
                    </td>
                    <th>项目名称</th>
                    <td colspan="4">
                        {{form.projectName}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='004'">
                    <th>项目编号</th>
                    <td colspan="4">
                        {{form.projectCode}}
                    </td>
                    <th>项目名称</th>
                    <td colspan="4">
                        {{info.projectName}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='006' || $route.query.targetType=='005'">
                    <th>项目负责人</th>
                    <td colspan="4">
                        {{form.targetId}}
                    </td>
                    <th>客户名称</th>
                    <td colspan="4">
                        {{form.customName}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='004'">
                    <th>项目负责人</th>
                    <td colspan="4">
                        {{form.targetId}}
                    </td>
                    <th>客户名称</th>
                    <td colspan="4">
                        {{form.customerName}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='014' || $route.query.targetType=='006' || $route.query.targetType=='005'">
                    <th>币种</th>
                    <td colspan="4">
                        <span v-if="form.attached && form.attached.Currency && form.currency">{{form.attached.Currency[form.currency].cnInfo}}</span>
                    </td>
                    <th>汇率</th>
                    <td colspan="4">
                        {{form.rate}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='006' || $route.query.targetType=='005'">
                    <th>付款金额</th>
                    <td colspan="4">
                        {{form.payment?form.payment:(form.amount/form.rate).toFixed(2)}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='014'">
                    <th>客户名称</th>
                    <td colspan="4">
                        {{form.customName}}
                    </td>
                    <th>付款金额</th>
                    <td colspan="4">
                        {{form.payment?form.payment:(form.amount/form.rate).toFixed(2)}}
                    </td>
                </tr>
                <!-- 发票审批-->
                <tr v-if="form.payeeOpenBank">
                    <th>开户银行</th>
                    <td colspan="4">
                        {{form.payeeOpenBank}}
                    </td>
                    <th>账号</th>
                    <td colspan="4">
                        {{form.payeeAccount}}
                    </td>
                </tr>
                <!-- 付款审批  targetType=005-->
                 <tr v-if="form.depositBank">
                    <th>开户银行</th>
                    <td colspan="4">
                        {{form.depositBank}}
                    </td>
                    <th>账号</th>
                    <td colspan="4">
                        {{form.bankCode}}
                    </td>
                </tr>
                <tr>
                    <td colspan="10" style="padding:0;border:none;width:100%"> 
                        <table class="subTable" v-if="$route.query.targetType=='005' || $route.query.targetType=='014'">
                            <tr>
                                <td>序号</td>
                                <td>费用名称</td>
                                <td>金额</td>
                                <td>备注</td>
                            </tr>
                            <tr v-for="(item,index) in form.payingApplyDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td> {{item.feeTypeName}}</td>
                                <td>{{item.totalAmount}}</td>
                                <td>{{item.remarks}}</td>
                            </tr>
                        </table>
                        <table class="subTable" v-if="$route.query.targetType=='006'">
                            <tr>
                                <td>序号</td>
                                <td>借款事由</td>
                      			<td>项目</td>
                      			<td>充值金额</td>
                      			<td>现金预支</td>
                                <td>金额</td>
                                <td>备注</td>
                            </tr>
                            <tr v-for="(item,index) in form.loanApplyDetails" :key="index">
                                <td>{{index+1}}</td>
                                <td> {{item.loanReason}}</td>
                                <td> {{item.projectName}}</td>
                                <td> {{item.rechargingAmount}}</td>
                                <td> {{item.cashAmount}}</td>
                                <td>{{item.amount}}</td>
                                <td>{{item.remarks}}</td>
                            </tr>
                        </table>
                        <table class="subTable" v-if="form.receiptApplyDetailList">
                            <tr>
                                <td>序号</td>
                                <td>货物或应税劳务名称</td>
                                <td>规则型号</td>
                                <td>单位</td>
                                <td>数量</td>
                                <td>价税合计</td>
                            </tr>
                            <tr v-for="(item,index) in form.receiptApplyDetailList" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.detailItem}}</td>
                                <td>{{item.specification}}</td>
                                <td>{{item.unit}}</td>
                                <td>{{item.number}}</td>
                                <td>{{item.sumPrice}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='016'">
                    <th>开票金额</th>
                    <td colspan="8">
                        {{form.fee}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='015'">
                    <th>开票金额</th>
                    <td colspan="4">
                        {{form.fee}}
                    </td>
                    <th>本次公里数</th>
                    <td colspan="4">
                        {{form.currentMileageNumber}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='015'">
                    <th>性质</th>
                    <td colspan="4">
                        <span v-if="info.attached">{{info.attached.MaintainType ? info.attached.MaintainType[info.maintainType].cnInfo :'其他'}}</span>
                    </td>
                    <th>所做项目</th>
                    <td colspan="4">
                        {{form.maintainContent}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='015'">
                    <th>服务单位</th>
                    <td colspan="4">
                        {{form.serviceCompany}}
                    </td>
                    <th>下次保养公里数</th>
                    <td colspan="4">
                        {{form.nextMileageNumber}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='016' || $route.query.targetType=='017'
                || $route.query.targetType=='018' || $route.query.targetType=='015'">
                    <th>车牌号码</th>
                    <td colspan="4">
                        {{form.registrationNumber}}
                    </td>
					<th>品牌型号</th>
                    <td colspan="4">
                        {{form.brand}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='018' || $route.query.targetType=='017'">
                    <th>开票金额</th>
                    <td colspan="4">
                        {{form.amount}}
                    </td>
                    <th>本次公里数</th>
                    <td colspan="4">
                        {{form.kilometres}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='018' || $route.query.targetType=='017'">
                    <th>始发地</th>
                    <td colspan="4">
                        {{form.startingPlace}}
                    </td>
                    <th>目的地</th>
                    <td colspan="4">
                        {{form.destination}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='016'">
                    <th>损失情况</th>
                    <td colspan="4">
                        {{form.lostInfo}}
                    </td>
					<th>驾驶员</th>
                    <td colspan="4">
                        {{form.uName}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='016'">
                    <th>事故原因</th>
                    <td colspan="8">
                        {{form.accidentReason}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='016'">
                    <th>事故时间</th>
                    <td colspan="4">
                        {{form.accidentDatetime |timeFormat}}
                    </td>
                    <th>事故地点</th>
                    <td colspan="4">
                        {{form.accidentSite}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='004' || $route.query.targetType=='006' 
                	|| $route.query.targetType=='005' || $route.query.targetType=='014'">
                    <th>开票金额</th>
                    <td colspan="4">
                        {{form.amount}}
                    </td>
                    <th>金额大写</th>
                    <td colspan="4">
                        {{form.chineseAmount}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='004'">
                    <th>开票类型</th>
                    <td colspan="4">
                       {{form.receiptType | invoiceType1}}
                    </td>
                </tr>
                <tr v-if="$route.query.targetType=='005'">
                    <th>发票号</th>
                    <td colspan="4">
                       {{form.receiptNo}}
                    </td>
                    <th>发票信息</th>
                    <td colspan="4">
                        {{form.receiptInfo}}
                    </td>
                </tr>
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
   
    name: "PaymentPrint",
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
        info:{
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
           //info:null,
           listData:[],
           //发票审批
           tableHeader_invoice: [
                {prop: 'detailItem', label: '货物或应税劳务名称', align: 'center', show: true},
                {prop: 'specification', label: '规则型号', align: 'center', show: true},
                {prop: 'unit', label: '单位', align: 'center', show: true},
                {prop: 'number', label: '数量', align: 'center', show: true},
                {prop: 'sumPrice', label: '价税合计', align: 'center', show: true}
            ],
            //付款审批
            tableHeader_pay: [{
                    prop: 'feeTypeName',
                    label: '费用名称',
                    align: 'center',
                    width:'200',
                    show: true
                }, {
                    prop: 'amount',
                    label: '金额',
                    align: 'center',
                    width:'100',
                    show: true
                }, {
                    prop: 'remarks',
                    label: '备注',
                    align: 'center',
                    width:'200',
                    show: true
                }],
        };
    },
    mounted(){
        console.log(this.fileList,'fff')
        //this.loadData()
       
    },

    computed: {
        pages() {
            // 求当前数据能打印的页数
            var pages_ = Math.ceil(
                this.tableData.detail.length / this.onePageRow
            ); // 向上取整数
            console.log(this.tableData.detail.length,'tableData')
            console.log(this.onePageRow,'onePageRow')
            console.log(this.pages_,'pages_')
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
	
       loadData() {
        Api.approvalDetailWithStep({id: this.id}).then(data => {

          if (data) {
            this.info = data
            
          }
        })
      }
    }
};
</script>
<style lang="scss">
.printBg{
    background:red;
}
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
