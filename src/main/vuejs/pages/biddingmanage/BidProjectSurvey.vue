<template>
  <div>
    <div class="bid-audit">
        <el-form :model="form" label-width="130px" :rules="rules" v-if="form">
        
          <el-row>
            <el-col :span="12">
              <el-form-item label="勘察人：" prop="code">
                <el-input v-model="form.code" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="勘察日期：" prop="surveyTime">
                <el-date-picker v-model="form.surveyTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="勘察情况：" prop="remarks">
                <el-input style="width:100%;" rows="3" show-word-limit maxlength="100" type="textarea" v-model="form.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
	          <el-col :span="24">
	          	<FileTableMultiUpload
	          	  v-if="isUpload"
	              :fileList.sync="fileList"
	              :removedAll.sync="removedAll"
	              @attachmentChange="attachmentChange"
	              :applyAttachment="form.surveyAttachmentReqList"></FileTableMultiUpload>
	          </el-col>
	        </el-row>
          <div class="text-center">
            <el-button type="primary" @click="bidBack">保 存</el-button>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
  import Api from '@/api/index'
  import moment from 'moment'
  export default {
    data () {  
      const userInfo  = JSON.parse(sessionStorage.getItem('jwt'))
      return {
        options: [{
          value: '1',
          label: '顺利'
        }, {
          value: '0',
          label: '不顺利'
        }],
        userInfo:userInfo,
        removedAll:false,
        isUpload:false,
        fileList:[],
        form:{
          bidId: null,
          code: null,
          createDt: null,
          ctUId: null,
          ctUName: null,
          customerName: null,
          participant: null,
          remarks: null,
          surveyTime:null,
        },
        fileList:[],
        id: '',
        rules: {
          code:[
              { required: true, message: '请输入勘察单号', trigger: 'blur'},
          ],
          remarks:[
              { required: true, message: '请输入勘察内容', trigger: 'blur'},
          ],
          surveyTime:[
              { required: true, message: '请选择勘察时间', trigger: 'blur'},
          ],
          customerName: [
            { required: true, message: '请输入客户名称', trigger: 'blur'},
          ],
        },

      }
    },
    mounted () {
      
      this.loadData()
    },
    methods: {
      addItem() {        //反馈填写表格
        let item = {
          bidder: '',
          bidderCompanyName: '',
          grade: '',
          tel: '',
          openBidPrice: ''
        }
        this.formBack.bidderInfoReqList.push(item)
      },
      
        /**  勘察信息*/
      bidBack(item) {
        let params = this.form
        params.ctUId = this.userInfo.ctUId
        params.bidId = this.$route.query.id
        Api.saveBidSurvey(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '勘察信息录入成功！'
            })
            //this.loadData()
          }
        })
        
      },
      cancelBidBack() {
        this.dialogVisibleBack = false
        this.formBack = {
          bidderInfoReqList: [],
          feedbackAttachmentReqList: [],
          feedbackAttachmentRespList: []
        }
      },
      attachmentChange(val){
	      this.formBack.surveyAttachmentReqList = val
	    },
      /**
       * 加载
       */
      loadData () {
        const bidId = this.$route.query.id
        if(bidId){
          let param = {bidId:bidId}
          Api.getBidSurveyByBidId(param).then(res => {
              if(res){
               // const oDate = new Date(res.surveyTime)
                res.surveyTime = moment(res.surveyTime).format('YYYY-MM-DD HH:mm:ss')
                this.form = res
              }
          })
          this.isUpload = true
        }
      },

    }
  }
</script>
