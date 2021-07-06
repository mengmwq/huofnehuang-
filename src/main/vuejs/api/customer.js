import { httpClient } from './base.js'

/**
 * POST
 * /api/customer/info/add
 * 添加客户
 * */
export const addCustomer = params => {
  return httpClient.post(`/api/customer/info/add`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/delete
 * 删除客户
 * */
export const deleteCustomer = params => {
  return httpClient.post(`/api/customer/info/delete`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/update
 更新客户
 * */
export const updateCustomer = params => {
  return httpClient.post(`/api/customer/info/update`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/detail
 * 客户信息详情
 * */
export const customerDetail = params => {
  return httpClient.post(`/api/customer/info/detailWithContacter`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/list
 * 客户列表，支持用户名模糊搜索
 * */
export const customerList = params => {
  return httpClient.post(`/api/customer/info/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/customer/info/queryByName
 客户列表不分页模糊搜索
 * */
export const queryCustomerByName = params => {
  return httpClient.post(`/api/customer/info/queryByName`, params).then(ret => ret.data)
}
/**
 * POST /api/customer/info/contacter/list
 客户联系人列表
 * */
export const customerContacters = params => {
  return httpClient.post(`/api/customer/info/contacter/list`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/project/queryContractInfosByCustomerId
 * 根据客户id查询往来合同
 * */
export const queryContractInfosByCustomerId = params => {
  return httpClient.post(`/api/customer/info/project/queryContractInfosByCustomerId`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/project/queryProjectsByCustomerId
 * 根据客户id查询客户项目
 * */
export const queryProjectsByCustomerId = params => {
  return httpClient.post(`/api/customer/info/project/queryProjectsByCustomerId`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/selectCustomerContacters
 * 客户联系人列表
 * */
export const selectCustomerContacters = params => {
  return httpClient.post(`/api/customer/info/selectCustomerContacters`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customer/info/selectCustomerAttachments
 * 客户附件列表
 * */
export const selectCustomerAttachments = params => {
  return httpClient.post(`/api/customer/info/selectCustomerAttachments`, params).then(ret => ret.data)
}
