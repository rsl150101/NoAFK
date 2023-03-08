const jwt = require('jsonwebtoken');
const { User } = require('../models');
const {
  UserNotFound,
  RefreshTokenNotFound,
  TokenExpired,
} = require('../utility/customError');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.KAKAO_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return null;
    }
  }
};

const checkToken = async (req, res, next) => {
  try {
    // cookie 들고오기
    const { cookie } = req.headers;

    // cookie 없음
    if (!cookie) {
      return res.render('login.html');
    }

    let accessToken = '';
    let refreshToken = '';

    let cookieList = cookie.split(' ');
    cookieList.map((a) => {
      if (a.includes('accessToken')) {
        let [authType, authToken] = a.split('=');
        accessToken = authToken.split(';')[0];
      }
      if (a.includes('refreshToken')) {
        let [authType, authToken] = a.split('=');
        refreshToken = authToken.split(';')[0];
      }
    });

    const checkAccess = verifyToken(accessToken);
    const checkRefresh = verifyToken(refreshToken);

    if (checkAccess === null) {
      if (checkRefresh === null) {
        // case1: access token과 refresh token 모두만료
        const error = new TokenExpired();
        return res.status(401).json({ message: error.message });
      }
      // case2: access token은 만료됐지만, refresh token은 유효한 경우 => 새로 accessToken 발급
      let userId = checkRefresh.id;
      let { id, email, nickname } = await User.findAll({
        where: { id: userId },
      });

      const newAccessToken = jwt.sign(
        {
          id,
          email,
          nickname,
        },
        process.env.KAKAO_SECRET,
        {
          expiresIn: '2h',
        }
      );
      res.cookie('accessToken', newAccessToken);
    } else {
      if (checkRefresh === null) {
        // case3: access token은 유효하지만, refresh token은 만료된 경우 => 새로 refreshToken 발급
        let id = checkAccess.id;

        const newRefreshToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
          expiresIn: '14d',
        });

        res.cookie('refreshToken', newRefreshToken);

        await User.update(
          { refreshToken: newRefreshToken },
          {
            where: { id },
          }
        );
      }
    }

    let { id } = verifyToken(accessToken);
    const user = await User.findByPk(id);

    // 해당하는 회원이 존재하지 않을 때
    if (!user) {
      const error = new UserNotFound();
      return res.status(401).json({ message: error.message });
    }

    // 저장된 refreshToken 이 아닌 경우
    if (refreshToken !== user.refreshToken) {
      const error = new RefreshTokenNotFound();
      res.status(401).json({ message: error.message });
      return res.render('login.html');
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie('connect.sid');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.render('login.html');
  }
};

module.exports = { checkToken };
