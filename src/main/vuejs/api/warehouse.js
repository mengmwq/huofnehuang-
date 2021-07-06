/**
 * 库 相关
 *
 * */
import { httpClient } from './base.js'



/**
 * POST
 * /api/storage/warehouseInfo/getWarehouseTreeInfo
 * */
export const getWarehouseTreeInfo = params => {
  return httpClient.post(`/api/storage/warehouseInfo/getWarehouseTreeInfo`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/addWarehouseInfo
 添加库
 * */
export const addWarehouseInfo = params => {
  return httpClient.post(`/api/storage/warehouseInfo/addWarehouseInfo`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/deleteWarehouseById
 根据库id删除库
 * */
export const deleteWarehouseById = params => {
  return httpClient.post(`/api/storage/warehouseInfo/deleteWarehouseById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/queryWarehouseInfoById
 根据库ID查询库信息
 * */
export const queryWarehouseInfoById = params => {
  return httpClient.post(`/api/storage/warehouseInfo/queryWarehouseInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/selectWarehouseInfoAllStatus
 查询所有的库列表(启用和删除状态)
 * */
export const selectWarehouseInfoAllStatus = params => {
  return httpClient.post(`/api/storage/warehouseInfo/selectWarehouseInfoAllStatus`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/selectWarehouseInfoList
 查询可用的库列表
 * */
export const selectWarehouseInfoList = params => {
  return httpClient.post(`/api/storage/warehouseInfo/selectWarehouseInfoList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/updateWarehouseInfoById
 根据库id修改库信息
 * */
export const updateWarehouseInfoById = params => {
  return httpClient.post(`/api/storage/warehouseInfo/updateWarehouseInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/warehousePageList
 库分页，可根据库名模糊搜索
 * */
export const warehousePageList = params => {
  return httpClient.post(`/api/storage/warehouseInfo/warehousePageList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/warehouseInfo/getWarehouseByCode
 根据库编号查询库信息
 * */
export const getWarehouseByCode = params => {
  return httpClient.post(`/api/storage/warehouseInfo/getWarehouseByCode`, params).then(ret => ret.data)
}
