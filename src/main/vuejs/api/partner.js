import { httpClient } from './base.js'

/**
 * POST
 * /api/partner/info/add
 * 添加客户
 * */
export const addPartner = params => {
  return httpClient.post(`/api/partner/info/add`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/partner/info/delete
 * 删除合作伙伴
 * */
export const deletePartner = params => {
  return httpClient.post(`/api/partner/info/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/partner/info/update
 更新合作伙伴
 * */
export const updatePartner = params => {
  return httpClient.post(`/api/partner/info/update`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/partner/info/detail
 * 客户信息详情
 * */
export const partnerDetail = params => {
  return httpClient.post(`/api/partner/info/detail`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/partner/info/list
 * 客户列表，支持用户名模糊搜索
 * */
export const partnerList = params => {
  return httpClient.post(`/api/partner/info/list`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/partner/info/project/queryContractInfosByPartnerId
 * 根据客户id查询往来合同
 * */
export const queryContractInfosByPartnerId = params => {
  return httpClient.post(`/api/partner/info/project/queryContractInfosByPartnerId`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/partner/info/selectCustomerContacters
 * 客户联系人列表
 * */
export const selectPartnerContacters = params => {
  return httpClient.post(`/api/partner/info/selectCustomerContacters`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/partner/info/selectPartnerAttachments
 * 客户附件列表
 * */
export const selectPartnerAttachments = params => {
  return httpClient.post(`/api/partner/info/selectPartnerAttachments`, params).then(ret => ret.data)
}
