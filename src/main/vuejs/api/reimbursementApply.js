import { httpClient } from './base.js'

/******************报销申请相关控制*******************/

/**
 * /api/financial/reimbursementApply/addReimbursementApply
 添加报销申请
 * */
export const addReimbursementApply = params => {
  return httpClient.post(`/api/financial/reimbursementApply/addReimbursementApply`, params).then(ret => ret.data)
}

/**
 * /api/financial/reimbursementApply/approvalOperation
 报销申请操作按钮(驳回或者同意)
 * */
export const approvalOperation2 = params => {
  return httpClient.post(`/api/financial/reimbursementApply/approvalOperation`, params).then(ret => ret.data)
}

/**
 * /api/financial/reimbursementApply/deleteReimbursementApply
 根据ID删除报销申请
 * */
export const deleteReimbursementApply = params => {
  return httpClient.post(`/api/financial/reimbursementApply/deleteReimbursementApply`, params).then(ret => ret.data)
}

/**
 * /api/financial/reimbursementApply/queryApprovalDetailById
 根据ID查询报销审批详情
 * */
export const queryApprovalDetailById = params => {
  return httpClient.post(`/api/financial/reimbursementApply/queryApprovalDetailById`, params).then(ret => ret.data)
}

/**
 * /api/financial/reimbursementApply/queryReimbursementApplyDetailById
 根据ID查询报销申请详情
 * */
export const queryReimbursementApplyDetailById = params => {
  return httpClient.post(`/api/financial/reimbursementApply/queryReimbursementApplyDetailById`, params).then(ret => ret.data)
}

/**
 * /api/financial/reimbursementApply/reimbursementApplyPageList
 报销申请分页列表，可根据项目编号，合同编号模糊搜索
 * */
export const reimbursementApplyPageList = params => {
  return httpClient.post(`/api/financial/reimbursementApply/reimbursementApplyPageList`, params).then(ret => ret.data)
}

/**
 *
 /api/financial/reimbursementApply/updateReimbursementApply
 根据ID编辑报销申请信息
 * */
export const updateReimbursementApply = params => {
  return httpClient.post(`/api/financial/reimbursementApply/updateReimbursementApply`, params).then(ret => ret.data)
}

//根据id删除申请
export const deleteReimburseApplication = params => {
  return httpClient.post(`/api/financial/reimbursementApply/detailIds`, params).then(ret => ret.data)
}
//我的报销申请列表
export const getReimburseApplication = params => {
  return httpClient.post(`/api/financial/reimbursementApply/myPayPage`, params).then(ret => ret.data)
}
//提交申请
export const submitReimburseApplication = params => {
  return httpClient.post(`/api/financial/reimbursementApply/paySubmission`, params).then(ret => ret.data)
}
//根据审批id获取下属列表
export const getReimburseListByApprovalId = params => {
  return httpClient.post(`/api/financial/reimbursementApply/reimbursementApplyApiByApplyIdList`, params).then(ret => ret.data)
}