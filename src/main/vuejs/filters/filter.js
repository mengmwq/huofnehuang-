/**
 * 过滤器
 * @param arr
 * @param val
 * @returns {*}
 */
export function filter (arr, val) {
  for (let i = 0; i < arr.length; i++) {
    // noinspection EqualityComparisonWithCoercionJS
    if (arr[i].value === val) {
      return arr[i].label
    }
  }
  return val
}
/**
 * 账号状态 filter
 * @param val
 * @returns {*}
 */
export function accountDelFilter (val) {
  return filter(accountDelArr(), val)
}
/**
 * 账号状态 Array
 * 0:启用 1:停用
 * @returns {*[]}
 */
export function accountDelArr () {
  return [{
    label: '启用',
    value: '0'
  }, {
    label: '停用',
    value: '1'
  }]
}

/**
 * 任务状态 filter
 * @param val
 * @returns {*}
 */
export function taskStatesFilter (val) {
  return filter(taskStatesArr(), val)
}

/**
 * 任务状态 Array
 * @returns {*[]}
 */
export function taskStatesArr () {
  return [{
    label: '待指派',
    value: '001'
  },{
    label: '指派中',
    value: '002'
  },{
    label: '待审批',
    value: '003'
  },{
    label: '执行中',
    value: '004'
  },{
    label: '已完成',
    value: '005'
  },{
    label: '已拒绝',
    value: '006'
  }]
}

/**
 * 投标文件类型 filter
 * @param val
 * @returns {*}
 */
export function bidFileTypeFilter (val) {
  return filter(bidFileTypeArr(), val)
}

/**
 * bidFileTypeArr Array
 * @returns {*[]}
 */
export function bidFileTypeArr () {
  return [{
    label: '投标文件',
    value: '001'
  },{
    label: '申请资质',
    value: '002'
  },{
    label: '投标授权委托书',
    value: '003'
  },{
    label: '投标人身份证',
    value: '004'
  },{
    label: '证照',
    value: '005'
  },{
    label: '合同',
    value: '006'
  },{
    label: '发票',
    value: '007'
  },{
    label: '其他',
    value: '008'
  },{
    label: '招标文件',
    value: '009'
  }]
}


/**
 * 任务类型 filter
 * @param val
 * @returns {*}
 */
export function taskTypeFilter (val) {
  return filter(taskTypeArr(), val)
}

/**
 * taskTypeFilter Array
 * @returns {*[]}
 */
export function taskTypeArr () {
  return [{
    label: '包装预算任务',
    value: '001'
  },{
    label: '外勤预算任务',
    value: '002'
  },{
    label: '报关预算任务',
    value: '003'
  },{
    label: '包装任务',
    value: '004'
  },{
    label: '外勤-提货',
    value: '005'
  },{
    label: '外勤-送货',
    value: '006'
  },{
    label: '外勤-布展',
    value: '007'
  },{
    label: '外勤-撤展',
    value: '008'
  },{
    label: '外勤-监装',
    value: '009'
  },{
    label: '外勤-点交',
    value: '010'
  },{
    label: '报关',
    value: '011'
  },{
    label: '批文',
    value: '012'
  },{
    label: '仓储-项目入库',
    value: '013'
  },{
    label: '仓储-项目出库',
    value: '014'
  },{
    label: '保险-公司投保',
    value: '017'
  },{
    label: '保险-代理投保',
    value: '018'
  },{
    label: '航材操作-提货',
    value: '019'
  },{
    label: '航材操作-进口调单',
    value: '020'
  },{
    label: '航材操作-进仓',
    value: '021'
  },{
    label: '航材操作-出仓',
    value: '022'
  },{
    label: '航材操作-送货',
    value: '023'
  },{
    label: '航材操作-标签粘贴',
    value: '024'
  },{
    label: '航材操作-出口货物交运',
    value: '026'
  },{
    label: '航材操作-出口货物交单',
    value: '027'
  },{
    label: '航材操作-包装更换',
    value: '028'
  },{
    label: '航材出口-文件确认',
    value: '029'
  },{
    label: '航材操作-进口提货发运',
    value: '030'
  },{
    label: '航材出口-编辑分单号',
    value: '031'
  },{
    label: '航材出口-制作标签',
    value: '032'
  },{
    label: '航材出口-货物核对',
    value: '033'
  },{
    label: '航材出口-托运书制作',
    value: '034'
  },{
    label: '航材出口-制作航空运单',
    value: '035'
  },{
    label: '航材出口-补全项目基本信息',
    value: '036'
  },{
    label: '航材出口-POD跟踪',
    value: '037'
  },{
    label: '航材出口-账单制作',
    value: '038'
  },{
    label: '航材进口-报关信息确认',
    value: '039'
  },{
    label: '航材进口-制作去向清单',
    value: '040'
  },{
    label: '航材进口-账单制作',
    value: '041'
  },{
    label: '航材运输-提货任务',
    value: '042'
  },{
    label: '航材运输-装车任务',
    value: '043'
  },{
    label: '航材运输-卸货任务',
    value: '044'
  }]
}

