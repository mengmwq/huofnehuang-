package com.hfh.vue.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 忘记密码
 *
 * @author WanWei
 * @date 2018-12-29 11:15 AM
 * @param
 * @return
 **/

@Controller
@RequestMapping("/")
public class ForgetPwdController {

  // 密码找回页面
  @RequestMapping(value = "forgetPwd")
  public String toForgetPwd() {
    return "forgetPwd";
  }

}
