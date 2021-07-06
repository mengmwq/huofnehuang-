import { httpClient } from './base.js'

/**
 * 获取用户列表
 * POST /api/user/getUserPage
 * */
export const getUserPage = params => {
  return httpClient.post(`/api/user/getUserPage`, params).then(ret => ret.data)
}
/**
 *  添加用户
 * POST /api/user/add

 * */
export const addUser = params => {
  return httpClient.post(`/api/user/add`, params).then(ret => ret.data)
}
/**
 * /api/user/getUserInfoByMobile
 * 查询用户基本信息
 *
  */
export const getUserInfoByMobile = mobile => {
  return httpClient.get(`/api/user/queryUserByMobile?mobile=` + mobile).then(ret => ret.data)
}

/**
 * POST /api/user/delete
 *  停用用户
 * */
export const deleteUser = params => {
  return httpClient.post(`/api/user/delete`, params).then(ret => ret.data)
}

/**
 * POST /api/user/update
 *  修改用户
 * */
export const updateUser = params => {
  return httpClient.post(`/api/user/update`, params).then(ret => ret.data)
}
/**
 * GET /api/user/getUserById
 * 根据获取用户
 * */
export const getUserById = params => {
  return httpClient.get(`/api/user/getUserById`, {params: params}).then(ret => ret.data)
}

/**
 /api/user/getLiableUserByOrgId
 通过组织id获取第一第二责任人
 * */
export const getLiableUserByOrgId = params => {
  return httpClient.post(`/api/user/getLiableUserByOrgId`, params).then(ret => ret.data)
}

/**
 * /api/user/getUserTypesListByOrgId
 通过组织id获取用户类型
 * */
export const getUserTypesListByOrgId = params => {
  return httpClient.post(`/api/user/getUserTypesListByOrgId`, params).then(ret => ret.data)
}

export const updateUserRole = params => {
  return httpClient.post(`/api/updateUserRole`, params)
}

export const getUserDetailsInfo = params => {
  return httpClient.get(`/api/getUserDetailsInfo`, {params: params})
}

export const getUserNameBoolean = params => {
  return httpClient.get(`/api/getUserNameBoolean`, {params: params})
}

export const updatePasswordByLoginAccount = params => {
	return httpClient.get(`/api/updatePasswordByLoginAccount`, {params: params})
}
//  重置密码
export const resetPassword = params => {
  return httpClient.get(`/api/admin/resetPassword`, {params: params})
}
//   根据证件号查询用户详细活动信息
export const getUserActDetailByCardId = params => {
  return httpClient.post(`/api/admin/getUserActDetailByCardId`, params)
}

// /api/admin/getUserActListByContacterId
// 根据ContacterId查询用户活动信息
export const getUserActListInfoByContacterId = params => {
  return httpClient.get(`/api/admin/getUserActListByContacterId`,{params: params})
}
// 根据ContacterId查询用户基本信息
export const getUserDetailByContacterId = params => {
  return httpClient.get(`/api/admin/getUserDetailByContacterId`, {params: params})
}

// 根据手机号精确查询姓名、组织、性别、岗位、ID
export const findUserByMobile = params => {
  return httpClient.post(`/api/admin/findUserByMobile`, params)
}

// 成员操作-根据姓名/手机号/机构搜索会员
export const getAllUserByKeyword = params => {
  return httpClient.get(`/api/admin/getAllUserByKeyword`, {params: params})
}
/**
 * 修改手机号
 * POST /api/user/updateMobileById
 * */
export const updateMobileById = params => {
  return httpClient.post(`/api/user/updateMobileById`, params).then(ret => ret.data)
}

// /api/admin/freezeAccount  冻结账号
export const freezeAccount = params => {
  return httpClient.get(`/api/admin/freezeAccount`, {params:params})
}
// 解冻账号
export const unfreezeAccount = params => {
  return httpClient.get(`/api/admin/unfreezeAccount`, {params:params})
}
/**
 * /api/user/getUserListByOrgId
 * 通过组织id获取用户列表不分页
 */
export const getUserListByOrgId = params => {
  return httpClient.post(`/api/user/getUserListByOrgId`, params).then(ret => ret.data)
}
//通过自己的所属组织获取用户列表不分页
export const getUserList = params => {
  return httpClient.post(`/api/user/getUserList`, params).then(ret => ret.data)
}
//获取分公司下有的用户
export const getUserPageByOrg = params => {
  return httpClient.post(`/api/user/getUserPageByOrg`, params).then(ret => ret.data)
}
