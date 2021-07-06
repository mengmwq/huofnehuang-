<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline" label-width="130px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目名称：">
                        <span>{{form.bidProjectName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报名方式：">
                        <span>{{form.signUpType === '001' ? '线上报名' : '现场报名'}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
         <el-form-item label="客户名称：">
              <span>{{form.customerName}}</span>
          </el-form-item>
      </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目内容：">
                        <span>{{form.projectContet}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="采购方：">
                        <span>{{form.purchaser}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="招标编号：">
                        <span>{{form.bidCode}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="采购方电话：">
                        <span>{{form.purchaserTel}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="招标方式：">
                        <span>{{form.bidType}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预算金额：">
                        <span>{{form.budgetAmount}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="标数：">
                        <span>{{form.packageNumber}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="购买证书截止日期:">
                        <span>{{form.deadline}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开标时间：">
                        <span>{{form.bidOpeningDate}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开标地址：">
                        <span>{{form.bidOpeningSite}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="代理单位：">
                        <span>{{form.agentCompany}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="代理单位电话：">
                        <span>{{form.agentCompanyTel}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="代理单位联系人：">
                        <span>{{form.agent}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="代理联系人电话：">
                        {{form.agentTel}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="报名情况：">
                        <span>{{form.signUpInfo}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注：">
                        <span>{{form.remarks}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="table-content">
                <el-table class="page-table" :data="listData" 
                show-summary :summary-method="getSummaries"
                stripe highlight-current-row :cell-style="{color:'#333'}"
                >
                    <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                                     :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                                     <template slot-scope="scope">
                                         <div v-if="header.prop=='createDt'">
                                             {{scope.row.createDt | DateFormat}}
                                         </div>
                                          <div v-else>{{scope.row[header.prop]}}</div>
                                     </template>
                    </el-table-column>
                </el-table>
            </div>
            
        </el-form>
        <div class="title">
        注意事项
          <div class="line"></div>
        </div>
        <Attention flag="approval"></Attention>
    </div>
</template>

<script>
import Api from '@/api/index'
import Attention from '@/pages/biddingmanage/Attention'
    export default {
        name: "BiddingApprovalInfo",
        components:{
            Attention,
        },
        data () {
            return {
                form: {},
                listData: [],
                // 标书制作汇总表格
                tableHeader: [{
                    prop: 'name',
                    align: 'center',
                    label: '文件名称',
                    show: true
                }, {
                    prop: 'createDt',
                    align: 'center',
                    label: '上传时间',
                    show: true
                }, {
                    prop: 'ctUName',
                    align: 'center',
                    label: '上传人员',
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
                this.listData = value.bidAttachmentRespList
            }
        },
        mounted(){
            //this.getAttentionList()
        },
        methods:{
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
            //获取注意事项
            getAttentionList(){
                const params = {
                    pageNum:1,
                    pageSize:10,
                }
                Api.queryBidMna(params).then(res=>{
                    console.log(res)
                })
            },
        },
    }
</script>
<style lang="scss" scoped>
    .title {
    margin-top:20px;
    color: #C2272D;
    margin-bottom: 10px;
    overflow: hidden;
    height: 40px;
  }

  .title .line {
    border-bottom: 2px dashed #DFDFDF;
    position: relative;
    left: 80px;
    margin-top: -11px;
  }
</style>
