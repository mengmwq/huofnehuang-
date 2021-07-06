/**
 * Created by sunzelong on 2018/12/15.
 */
import * as types from '../mutation-types'
import Api from '@/api/index'
const state = {
  specialUserPage:null,
}
// getters
const getters = {
    getSpecialUserPage: state => state.specialUserPage,
}
// actions
const actions = {

  getSpecialUserPage ({ commit, state }, params) {
    Api.findSpecialUserToPage(params).then(function (res) {
      const specialUserPage = res.data
      commit(types.GET_SPECIAL_USER_PAGE, {specialUserPage})
    }).catch(function (error) {
      
    })
  },

}
// mutations
const mutations = {
  [types.GET_SPECIAL_USER_PAGE] (state, {specialUserPage}) {
    state.specialUserPage = specialUserPage;
  },
}
export default {
  state,
  getters,
  actions,
  mutations
}
