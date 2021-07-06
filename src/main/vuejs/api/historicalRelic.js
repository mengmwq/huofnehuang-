import { httpClient } from './base.js'

/**
 * POST
 * /api/historical/relic/add
 * 添加文物库
 * */
export const addRelic = params => {
  return httpClient.post(`/api/historical/relic/add`, params).then(ret => ret.data)
}
/**
 * Get
 * /api/historical/relic/getById
 * 文物库详情
 * */
export const relicDetails = params => {
  return httpClient.get(`/api/historical/relic/getById?id=` + params).then(ret => ret.data)
}
/**
 * POST
 * /api/historical/relic/page
 * 查询文物库列表
 * */
export const selectReliclist = params => {
  return httpClient.post(`/api/historical/relic/page`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/historical/relic/update
 * 修改文物库
 * */
export const updateRelic = params => {
  return httpClient.post(`/api/historical/relic/update`, params).then(ret => ret.data)
}
