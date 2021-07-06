<template>
  <div>
    <div>
      <ContractApprovalInfo :info="form1"></ContractApprovalInfo>
      <div class="sys-title">附件信息 </div>
      <ol style="padding: 0 4%">
        <li v-for="(item, index) in fileList" :key="index"  class="mt10" >
          <span>{{item.name? item.name : (item.attachmentName ? item.attachmentName : '')}}</span>
          <span v-if="item.key" @click="showFileDetails(item.key)" class="ml10">
            <el-button type="primary"  size="mini"   v-if="isHasImg(item.key)">预览图片</el-button>
            <el-button type="primary"  size="mini"  v-else-if="item.key.indexOf('pdf')!=-1">预览PDF</el-button>
            <el-button type="primary"  size="mini"  v-else>下载文件</el-button>
          </span>
        </li>
      </ol>
      <ImgPreview
        :pictures="pictures"
        :isShowDialog="isShowDialogImg"
        :isFullscreen="false"
        v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    </div>
   <template v-if="form1.storageLocation">
        <div  class="title">存放位置 <div class="line"></div></div>
        <p>{{form1.storageLocation}}</p>
   </template>
   <template  v-if="form1.reasonsTermination">
        <div  class="title">终止原因 <div class="line"></div></div>
       <p>{{form1.reasonsTermination}}</p>
   </template>

    <div class="tar pd10"  v-if="typeShow=== 'detail'">
        <el-button type="default" size="medium" @click="$router.go(-1)">返 回</el-button>
        <el-button type="primary"  size="medium" @click.native="deleteHT(form1)">删除</el-button>
        <el-button type="primary" size="medium"  @click.native="zhongzhi(form1)">终止</el-button>
        <el-button type="primary" size="medium"  @click.native="onSubmit1(form1)">存放位置</el-button>
        <el-button type="primary" size="medium" v-if="form1.states !== '004'"  @click.native="onSubmit3(form1)">完成</el-button>
    </div>
    <template  v-if="typeShow=== 'detail'">
     
    
    <el-dialog
    title="合同存放"
    :close-on-click-modal="canClick"
    :visible.sync="dialogVisible1"
    size="tiny" top="12vh" width="30%">
    <div style="text-align: center">
      <el-form :model="form" label-width="120px">
        <el-form-item label="存放位置">
          <el-input v-model="form.storageLocation"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-top: 20px">
        <el-button type="primary" size="small" @click="dialogVisible1=false">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit1()">确 定</el-button>
      </div>
    </div>
  </el-dialog>

    <el-dialog
      title="终止"
      :close-on-click-modal="canClick"
      :visible.sync="dialogVisible2"
      size="tiny" top="12vh" width="30%">
      <div style="text-align: center">
        <el-form :model="form" label-width="120px">
          <el-form-item label="终止原因">
            <el-input v-model="form.reasonsTermination"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px">
          <el-button type="primary" size="small" @click="dialogVisible2=false">取 消</el-button>
          <el-button type="primary" size="small" @click="onSubmit2()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
</template>
    
  </div>

</template>

<script>
  import ContractApprovalInfo from '@/pages/approval/ContractApprovalInfo'
  import moment from 'moment'
  import Api from '@/api/index'
