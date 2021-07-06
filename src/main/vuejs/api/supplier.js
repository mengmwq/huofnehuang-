import {httpClient} from './base.js'

/**
 * POST
 * /api/supplier/info/supplierList
 * 供应商列表，可根据供应商名模糊搜索
 */
export const supplierList = params => {
  return httpClient.post(`/api/supplier/info/supplierList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/addSupplier
 * 添加供应商
 */
export const addSupplier = params => {
  return httpClient.post(`/api/supplier/info/addSupplier`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/deleteSupplier
 * 删除供应商
 */
export const deleteSupplier = params => {
  return httpClient.post(`/api/supplier/info/deleteSupplier`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/updateSupplier
 * 修改供应商
 */
export const updateSupplier = params => {
  return httpClient.post(`/api/supplier/info/updateSupplier`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/supplierDetailInfo
 * 根据供应商id查询供应商详情
 */
export const supplierDetailInfo = params => {
  return httpClient.post(`/api/supplier/info/supplierDetailInfo`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/supplierBaseInfo
 * 根据供应商id查询供应商基本信息
 */
export const supplierBaseInfo = params => {
  return httpClient.post(`/api/supplier/info/supplierBaseInfo`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/selectSupplierGoodsBySupplierId
 * 供应商对应的商品列表(启用状态的)
 */
export const selectSupplierGoodsBySupplierId = params => {
  return httpClient.post(`/api/supplier/info/selectSupplierGoodsBySupplierId`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/selectSupplierAttachments
 * 供应商附件列表
 */
export const selectSupplierAttachments = params => {
  return httpClient.post(`/api/supplier/info/selectSupplierAttachments`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/selectContactersBySupplierId
 * 根据供应商ID查询对应的联系人列表
 */
export const selectContactersBySupplierId = params => {
  return httpClient.post(`/api/supplier/info/selectContactersBySupplierId`, params).then(ret => ret.data)
}

/**
 * POST
 * /api/supplier/info/contacterPageListBySupplierId
 * @param params
 * @returns {PromiseLike<T> | Promise<T>}
 */
export const contacterPageListBySupplierId = params => {
  return httpClient.post(`/api/supplier/info/contacterPageListBySupplierId`, params).then(ret => ret.data)
}

/********* 供应商商品  ********/
/**
 * POST
 * /api/supplierGoods/supplierGoodsList
 * 供应商对应的商品列表（所有状态的），支持按照商品名称模糊查询
 */
export const supplierGoodsList = params => {
  return httpClient.post(`/api/supplierGoods/supplierGoodsList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplierGoods/selectSupplierGoodsById
 * 根据商品id查询商品信息
 */
export const selectSupplierGoodsById = params => {
  return httpClient.post(`/api/supplierGoods/selectSupplierGoodsById`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplierGoods/updateSupplierGoodsById
 * 修改商品信息（启用，停用）
 */
export const updateSupplierGoodsById = params => {
  return httpClient.post(`/api/supplierGoods/updateSupplierGoodsById`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplier/info/selectSupplierList
 可用的供应商列表
 */
export const selectSupplierList = params => {
  return httpClient.post(`/api/supplier/info/selectSupplierList`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplierGoods/supplierGoodsWithDistinctName
 查询对应供应商下面的所有商品
 */
export const supplierGoodsWithDistinctName = params => {
  return httpClient.post(`/api/supplierGoods/supplierGoodsWithDistinctName`, params).then(ret => ret.data)
}
/**
 * POST
 * /api/supplierGoods/supplierGoodsWithPrice
 查询对应供应商+商品名+规格的所有商品
 */
export const supplierGoodsWithPrice = params => {
  return httpClient.post(`/api/supplierGoods/supplierGoodsWithPrice`, params).then(ret => ret.data)
}
/**
 *
 /api/supplierGoods/supplierGoodsWithSpecifications
 查询对应供应商+商品名的所有商品
 */
export const supplierGoodsWithSpecifications = params => {
  return httpClient.post(`/api/supplierGoods/supplierGoodsWithSpecifications`, params).then(ret => ret.data)
}

//物流供应商列表，可根据供应商名模糊搜索
export const supplierMaterielList = params => {
  return httpClient.post(`/api/supplier/info/supplierMaterielList`, params).then(ret => ret.data)
}

/*************   外工供应商   *************** */


//添加供应商
export const addSupplierOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/addSupplier`, params).then(ret => ret.data)
}
//供应商对应的联系人分页列表（所有状态的），可根据联系人名称模糊查询
export const contacterPageListBySupplierIdOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/contacterPageListBySupplierId`, params).then(ret => ret.data)
}
//删除供应商
export const deleteSupplierOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/deleteSupplier`, params).then(ret => ret.data)
}
//查询所有供应商Id
export const listAllOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/listAll`, params).then(ret => ret.data)
}
//根据供应商ID查询对应的联系人列表
export const selectContactersBySupplierIdOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/selectContactersBySupplierId`, params).then(ret => ret.data)
}
//供应商附件列表
export const selectSupplierAttachmentsOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/selectSupplierAttachments`, params).then(ret => ret.data)
}
//供应商对应的商品列表(启用状态的)
export const selectSupplierGoodsBySupplierIdOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/selectSupplierGoodsBySupplierId`, params).then(ret => ret.data)
}

//可用的供应商列表
export const selectSupplierListOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/selectSupplierList`, params).then(ret => ret.data)
}
//根据供应商id查询供应商基本信息
export const supplierBaseInfoOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/supplierBaseInfo`, params).then(ret => ret.data)
}
//根据供应商id查询供应商详情
export const supplierDetailInfoOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/supplierDetailInfo`, params).then(ret => ret.data)
}
///业务供应商列表，可根据供应商名模糊搜索
export const supplierListOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/supplierList`, params).then(ret => ret.data)
}
//物流供应商列表，可根据供应商名模糊搜索
export const supplierMaterielListOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/supplierMaterielList`, params).then(ret => ret.data)
}
//修改供应商
export const updateSupplierOuterWorker = params => {
  return httpClient.post(`/api/outworker/info/updateSupplier`, params).then(ret => ret.data)
}