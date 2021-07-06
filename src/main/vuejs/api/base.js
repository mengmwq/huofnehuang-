import axios from 'axios'
//import JWT from 'jsonwebtoken'
import VueCookies from 'vue-cookies'
import { MessageBox } from 'element-ui';
const CryptoJS = require('crypto-js')
import { Loading } from 'element-ui'

let base = '/proxy'
//let base = 'http://192.168.1.163:9000'
let loading
// // 持续集成环境
// if (process.env.NODE_ENV === 'production') {
// base = 'http://localhost:9000/'
// }

export const httpClient = axios.create({
  baseURL: base,
  
  //导出excel数据量大时，1分钟下载不下来。暂时放开
  //timeout: 60000,
})
// 请求统一拦截
httpClient.interceptors.request.use(config => {
  if (VueCookies.get('jwt')) {
    let token = VueCookies.get('jwt').jwtToken;
    config.headers.common['Authorization'] = token;
    config.headers.common['jwt_token'] = token;
  }else if (sessionStorage.getItem('jwt')) {
    let token = JSON.parse(sessionStorage.getItem('jwt')).jwtToken;
    config.headers.common['Authorization'] = token;
    config.headers.common['jwt_token'] = token;
  }  
  // if (sessionStorage.getItem('jwt')) {
  //   let token = JSON.parse(sessionStorage.getItem('jwt')).jwtToken
  //   token = JWT.sign({ foo: token }, 'aplat_params')
  //   const decoded = JWT.verify(token, 'aplat_params')
  //   config.headers.common['Authorization'] = `${decoded.foo}`
  //   config.headers.common['jwt_token'] = `${decoded.foo}`
  // }
  // get参数加密
  const data = config.params
  startLoading()
  if (config.method === 'get') {
    // let param
    // if (data && JSON.parse(sessionStorage.getItem('jwt'))) {
    //   param = encrypt(data)
    //   config.params = {pushi_params: param}
    // } else {
    // }
  } /*else if (config.method === 'post') {
    config = {
      transformRequest: [function (data) {
        let ret = ''
        let isComplex = false
        for (const it in data) {
          if (typeof (data[it]) === 'object') {
            isComplex = true
            break
          }
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
        }
        if (isComplex) {
          return data
        }
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  }*/
  return config
})
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}
// GET 方法加密
function encrypt (data) {
  const JsonFormatter = {
    stringify: function (cipherParams) {
      // create json object with ciphertext
      const jsonObj = {
        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Hex)
      }
      // optionally add iv and salt
      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString()
      }
      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString()
      }
      // stringify json object
      return JSON.stringify(jsonObj)
    },
    parse: function (jsonStr) {
      // parse json string
      const jsonObj = JSON.parse(jsonStr)
      // extract ciphertext from json object, and create cipher params object
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(jsonObj.ct)
      })
      // optionally extract iv and salt
      if (jsonObj.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
      }
      if (jsonObj.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
      }
      return cipherParams
    }
  }
  const digestString = CryptoJS.MD5(JSON.parse(sessionStorage.getItem('jwt')).jwtToken, { asString: true })
  // 密码必须用Hex或其他方式处理为byte数组，如果直接使用字符串，CryptoJS会用加盐的方法重新生成密码，而且加的盐是随机数，这样在java端就没法解秘了。
  const pwd = CryptoJS.enc.Hex.parse(digestString.toString())
  // iv在java中必须为16byte长，所以js中也必须设置为相同的长度，否则加密后的结果在java中无法解密。
  const iv = CryptoJS.enc.Hex.parse('11111111111111111111111111111111')
  const setting = {iv: iv,
    // mode:CryptoJS.mode.CBC, //默认值，可以不设置
    // padding:CryptoJS.pad.Pkcs7,//同上
    format: JsonFormatter
  }
  let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), pwd, setting)
  ciphertext = JSON.parse(ciphertext.toString())
  const params = ciphertext.ct// Base64.encode(ciphertext.toString());
  return params
}

// 统一异常拦截，统一异常处理
httpClient.interceptors.response.use(response => {
  endLoading()
  return response
}, err => {
  endLoading()
  try {
    const result = err.response.data;
    const status = err.response.status;
    const ecode = result.ecode;
    //签收
    if(ecode=='SIGN000006'){
      history.go(-1);
    } else if(ecode=='SIGN000007'){
      history.go(-1);
    }
    if(ecode=='SYS000101' || ecode=='SYS000102'){
       let errorMsg ='此账号已在其他地方登录! 点击确定后将返回登录页面。';
       if(ecode =='SYS000101'){
          errorMsg ='此账号Session过期，拒绝访问，请重新登录！点击确定后将返回登录页面。'
       }
        MessageBox.alert(errorMsg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                window.open('/bk/login','_self');
              }
            });
        return;
    }
    /**
     * 未通过TOKEN认证，需要重新登录
     */
    if(ecode=='SYS000100'){
      //缓存当前地址
      const hash = location.hash?location.hash:''
      const search = location.search ?location.search:''
      localStorage.setItem('routerUrl',location.pathname+hash+search)

      MessageBox.alert(result.errorMsg, '提示信息', {
        confirmButtonText: '确定',
        callback: action => {
          //跳转到登录页
          //window.open('/','_self');
          //新版登录页
          window.open('/index','_self');
        }
      });
      return;
    }
    if (status==417) {
    
      const params = {value: result.errorMsg, type: 'error', time: new Date()}
      GLOBAL_VUE_INSTANCE.$store.dispatch('setMessageList', params)
    }
    if (status ==500 ) {
      const params = {value: result.message, type: 'error', time: new Date()}
      GLOBAL_VUE_INSTANCE.$store.dispatch('setMessageList', params)
    }
  } catch (e) {
    return Promise.reject(err)
  }
})

// 配置post请求时，后台接口数据通过@ReqeustParam获取不到适配
export const postParamConfig = {
  transformRequest: [function (data) {
    // Do whatever you want to transform the data
    let ret = ''
    let isComplex = false
    for (let it in data) {
      if (typeof (data[it]) === 'object') {
        isComplex = true
        break
      }
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    if (isComplex) return data
    return ret
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
