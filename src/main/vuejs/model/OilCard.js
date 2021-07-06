/**
 *  油卡
 * Created by sunzelong on 2018/11/6.
 */
export class OilCard {
  constructor() {
    //id
    this.id = null;

    //车辆id
    this.carId = null;

    //申请id
    this.approvalId = null;

    //申请状态
    this.approvalStatus = null;

    //内容
    this.content = null;

    //备注
    this.remarks = null;

    //公里数
    this.kilometres = null;

    //流程id
    this.approvalDefinitionId = null;

    //流程id
    this.approvalDefinition = null;

    //起始地
    this.startingPlace = null;

    //目的地
    this.destination = null;

    //金额
    this.amount = null;
    //创建者ID
    this.ctUId = null;

    //创建时间
    this.createDt = null;
   //单据
    this.attachmentList=[];
    //更新者ID

    this.updUId = null;
    //更新时间
    this.updateDt = null;
    this.projectCode =null;
  }
}
