/**
 * Created by sunzelong on 2017/9/28.
 */
import * as types from '../mutation-types'
import Api from '@/api'
var co_list = [];
const state = {
  allOrganizationInfo:[],
  orgsByRoleId:[],
  //commissionByOrgId:[],
  //commissionList:[],
  //commissionManagement:[],  
  commission:[],
  contacts:[],
  distributionOrg:[]
}
// getters
const getters = {
      getOrganizationInfoList: state => state.allOrganizationInfo,
      selectOrgsByRoleId: state => state.orgsByRoleId,
      //getCommissionList: state => state.commissionList,
      //getCommissionManagement: state => state.commissionManagement,    
      getCommissionList:state => state.commission,
      getContacts: state => state.contacts,
      //getCommissionByOrgId: state => state.commissionByOrgId,
      getDistributionOrg: state => state.distributionOrg,
}
// actions
const actions = {
   getOrganizationInfoList ({ commit, state },params) {
    Api.getOrganizationInfoList(params).then(function (res) {
      const allOrganizationInfo = res.data;
      console.log('store:',res.data)
      commit(types.GET_ORGANIZATION_INFO_LIST, {allOrganizationInfo})
    }).catch(function (error) {
      console.log(error)
    })
  },
  selectOrgsByRoleId ({ commit, state }, params) {
    Api.selectOrgsByRoleId(params).then(function (res) {
      const orgsByRoleId = res.data;
      commit(types.SELECT_ORGS_BY_ROLE_ID, {orgsByRoleId})
    }).catch(function (error) {
      console.log(error)
    })
  },
  //提成管理
  getCommission({ commit, state },params){
    Api.selectCommissionList(params).then(function (res) {
      let commission = res.data;
      commit(types.GET_COMMISSION, {commission})
    }).catch(function (error) {
      console.log(error)
    })
  },
  /*getCommissionList({ commit, state },params){
    Api.getCommissionInFos(params).then(function (res) {
      let slist = res.data;
      slist.forEach(function(item){
          item.commission = 20;
      });
      const commissionList = slist;
      commit(types.GET_COMMISSION_LIST, {commissionList})
    }).catch(function (error) {
      console.log(error)
    })
  },*/
  //提成管理
  /*getCommissionManagement({ commit, state },params){
    Api.selectCommissionManagementList(params).then(function (res) {
      let commissionManagement = res.data;
      commit(types.GET_COMMISSION_MANAGEMENT, {commissionManagement})
    }).catch(function (error) {
      console.log(error)
    })
  },*/
  getContactsinfo({ commit, state },params){
    Api.getContactsinfo(params).then(function (res) {
      const contacts = res.data;
      commit(types.GET_CONTACTS, {contacts})
    }).catch(function (error) {
      console.log(error)
    })
  },
  /*getCommissionByOrgId ({ commit, state }, params) {
    Api.getCommissionByOrgId(params).then(function (res) {

      Api.getCommissionInFos().then(function (res1){
          co_list = res1.data;
          let orglist = res.data;

          co_list.forEach((co)=>{
            co.commission = 20;
            co.platformCommission = 20;
            orglist.forEach((org)=>{
              if (co.distributionCenterId == org.distributionCenterId) {
                co.platformCommission = org.platformCommission
                co.commission = org.commission;
                co.commissionFlag = org.commissionFlag;
              }
            });
          });
          const commissionList = co_list;
          commit(types.GET_COMMISSION_LIST, {commissionList})
      })
    }).catch(function (error) {
      console.log(error)
    })
  },*/

  getDistributionOrg({ commit, state },params){
    Api.getDistributionOrg(params).then(function (res) {
      let distributionOrg = res.data;
      commit(types.GET_DISTRIBUTION_ORG, {distributionOrg})
    }).catch(function (error) {
      console.log(error)
    })
  },


}
// mutations
const mutations = {  
  [types.GET_ORGANIZATION_INFO_LIST] (state, {allOrganizationInfo}) {
    state.allOrganizationInfo = allOrganizationInfo;
  },
  [types.SELECT_ORGS_BY_ROLE_ID] (state, {orgsByRoleId}) {
    state.orgsByRoleId = orgsByRoleId;
  },
  /*[types.GET_COMMISSION_LIST] (state, {commissionList}) {
    state.commissionList = commissionList;
  },*/
  //提成管理
  [types.GET_COMMISSION] (state, {commission}) {
    state.commission = commission;
  },
  [types.GET_CONTACTS] (state, {contacts}) {
    state.contacts = contacts;
  },
  /*[types.GET_COMMISSION_BY_ORG_ID] (state, {commissionByOrgId}) {
    state.commissionByOrgId = commissionByOrgId;
  },*/
  [types.GET_DISTRIBUTION_ORG] (state, {distributionOrg}) {
    state.distributionOrg = distributionOrg;
  },
}
export default {
  state,
  getters,
  actions,
  mutations
}
