/**
 * Created by sunzelong on 2019/12/25.
 * 业务 — 审批
 */
import Api from '@/api'
const state = {
  jobApprovalPage: null, // 招聘审批
  approvalProcessPage: null, // 审批列表
  approvalActivityPage: null, // 审批活动
  approvalCount: null,// 审批数量
  pendingApprovalCount:0, //待审批数量
}
// getters
const getters = {
  getJobApprovalPage: state => state.jobApprovalPage,
  getApprovalActivityPage: state => state.approvalActivityPage,
  getMyApprovalProductPage: state => state.jobApprovalPage,
  getMyApprovalActivityPage: state => state.approvalActivityPage,
  getApprovalProcessPage: state => state.approvalProcessPage,
  getApprovalCount: state => state.approvalCount
}
// actions
const actions = {
  // 审批列表
  getApprovalProcessPage ({ commit, state }, params) {
    Api.getApprovalProcessPage(params).then(function (res) {
      commit('getApprovalProcessPage', {approvalProcessPage: res})
    }).catch(function (error) {
      console.log(error)
    })
  },
  // 审批产品
  getJobApprovalPage ({ commit, state }, params) {
    Api.getJobApprovalPage(params).then(function (res) {
      commit('getJobApprovalPage', {jobApprovalPage: res})
    }).catch(function (error) {
      console.log(error)
    })
  },
  // 我发起的审批产品
  getMyApprovalProductPage ({ commit, state }, params) {
    Api.getMyselfApprovalProductList(params).then(function (res) {
      commit('getMyApprovalProductPage', {jobApprovalPage: res})
    }).catch(function (error) {
      console.log(error)
    })
  },
  // 审批活动
  getApprovalActivityPage ({ commit, state }, params) {
    Api.getApprovalActivityPage(params).then(function (res) {
      commit('getApprovalActivityPage', {approvalActivityPage: res})
    }).catch(function (error) {
      console.log(error)
    })
  },
  // 我发起的审批活动
  getMyApprovalActivityPage ({ commit, state }, params) {
    Api.getMyselfApprovalActivityList(params).then(function (res) {
      commit('getMyApprovalActivityPage', {approvalActivityPage: res})
    }).catch(function (error) {
      console.log(error)
    })
  },
  // 审批数量
  getApprovalCount ({ commit, state }, params) {
    Api.getApprovalCount(params).then(function (res) {
      commit('getApprovalCount', {approvalCount: res})
    }).catch(function (error) {
      console.log(error)
    })
  }

}
// mutations
const mutations = {
  setApprovalCount(state, {
    pendingApprovalCount
  }) {
    state.pendingApprovalCount = pendingApprovalCount
  },
  // 审批列表页
  getApprovalProcessPage (state, {approvalProcessPage}) {
    state.approvalProcessPage = approvalProcessPage
  },

  // 审批产品列表页
  getJobApprovalPage (state, {jobApprovalPage}) {
    state.jobApprovalPage = jobApprovalPage
  },
  // 我发起的审批产品列表页
  getMyApprovalProductPage (state, {jobApprovalPage}) {
    state.jobApprovalPage = jobApprovalPage
  },
  // 审批产品列表页
  getApprovalActivityPage (state, {approvalActivityPage}) {
    state.approvalActivityPage = approvalActivityPage
  },
  // 我发起的审批产品列表页
  getMyApprovalActivityPage (state, {approvalActivityPage}) {
    state.approvalActivityPage = approvalActivityPage
  },
  // 审批产品列表页
  getApprovalCount (state, {approvalCount}) {
    state.approvalCount = approvalCount
  }

}
export default {
  state,
  getters,
  actions,
  mutations
}
