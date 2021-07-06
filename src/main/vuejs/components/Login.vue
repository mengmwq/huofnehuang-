<template>
  <div id="app">
    <el-row style="font-size: 18px;padding: 0 40px;">
      <el-col :span="12">
        <img style="width: 80px;display: inline-block;" src="../assets/test/img/dolphin-small.png">
        <img style="display: inline-block;height: 40px;width:112px;position:absolute;left:120px;top:20px;" src="../assets/test/img/icon-name.png">
      </el-col>
      <el-col :span="12" style="text-align: right;height: 79px;line-height: 79px;">
        <span style="margin-right: 20px;cursor: pointer;">
          <router-link :to="{path:'/'}">首页</router-link>
        </span>
        <span style="color: #0071bc;cursor: pointer;">
          <router-link :to="{path:'/router/DownloadApp'}">APP下载</router-link>
        </span>
      </el-col>
    </el-row>
    <div style="height: 20px;background-color: #CDD7E3"></div>
    <template>
      <div class="login" style="top: 0;">
        <div class="kiang" style="top: 40%;">
          <div class="my-center-outer">
            <div class="my-center">
              <div class="my-center-left">
                <img src="../assets/test/img/dolphin-big.png" alt="" style="margin-left: 36px; width:188px;height:186px;"/>
                <img src="../assets/test/img/platform_name.png"  alt=""/>
              </div>
              <div class="my-center-right">
                <el-row class="my-tab">
                  <el-col :span="12">
                    <span :class="{'my-active': !scanCodeLogin}" @click="scanCodeLogin=false">密码登录</span>
                  </el-col>
                  <el-col :span="12">
                    <span :class="{'my-active': scanCodeLogin}" @click="scanCodeLogin=true">扫码登录</span>
                  </el-col>
                </el-row>

                <!-- 密码登录 -->
                <el-form v-if="!scanCodeLogin" ref="AccountFrom" :model="account" :rules="rules">
                  <el-form-item prop="username">
                    <div class="my-form-label">登陆账号&nbsp;：</div>
                    <el-input class="my-input" type="text" :maxlength=16 v-model.trim="account.username"
                              v-on:keyup.enter.native="handleLogin" placeholder=""></el-input>
                  </el-form-item>
                  <el-form-item prop="pwd">
                    <div class="my-form-label">登陆密码&nbsp;：</div>
                    <el-input class="my-input" type="password" :maxlength=16 v-model.trim="account.pwd"
                              v-on:keyup.enter.native="handleLogin" placeholder=""></el-input>
                  </el-form-item>
                  <!--<div class="yzm" v-if="errorCount > 2">-->
                  <!--<el-form-item prop="verifyCode">-->
                  <!--<el-input type="text"  maxlength=4 v-model="account.verifyCode" v-on:keyup.enter.native="handleLogin" auto-complete="off" placeholder="请输入验证码"  class="fl"></el-input>-->
                  <!--<img :src="verifyImg" @click="getVerifyImg" class="yzm_img fr" alt="yzm" />-->
                  <!--</el-form-item>-->
                  <!--</div>-->
                  <el-row style="margin-top: 20px;">
                    <el-col :span="12">
                      <el-checkbox checked="checked" v-model="autologin" class="remember">记住我的账号</el-checkbox>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                      <span class="text-decoration" style="margin-right: 20px;">
                        <router-link :to="{path:'/router/ForgetPassword'}">忘记密码</router-link>
                      </span>
                      <span class="text-decoration">
                        <router-link :to="{path:'/router/Register'}">注册</router-link>
                      </span>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" style="margin-top: 40px;">
                    <el-col :span="12">
                      <el-button type="primary" v-on:click.native.prevent="handleLogin" v-bind:loading="logining">登录
                      </el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-button type="primary">取消</el-button>
                    </el-col>
                  </el-row>
                </el-form>

                <!-- 扫码登录 -->
                <div v-if="scanCodeLogin">
                  <div style="font-size: 13px;padding: 30px 20px 20px 20px;text-align: center;">
                    <img :src="captchaImageUrl"
                         style="width: 120px;margin-left: 98px;margin-bottom: 10px;">
                    <div>打开爱引航APP扫一扫登录</div>
                  </div>
                  <el-row style="margin-top: 13px;text-align: center;">
                    <el-col :span="12">
                      <span class="text-decoration">下载爱引航APP</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="text-decoration">免费注册</span>
                    </el-col>
                  </el-row>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="login_bottom">
      <div>©Copyright 2018. All Rights Reserved.</div>
    </div>
  </div>
