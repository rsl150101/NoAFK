const rateLimit = require('express-rate-limit');

const postProjectLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 1,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// 공용 1분에 5번
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    // 제한 초과 시 콜백 함수
    res.status(this.statusCode).json({
      status: this.statusCode,
      message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    });
  },
});

module.exports = {
  postProjectLimiter,
  loginLimiter,
  apiLimiter,
};
