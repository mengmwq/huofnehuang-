/**
 * 柜 相关
 *
 * */
import { httpClient } from './base.js'

/**
 * POST
 /api/storage/cabinetInfo/addCabinetInfo
 添加柜
 * */
export const addCabinetInfo = params => {
  return httpClient.post(`/api/storage/cabinetInfo/addCabinetInfo`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/cabinetInfo/cabinetInfoPageList
 柜分页，可根据柜名模糊搜索
 * */
export const cabinetInfoPageList = params => {
  return httpClient.post(`/api/storage/cabinetInfo/cabinetInfoPageList`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/cabinetInfo/deleteCabinetInfoById
 根据柜ID删除
 * */
export const deleteCabinetInfoById = params => {
  return httpClient.post(`/api/storage/cabinetInfo/deleteCabinetInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/cabinetInfo/queryCabinetInfoById
 根据柜id查询柜信息
 * */
export const queryCabinetInfoById = params => {
  return httpClient.post(`/api/storage/cabinetInfo/queryCabinetInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/cabinetInfo/queryCabinetInfoListByHouseId
 根据仓Id查询柜列表
 * */
export const queryCabinetInfoListByHouseId = params => {
  return httpClient.post(`/api/storage/cabinetInfo/queryCabinetInfoListByHouseId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/cabinetInfo/queryCabinetInfoPageListByHouseId
 根据仓编号查询柜列表(带分页)，请求中仓编号为非空校验
 * */
export const queryCabinetInfoPageListByHouseId = params => {
  return httpClient.post(`/api/storage/cabinetInfo/queryCabinetInfoPageListByHouseId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/storage/cabinetInfo/updateCabinetInfoById
 根据柜id修改柜信息
 * */
export const updateCabinetInfoById = params => {
  return httpClient.post(`/api/storage/cabinetInfo/updateCabinetInfoById`, params).then(ret => ret.data)
}
