<template>
    <div>
        <el-form :model="info"  ref="info" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号码：">
                {{info.registrationNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌型号：">
                {{info.brand}}
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="车牌号码">
                {{info.registrationNumber}}
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="事故时间：">
                {{info.accidentDatetime | timeFormat}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驾驶员：">
                {{info.uName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故地点：">
                {{info.accidentSite}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事故原因123123213：">
               
                {{info.accidentReason}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="损失情况：">
               
                 {{info.lostInfo}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用金额：" >
            
                {{info.fee}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "InsuranceRecord",
        props: {
            info: Object
        }
    }
</script>