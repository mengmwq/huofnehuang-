exports.install = function (Vue, options) {

  Vue.prototype.sysout= function (){//全局函数2
    alert('全局函数');
  };
};
