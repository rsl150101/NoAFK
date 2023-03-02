const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { userNotFound } = require('../static/js/customError');

/* env */
dotenv.config();

module.exports = async (req, res, next) => {
  try {
    // accessToken 들고오기
    const { accessToken } = req.cookies;

    console.log(accessToken, 'jasdfjklsdjfkljdslkfjklsdjfjsdk');

    // accessToken 없음
    if (!accessToken) {
      return res.status(401).json({ message: '로그인 후 이용가능합니다.' });
    }

    const { id } = jwt.verify(accessToken, process.env.KAKAO_SECRET);

    const user = await User.findByPk(id).then((user) => {
      res.locals.user = user;
      next();
    });

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
