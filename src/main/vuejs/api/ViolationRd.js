/**
 * 违章记录相关控制器
 * */

import { httpClient } from './base.js'


/**
 * POST
 /api/car/violationRd/deleteViolationRdById
 根据违章ID删除违章记录
 * */
export const deleteViolationRdById = params => {
  return httpClient.post(`/api/car/violationRd/deleteViolationRdById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/car/violationRd/addViolationRd
 添加车辆违章记录
 * */
export const addViolationRd = params => {
  return httpClient.post(`/api/car/violationRd/addViolationRd`, params).then(ret => ret.data)
}
/**
 * POST
 /api/car/violationRd/violationRdDetailList
 车辆违章记录列表，支持违章人员、处理结果模糊查询；
 * */
export const violationRdDetailList = params => {
  return httpClient.post(`/api/car/violationRd/violationRdDetailList`, params).then(ret => ret.data)
}
