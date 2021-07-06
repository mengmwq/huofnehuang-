<template>
    <div>
        <el-form label-width="120px" class="formDetails" :model="info" ref="info" >
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

                <el-form-item label="项目编码：">
                    {{info.projectCode}}
              </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="项目名称：" >
                 {{info.projectName}}
                </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="金额：" >
                 {{info.amount}}
                </el-form-item>
             </el-col>
            
             <el-col :span="12">
                <el-form-item label="本次公里数：">
                   {{info.kilometres}}
                </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="始发地：">
                    {{info.startingPlace}}
                </el-form-item>
             </el-col>
             <el-col :span="12">
                <el-form-item label="目的地：">
                  {{info.destination}}
                </el-form-item>
             </el-col>
          </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                form: {},
            }
        },
        props: {
            info: Object
        },
        // watch: {
        //     info: function (value) {
        //         this.form = value
        //         this.listData = value.receiptApplyDetailList
        //     }
        // }
    }
</script>