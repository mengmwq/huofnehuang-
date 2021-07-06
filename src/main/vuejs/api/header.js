import { httpClient,postParamConfig } from "./base.js"

//获取动态表头
export const getHeaderInfo = params => {
  return httpClient.get(`/api/header/getHeaderMessage`,{params: params}).then(ret => ret.data)
}

//更新动态表头
export const updateHeader = params => {
  return httpClient.post(`/api/header/updateHeader`, params).then(ret => ret.data)
}

