<template>
  <div>
    <el-form :inline="true" :model="form3" class="demo-form-inline" label-width="130px">
      <el-row>
        <el-form-item label="项目编号：">
          <span>{{form3.projectCode}}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="项目名称：">
          <span>{{form3.projectName}}</span>
        </el-form-item>
      </el-row>
      <el-row>
         <el-form-item label="客户名称：">
              <span>{{form3.customerName}}</span>
          </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="标书复审：">
          {{form3.firstHeadName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="标书撰写：">
          {{form3.secondHeadName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：">
          {{form3.secondHeadName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="文件资料">

        </el-form-item>
      </el-row>
      <div class="table-content">
        <el-table class="page-table" :data="listData2" stripe highlight-current-row :cell-style="{color:'#333'}"
        >
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column v-for="(header, index) in tableHeader1" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
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
  </div>
</template>

<script>
  export default {
    name: "BindingBookApprovalInfo",
    data () {
      return {
        form3: {},
        listData2: [],
        // 标书制作汇总表格      （审批公用，未做，后改）
        tableHeader1: [{
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
      info: function (value){
        this.form3 = value
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

<style scoped>

</style>
