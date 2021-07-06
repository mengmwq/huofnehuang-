import { httpClient } from './base.js'
/**
 * POST
 * /api/car/accidentrd/accidentRdDetailList
 指定车辆的出险事故记录详情列表，支持维修企业、驾驶员、维修项目模糊查询
 * */
export const accidentRdDetailList = params => {
  return httpClient.post(`/api/car/accidentrd/accidentRdDetailList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/accidentrd/addAccidentRd
 添加车辆出险记录
 * */
export const addAccidentRd = params => {
  return httpClient.post(`/api/car/accidentrd/addAccidentRd`, params).then(ret => ret.data)
}
export const updateAccidentRdById = params => {
  return httpClient.post(`/api/car/accidentrd/updateAccidentRdById`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/accidentrd/deleteAccidentRdById
 根据事故ID删除记录
 * */
export const deleteAccidentRdById = params => {
  return httpClient.post(`/api/car/accidentrd/deleteAccidentRdById`, params).then(ret => ret.data)
}
//根据id查询
export const getAccidentRdDetail = params => {
  return httpClient.post(`/api/car/accidentrd/getAccidentRdDetail`, params).then(ret => ret.data)
}

//根据审批id获取下属列表
export const getInsurnaceApplicationByApprovalId = params => {
  return httpClient.post(`/api/car/accidentrd/accidentRdByApplyIdList`, params).then(ret => ret.data)
}
//根据id删除申请
export const deleteInsurnaceApplication = params => {
  return httpClient.post(`/api/car/accidentrd/detailIds`, params).then(ret => ret.data)
}
//申请列表
export const getInsurnaceApplication = params => {
  return httpClient.post(`/api/car/accidentrd/myPayPage`, params).then(ret => ret.data)
}
//提交申请
export const submitInsuranceApplication = params => {
  return httpClient.post(`/api/car/accidentrd/paySubmission`, params).then(ret => ret.data)
}