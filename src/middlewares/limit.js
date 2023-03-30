const rateLimit = require('express-rate-limit');

const postProjectLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 1,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { postProjectLimiter };
