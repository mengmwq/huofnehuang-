/**
 * Created by sunzelong on 2018/12/25.
 */
import * as types from '../mutation-types'
import Api from '@/api'
const state = {
  notifyPage:null,
}
// getters
const getters = {
  getNotifyPage: state => state.notifyPage,

}
// actions
const actions = {

  getNotifyPage ({ commit, state }, params) {
    Api.getPageNotifyMessagesByUser(params).then(function (res) {
      const notifyPage = res.data;
      commit(types.NOTIFY_PAGE, {notifyPage})
    }).catch(function (error) {
      console.log(error)
    })
  },
  
}
// mutations
const mutations = {
  [types.NOTIFY_PAGE] (state, {notifyPage}) {
    state.notifyPage = notifyPage;
  }

}
export default {
  state,
  getters,
  actions,
  mutations
}