export function toThousandsNoZero(num) {    
    return num ? ( (isNaN(parseFloat(num.toString().replace(/,/g, ""))) ? 1 : parseFloat(num.toString().replace(/,/g, "")))).toFixed(2).toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ",";
    }) : "";
}
/**
 * 任务级别 filter
 * @param val
 * @returns {*}
 */
export function taskLevelFilter (val) {
  return filter(taskLevelArr(), val)
}

/**
 * 任务级别 Array
 * @returns {*[]}
 */
export function taskLevelArr () {
  return [{
    label: '当代艺术品',
    value: '001'
  }, {
    label: '文物',
    value: '002'
  }, {
    label: '发动机',
    value: "003"
  }, {
    label: '非发动机',
    value: "004"
  }]
}
/**
 * 位 filter
 * @param val
 * @returns {*}
 */
export function weiFilter (val) {
  return filter(weiArr(), val)
}
/**
 * 到站类型 Array
 * @returns {*[]}
 */
export function weiArr () {
  return [{
    label: '空位',
    value: '0'
  }, {
    label: '入库核准中',
    value: '1'
  }, {
    label: '满位',
    value: '2'
  }, {
    label: '出库核准中',
    value: '3'
  }]
}

/**
 * 正式报价标识 filter
 * @param val
 * @returns {*}
 */
export function offerRegularFilter (val) {
  return filter(offerRegularArr(), val)
}
/**
 * 正式报价标识 Array
 * @returns {*[]}
 */
export function offerRegularArr () {
  return [{
    label: '临时',
    value: '0'
  }, {
    label: '正式',
    value: '1'
  }]
}
/**
 * 项目类型 filter
 * @param val
 * @returns {*}
 */
export function projectTypeFilter (val) {
  return filter(projectTypeArr(), val)
}
/**
 * 项目类型 Array
 * @returns {*[]}
 */
export function projectTypeArr () {
  return [{
    label: '艺术品项目',
    value: '1'
  }, {
    label: '航材国内',
    value: '2'
  }, {
    label: '航材国际',
    value: '3'
  }]
}
/**
 * 出入库途径
 * stockChannel filter
 * @param val
 * @returns {*}
 */
export function stockChannelFilter (val) {
  return filter(stockChannelArr(), val)
}
/**
 * stockChannel Array
 * @returns {*[]}
 */
export function stockChannelArr () {
  return [{
    label: '项目任务入库',
    value: '001'
  }, {
    label: '项目任务出库',
    value: '002'
  }, {
    label: '手动入库',
    value: '003'
  }, {
    label: '手动出库',
    value: '004'
  }, {
    label: '移库入库',
    value: '005'
  }, {
    label: '移库出库',
    value: '006'
  }]
}
/**
 * retrievalFlgfilter
 * @param val
 * @returns {*}
 */
