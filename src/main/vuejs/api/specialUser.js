import { httpClient, postParamConfig } from "./base.js"

// 根据ID删除一条黑名单信息 POST      
export const delBlackUser = params => {
  return httpClient.post(`/api/admin/delBlackUser`, params)
}
// 根据ID删除一条嘉宾信息
export const delGreenUser = params => {
  return httpClient.post(`/api/admin/delGreenUser`, params)
}

//根据证件号精确查找一条特殊用户数据
export const findSpecialByCardId = params => {
  return httpClient.get(`/api/admin/findSpecialByCardId`, {params: params})
}
// 根据ID获取特殊用户信息
export const findSpecialById = params => {
  return httpClient.get(`/api/admin/findSpecialById`, {params: params})
}

// 根据姓名模糊查找特殊用户数据列表
export const findSpecialListByName = params => {
	return httpClient.get(`/api/admin/findSpecialListByName`, {params: params})
}

// 分页查询所有特殊用户列表
export const findSpecialUserToPage = params => {
	return httpClient.get(`/api/admin/findSpecialUserToPage`, {params: params})
}

//  插入一条嘉宾信息/插入一条黑名单信息
export const insertSpecialUser = params => {
    return httpClient.post(`/api/admin/insertSpecialUser`, params)
  }

  // 更新一条黑名单信息/更新一条嘉宾信息
export const updateSpecialUser = params => {
    return httpClient.post(`/api/admin/updateSpecialUser`, params)
  }
