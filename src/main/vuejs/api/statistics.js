import { httpClient } from './base.js'
// 项目收支统计
export const pageBudgetStatistics = params => {
  return httpClient.post(`/api/statistics/pageBudgetStatistics`, params).then(ret => ret.data)
}
//项目明细统计
export const getBudgetDetails = params => {
    return httpClient.get(`/api/statistics/getBudgetDetails`, {params:params}).then(ret => ret.data)
  }
  //获取分公司
  export const getCompanyStatistics = params => {
    return httpClient.post(`/api/statistics/getCompanyStatistics`, params).then(ret => ret.data)
  }
  //获取营收项目10
  export const getRevenueProjectsStatistics = params => {
    return httpClient.post(`/api/statistics/getRevenueProjectsStatistics`, params).then(ret => ret.data)
  }
  //获取营收排行
  export const getRevenueRankingStatistics = params => {
    return httpClient.post(`/api/statistics/getRevenueRankingStatistics`, params).then(ret => ret.data)
  }
  //获取当前信息的总收入对比
  export const getSummaryStatistics = params => {
    return httpClient.post(`/api/statistics/getSummaryStatistics`, params).then(ret => ret.data)
  }
  //获取项目明细 部门人员
  export const getUserBudgetStatistics = params => {
    return httpClient.get(`/api/statistics/getUserBudgetStatistics`, {params:params}).then(ret => ret.data)
  }
//获取地图上分公司
export const getLongitudeCompanyStatistics = params => {
    return httpClient.post(`/api/statistics/getLongitudeCompanyStatistics`,params).then(ret => ret.data)
}

//公司的支出和收入
export const getCompanyExpIncomeStatistics = params => {
  return httpClient.post(`/api/statistics/getCompanyExpIncomeStatistics`,params).then(ret => ret.data)
}
//获取成本和收入对比
export const getCostStatistics = params => {
  return httpClient.post(`/api/statistics/getCostStatistics`,params).then(ret => ret.data)
}
//部门的支出和收入
export const getOrgExpIncomeStatistics = params => {
  return httpClient.post(`/api/statistics/getOrgExpIncomeStatistics`,params).then(ret => ret.data)
}
//人的支出和收入
export const getPeopleExpIncomeStatistics = params => {
  return httpClient.post(`/api/statistics/getPeopleExpIncomeStatistics`,params).then(ret => ret.data)
}
export const getCustomerStatistics = params => {
  return httpClient.post(`/api/statistics/getCustomerStatistics`,params).then(ret => ret.data)
}
export const getSupplierStatistics = params => {
  return httpClient.post(`/api/statistics/getSupplierStatistics`,params).then(ret => ret.data)
}
export const getCustomerDetailedStatistics = params => {
  return httpClient.post(`/api/statistics/getCustomerDetailedStatistics`,params).then(ret => ret.data)
}
export const getSupplierDetailedStatistics = params => {
  return httpClient.post(`/api/statistics/getSupplierDetailedStatistics`,params).then(ret => ret.data)
}
