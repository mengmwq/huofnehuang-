import { httpClient } from './base.js'

/******************国内航材项目创建*******************/

/**
 * POST /api/project/domestic/material/add 添加国内航材
 * */
export const addDomesticMaterialProject = params => {
  return httpClient.post(`/api/project/domestic/material/add`, params).then(ret => ret.data)
}
/**
 * POST /api/project/domestic/material/addDetail 国内航材添加货物明细
 * */
export const addDomesticMaterialDetail = params => {
  return httpClient.post(`/api/project/domestic/material/addDetail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/domestic/material/delete
 删除国内航材货物信息
 * */
export const deleteDomesticMaterial = params => {
  return httpClient.post(`/api/project/domestic/material/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/packaging/add
 添加包装信息
 * */
export const addPackage = params => {
  return httpClient.post(`/api/project/packaging/add`, params).then(ret => ret.data)
}
export const updatePackage = params => {
  return httpClient.post(`/api/project/packaging/update`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/packaging/delete
 删除包装信息
 * */
export const deletePackage = params => {
  return httpClient.post(`/api/project/packaging/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/packaging/list
 包装信息列表
 * */
export const packageList = params => {
  return httpClient.post(`/api/project/packaging/list`, params).then(ret => ret.data)
}
/**
 * /api/project/packaging/infos
 * 包装信息列表不分页
 * */
export const packageListAll = params => {
  return httpClient.post(`/api/project/packaging/infos`, params).then(ret => ret.data)
}


/******************国际航材项目创建*******************/


/**
 * POST /api/project/foreign/material/add 添加国际航材
 * */
export const addForeignMaterialProject = params => {
  return httpClient.post(`/api/project/foreign/material/add`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/foreign/material/addDetail
 * 国际航材添加货物明细
 * */
export const addForeignMaterialDetail = params => {
  return httpClient.post(`/api/project/foreign/material/addDetail`, params).then(ret => ret.data)
}

/**
 * POST /api/contract/queryAgreementPrice
 协议价格搜索
 {
  "contractId": "string",
  "from": "string",
  "goodsName": "string",
  "to": "string",
  "transportationModeId": "string"
}
 * */
export const queryAgreementPrice = params => {
  return httpClient.post(`/api/contract/queryAgreementPrice`, params).then(ret => ret.data)
}


/**
 * POST
 * /api/project/list
 * 项目列表
 * */
export const projectList = params => {
  return httpClient.post(`/api/project/list`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/delete
 * 删除项目
 * */
export const deleteProject = params => {
  return httpClient.post(`/api/project/delete`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/update
 * 更新项目公共信息
 * */
export const updateProject = params => {
  return httpClient.post(`/api/project/update`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/updateProjectState
 更新项目进度或者状态
 * */
export const updateProjectState = params => {
  return httpClient.post(`/api/project/updateProjectState`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/detail
 * 项目详情没有运输方式
 * */
export const projectDetail = params => {
  return httpClient.post(`/api/project/detail`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/detailWithHaulway
 * 项目详情带有运输方式
 * */
export const projectDetailWithHaulway = params => {
  return httpClient.post(`/api/project/detailWithHaulway`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/taskList
 * 项目任务列表
 * */
export const projectTaskList = params => {
  return httpClient.post(`/api/project/taskList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/all
 * 项目列表不分页 （有权限）
 */
export const projectAll = params => {
  return httpClient.post(`/api/project/all`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/allProjects
 * 项目列表不分页 （没有权限）
 */
export const allProjects = params => {
  return httpClient.post(`/api/project/allProjects`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/project/art/detailList
 * 艺术品货物信息列表不分页
 */
export const artMaterialListAll = params => {
  return httpClient.post(`/api/project/art/detailList`, params).then(ret => ret.data)
}
/**
 * /api/project/domestic/material/detailList
 * 国内航材货物信息列表不分页
 */
export const domesticMaterialList = params => {
  return httpClient.post(`/api/project/domestic/material/detailList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/domestic/material/list
 国内航材货物信息列表
 */
export const domesticMaterialPageList = params => {
  return httpClient.post(`/api/project/domestic/material/list`, params).then(ret => ret.data)
}
/**
 * /api/project/foreign/material/detailList
 * 国际航材货物信息列表不分页
 */
export const foreignMaterialList = params => {
  return httpClient.post(`/api/project/foreign/material/detailList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/foreign/material/list
 国际航材货物信息列表
 */
export const foreignMaterialPageList = params => {
  return httpClient.post(`/api/project/foreign/material/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/foreign/material/delete
 删除国际航材货物信息
 */
export const deleteForeignMaterial = params => {
  return httpClient.post(`/api/project/foreign/material/delete`, params).then(ret => ret.data)
}

// 艺术品项目相关-------------------------------------------

/**
 * POST
 /api/project/art/add
 添加艺术品
 */
export const addArtProject = params => {
  return httpClient.post(`/api/project/art/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/art/addDetail
 艺术品添加货物明细
 */
export const addArtGoodsDetail = params => {
  return httpClient.post(`/api/project/art/addDetail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/art/delete
 删除艺术品货物信息
 */
export const deleteArtGoods = params => {
  return httpClient.post(`/api/project/art/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/art/detailList
 艺术品货物信息列表不分页
 */
export const artGoodsList = params => {
  return httpClient.post(`/api/project/art/detailList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/art/list
 艺术品货物信息列表
 */
export const artGoodsPageList = params => {
  return httpClient.post(`/api/project/art/list`, params).then(ret => ret.data)
}

/**
 * POST
  /api/task/work/outside/submit
  外勤任务提交
 */
export const submitOutsideTask = params => {
  return httpClient.post(`/api/task/work/outside/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/add
 在任务列表添加包装、外勤、报送任务
 */
export const createTask = params => {
  return httpClient.post(`/api/task/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/completeDetail
 任务详情包含各种包装信息等
 */
export const taskCompleteDetail = params => {
  return httpClient.post(`/api/task/completeDetail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/detail
 任务基本详情
 */
export const taskBasicDetail = params => {
  return httpClient.post(`/api/task/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/page
 我的任务列表
 */
export const myTaskPageList = params => {
  return httpClient.post(`/api/task/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/attachment/list
 项目附件列表
 */
export const projectAccessoryList = params => {
  return httpClient.post(`/api/project/attachment/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/attachment/add
 添加项目附件
 */
export const projectAccessoryAdd = params => {
  return httpClient.post(`/api/project/attachment/add`,  params).then(ret => ret.data)
}

//联系人
/**
 * POST
 /api/project/contacter/add
 添加项目联系人
 */
export const projectlinkmanAdd = params => {
  return httpClient.post(`/api/project/contacter/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/contacter/delete
 删除项目联系人
 */
export const projectlinkmanDelete = params => {
  return httpClient.post(`/api/project/contacter/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/contacter/list
 项目联系人列表
 */
export const projectlinkmanList= params => {
  return httpClient.post(`/api/project/contacter/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/contacter/update
 更新项目联系人
 */
export const projectlinkmanUpdate = params => {
  return httpClient.post(`/api/project/contacter/update`, params).then(ret => ret.data)
}
/**
 * POST
 /api/common/operationLog/operationLogPageList
 根据ID查询对应日志记录
 */
export const operationLogPageList = params => {
  return httpClient.post(`/api/common/operationLog/operationLogPageList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/projectStatistics
 项目利润统计
 */
export const projectStatistics = params => {
  return httpClient.post(`/api/project/projectStatistics`, params).then(ret => ret.data)
}

/***航材报关***/
/**
 * POST
 /api/material/customs/add
 添加报关
 */
export const customsAdd = params => {
  return httpClient.post(`/api/material/customs/add`, params).then(ret => ret.data)
}
export const customsEdit = params => {
  return httpClient.post(`/api/material/customs/update`, params).then(ret => ret.data)
}
/**
 * POST
 /api/material/customs/delete
 删除报关
 */
export const customsDelete = params => {
  return httpClient.post(`/api/material/customs/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/material/customs/page
 报关列表
 */
export const customsPage = params => {
  return httpClient.post(`/api/material/customs/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/material/customs/detail
 报关详情
 */
export const customsDetail = params => {
  return httpClient.post(`/api/material/customs/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/financial
 项目财务情况
 */
export const projectFinancialPage = params => {
  return httpClient.post(`/api/project/financial`, params).then(ret => ret.data)
}

/**excel控制器*/
/**
 * POST
 /api/common/excel/downloadExcelTemplate
 Excel模板下载
 */
export const downloadExcelTemplate = params => {
  return httpClient.post(`/api/common/excel/downloadExcelTemplate`, params, {responseType: 'blob'}).then(ret => ret.data)
}
/**
 * POST
 /api/common/excel/importExcel
 导入Excel
 */
export const importExcel = params => {
  return httpClient.post(`/api/common/excel/importExcel`, params).then(ret => ret.data)
}
/**
 * POST
 /api/common/excel/downloadExcel
 导出excel
 */
export const downloadExcel = params => {
  return httpClient.post(`/api/common/excel/downloadExcel`, params, {responseType: 'blob'}).then(ret => ret.data)
}
/**
 * POST
 /api/project/carProjects
 车辆有关项目
 */
export const carProjects = params => {
  return httpClient.post(`/api/project/carProjects`, params).then(ret => ret.data)
}
/**
 * POST
 api/project/supplierProjects
 真 车辆有关项目
 */
export const supplierProjects = params => {
  return httpClient.post(`/api/project/supplierProjects`, params).then(ret => ret.data)
}

// 项目日志
// 项目添加、列表、详情、更新

// POST
// /api/project/log/add
// 添加项目日志
export const addLogProject = params => {
  return httpClient.post(`/api/project/log/add`, params).then(ret => ret.data)
}
// GET
// /api/project/log/getById
// 项目详情列表
export const getProjectLogById = params => {
  return httpClient.get(`/api/project/log/getById`, {params:params}).then(ret => ret.data)
}
// POST
// /api/project/log/list
// 项目日志列表
export const getProjectLogList = params => {
  return httpClient.post(`/api/project/log/list`, params).then(ret => ret.data)
}
// 艺术品项目列表 
export const getArtProjectList = params => {
  return httpClient.post(`/api/project/artList`, params).then(ret => ret.data)
}
// 免税品项目列表 
export const getArtDfgProjectList = params => {
  return httpClient.post(`/api/project/artDfgList`, params).then(ret => ret.data)
}
//航材项目列表
export const gerProjcetMaterialList = params => {
  return httpClient.post(`/api/project/materialList`, params).then(ret => ret.data)
}
//艺术品添加货物明细
export const addArtDetailBatch = params => {
  return httpClient.post(`/api/project/art/addDetailBatch`, params).then(ret => ret.data)
}
//国内航材添加货物明细
export const addAirDomesticDetailBatch = params => {
  return httpClient.post(`/api/project/domestic/material/addDetailBatch`, params).then(ret => ret.data)
}
//国际航材添加货物明细
export const addAirForeignDetailBatch = params => {
  return httpClient.post(`/api/project/foreign/material/addDetailBatch`, params).then(ret => ret.data)
}
//删除项目附件
export const deleteProjectAttachment = params => {
  return httpClient.post(`/api/project/attachment/delete`, params).then(ret => ret.data)
}

//修改币种
export const updateCurrencyById = params => {
  return httpClient.get(`/api/project/updateCurrencyById`, {params:params}).then(ret => ret.data)
}




//国内航材更新货物明细
export const updateDetailDomesticMaterial = params => {
  return httpClient.post(`/api/project/domestic/material/updateDetail`, params).then(ret => ret.data)
}
//国际航材更新货物明细
export const updateDetailForeignMaterial = params => {
  return httpClient.post(`/api/project/foreign/material/updateDetail`, params).then(ret => ret.data)
}

//艺术品更新货物明细
export const updateDetailArtMaterial = params => {
  return httpClient.post(`/api/project/art/updateDetail`, params).then(ret => ret.data)
}

/** +++++++++++++++++++++ 项目收支  ++++++++++++++++ */



//查询当前项目手动填入的收支
export const getProjectBalanceDetailed = params => {
  return httpClient.post(`/api/balance/getProjectBalanceDetailed`, params).then(ret => ret.data)
}

//项目收支明细带过滤
export const getProjectBalancePage = params => {
  return httpClient.post(`/api/balance/getProjectBalancePage`, params).then(ret => ret.data)
}
//项目收支
export const getProjectBalanceTotal = params => {
  return httpClient.post(`/api/balance/getProjectBalanceTotal`, params).then(ret => ret.data)
}

//保存当前项目手动填入的收支
export const insertProjectBalanceDetailed = params => {
  return httpClient.post(`/api/balance/insertProjectBalanceDetailed`, params).then(ret => ret.data)
}
//根据id删除手动填入的收支
export const removeProjectBalanceDetailed = params => {
  return httpClient.post(`/api/balance/removeProjectBalanceDetailed`, params).then(ret => ret.data)
}
//更改当前项目手动填入的收支
export const updateProjectBalanceDetailed = params => {
  return httpClient.post(`/api/balance/updateProjectBalanceDetailed`, params).then(ret => ret.data)
}

//保存当前项目手动填入的账单确认
export const addProjectBillList = params => {
  return httpClient.post(`/api/project/bill/add`, params).then(ret => ret.data)
}
//根据id删除手动填入的账单确认
export const deleteProjectBillList = params => {
  return httpClient.post(`/api/project/bill/delete`, params).then(ret => ret.data)
}
//更改当前项目手动填入的账单确认
export const updateProjectBillList = params => {
  return httpClient.post(`/api/project/bill/update`, params).then(ret => ret.data)
}
//获取当前项目账单确认
export const getProjectBillList = params => {
  return httpClient.post(`/api/project/bill/list`, params).then(ret => ret.data)
}
  //查询当前项目手动填入的收支
export const getProjectBill = params => {
  return httpClient.post(`/api/balance/getProjectBill`, params).then(ret => ret.data)
}


//项目详情中项目日志
export const getTaskUser = params => {
  return httpClient.post(`api/project/getTaskUser`, params).then(ret => ret.data)
}

//删除项目日志
export const removeProjectLog = params => {
  return httpClient.post(`api/project/log/remove`, params).then(ret => ret.data)
}
//更新项目日志
export const updateProjectLog = params => {
  return httpClient.post(`api/project/log/update`, params).then(ret => ret.data)
}