/** 
 * 
 * Created by sunzelong on 2019/01/11.
 * 会员管理
 * */
import Api from '@/api'
const state = {
  userPage: null,
  userBehaviorPage:null,  //会员行为查看
  departmentPerson:[], //部门人员列表
}

const getters = {
}

const mutations = {
  //会员列表页
  getUserPage (state, {userPage}) {
    state.userPage = userPage
  },
   //会员行为查看列表页
   getDepartmentPersonList (state, {departmentPerson}) {
    state.departmentPerson = departmentPerson
  },
}

const actions = {
  /** 会员列表 */
  getUserPage (context, params) {
    Api.selectUserInfoList(params).then(res => {
      context.commit('getUserPage', {userPage: res})
    }).catch(err=>{
    })
  },
   /** 会员列表 */
   getDepartmentPersonList (context, params) {
    Api.getUserListByOrgId(params).then(res => {
      context.commit('getDepartmentPersonList', {departmentPerson: res})
    }).catch(err=>{
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