</template>

<script>
  import * as loginApi from '../api/LoginApi';

  export default {
    data: function () {
      const usernameVal = localStorage.getItem('username');
      const username = usernameVal ? usernameVal : '';
      let oErrorCount = sessionStorage.getItem("errorCount");
      oErrorCount = oErrorCount ? parseInt(oErrorCount) : 0;
      return {
        /** 是否为扫码登录 */
        scanCodeLogin: false,
        logining: false,
        autologin: true,
        /** 扫码是否成功 */
        scanSuccess: false,
        /** 验证码图片URL */
        captchaImageUrl: '',
        account: {
          username: username,
          pwd: ''
        },
        errorCount: oErrorCount,
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      //警告信息
      alertInfo(msg) {
        this.$message(msg);
      },
      //处理登录
      handleLogin() {
        this.$refs.AccountFrom.validate((valid) => {
          if (valid) {
            if (this.autologin) {
              localStorage.setItem('username', this.account.username);
            }
            this.logining = true;
            let _this = this;
            let loginParams = {
              userName: this.account.username,
              password: this.account.pwd
            };

            loginApi.login(loginParams).then(data => {
              console.log('login',data)
              _this.logining = false;
              if (data && data.userId) {
                //暂存用户信息，包括机构、角色权限等信息
                sessionStorage.setItem('who', JSON.stringify(data));
                //页面跳转
                this.$router.push({
                  path:'/router/ShipGenerationDatabase'
                })
                //window.open('/router/CompanyAccountInfo', '_self');
                //恢复登录按钮显示
                _this.errorCount = 0;
                sessionStorage.removeItem("errorCount");
              } else {
                _this.$message({
                  message: '用户名或密码不正确',
                  type: 'error'
                });
              }
            }).catch(data => {
              _this.$message({
                message: '用户名或密码不正确',
                type: 'error'
              });
              //恢复登录按钮显示
              _this.logining = false;
            })
          }
        });
      },
      // 生成验证码图片url 为了实现过期后更新图片
      generateCaptchaImageUrl() {
        const url = 'http://platform.smartpilot.cn/qrcode?t=';
        this.captchaImageUrl = url + new Date().getTime();
      },
      // 轮询获取是否扫码成功和是否确认登录
      loopGetLoginStatus() {
        const self = this;
        setInterval(() => {
          loginApi.loopGetLoginStatus().then(data => {
            if (data) {
              self.scanSuccess = data.scanState
              if (data.loginState) {
                // 扫码成功且确认登录
                self.$router.push({
                  path:'/router/ShipGenerationDatabase'
                })
              }
            }
          })
        }, 5000);

      }
    },
    mounted() {
      this.generateCaptchaImageUrl()
      this.loopGetLoginStatus()
    }
  }
</script>

<style scoped>
  .login_bottom {
    height: 60px !important;
    line-height: 60px;
  }

  .my-center-outer {
    padding: 7px;
    background-color: #76BDF8;
    float: left;
  }

  .my-center {
    padding: 40px 30px;
    background-color: #fff;
    float: left;
  }

  .my-center-left {
    height: 260px;
    float: left;
    padding-right: 20px;
  }

  .el-button {
    color: #fff;
    width: 100%;
  }

  .text-decoration {
    color: #0471BE;
    text-decoration: underline;
    cursor: pointer;
    font-size: 15px;
    display: inline-block;
  }

  .el-form-item {
    margin-top: 20px;
    margin-bottom: 0;
  }

  .my-form-label {
    text-align: left;
    vertical-align: middle;
    float: left;
    font-size: 16px;
  }

  .my-input {
    width: 270px;
  }

  .el-input__inner {
    border: 1px solid #E9EBEC;
    background-color: #F2F2F2;
  }

  .my-center-right {
    padding-left: 30px;
    width: 388px;
    font-size: 18px;
    float: left;
    min-height: 260px;
    border-left: 2px dashed #DCDDE1;
  }

  .my-tab {
    text-align: center;
  }

  .my-tab span {
    padding-bottom: 10px;
    border-bottom: 3px solid #CCCCCC;
    cursor: pointer;
    width: 100%;
    display: inline-block;
  }

  .my-tab .my-active {
    border-bottom: 3px solid #0071BD;
  }

  .login {
    background-size: 100% 100%!important;
    background: url(../assets/test/img/login_bg.jpg) no-repeat;
  }
</style>
