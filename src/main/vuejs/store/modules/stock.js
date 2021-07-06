
import Api from '@/api'
import * as filter from "../../filters/filter";

const state = {
  stockOutIds: [],
}

const getters = {
}

const mutations = {
  setStockOutIds (state, {ids}) {
    state.stockOutIds = ids
  },
}

const actions = {
  /**
   *
   * */
  setStockOutIds (context, ids) {
    context.commit('setStockOutIds', {ids: ids})
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
