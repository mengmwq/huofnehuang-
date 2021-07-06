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
                <!-- <tr v-if="form.loanApplyId">
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
                </tr> -->
                <tr>
                    <th>项目名称</th>
                    <td colspan="4">
                        {{form.bidProjectName}}
                    </td>
                     <th>项目编号</th>
                    <td colspan="4">
                        {{form.projectCode}}
                    </td>
                    
                </tr>
                <tr>
                   <th>客户名称</th>
                    <td colspan="9">
                      {{form.customerName}}
                    </td>
                    <!-- <th>出差事由</th>
                    <td colspan="4">
                        {{form.reason}}
                    </td> -->
                </tr>
                <tr>
                    <th>联系人</th>
                    <td colspan="4">
                        {{form.contacterName}}
                    </td>
                    <th>联系电话</th>
                    <td colspan="4">
                        {{form.contacterTel}}
                    </td>
                </tr>
                <tr>
                    <th>报名方式</th>
                    <td colspan="4">
                        {{form.bidType}}
                    </td>
                    <th>预算金额</th>
                    <td colspan="4">
                        {{form.budgetAmount}}
                    </td>
                </tr>
                <tr>
                    <th>招标编号</th>
                    <td colspan="4">
                        {{form.bidCode}}
                    </td>
                    <th>开标时间</th>
                    <td colspan="4">
                        {{form.bidOpeningDate}}
                    </td>
                </tr>
                <tr>
                    <th>开标地址</th>
                    <td colspan="9">
                        {{form.bidOpeningSite}}
                    </td>
                   
                </tr>
                <tr>
                     <th>招标方式</th>
                    <td colspan="4">
                        {{form.bidType}}
                    </td>
                    <th>购买标书截止日</th>
                    <td colspan="4">
                        {{form.deadline}}
                    </td>
                </tr>
                <tr>
                    <th>项目内容</th>
                    <td colspan="9">
                        {{form.projectContet}}
                    </td>
                </tr>
                <tr>
                    <th>代理单位</th>
                    <td colspan="9">
                        {{form.agentCompany}}
                    </td>
                   
                </tr>
           
                <tr>
                     <th>代理单位联系人</th>
                    <td colspan="4">
                        {{form.agent}}
                    </td>
                    <th>代理电话</th>
                    <td colspan="4">
                        {{form.agentTel}}
                    </td>
                </tr>
                <tr>
                   
                    <th>备注</th>
                    <td colspan="9">
                        {{form.remarks}}
                    </td>
                </tr>
                
                 <!-- <tr v-if="fileList.length>0">
                    <th>附件</th>
                    <td colspan="9">
                         <template v-for="item in fileList">
                            {{item.name}}
                        </template>
                    </td>
                </tr> -->
                
                <tr>
                     <th rowspan="9" colspan="10">审批流程</th>
                </tr>
                <template v-if="form && form.approvalDetails">
                 <tr v-for="(item,index) in form.approvalDetails" :key="index">
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
    // 制作打印模版组件时，props区域尽量保留。
   
    props: {
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
    },
    
    data() {
        return {
           //info:null,
           listData:[],
        }
    },
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
