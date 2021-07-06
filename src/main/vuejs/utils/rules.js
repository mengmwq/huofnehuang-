import ValidForm from './ValidForm'

module.exports = {
  required: { required: true, message: '不能为空' },
  email: { pattern: ValidForm.emailReg, message: '请输入正确的电子邮件' },
  mobile: { pattern: ValidForm.mobileReg, message: '请输入正确手机号' },
  tel: { required:true, message: '请输入联系电话！' },
  floatNum:{pattern:ValidForm.floatNumReg, message:'请正确输入数值（小数点保留2位）'},
  contractTargetType: { required: true, message: '不能为空' },
  contractTargetId: { required: true, message: '不能为空' },
  telephone:{  required: true, message: '请输入座机号码',trigger:'blur' },
  contactName:{  required: true, message: '请输入主要联系人',trigger:'blur' },
  contactTel:{  required: true, message: '请输入联系人电话',trigger:'blur' },
  contactPosition:{  required: true, message: '请输入联系人岗位',trigger:'blur' },
};
