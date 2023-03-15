const UserService = require('../services/users.service');

// joi
const { joinDataValidation, loginDataValidation } = require('../utility/joi');

// customError
const { AlreayLogin } = require('../utility/customError');

// 소셜로그인
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class ApiController {
  userService = new UserService();

  // 회원가입
  join = async (req, res) => {
    try {
      const userInfo = await joinDataValidation.validateAsync(req.body);

      const { status, message } = await this.userService.createUser(userInfo);

      res.status(status).json({ message });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // 로그인
  login = async (req, res) => {
    try {
      const userInfo = await loginDataValidation.validateAsync(req.body);

      const { accessToken, refreshToken } = await this.userService.login(
        userInfo
      );

      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);

      return res.status(200).json({ message: '로그인 성공' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  //로그아웃
  logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    // 카카오소셜로그인 쿠키
    res.clearCookie('connect.sid');
    return res.json({ message: '로그아웃 성공.' });
  };

  // 소셜로그인
  socialLogin = async (req, res) => {
    const { id, email, nickname } = req.user;

    const { accessToken, refreshToken } = await this.userService.socialLogin(
      id,
      email,
      nickname
    );

    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    res.redirect('/');
  };

  // 검사결과 저장
  test = async (req, res) => {
    try {
      const { id } = req.params;
      const { testResult } = req.body;
      // MBTI 결과가 존재할 경우 에러 발생. 중복 검사 방지
      if (testResult.length === 4) {
        throw error;
      }
      await this.userService.test(id, testResult);

      return res.status(200).json({ message: '검사결과가 저장되었습니다.' });
    } catch (error) {
      return res.status(400).json({ errorMessage: '테스트 결과 저장 실패.' });
    }
  };
  // 로그인 페이지
  renderLoginPage = (req, res) => {
    if (res.locals.user) {
      const error = new AlreayLogin();
      res.status(403).json({ message: error.message });
      return res.redirect('/'); // 임시구현 => home으로
    }

    const pageTitle = '로그인';
    return res.status(200).render('login.html', { pageTitle });
  };

  // 회원가입 페이지
  renderJoinPage = (req, res) => {
    if (res.locals.user) {
      const error = new AlreayLogin();
      res.status(403).json({ message: error.message });
      return res.redirect('/'); // 임시구현 => home으로
    }

    const pageTitle = '회원가입';
    return res.status(200).render('join.html', { pageTitle });
  };

  // 검사 페이지
  renderTestPage = (req, res) => {
    return res.status(200).render('test');
  };
}

module.exports = ApiController;
