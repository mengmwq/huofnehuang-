/**
 * Created by sunzelong on 2017/9/28.
 */
import * as types from '../mutation-types'
import Api from '@/api/index'
const state = {
  allResourceInfo:[],
  resourceInfoByRoleId:[]
}
// getters
const getters = {
    selectAllResourceInfo: state => state.allResourceInfo,
    selectResourceByRoleId: state => state.resourceInfoByRoleId
}
// actions
const actions = {
  selectAllResourceInfo ({ commit, state }) {
    Api.getUIResourceTree(null).then(function (res) {
      const allResourceInfo = res.data;
      commit(types.SELECT_ALL_RESOURCE_INFO, {allResourceInfo})
    }).catch(function (error) {
      console.log(error)
    })
  },
  selectResourceByRoleId ({ commit, state }, params) {
    Api.selectResourceByRoleId(params).then(function (res) {
      const resourceInfoByRoleId = res.data;
      commit(types.SELECT_RESOURCE_BY_ROLE_ID, {resourceInfoByRoleId})
    }).catch(function (error) {
      console.log(error)
    })
  },
  clearResourceInfoByRoleId: function () {
    const resourceInfoByRoleId = [];
    //this.$emit("checkOrgTree",this.$refs.tree.getCheckedNodes());
    this.commit(types.SELECT_RESOURCE_BY_ROLE_ID,{resourceInfoByRoleId});
  },

}
// mutations
const mutations = {
  [types.SELECT_ALL_RESOURCE_INFO] (state, {allResourceInfo}) {
    state.allResourceInfo = allResourceInfo;
  },
  [types.SELECT_RESOURCE_BY_ROLE_ID] (state, {resourceInfoByRoleId}) {
    state.resourceInfoByRoleId = resourceInfoByRoleId;
  },

}
export default {
  state,
  getters,
  actions,
  mutations
}
