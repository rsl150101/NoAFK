const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { userNotFound } = require('../static/js/customError');

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

    if (!authToken || authType !== 'accessToken') {
      return next();
    }

    const { id } = jwt.verify(authToken, process.env.KAKAO_SECRET);

    const user = await User.findByPk(id);

    // 해당하는 회원이 존재하지 않을 때
    if (!user) {
      const error = new userNotFound();
      return res.status(401).json({ message: error.message });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie('accessToken');
    return res.status(401).json({ message: '로그인 후 이용가능합니다.' });
  }
};

module.exports = { notLogin };
