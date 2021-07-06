//  definitionAppProcessReq 增加审批节点使用的字段；原有字段可以不变。
definitionAppProcessReq: {
  category:'',//	string
  //流程分类
  describe:'',
  //流程描述
  id:'',  
  //主键
  level:'',
  //紧急度
  name:'',
  //名称
  orgId:'',//	string
  //所属分公司

  orgName:'',//	string
  //所属分公司名称

  type:'',//	string 
  //岗位审批标志位

  //审批流程节点   
  /**
   * 其中 字段money是条件审批输入的金额；approvalNodeInfo 用于审批节点信息；其他的字段用于审批流程显示使用；
   * 其中 字段category 用于区分是审批节点 ，还是条件节点
  */
  nodeDataArray: [
    {
      key: '12345678', text: "财务", color: "lightblue", category: 'circle', money:null, approvalNodeInfo: {
        approvalType:1,  // 审批类型 :  0会签 1或签
          approverList:[
            {
              pendingApprovalType: 0, //待审批类型 0:人1:角色2:岗位
              type: 0,  //审批人类型：审批人 0， 抄送人：1
              pendingApprovalName: '张三', //审批名称 
              pendingApprovalId:'safdsfasdsa',//审批人ID,  （可能为空看接口是否有）
            }
          ]
      }
    },
    {
      key: 'a1212121', text: "总经理", color: "orange", category: 'circle', money:null, approvalNodeInfo: null
    },
    {
      key: '344444444', text: "条件金额超过100元", color: "lightgreen", category: 'diamond', money: 100, approvalNodeInfo: null
    },
  ],

  //审批流程节点连线
  linkDataArray: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
  ]
}