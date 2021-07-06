import { httpClient } from './base.js'

/**
 * /api/task/add
 * 在任务列表添加包装、外勤、报送任务
 * */
export const addTask = params => {
  return httpClient.post(`/api/task/add`, params).then(ret => ret.data)
}

/**
 * POST
 /api/task/detail
 任务基本详情
 * */
export const taskBasicDetail = params => {
  return httpClient.post(`/api/task/detail`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/page
 我的任务列表
 * */
export const taskPageList = params => {
  return httpClient.post(`/api/task/page`, params).then(ret => ret.data)
}

/**
 * POST
 /api/task/packaging/submit
 包装任务提交
 * */
export const submitPackageTask = params => {
  return httpClient.post(`/api/task/packaging/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/work/outside/submit
 外勤任务提交
 * */
export const submitOutsideTask = params => {
  return httpClient.post(`/api/task/work/outside/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/work/customs/submit
 报关任务提交
 * */
export const submitBaoGuanTask = params => {
  return httpClient.post(`/api/task/work/customs/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/work/insurance/submit
 保险任务提交
 * */
export const submitBaoXianTask = params => {
  return httpClient.post(`/api/task/work/insurance/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/work/official/submit
 外勤任务提交
 * */
export const submitPiWenTask = params => {
  return httpClient.post(`/api/task/work/official/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/material/submit
 航材任务提交
 * */
export const submitHangCaiTask = params => {
  return httpClient.post(`/api/task/material/submit`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/packaging/add
 添加任务附件
 * */
export const addAccessory = params => {
  return httpClient.post(`/api/task/packaging/add`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/packaging/list
 附件列表
 * */
export const listAccessory = params => {
  return httpClient.post(`/api/task/packaging/list`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/packaging/delete
 删除附件
 * */
export const deleteTaskFile = params => {
  return httpClient.post(`/api/task/packaging/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/assign
 指派负责人
 * */
export const assignChargePerson = params => {
  return httpClient.post(`/api/task/assign`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/delete
 删除任务
 * */
export const deleteTask = params => {
  return httpClient.post(`/api/task/delete`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/refuse
 拒绝任务
 * */
export const refuseTask = params => {
  return httpClient.post(`/api/task/refuse`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/task/accept
 接受任务
 * */
export const acceptTask = params => {
  return httpClient.post(`/api/task/accept`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/task/copy
  任务复制/重新报价
 * */
export const copyTask = params => {
  return httpClient.post(`/api/task/copy`, params).then(ret => ret.data)
}

/**
 * POST
 /api/task/getTaskInfosByUserId
 查询人员的任务列表
 * */
export const getTaskInfosByUserId = params => {
  return httpClient.post(`/api/task/getTaskInfosByUserId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/task/stock/getGoodsDetail
 查询出库的时候传入项目编码接口查询的所有信息在这里面了
 * */
export const getGoodsDetail = params => {
  return httpClient.post(`/api/task/stock/getGoodsDetail`, params).then(ret => ret.data)
}



//更新任务
export const updateTask = params => {
  return httpClient.post(`/api/task/update`, params).then(ret => ret.data)
}
