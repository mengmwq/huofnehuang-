/**
 * 仓储任务
 * */

import { httpClient } from './base.js'

/**
 * POST
 /api/task/stock/page
 出入库任务列表
 * */
export const stockTaskPageList = params => {
    return httpClient.post(`/api/task/stock/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/stock/exception/report
 异常上报
 * */
export const exceptionReport = params => {
    return httpClient.post(`/api/task/stock/exception/report`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/stock/export/approved
 出库核准
 * */
export const exportApproved = params => {
    return httpClient.post(`/api/task/stock/export/approved`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/stock/import/approved
 入库核准入库状态，核准即代表已入库或者已出库根据任务类型来传
 * */
export const importApproved = params => {
    return httpClient.post(`/api/task/stock/import/approved`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/stock/storage
 入库提交
 * */
export const submitStockInTask = params => {
    return httpClient.post(`/api/task/stock/storage`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/stock/export
 出库提交
 * */
export const submitStockOutTask = params => {
    return httpClient.post(`/api/task/stock/export`, params).then(ret => ret.data)
}

/**
 * POST
 /api/task/stock/changeState
 修改状态，拒绝等操作都可以
 * */
export const changeStockState = params => {
    return httpClient.post(`/api/task/stock/changeState`, params).then(ret => ret.data)
}


/*****************************************手动出入库相关***************************************************/

/**
 * POST
 /api/task/manual/stock/page
 库存清单列表
 * */
export const manualStocakPageList = params => {
  return httpClient.post(`/api/task/manual/stock/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/manual/stock/listDetail
 出库详情页面
 * */
export const manualStocakDetail= params => {
  return httpClient.post(`/api/task/manual/stock/listDetail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/manual/stock/add
 手动入库
 * */
export const manualAddStocak= params => {
  return httpClient.post(`/api/task/manual/stock/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/manual/stock/export
 手动出库
 * */
export const manualExportStocak= params => {
  return httpClient.post(`/api/task/manual/stock/export`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/manual/stock/changeGride
 移动库
 * */
export const changeGride= params => {
  return httpClient.post(`/api/task/manual/stock/changeGride`, params).then(ret => ret.data)
}
