<template>
    <div>
        <p class="step-title">基本信息：</p>
        <el-form ref="form" :model="form" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目编号：">
                        <span>{{form.projectCode}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同编号：">
                        <span>{{form.contractCode}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
           <el-row>
                <el-col :span="12">
                    <el-form-item label="项目名称：">
                        <span>{{approvalForm.projectName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请编号：">
                        <span>{{form.id}}</span>
                    </el-form-item>
                </el-col>
           </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户名称：">
                        <span>{{form.customerName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否首次：">
                        <span>{{form.isFirst === '1' ? '是' : '否'}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开户银行：">
                        <span>{{form.payeeOpenBank}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款单位账号:">
                        <span>{{form.payeeAccount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开票金额：">
                        <span>{{form.amount}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="金额大写：">
                        <span>{{form.chineseAmount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开票类型：">
                        <span>{{form.receiptType | invoiceType1}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请日期：">
                        <span>{{form.applyDate | timeFormat}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="地址电话：">
                        <span>{{form.addrTel}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="领用人：">
                        <span>{{form.payeeName}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p class="step-title">发票明细：</p>
        <div style="padding: 0 4%">
            <el-table class="page-table" :data="listData" 
             show-summary :summary-method="getSummaries"
            stripe highlight-current-row  :cell-style="{color:'#333'}"
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
        name: "InvoiceApprovalInfo",
        data () {
            return {
                form: {},
                approvalForm:{},
                listData: [],
                tableHeader: [
                    {prop: 'detailItem', label: '货物或应税劳务名称', align: 'center', show: true},
                    {prop: 'specification', label: '规则型号', align: 'center', show: true},
                    {prop: 'unit', label: '单位', align: 'center', show: true},
                    {prop: 'number', label: '数量', align: 'center', show: true},
                    {prop: 'sumPrice', label: '价税合计', align: 'center', show: true}
                ],
            }
        },
        props: {
            info: Object,
            approvalDetails:Object,
        },
        watch: {
            info: function (value) {
                this.form = value
                this.listData = value.receiptApplyDetailList
            },
            approvalDetails: function (value) {
                this.approvalForm = value
            }
        },
        methods: {
            //明细求和
      getSummaries(param) {
        //需要求和的字段
        const property = ['number','sumPrice']
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));

          if (!values.every(value => isNaN(value)) && (property.some(item=>item==column.property))){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           if(column.property=='sumPrice'){
               sums[index] = sums[index].toFixed(2)
           }
            //this.sumAmount +=sums[index]
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
        },
    }
</script>