export function retrievalFlgFilter (val) {
  return filter(retrievalFlgArr(), val)
}
/**
 * retrievalFlg Array
 * @returns {*[]}
 */
export function retrievalFlgArr () {
  return [{
    label: '已入库',
    value: '0'
  }, {
    label: '已出库',
    value: '1'
  }, {
    label: '未入库',
    value: '2'
  }, {
    label: '未出库',
    value: '3'
  }, {
    label: '待核准',
    value: '4'
  }, {
    label: '已拒绝',
    value: '5'
  }]
}
/**
 * Currency filter
 * @param val
 * @returns {*}
 */
export function currencyFilter (val) {
  return filter(currencyArr(), val)
}
/**
 * currencyArr Array
 * @returns {*[]}
 */
export function currencyArr () {
  return [{
    label: '人民币',
    value: '001'
  }, {
    label: '美元',
    value: '002'
  },{
    label: '欧元',
    value: '003'
  },{
    label: '英镑',
    value: '004'
  },{
    label: '日元',
    value: '005'
  }]
}

/**
 * taskState filter
 * @param val
 * @returns {*}
 */
export function taskStateFilter (val) {
  return filter(taskStateArr(), val)
}
/**
 * currencyArr Array
 * @returns {*[]}
 */
export function taskStateArr () {
  return [{
    label: '待指派',
    value: '001'
  }, {
    label: '指派中',
    value: '002'
  },{
    label: '待审批',
    value: '003'
  },{
    label: '执行中',
    value: '004'
  },{
    label: '已完成',
    value: '005'
  },{
    label: '已拒绝',
    value: '005'
  }]
}
/**
 * projectState filter
 * @param val
 * @returns {*}
 */
export function projectStateFilter (val) {
  return filter(projectStateArr(), val)
}
/**
 * currencyArr Array
 * @returns {*[]}
 */
export function projectStateArr () {
  return [{
    label: '预算中',
    value: '001'
  }, {
    label: '完成预算',
    value: '002'
  },{
    label: '已报价',
    value: '003'
  },{
    label: '报价中',
    value: '004'
  }, {
    label: '操作中',
    value: '005'
  },{
    label: '包装/拆包装完成',
    value: '006'
  },{
    label: '布展/撤展完成',
    value: '007'
  },{
    label: '运输中',
    value: '008'
  },{
    label: '货物抵达目的地',
    value: '009'
  },{
    label: '已收款',
    value: '010'
  },{
    label: '项目作废',
    value: '011'
  },{
    label: '操作完成',
    value: '012'
  },{
    label: '批文申请',
    value: '013'
  },{
    label: '批文已申请',
    value: '014'
  },{
    label: '报关状态-报关单待确认',
    value: '016'
  },{
    label: '报关状态-申报',
    value: '017'
  },{
    label: '报关状态-申报无税',
    value: '018'
  },{
    label: '报关状态-未缴税',
    value: '019'
  },{
    label: '报关状态-已缴税',
    value: '020'
  },
  //临时处理；此状态为投标状态-已报名
  {
    label: '未成立',
    value: '023'
  },{
    label: '报关状态-查验',
    value: '021'
  },{
    label: '投标状态-投标完成',
    value: '043'
  },{
    label: '投标状态-未报名',
    value: '044'
  },{
    label: '已结案',
    value: '045'
  }]
}

/**
 * approvalState filter
 * @param val
 * @returns {*}
 */
export function approvalStateFilter (val) {
  return filter(approvalStateArr(), val)
}
/**
 * approvalState Array
 * @returns {*[]}
 */
export function approvalStateArr () {
  return [{
    label: '拒绝',
    value: '0'
  }, {
    label: '批准',
    value: '1'
  },{
    label: '待审批',
    value: '2'
  },{
    label: '审批中',
    value: '3'
  }]
}
/**
 * approvalApplyState filter
 * @param val
 * @returns {*}
 */
