import { httpClient } from './base.js'

/*****************hfh start******************/
/**
 * POST
 * /api/org/add
 * 添加组织
 * */
export const addOrg = params => {
  return httpClient.post(`/api/org/add`, params).then(ret => ret.data)
  // return httpClient.get(`/api/admin/findSpecialByCardId`, {params: params}).then(ret => ret.data)
}
/**
 * POST
 * /api/org/delete
 * 停用组织
 * */
export const deleteOrg = params => {
  return httpClient.post(`/api/org/delete`, params).then(ret => ret.data)
}
/**
 * Get
 * /api/org/getOrgInfoById
 * 根据id获取组织
 * */
export const getOrgInfoById = params => {
  return httpClient.get(`/api/org/getOrgInfoById`, {params: params}).then(ret => ret.data)
}
/**
 * POST
 * /api/org/getOrgInfoPage
 * 获取组织列表
 * */
export const getOrgInfoPage = params => {
  return httpClient.post(`/api/org/getOrgInfoPage`, params).then(ret => ret.data)
}
/**
 * GET
 * /api/org/getTreeFormOrgInfo
 * 根据获取组织树
 * */
export const getTreeFormOrgInfo = params => {
  return httpClient.get(`/api/org/getTreeFormOrgInfo`, {params: params}).then(ret => ret.data)
}
/**
 * GET
 * /api/admin/getTreeFormUI
 * 获取ui资源树
 * */
export const getTreeFormUI = () => {
  return httpClient.get(`/api/admin/getTreeFormUI`).then(ret => ret.data)
}
export const getAPPTreeFormUI = () => {
  return httpClient.get(`/api/app/admin/getTreeFormUI`).then(ret => ret.data)
}

//获取UI资源-根据[用户ID]获取UI资源列表
export const selectUIResourceByUserId = params => {
  return httpClient.get(`/api/admin/getUIListByUserId`, {params:params})
}
/**
 * POST
 * /api/org/update
 * 修改组织
 * */
export const updateOrg = params => {
  return httpClient.post(`/api/org/update`, params).then(ret => ret.data)
}
//获取分公司
export const getCompanyfo = params => {
  return httpClient.get(`/api/org/getCompanyfo`, {params:params}).then(ret => ret.data)
}
/*****************hfh end******************/

//获取分公司
export const getTopCompanyfo = params => {
  return httpClient.get(`/api/org/getTopCompanyfo`, {params:params}).then(ret => ret.data)
}