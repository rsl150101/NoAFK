const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

require('dotenv').config();

module.exports = (app) => {
  app.use(passport.initialize()); // passport를 초기화 하기 위해서 passport.initialize 미들웨어 사용

  /*로그인 성공시 사용자 정보를 Session에 저장한다*/
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  /*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  /*카카오로그인*/
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
        clientSecret: process.env.KAKAO_SECRET,
        callbackURL: process.env.KAKAO_URL, // 카카오 로그인 Redirect URI 경로
      },
      // clientID에 카카오 앱 아이디 추가
      // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
      // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
      // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { email } = profile._json.kakao_account;
          const { provider, id, username } = profile;
          const exUser = await User.findOne({
            where: { email },
          });

          // 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            done(null, exUser); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            const newUser = await User.create({
              email,
              password: await bcrypt.hash(`${provider}_${id}`, 12),
              nickname: `${username}`,
              loginMethod: `${provider}`,
            });

            done(null, newUser); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  /*깃허브 로그인*/
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: process.env.GITHUB_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, displayName, username, provider } = profile;

          const exUser = await User.findOne({
            where: { nickname: displayName },
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: `${username}@github.com`,
              password: await bcrypt.hash(`${provider}_${id}`, 12),
              nickname: `${displayName}`,
              loginMethod: `${provider}`,
            });

            done(null, newUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  /*구글 로그인*/
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const { provider, id, displayName } = profile;
          const exUser = await User.findOne({
            where: { email },
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email,
              password: await bcrypt.hash(`${provider}_${id}`, 12),
              nickname: `${displayName}`,
              loginMethod: `${provider}`,
            });

            done(null, newUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  /*네이버 로그인*/
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: process.env.NAVER_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          const { provider, id, displayName } = profile;
          const exUser = await User.findOne({
            where: { email },
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email,
              password: await bcrypt.hash(`${provider}_${id}`, 12),
              nickname: `${displayName}`,
              loginMethod: `${provider}`,
            });

            done(null, newUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
