/**
 * Created by sunzelong on 2018/11/06.
 */
import * as types from '../mutation-types'
import Api from '@/api/index'
const state = {
  userPage:null,
  message:null
}
// getters
const getters = {
  getUserPage: state => state.userPage,

}
// actions
const actions = {

  getUserPage ({ commit, state }, params) {
    Api.getUserInfoList(params).then(function (res) {
      const userPage = res.data
      commit(types.GET_USER_INFO_LIST, {userPage})
    }).catch(function (error) {
      console.log(error)
    })
  },
  insertUser ({ dispatch, commit, state }, params) {
    Api.insertUser(params).then(function (res) {
      const message = {value: `客户【${params.name}】添加成功`, type: 'success', time: new Date()}
      dispatch('setMessageList', message)
    }).catch(function (error) {
      const message = {value: `客户【${params.name}】添加失败`, type: 'error', time: new Date()}
      dispatch('setMessageList', message)
      console.log(error)
    })
  },

  updateUser ({ dispatch, commit, state }, params) {
    Api.updateUser(params).then(function (res) {
      const message = {value: `客户【${params.name}】修改成功`, type: 'success', time: new Date()}
      dispatch('setMessageList', message)
    }).catch(function (error) {
      const message = {value: `客户【${params.name}】修改失败`, type: 'error', time: new Date()}
      dispatch('setMessageList', message)
      console.log(error)
    })
  },

  updateUserRole ({ dispatch, commit, state }, params) {
    Api.updateUserRole(params.roleList).then(function (res) {
      const message = {value: `客户【${params.name}】授权成功`, type: 'success', time: new Date()}
      dispatch('setMessageList', message)
    }).catch(function (error) {
      const message = {value: `客户【${params.name}】授权失败`, type: 'error', time: new Date()}
      dispatch('setMessageList', message)
      console.log(error)
    })
  },

  deleteUser ({ dispatch, commit, state }, params) {
    Api.deleteUser(params).then(function (res) {
      const message = {value: '成员删除成功', type: 'success', time: new Date()}
      dispatch('setMessageList', message)
    }).catch(function (error) {
      const message = {value: '成员删除失败', type: 'error', time: new Date()}
      dispatch('setMessageList', message)
      console.log(error)
    })
  }
}
// mutations
const mutations = {
  [types.GET_USER_INFO_LIST] (state, {userPage}) {
    state.userPage = userPage
  }

}
export default {
  state,
  getters,
  actions,
  mutations
}
