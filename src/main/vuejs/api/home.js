import {httpClient} from "./base";

/**
 * POST
 * /api/home/peopleTaskInfo
 * 人员安排任务信息
 */
export const homePeopleTaskInfo = params => {
  return httpClient.post(`/api/home/peopleTaskInfo`, params).then(ret => ret.data)
};

/**
 * POST
 * /api/home/projectList
 * 项目完成列表 默认查询10条，控制由前端来控制
 */
export const homeProjectList = params => {
  return httpClient.post(`/api/home/projectList`, params).then(ret => ret.data)
};

/**
 * POST
 * /api/home/taskList
 * 首页任务已完成列表 默认查询10条，控制由前端来控制
 */
export const homeTaskList = params => {
  return httpClient.post(`/api/home/taskList`, params).then(ret => ret.data)
};


//新增日期信息
export const addDayTask = params => {
  return httpClient.post(`/api/home/add`, params).then(ret => ret.data)
}
//删除日期信息
export const deleteDayTask = params => {
  return httpClient.post(`/api/home/delete`, params).then(ret => ret.data)
}
//更新日期信息
export const updateDayTask = params => {
  return httpClient.post(`/api/home/update`, params).then(ret => ret.data)
}
//获取个人
export const getPersonalDate = params => {
  return httpClient.post(`/api/home/getPersonalDate`, params).then(ret => ret.data)
}

//人员安排任务信息
export const peopleTaskInfo = params => {
  return httpClient.post(`/api/app/home/peopleTaskInfo`, params).then(ret => ret.data)
}
//人员安排任务信息
export const getHomeProjectList = params => {
  return httpClient.post(`/api/home/homeProjectList`, params).then(ret => ret.data)
}

//首页各种总数
export const getHomeCount = params => {
  return httpClient.post(`/api/home/homeCount`, params).then(ret => ret.data)
}
