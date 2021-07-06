/**
 * 公告
 * */

import { httpClient } from './base.js'


/**
 * POST
 /api/notice/add
 添加公告
 * */
export const addInfo = params => {
  return httpClient.post(`/api/notice/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/notice/detail
 公告详情
 * */
export const detailInfo = params => {
  return httpClient.post(`/api/notice/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/notice/page
 分页查询
 * */
export const pageInfo = params => {
  return httpClient.post(`/api/notice/page`, params).then(ret => ret.data)
}

/**
 * POST
 /api/notice/delete
 删除
 * */
export const deleteNotice = params => {
  return httpClient.post(`/api/notice/delete`, params).then(ret => ret.data)
}

