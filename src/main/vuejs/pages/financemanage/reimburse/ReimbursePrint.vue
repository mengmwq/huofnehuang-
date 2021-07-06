<template>
    <div v-if="form" class="printBg">
        
        <div class="printTitle">
            <div class="left">
                 <!-- 火凤凰(北京)国际艺术品物流有限公司 -->
                 申请日期：
                 <span v-if="form.applyDate">{{form.applyDate | DateFormat}}</span>
                 <span v-else>{{info.createDt | DateFormat}}</span>
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
                <tr>
                    <th>审批编号</th>
                    <td colspan="4">
                        {{targetId}}
                    </td>
                    <th>合同编号</th>
                    <td colspan="4">
                        {{form.contractCode}}
                    </td>
                </tr>
                <tr>
                    <th>申请人</th>
                    <td colspan="4">
                        <span v-if="info">{{info.ctUName}}</span>
                    </td>
                    <th>客户名称</th>
                    <td colspan="4">
                        {{form.customerName}}
                    </td>
                </tr>
                 <tr>
                    <th>项目编号</th>
                    <td colspan="4">
                        {{form.projectCode}}
                    </td>
                    <th>项目名称</th>
                    <td colspan="4">
                        {{form.projectName}}
                    </td>
                </tr>
               <tr>
                    <th>开票公司</th>
                    <td colspan="4">
                        {{form.companyOfReceipt}}
                    </td>
                    <th>时间</th>
                    <td colspan="4">
                        {{form.applyDatetime | timeFormat}}
                    </td>
                </tr>
                <tr>
                    <td colspan="10" style="padding:0;border:none;width:100%"> 
                       
                        <table class="subTable" v-if="form.reimburseApplyLoanDetailList">
                            <tr>
                                <th width="71">冲账明细</th>
                                <td v-for="(item,index) in tableHeader" :key="index">{{item.label}}</td>
                            </tr>
                            <tr v-for="(item,index) in form.reimburseApplyLoanDetailList" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.loanApplyId}}</td>
                                <td>{{item.loanAmount}}</td>
                                <td>{{item.remarks}}</td>
                            </tr>
                        </table>
                        <table class="subTable" v-if="form.reimburseApplyFeeDetailList">
                            <tr>
                                <th width="71">费用明细</th>
                                <td v-for="(item,index) in tableHeader1" :key="index">{{item.label}}</td>
                            </tr>
                            <tr v-for="(item,index) in form.reimburseApplyFeeDetailList" :key="index">
                                <td>{{index+1}}</td>
                                <td>{{item.reimburseIten}}</td>
                                <td>{{item.reimburseAmount}}</td>
                                <td>{{item.actualReimburse}}</td>
                                <td>{{item.remarks}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>合计金额</th>
                    <td colspan="4">
                       {{form.amount}}
                    </td>
                    <th>付款方式</th>
                    <td colspan="4">
                        {{form.payType|payTypeinFilter}}
                    </td>
                </tr>
                <tr>
                    <th>发票号</th>
                    <td colspan="4">
                       {{form.receiptNos}}
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
           tableHeader: [ {
            prop: 'loanApplyId',
            label: '借款单号',
            align: 'center',
            show: true
            }, {
            prop: 'loanAmount',
            label: '冲账金额（元）',
            align: 'center',
            show: true
            }, {
            prop: 'remarks',
            label: '备注',
            align: 'center',
            show: true
            }],
            tableHeader1: [{
            prop: 'reimburseIten',
            label: '用途',
            align: 'center',
            show: true
            }, {
            prop: 'reimburseAmount',
            label: '金额（元）',
            align: 'center',
            show: true
            }, {
            prop: 'actualReimburse',
            label: '实报',
            align: 'center',
            show: true
            }, {
            prop: 'remarks',
            label: '备注',
            align: 'center',
            show: true
            }]
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
