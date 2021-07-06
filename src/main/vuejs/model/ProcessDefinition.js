/**
 *  流程定义
 * Created by sunzelong on 2020/02/26.
 */
export class ProcessDefinition {
  constructor() {
    this.category=null; //string  流程分类
    this.definitionAppStepsReqs= [],
    this.describe=null; //string 流程描述
    this.id=null; //string
    this.level=null; //string  是否仅领导层可见
    this.name=null; //string  名称
    this.orgIds =[],
    this.type=null; //string  职位审批标志位
    this.nodeDataArray = []; //审批节点、条件节点数据
    this.linkDataArray=[];
    this.orgName =null;
    this.orgId=null;
  }
}
