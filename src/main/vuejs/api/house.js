/**
 * 仓 相关
 *
 * */
import { httpClient } from './base.js'

/**
 * POST
 /api/storage/houseInfo/addHouseInfo
 添加仓
 * */
export const addHouseInfo = params => {
  return httpClient.post(`/api/storage/houseInfo/addHouseInfo`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/houseInfo/deleteHouseById
 根据仓id删除仓
 * */
export const deleteHouseById = params => {
  return httpClient.post(`/api/storage/houseInfo/deleteHouseById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/houseInfo/housePageList
 仓分页，可根据仓名模糊搜索
 * */
export const housePageList = params => {
  return httpClient.post(`/api/storage/houseInfo/housePageList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/houseInfo/queryHouseInfoById
 根据仓ID查询仓信息
 * */
export const queryHouseInfoById = params => {
  return httpClient.post(`/api/storage/houseInfo/queryHouseInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/houseInfo/queryHouseInfoListByWarehouseId
 根据库id查询仓列表
 * */
export const queryHouseInfoListByWarehouseId = params => {
  return httpClient.post(`/api/storage/houseInfo/queryHouseInfoListByWarehouseId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/houseInfo/updateHouseInfoById
 根据仓ID修改仓信息
 * */
export const updateHouseInfoById = params => {
  return httpClient.post(`/api/storage/houseInfo/updateHouseInfoById`, params).then(ret => ret.data)
}
