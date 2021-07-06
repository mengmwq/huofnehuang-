/**
 * 开票申请控制器
 * */

import { httpClient } from './base.js'


/**
 * POST
 /api/financial/receiptApply/accountingConfirmation
 进账确认
 * */
export const accountingConfirmation = params => {
  return httpClient.post(`/api/financial/receiptApply/accountingConfirmation`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/addReceiptApply
 添加开票申请
 * */
export const addReceiptApply = params => {
  return httpClient.post(`/api/financial/receiptApply/addReceiptApply`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/deleteReceiptApplyById
 根据ID删除开票申请
 * */
export const deleteReceiptApplyById = params => {
  return httpClient.post(`/api/financial/receiptApply/deleteReceiptApplyById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/financialOperations
 财务操作
 * */
export const financialOperations = params => {
  return httpClient.post(`/api/financial/receiptApply/financialOperations`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/queryReceiptApplyInfoById
 根据开票申请id查询信息
 * */
export const queryReceiptApplyInfoById = params => {
  return httpClient.post(`/api/financial/receiptApply/queryReceiptApplyInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/receiptApplyPageList
 开票申请分页列表，可根据项目编号，合同编号，客户名称模糊搜索
 * */
export const receiptApplyPageList = params => {
  return httpClient.post(`/api/financial/receiptApply/receiptApplyPageList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/receiptApplyPageList
 进账金额分页列表，可根据项目编号，合同编号，客户名称模糊搜索
 * */
export const getReceiveMoneyPage = params => {
  return httpClient.post(`/api/financial/receiptApply/getReceiveMoneyPage`, params).then(ret => ret.data)
}
export const addReceiveMoney = params => {
  return httpClient.post(`/api/financial/receiptApply/addReceiveMoneyPage`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/updateReceiveMoney
 进账金额根据id编辑
 * */
export const updateReceiveMoney = params => {
  return httpClient.post(`/api/financial/receiptApply/updateReceiveMoney`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/removeReceiveMoneyById
 进账金额根据id删除
 * */
export const removeReceiveMoneyById = params => {
  return httpClient.post(`/api/financial/receiptApply/removeReceiveMoneyById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/updateReceiptApplyById
 编辑开票申请
 * */
export const updateReceiptApplyById = params => {
  return httpClient.post(`/api/financial/receiptApply/updateReceiptApplyById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/queryApprovalDetailById
 根据开票id查询开票审批详情
 * */
export const queryApprovalDetailById = params => {
  return httpClient.post(`/api/financial/receiptApply/queryApprovalDetailById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/approvalOperation
 开票申请审批操作按钮(驳回或者同意)
 * */
export const approvalInvoiceOperation = params => {
  return httpClient.post(`/api/financial/receiptApply/approvalOperation`, params).then(ret => ret.data)
}
/**
 * POST
 /api/financial/receiptApply/getReceiveMoneyByReceiptApplyId
 根据发票申请ID查询进账确认信息
 * */
export const getReceiveMoneyByReceiptApplyId = params => {
  return httpClient.post(`/api/financial/receiptApply/getReceiveMoneyByReceiptApplyId`, params).then(ret => ret.data)
}

//发票申请列表
export const  getInvoiceAppliaction= params => {
  return httpClient.post(`/api/financial/receiptApply/myPayPage`, params).then(ret => ret.data)
};
//批量删除申请 
export const  deleteInvoiceApplication= params => {
  return httpClient.post(`/api/financial/receiptApply/detailIds`, params).then(ret => ret.data)
};

//提交发票申请
export const  submitInvoiceApplication= params => {
  return httpClient.post(`/api/financial/receiptApply/paySubmission`, params).then(ret => ret.data)
};
//根据审批id获取下属列表
export const  receiptApplyApiByApplyIdList= params => {
  return httpClient.post(`/api/financial/receiptApply/receiptApplyApiByApplyIdList`, params).then(ret => ret.data)
};