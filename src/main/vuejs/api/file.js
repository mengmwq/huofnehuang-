import {httpClient} from "./base";


/**************************车辆文件管理************************/

/**
 * POST
 * /api/car/fileManage/fileAttachmentPageList
 车辆检测附件分页列表
 * */
export const carFileAttachmentPageList = params => {
  return httpClient.post(`/api/car/fileManage/fileAttachmentPageList`, params).then(ret => ret.data)
}
/**
 * POST
 * api/common/downloadExcel/downloadExcel
 * */
export const downloadExcel = params => {
  return httpClient.post(`api/common/excel/downloadExcel`, params, {responseType: 'blob'}).then(ret => ret.data)
}

/**************************文件管理************************/

/**
 * POST
 * /api/file/manage/add
 上传文件
 * */
export const addFile = params => {
  return httpClient.post(`/api/file/manage/add`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/file/manage/delete
 删除文件
 * */
export const deleteFile = params => {
  return httpClient.post(`/api/file/manage/delete`, params).then(ret => ret.data)
}

/**
 * POST
 * /api/file/manage/page
 文件列表
 * */
export const filePage = params => {
  return httpClient.post(`/api/file/manage/page`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/file/manage/pageAll
 文件架构，查询所有
 * */
export const filePageAll = params => {
  return httpClient.post(`/api/file/manage/pageAll`, params).then(ret => ret.data)
}

