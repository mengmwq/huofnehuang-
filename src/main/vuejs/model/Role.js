/**
 * 角色
 * Created by sunzelong on 2018/11/2.
 */
export class Role {
  constructor() {
    //角色id   allowEmptyValue: false   integer($int32)
    this.id = null;    
    //角色名称  allowEmptyValue: false
    this.name = null;
    //角色描述  allowEmptyValue: false
    this.intro = null;
    //创建时间    string($date-time)
    this.createAt = null;   
    //更新时间   string($date-time)
    this.updateAT = null;
    //有效标识 T-有效 F-无效  boolean    allowEmptyValue: false
    this.available = null;
    //角色类型 0资源角色 1机构角色
    //this.type = null;
    //已绑定的资源列表   allowEmptyValue: false
    this.resourceList = [];
    //  allowEmptyValue: false
    this.resourceIds =[];     //存储选中的及半选中的节点，后台获取UI资源使用
    this.resourceIdsShow =[];   // 仅存储全部选中的节点，前台显示使用
    //已绑定的机构列表  allowEmptyValue: false
    this.datarangeBizcontrol = null;
    //绑定的组织id  integer($int32)  allowEmptyValue: false
	  this.datarangeBizcontrolId= null
    
  }
}
