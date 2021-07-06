import { httpClient } from './base.js'

// 我的待审批数量
export const getApprovalTypeCount = params => {
  return httpClient.post(`/api/approval/typeCount`, params).then(ret => ret.data)
}
/**
 * /api/approval/definition/page
 * 审批流程列表
 */
export const approvalDefinitionPage = params => {
  return httpClient.post(`/api/approval/definition/page`, params).then(ret => ret.data)
}

/**
 * /api/approval/definition/add
 * 添加审批流程
 */
export const addApproval = params => {
  return httpClient.post(`/api/approval/definition/add`, params).then(ret => ret.data)
}

/**
 * /api/approval/definition/update
 * 更新审批流程
 */
export const updateApproval = params => {
  return httpClient.post(`/api/approval/definition/update`, params).then(ret => ret.data)
}

/**
 * /api/approval/definition/delete
 * 删除审批流程
 */
export const delApproval = params => {
  return httpClient.post(`/api/approval/definition/delete`, params).then(ret => ret.data)
}

/**
 * /api/approval/definition/detail
 审批流程详情
 */
export const detailApproval = params => {
  return httpClient.post(`/api/approval/definition/detail`, params).then(ret => ret.data)
}

/**
 * /api/approval/definition/list
 * 审批流程列表不分页
 */
export const approvalList = params => {
  return httpClient.post(`/api/approval/definition/list`, params).then(ret => ret.data)
}
/*******************审批管理********************/
/**
 *
 /api/approval/apply/page
 我的申请列表（所有状态的）
 */
export const approvalPage = params => {
  return httpClient.post(`/api/approval/apply/page`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/changeState
 修改状态
 */
export const changeState = params => {
  return httpClient.post(`/api/approval/changeState`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/detail/accept
 审批同意
 */
export const approvalAccept = params => {
  return httpClient.post(`/api/approval/detail/accept`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/detail/refuse
 审批拒绝
 */
export const approvalRefuse = params => {
  return httpClient.post(`/api/approval/detail/refuse`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/page
 我的审批审批列表（所有状态的）
 */
export const approvalPageList = params => {
  return httpClient.post(`/api/approval/page`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/queryApprovalDetailByApprovalId
 根据审批id查询审批日志信息
 */
export const queryApprovalDetailByApprovalId = params => {
  return httpClient.post(`/api/approval/queryApprovalDetailByApprovalId`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/detailWithStep
 查询审批详情带有步骤
 */
export const approvalDetailWithStep = params => {
  return httpClient.post(`/api/approval/detailWithStep`, params).then(ret => ret.data)
}
/**
 *
 /api/approval/resubmit
 重新提交审批
 */
export const resubmit = params => {
  return httpClient.post(`/api/approval/resubmit`, params).then(ret => ret.data)
}

//新增评论
export const addApprovalComment = params => {
  return httpClient.post(`/api/approval/addApprovalComment`, params).then(ret => ret.data)
}


//抄送我的(加字段operationType ="3")
export const approvalAboutMePage = params => {
  return httpClient.post(`api/approval/apply/page`, params).then(ret => ret.data)
}

 //获取审批数量
export const getApprovalCount = params => {
  return httpClient.post(`/api/approval/count`, params).then(ret => ret.data)
}


 //重新提交 
export const resubmitApproval = params => {
  return httpClient.post(`/api/approval/resubmit`, params).then(ret => ret.data)
}