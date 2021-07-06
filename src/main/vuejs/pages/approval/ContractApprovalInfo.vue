<template>
  <div class="formDetails">
    <el-form label-position="right" :model="form" ref="form" label-width="150px">
      <!-- 打印内容开始 -->
      <div class="print-data pd10">
        <p class="sys-title">基本信息：</p>
        <div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同号：" prop="contractCode" >
                {{form.contractCode}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编号：" prop="projectCode">
                {{form.projectCode}}
              </el-form-item>
            </el-col>
            
                <el-col :span="8" v-if="form.projectName">
                    <el-form-item label="项目名称：">
                        <span>{{form.projectName}}</span>
                    </el-form-item>
                </el-col>
        
                <!-- <el-col :span="8">
                    <el-form-item label="客户名称：">
                        <span>{{form.customerName}}</span>
                    </el-form-item>
                </el-col> -->
            <el-col :span="8">
              <el-form-item label="标题：" prop="title">
                {{form.title}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门：" prop="orgId" >
                {{form.orgName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对象类型：" prop="contractTargetType" >
                {{form.contractTargetType | contractObjectTypeFilter}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同对象：" prop="contractTargetId" >
                {{form.contractTargetName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同名称：" prop="contractName">
                {{form.contractName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同类型：" prop="contractTypeId" >
                {{form.contractTypeId | contractTypeFilter}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同期限：" prop="contractLimit" >
                {{form.contractLimit | timeFormat}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同金额：" prop="contractPrice" >
                {{form.contractPrice}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期：" prop="applyDate" >
                {{form.applyDate | timeFormat}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="省份：" prop="provinceId" >
                {{form.provinceId}}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合同摘要：" prop="outline" >
                {{form.outline}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对方单位名称1：" prop="company1Name" >
                {{form.company1Name}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="信用代码证号1：" prop="company1CreditCode">
                {{form.company1CreditCode}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.foreignContractNumber">
              <el-form-item label="外来合同编号：" prop="foreignContractNumber" >
                {{form.foreignContractNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.company2Name">
              <el-form-item label="对方单位名称2：" prop="company2Name">
                {{form.company2Name}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.company2CreditCode">
              <el-form-item label="信用代码证号2：" prop="company2CreditCode" >
                {{form.company2CreditCode}}
              </el-form-item>
            </el-col>
            
          </el-row>

          <el-row>
            <el-col :span="24" v-if="form.remarks">
              <el-form-item label="备注：" prop="remarks">
                {{form.remarks}}
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row style="padding: 10px;">
            <el-col :span="4">
              <el-form-item label="合同图片：">
                <img src=""/>
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "ContractApprovalInfo",
    data () {
      return {
        form: {},
        tableHeader: [{
          prop: 'goodsName',
          align: 'center',
          label: '货物名称',
          width: '100',
          show: true
        }, {
          prop: 'from',
          align: 'center',
          label: '起点',
          width: '100',
          show: true
        }, {
          prop: 'to',
          align: 'center',
          label: '终点',
          width: '100',
          show: true
        }, {
          prop: 'transportationModeId',
          align: 'center',
          label: '运输方式',
          width: '100',
          show: true
        }, {
          prop: 'agreementPrice',
          align: 'center',
          label: '协议价格',
          width: '100',
          show: true
        }, {
          prop: 'currencyId',
          align: 'center',
          label: '币种',
          width: '100',
          show: true
        },],
      }
    },
    props: {
      info: Object
    },
    watch: {
      info: function (value) {
        this.form = value
      }
    },
    mounted() {},
    methods: {
      //明细求和
      getSummaries(param) {
        //需要求和的字段
        const property = ['number','agreementPrice']
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
            if(column.property=='agreementPrice'){
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
    }

  }
</script>
