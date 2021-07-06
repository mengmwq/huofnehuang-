import { httpClient } from './base.js'
/**
 * POST
 * /api/role/add
 * 添加角色
 * */
export const addRole = params => {
  return httpClient.post(`/api/role/add`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/role/delete
 * 停用角色
 * */
export const deleteRole = params => {
  return httpClient.post(`/api/role/delete`, params).then(ret => ret.data)
}
/**
 * GET
 * /api/role/getRoleById
 * 根据id获取角色
 * */
export const getRoleById = params => {
  return httpClient.get(`/api/role/getRoleById?id=` + params).then(ret => ret.data)
}
/**
 * POST
 * /api/role/getRolePage
 * 获取角色列表
 * */
export const getRolePage = params => {
  return httpClient.post(`/api/role/getRolePage`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/role/update
 * 修改角色
 * */
export const updateRole = params => {
  return httpClient.post(`/api/role/update`, params).then(ret => ret.data)
}
 //根据组织ID获取角色列表 
 export const getRoleListByOrgId = params => {
  return httpClient.post(`/api/role/getRoleListByOrgId`, params).then(ret => ret.data)
}