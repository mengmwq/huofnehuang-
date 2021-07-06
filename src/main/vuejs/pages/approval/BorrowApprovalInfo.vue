<template>
    <div>
        <p class="step-title">基本信息：</p>
        <el-form ref="form" :model="form" label-width="120px" class="formDetails">
            <el-row >
                <el-col :span="12">
                    <el-form-item label="项目编码：">{{form.projectCode}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同编号：">{{form.contractCode}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目名称：">{{form.projectName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人：">{{form.applyName}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请编号：">
                        <span>{{form.targetId}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户名称：">
                        <span>{{form.customerName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请部门：">{{form.orgName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="人员数量：">{{form.peopleNumber}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请日期：">{{form.applyDate | timeFormat}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预计天数：">{{form.daysNumber}}</el-form-item>
                </el-col>
            <el-col :span="12">
              <el-form-item label="币种：">
                <span>{{form.attached.Currency[form.currency].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：">
                <span>{{form.rate}}</span>
              </el-form-item>
            </el-col>
                <el-col :span="12">
                    <el-form-item label="付款金额：" prop="payment">
                        {{form.payment?form.payment:form.amount}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="折合人民币：" prop="chineseAmount">
                         <span v-if="form.amount">{{form.amount}}（{{form.chineseAmount}}）</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="合计金额：">{{form.amount}}</el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item label="领用人：">{{form.payeeName}}</el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注：">{{form.remarks}}</el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p class="step-title">费用明细：</p>
        <div style="padding: 0 4%;">
            <el-table class="page-table ml10" 
            show-summary :summary-method="getSummaries"
            :data="listData" stripe highlight-current-row  :cell-style="{color:'#333'}"
        >
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BorrowApprovalInfo",
        data () {
            return {
                form: {},
                listData: [],
                tableHeader: [{
                    prop: 'loanReason',
                    label: '借款事由',
                    align: 'center',
                    show: true
                }, {
                    prop: 'projectName',
                    label: '项目',
                    align: 'center',
                    show: true
                }, {
                    prop: 'rechargingAmount',
                    label: '充值金额',
                    align: 'center',
                    show: true
                }, {
                    prop: 'cashAmount',
                    label: '现金预支',
                    align: 'center',
                    show: true
                }, {
                    prop: 'amount',
                    label: '金额',
                    align: 'center',
                    show: true
                }, {
                    prop: 'conversion',
                    label: '折合人民币',
                    align: 'center',
                    show: true
                },{
                    prop: 'remarks',
                    label: '备注',
                    align: 'center',
                    show: true
                }]
            }
        },
        props: {
            info: Object
        },
        watch: {
            info: function (value) {
                this.form = value
                this.listData = value.loanApplyDetails
            }
        },
        methods:{
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计：';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (column.property!=='remarks' && !values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] = sums[index].toFixed(2)
                    //this.form.payment = sums[index]
                    //sums[index] += ' 元';
                } else {
                    sums[index] = '';
                }
                });
            
                return sums;
            },
        }
    }
</script>