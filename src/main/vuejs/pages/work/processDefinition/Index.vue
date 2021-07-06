<template>
  <el-row type="flex" :gutter="10" class="approvalProcess mt10">
    <el-col :span="8">
      <div class="border pd10">
        <div class="searchBox">
          <el-input
            placeholder="请输入流程名称"
            prefix-icon="el-icon-search"
            size="small"
            width="180px"
            @change="getApprovalProcess"
            v-model="searchForm.name"
          ></el-input>
          <el-button type="primary" v-if="pageFlag==='definition'" size="small" class="ml10" icon="el-icon-plus" @click="addItem"></el-button>
        </div>
        <ul class="processList" v-if=" approvalDefinitionPage && approvalDefinitionPage.records.length>0">
          <li
            v-for="(item,index) in approvalDefinitionPage.records"
            :key="index"
            :class="{'active':curProcess===index}"
            @click="showProcessDetails(item,index)"
          >
            <strong class="nowrap">{{item.name}}</strong>
            <span class="el-icon-remove" v-if="pageFlag==='definition'" @click.stop="deleteItem(item)"></span>
          </li>
        </ul>
        <div v-else class="processList">
          <div style="padding:50px;">
            <p class="tac f16">暂无流程信息，</p>
            <template v-if="pageFlag==='definition'">
              <p class="tac mt20">
              可点击
              <el-button
                type="primary"
                size="small"
                class="ml10 mr10"
                icon="el-icon-plus"
                @click="addItem"
              ></el-button> 按钮进行添加！
            </p>
            <p class="tac mt20">
              可点击
              <i class="el-icon-remove"></i> 按钮进行删除！
            </p>
            </template>
              <p  v-else class="tac mt20">您可以到【流程定义】中去
                <a href="javascript:;" @click="addProcess">创建审批流程</a>
              </p>
          </div>
        </div>
        <el-row type="flex" class="page-box mt10">
          <el-pagination
           small
           background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total,prev, pager, next"
            :total="approvalDefinitionPage ? approvalDefinitionPage.total : 0">
          </el-pagination>
        </el-row>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="approvalBox">
        <div class="title">审批流程</div>
        <div class="pd20">
          <template v-if="pageFlag==='selectProcess'">
            <div class="selectProcess">
              <div class="left">
                  <ul>
                    <li>
                      <strong>流程名称：</strong>
                      <span>{{editForm.name}}</span>
                    </li>
                    <li>
                      <strong>流程类型：</strong>
                      <span v-if="editForm.attached">{{editForm.attached.ApprovalCategory[editForm.category].cnInfo}}</span>
                    </li>
                    <li>
                      <strong>紧急度：</strong>
                      <span v-if="editForm.attached">{{editForm.attached.ApprovalLevel[editForm.level].cnInfo}}</span>
                    </li>
                    <li>
                      <strong>创建人：</strong>
                      <span>{{editForm.uName}}</span>
                    </li>
                    <li>
                      <strong>创建时间：</strong>
                      <span>{{getFormatTime(editForm.createDt)}}</span>
                    </li>
                  </ul>
                 
              </div>
              <div class="diagramBox">
                <Diagram ref="diag"
                      id="definition"
                      v-if="isShowDiagram"
                      :modelData="diagramData"
                      @model-changed="modelChanged"
                      @changed-selection="changedSelection"
                      style="width:100%;min-height:395px;"
                      >
                  </Diagram>
                  <div class="pd20 operationTip" v-if="!editForm.name">
                    <h3>操作说明：</h3>
                    <ol>
                        <li>先点击选择左侧流程列表名称</li>
                        <li>查看并确认当前审批流程</li>
                        <li>点击【选定当前审批流程】按钮，选定审批流程</li>
                    </ol>
                  </div>
              </div>
          </div>
          <el-button type="primary" @click="confirmProcess" :disabled="!editForm.name">选定当前审批流程</el-button>
          <el-button type="default" @click="addProcess">创建审批流程</el-button>
          </template>
          
          <el-form v-else label-width="100px" :model="editForm" :rules="rules" ref="editForm">
          
            <el-row>
              <el-col :span="12">
                  <el-form-item label="隶属机构：" prop="orgId">
                <el-select
                  ref="orgSelect"
                  v-model="editForm.orgId"
                  placeholder="请选择机构"
                  size="small"
                  style="width: 100%;"
                  filter
                  clearable
                >
                  <el-option v-for="(item, index) in companyBranches" :key="index"
                    @click.native ="handleOrgId(item)"
                    :value="item.orgId"
                    :label="item.orgName"
                  >
                    <!-- <SelectOneOrg :editForm="editForm" @dataChange="orgChange"></SelectOneOrg> -->
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间：">
                  <template v-if="editForm.createDt">
                    <span>{{getFormatTime(editForm.createDt)}}</span>
                    <span class="ml10">创建人：{{editForm.ctUName}}</span>
                  </template>
                  <template v-else>
                     {{getFormatTime(curDate)}}
                    <span class="ml10">创建人： {{userInfo.uName}}</span>
                  </template>
                 
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="流程名称：" prop="name">
                  <el-input
                    size="small"
                    v-model.trim="editForm.name"
                    maxlength="30"
                    placeholder="可由2~30个数字或中英文字母构成"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="流程类型：" prop="category">
                  <el-select v-model="editForm.category" size="small" placeholder="请选择">
                    <el-option
                      v-for="item in processTypeList"
                      :key="item.value"
                      :label="item.cnInfo"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="紧急度：" prop="level">
                  <el-select v-model="editForm.level" size="small" placeholder="请选择">
                    <el-option
                      v-for="item in urgencyList"
                      :key="item.value"
                      :label="item.cnInfo"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="10">
              <el-col :span="12" >
                <div class="diagramBox">
                  <Diagram ref="diag"
                    id="definition"
                    v-if="isShowDiagram"
                    :modelData="diagramData"
                    @model-changed="modelChanged"
                    @changed-selection="changedSelection"
                    style="width:100%;min-height:395px;"
                    ></Diagram>
                    <dl v-if="diagramData.nodeDataArray.length==0" class="operationTip">
                    <dt>
                      <strong class="ml10">操作说明：</strong>
                      </dt>
                    <dd>
                      <ol>
                        <li>节点分2种：审批节点、条件节点</li>
                        <li>添加节点：对应修改审批节点或条件节点相关信息，点击【添加】按钮</li>
                        <li>删除节点：先点击选中节点，按退格或删除键。</li>
                        <li>修改节点：先选中节点，按【编辑当前节点】按钮。对应修改审批节点或条件节点相关信息，然后点击【保存】按钮</li>
                        <li>支持节点拖拽，位置调整功能</li>
                        <li>支持Shift键多选功能</li>
                      </ol>
                    </dd>
                  </dl>
                </div>
                
                  
              </el-col>
              <el-col :span="12">
                  <div class="border">
                    <div class="subTitle">
                        <strong class="ml10">审批节点</strong>
                        <div>
                          <el-button type="primary" v-if="isEditCircle" size="mini" @click="cancleEditCircle">取消</el-button>
                          <el-button type="primary" v-if="isEditCircle" size="mini" @click="saveNode('circle')">保存</el-button>
                          <el-button type="primary" v-else size="mini" @click="addNode('circle')">添加</el-button>
                        </div>
                    </div>
                    <ProcessEdit :definitionSteps="editForm.definitionAppStepsReqs" :orgId="editForm.orgId" :orgName="editForm.orgName" @dataChange="approversChange" :editForm="approvalNodeForm" class="pd20"></ProcessEdit>
                    
                  </div>
                  <div class="mt10 border">
                    <div class="subTitle">
                        <strong class="ml10">条件节点</strong>
                        <div>
                          <el-button type="primary" v-if="isEditDiamond" size="mini" @click="isEditDiamond=false">取消</el-button>
                          <el-button type="primary" v-if="isEditDiamond" size="mini" @click="saveNode('diamond')">保存</el-button>
                          <el-button type="primary" v-else size="mini" @click="addNode('diamond')">添加</el-button>
                        </div>
                        
                    </div>
                    <div class="pd20">
                      <label for="">分支条件：</label>
                      <el-input-number v-model.trim="money" class="ml10" size="small" controls-position="right" :min="1">
                          </el-input-number> 元
                    </div>
                  </div>
              </el-col>
            </el-row>
            <el-row class="mt10">
              <el-col :span="16">
                <el-button type="primary" style="width:200px" :disabled="diagramData.nodeDataArray.length==0" @click="confirm">提 交</el-button>
              </el-col>
              <el-col :span="8" class="tar" v-if="currentNode">
                <el-button type="primary" size="mini" :disabled="currentNode.data.category==='whether' || isEditCircle || isEditDiamond" @click="editNode">编辑当前节点</el-button>
              </el-col>
            </el-row>

          </el-form>
        </div>
        
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { ProcessDefinition } from '@/model/ProcessDefinition'
import {Approver} from '@/model/Approver'
import Api from "@/api/index";
import Util from "@/utils/";
import ValidForm from "@/utils/ValidForm";
import ProcessEdit from "./ProcessEdit";
import { Format } from "@/utils/TimeFormat";
import Diagram from './Diagram'
import SelectOneOrg from "@/components/org/SelectOneOrg";
export default {
  components: {
    ProcessEdit,
    Diagram,
    SelectOneOrg
  },
  computed: {
    currentNodeText: {
      get: function() {
        var node = this.currentNode;
        if (node instanceof go.Node) {
          return node.data.text;
        } else {
          return "";
        }
      },
      set: function(val) {
        var node = this.currentNode;
        if (node instanceof go.Node) {
          var model = this.model();
          model.startTransaction();
          model.setDataProperty(node.data, "text", val);
          model.commitTransaction("edited text");
        }
      }
    },
    processTypeList() {
     return this.$store.state.dictionary.dists.ApprovalCategory.children;
    },
    urgencyList() {
      return this.$store.state.dictionary.dists.ApprovalLevel.children;
    },
    approvalPage() {
      const approvalPage = this.$store.state.approval.approvalPage;
      return approvalPage;
    }
  },
  props:{
    pageFlag:{
      type:String,
      default:'definition'
    },
    category:{
      type:String,
      default:''
    },
  },
  data() {
    const userInfo = JSON.parse(sessionStorage.getItem("jwt"));
    const processDefinition = new ProcessDefinition()
    const approver = new Approver()
    const pageFlag = this.pageFlag
    
    return {
      companyBranches:[],
      isEditCircle:false,  //编辑审批节点
      isEditDiamond:false, //编辑条件节点
      isShowDiagram:true, 
      money:1000, //分支条件金额
      nodeType:'', //有2种：审批节点，条件节点
      diagramData: {  // passed to <diagram> as its modelData
        nodeDataArray: [
          // { key: 1, text: "财务", color: "lightblue", category:'circle'},
          // { key: 2, text: "总经理", color: "orange" , category:'circle'},
          // { key: 3, text: "条件金额超过100元", color: "lightgreen" , category:'diamond'},
        ],
        linkDataArray: [
          // { from: 1, to: 2 },
        ]
      },
      currentNode: null,
      savedModelText: "",
      counter: 1,  // used by addNode
      counter2: 4, // used by modifyStuff
      curDate: new Date(),
      userInfo: userInfo,
      curProcess: null,
      approvers: [], //审批人 
      approversCopy: [],
      processList: [],
      approvalDefinitionPage:{
        total:0,
        records:[],
      },
      editForm: processDefinition,
      //审批节点模型
      approvalNodeForm:approver,
      searchForm: {
        pageSize:10,
        pageNum:1,
        name: "",
        type:pageFlag==='definition'?'0':'1',//0：设置流程 1：选择流程
        orgId:pageFlag==='definition'?'':userInfo.orgId,
        category:this.category?this.category:'',
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入流程名称",
            trigger: ["blur", "change"]
          },
          {
            pattern: ValidForm.ApprovalNameReg,
            message: "名称可由2~30个数字或中英文字母构成",
            trigger: ["change", "blur"]
          }
        ],
        category:[{
            required: true,
            message: "请选择流程分类",
            trigger: ["blur", "change"]
          },],
        level:[
          {
            required: true,
            message: "请选择紧急度",
            trigger: ["blur", "change"]
          },
        ],
        orgId:[
          {
            required: true,
            message: "请选择隶属机构",
            trigger: ["blur", "change"]
          },
        ],
      }
    };
  },
  watch: {
    "editForm.stepsList": function(arr) {
      if(arr){
        this.approvers = arr.filter(item => item.type === 0);
      }
    }
  },
  mounted() {
    this.getApprovalProcess()
    this.getCompanyList()
  },

  methods: {
    handleOrgId(item){
      this.editForm.orgName = item.orgName
     
    },
    getCompanyList(){
      const params = {

      }
      Api.getTopCompanyfo(params).then(res=>{
         this.companyBranches = res
      })
    },
    addProcess(){
      this.$router.push({
        path:'/router/processDefinition'
      })
    },
    //确认选定审批流程
    confirmProcess(){
      console.log(111)
      this.$emit('confirmProcess',this.editForm)
    },
    cancleEditCircle(){
      this.isEditCircle=false
      this.approvalNodeForm = new Approver()
    },
    deleteItem (row) {
      const name = row.name
      this.$confirm(`确定要删除当前流程【${name}】吗。 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        Api.delApproval(params).then(res => {
          this.$message({
            showClose: true,
            message: `流程【${name}】删除成功 ！`,
            type: 'success'
          })
          //重置默认
          this.addItem()
          this.getApprovalProcess()
        })
      }).catch(() => {
      })
    },
   orgChange(data) {
      
      this.editForm.orgName = data.orgName;
      this.editForm.orgId = data.orgId;
      this.$refs.orgSelect.blur();
    },
   //节点选中改变
    changedSelection: function(e) {
      
      let node = e.diagram.selection.first();
      if (node instanceof go.Node) {
        this.currentNode = node;
        this.currentNodeText = node.data.text;
        //this.selectNode(node.data);
        console.log(node.data,'节点选中改变')
       
      }else {
        this.currentNode = null;
        this.currentNodeText = "";
      }
    },
    // get access to the GoJS Model of the GoJS Diagram
    model: function() { return this.$refs.diag.model(); },

    // tell the GoJS Diagram to update based on the arbitrarily modified model data
     updateDiagramFromData: function() {
      this.$refs.diag.updateDiagramFromData(); // 数据变化时调用组件中的更新方法
    },

    // this event listener is declared on the <diagram>
    modelChanged(e) {
      if (e.isTransactionFinished) {  // show the model data in the page's TextArea
        this.savedModelText = e.model.toJson();
      }
    },
    //获取当前节点key
    getCurrentKey(){
      const len = this.diagramData.nodeDataArray.length
      let key = Util.getRandomAlphaNum(8)
      if(len>0){
        //无节点
        const currentNode =this.currentNode
        if(currentNode){
           key = currentNode.data.key
        }
      }
      return key
    },
    //审批节点中有审批人
    isHasApprover(){
      const approvalNodeForm = JSON.parse(JSON.stringify(this.approvalNodeForm))
      const approverList = approvalNodeForm.approverList
      const approvalType = approvalNodeForm.type
      console.log(typeof approvalType, approvalType=='1','approvalType')
      if(approverList){
       
        const isHasApprover = approverList.some(item=>item.type==='0')
        let text = this.counter++
        //审批节点
        if(isHasApprover){
         
          //有审批人 
          const approvers = approverList.filter(item=>item.type==='0')
           console.log(approvers,'approvers')
          const approverTypeName = ['人','角色','岗位']
          const approverType = approverList[0].pendingApprovalType
          const len =approvers.length
          const approvalTypeName = approvalType=='1'?'或签':'会签'
          //处理节点文本
          const firstPerson = approvers[0].pendingApprovalName
          const personType = approverTypeName[approverType]
          let  more = ''
          if(len>=1){
            //大于等于1时
            if(personType==='人' && len>1){
              //如果是人
              more = `等${len}${approverTypeName[approverType]}${approvalTypeName}`
            }else if(personType==='角色' || personType==='岗位'){
              //如果是角色与岗位
              more = len>1?`等${len}${approverTypeName[approverType]}${approvalTypeName}`:`${approverTypeName[approverType]}${approvalTypeName}`
            }
          }
          text = firstPerson + more
          return text;
        }
      }
      return false
    },
    //保存节点
    saveNode(category){
       let currentNode = this.currentNode;
       let text = '';
       var model = this.model();
       if(category==='circle'){
       // node =  model.findNodeDataForKey(key)
         const isHasApprover = this.isHasApprover()
         console.log(isHasApprover,'是否审批人')
        if(isHasApprover){
           text = isHasApprover
           //model.setDataProperty(node, 'text', text);
           //model.setDataProperty(node, 'approvalNode', this.approvalNodeForm);
        }else{
          //没有审批人
          this.$message({
            type:'error',
            showClose:true,
            message:'请添加审批人！'
          })
          return
        }
       }else if(category==='diamond'){
         text = `金额≥${this.money}元`
       }
       this.diagramData.nodeDataArray.map(item=>{
         if(item.key === currentNode.key){
            item.text = text;
            if(category==='circle'){
              item.approvalNode = this.approvalNodeForm
              this.approvalNodeForm = new Approver()
            }else if(category==='diamond'){
              item.money = this.money
            }
         }
        
        return item;
      })
      this.$refs.diag.updateModel(this.diagramData)
      //关闭编辑模式；
      if(category ==='circle'){
         this.isEditCircle = false
      }else if(category==='diamond'){
        this.isEditDiamond = false
      }
      console.log(this.diagramData,'this.diagramData',currentNode,'currentNode')
      var diagram = this.$refs.diag.diagram;
      diagram.select(diagram.findNodeForData(currentNode.data));
    },
    //编辑节点
    editNode(){
      //判断处理当前节点是否为审核节点或条件节点；
      const currentNode = this.currentNode;
      if(currentNode){
        //存在当前节点
        const nodeData = currentNode.data
        console.log(nodeData,'nodeData')
        const category = nodeData.category
        if(category==='circle'){
          //审批节点
          //添加按钮变保存
          this.isEditCircle = true;
          //获取当前审批节点数据
          this.approvalNodeForm = nodeData.approvalNode
          console.log(nodeData.approvalNode,'this.approvalNodeForm')
        }else if(category ==='diamond'){
          //条件节点
          this.isEditDiamond = true;
          this.money = nodeData.money
        }
        console.log('category:',category,'isEditDiamond:',this.isEditDiamond)
      }else{
        this.$message({
          type:'error',
          showClose:true,
          message:'请选中一个节点！'
        })
      }
      
    },
    // Here we modify the GoJS Diagram's Model using its methods,
    // which can be much more efficient than modifying some memory and asking
    // the GoJS Diagram to find differences and update accordingly.
    // Undo and Redo will work as expected.
    addNode(category) {
      let text = '';
      let money = this.money
      let approvalNodeForm = this.approvalNodeForm
      const curNode = this.currentNode
      const nodeCount = this.diagramData.nodeDataArray.length
      console.log(curNode,nodeCount)
      if(nodeCount>0 && !curNode ){
        this.$message({
          showClose:true,
          message:'请选择一个审批节点或文本节点',
          type:'error'
        })
        return 
      }
      //首先，判断是否填写对应的节点信息；
      if(category==='diamond'){
         //条件节点
         if(typeof money !=='number'){
            this.$message({
              type:'error',
              showClose:true,
              message:'请输入分支条件！'
            })
            return
         }else{
           text = `金额≥${money}元`
         }
      }else if(category==='circle'){
        const isHasApprover = this.isHasApprover()
        if(isHasApprover){
           text = isHasApprover
           money = null
           this.approvalNodeForm = new Approver()
        }else{
          //没有审批人
          this.$message({
            type:'error',
            showClose:true,
            message:'请添加审批人！'
          })
          return
        }
        // text = '审批人'
      }

      var model = this.model();
      console.log(model,'model')
      const len = this.diagramData.nodeDataArray.length
      //当前节点KEY
      const key = this.getCurrentKey()
      model.startTransaction();
      //是条件节点 :增加2个是、否文本节点
      // model.setDataProperty(model.findNodeDataForKey(key), "color", "green");
      // let data =  { key:key, text: text, color: "yellow",category:category, money:money, };
      //model.setDataProperty(model.findNodeDataForKey(key));
      let data =  { key:key, text: text, category:category, money:money,approvalNode:approvalNodeForm};
      model.addNodeData(data);
      //初始无节点
      if(len>0){
        model.addLinkData({ from: key, to: model.getKeyForNodeData(data) });
      }
      model.commitTransaction("added Node and Link");
      // also manipulate the Diagram by changing its Diagram.selection collection
      var diagram = this.$refs.diag.diagram;
      diagram.select(diagram.findNodeForData(data));
      if(category==='diamond'){
         const newkey = this.currentNode.data.key
         this.addWhetherNode(newkey,'否')
         this.addWhetherNode(newkey,'是')
      }
    },
    //添加文本节点：是与否节点
    addWhetherNode(key,text){
      var model = this.model();
      model.startTransaction();
      //是条件节点 :增加2个是、否文本节点
      model.setDataProperty(model.findNodeDataForKey(key));
      let data =  { key:key, text: text,category:'whether'};
      model.addNodeData(data);
      model.addLinkData({ from: key, to: model.getKeyForNodeData(data) });
      model.commitTransaction("added Node and Link");
      // also manipulate the Diagram by changing its Diagram.selection collection
      if(text==='是'){
        var diagram = this.$refs.diag.diagram;
        diagram.select(diagram.findNodeForData(data));
      }
      
    },
    //审批节点修改
    approversChange(approverList) {
      
      //获取审批人信息
      this.approvers = approverList.filter(item => item.type === '0');
      this.approvalNodeForm.approverList = approverList;
      console.log(approverList, "approversChange",this.approvalNodeForm.approverList);
    },
    getFormatTime(time, format = "yyyy-MM-dd hh:mm:ss") {
      return time ? Format(time, format) : "";
    },
    getApprovalProcess() {
      const params = this.searchForm;
      Api.approvalDefinitionPage(params).then(res => {
        this.approvalDefinitionPage = res;
      });
    },
     handleSizeChange (val) {
      let params = this.searchForm
      params.pageSize = val
      this.getApprovalProcess()
    },
    handleCurrentChange (val) {
      let params = this.searchForm
      params.pageNum = val
      this.getApprovalProcess()
    },
    isConfirm() {
      if (this.editForm.name && this.approvers.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    // 提交审批定义
    confirm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const diagramData = this.diagramData
          let editForm = this.editForm;
          editForm.nodeDataArray = diagramData.nodeDataArray
          editForm.linkDataArray = diagramData.linkDataArray
          console.log(editForm, "editform",this.diagramData);
          const msg = editForm.id ? "编辑成功" : "添加成功";
          const fn = editForm.id?'updateApproval':'addApproval'
          Api[fn](editForm)
            .then(res => {
              this.$notify.success({
                showClose: true,
                type: "success",
                message: `审批流程【${editForm.name}】${msg}`
              });
              //this.editForm = new ProcessDefinition()
              this.addItem()
              this.getApprovalProcess();
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    addItem() {
      this.curProcess = null;
      this.editForm = new ProcessDefinition()
      this.diagramData= {  
        nodeDataArray: [],
        linkDataArray: []
      }
    },
    showProcessDetails(item, index) {
      this.curProcess = index;
      this.editForm = JSON.parse(JSON.stringify(item));
      console.log()
      // const data = {"category":"0","definitionAppStepsReqs":[],"describe":null,"id":null,"level":"0","name":"测试流程5","orgIds":[],"type":null,"nodeDataArray":[{"key":"driyu62d","text":"管理员","category":"circle","money":1000,"approvalNode":{"type":"1","approverList":[{"pendingApprovalType":0,"type":0,"pendingApprovalId":"70fd33d7-5b3d-425c-bd33-d75b3da25c27","pendingApprovalName":"管理员"}]},"__gohashid":487},{"key":"driyu62d2","text":"金额≥1000元","category":"diamond","money":1000,"approvalNode":{"type":1,"approverList":[{"pendingApprovalType":1,"type":0,"pendingApprovalId":"c2f29582-a7a3-4bfb-b295-82a7a34bfbac","pendingApprovalName":"董事长"}]},"__gohashid":531},{"key":"driyu62d22","text":"否","category":"whether","__gohashid":614},{"key":"driyu62d23","text":"是","category":"whether","__gohashid":702},{"key":"driyu62d232","text":"董事长","category":"circle","money":1000,"approvalNode":{"type":1,"approverList":[{"pendingApprovalType":1,"type":0,"pendingApprovalId":"c2f29582-a7a3-4bfb-b295-82a7a34bfbac","pendingApprovalName":"董事长"}]},"__gohashid":1562},{"key":"driyu62d222","text":"王文正","category":"circle","money":1000,"approvalNode":{"type":1,"approverList":[{"pendingApprovalType":0,"type":0,"pendingApprovalId":"19a1c6b6-3cda-4572-a1c6-b63cdaf572fc","pendingApprovalName":"王文正"}]},"__gohashid":1979}],"linkDataArray":[{"from":"driyu62d","to":"driyu62d2","__gohashid":563},{"from":"driyu62d2","to":"driyu62d22","__gohashid":648},{"from":"driyu62d2","to":"driyu62d23","__gohashid":710},{"from":"driyu62d23","to":"driyu62d232","__gohashid":1571},{"from":"driyu62d22","to":"driyu62d222","__gohashid":1988}],"orgName":"火凤凰集团","orgId":"966d39e1-59ae-4f2d-ad39-e159ae0f2ded"}
      // //处理审批节点与条件节点
      // this.diagramData.nodeDataArray = data.nodeDataArray
      // this.diagramData.linkDataArray = data.linkDataArray
      
      this.diagramData.nodeDataArray = item.nodeDataArray?item.nodeDataArray:[]
      this.diagramData.linkDataArray = item.linkDataArray?item.linkDataArray:[]
      this.$refs.diag.updateModel(this.diagramData)
    }
  }
};
</script>
<style lang="scss" scoped>
.approvalProcess {
  .subTitle {
    border-bottom: 1px solid #eee;
    padding:5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:#000;
  }
  .border {
    border: 1px solid #eee;
    //padding: 10px;
  }
  .searchBox {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .processList {
    margin: 0;
    padding: 0;
    height: 430px;
    overflow: auto;
    .el-icon-remove {
       font-weight: 700;
        color:#c3282f;
        text-align: center;
        font-size:24px;
      }
    li {
      margin-top: 10px;
      height: 24px;
      padding:4px 5px;
      //padding: 5px 5px 5px 10px;
      list-style: none;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // strong {
      //   width:calc(100% - 60px);
      // }
      span {
         display: none;
      }
      
    }
    li.active {
      background-color: #c3282f;
      color: #fff;
    }
    li:hover {
      background-color: #eee;
      color: #4d4d4d;
      strong{
        width:calc(100% - 60px);
      }
      span {
        display: block;
      }
    }
    
  }
  .diagramBox {
    border: solid 1px #eee; 
    width:100%; 
    min-height:350px;
    position: relative;
  }
  .operationTip{
    position: absolute;
    left:10px;
    top:10px;
    dt {
      margin-left:20px;

    }
    dd {
      margin-left:0;
    }
  }
  .selectProcess{
    display: flex;
    justify-content: space-between;
    align-items: top;
    .left {
      width:65%;
      ul,li {
        list-style: none;
         margin-left:0;
         padding-left:0;
      }
      ul {
         li {
           line-height: 2;
         }
      }
    }
    .right {
      width: 30%;
    }
  }
}
</style>
