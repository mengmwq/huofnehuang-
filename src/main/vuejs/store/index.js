/**
 * Created by sunzleong on 2018/10/30.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Dictionary from './modules/dictionary'
import Message from './modules/message'
import Qiniu from './modules/qiniu'
import Organization from './modules/organization'
import Role from './modules/role'
import User from './modules/user'
import ResourceInfo from './modules/resourceInfo'
import tagsView from './modules/tagsView'
import SpecialUser from './modules/SpecialUser'
import notify from './modules/notify'
import stock from './modules/stock'
import approval from './modules/approval'
Vue.use(Vuex)
// 创建 store 实例
export default new Vuex.Store({
    modules: {
        dictionary: Dictionary,
        message: Message,
        organization:Organization,
        tagsView:tagsView,
        qiniu:Qiniu,
        role: Role,
        user:User,
        resourceInfo:ResourceInfo,
        specialUser:SpecialUser,
        notify:notify,
        stock:stock,
        approval:approval
    }
})
