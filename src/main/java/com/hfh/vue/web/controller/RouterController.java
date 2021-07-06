package com.hfh.vue.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * 处理由于手动刷新界面导致vue router配置的URL请求 发送至server端
 *
 * @author WanWei
 * @date 2016-4-29 上午8:49:54
 */
@Controller
@RequestMapping({"/router", "/index"})
public class RouterController {

	/**
	 * Vue的路由都重定向到系统home主页
	 *
	 * @return
	 * @author WanWei
	 * @date 2016-4-29 上午9:01:47
	 */
	@RequestMapping(value = "/**", method = RequestMethod.GET)
	public ModelAndView redirectToBase() {
		ModelAndView modelAndView = new ModelAndView("home");
		return modelAndView;
	}
}
