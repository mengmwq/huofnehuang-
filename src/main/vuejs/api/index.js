/**
 * Created by hehuadong on 2019/4/3.
 */
const merge = require('webpack-merge')

// 公司管理-人员/用户管理
import * as userApi from './user.js'
// 客户管理
import * as customer from './customer.js'
// 联系人管理
import * as contacter from './Contacter.js'
// 战略合作伙伴管理
import * as partner from './partner.js'
// 供应商管理
import * as supplier from './supplier.js'
// 文物库管理
import * as historicalRelic from './historicalRelic.js'
// 组织管理
import * as organization from './organization.js'
// 岗位管理
import * as position from './position.js'
// 角色管理
import * as postRole from './postRole.js'
// 车辆信息管理
import * as car from './car.js'
// 车辆附件管理
import * as carAccessory from './carAccessory.js'
// 车辆维修保养相关控制器
import * as carMaintenance from './carMaintenance.js'
// 项目管理
import * as project from './project.js'
// 任务管理
import * as task from './task.js'
// 审批流程
import * as approval from './approval.js'
// 出险相关管理
import * as accident from './accident.js'
// 一日三检表相关
import * as oneDayThirdChecks from './oneDayThirdChecks.js'
// 预算管理
import * as budget from './budget.js'
// 报价管理
import * as offer from './offer.js'
// 违章记录相关控制器
import * as ViolationRd from './ViolationRd.js'
// 车辆检测表控制器
import * as CarChecking from './CarChecking.js'
// 任务进度管理
import * as taskProgress from './taskProgress.js'
// 合同管理
import * as contract from './contract.js'
// 文件管理
import * as file from './file.js'
// 库管理
import * as warehouse from './warehouse.js'
// 仓管理
import * as house from './house.js'
// 柜管理
import * as cabinet from './cabinet.js'
// 位管理
import * as gride from './gride.js'
// 投标管理
import * as bid from './bid.js'
// 仓储任务
import * as stockTask from './stockTask.js'
// 异常管理
import * as error from './error.js'
// 付款管理
import * as pay from './pay.js'
// 开票申请控制器
import * as invoice from './invoice.js'
// 财务管理
import * as financial from './financial.js'
// 报销申请管理
import * as reimbursementApply from './reimbursementApply.js'
// 操作库管理
import * as operation from './operation.js'
// 报关管理
import * as customs from './customs.js'
// 首页
import * as home from './home.js'
// 上传
import * as upload from './upload.js'
// 公告
import * as info from './info.js'

// 库存列表
import * as nonBonded from './nonBonded.js'
//统计管理
import * as statistics from './statistics.js'

import * as goodsWarehouse from './goodsWarehouse.js'

const result = merge(
  nonBonded,statistics,
  userApi, customer, contacter, partner, supplier, historicalRelic, organization, position, postRole, car, carAccessory,goodsWarehouse,
  carMaintenance, project, task, approval, accident, oneDayThirdChecks, budget, offer, ViolationRd, CarChecking,taskProgress, file, contract,
  warehouse, house,reimbursementApply,cabinet, gride, bid, stockTask, error, pay, invoice, financial, operation,customs, home,info, upload);

export default result
