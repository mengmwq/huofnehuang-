import { httpClient } from './base.js'

/**
 * POST
 /api/contacter/info/delete
 删除联系人
 * */
export const deleteContacter = params => {
  return httpClient.post(`/api/contacter/info/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/contacter/info/detail
 联系人详情
 * */
export const contacterDetail = params => {
  return httpClient.post(`/api/contacter/info/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/contacter/info/update
 更新联系人
 * */
export const updateContacter = params => {
  return httpClient.post(`/api/contacter/info/update`, params).then(ret => ret.data)
}
