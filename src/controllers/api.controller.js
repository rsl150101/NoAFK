const UserService = require('../services/users.service');

// joi
const {
  joinDataValidation,
  loginDataValidation,
  modifyEmailDataValidation,
  modifyNicknameDataValidation,
} = require('../utility/joi');

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
      if (error.name === 'BlackUser') {
        return res.status(403).json({ message: error.message });
      }
      if (error.name === 'UserNotFound') {
        return res.status(401).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  };

  //로그아웃
  logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    // 카카오소셜로그인 쿠키
    res.clearCookie('connect.sid');
    return res.redirect('/');
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
      await this.userService.test(id, testResult);

      return res.status(200).json({ message: '검사결과가 저장되었습니다.' });
    } catch (error) {
      return res.status(400).json({ errorMessage: '테스트 결과 저장 실패.' });
    }
  };
  // 로그인 페이지
  renderLoginPage = (req, res) => {
    return res.status(200).render('login.html', { pageTitle: 'Login' });
  };

  // 회원가입 페이지
  renderJoinPage = (req, res) => {
    return res.status(200).render('join.html', { pageTitle: 'Join' });
  };

  // 검사 페이지
  renderTestPage = async (req, res) => {
    try {
      const { id } = res.locals.user;

      res.status(200).render('test', { id, pageTitle: 'Test' });
    } catch (error) {
      return res.status(400).json({ message: '로그인 후 이용부탁드립니다.' });
    }
  };

  // 비밀번호 재발급
  resetPassword = async (req, res) => {
    try {
      const { email } = await modifyEmailDataValidation.validateAsync(req.body);

      const { status, message } = await this.userService.sendPasswordEmail(
        email
      );

      res.status(status).json({ message });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  // 이메일 중복체크
  findEmail = async (req, res) => {
    try {
      const { email } = await modifyEmailDataValidation.validateAsync(req.body);

      const { status, message } = await this.userService.findEmail(email);

      res.status(status).json({ message });
    } catch (error) {
      if (error.name === 'EmailExist') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  };

  // 닉네임 중복체크
  findNickname = async (req, res) => {
    try {
      const { nickname } = await modifyNicknameDataValidation.validateAsync(
        req.body
      );

      const { status, message } = await this.userService.findNickname(nickname);

      res.status(status).json({ message });
    } catch (error) {
      if (error.name === 'NicknameExist') {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({ message: error.message });
    }
  };

  // 이메일 인증 메일 발송
  sendEmailAuth = async (req, res) => {
    try {
      const { email } = await modifyEmailDataValidation.validateAsync(req.body);

      const { status, message, authString } =
        await this.userService.sendEmailAuth(email);

      res.status(status).json({ message, authString, status });
    } catch (error) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  };
}

module.exports = ApiController;
