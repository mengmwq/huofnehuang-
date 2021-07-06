package com.hfh.vue.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 *
 * 前端页面工程的启动类，仅生产环境下启用
 *
 * @author WanWei
 * @date 2018/10/6 上午9:10
 **/
@ComponentScan(basePackages = WebApplication.BASE_SCAN_PACKAGE)
@SpringBootApplication
public class WebApplication extends WebMvcConfigurerAdapter {

  // Spring扫描的包路径
  protected static final String BASE_SCAN_PACKAGE = "com.hfh.vue.web";

  public static void main(String[] args) {
    SpringApplication.run(WebApplication.class);
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {

    registry.addMapping("/**")
      .allowCredentials(true)
      .allowedHeaders("*")
      .allowedOrigins("*")
      .allowedMethods("*");
  }

}
