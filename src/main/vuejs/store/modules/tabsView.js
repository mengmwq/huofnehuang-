/**
 * Created by sunzelong on 2017/9/28.
 */
import * as types from '../mutation-types'
const state = {  
  visitedViews: []
}
// getters
const getters = { 
  visitedViews1: state => state.visitedViews,
}
// actions
const actions = {
  addVisitedViews({ commit }, view) {
    commit(types.ADD_VISITED_VIEWS, {view})
  },
  delVisitedViews({ commit, state }, view) {
    return new Promise((resolve) => {
      commit(types.DEL_VISITED_VIEWS, {view})
      resolve([...state.visitedViews])
    })
  },  
}
// mutations
const mutations = {  
  [types.ADD_VISITED_VIEWS] (state, {view}) {    
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push({ name: view.name, path: view.path })
  },
  [types.DEL_VISITED_VIEWS] (state, {view}) {
    let index
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        index = i
        break
      }
    }
    state.visitedViews.splice(index, 1)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
