import { httpClient } from './base.js'
/**
 * POST
 * /api/car/attachment/deleteAttachmentById
 根据附件ID删除附件
 * */
export const deleteAttachmentById = params => {
  return httpClient.post(`/api/car/attachment/deleteAttachmentById`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/attachment/downloadCarAttachment
 下载附件
 * */
export const downloadCarAttachment = params => {
  return httpClient.post(`/api/car/attachment/downloadCarAttachment`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/car/attachment/queryCarAttachmentListByCarId
 根据车辆ID查询对应的附件列表
 * */
export const queryCarAttachmentListByCarId = params => {
  return httpClient.post(`/api/car/attachment/queryCarAttachmentListByCarId`, params).then(ret => ret.data)
}

