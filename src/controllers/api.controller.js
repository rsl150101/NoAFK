const UserService = require('../services/users.service');

//joi
const { joinDataValidation, loginDataValidation } = require('../static/js/joi');

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
    const accessToken = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        nickname: req.user.nickname,
      },
      process.env.KAKAO_SECRET,
      {
        expiresIn: '1d',
      }
    );
    res.cookie('accessToken', accessToken);
    res.redirect('/');
  };
}

module.exports = ApiController;
