import { httpClient, httpClient2 } from './base.js'

// 获取登录验证码
export const getVerifyImg = params => {
    // console.log(JSON.stringify(params));
  return httpClient.get(`getImageVerifyCode`);
};

/**
 * 登录页面点击登录调用接口
 POST  /api/user/users/check
 * */
export const login = params => {
  return httpClient.post(`user/check`,  params).then(ret => ret.data);
};

/**
 * 轮询获取是否扫码成功和是否确认登录
 */
export const loopGetLoginStatus = params => {
  return httpClient2.get(`/loginByQrcode`).then(ret => ret.data);
};
/**
 * 获取验证码
 * post  /sms/getVerifyCode
 * */
export const getVerifyCode = param => {
  return httpClient.post(`/sms/getVerifyCode`, param).then(ret => ret.data);
};
/**
 * 使用验证码修改密码
 * post  /updatePasswordByMobile
 * */
export const updatePasswordByMobile = param => {
  return httpClient.post(`/updatePasswordByMobile`, param).then(ret => ret.data);
};
/**
 * 退出登录
 * get  /logout
 * */
export const logout = () => {
  return httpClient.get(`/logout`, {'jwt_token': null}).then(ret => ret.data);
};

