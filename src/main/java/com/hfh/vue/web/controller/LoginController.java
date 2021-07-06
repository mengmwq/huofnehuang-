package com.hfh.vue.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 导向登录页
 * @author WanWei
 * @date 2018/10/6 上午9:42
 **/
@Controller
@RequestMapping("/")
public class LoginController {

  // 管理端登录页面
  @RequestMapping(value = "manager/login")
  public String toLogin() {
    return "managerLogin";
  }


  // 义工登录页
  @RequestMapping(value = "login")
  public String volunteer() {
    return "login";
  }

  // 首页，无需登录
  @RequestMapping(value = "/")
  public String root() {
    return "redirect:login";
  }

  //会员登录
//  @RequestMapping(value = "signin")
//  public String signin() {
//    return "signin";
//  }

}
