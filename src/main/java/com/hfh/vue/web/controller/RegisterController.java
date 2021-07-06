package com.hfh.vue.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 注册
 *
 * @author WanWei
 * @date 2018-12-29 11:17 AM
 * @param
 * @return
 **/
@Controller
@RequestMapping("/")
public class RegisterController {

	// 密码找回页面
  @RequestMapping(value = "signup")
  public String register() {
    return "signup";
  }
}