export function approvalApplyStateFilter (val) {
  return filter(approvalApplyStateArr(), val)
}
/**
 * approvalState Array
 * @returns {*[]}
 */
export function approvalApplyStateArr () {
  return [{
    label: '拒绝',
    value: '0'
  }, {
    label: '批准',
    value: '1'
  },{
    label: '待审批',
    value: '2'
  },{
    label: '审批中',
    value: '3'
  },{
    label: '撤回',
    value: '4'
  }]
}
/**
 * logOperateType filter
 * @param val
 * @returns {*}
 */
export function logOperateTypeFilter (val) {
  return filter(logOperateTypeArr(), val)
}
/**
 * logOperateType Array
 * @returns {*[]}
 */
export function logOperateTypeArr () {
  return [{
    label: '登录',
    value: 'LOGIN'
  }, {
    label: '注销',
    value: 'LOGOUT'
  },{
    label: '注册',
    value: 'REGISTER'
  },{
    label: '认证',
    value: 'IDENTIFICATION'
  },{
    label: '申请',
    value: 'APPLYFOR'
  },{
    label: '审批',
    value: 'APPROVAL'
  },{
    label: '手动入库',
    value: 'MANUALENTRYSTOCK'
  },{
    label: '手动出库',
    value: 'MANUALOUTSTOCK'
  },{
    label: '移库',
    value: 'CHANGESTOCK'
  },{
    label: '任务入库',
    value: 'TASKENTRYSTOCK'
  },{
    label: '任务出库',
    value: 'TASKOUTSTOCK'
  },{
    label: '修改库存信息(状态)',
    value: 'UPDATESTOCK'
  },{
    label: '添加',
    value: 'ADD'
  },{
    label: '提交',
    value: 'SUBMIT'
  },{
    label: '更新',
    value: 'UPDATE'
  },{
    label: '删除',
    value: 'DELETE'
  },{
    label: '交易',
    value: 'TRADE'
  }]
}

/**
 *
 * 申请审批类型
 * approvalTargetType filter
 * @param val
 * @returns {*}
 */
export function approvalTargetTypeFilter (val) {
  return filter(approvalTargetTypeArr(), val)
}
/**
 * approvalTargetType Array
 * @returns {*[]}
 */
export function approvalTargetTypeArr () {
  return [{
    label: '合同审批',
    value: '001'
  }, {
    label: '报价审批',
    value: '002'
  },{
    label: '投标审批',
    value: '003'
  },{
    label: '发票审批',
    value: '004'
  },{
    label: '付款审批',
    value: '005'
  },{
    label: '借款审批',
    value: '006'
  },{
    label: '差旅报销审批',
    value: '007'
  },{
    label: '报销审批',
    value: '008'
  },{
    label: '异常审批',
    value: '009'
  },{
    label: '物料消耗审批',
    value: '010'
  },{
    label: '工具消耗审批',
    value: '011'
  },{
    label: '航材报关审批',
    value: '012'
  },{
    label: '标书审批',
    value: '013'
  },{
    label: '行政审批',
    value: '014'
  },
  {
    label: '车辆保养审批',
    value: '015'
  },
  {
    label: '出险记录审批',
    value: '016'
  },
  {
    label: '加油费用审批',
    value: '017'
  },{
    label: 'ETC费用审批',
    value: '018'
  }]

}
/**
 *
 * 审批类型
 * approvalCategory filter
 * @param val
 * @returns {*}
 */
export function approvalCategoryFilter (val) {
  return filter(approvalCategoryArr(), val)
}
/**
 * approvalCategory Array
 * @returns {*[]}
 */
