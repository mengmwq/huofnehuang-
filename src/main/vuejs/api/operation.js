/**
 * 操作库相关
 *
 * */
import { httpClient } from './base.js'

/**
 * POST
 /api/operation/attachmentList
 文件列表
 * */
export const operationAttachmentList = params => {
  return httpClient.post(`/api/operation/attachmentList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/consume
 消耗操作
 * */
export const operationConsume = params => {
  return httpClient.post(`/api/operation/consume`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/exportStock
 领用出库
 * */
export const operationExportStock = params => {
  return httpClient.post(`/api/operation/exportStock`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/importStock
 领用入库
 * */
export const operationImportStock = params => {
  return httpClient.post(`/api/operation/importStock`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/page
 入库列表
 * */
export const operationPage = params => {
  return httpClient.post(`/api/operation/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/pageConsume
 消耗记录列表
 * */
export const operationPageConsume = params => {
  return httpClient.post(`/api/operation/pageConsume`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/pageHis
 出入库记录、领用入库、领用出库记录列表
 * */
export const operationPageHis = params => {
  return httpClient.post(`/api/operation/pageHis`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/purchase
 采购入库
 * */
export const operationPurchase = params => {
  return httpClient.post(`/api/operation/purchase`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/detail
 消耗记录详情
 * */
export const operationDetail = params => {
  return httpClient.post(`/api/operation/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/getGoodsName
 查询出库品名列表，品名+供应商名+存放位置组成展示
 * */
export const getGoodsName = params => {
  return httpClient.post(`/api/operation/getGoodsName`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/getPrice
 查询价格，传商品名+供应商名+存放位置+规格
 * */
export const getPrice = params => {
  return httpClient.post(`/api/operation/getPrice`, params).then(ret => ret.data)
}
/**
 * POST
 /api/operation/getSpecifications
 查询规格，传商品名+供应商名+存放位置
 * */
export const getSpecifications = params => {
  return httpClient.post(`/api/operation/getSpecifications`, params).then(ret => ret.data)
}

//申请列表
export const getLibraryApplication = params => {
  return httpClient.post(`/api/operation/myPayPage`, params).then(ret => ret.data)
}
//提交申请
export const  submitLibraryApplication= params => {
  return httpClient.post(`/api/operation/paySubmission`, params).then(ret => ret.data)
}

//根据id删除申请
export const  deleteLibraryApplication= params => {
  return httpClient.post(`/api/operation/detailIds`, params).then(ret => ret.data)
}

//根据审批id获取下属列表
export const  getLibraryApplicationByApprovalId= params => {
  return httpClient.post(`/api/operation/etcByApplyIdList`, params).then(ret => ret.data)
}