module.exports = {
  //时间格式化
  Format: function(date,fmt) { //author: meizz
    let showValue = '';
    if(date){
      date = new Date(date);
      showValue = fmt;
      const o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3) //季度
        //'S': date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(showValue)) {
        showValue = showValue.replace(RegExp.$1, (`${date.getFullYear()}${''}`).
        substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(showValue)) {
          showValue = showValue.replace(RegExp.$1, (RegExp.$1.length === 1) ?
            (o[k]) : ((`00${o[k]}`).substr((`${''}${o[k]}`).length)));
        }
      }
    }    
    return showValue;
  },
  //时间差
  getIntervalText(time) {
    const now = new Date().getTime();
    const diffMin = Math.floor((now - time) / (1000 * 60));
    if (diffMin < 1) {
      return '刚刚';
    } else if (diffMin >= 1 && diffMin <= 59) {
      /*if (diffMin === 3) {
        return '泡一碗面的时间之前';
      } else*/ if (diffMin === 15) {
        return '一刻钟前';
      } else if (diffMin === 30) {
        return '半小时前';
      } else {
        return `${diffMin}分钟前`;
      }
    } else {
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour >=1 && diffHour <= 23) {
        return `${diffHour}小时前`;
      } else {
        const diffDay = Math.floor(diffHour / 24);
        return `${diffDay}天前`;
      }

    }
  },
  //string - > Date
  stringToDate(string,flag) {
    const value =  new Date(string);
    let newdate;
    if (flag === 'start') {
      newdate = new Date(value.getFullYear().toString(),value.getMonth(),value.getDate(),'00','00','00');
    } else if (flag === 'end') {
      newdate = new Date(value.getFullYear().toString(),value.getMonth(),value.getDate(),'23','59','59');
    }
    return newdate;
  }
};
