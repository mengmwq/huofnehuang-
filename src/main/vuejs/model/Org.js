/**
 * 组织机构
 * Created by sunzelong on 2018/11/6.
 */
export class Org {
  constructor() {
    this.available = null; //boolean, optional): 有效标识:0.有效 1.无效 ,
    this.childrenOrgs = []; //Array[BaseOrg], optional): 子机构 ,
    this.conName = null; //string, optional): 联系人 ,
    this.conMobile = null; //string, optional): 联系人电话 ,
    this.createAt = null; //string, optional): 创建时间 ,
    this.updateAt = null //string, optional): 更新时间
    this.intro = null; //string, optional): 组织简介 ,
    this.id = null; //integer, optional): 组织id ,
    this.linkIds = null; //string, optional): 关系链 ,
    this.logo = null; //string, optional): LOGO ,
    this.name = ''; //string, optional): 机构名称 ,
    this.parentId = null; //integer, optional): 父级id ,
    this.parentName = null;  // 前台加
    this.sortno = null;  // integer($int32)  allowEmptyValue: false   内部排序
    this.type = null; //	string allowEmptyValue: false 组织类型 1-公司 2-部门  
  }
}
