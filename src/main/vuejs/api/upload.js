import { httpClient } from './base.js'

/**
 * /api/qiniu/getPicToken 获取图片上传token
 */
export const getPicToken = () => {
  return httpClient.get(`/api/qiniu/getPicToken`).then(ret => ret.data)
}

/**
 * /api/qiniu/getUrl 获取图片地址
 */
export const getUrl = (key) => {
  return httpClient.get(`/api/qiniu/getUrl?key=` + key).then(ret => ret.data)
}

/**
 * /api/qiniu/downloadFile 下载文件
 */
export const downloadFile = (key) => {
  return httpClient.get(`/api/qiniu/downloadFile?key=` + key,{responseType: 'blob'}).then(ret => ret.data)
}
