/**
 * 预算-报价操作、上移、合并报价单
 * */

import { httpClient } from './base.js'


/**
 * POST
 /api/offer/detail/addOffer
 生成内部报价单
 * */
export const addOffer = params => {
  return httpClient.post(`/api/offer/detail/addOffer`, params).then(ret => ret.data)
}
/**
 * POST
 api/offer/offerExport
 下载报价单pdf
 * */
export const offerExport = params => {
  return httpClient.post(`api/offer/offerExport`, params, {responseType: 'blob'}).then(ret => ret.data)
}
/**
 * POST
 api/offer/offerExport
 下载报价单pdf
 * */
export const offerExport1 = params => {
  return httpClient.post(`api/offer/offerExport1`, params, {responseType: 'blob'}).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/add
 新增报价
 * */
export const newOffer = params => {
  return httpClient.post(`/api/offer/detail/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/delete
 删除报价明细
 * */
export const deleteOfferDetail = params => {
  return httpClient.post(`/api/offer/detail/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/list
 报价列表不分页，按照序号正序
 * */
export const offerDetailList = params => {
  return httpClient.post(`/api/offer/detail/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/listByBudgetGroupId
 根据预算组id查询报价明细
 * */
export const offerDetailByBudgetGroupId = params => {
  return httpClient.post(`/api/offer/detail/listByBudgetGroupId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/mergeOrUpdate
 报价编辑或者合并
 * */
export const offerMergeOrUpdate = params => {
  return httpClient.post(`/api/offer/detail/mergeOrUpdate`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/move
 报价明细上下移动
 * */
export const offerMove = params => {
  return httpClient.post(`/api/offer/detail/move`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/detail/update
 更新
 * */
export const updateOffer = params => {
  return httpClient.post(`/api/offer/detail/update`, params).then(ret => ret.data)
}
/**
 * /api/offer/addOfficialOffer
 * 生成正式报价
 */
export const addOfficialOffer = params => {
  return httpClient.post(`/api/offer/addOfficialOffer`, params).then(ret => ret.data)
}
/**
 * /api/offer/pageWithProjectCode
 * 正式报价分页列表
 */
export const pageWithProjectCode = params => {
  return httpClient.post(`/api/offer/pageWithProjectCode`, params).then(ret => ret.data)
}
/**
 * /api/offer/changeState
 * 设为正式
 */
export const offerChangeState = params => {
  return httpClient.post(`/api/offer/changeState`, params).then(ret => ret.data)
}
/**
 * /api/offer/apply
 * 提交审批
 */
export const offerApply = params => {
  return httpClient.post(`/api/offer/apply`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/preview
 报价预览
 */
export const previewOffer = params => {
  return httpClient.post(`/api/offer/preview`, params).then(ret => ret.data)
}
/**
 * POST
 /api/offer/checkOfferCurrency
 检查正式报价币种是否一致
 */
export const checkOfferCurrency = params => {
  return httpClient.post(`/api/offer/checkOfferCurrency`, params).then(ret => ret.data)
}

