/**
 * 项目收支
 * Created by sunzelong on 2018/11/2.
 */
export class ProjectFinance {
  constructor() {

    this.id=null;
    
    this.name=null;

    //关联id,添加时使用
    this.relationId=null;

    //关联类型,添加时使用
    this.relationType=null;

    //名头
    this.renown=null;

    //收款方
    this.receiver=null;

    //类型,添加时使用
    this.type=null;

    //应收金额
    this.amount=null;
    //已收金额
    this.receiverAmount=null;
    //备注,添加时使用
    this.remarks=null;
    this.ctUId=null;

    //创建人
    this.ctUName=null;

    /**
     * 创建时间
     * isNullAble:1,defaultVal:now()
     */
   this.createDt=null;

  }
}
