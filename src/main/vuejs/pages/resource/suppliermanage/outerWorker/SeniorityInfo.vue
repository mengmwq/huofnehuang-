<template>
    <div>
        <el-form label-position="right" :model="form" ref="form" label-width="100px">
             <el-row>
           

            <el-col :span="12">
              <el-form-item label="开户银行：">
                   {{form.depositBank}}
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="统一社会信用代码：">
                  {{form.enterpriseCode}}
              
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对公账户：">
                   {{form.publicAccounts}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税号：">
                 {{form.dutyParagraph}}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="银行地址：">
                {{form.bankAddress}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    </div>
</template>

<script>
import Api from '@/api/index'
export default {
  data () {
    return {
      id: '',
      form: {}
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
      /**
       * 加载供应商详情
       */
      loadData () {
        this.listLoading = true
        Api.supplierBaseInfoOuterWorker({id: this.$route.query.id}).then((res) => {
          if (res) {
            this.form = res
          }
        })
        this.listLoading = false
      }
  }
}
</script>
