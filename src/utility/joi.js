const joi = require('joi');

//join
const joinDataValidation = joi.object({
  email: joi.string().email().required(),
  // 최소 8자 이상으로 영문자 소문자, 숫자, 특수문자가 각각 최소 1개 이상
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(new RegExp('^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
    .required(),
  nickname: joi
    .string()
    .min(1)
    .max(20)
    .pattern(new RegExp('^[A-za-z0-9가-힣]*$'))
    .required(),
});

//login
const loginDataValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

//modify
const modifyPasswordDataValidation = joi.object({
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(new RegExp('^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
    .required(),
})
const modifyNicknameDataValidation = joi.object({
  nickname: joi
  .string()
  .min(1)
  .max(20)
  .pattern(new RegExp('^[A-za-z0-9가-힣]*$'))
  .required(),
})

module.exports = {
  joinDataValidation,
  loginDataValidation,
  modifyPasswordDataValidation,
  modifyNicknameDataValidation,
};
