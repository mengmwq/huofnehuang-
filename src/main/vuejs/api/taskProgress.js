/**
 *  任务进度管理
 * */

import { httpClient } from './base.js'


/**
 * POST
 /api/task/his/add
 添加任务进度
 * */
export const addTaskProgress= params => {
  return httpClient.post(`/api/task/his/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/his/page
 任务进度列表
 * */
export const taskProgressList = params => {
  return httpClient.post(`/api/task/his/page`, params).then(ret => ret.data)
}
