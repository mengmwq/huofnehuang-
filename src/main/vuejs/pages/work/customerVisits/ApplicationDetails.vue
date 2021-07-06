<template>
  <div class="pd20">
    <el-form class="pd20" label-width="140px" :model="editForm" ref="editForm">
     
          <el-form-item label="客户名称：">
            {{editForm.customerName}}
          </el-form-item>
           <el-form-item label="客户部门：">
            {{editForm.departmentName}}
          </el-form-item>
           <el-form-item label="客户岗位：">
            {{editForm.positionName}}
          </el-form-item>
          <el-form-item label="客户电话：">
            {{editForm.mobile}}
          </el-form-item>
          <el-form-item label="拜访日期：">
           {{editForm.visitDate}}
          </el-form-item>
          <el-form-item label="费用申请：">
            {{editForm.cost}}
          </el-form-item>
      <el-form-item label="情况简述：">
       {{editForm.description}}
      </el-form-item>
      <el-form-item label="跨部门审批：">
        <el-radio-group v-model="radio2">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="tar">
        <el-button type="default" @click="cancel">返回</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import Api from "@/api/index";
export default {
  data: function() {
    return {
      editForm: {
        departmentName:'',
        positionName:'',
        visitDate:null,
        cost:null,
        customerName: "",
        customerId: "",
        mobile:'',
        description:'',
      },
     
    };
  },
  mounted() {
    
  },
  methods: {
    
    cancel() {
      this.$router.push({
        path: "/router/customerVisits"
      });
    },
  }
};
</script>
