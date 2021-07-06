/**
 * 任务分布
 * Created by sunzelong on 2018/12/15.
 */
export class TaskDistribution {
  constructor() {
    this.id=null;

    //ApiModelProperty(value = "备注")
    this.remarks=null;

    //ApiModelProperty(value = "开始时间")
    this.startTime=null;

    //ApiModelProperty(value = "结束时间")
    this.endTime=null;

    //ApiModelProperty(value = "颜色")
    this.colour=null;

    //TableField(fill = FieldFill.INSERT)
    this.ctUId=null;

    //TableField(fill = FieldFill.INSERT)
    this.type=null;
    
    //ApiModelProperty(value = "任务")
    this.taskName=null;
    
    //ApiModelProperty(value = "名称")
    this.name=null;
    
    //ApiModelProperty(value = "部门id")
    this.orgId=null;
  }
}