import ImgPreview from '@/components/common/ImgPreview'
  export default {
    components: {
      ContractApprovalInfo,
      ImgPreview
    },
    data () {
      const query = this.$route.query
      const projectCode = query.projectCode
      const bidId = query.bidId
      return {
           canClick: false,
        dialogVisible1:false,     //合同位置弹框
        dialogVisible2:false,     //终止弹框
        dialogVisible3:false,     //完成弹框

        form: {
          storageLocation:'' ,//合同存放位置
          reasonsTermination:'' ,//终止原因
          states:'',    //状态
          id:'',
          
        },
         isShowDialogImg:false,
        pictures:null,
        // 判断是入库还是出库
        flag: false,
        removedAll: false,
        //判断添加还是编辑
        operateFlag:'add',

        fileList: [],
        rules1:{
          contractPrice: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入数字类型' },
          ]
        },

        type: '',
        form1: {},
        
        tableHeader: [{
          prop: 'name',
          align: 'center',
          label: '货物名称',
          width: '100',
          show: true
        }, {
          prop: 'from',
          align: 'center',
          label: '起点',
          width: '100',
          show: true
        }, {
          prop: 'to',
          align: 'center',
          label: '终点',
          width: '100',
          show: true
        }, {
          prop: 'transportationModeId',
          align: 'center',
          label: '运输方式',
          width: '100',
          show: true
        }, {
          prop: 'agreementPrice',
          align: 'center',
          label: '协议价格',
          width: '100',
          show: true
        }, {
          prop: 'currency',
          align: 'center',
          label: '币种',
          width: '100',
          show: true
        },],
        /** 表格数据 */
        listData: [],

        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        
        typeShow: '' //检测是否为详情页的变量
      }
    },
    mounted () {
      this.typeShow = this.$route.query.type
      this.flag = this.$route.path === '/router/PutInStock'


      if(this.$route.query.id){
        this.load()
      }
      

    },
    methods: {
        /**删除功能**/
      deleteHT (item) {
        this.$confirm('您确定要删除合同['+item.contractName+']吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteContract(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '合同['+item.contractName+']删除成功'
            })
            this.$router.go(-1)
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '合同['+item.contractName+']删除失败'
            })
          })
        })
      },

      /**
       * 提交存放位置
       * */
      onSubmit1 (i) {
        if(!this.dialogVisible1){
          this.form.id=i.id
          // this.form.states="005"
          this.dialogVisible1 = true
        }else {
          if (!this.form.storageLocation) {
            this.$notify.warning({
              title: '提示',
              message: '请选择文件类型'
            })
            return
          }
          Api.updateContract(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '存放位置保存成功'
              })
              this.dialogVisible1 = false
              // 重新渲染页面数据
               this.load()
            }
          })
        }
      },

      /**
       * 提交终止
       * */
      zhongzhi(item) {
        this.dialogVisible2 = true
        this.form = item
        this.form.states = '005'
      },
      onSubmit2 () {
        const params = this.form
        if (!params.reasonsTermination) {
          this.$notify.warning({
            title: '提示',
            message: '请填写内容'
          })
          return
        }
        Api.changeContractState(params).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message:  `合同【${params.contractName}】终止成功`
            })
            this.dialogVisible2 = false
            // 重新渲染页面数据
            this.load()
          }
        })
      },

      /**
       * 提交完成
       * */
      onSubmit3 (item) {
        this.$confirm('您确定合同【' + item.contractName + '】是否已执行完成吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.id = item.id
          this.form.states = '004'
          Api.changeContractState(this.form).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '合同【' + item.contractName + '】已确认执行完成'
              })
              // 重新渲染页面数据
              this.$router.go(-1)
            }
          })
        });
      },

      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        // 判断是否图片
        isHasImg(key){
           const aFileType = ['.jpg','.jpeg','.png']
            return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
        },
        //文件预览处理
        showFileDetails(key){
          let img = ''
          Api.getUrl(key).then(data => {
            if (data) {
              if(this.isHasImg(key)){
                //图片预览处理；
                 img = data
                  this.pictures = []
                  this.pictures.push(img)
                  this.isShowDialogImg = true
              }else{
                //除图片的其他文件；
                   window.open(data)
              }
            }
          })

        },
      load(){
        Api.contractDetail({id: this.$route.query.id}).then(data => {
          if (data) {
            this.form1 = data
            if (data.contractAttachments && data.contractAttachments.length > 0) {
              this.fileList = data.contractAttachments
            }
          }
        })
      },
    }
  }
</script>

