import { httpClient } from './base.js'
/**
 * POST
 * /api/position/add
 * 添加岗位
 * */
export const addPosition = params => {
  return httpClient.post(`/api/position/add`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/position/delete
 * 停用岗位
 * */
export const deletePosition = params => {
  return httpClient.post(`/api/position/delete`, params).then(ret => ret.data)
}
/**
 * GET
 * /api/position/getPositionById
 * 根据id获取岗位
 * */
export const getPositionById = params => {
  return httpClient.get(`/api/position/getPositionById`, {params: params}).then(ret => ret.data)
}
/**
 * POST
 * /api/position/getPositionPage
 * 获取岗位列表
 * */
export const getPositionPage = params => {
  return httpClient.post(`/api/position/getPositionPage`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/position/update
 * 修改岗位
 * */
export const updatePosition = params => {
  return httpClient.post(`/api/position/update`, params).then(ret => ret.data)
}

//获取分公司下有的岗位
export const getPositionPageByOrg = params => {
  return httpClient.post(`/api/position/getPositionPageByOrg`, params).then(ret => ret.data)
}