export function approvalCategoryArr () {
  return [{
    label: '财务',
    value: '0'
  }, {
    label: '合同',
    value: '1'
  },{
    label: '投标',
    value: '2'
  },{
    label: '报价',
    value: '3'
  },{
    label: '异常',
    value: '4'
  },{
    label: '报关',
    value: '5'
  },{
    label: '操作库',
    value: '6'
  },{
    label: '车辆',
    value: '7'
  }]
}

/**
 *
 * 投标状态类型
 * approvalCategory filter
 * @param val
 * @returns {*}
 */
export function biddingFilter (val) {
  return filter(biddingType(), val)
}
/**
 * approvalCategory Array
 * @returns {*[]}
 */
export function biddingType () {
  return [{
		    label: '报名',
		    value: '0'
		  }, {
		    label: '标书审核',
		    value: '1'
		  },{
		    label: '开标',
		    value: '2'
		  },{
		    label: '中标',
		    value: '3'
		  }, {
		    label: '未中标',
		    value: '4'
		  },{
		    label: '流程被驳回',
		    value: '5'
		  }, {
		    label: '未作投标文件',
		    value: '6'
		  }, {
		    label: '投标文件未投标',
		    value: '7'
		  }]
}


/**
 * payingState filter
 * @param val
 * @returns {*}
 */
export function payingStateFilter (val) {
  return filter(payingStateArr(), val)
}
/**
 * payingState Array
 * @returns {*[]}
 */
export function payingStateArr () {
  return [{
    label: '未结算',
    value: '001'
  }, {
    label: '部分结算',
    value: '002'
  },{
    label: '已结算',
    value: '003'
  }]
}
/**
 * transport filter
 * @param val
 * @returns {*}
 */
export function transportFilter (val) {
  return filter(transportArr(), val)
}
/**
 * transport Array
 * @returns {*[]}
 */
export function transportArr () {
  return [{
    label: '海运',
    value: '0'
  }, {
    label: '陆运',
    value: '1'
  },{
    label: '空运',
    value: '2'
  },{
    label: '其他',
    value: '3'
  }]
}
/**
 * trafficType filter
 * @param val
 * @returns {*}
 */
export function trafficTypeFilter (val) {
  return filter(trafficTypeArr(), val)
}
/**
 * trafficType Array
 * @returns {*[]}
 */
export function trafficTypeArr () {
  return [{
    label: '飞机',
    value: '001'
  }, {
    label: '火车',
    value: '002'
  },{
    label: '轮船',
    value: '003'
  },{
    label: '巴士',
    value: '004'
  },{
    label: '出租车',
    value: '005'
  },{
    label: '地铁',
    value: '006'
  },{
    label: '公交',
    value: '007'
  }]
}
/**
 * carType filter
 * @param val
 * @returns {*}
 */
export function carTypeFilter (val) {
  return filter(carTypeArr(), val)
}
/**
 * carType Array
 * @returns {*[]}
 */
export function carTypeArr () {
  return [{
    label: '挂车',
    value: '001'
  }, {
    label: '货车',
    value: '002'
  }, {
    label: '轿车',
    value: '003'
  }, {
    label: '行政车',
    value: '004'
  }]
}


/**
 * carFileType filter
 * @param val
 * @returns {*}
 */
export function carFileTypeFilter (val) {
  return filter(carFileTypeArr(), val)
}
/**
 * carFileType Array
 * @returns {*[]}
 */
export function carFileTypeArr () {
  return [{
    label: '行驶证',
    value: '001'
  }, {
    label: '道路运输许可证',
    value: '002'
  },{
    label: '保险单',
    value: '003'
  },{
    label: '车辆照片(正)',
    value: '004'
  },{
    label: '车辆照片(侧)',
    value: '005'
  },{
    label: '其他',
    value: '006'
  }]
}


/**
 * 日期格式化
 * 2018-08-31 00:00:00 == > 2018年08月31日 00:00
 * @param val
 */
