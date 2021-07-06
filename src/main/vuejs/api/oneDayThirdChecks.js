import { httpClient } from './base.js'
/**
 * POST
 * /api/car/oneDayThirdChecksInfo/oneDayThirdChecksInfoList
 * 一日三检表列表查询，可根据填表人名称模糊搜索
 * */
export const oneDayThirdChecksInfoList = params => {
  return httpClient.post(`/api/car/oneDayThirdChecksInfo/oneDayThirdChecksInfoList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/oneDayThirdChecksInfo/downloadOndDayThirdChecksInfo
 下载信息表
 * */
export const downloadOndDayThirdChecksInfoTwo = params => {
  return httpClient.post(`/api/car/oneDayThirdChecksInfo/downloadOndDayThirdChecksInfo`, params,{responseType: 'blob'}).then(ret => ret.data)
}
/**
 * POST
 * /api/car/oneDayThirdChecksInfo/addOneDayThirdChecksInfo
 添加一日三检信息
 * */
export const addOneDayThirdChecksInfo = params => {
  return httpClient.post(`/api/car/oneDayThirdChecksInfo/addOneDayThirdChecksInfo`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/oneDayThirdChecksInfo/queryOneDayThirdChecksInfo
 根据ID查询一日三检信息信息
 * */
export const queryOneDayThirdChecksInfo = params => {
  return httpClient.post(`/api/car/oneDayThirdChecksInfo/queryOneDayThirdChecksInfo`, params).then(ret => ret.data)
}
