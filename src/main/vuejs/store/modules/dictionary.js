/**
 * Created by 30964 on 2017/9/27.
 */
import * as types from '../mutation-types'
import * as jquery from 'jquery'
let base = '/proxy'
//let base = 'http://192.168.1.163:9000'

// 持续集成环境
if (process.env.NODE_ENV === 'build') {
  base = '...'
 //base = 'http://192.168.1.163:9000'
}
const dists = JSON.parse(sessionStorage.getItem('dists'))
const state = {
  dists: dists?dists:[],
  /**
   * [keys description]
   * @type {Array}
   *
   * 'CityDictionary'取的是三方的省市区
   * 其中下面带Lt都是零担业务使用的，一行代表一个大类中的小类；
   *
   */
  // keys: [
  //    'CardType', 'SpecialType','UserInfoDictionary'
  // ]
  /*MESSAGE_TYPE*/
  keys: [
    'SexType', 'UserClassType', 'DelFlagStatus', 'Currency', 'CarType', 'PlateType', 'TransportationMode', 'PackageType',
    'TasType', 'ArtType', 'TaskTemplateType', 'TaskState', 'TaskLevel', 'TaskAttachmentType', 'ProjectForeignRegulate','ReceiptType',
    'ApprovalCategory', 'BudgetCostState', 'WorkCustomsType', 'ContractState','ContractType','BidAttchmentType', 'ProjectType',
    'ProjectState', 'FeeType', 'TrafficType', 'CityLevel', 'ApprovalState','PayType','ReimburseState', 'ContractTargetType',
    'PayingState','CustomsAttachmentType','NON_BONDED_STATUS','ORG_TYPE','BalanceDetailedType','PROJECT_BILL_TYPE',
    'ClosingCaseStatus','PROJECT_TYPE','SupplierType','APPLICANTS_TYPE','NON_BONDED_STATUS',
    'MESSAGE_TYPE', 'FUNCTION_CODE','CHK_RESULT','SEND_TYPE','GOODS_NATURE','DATA_TYPE','TYPE','CHK_CODE','Country','Grade',
    'ApprovalCategory','ApprovalLevel','ApprovalNodeState',
    'CarNatureType','CarProgressType','PurchaseType',
 ]
}
// getters
const getters = {
  getAllDists: state => {
    console.log(state.dists);
    return state.dists
  },
  getObjectByValue: (state) => (key, value) => {
    console.log(key);
    const object = state.dists[key].children.find(child => child['value'] === value)
    return object
  }
}

// actions
const actions = {
  getDists({
    dispatch,
    commit,
    state
  }) {
    const dists = JSON.parse(sessionStorage.getItem('dists'))
    if(!dists){
      jquery.ajax({
        url: base + '/dictionaries',
        type: 'POST',
        async: false, // 使用同步的方式,true为异步方式
        traditional: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(state.keys),
        success: function (res) {
          const dists = res
          // 把数据字典写缓存
          window.sessionStorage.setItem(`dists`, JSON.stringify(dists));
         
          commit(types.SET_DISTS, {
            dists
          })
          
        },
        error: function (err) {
          const message = {
            value: err.responseJSON.errorMsg,
            type: 'error',
            time: new Date()
          }
          dispatch('setMessageList', message)
        }
      })
    }
  }
}
// mutations
const mutations = {
  [types.SET_DISTS](state, {
    dists
  }) {
    state.dists = dists
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
