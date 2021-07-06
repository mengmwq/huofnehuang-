import { httpClient } from './base.js'

/******************投标项目相关管理*******************/

//入库
export const WarehousingNotBonded = params => {
  return httpClient.post(`/api/non/bonded/WarehousingNotBonded`, params).then(ret => ret.data)
}
//出库
export const checkoutNotBonded = params => {
    return httpClient.post(`/api/non/bonded/checkoutNotBonded`, params).then(ret => ret.data)
  }
//根据柜id查询位分页
export const queryPageNotBonded = params => {
    return httpClient.post(`/api/non/bonded/queryPageNotBonded`, params).then(ret => ret.data)
  }
//保存
export const getBondedDetail = params => {
  return httpClient.get(`/api/non/bonded/getById`, {params:params}).then(ret => ret.data)
}
//获取非保税列表
export const saveBonded = params => {
  return httpClient.post(`/api/non/bonded/save`, params).then(ret => ret.data)
}
//根据id更新
export const updateBondedById = params => {
  return httpClient.post(`/api/non/bonded/updateById`, params).then(ret => ret.data)
}

//删除
export const removeBonded = params => {
  return httpClient.get(`/api/non/bonded/remove`, {params:params}).then(ret => ret.data)
}
//回执查询
export const queryNonBondedReceipt = params => {
  return httpClient.post(`/api/non/bonded/queryNonBondedReceipt`, params).then(ret => ret.data)
}

