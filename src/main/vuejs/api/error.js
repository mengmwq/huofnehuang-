import { httpClient } from './base.js'

/**
 * /api/error/page
 * 异常列表
 */
export const errorPage = params => {
  return httpClient.post(`/api/error/page`, params).then(ret => ret.data)
};

/**
 * /api/error/submit
 * 异常处理即提交申请
 */
export const errorSubmit = params => {
  return httpClient.post(`/api/error/submit`, params).then(ret => ret.data)
};

/**
 * /api/error/detail
 * 异常详情
 */
export const errorDetail = params => {
  return httpClient.post(`/api/error/detail`, params).then(ret => ret.data)
};

/**
 * /api/error/delete
 * 异常删除
 */
export const errorDelete = params => {
  return httpClient.post(`/api/error/delete`, params).then(ret => ret.data)
};

/**
 * /api/error/attachment/page
 * 异常附件列表
 */
export const errorAttachmentPage = params => {
  return httpClient.post(`/api/error/attachment/page`, params).then(ret => ret.data)
};
