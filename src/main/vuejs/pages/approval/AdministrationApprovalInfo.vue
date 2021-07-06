<template>
    <div>
        <p class="step-title">基本信息：</p>
        <el-form ref="form" :model="form" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="申请编号：">
                        <span>{{form.targetId}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="付款内容：" prop="content">
                        {{form.content}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                    <el-form-item label="合同号：" prop="contractId">
                        {{form.contractCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户名称：" prop="customId">
                        {{form.customName}}
                    </el-form-item>
                </el-col>
         </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="发票号：" prop="receiptNo">
                        {{form.receiptNo}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="发票信息：" prop="receiptInfo">
                        {{form.receiptInfo}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开户银行：" prop="depositBank">
                        {{form.depositBank}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="银行账号：" prop="bankCode">
                        {{form.bankCode}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
            <el-col :span="12">
              <el-form-item label="币种：">
                <span v-if="form.attached && form.currency">{{form.attached.Currency[form.currency].cnInfo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇率：">
                <span>{{form.rate}}</span>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="付款金额：" prop="payment">
                       {{form.payment?form.payment:(form.amount/form.rate).toFixed(2)}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="折合人民币：" prop="chineseAmount">
                         <span v-if="form.amount">{{form.amount}}（{{form.chineseAmount}}）</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注：" prop="remark">
                        {{form.remark}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p class="step-title">费用明细：</p>
        <div style="padding: 0 4%;">
            <el-table class="page-table" :data="listData" 
            show-summary :summary-method="getSummaries"
            stripe highlight-current-row :cell-style="{color:'#333'}" >
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                                 :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                                 <template slot-scope="scope">
                <div v-if="header.prop == 'feeTypeId'">
                  {{!scope.row.attached ? scope.row.attached.FeeType[scope.row.feeTypeId].cnInfo : ''}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
              </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "paymentApprovalInfo",
        data () {
            return {
                form: {},
                listData: [],
                tableHeader: [{
		          prop: 'feeTypeName',
		          label: '费用名称',
		          align: 'center',
		          width:'220',
		          show: true
		        }, {
		          prop: 'amount',
		          label: '单价',
		          align: 'center',
		          width:'80',
		          show: true
		        },{
		          prop: 'num',
		          label: '数量/重量',
		          align: 'center',
		          width:'80',
		          show: true
		        },{
		          prop: 'totalAmount',
		          label: '金额',
		          align: 'center',
		          width:'80',
		          show: true
		        }, {
		          prop: 'remarks',
		          label: '备注',
		          align: 'center',
		          width:'240',
		          show: true
		        }],
            }
        },
        props: {
            info: Object
        },
        watch: {
            info: function (value) {
                this.form = value
                this.listData = value.payingApplyDetails
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
                if (!values.every(value => isNaN(value)) && (column.property =='amount' || column.property =='num' || column.property =='totalAmount')){
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] = sums[index].toFixed(2)
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