const jwt = require('jsonwebtoken');
const { User } = require('../models');

// customError
const {
  UserNotFound,
  RefreshTokenNotFound,
  TokenExpired,
} = require('../utility/customError');

// redis
const redisClient = require('../utility/redis');
const { promisify } = require('util');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.KAKAO_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return null;
    }
  }
};

// 로그인되어 있을 때, 로그인, 회원가입페이지로 못 넘어가도록하는 미들웨어
const checkLogin = async (req, res, next) => {
  try {
    // cookie 들고오기
    const { cookie } = req.headers;

    if (cookie && cookie.includes('Token')) {
      return res.status(403).redirect('back');
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 토큰검증 미들웨어
const checkToken = async (req, res, next) => {
  try {
    // cookie 들고오기
    const { cookie } = req.headers;

    // cookie 없음
    if (!cookie) {
      return next();
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
        throw error;
      } else {
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
            expiresIn: '6h',
          }
        );
        res.cookie('accessToken', newAccessToken);
      }
    } else {
      if (checkRefresh === null) {
        // case3: access token은 유효하지만, refresh token은 만료된 경우 => 새로 refreshToken 발급
        let id = checkAccess.id;

        const newRefreshToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
          expiresIn: '14d',
        });

        res.cookie('refreshToken', newRefreshToken);
        redisClient.set(id, refreshToken);
      }
    }

    let { id } = verifyToken(accessToken);
    const user = await User.findByPk(id);

    // 해당하는 회원이 존재하지 않을 때
    if (!user) {
      const error = new UserNotFound();
      throw error;
    }

    // redis에 저장된 refreshToken과 비교
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = promisify(redisClient.get).bind(redisClient);
    const redisRefresh = await getAsync(id); // refresh token 가져오기

    if (refreshToken !== redisRefresh) {
      const error = new RefreshTokenNotFound();
      throw error;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie(undefined);
    return res.render('login.html');
  }
};

module.exports = { checkToken, checkLogin };
