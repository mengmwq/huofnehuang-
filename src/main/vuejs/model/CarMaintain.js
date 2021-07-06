/**
 *  维修保养
 * Created by sunzelong on 2018/11/6.
 */
export class CarMaintain {
  constructor() {
    this.carId=null;// '',  //车辆ID（非空）
    this.registrationNumber=null;// '',
    this.accidentRd=null;//'',  //出险记录ID
    this.currentMileageNumber=null;//'',  //当前里程数
    this.fee=null;//'',  //费用
    this.delFlg=null;//'0',  //删除标志
    this.maintainContent=null;//'',  //所做项目
    this.maintainDate=null;//'',  //保养日String	
    this.maintainType=null;//'',  //保养类型001=null;//保养 002=null;//维修
    this.nextMileageNumber=null;//'',  //下次保养里程数
    this.serviceCompany=null;//'',  //服务单位
    this.attachmentList=[];//[],
    this.borrowingFee=null;//借款费用金额
  }
}
