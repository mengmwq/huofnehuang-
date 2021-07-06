import { httpClient } from './base.js'

/**
 * POST
 * /api/customs/manage/add
 添加报关
 * */
export const customsManageAdd = params => {
  return httpClient.post(`/api/customs/manage/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/customs/manage/delete
 删除
 * */
export const deleteCustoms = params => {
  return httpClient.post(`/api/customs/manage/delete`, params).then(ret => ret.data)
}
/**
 * POST
 *
 /api/customs/manage/detail
 报关详情
 * */
export const customsManageDetail = params => {
  return httpClient.post(`/api/customs/manage/detail`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customs/manage/edit
 编辑报关
 * */
export const customsManageEdit = params => {
  return httpClient.post(`/api/customs/manage/edit`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/customs/manage/page
 报关列表
 * */
export const customsManagePage = params => {
  return httpClient.post(`/api/customs/manage/page`, params).then(ret => ret.data)
}

///删除报关附件
export const deleteAttachment = params => {
  return httpClient.get(`/api/customs/manage/deleteAttachment`, {params:params}).then(ret => ret.data)
}
///新增报关附件
export const addAttachment = params => {
  return httpClient.get(`/api/customs/manage/addAttachment`, {params:params}).then(ret => ret.data)
}


//	保证金统计
export const getDepositPage = params => {
  return httpClient.post(`/api/customs/stat/getDepositPage`, params).then(ret => ret.data)
}

//	 免保金统计
export const getGuaranteePage = params => {
  return httpClient.post(`/api/customs/stat/getGuaranteePage`, params).then(ret => ret.data)
}
//	 免保金统计
export const getExemptionPage = params => {
  return httpClient.post(`/api/customs/stat/getExemptionPage`, params).then(ret => ret.data)
}
//	 获取税金统计
export const getTaxesPage = params => {
  return httpClient.post(`/api/customs/stat/getTaxesPage`, params).then(ret => ret.data)
}
//修改状态保证金
export const updateDeposit = params => {
  return httpClient.get(`/api/customs/stat/updateDeposit`, {params:params}).then(ret => ret.data)
}
//更新免担保统计状态
export const updateExemption = params => {
  return httpClient.get(`/api/customs/stat/updateExemption`, {params:params}).then(ret => ret.data)
}

//更新关税保证保险统计状态
export const updateGuarantee = params => {
  return httpClient.get(`/api/customs/stat/updateGuarantee`, {params:params}).then(ret => ret.data)
}

//保证金统计导出
export const depositListExport = params => {
  return httpClient.post(`/api/customs/stat/depositListExport`, params,{
    responseType: 'arraybuffer'
  }).then(ret => ret.data)
}
//免担保统计导出
export const exemptionListExport = params => {
  return httpClient.post(`/api/customs/stat/exemptionListExport`, params,{
    responseType: 'arraybuffer'
  }).then(ret => ret.data)
}
//关税统计导出
export const taxesListExport = params => {
  return httpClient.post(`/api/customs/stat/taxesListExport`, params,{
    responseType: 'arraybuffer'
  }).then(ret => ret.data)
}
//关税保证保险导出
export const guaranteeListExport = params => {
  return httpClient.post(`/api/customs/stat/guaranteeListExport`, params,{
    responseType: 'arraybuffer'
  }).then(ret => ret.data)
}