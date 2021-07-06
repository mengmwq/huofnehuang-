<template>
  <div>
    <el-form  :model="form" label-width="120px">
          <div ref="printContent" v-if="form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目名称">
                  <el-input v-model="form.bidProjectName" ></el-input>
                </el-form-item>
              </el-col>
           
              <el-col :span="8">
                <el-form-item label="采购方">
                  <el-input v-model="form.purchaser"  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开标时间">
                  <el-date-picker v-model="form.bidOpeningDate" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="开标地址">
                  <el-input v-model="form.bidOpeningSite" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报价">
                  <el-input v-model="form.budgetAmount" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投标文件">
                  <el-input v-model="form.bidDocumentAtt.name" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开标一览表">
                  <el-input v-model="form.qualificationAtt.name" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电子版 : ">
                  <el-row>
                    <el-col :span="8">
                      U盘<span v-show="printFlag">{{trueFlag1? '是' : '否'}}</span>
                      <el-switch v-show="!printFlag"
                        v-model="trueFlag1"
                        active-color="#13ce66"
                        inactive-color="#D4D4D4">
                      </el-switch>

                    </el-col>
                    <el-col :span="8">
                      光盘<span v-if="printFlag">{{trueFlag2? '是' : '否'}}</span>
                      <el-switch v-else
                        v-model="trueFlag2"
                        active-color="#13ce66"
                        inactive-color="#D4D4D4">
                      </el-switch>
                    </el-col>
                    <el-col :span="8">
                      CA证书<span v-if="printFlag">{{trueFlag3? '是' : '否'}}</span>
                      <el-switch v-else
                        v-model="trueFlag3"
                        active-color="#13ce66"
                        inactive-color="#D4D4D4">
                      </el-switch>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="text-center">
            <el-button type="primary" @click="printList">确 定</el-button>
          </div>
        </el-form>
  </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    data () {   //queryBidProjectById
      return {
        printFlag: false,
        trueFlag1:true,
        trueFlag2:true,
        trueFlag3:true,
        id: '',
        form: {
          bidDocumentAtt: {},
          bidAttorney: {},
          bidderIdCard: {},
          qualificationAtt: {}
        }
      }
    },
    mounted () {
      this.id=this.$route.query.id
      this.loadData()
    },
    methods: {
        cancelPrint() {
       
        this.form = {
          bidDocumentAtt: {},
          bidAttorney: {},
          bidderIdCard: {},
          qualificationAtt: {}
        }
      },
         /**
       * 打印清单
       * */
      printList(item) {
        //检测弹窗弹出就确认提交
        this.form.stateId = '004'
        Api.changeBidProjectStateById(this.form).then(data => {
          if (data) {
            this.printFlag = true
            //  this.trueFlag1=true
            // this.trueFlag2=true
            // this.trueFlag3=true
            this.$print(this.$refs.printContent)
            // 重新渲染页面数据
            this.loadData()
          }
        })

      },
      /**
       * 加载
       */
      loadData () {
        this.listLoading = true
        const sId =  this.$route.query.id
        let param = {id: sId}
        this.form.id = sId
          this.form.stateId = '004'  
          Api.bidProjectPrint(param).then(data => {
            this.form = data
            if (!data.purchaser) {
              this.form.purchaser = ''
            }
            if (!data.bidDocumentAtt) {
              this.form.bidDocumentAtt = {}
            }
            if (!data.bidderIdCard) {
              this.form.bidderIdCard = {}
            }
            if (!data.qualificationAtt) {
              this.form.qualificationAtt = {}
            }
            if (!data.bidAttorney) {
              this.form.bidAttorney = {}
            }if (data.budgetAmount) {
              this.form.budgetAmount = ''
            }

          })
      },

    }
  }
</script>
