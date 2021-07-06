/**
 * 车辆检测表控制器
 * */

import { httpClient } from './base.js'


/**
 * POST
 /api/car/carChecking/addCarChecking
 添加检测表信息
 * */
export const addCarChecking = params => {
  return httpClient.post(`/api/car/carChecking/addCarChecking`, params).then(ret => ret.data)
}
/**
 * POST
 /api/car/carChecking/downloadCarCheckingInfo
 下载信息表
 * */
export const downloadCarCheckingInfo = params => {
  return httpClient.post(`/api/car/carChecking/downloadCarCheckingInfo`, params,{responseType: 'blob'}).then(ret => ret.data)
}
/**
 * POST
 /api/car/carChecking/queryCarCheckingInfoById
 根据ID查询车辆检测信息
 * */
export const queryCarCheckingInfoById = params => {
  return httpClient.post(`/api/car/carChecking/queryCarCheckingInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/car/carChecking/queryCarCheckingList
 车辆检测表记录列表查询，可根据填表人名称模糊搜索
 * */
export const queryCarCheckingList = params => {
  return httpClient.post(`/api/car/carChecking/queryCarCheckingList`, params).then(ret => ret.data)
}

export const getCarStatistics = params => {
  return httpClient.post(`/api/car/carChecking/statistics`, params).then(ret => ret.data)
}

