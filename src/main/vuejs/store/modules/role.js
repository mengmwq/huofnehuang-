/**
 * Created by sunzelong on 2017/9/28.
 */
import * as types from '../mutation-types'
import Api from '@/api/index'
import Message from './message.js'
const state = {
  rolePage:null,
  message:null,
  roleList:null,
  roleDetails:null
}
// getters
const getters = {
  getRolePage: state => state.rolePage,
  selectRoleList: state => state.roleList,
  selectRoleByID: state => state.roleDetails
}
// actions
const actions = {

  getRolePage ({ commit, state }, params) {
    Api.getAllRole(params).then(function (res) {
      const rolePage = res.data
      commit(types.SELECT_ROLE, {rolePage})
    }).catch(function (error) {
      
    })
  },

  selectRoleList ({ commit, state }, params) {
    Api.selectRoleList(null).then(function (res) {
      const roleList = res.data;
      commit(types.GET_ALL_ROLE_LIST, {roleList})
    }).catch(function (error) {
      
    })
  },
  /**
   * 通过ID获取角色信息
   */
  selectRoleByID ({ commit, state }, params) {
    Api.selectRoleByID(params).then(function (res) {
      console.log(res.data,'list')
      const roleDetails = res.data;
      commit(types.GET_ALL_ROLE_DETAILS, {roleDetails})
    }).catch(function (error) {
      
    })
  },
  insertRole ({ dispatch,commit, state }, params) {
    Api.insertRole(params).then(function (res) {
      const message = {value:  `角色【${params.name}】添加成功`, type: 'success', time: new Date()}
      dispatch('setMessageList', message)
    }).catch(function (error) {
      const params = {value:  `角色【${params.name}】添加失败`, type: 'error', time: new Date()}
      dispatch('setMessageList', params)
      
    })
  },

  updateRole ({ dispatch,commit, state }, params) {
    Api.updateRole(params).then(function (res) {
      const message = {value: `角色【${params.name}】修改成功`, type: 'success', time: new Date()}
      dispatch('setMessageList', message)
    }).catch(function (error) {
      const message = {value: `角色【${params.name}】修改失败`, type: 'error', time: new Date()}
      dispatch('setMessageList', message)
    })
  },

  deleteRole ({ dispatch,commit, state }, params) {
    Api.deleteRole(params).then(function (res) {
      const message = {value: '角色信息删除成功', type: 'success', time: new Date()}
      dispatch('setMessageList', message)
  }).catch(function (error) {
      const message = {value: '角色信息删除失败', type: 'error', time: new Date()}
      dispatch('setMessageList', message)
      
    })
  },

  clearAllInfo: function () {
    this.message = null;
    const message = null;
    //this.$emit("checkOrgTree",this.$refs.tree.getCheckedNodes());
/*    this.commit(types.INSERT_ROLE,{message});
    this.commit(types.UPDATE_ROLE,{message});
    this.commit(types.DELETE_ROLE,{message});*/
  },
}
// mutations
const mutations = {
  [types.SELECT_ROLE] (state, {rolePage}) {
    state.rolePage = rolePage;
  },
  [types.GET_ALL_ROLE_LIST] (state, {roleList}) {
    state.roleList = roleList;
  },
  [types.GET_ALL_ROLE_DETAILS] (state, {roleDetails}) {
    state.roleDetails = roleDetails;
  },
  
}
export default {
  state,
  getters,
  actions,
  mutations
}