export function dateFormat (val) {
  if (val) {
    let d = new Date(val);
    let year = d.getFullYear();
    let month = change(d.getMonth() + 1);
    let day = change(d.getDate());
    let hour = change(d.getHours());
    let minute = change(d.getMinutes());

    return year + '年' + month + '月' + day + '日 '
  }
}


/**
 * 时间戳格式化
 * 1546825183431 == > 2018-08-31 00:00
 * @param val
 */

export function timeFormat1 (val) {

  if (val) {
    let d = new Date(val);
    let year = d.getFullYear();
    let month = change(d.getMonth() + 1);
    let day = change(d.getDate());
    let hour = change(d.getHours());
    let minute = change(d.getMinutes());
    let milliseconds = change(d.getMilliseconds());
    return year + '-' + month + '-' + day + ' ' + hour+ ':'+ minute + ':' + milliseconds
  }
}
export function timeFormat(timestamp) {
 
  if (timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
  }
}
export function timeFormatOpening(timestamp) {
  if (timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
    return Y+M+D+h+m;
  }
}
//投标列表时间
export function timeFormatBid(timestamp) {
  if (timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    return Y+M+D;
  }
}

/**
 * 合同状态转码
 * 001:审批中
 * 002:审批拒绝
 * 003:进行中
 * 004:完成
 * 005:终止
 */
/**
 * contractState filter
 * @param val
 * @returns {*}
 */
export function contractStateFilter (val) {
  return filter(contractStateArr(), val)
}
/**
 * carFileType Array
 * @returns {*[]}
 */
export function contractStateArr () {
  return [{
    label: '审批中',
    value: '001'
  }, {
    label: '审批拒绝',
    value: '002'
  },{
    label: '进行中',
    value: '003'
  },{
    label: '完成',
    value: '004'
  },{
    label: '终止',
    value: '005'
  }]
}

export function tate (val) {
  if
(val==='004') {
  return '完成'
}else if(val==='005'){
  return '终止'
}else if(val==='001'){
  return '审批中'
}else if(val==='002'){
  return '审批拒绝'
}else if(val==='003'){
  return '进行中'
}
}

/**
 * contractObjectType filter
 * @param val
 * @returns {*}
 */
export function contractObjectTypeFilter (val) {
  return filter(contractObjectTypeArr(), val)
}
/**
 * contractObjectType Array
 * @returns {*[]}
 */
export function contractObjectTypeArr () {
  return [{
    label: '供应商',
    value: '001'
  }, {
    label: '客户',
    value: '002'
  },{
    label: '战略合作伙伴',
    value: '003'
  }]
}
/**
 * 危险标识符
 * 0非危险
 * 1危险
 */
export function dangerGoods (val) {
  if (val==='0') {
    return '非危险品'
  }else if(val==='1') {
    return '危险品'
  }
}

/**
 * contractType filter
 * @param val
 * @returns {*}
 */
export function contractTypeFilter (val) {
  return filter(contractTypeArr(), val)
}
/**
 * contractType Array
 * @returns {*[]}
 */
export function contractTypeArr () {
  return [{
    label: '采用合同',
    value: '001'
  }, {
    label: '采购合同',
    value: '002'
  },{
    label: '租赁合同',
    value: '003'
  },{
    label: '销售合同',
    value: '004'
  },{
    label: '服务代理合同',
    value: '005'
  },{
    label: '保险合同',
    value: '006'
  },{
    label: '战略合同',
    value: '007'
  },{
    label: '其他',
    value: '008'
  }]
}

/**
 * 合同类型
 */
export function contractType1 (val) {
  if (val==='001') {
    return '采用合同'
  }else if(val==='002') {
    return '采购合同'
  }else if(val==='003') {
    return '租赁合同'
  }else if(val==='004') {
    return '销售合同'
  }else if(val==='005') {
    return '服务代理合同'
  }else if(val==='006') {
    return '保险合同'
  }else if(val==='007') {
    return '战略合同'
  }else if(val==='008') {
    return '其他'
  }
}


