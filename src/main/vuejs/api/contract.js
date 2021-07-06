import { httpClient } from './base.js'
/**
 * /api/contract/add
 * 添加合同
 */
export const addContract = params => {
  return httpClient.post(`/api/contract/add`, params).then(ret => ret.data)
}

/**
 * /api/contract/update
 * 更新合同
 */
export const updateContract = params => {
  return httpClient.post(`/api/contract/update`, params).then(ret => ret.data)
}

/**
 * /api/contract/delete
 * 删除合同
 */
export const deleteContract = params => {
  return httpClient.post(`/api/contract/delete`, params).then(ret => ret.data)
}

/**
 * /api/contract/list
 * 根据合同号模糊搜索合同
 */
export const listContract = params => {
  return httpClient.post(`/api/contract/list`, params).then(ret => ret.data)
}
/**
 * /api/contract/page
 合同列表
 */
export const pageContract = params => {
  return httpClient.post(`/api/contract/page`, params).then(ret => ret.data)
}
/**
 * /api/contract/changeState
 修改合同状态
 */
export const changeContractState = params => {
  return httpClient.post(`/api/contract/changeState`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/contract/contract/page
 往来合同分页
 */
export const contractPage = params => {
  return httpClient.post(`/api/contract/contract/page`, params).then(ret => ret.data)
}
/**
 * POST
 /api/contract/detail
 合同详情
 */
export const contractDetail = params => {
  return httpClient.post(`/api/contract/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/contract/contract/list
 查询合同列表
 */
export const contractList = params => {
  return httpClient.post(`/api/contract/contract/list`, params).then(ret => ret.data)
}


