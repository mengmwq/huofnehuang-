import { httpClient, postParamConfig } from "./base.js"




//分页查询所有角色信息 roleId
export const getAllRole = params => {
  return httpClient.get(`/api/admin/getAllRole`, {params: params})
}
// 查询角色列表
export const getRoleList = params => {
  return httpClient.get(`/api/getRoleList`, {params: params})
}
//根据角色ID查询所有已注册未冻结的成员列表
export const getAllUserByRoleId = params => {
  return httpClient.get(`/api/admin/getAllUserByRoleId`, {params: params})
}
// 根据ID获取角色信息 id
export const getRoleById = params => {
  return httpClient.get(`/api/admin/getRoleById`, {params: params})
}
// 根据角色名或描述关键字模糊查询角色信息
export const getRoleByKeyword = params => {
  return httpClient.get(`/api/admin/getRoleByKeyword`, {params: params})
}

//根据角色名模糊查询角色信息
export const getRoleByName = params => {
  return httpClient.get(`/api/admin/getRoleByName`, {params: params})
}

//根据ID删除一条角色信息
export const deleteRole = params => {
  return httpClient.get(`/api/admin/delRoleById`, {params: params})
}

//插入一条角色信息
export const insertRoleInfo = params => {
  return httpClient.post(`/api/admin/insertRoleInfo`, params)
}

//为某角色添加成员
export const insertUserInRole = params => {
  return httpClient.get(`/api/admin/insertUserInRole`, {params:params})
}
//更新一条角色信息
export const updateRole = params => {
  return httpClient.post(`/api/admin/updateRole`, params)
}
//成员操作-为某角色删除成员
export const cancelUserInRole = params => {
  return httpClient.get(`/api/admin/cancelUserInRole`, {params:params})
}
//获取UI资源-根据[用户ID]获取UI资源列表
// export const selectUIResourceByUserId = params => {
//   return httpClient.get(`/api/admin/selectUIResourceByUserId`, {params:params})
// }
//获取UI资源-根据[角色ID]获取UI资源列表
export const getUIListByRoleId = params => {
  return httpClient.get(`/api/admin/getUIListByRoleId`, {params:params})
}
//后台管理员登录获取UI资源-根据[用户ID]获取UI资源列表
export const getUIListByUserId = params => {
  return httpClient.get(`/api/admin/getUIListByUserId`, {params:params})
}
//插入一条UI资源数据
export const insertOneResource = params => {
  return httpClient.post(`/api/admin/insertOneResource`, params)
}
// 获取整颗UI资源数据树
export const getUIResourceTree = params => {
  return httpClient.get(`/api/admin/getUIResourceTree`, {params: params})
}
// 获取所有UI资源数据列表
export const getAllUIResourceList = params => {
  return httpClient.get(`/api/admin/getAllUIResourceList`, {params: params})
}