/**
 * packagingType filter
 * @param val
 * @returns {*}
 */
export function packagingTypeFilter (val) {
  return filter(packagingTypeArr(), val)
}
/**
 * packagingType Array
 * @returns {*[]}
 */
export function packagingTypeArr () {
  return [{
    label: '纸',
    value: '0'
  }, {
    label: '木',
    value: '1'
  },{
    label: '多层板',
    value: '2'
  },{
    label: '其他',
    value: '3'
  }]
}

/**
 * 国际航材新增货物明细-包装明细
 * 0 纸
 * 1 木
 * 2 多层板
 * 3 其他
 */
export function packagingType (val) {
  if (val==='0') {
    return '纸'
  }else if(val==='1') {
    return '木'
  }else if(val==='2') {
    return '多层板'
  }else if(val==='3') {
    return '其他'
  }
}

/**
 报名方式
 */
export function registrationMethod (val) {
  if (val==='001') {
    return '网上报名'
  }else if(val==='002'){
    return '现场报名'
  }
}

/**
 借款状态
 */
export function borrowState (val) {
  if (val==='001') {
    return '未完成'
  }else if(val==='002'){
    return '已完成'
  }
}

/**
 * fileType filter 文件类型
 * @param val
 * @returns {*}
 */
export function fileTypeFilter (val) {
  return filter(fileTypeArr(), val)
}
/**
 * fileType Array
 * @returns {*[]}
 */
export function fileTypeArr () {
  return [{
    label: '证件',
    value: '001'
  }, {
    label: '文件',
    value: '002'
  },{
    label: '招标文件',
    value: '003'
  }]
}

/**
 * tradeType filter 文件类型
 * @param val
 * @returns {*}
 */
export function tradeTypeFilter (val) {
  return filter(tradeTypeArr(), val)
}
/**
 * tradeTypeArr Array
 * @returns {*[]}
 */
export function tradeTypeArr () {
  return [{
    label: '进口',
    value: 'PI'
  }, {
    label: '出口',
    value: 'PE'
  },{
    label: '暂时进口',
    value: 'TI'
  },{
    label: '暂时出口',
    value: 'TE'
  },{
    label: '复进口',
    value: 'RI'
  },{
    label: '复出口',
    value: 'RE'
  }]
}


/**
 发票状态
 */

export function invoiceStatus (val) {
  if (val==='001') {
    return '未开票'
  }else if(val==='002'){
    return '开票中'
  }else if(val==='003'){
    return '已开票'
  }
}

/**
 发票类型
 */
export function invoiceType1 (val) {
  if (val==='001') {
    return '增值税专用发票'
  }else if(val==='002') {
    return '增值税普通发票'
  }
}
/**
 是否首次
 */
export function isfirst (val) {
  if (val==='1') {
    return '是'
  }else if(val==='0') {
    return '否'
  }
}


/**
 报销状态
 */
export function applyStatus (val) {
  if (val === '001') {
    return '未完成'
  } else if (val === '002') {
    return '已完成'
  }
}

/**
 付款方式
 */
export function payTypeinFilter (val) {
  if (val === '001') {
    return '现金'
  } else if (val === '002') {
    return '银行'
  } else if (val === '003') {
    return '冲账'
  }
}
/**
 * payMethod filter 文件类型
 * @param val
 * @returns {*}
 */
export function payMethodFilter (val) {
  return filter(payMethodArr(), val)
}
/**
 * payMethod Array
 * @returns {*[]}
 */
export function payMethodArr () {
  return [{
    label: '现金',
    value: '001'
  }, {
    label: '银行',
    value: '002'
  },{
    label: '冲账',
    value: '003'
  }]
}





/**
  城市状态
 */
export function travelVal (val) {
  if (val === '001') {
    return '一线城市'
  } else if (val === '002') {
    return '二线城市'
  } else if (val === '003') {
    return '三线城市'
  }else if (val === '004') {
    return '港澳台'
  }
}

