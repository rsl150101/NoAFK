const redis = require('redis');

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});

// 확인용
redisClient.on('connect', () => {
  console.log('Redis connected!');
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

redisClient.connect();

module.exports = redisClient;
