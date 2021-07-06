<template>
  <div>
    <el-form label-position="right" :model="form"  ref="form" label-width="130px">
      <!-- 打印内容开始 -->
      <div class="print-data">
       
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content formDetails">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码：" prop="projectCode">
                 {{form.projectCode}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="差旅单编号：">
                {{form.id}}
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="8">
              <el-form-item label="申请人：">
                  {{form.applyName}}
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="职务：" >
                
              </el-form-item>
            </el-col> -->
            <el-col :span="16">
              <el-form-item label="所属部门：">
                <span>{{form.orgName}}</span>
                <span class="ml10">职务：{{form.positionName}}</span>
              </el-form-item>
            </el-col>
           

            <el-col :span="8">
              <el-form-item label="总计金额：" prop="amount">
                {{sumAmount()}} {{form.amount}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预借款项：" prop="item">
                   {{form.item}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实付金额：" prop="actualPay">
                <template v-if="form.actualPay">
                  {{form.actualPay.toFixed(2)}}
                </template>
                
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出差人：" prop="travelerIds">
                  <span style="margin: 0 5px" v-for="(item, index) in form.travelers" :key="index">{{item.uName}}</span>
                
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label="出差事由：" prop="reason">
                {{form.reason}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总人数：" >
                {{form.peopleNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="起止日期：">
                <span>{{form.beginDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期：">
                <span>{{form.endDate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目的地：" prop="targetSite">
                {{form.targetSite}}
              </el-form-item>
            </el-col>
            
            
          </el-row>
        </div>
        <p class="step-title"><span class="step-icon">2</span>交通明细：</p>
        <div class="dash-content pd10" >
          <el-table class="page-table" :data="trafficData" 
          show-summary  :summary-method="getSummariesTraffice"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in trafficHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'trafficTypeId'">
                {{scope.row.attached.TrafficType[scope.row.trafficTypeId].cnInfo}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">3</span>住宿明细：</p>
        <div class="dash-content pd10" >
          <el-table class="page-table" :data="stayData" 
          show-summary :summary-method="getSummariesStay"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listStay" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'cityLevel'">
                {{scope.row.attached.CityLevel[scope.row.cityLevel].cnInfo}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
            </el-table-column>
            
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">4</span>餐费明细：</p>
        <div class="dash-content pd10" >
          <el-table class="page-table" :data="mealData" 
          show-summary 
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listMeal" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">5</span>补贴明细：</p>
        <div class="dash-content pd10" >
          <el-table class="page-table" :data="subsidyData" 
          show-summary :summary-method="getSummariesSubsidy"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listSubsidy" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
             
            </el-table-column>
          </el-table>
        </div>
        <p class="step-title"><span class="step-icon">6</span>其他明细：</p>
        <div class="dash-content pd10" >
          <el-table class="page-table" :data="otherData" 
          show-summary :summary-method="getSummariesOther"
          stripe highlight-current-row v-loading="listLoading" :cell-style="{color:'#333'}"
          >
            <el-table-column v-for="(header, index) in listOther" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                             :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
              
            </el-table-column>
            
          </el-table>
        </div>
        
        <p class="step-title"><span class="step-icon">8</span>单据上传：</p>
        <div class="dash-content pd10" >
           <AttachmentDetails :attachmentInfo="form.applyAttachments"></AttachmentDetails>
        </div>
       <p class="step-title"><span class="step-icon">9</span>选择抄送人：</p>
        <el-form-item label="抄送人：">
              <template v-if="form.copyGiveName">
               <el-tag
                  v-for="tag in form.copyGiveName"
                  :key="tag"
                  type="info">
                  {{tag}}
                </el-tag>
             </template>
              <template v-else>
                无
              </template>
            <span class="text-info ml10">用于跨部门审批</span>
        </el-form-item>
        <!-- 打印内容结束 -->
        <div class="pd20 tar">
          <el-button type="default" size="medium" @click="goBack()">返 回</el-button>
           <!--<el-button type="primary" size="medium" @click="submitForm('form', 0)">提 交</el-button>
          <el-button type="primary" size="medium" v-if="!this.$route.query.id" @click="submitForm('form', 1)">提交后继续创建</el-button>-->
          <el-button type="primary" size="medium" @click="handlePrint">打印</el-button> 
        </div>
      </div>
    </el-form>
    <div id="printContent" v-if="isShowPrint">
      <PrintTraval  
        :form="form"   
        :approvalInfo="approvalInfo"
        :id="$route.query.id" 
        :targetId="$route.query.applyId">
      </PrintTraval>
    </div>
  </div>
</template>

<script>
  import AttachmentDetails from '@/components/attachment/Details'
  import moment from 'moment'
  import Api from '@/api/index'
  import PrintTraval from './PrintTraval'
  export default {
    components: {
      AttachmentDetails,
      PrintTraval
    },
 
    data () {
      const projectCode = this.$route.query.projectCode
      return {
        approvalInfo:null,
        isShowPrint:false,
        //附件上传
        hasCallBack: true,
        callBackName: 'getUploadFile',
        dialogVisible:false,
        fileTypeList:[],
        personList:[],

        copyGiveList:[],
        

        operate: '',
        type: '',
        removedAll: false,
        form: {
          copyGiveName:[],
          copyGive:[],
          travelerIds:[],
          peopleNumber:'',
          projectCode:projectCode?projectCode:'',
          orgName: '',
          positionName: '',
          approvalProcessId: '',
          applyAttachmentReqs: []
        },
        //sumAmount:0,  //合计数量
        /** 表格 loading */
        listLoading: false,
       
        trafficData: [],
        stayData: [],
        mealData: [],
        subsidyData: [],
        otherData: [],

        /** 项目列表 */
        projectList: [],
        /** 借款列表 */
        borrowList: [],
        /** 人员列表 */
        userList: [],
        shenPiList: [],
        //明细合计
        trafficeAmount:0,
        stayAmount:0,
        mealAmount:0,
        subsidyAmount:0,
        othersAmount:0,
        trafficHeader: [
          {prop: 'trafficTypeId', label: '工具类型', align: 'center', show: true},
          {prop: 'itemDate', label: '日期', align: 'center', show: true},
          {prop: 'traveler', label: '人员', align: 'center', show: true},
          {prop: 'startSite', label: '起点', align: 'center', show: true},
          {prop: 'endSite', label: '终点', align: 'center', show: true},
          {prop: 'amount', label: '票价', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listStay: [
          {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
          {prop: 'endDate', label: '结束日期', align: 'center', show: true},
          {prop: 'cityLevel', label: '类别', align: 'center', show: true},
          {prop: 'residents', label: '住宿人数', align: 'center', show: true},
          {prop: 'amount', label: '单价', align: 'center', show: true},
          {prop: 'roomNum', label: '房间数', align: 'center', show: true},
          {prop: 'days', label: '天数', align: 'center', show: true},
          {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listMeal: [
          {prop: 'day', label: '日期', align: 'center', show: true},
          {prop: 'amount', label: '金额', align: 'center', show: true},
          {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
          {prop: 'totalAmount', label: '金额合计', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listSubsidy: [
          {prop: 'beginDate', label: '开始日期', align: 'center', show: true},
          {prop: 'endDate', label: '结束日期', align: 'center', show: true},
          {prop: 'days', label: '合计天数', align: 'center', show: true},
          {prop: 'subsidyAmount', label: '补贴金额', align: 'center', show: true},
          {prop: 'otherSubsidyAmount', label: '其他补贴', align: 'center', show: true},
          {prop: 'totalAmount', label: '总金额', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        listOther: [
          {prop: 'day', label: '日期', align: 'center', show: true},
          {prop: 'name', label: '名称', align: 'center', show: true},
          {prop: 'amount', label: '单价', align: 'center', show: true},
          {prop: 'num', label: '数量', align: 'center', show: true},
          {prop: 'totalAmount', label: '总价', align: 'center', show: true},
          {prop: 'remarks', label: '备注', align: 'center', show: true}
          ],
        trafficTypeList: [],
        cityLevelList: [],
        fileList: [],
        approvalDetails:null,
         approvalIndex:1,
      }
    },
    watch: {
      
      'trafficData':{
         
         handler:function(){

           this.sumAmount()
          },
          deep:true
       },
       'stayData':{
         
         handler:function(){

           this.sumAmount()
          },
          deep:true
       },
      
      'mealData':function(){
          this.sumAmount()
      },
      'subsidyData':function(){
          this.sumAmount()
      },
      'otherData':function(){
          this.sumAmount()
      },
      'form.travelerIds':function(val,newValue){
        const len = this.form.travelerIds.length
         if(len>0){
             this.form.peopleNumber = len;
         }
       
      },
      'form.amount': function () {
        if (this.form.item ) {
          this.form.actualPay = parseFloat(this.form.amount) - parseFloat(this.form.item)
        } else {
          this.form.actualPay = parseFloat(this.form.amount)
        }
      },
      'form.item': function () {
        if (this.form.item) {
          if (this.form.amount) {
            this.form.actualPay = parseFloat(this.form.amount) - parseFloat(this.form.item)
          } else {
            this.form.actualPay = parseFloat(this.form.item)
          }

        } else {
          if (this.form.amount) {
            this.form.actualPay = parseFloat(this.form.amount)
          }
        }

      }
    },
    mounted () {
       this.operate = this.$route.query.id ?  'edit' : 'add'
      // 获取字典信息
      if (sessionStorage.getItem('dists')) {
        let distsObj = JSON.parse(sessionStorage.getItem('dists'))
        if (distsObj.TrafficType) {
          this.trafficTypeList = distsObj.TrafficType.children
        }
        if (distsObj.CityLevel) {
          this.cityLevelList = distsObj.CityLevel.children
        }
      }
      //获取抄送人列表 
      this.getPersonList()
      // 项目列表
      this.remoteMethod('')
      Api.loanPage({pageNum: 1, pageSize: 50000}).then(data => {
        if (data) {
          this.borrowList = data.records;
        }
      });
      Api.getUserPage({pageNum: 1, pageSize: 50000}).then((res) => {
        if (res) {
          this.userList = res.records
        }
      })
     
      if (this.operate === 'edit') {
        this.loadData()
      }
    },
    methods: {
      //获取打印信息
      getPrintInfo(applyId) {
       
        if(applyId){
            Api.approvalDetailWithStep({id: applyId}).then(data => {

                if (data) {
                   console.log(data,'approvalDetails')
                    this.approvalInfo = data
                    
                }
            })
        }
        
      },
      //打印
      handlePrint(){
          console.log(this.form);
      console.log(this.approvalInfo);
        this.isShowPrint = true;
        this.$nextTick(()=>{
            Print('#printContent')
            this.isShowPrint = false
         })
      },
        // 删除撑着抄送人
    removeCopyGive (val) {
      console.log(val)
      this.copyGiveList = this.copyGiveList.filter(item => item.uName != val)
    },
      
      //获取抄送人
      getPersonList(query = "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
            pageNum: 1,
            pageSize: 10,
            name: query
          };
          Api.getUserPage(params).then(res => {
            this.personList = res.records;
          });
        }, 200);
      },
      
      handleSelectedCustomer(user) {
        if (!this.copyGiveList.some(item => item.uId === user.uId)) {
          this.copyGiveList.push({
            uId: user.uId,
            uName: user.uName
          })
        }
      },
       getAmountNum(arr,attr){
          const values = arr.map(item => Number(item[attr]));
          if (!values.every(value => isNaN(value))) {
            return values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            
          }else {
             return 0;
          }
          
       },
      //计算总合计
      sumAmount(){
        //各费用明细求和
        const trafficeAmount = this.getAmountNum(this.trafficData,'amount')
        const stayAmount = this.getAmountNum(this.stayData,'totalAmount')
        const mealAmount = this.getAmountNum(this.mealData,'totalAmount')
        const subsidyAmount = this.getAmountNum(this.subsidyData,'totalAmount')
        const othersAmount = this.getAmountNum(this.otherData,'totalAmount')
        
        
        const amount =  parseFloat(trafficeAmount+stayAmount+mealAmount+subsidyAmount+othersAmount).toFixed(2)
        this.form.amount = amount;
        console.log(amount,'amount')
      },
      //交通合计
      getSummariesTraffice(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
        //   if (!values.every(value => isNaN(value)) && column.property =='amount' ) {
        //     sums[index] = values.reduce((prev, curr) => {
        //       const value = Number(curr);
        //       if (!isNaN(value)) {
        //         return prev + curr;
        //       } else {
        //         return prev;
        //       }
        //     }, 0);
        //       if(column.property=='totalAmount'){
        //       sums[index] = sums[index].toFixed(2)
        //     }
          
        //   } else {
        //     sums[index] = '';
        //   }
        // });

        // return sums;
           if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='days'  
          || column.property =='residents' || column.property =='roomNum' || column.property =='amount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            console.log(column.property,'hdjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
            if(column.property=='amount'){
              sums[index] = sums[index].toFixed(2)
            }
            
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      //住宿明细
      getSummariesStay(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='days'  
          || column.property =='residents' || column.property =='roomNum' || column.property =='amount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(column.property=='totalAmount'){
              sums[index] = sums[index].toFixed(2)
            }
            
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      //补贴明细
      getSummariesSubsidy(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='days'  || column.property =='subsidyAmount' || column.property =='otherSubsidyAmount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           if(column.property=='totalAmount'){
              sums[index] = sums[index].toFixed(2)
            }
            //this.sumAmount +=sums[index]
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      //其他明细
      getSummariesOther(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && (column.property =='totalAmount'  || column.property =='num'  || column.property =='amount')){
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           if(column.property=='totalAmount'){
              sums[index] = sums[index].toFixed(2)
            }
            //this.sumAmount +=sums[index]
            //sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
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
      getDistsKeyName(type){
        return this.fileTypeList.filter(item=>item.value==type)[0].cnInfo;
      },
      closeDialog () {
        this.dialogVisible = false
      },
      getUploadFile (form){

        //子组件form 提交过来的参数
        /* description: "4545uuuuuuuuuuuuuuuu"
         fileName: "45464"
         key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
         size: "7.9"
         type: "001"*/
        let _this = this
        this.form.applyAttachmentReqs.push({
          name: form.fileName,
          attachmentUrlKey: form.key,
          type: form.type,
          description: form.description,
          //size: _this.renderSize(form.size)
        })
      },
      //删除报关附件
      deleteFileItem(row,index){
          if(row.id){
            const params  = {
              id:row.id
            }
            Api.deleteAttachment(params).then(res=>{
                this.form.applyAttachmentReqs.splice(index,1)
            })
          }else{
             this.form.applyAttachmentReqs.splice(index,1)
          }
      },
      remoteMethod(query) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          const params = {
              pageNum:1,
              pageSize:10,
              searchStr:query,
              myProjectList:false
          }
          Api.projectList(params).then(res=>{
            console.log(res,'resss')
            this.projectList = res.records
          })
          
        }, 200);
      },
      /**
       * 加载
       */
      loadData () {
        Api.travelDetail({id: this.$route.query.id}).then((res) => {
          console.log(res,'---------------------------')
          if (res) {
             console.log(res,'---------------------------')
            let _this = this
            this.form = res
            this.form.beginDate = this.formartDate(res.beginDate)
            this.form.endDate = this.formartDate(res.endDate)
            if (res.travelerIds) {
              this.form.travelerIds = res.travelerIds
            }
            if (res.travelTrafficDetails) {
              this.trafficData = res.travelTrafficDetails
              this.trafficData.forEach(function (item) {
                item.itemDate = _this.formartDate(item.itemDate)
              })
            }
            if (res.travelHotelDetails) {
              this.stayData = res.travelHotelDetails
              this.stayData.forEach(function (item) {
                item.beginDate = _this.formartDate(item.beginDate)
                item.endDate = _this.formartDate(item.endDate)
              })
            }
            if (res.travelMealsDetails) {
              this.mealData = res.travelMealsDetails
              this.mealData.forEach(function (item) {
                item.day = _this.formartDate(item.day)
              })
            }
            if (res.travelSubsidyDetails) {
              this.subsidyData = res.travelSubsidyDetails
              this.subsidyData.forEach(function (item) {
                item.beginDate = _this.formartDate(item.beginDate)
                item.endDate = _this.formartDate(item.endDate)
              })
            }
            if (res.travelOtherDetails) {
              this.otherData = res.travelOtherDetails
              this.otherData.forEach(function (item) {
                item.day = _this.formartDate(item.day)
              })
            }
            if (res.applyAttachments && res.applyAttachments.length > 0) {
              res.applyAttachments.forEach(function (item) {
                _this.$set(item, 'url', item.attachmentUrlKey)
              })
              this.form.applyAttachmentReqs = res.applyAttachments
            } else {
              this.form.applyAttachmentReqs = []
            }
            //获取审批详情
            this.getPrintInfo(res.applyId)
          }
        })
      },
      calcPrice(value, index, tag, key) {
        if (tag === 'trafficData') {
          this.trafficData[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'stayData') {
          this.stayData[index][key] = parseFloat(value).toFixed(2)

        }
        if (tag === 'mealData') {
          this.mealData[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'subsidyData') {
          this.subsidyData[index][key] = parseFloat(value).toFixed(2)
        }
        if (tag === 'otherData') {
          this.otherData[index][key] = parseFloat(value).toFixed(2)
        }
      },
      /**
       * 计算两个日期相差的天数
       * */
      calcDays (firstDate, secondDate, index, listData, item, tag){
        if (firstDate && secondDate) {
            //sDate1和sDate2是2006-12-18格式
           var dateSpan, iDays;
          firstDate = Date.parse(firstDate);
          secondDate = Date.parse(secondDate);
          dateSpan = secondDate - firstDate;
          dateSpan = Math.abs(dateSpan);
          iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
         
          if (tag === 'stayData') {
             listData[index].days = iDays
            this.calcTotalAmount(item, index, listData)
            
          } else {
            listData[index].days = iDays + 1
            this.calcSubsidyTotal(item, index, listData)
             
          }

        }
      },
      /**
       * 住宿管理计算总金额
       * */
      calcTotalAmount(item, index, stayData) {
        if ((item.amount || item.amount === 0) && (item.roomNum || item.roomNum === 0) && (item.days || item.days === 0)) {
          stayData[index].totalAmount =  (parseFloat(item.amount) *  parseInt(item.roomNum) * parseFloat(item.days)).toFixed(2)
        }
      },
      /** 餐费管理计算总金额 */
      calcMealTotal(item, index, mealData) {
        if ((item.subsidyAmount || item.subsidyAmount === 0 ) && (item.amount || item.amount === 0 ) ) {
          mealData[index].totalAmount = (parseFloat(item.subsidyAmount) + parseFloat(item.amount)).toFixed(2)
        }
      },
      /** 计算补贴总金额 */
      calcSubsidyTotal(item, index, subsidyData) {
        if ((item.days || item.days === 0 ) && (item.subsidyAmount || item.subsidyAmount === 0 ) && (item.otherSubsidyAmount || item.otherSubsidyAmount === 0 )) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if ((item.days || item.days === 0 ) && (item.subsidyAmount || item.subsidyAmount === 0 ) && !item.otherSubsidyAmount) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if ((item.subsidyAmount || item.subsidyAmount === 0 ) && !item.days && !item.otherSubsidyAmount) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if (!item.subsidyAmount && !item.days && (item.otherSubsidyAmount || item.otherSubsidyAmount === 0 )) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
        if (!item.days && (item.subsidyAmount || item.subsidyAmount === 0 ) && (item.otherSubsidyAmount || item.otherSubsidyAmount === 0 )) {
          subsidyData[index].totalAmount = (parseFloat(item.days) * (parseFloat(item.subsidyAmount) + parseFloat(item.otherSubsidyAmount))).toFixed(2)
        }
      },
      /** 计算其他总金额 */
      calcOtherTotalAmount(item, index, otherData){
        if ((item.amount || item.amount === 0 ) && (item.num || item.num === 0 )) {
          otherData[index].totalAmount = (parseFloat(item.amount) * parseFloat(item.num)).toFixed(2)
        }
      },
      addTrafficItem () {
        let newItem = {
          trafficTypeId: '',
          itemDate: '',
          traveler: '',
          startSite: '',
          endSite: '',
          amount: '',
          remarks: ''
        }
        this.trafficData.push(newItem)
      },
      addStayItem () {
        let newItem = {
          beginDate: '',
          endDate: '',
          cityLevel: '',
          residents: '',
          amount: '',
          roomNum: '',
          days: '',
          totalAmount: '',
          remarks: ''
        }
        this.stayData.push(newItem)
      },
      addMealItem () {
        let newItem = {
          day: '',
          amount: '',
          subsidyAmount: '',
          totalAmount: ''
        }
        this.mealData.push(newItem)
      },
      addSubSidyItem () {
        let newItem = {
          beginDate: '',
          endDate: '',
          days: '',
          subsidyAmount: '',
          otherSubsidyAmount: '',
          totalAmount: '',
          remarks: ''
        }
        this.subsidyData.push(newItem)
      },
      addOtherItem () {
        let newItem = {
          day: '',
          name: '',
          amount: '',
          num: '',
          totalAmount: '',
          remarks: ''
        }
        this.otherData.push(newItem)
      },
      selectUser (item) {
        this.form.orgName = item.orgName
        this.form.positionName = item.positionName
      },
      /**
       * 表单提交
       */
      submitForm (formName, i) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //从投标项目详情中过来的项目，需要传投标项目ID
              const query   =this.$route.query;
             const bidId = query.bidId
             const tag = query.tag 
             if(tag == 'outerWorker'){
              this.form.customId = bidId
             }else if(bidId){
               this.form.bidId = bidId
             }
            // 交通明细
            let _this = this
            if (this.trafficData.length > 0) {
              this.form.travelTrafficDetailReqs = this.trafficData
            }
            // 住宿明细
            if (this.stayData.length > 0) {
              this.form.travelHotelDetailReqs = this.stayData
            }
            // 餐费明细
            if (this.mealData.length > 0) {
              this.form.travelMealsDetailReqs = this.mealData
            }
            // 补贴明细
            if (this.subsidyData.length > 0) {
              this.form.travelSubsidyDetailReqs = this.subsidyData
            }
            // 其他明细
            if (this.otherData.length > 0) {
              this.form.travelOtherDetailReqs = this.otherData
            }
            if (this.fileList.length > 0) {
              _this.form.applyAttachmentReqs = []
              this.fileList.forEach(function (item) {
                _this.form.applyAttachmentReqs.push({
                  name: item.name,
                  key: item.attachmentUrlKey
                })
              })
            } else {
              if (this.removedAll) {
                this.form.applyAttachmentReqs = []
              }
            }
            if (this.operate === 'edit') {
              delete this.form['travelTrafficDetails']
              delete this.form['travelHotelDetails']
              delete this.form['travelMealsDetails']
              delete this.form['travelSubsidyDetails']
              delete this.form['travelOtherDetails']
              delete this.form['attached']
              delete this.form['applyAttachments']
              Api.updateTravel(this.form).then(res => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '差旅申请修改成功'
                  })
                }
                this.goBack()
              });
            } else {
              Api.addTravel(this.form).then(res => {
                if (res) {
                  this.$notify.success({
                    title: '提示',
                    message: '差旅申请添加成功'
                  })
                }
                if (i === 1) {
                  this.form = {
                    travelerIds:[],
                    peopleNumber:'',
                    orgName: '',
                    positionName: '',
                    approvalProcessId: '',
                    actualPay: '',
                    applyAttachmentReqs: []
                  }
                  this.trafficData = []
                  this.stayData = []
                  this.mealData = []
                  this.subsidyData = []
                  this.otherData = []
                  this.removedAll = false
                } else {
                  this.goBack()
                }

              });
            }
          } else {
            this.$message('请完善表单')
          }
        })
      },
      formartDate (value) {
        let times = ''
        if (value) {
          times = moment(value).format('YYYY-MM-DD')
        }
        return times
      },
      goBack(){
        this.$router.go(-1)
      },
      goHref() {
        const query = this.$route.query
        if (query.tag === '1'  || query.flag === 'myApply') {
            //来自项目详情
            // 如果入口是我的申请进来的，创建完成之后，跳转到我的申请
            this.$router.push({path: '/router/myApply'})
          } else if (query.tag === 'bid') {
           //来自投标详情
                const path = '/router/intercourseAccount'
                this.$router.push({
                  path: path,
                  query:{
                    id:query.bidId,
                    projectCode:query.projectCode,
                  }
                })
                return;
          }else if (query.tag === 'outerWorker') {
              //来自外工供应商的往来财务
               const path = '/router/outerWorkerAccount'
                this.$router.push({
                  path: path,
                  query:{
                    id:query.bidId,
                    type:2,
                  }
                })
                return;
          }else {
            //财务列表
            this.$router.push({path: '/router/travelManagement'})
          }
      },
      // goHref() {
      //   const query = this.$route.query
      //     if(query.projectCode && query.bidId){
      //         this.$router.push({
      //           path: '/router/intercourseAccount',
      //           query:{
      //             id:query.bidId,
      //             projectCode:query.projectCode,
      //           }
      //         })
      //         return;
      //     }
      //   if (query.tag === '1') {
      //       // 如果入口是我的申请进来的，创建完成之后，跳转到我的申请
      //       this.$router.push({path: '/router/myApply'})
      //     } else {
      //       this.$router.push({path: '/router/travelManagement'})
      //     }
      // },
    }
  }
</script>
