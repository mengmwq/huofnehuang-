import { httpClient } from './base.js'

export const updateGoodsWarehouse = params => {
  return httpClient.post(`/api/GoodsWarehouse/update`, params).then(ret => ret.data)
}

export const addGoodsWarehouse = params => {
  return httpClient.post(`/api/GoodsWarehouse/add`, params).then(ret => ret.data)
}

export const removeGoodsWarehouse = params => {
  return httpClient.post(`/api/GoodsWarehouse/removeById`, params).then(ret => ret.data)
}

export const pageGoodsWarehouse = params => {
  return httpClient.post(`/api/GoodsWarehouse/page`, params).then(ret => ret.data)
}

export const updateTransportationManagement = params => {
  return httpClient.post(`/api/TransportationManagement/update`, params).then(ret => ret.data)
}

export const addTransportationManagement = params => {
  return httpClient.post(`/api/TransportationManagement/add`, params).then(ret => ret.data)
}

export const removeTransportationManagement = params => {
  return httpClient.post(`/api/TransportationManagement/removeById`, params).then(ret => ret.data)
}

export const pageTransportationManagement = params => {
  return httpClient.post(`/api/TransportationManagement/page`, params).then(ret => ret.data)
}