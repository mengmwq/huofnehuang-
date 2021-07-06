import TimeFormat from './TimeFormat'
module.exports = {
  /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * */
   numberFormat: function(number, decimals, dec_point, thousands_sep) {
    
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      DEC = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };
  
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
  
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(DEC);
  },
  getFormatTime(time, formatter='yyyy-MM-dd hh:mm:ss') {
    return time ? TimeFormat.Format(time,formatter):''
  },
  getArrayValue(data, key) {
    for (var i = 0; i < data.length; i++) {
      if (data[i]['id'] == key) {
        return data[i]['name']
      }
    }
  },
  //数组排序（对象）升序
  arraySort(arr, attr) {
    arr.sort(function (a, b) {
      return a[attr] > b[attr] ? 1 : -1
    })
    return arr
  },
  isClearFormContent(aView, path) {
    let flag = false
    aView.forEach(item => {
      if (item.path == path) {
        flag = true
        return
      }
    })
    return flag
  },

  getDictsKeyName(row, key, value) {
    return value ? row.attached[key][value.toString()].cnInfo : ''
  },
  //导出EXCEL
  downFile(blob, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName)
    } else {
      var link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
  },
  /**
   * 去除style标签
   */
  removeStyle(content){
    let regex=/<style>[\s\S]*?<\/style>/ig;
    let newContent=content.replace(regex,"");
    return newContent
  },
  //生成随机数，长度自定义
  getRandomAlphaNum(len) {
      var rdmString = "";
      for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
      return rdmString.substr(0, len);
  },
  /*根据出生日期算出年龄*/
  getAgeByBirthday(strBirthday){       
    var returnAge;
    const newBirthday  = this.getFormatTime(strBirthday,'yyyy-MM-dd')
    var strBirthdayArr=newBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];
    
    const d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    
    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    
    return returnAge;//返回周岁年龄
  
  },
  debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
  
    const later = function() {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
  
      // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  
    return function(...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
  
      return result
    }
  },

}