import { httpClient } from './base.js'

/**
 * POST
 * /api/car/info/addCarInfo
 * 添加车辆
 * */
export const addCar = params => {
  return httpClient.post(`/api/car/info/addCarInfo`, params).then(ret => ret.data)
}

//获取g7相关的车辆信息
export const getG7CarInfoPage = params => {
  return httpClient.post(`/api/car/info/getG7CarInfoPage`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/info/carInfoDetailList
 *车辆详细信息列表，可根据车辆车牌号模糊搜索
 * */
export const selectCarList = params => {
  return httpClient.post(`/api/car/info/carInfoDetailList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/info/deleteCarInfo
 * 删除车辆信息
 * */
export const deleteCar = params => {
  return httpClient.post(`/api/car/info/deleteCarInfo`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/info/queryCarInfoById
 * 根据车辆id查询车辆信息
 * */
export const queryCarInfoById = params => {
  return httpClient.post(`/api/car/info/queryCarInfoById`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/info/updateCarInfo
 * 根据车辆ID修改车辆信息
 * */
export const updateCarInfo = params => {
  return httpClient.post(`/api/car/info/updateCarInfo`, params).then(ret => ret.data)
}
/**
 * POST
 /api/car/attachment/queryCarAttachmentListByCarId
 根据车辆ID查询对应的附件列表
 * */
export const queryCarAttachmentListByCarId = params => {
  return httpClient.post(`/api/car/attachment/queryCarAttachmentListByCarId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/car/attachment/addCarAttachment
 添加车辆附件信息
 * */
export const addCarAttachment = params => {
  return httpClient.post(`/api/car/attachment/addCarAttachment`, params).then(ret => ret.data)
}


/**下载车辆一日三检记录表*/
/**
 * POST
 /api/common/excel/downloadExcelTemplate
 Excel模板下载
 */
export const downloadOndDayThirdChecksInfo = params => {
  return httpClient.post(`/api/car/oneDayThirdChecksInfo/downloadOndDayThirdChecksInfo`, params, {responseType: 'blob'}).then(ret => ret.data)
}

/**++++++++++++++++++  ETC  ++++++++++++++++++++++++++ */
//模糊查询
export const ETCDetailList = params => {
  return httpClient.post(`/api/car/etc/ETCDetailList`, params).then(ret => ret.data)
}
//添加车辆ECT记录
export const addETC = params => {
  return httpClient.post(`/api/car/etc/addETC`, params).then(ret => ret.data)
}
export const updateETC = params => {
  return httpClient.post(`/api/car/etc/updateETC`, params).then(ret => ret.data)
}
export const deleteETCById = params => {
  return httpClient.post(`/api/car/etc/deleteETCById`, params).then(ret => ret.data)
}
//查询id
export const getETCById = params => {
  return httpClient.get(`/api/car/etc/getETCById`, {params:params}).then(ret => ret.data)
}
//根据id更新基本信息
export const updateETCById = params => {
  return httpClient.post(`/api/car/etc/updateETCById`, params).then(ret => ret.data)
}


//根据id删除申请
export const deteleEtcApplication = params => {
  return httpClient.post(`/api/car/etc/detailIds`, params).then(ret => ret.data)
}
//根据审批id获取下属列表
export const getEtcApplicationByApprovalId = params => {
  return httpClient.post(`/api/car/etc/etcByApplyIdList`, params).then(ret => ret.data)
}
//申请列表
export const getEtcApplication = params => {
  return httpClient.post(`/api/car/etc/myPayPage`, params).then(ret => ret.data)
}
//提交申请
export const submitEtcApplication = params => {
  return httpClient.post(`/api/car/etc/paySubmission`, params).then(ret => ret.data)
}
//添加车辆ECT记录
export const updateETCApplication = params => {
  return httpClient.post(`/api/car/etc/updateETC`, params).then(ret => ret.data)
}

/*********   ++++++++++++++  油卡  ++++++++++++++++++ ************** */

//模糊查询
export const GasolineDetailList = params => {
  return httpClient.post(`/api/car/gasoline/GasolineDetailList`, params).then(ret => ret.data)
}
//添加车辆ECT记录
export const addGasoline = params => {
  return httpClient.post(`/api/car/gasoline/addGasoline`, params).then(ret => ret.data)
}
//查询id
export const getGasolineById = params => {
  return httpClient.get(`/api/car/gasoline/getGasolineById`, {params:params}).then(ret => ret.data)
}
//根据id更新基本信息
export const updateGasolineById = params => {
  return httpClient.post(`/api/car/gasoline/updateGasolineById`, params).then(ret => ret.data)
}
export const deleteGasolineById = params => {
  return httpClient.post(`/api/car/gasoline/deleteGasolineById`, params).then(ret => ret.data)
}

//根据id删除申请
export const deleteOilCardApplication = params => {
  return httpClient.post(`/api/car/gasoline/detailIds`, params).then(ret => ret.data)
}
//根据审批id获取下属列表
export const getOilCardApplicationByApprovalId = params => {
  return httpClient.post(`/api/car/gasoline/gasolineByApplyIdList`, params).then(ret => ret.data)
}
//申请列表
export const getOilCardApplication = params => {
  return httpClient.post(`/api/car/gasoline/myPayPage`, params).then(ret => ret.data)
}
//提交申请
export const submitOilcardApplication = params => {
  return httpClient.post(`/api/car/gasoline/paySubmission`, params).then(ret => ret.data)
}


