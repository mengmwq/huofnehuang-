import { httpClient } from './base.js'
/**
 * POST
 * /api/car/maintain/addCarMaintain
 *添加车辆维修保养记录
 * */
export const addCarMaintain = params => {
  return httpClient.post(`/api/car/maintain/addCarMaintain`, params).then(ret => ret.data)
}
export const updateCarMaintain = params => {
  return httpClient.post(`/api/car/maintain/updateCarMaintainById`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/maintain/carMaintainDetailList
 * 车辆维修保养信息列表，支持维修企业、驾驶员、维修项目模糊查询；
 * */
export const carMaintainDetailList = params => {
  return httpClient.post(`/api/car/maintain/carMaintainDetailList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/maintain/deleteCarMaintainById
 * 根据保养ID删除保养记录
 * */
export const deleteCarMaintainById = params => {
  return httpClient.post(`/api/car/maintain/deleteCarMaintainById`, params).then(ret => ret.data)
}

//根据id查询
export const getCarMaintainDetail = params => {
  return httpClient.post(`/api/car/maintain/getCarMaintainDetail`, params).then(ret => ret.data)
}


//根据审批id获取下属列表
export const getMaintainApplicationByApprovalId = params => {
  return httpClient.post(`/api/car/maintain/carMaintainByApplyIdList`, params).then(ret => ret.data)
}
//根据id删除申请
export const deleteMaintainApplication = params => {
  return httpClient.post(`/api/car/maintain/detailIds`, params).then(ret => ret.data)
}
//申请列表
export const getMaintainApplication = params => {
  return httpClient.post(`/api/car/maintain/myPayPage`, params).then(ret => ret.data)
}
//提交申请
export const submitMaintainApplication = params => {
  return httpClient.post(`/api/car/maintain/paySubmission`, params).then(ret => ret.data)
}