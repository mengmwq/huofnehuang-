import { httpClient, postParamConfig } from "./base.js"

// 多条消息标记已读
export const batchRead = params => {
	return httpClient.get(`/api/notify/batchRead`, {params: params})
}

//用户批量删除消息
export const batchDelMsg = params => {
	return httpClient.get(`/api/notify/batchDelMsg`, {params: params})
}
// 根据ID查询通知消息
export const getNotifyMessagesById = params => {
	return httpClient.get(`/api/notify/getNotifyMessagesById`, {params: params})
}
// 阅读一条消息
export const markRead = params => {
	return httpClient.get(`/api/notify/markRead`, {params: params})
}

//根据userId查询通知消息
export const getPageNotifyMessagesByUser = params => {
	return httpClient.post(`/api/notify/getPageNotifyMessagesByUser`, params)
}

//用户查询未读消息数量
export const getMessageCount = params => {
	return httpClient.get(`/api/notify/countUnreadMsg`, {params:params})
}

