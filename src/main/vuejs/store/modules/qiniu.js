/**
 * Created by easy on 2018/10/12.
 */
import Api from '@/api'
const state = {
  qiniuToken: '',
  downUrl: ''
}
// getters
const getters = {
  getQiniuToken: state => { return state.qiniuToken }
}
// actions
const actions = {
  getQiniuToken ({ commit, state }) {
    Api.getPicToken().then(function (res) {
      console.log(res,'qiniu')
      const qiniuToken = res
     // const downUrl = res.data.downurl
      commit('setQiniuToken', {qiniuToken})
      //commit('setQiniuDownUrl', {downUrl})
    }).catch(function (error) {
    })
  },
}
// mutations
const mutations = {
  setQiniuToken (state, { qiniuToken }) {
    state.qiniuToken = qiniuToken
  },
  setQiniuDownUrl (state, { downUrl }) {
    state.downUrl = downUrl
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
