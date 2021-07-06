module.exports = {
  //整数或小数，小数保留1-2位
   floatNumReg:/^(-?([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
  // 台湾通行证验证
   taiwanCardReg:/^[0-9]{8}|[0-9]{10}$/,
  // 港澳通行证验证
    HKCardReg:/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,
    // 护照验证
    passportReg:/^[a-zA-Z0-9]{5,17}$/,
    // 身份证号正则
    identityCardReg: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/,
    // 手机号
    mobileReg: /^(1[3-9][0-9])[0-9]{8}$/,
    // 座机号
    telReg: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
    //电子邮件
    emailReg: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    //部门编号
    departmentCodeReg:/^[a-zA-Z0-9]{1,10}$/,
    //部门名称
    departmentNameReg:/^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/,
    //模板数据:
    countReg:/^[1-9]{1}[0-9]{0,2}$/,  //数量限定1000以内正整数
    //教师与学生姓名
    familyNameReg:/^[\u4e00-\u9fa5\.A-Za-z0-9]{2,20}$/,  //由2-20个中文、数字、字母或或.构成
    //模板名称
    nameValReg:/^[0-9\u4e00-\u9fa5]{2,8}$/, //由2-8个中文或数字字符
    //分值
    scoreValueReg:/^([1-9][0-9]{0,2}|[0])([.]{1}[0-9]{1,2})?$/,   //限定1000以内，允许有2位小数"

    isCardNo:function(value){
      //位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
      //出生日期1800-2099 (18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])
      return !value.match(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/);
    },
    isOpenBankCode:function(value){
      //兴业银行开户行
      return !value.match(/^((966666)\d{12})|((622908423|622909423|622908426|622909426)\d{9})$/);
    },
    isMobile: function(value) {
      return !value.match(/^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/);
    },
    isTelephone: function(value) {
      return !value.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(0\d{2,3})?(\d{7,8})(-(\d{3,}))?$/);
    },
    isNumber:function(value){
       return value.match(/^[1-9]([0-9]+)?$/);
    },
    isCustomerName:function(value){
       return value.match(/^[\u4e00-\u9fa5]{1,6}$/);
    },
    isCarNo:function(value){
      //车牌号
       return value.match(/^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z0-9]{5}$/);
    },
    isOrgName:function(value){
      return value.match(/^[\u4e00-\u9fa5]{2}$/);
    },
    isChinese:function(value){
      return value.match(/^[\u4e00-\u9fa5]{2,}$/);
    }
};
