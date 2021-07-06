<template>
    <div>
       <el-form  :model="info" ref="info" label-width="130px">
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
            <el-col :span="12">
                 <el-form-item label="日期：">
                 {{info.maintainDate | DateFormat}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="本次公里数：">
                 {{info.currentMileageNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性质：">
                  <span v-if="info.attached">{{info.attached.MaintainType ? info.attached.MaintainType[info.maintainType].cnInfo :'其他'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所做项目：">
                   {{info.maintainContent}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务单位：">
                  {{info.serviceCompany}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下次保养公里数：">
                 {{info.nextMileageNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="费用金额：">
                   {{info.fee}}
              </el-form-item>
            </el-col>
            
          </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Maintenance",
        props: {
            info: Object
        }
    }
</script>