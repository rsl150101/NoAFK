const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UserNotFound } = require('../utility/customError');

// 로그인이 되어있는지 확인
const notLogin = async (req, res, next) => {
  try {
    // cookie 들고오기
    const { cookie } = req.headers;

    // cookie 없음
    if (!cookie) {
      return next();
    }

    let [authType, authToken] = cookie.split('=');

    // 소셜로그인 인증
    if (authToken.includes('connect.sid')) {
      authToken = authToken.split(';')[0];
    }

    if (!authToken || authType !== 'accessToken') {
      return next();
    }

    const { id } = jwt.verify(authToken, process.env.KAKAO_SECRET);

    const user = await User.findByPk(id);

    // 해당하는 회원이 존재하지 않을 때
    if (!user) {
      const error = new UserNotFound();
      return res.status(401).json({ message: error.message });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie('accessToken');
    res.clearCookie('connect.sid');
    return;
  }
};

module.exports = { notLogin };
