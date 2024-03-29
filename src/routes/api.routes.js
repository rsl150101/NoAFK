const express = require('express');
const ApiController = require('../controllers/api.controller');
const ProjectsController = require('../controllers/projects.controller');
const CommentsController = require('../controllers/comments.controller');
const TeamsController = require('../controllers/teams.controller');

const router = express.Router();
const apiController = new ApiController();
const projectsController = new ProjectsController();
const commentsController = new CommentsController();
const teamsController = new TeamsController();

// 소셜로그인
const passport = require('passport');

// 미들웨어
const { checkToken } = require('../middlewares/auth');
const { loginLimiter, apiLimiter } = require('../middlewares/limit');

router.post('/auth/join', apiLimiter, apiController.join);
router.post('/auth/login', loginLimiter, apiController.login);
router.get('/auth/logout', apiLimiter, apiController.logout);

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
router.get('/projects', checkToken, projectsController.getCursorBasedProjects);

//* 댓글 커서 기반 페이지네이션 조회
router.get('/projects/:id/comments', commentsController.getComments);

//* 팀 커서 기반 페이지네이션 조회
router.get('/teams', teamsController.getTeams);

// 비밀번호 초기화
router.post('/reset-password', apiLimiter, apiController.resetPassword);

// 이메일 중복체크
router.post('/find-email', apiLimiter, apiController.findEmail);

// 닉네임 중복체크
router.post('/find-nickname', apiLimiter, apiController.findNickname);

// 이메일 인증 메일 발송
router.post('/auth/send-email', apiLimiter, apiController.sendEmailAuth);

// 모집공고 마감
router.patch(
  '/projects/:id',
  checkToken,
  apiLimiter,
  projectsController.endProjectApply
);

module.exports = router;
