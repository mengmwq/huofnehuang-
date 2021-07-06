import { httpClient } from './base.js'

/******************投标项目相关管理*******************/

/**
 * /api/bid/project/queryBidProjectList
 投标项目列表，可根据时间，采购人，项目名称，项目编号模糊搜索
 * */
export const queryBidProjectList = params => {
  return httpClient.post(`/api/bid/project/queryBidProjectList`, params).then(ret => ret.data)
}
/**
 * /api/bid/project/bidProjectPrint
 打印清单
 * */
export const bidProjectPrint = params => {
  return httpClient.post(`/api/bid/project/bidProjectPrint`, params).then(ret => ret.data)
}
/**
 * /api/bid/project/addBidProject
 添加投标项目
 * */
export const addBidProject = params => {
  return httpClient.post(`/api/bid/project/addBidProject`, params).then(ret => ret.data)
}
/**
 * POST
 /api/bid/project/changeBidProjectStateById
 根据投标项目id更改投标项目状态
 * */
export const changeBidProjectStateById = params => {
  return httpClient.post(`/api/bid/project/changeBidProjectStateById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/bid/project/deleteBidProjectById
 根据投标项目id删除投标项目信息
 * */
export const deleteBidProjectById = params => {
  return httpClient.post(`/api/bid/project/deleteBidProjectById`, params).then(ret => ret.data)
}
/**
 * POST
 /api/bid/project/fileBidProjectByBidProjectId
 归档投标项目和标书
 * */
export const fileBidProjectByBidProjectId = params => {
  return httpClient.post(`/api/bid/project/fileBidProjectByBidProjectId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/project/packaging/list
 包装信息列表
 * */
export const packageList = params => {
  return httpClient.post(`/api/project/packaging/list`, params).then(ret => ret.data)
}
/**
 * /api/bid/project/queryBidProjectById
 根据投标项目id查询投标项目信息
 * */
export const queryBidProjectById = params => {
  return httpClient.post(`/api/bid/project/queryBidProjectById`, params).then(ret => ret.data)
}
/**
 * /api/bid/project/updateBidProject
 根据投标ID修改投标项目信息
 * */
export const updateBidProject = params => {
  return httpClient.post(`/api/bid/project/updateBidProject`, params).then(ret => ret.data)
}
/**
 * /api/bid/project/queryBidProjectByProjectCode
 根据项目编码查询投标项目信息
 * */
export const queryBidProjectByProjectCode = params => {
  return httpClient.post(`/api/bid/project/queryBidProjectByProjectCode`, params).then(ret => ret.data)
}


/******************投标现场反馈相关管理*******************/

/**
 * /api/bid/feedback/addOrUpdateBidFeedback
 投标现场反馈添加
 * */
export const addOrUpdateBidFeedback = params => {
  return httpClient.post(`/api/bid/feedback/addOrUpdateBidFeedback`, params).then(ret => ret.data)
}
/**
 * /api/bid/feedback/queryBidFeedbackByBidProjectId
 根据投标项目id查询投标现场反馈信息
 * */
export const queryBidFeedbackByBidProjectId = params => {
  return httpClient.post(`/api/bid/feedback/queryBidFeedbackByBidProjectId`, params).then(ret => ret.data)
}



/******************投标结果情况相关控制*******************/

/**
 * /api/bid/result/addOrUpdateBidingResult
 投标结果情况跟踪添加
 * */
export const addOrUpdateBidingResult = params => {
  return httpClient.post(`/api/bid/result/addOrUpdateBidingResult`, params).then(ret => ret.data)
}
/**
 * /api/bid/result/queryBidingResultByBidProjectId
 根据投标项目id查询投标结果信息
 * */
export const queryBidingResultByBidProjectId = params => {
  return httpClient.post(`/api/bid/result/queryBidingResultByBidProjectId`, params).then(ret => ret.data)
}



/******************投标结果文件附件相关控制*******************/

/**
 * /api/bid/bidingResultAttachment/downloadBidingResultAttachment
 下载附件
 * */
export const downloadBidingResultAttachment = params => {
  return httpClient.post(`/api/bid/bidingResultAttachment/downloadBidingResultAttachment`, params).then(ret => ret.data)
}


/******************投标项目附件相关*******************/

/**
 * /api/bid/attachment/deleteBidAttachmentById
 根据附件ID删除附件
 * */
export const deleteBidAttachmentById = params => {
  return httpClient.post(`/api/bid/attachment/deleteBidAttachmentById`, params).then(ret => ret.data)
}
/**
 * /api/bid/attachment/downloadBidAttachment
 下载附件
 * */
export const downloadBidAttachment = params => {
  return httpClient.post(`/api/bid/attachment/downloadBidAttachment`, params).then(ret => ret.data)
}
/**
 * /api/bid/attachment/queryBidAttachmentById
 * 根据附件ID查询附件信息
 * */
export const queryBidAttachmentById = params => {
  return httpClient.post(`/api/bid/attachment/queryBidAttachmentById`, params).then(ret => ret.data)
}

/******************标书相关管理*******************/
/**
 * /api/bid/document/addOrUpdateBidingDocument
 标书制作
 * */
export const addOrUpdateBidingDocument = params => {
  return httpClient.post(`/api/bid/document/addOrUpdateBidingDocument`, params).then(ret => ret.data)
}
/**
 * /api/bid/document/queryBidingDocumentByBidProjectId
 根据投标项目id查询对应的标书信息
 * */
export const queryBidingDocumentByBidProjectId = params => {
  return httpClient.post(`/api/bid/document/queryBidingDocumentByBidProjectId`, params).then(ret => ret.data)
}
/**
 * POST
 /api/bid/document/detail
 标书id查询标书详情
 * */
export const queryBidingDocumentDetail = params => {
  return httpClient.post(`/api/bid/document/detail`, params).then(ret => ret.data)
}

/******************投标文件相关管理控制器*******************/
/**
 * /api/bid/fileManage/queryBidAttachmentLists
 投标项目附件列表
 * */
export const queryBidAttachmentLists = params => {
  return httpClient.post(`/api/bid/fileManage/queryBidAttachmentLists`, params).then(ret => ret.data)
}
/**
 * /api/bid/fileManage/deleteFileAttachment
 根据附件ID删除附件
 * */
export const deleteFileAttachment = params => {
  return httpClient.post(`/api/bid/fileManage/deleteFileAttachment`, params).then(ret => ret.data)
}
/**
 * api/bid/attachment/getAttachmentsByBidProjectId
 * */
export const getAttachmentsByBidProjectId = params => {
  return httpClient.post(`api/bid/attachment/getAttachmentsByBidProjectId`, params).then(ret => ret.data)
}

//根据投标ID获取勘察
export const getBidSurveyByBidId = params => {
  return httpClient.get(`/api/bid/survey/getBidSurveyByBidId`, {params:params}).then(ret => ret.data)
}
//保存前期勘察
export const saveBidSurvey = params => {
  return httpClient.post(`/api/bid/survey/save`, params).then(ret => ret.data)
}

//根据投标ID获取勘察
export const getBidFileByBidId = params => {
  return httpClient.get(`api/bid/file/getBidFileByBidId`, {params:params}).then(ret => ret.data)
}

/** =++++++++++++++  注意事项  +++++++++++++++++ */

//查询注意事项信息
export const queryBidMna = params => {
  return httpClient.post(`/api/bid/mna/queryBidMna`,params).then(ret => ret.data)
}

//根据id查询注意事项信息
export const queryBidMnaById = params => {
  return httpClient.post(`/api/bid/mna/queryBidMnaById`, params).then(ret => ret.data)
}
//根据id删除注意事项信息
export const removeAttentionById = params => {
  return httpClient.post(`/api/bid/mna/removeById`, params).then(ret => ret.data)
}
//存储
export const saveAttentioon = params => {
  return httpClient.post(`/api/bid/mna/save`, params).then(ret => ret.data)
}
//根据ID修改注意事项信息
export const updateAttentionById = params => {
  return httpClient.post(`/api/bid/mna/updateById`, params).then(ret => ret.data)
}
/***+++++++++++++++++ 问题反馈 ++++++++++++++++++++++++++ */

//查询问题反馈信息
export const queryBidMnaQuestion = params => {
  return httpClient.post(`/api/bid/problem/feedback/queryBidMna`, params).then(ret => ret.data)
}

//根据id查询问题反馈信息
export const queryBidMnaByIdQuestion = params => {
  return httpClient.post(`/api/bid/problem/feedback/queryBidMnaById`, params).then(ret => ret.data)
}
//根据id删除问题反馈信息
export const removeByIdQuestion = params => {
  return httpClient.post(`/api/bid/problem/feedback/removeById`, params).then(ret => ret.data)
}
//存储
export const saveQuestion = params => {
  return httpClient.post(`/api/bid/problem/feedback/save`, params).then(ret => ret.data)
}
//根据ID修改问题反馈信息
export const updateByIdQuestion = params => {
  return httpClient.post(`/api/bid/problem/feedback/updateById`, params).then(ret => ret.data)
}