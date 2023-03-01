const UserService = require('../services/users.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//joi
const { joinDataValidation } = require('../static/js/joi');

class ApiController {
  userService = new UserService();
  // 회원가입(id 동일하면 안됨!)
  join = async (req, res, next) => {
    try {
      const userInfo = await joinDataValidation.validateAsync(req.body);

      const { status, message } = await this.userService.createUser(userInfo);

      res.status(status).json({ message });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errorMessage: '회원가입이 실패하였습니다' });
    }
  };

  // 로그인
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findByEmail(email);

      const passwordTest = await bcrypt.compare(password, user[0].password);
      if (user.length === 0 || !passwordTest) {
        return res
          .status(401)
          .json({ errorMessage: '사용자가 없거나 비밀번호가 틀렸습니다.' });
      }

      const accessToken = jwt.sign(
        {
          id: user[0].id,
          email: user[0].email,
          nickname: user[0].nickname,
        },
        process.env.KAKAO_SECRET,
        { expiresIn: '1d' }
      );

      // 쿠키에 토큰 담아서 보내기
      // res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
      res.cookie('accessToken', accessToken);

      return res.status(200).json({ message: '로그인 성공.' });
    } catch (error) {
      return res.status(400).json({ errorMessage: '로그인 실패.' });
    }
  };

  //로그아웃
  logout = async (req, res) => {
    res.clearCookie('accessToken');
    // 카카오소셜로그인 쿠키
    // res.clearCookie('connect.sid');
    return res.json({ message: '로그아웃 성공.' });
  };
}

module.exports = ApiController;
