const UserService = require('../services/users.service');

//joi
const { joinDataValidation, loginDataValidation } = require('../utility/joi');

// 소셜로그인
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class ApiController {
  userService = new UserService();
  // 회원가입(id 동일하면 안됨!)
  join = async (req, res) => {
    try {
      const userInfo = await joinDataValidation.validateAsync(req.body);

      const { status, message } = await this.userService.createUser(userInfo);

      res.status(status).json({ message });
    } catch (error) {
      res.status(400).json({ errorMessage: '회원가입이 실패하였습니다' });
    }
  };

  // 로그인
  login = async (req, res) => {
    try {
      const userInfo = await loginDataValidation.validateAsync(req.body);

      const { status, accessToken } = await this.userService.login(userInfo);

      res.cookie('accessToken', accessToken);
      return res.status(status).json({ accessToken });
    } catch (error) {
      return res.status(400).json({ errorMessage: '로그인 실패.' });
    }
  };

  //로그아웃
  logout = async (req, res) => {
    res.clearCookie('accessToken');
    // 카카오소셜로그인 쿠키
    res.clearCookie('connect.sid');
    return res.json({ message: '로그아웃 성공.' });
  };

  // 소셜로그인
  socialLogin = async (req, res) => {
    const { id, email, nickname } = req.user;

    const accessToken = jwt.sign(
      {
        id,
        email,
        nickname,
      },
      process.env.KAKAO_SECRET,
      {
        expiresIn: '1d',
      }
    );
    res.cookie('accessToken', accessToken);
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

      return res.status(200).json({ message: "검사결과가 저장되었습니다." });
    } catch (error) {
      return res.status(400).json({ errorMessage: '테스트 결과 저장 실패.' });
    }
  }
}

module.exports = ApiController;
