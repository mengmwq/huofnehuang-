/**
 * 预算
 * */

import { httpClient } from './base.js'

/**
 * POST
 /api/budget/group/add
 添加预算组
 * */
export const addBudgetGroup = params => {
  return httpClient.post(`/api/budget/group/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/budget/group/list
 预算分组
 * */
export const budgetGroupList = params => {
  return httpClient.post(`/api/budget/group/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/budget/cost/add
 添加预算成本
 * */
export const addBudgetCost = params => {
  return httpClient.post(`/api/budget/cost/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/budget/cost/list
 预算成本列表查询
 * */
export const budgetCostList = params => {
  return httpClient.post(`/api/budget/cost/list`, params).then(ret => ret.data)
}
/**
 * /api/budget/cost/page
 * 预算成本列表查询分页
 */
export const budgetCostPage = params => {
  return httpClient.post(`/api/budget/cost/page`, params).then(ret => ret.data)
}
/**
 * /api/budget/cost/changeState
 * 采用与不采用
 */
export const budgetCostChangeState = params => {
  return httpClient.post(`/api/budget/cost/changeState`, params).then(ret => ret.data)
}
