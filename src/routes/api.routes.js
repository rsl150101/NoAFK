const express = require('express');
const ApiController = require('../controllers/api.controller');
const ProjectsController = require('../controllers/projects.controller');

const router = express.Router();
const apiController = new ApiController();
const projectsController = new ProjectsController();

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

// 깃허브 소셜로그인
router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
  }),
  apiController.socialLogin
);

// 구글 소셜로그인
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  apiController.socialLogin
);

// 네이버 소셜로그인
router.get(
  '/auth/naver',
  passport.authenticate('naver', { scope: ['profile'] })
);

router.get(
  '/auth/naver/callback',
  passport.authenticate('naver', {
    failureRedirect: '/login',
  }),
  apiController.socialLogin
);

// 검사결과 저장
router.patch('/test/:id', apiController.test);

//* 프로젝트 커서 기반 페이지네이션 조회
router.get('/projects', projectsController.getCursorBasedProjects);

module.exports = router;
