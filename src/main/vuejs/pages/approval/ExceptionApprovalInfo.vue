<template>
  <div>
    <el-form :model="form" label-width="130px" ref="form">
      <div class="car-info">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目编码：" style="text-align: left;">
              <span>{{form.projectCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报时间：" style="text-align: left;">
              <span>{{form.reportDatetime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称：" style="text-align: left;">
              <span>{{form.projectName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报人员：" style="text-align: left;">
              <span>{{form.reporterName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商名称：" style="text-align: left;">
              <span>{{form.supplierName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" style="text-align: left;">
              <span>{{form.remarks}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="情况说明：" style="text-align: left;">
              <span class="text-left">{{form.content}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理时间：">
            {{form.handleTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理结果">
            {{form.result}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            {{form.remarks}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="相关文件：">
            <img src=""/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="">
            <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" label="序号" width="80"></el-table-column>
              <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop" :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "ExceptionApprovalInfo",
    data () {
      return {
        form: {},
        tableHeader: [{
          prop: 'name',
          align: 'center',
          label: '名称',
          width: '100',
          show: true
        }, {
          prop: 'desc',
          align: 'center',
          label: '描述',
          width: '200',
          show: true
        }, {
          prop: 'fileSize',
          align: 'center',
          label: '文件大小',
          width: '100',
          show: true
        }],
        /** 表格数据 */
        listData: [],
      }
    },
    props: {
      info: Object
    },
    watch: {
      info: function (value){
        this.form = value
        this.listData = value.errorAttachments
      }
    }
  }
</script>

<style scoped>

</style>
