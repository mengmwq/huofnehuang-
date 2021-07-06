/* 付款 */
import { httpClient } from './base.js'

/**
 * POST
 /api/financial/pay/add
 添加付款申请
 */
export const addPay = params => {
  return httpClient.post(`/api/financial/pay/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/pay/approval/detail
 付款审批详情
 */
export const payApprovalDetail = params => {
  return httpClient.post(`/api/financial/pay/approval/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/pay/detail
 付款详情
 */
export const payDetail = params => {
  return httpClient.post(`/api/financial/pay/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/pay/page
 付款列表
 */
export const payPageList = params => {
  return httpClient.post(`/api/financial/pay/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/pay/pay
 付款操作
 */
export const pay = params => {
  return httpClient.post(`/api/financial/pay/pay`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/pay/update
 更新付款申请
 */
export const updatePay = params => {
  return httpClient.post(`/api/financial/pay/update`, params).then(ret => ret.data)
}

//我的付款申请列表
export const myPayPage = params => {
  return httpClient.post(`/api/financial/pay/myPayPage`, params).then(ret => ret.data)
}
//根据id删除付款申请
export const deleteApplicationByIds = params => {
  return httpClient.post(`/api/financial/pay/detailIds`, params).then(ret => ret.data)
}
//根据id删除差旅申请
export const deleteTravelApplicationByIds = params => {
  return httpClient.post(`/api/financial/travel/detailIds`, params).then(ret => ret.data)
}
//根据id删除借款申请
export const deleteBorrowMoneyByIds = params => {
  return httpClient.post(`/api/financial/loan/detailIds`, params).then(ret => ret.data)
}

//提交付款申请审批
export const paySubmission = params => {
  return httpClient.post(`/api/financial/pay/paySubmission`, params).then(ret => ret.data)
}

//根据审批id获取下属列表
export const getApprovalApplicationList = params => {
  return httpClient.post(`/api/financial/pay/PayingApplyByApplyIdList`, params).then(ret => ret.data)
}