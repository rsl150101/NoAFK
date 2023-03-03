const express = require('express');
const ApiController = require('../controllers/api.controller');

const router = express.Router();
const apiController = new ApiController();

// 소셜로그인
const passport = require('passport');

router.post('/auth/join', apiController.join);
router.post('/auth/login', apiController.login);
router.get('/auth/logout', apiController.logout);

// 카카오 소셜로그인
router.get('/auth/kakao', passport.authenticate('kakao'));

//? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
router.get(
  '/auth/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/login', // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  apiController.socialLogin
);

module.exports = router;
