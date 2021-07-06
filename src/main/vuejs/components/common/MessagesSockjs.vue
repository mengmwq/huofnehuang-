<template>
  <div></div>
</template>
<script>
// 安装并引入相关模块
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Util from '@/utils/'
export default {
  data() {
    const jwt = JSON.parse(sessionStorage.getItem(jwt));
    return {
      dataList: [],
      userId: jwt.id,
      currentRoleId: jwt.currentRoleId
    };
  },
  mounted: function() {
    this.initWebSocket();
  },
  beforeDestroy: function() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    initWebSocket() {
      /**
       *  接收消息需要用户ID,只普通用户接收服务器推送的消息
       */
      if (this.userId && !this.currentRoleId) {
        this.connection();
        let self = this; // 断开重连机制,尝试发送消息,捕获异常发生时重连
        this.timer = setInterval(() => {
          try {
            self.stompClient.send("test");
          } catch (err) {
            console.log("断线了: " + err);
            self.connection();
          }
        }, 5000);
      }
    },
    removeTab(targetName) {
      console.log(targetName);
    },
    connection() {
      // 建立连接对象
      //this.socket = new SockJS("http://demo.fuhuideng.org/rtc");//连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息 // 获取STOMP子协议的客户端对象
      this.socket = new SockJS("https://www.zirandeendian.cn/proxy/rtc"); //与苏苏联调通的测试地址
      this.stompClient = Stomp.over(this.socket); // 定义客户端的认证信息,按需求配置
      var headers = {
        login: "mylogin",
        passcode: "mypasscode", // additional header
        "client-id": "my-client-id"
      }; // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          this.stompClient.subscribe("/topic/notifyMsg/" + this.userId, msg => {
            const messageObj = JSON.parse(msg.body);
            // 订阅服务端提供的某个topic
            /**
             *  第一种文案
             */
            this.$notify({
              title: '消息提示',
              onClick: ()=>{
                this.showMessageDetails(messageObj)
              },
              message: messageObj.title, // msg.body存放的是服务端发送给我们的信息
              
            })
          });
        },
        err => {}
      );
    },
    showMessageDetails(row) {
      this.$emit("showMessageDetails", row)
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    }
  }
};
</script>