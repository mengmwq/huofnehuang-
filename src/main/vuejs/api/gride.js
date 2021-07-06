/**
 * 位 相关
 *
 * */
import { httpClient } from './base.js'

/**
 * POST
 /api/storage/grideInfo/addGrideInfo
 添加位
 * */
export const addGrideInfo = params => {
  return httpClient.post(`/api/storage/grideInfo/addGrideInfo`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/deleteGrideInfoById
 根据位编号删除
 * */
export const deleteGrideInfoById = params => {
  return httpClient.post(`/api/storage/grideInfo/deleteGrideInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/grideInfoPageList
 位分页，可根据位名模糊搜索
 * */
export const grideInfoPageList = params => {
  return httpClient.post(`/api/storage/grideInfo/grideInfoPageList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/queryAllGrideListByCabinetId
 根据柜id查询所有位
 * */
export const queryAllGrideListByCabinetId = params => {
  return httpClient.post(`/api/storage/grideInfo/queryAllGrideListByCabinetId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/queryEmptyGrideListByCabinetId
 根据柜编号查询可用的并且是空的位置
 * */
export const queryEmptyGrideListByCabinetId = params => {
  return httpClient.post(`/api/storage/grideInfo/queryEmptyGrideListByCabinetId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/queryGrideInfoDetailById
 根据位ID查询位详细信息
 * */
export const queryGrideInfoDetailById = params => {
  return httpClient.post(`/api/storage/grideInfo/queryGrideInfoDetailById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/updateGrideInfoById
 根据位ID修改位信息
 * */
export const updateGrideInfoById = params => {
  return httpClient.post(`/api/storage/grideInfo/updateGrideInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/grideInfo/queryPageGrideListByCabinetId
 根据柜id查询位分页
 * */
export const queryPageGrideListByCabinetId = params => {
  return httpClient.post(`/api/storage/grideInfo/queryPageGrideListByCabinetId`, params).then(ret => ret.data)
}
