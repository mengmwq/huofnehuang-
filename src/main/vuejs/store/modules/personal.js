import Api from '@/api'
import moment from 'moment'
import * as filter from '../../filters/filter'

export default {
  state: {
    myActivityListData: {
      result: []
    }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    /**
     * 加载我的活动列表
     * @param context
     * @param params
     */
    loadMyActivityListData (context, params) {
      Api.queryMyApplyActive(params).then(res => {
        res.data.result.forEach(item => {
          item.active.startAt = moment(item.active.startAt).format('YYYY-MM-DD HH:mm')
          item.contacterApply.type = item.contacterApply.detailType
          item.contacterApply.detailType = filter.applyDetailFilter(item.contacterApply.detailType)
          if (item.contacterApply.checkStatus === 6) {
            if (item.contacterApply.type === 1) {
              item.contacterApply.checkStatus = '逾期未付款'
            } else {
              item.contacterApply.checkStatus = '逾期未确认'
            }
          } else {
            item.contacterApply.checkStatus = filter.applyStatusFilter(item.contacterApply.checkStatus)
          }
        })
        context.state.myActivityListData = res.data
      })
    }
  }
}
