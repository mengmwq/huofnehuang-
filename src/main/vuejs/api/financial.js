import { httpClient } from './base.js'

/**
 * /api/financial/loan/add
 * 添加借款申请
 */
export const loanAdd = params => {
  return httpClient.post(`/api/financial/loan/add`, params).then(ret => ret.data)
};

/**
 * /api/financial/loan/approval/detail
 * 借款审批详情
 */
export const loanApprovalDetail = params => {
  return httpClient.post(`/api/financial/loan/approval/detail`, params).then(ret => ret.data)
};

/**
 * /api/financial/loan/detail
 * 借款详情
 */
export const loanDetail = params => {
  return httpClient.post(`/api/financial/loan/detail`, params).then(ret => ret.data)
};

/**
 * /api/financial/loan/finish
 * 完成借款申请
 */
export const loanFinish = params => {
  return httpClient.post(`/api/financial/loan/finish`, params).then(ret => ret.data)
};

/**
 * /api/financial/loan/page
 * 借款列表
 */
export const loanPage = params => {
  return httpClient.post(`/api/financial/loan/page`, params).then(ret => ret.data)
};

/**
 * /api/financial/loan/update
 * 编辑借款申请
 */
export const loanUpdate = params => {
  return httpClient.post(`/api/financial/loan/update`, params).then(ret => ret.data)
};

//根据审批id获取下属列表
export const loanApplyApiByApplyIdList = params => {
  return httpClient.post(`/api/financial/loan/loanApplyApiByApplyIdList`, params).then(ret => ret.data)
};
//我的借款列表
export const getBorrowApplication = params => {
  return httpClient.post(`/api/financial/loan/myPayPage`, params).then(ret => ret.data)
};
//提交借款申请
export const  submitBorrowApplication = params => {
  return httpClient.post(`/api/financial/loan/paySubmission`, params).then(ret => ret.data)
};

/****************************************财务-差旅管理*********************************************/
/**
 * POST
 /api/financial/travel/add
 添加差旅申请
 */
export const addTravel = params => {
  return httpClient.post(`/api/financial/travel/add`, params).then(ret => ret.data)
};
/**
 * POST
 /api/financial/travel/approval/detail
 差旅审批详情
 */
export const travelApprovalDetail = params => {
  return httpClient.post(`/api/financial/travel/approval/detail`, params).then(ret => ret.data)
};
/**
 * POST
 /api/financial/travel/detail
 差旅详情
 */
export const travelDetail = params => {
  return httpClient.post(`/api/financial/travel/detail`, params).then(ret => ret.data)
};
/**
 * POST
 /api/financial/travel/page
 差旅列表
 */
export const travelPageList = params => {
  return httpClient.post(`/api/financial/travel/page`, params).then(ret => ret.data)
};
/**
 * POST
 /api/financial/travel/update
 编辑差旅申请
 */
export const updateTravel = params => {
  return httpClient.post(`/api/financial/travel/update`, params).then(ret => ret.data)
};
/**
 * POST
 * /api/financial/travel/delete
 删除差旅申请
 */
export const deleteTravel = params => {
  return httpClient.post(`/api/financial/travel/delete`, params).then(ret => ret.data)
};
/**
 * POST
 *
 /api/financial/pay/financialPage
 往来财务
 */
export const financialPage = params => {
  return httpClient.post(`/api/financial/pay/financialPage`, params).then(ret => ret.data)
};
/**
 * POST
 /api/financial/travel/finish
 差旅申请完成
 */
export const finishTravel = params => {
  return httpClient.post(`/api/financial/travel/finish`, params).then(ret => ret.data)
};

//我的差旅报销申请列表
export const getTravelApplication = params => {
  return httpClient.post(`/api/financial/travel/myPayPage`, params).then(ret => ret.data)
};

//提交申请
export const submitTravelApplication = params => {
  return httpClient.post(`/api/financial/travel/paySubmission`, params).then(ret => ret.data)
};
//根据审批id获取下属列表
export const getTravelApplicationByApprovalId = params => {
  return httpClient.post(`/api/financial/travel/travelApplyApiByApplyIdList`, params).then(ret => ret.data)
};




/*** ++++++++++++++++++++++++++++  行政管理 ++++++++++++++++++++++++++++++++++++++ */

//添加行政支出申请
export const addAdministration = params => {
  return httpClient.post(`/api/financial/administration/add`, params).then(ret => ret.data)
};

//行政支出审批详情
export const  administrationApprovalDetails= params => {
  return httpClient.post(`/api/financial/administration/approval/detail`, params).then(ret => ret.data)
};
//行政支出详情
export const  administrationDetails= params => {
  return httpClient.post(`/api/financial/administration/detail`, params).then(ret => ret.data)
};

//行政支出列表
export const  administrationPage= params => {
  return httpClient.post(`/api/financial/administration/page`, params).then(ret => ret.data)
};

//行政支出操作
export const  payAdministration= params => {
  return httpClient.post(`/api/financial/administration/pay`, params).then(ret => ret.data)
};
//更新行政支出申请
export const  updateAdministration= params => {
  return httpClient.post(`/api/financial/administration/update`, params).then(ret => ret.data)
};

//根据id删除申请
export const  deleteExpenditure= params => {
  return httpClient.post(`/api/financial/administration/detailIds`, params).then(ret => ret.data)
};
//我的行政申请列表
export const  getExpenditureAppliaction= params => {
  return httpClient.post(`/api/financial/administration/myPayPage`, params).then(ret => ret.data)
};
//提交申请
export const  submitExpenditureApplication= params => {
  return httpClient.post(`/api/financial/administration/paySubmission`, params).then(ret => ret.data)
};
//根据审批id获取下属列表
export const getExpenditureApplicationByApprovalId= params => {
  return httpClient.post(`/api/financial/administration/payingAdminByApplyIdList`, params).then(ret => ret.data)
};
//更新行政支出申请
export const updateExpenditureApplication= params => {
  return httpClient.post(`/api/financial/administration/update`, params).then(ret => ret.data)
};