/**
  差旅管理
 */
export function travelValState (val) {
  if (val === '001') {
    return '未完成'
  } else if (val === '002') {
    return '已完成'
  }

}

/**
 * 时间戳格式化
 * 1546825183431 == > 2018-08-31
 * @param val
 */

export function DateFormat (val) {

  if (val) {
    let d = new Date(val);
    let year = d.getFullYear();
    let month = change(d.getMonth() + 1);
    let day = change(d.getDate());
    return year + '-' + month + '-' + day
  }
}
/**
 * 手机号隐藏中间4位
 * 13880569985 => 138****9985
 */
export function phoneFilter (val) {
  if (val) {
    return val.substring(0, 3) + '****' + val.substring(7)
  }
}
/**
 * 性别filter
 */
export function sexFilter (val) {
  if (val) {
    return val === '1' ? '男' : '女'
  }
}

/** 支付方式 */
export function payTypeFilter (val) {
  if (val) {
    return val === 1 ? '支付宝' : '微信'
  }
}


function change (t) {
  if (t < 10) {
    return '0' + t
  } else {
    return t
  }
}

export function getToday () {
  let d = new Date();
  let year = d.getFullYear();
  let month = change(d.getMonth() + 1);
  let day = change(d.getDate());
  return year + '-' + month + '-' + day
}

/**
 * 项目时效等级 filter
 * @param val
 * @returns {*[]}
 */
export function projectLevelFilter (val) {
  return filter(projectLevelArr(), val)
}

/**
 * 项目时效等级 数组
 * @returns {*[]}
 */
export function projectLevelArr () {
  return [{
    label: '一级',
    value: '001'
  }, {
    label: '二级',
    value: '002'
  }, {
    label: '三级',
    value: '003'
  }]
}

/**
 *
 * 付款费用类型
 * FeeType filter
 * @param val
 * @returns {*}
 */
export function feeTypeFilter (val) {
  return filter(feeTypeArr(), val)
}
/**
 * feeTypeArr
 * @returns {*[]}
 */
export function feeTypeArr () {

  return [{
    label: '国际代理服务费',
    value: '001'
  },{
    label: '国内代理服务费',
    value: '002'
  },{
    label: '招标代理费',
    value: '003'
  },{
    label: '加油费',
    value: '004'
  },{
    label: '过路费',
    value: '005'
  },{
    label: '停车费',
    value: '006'
  },{
    label: '维修保养',
    value: '007'
  },{
    label: '车辆保险',
    value: '008'
  },{
    label: '报关费',
    value: '009'
  },{
    label: '包装费',
    value: '010'
  },{
    label: '操作费',
    value: '011'
  },{
    label: '保险费',
    value: '012'
  },{
    label: '布展材料',
    value: '013'
  },{
    label: '房租',
    value: '014'
  },{
    label: '水电费',
    value: '015'
  },{
    label: '差旅费',
    value: '016'
  },{
    label: '招待费',
    value: '017'
  },{
    label: '人工费',
    value: '018'
  },{
    label: '办公费',
    value: '019'
  },{
    label: '交通费',
    value: '020'
  },{
    label: '职工福利费',
    value: '021'
  },{
    label: '广告费',
    value: '022'
  },{
    label: '租赁费',
    value: '023'
  },{
    label: '维修费',
    value: '024'
  },{
    label: '会费',
    value: '025'
  },{
    label: '税金',
    value: '026'
  },{
    label: '其他',
    value: '027'
  },{
    label: '印刷费',
    value: '028'
  },{
    label: '展位费',
    value: '029'
  },{
    label: '打印费',
    value: '030'
  },{
    label: '投标报名费',
    value: '031'
  },{
    label: '投标押金',
    value: '032'
  },{
    label: '中标代理费',
    value: '033'
  },
  ]
}

