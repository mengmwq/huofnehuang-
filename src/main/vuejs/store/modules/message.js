/**
 * Created by sunzelong on 2017/9/30.
 */
import * as types from '../mutation-types'

let t = null;

const state = {
  messageList : [],
  messageAlertList : [],
  messageAlertCount : 0,
  messageObj:null
}
// getters
const getters = {
    setMessageList: state => state.messageObj,
}
// actions
const actions = {
  setMessageList ({ commit, state }, params) {

    const messageList = this.messageList && this.messageList.length > 0 ? this.messageList : [];
    messageList.push(params);
    this.messageList = messageList;
    let messageAlertList = this.messageAlertList && this.messageAlertList.length > 0 ? this.messageAlertList : [];
    messageAlertList.splice(0, 0, params);
    this.messageAlertList = messageAlertList;

    let messageAlertCount = this.messageAlertCount ? this.messageAlertCount : 0;
    messageAlertCount += 1;
    this.messageAlertCount = messageAlertCount;

    t = setTimeout(function () {
      this.messageAlertList.splice(messageAlertList.length-1, 1);
      messageAlertList = this.messageAlertList;
      //this.commit(types.SET_MESSAGE_LIST, {messageList})
    }.bind(this), 3000);

    const messageObj = {
      'messageList':messageList,
      'messageAlertList':messageAlertList,
      'messageAlertCount':messageAlertCount
    };
    console.log(messageObj);
    this.commit(types.SET_MESSAGE_LIST, {messageObj});

  },
  //清空消息
  cleanMessageList: function () {
    this.messageList = [];
    this.messageAlertCount = 0;
    this.messageAlertList = [];
    clearTimeout(t);
    const messageObj = {
      'messageList':[],
      'messageAlertList':[],
      'messageAlertCount':0
    };
    this.commit(types.SET_MESSAGE_LIST, {messageObj});
  },
  cleanMessageAlertCount: function () {
    this.messageAlertCount = 0;
    const messageObj = {
      'messageList':this.messageList,
      'messageAlertList':this.messageAlertList,
      'messageAlertCount':0
    };
    this.commit(types.SET_MESSAGE_LIST, {messageObj});
  },

}
// mutations
const mutations = {
  [types.SET_MESSAGE_LIST] (state, {messageObj}) {
    state.messageObj = messageObj;
  },

}
export default {
  state,
  getters,
  actions,
  mutations
}
