const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// customError
const {
  EmailExist,
  NicknameExist,
  UserNotFound,
  IncorrectPassword,
  BlackUser,
} = require('../utility/customError');

// redis
const redisClient = require('../utility/redis');

// nodemailer
const transporter = require('../utility/nodemailer');

class UserService {
  userRepository = new UserRepository(User);

  findEmail = async (email) => {
    try {
      // 동일한 닉네임, Email 체크
      const userByEmail = await this.userRepository.findByEmail(email);

      if (userByEmail.length > 0) {
        const error = new EmailExist();
        throw error;
      }

      return { status: 200, message: '사용가능한 이메일입니다.' };
    } catch (error) {
      throw error;
    }
  };

  findNickname = async (nickname) => {
    try {
      // 동일한 닉네임, Email 체크
      const userByNickname = await this.userRepository.findByNickname(nickname);

      if (userByNickname.length > 0) {
        const error = new NicknameExist();
        throw error;
      }

      return { status: 200, message: '사용가능한 닉네임입니다.' };
    } catch (error) {
      throw error;
    }
  };

  sendEmailAuth = async (email) => {
    try {
      const generateString = () => {
        const chars = '0123456789';
        const stringLength = 6;

        var randomString = '';
        for (let i = 0; i < stringLength; i++) {
          let randomNum = Math.floor(Math.random() * chars.length);
          randomString += chars.substring(randomNum, randomNum + 1);
        }

        return randomString;
      };

      const authString = generateString();

      const emailOptions = {
        //비밀번호 초기화를 보내는 이메일의 Option
        from: process.env.GMAIL_ID, //관리자 Email
        to: email, //비밀번호 초기화 요청 유저 Email
        subject: 'NoAFK - 회원가입 인증번호', //보내는 메일의 제목
        //보내는 메일의 내용
        html:
          '<p>NoAFK 회원가입을 위한 인증번호입니다.</p>' +
          `<p>인증번호는 ${authString} 입니다.</p> <br />` +
          '<p>회원가입페이지로 돌아가 입력해주세요.</p>',
      };
      transporter.sendMail(emailOptions); //요청 전송

      return {
        status: 200,
        message: '회원가입 인증번호가 전송되었습니다.',
        authString,
      };
    } catch (error) {
      throw error;
    }
  };

  sendPasswordEmail = async (email) => {
    try {
      // 동일한 닉네임, Email 체크
      const userByEmail = await this.userRepository.findByEmail(email);

      if (userByEmail.length > 0) {
        const generatePassword = () => {
          const chars = '0123456789abcdefghiklmnopqrstuvwxyz!@#$%^&*';
          const stringLength = 8;

          var randomString = '';
          for (let i = 0; i < stringLength; i++) {
            let randomNum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(randomNum, randomNum + 1);
          }

          return randomString;
        };

        const newPassword = generatePassword() + 'a1#';

        const emailOptions = {
          //비밀번호 초기화를 보내는 이메일의 Option
          from: process.env.GMAIL_ID, //관리자 Email
          to: email, //비밀번호 초기화 요청 유저 Email
          subject: 'NoAFK - 임시비밀번호 발급', //보내는 메일의 제목
          //보내는 메일의 내용
          html:
            `<p>임시비밀번호는 ${newPassword} 입니다.</p> <br />` +
            '<p>마이페이지에서 비밀번호를 재설정해주세요!</p>',
        };
        transporter.sendMail(emailOptions); //요청 전송

        // 비밀번호 암호화
        const hashPassword = await bcrypt.hash(newPassword, 12);

        return await this.userRepository.updateUserPassword(
          userByEmail[0].id,
          hashPassword
        );
      }
    } catch (error) {
      throw error;
    }
  };

  createUser = async (userInfo) => {
    try {
      // 동일한 닉네임, Email 체크
      const userByEmail = await this.userRepository.findByEmail(userInfo.email);

      if (userByEmail.length > 0) {
        const error = new EmailExist();
        throw error;
      }

      const userByNickname = await this.userRepository.findByNickname(
        userInfo.nickname
      );

      if (userByNickname.length > 0) {
        const error = new NicknameExist();
        throw error;
      }

      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(userInfo.password, 12);
      userInfo.password = hashedPassword;

      return await this.userRepository.createUser(userInfo);
    } catch (error) {
      throw error;
    }
  };

  login = async (userInfo) => {
    try {
      // 해당 이메일의 회원이 존재하는지
      const userByEmail = await this.userRepository.findByEmail(userInfo.email);

      if (userByEmail.length === 0) {
        const error = new UserNotFound();
        throw error;
      }

      const { id, email, nickname, password, authLevel } = userByEmail[0];

      if (authLevel === 2) {
        const error = new BlackUser();
        throw error;
      }

      // 비밀번호 체크
      const checkPassword = await bcrypt.compare(userInfo.password, password);

      if (!checkPassword) {
        const error = new IncorrectPassword();
        throw error;
      }

      // access token
      const accessToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
        expiresIn: '2h',
      });

      // refresh token
      const refreshToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
        expiresIn: '14d',
      });

      // 발급한 refresh token을 redis에 key를 user의 id로 하여 저장
      redisClient.set(id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  socialLogin = async (id, email, nickname) => {
    try {
      // access token
      const accessToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
        expiresIn: '2h',
      });

      // refresh token
      const refreshToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
        expiresIn: '14d',
      });

      // 발급한 refresh token을 redis에 key를 user의 id로 하여 저장
      redisClient.set(id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  //* 회원 전체 조회
  findAllUserInfo = async () => {
    try {
      const allUserInfo = await this.userRepository.getAllUserInfo();

      return allUserInfo.map(
        ({
          id,
          email,
          nickname,
          authLevel,
          testResult,
          introduction,
          expiredAt,
        }) => {
          return {
            id,
            email,
            nickname,
            authLevel,
            testResult,
            introduction,
            expiredAt,
          };
        }
      );
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 조회
  findUserInfo = async (id) => {
    try {
      const userInfo = await this.userRepository.userInfo(id);

      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (password)
  updateUserPassword = async (id, password) => {
    try {
      const userInfo = await this.userRepository.loginUserInfo(id);
      if (userInfo.loginMethod !== 'NoAFK') {
        throw error;
      }
      // 비밀번호 암호화
      const hashPassword = await bcrypt.hash(password, 12);
      password = hashPassword;

      return await this.userRepository.updateUserPassword(id, password);
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (nickname)
  updateUserNickname = async (id, nickname) => {
    try {
      // 닉네임 중복 체크
      const checkByUserNickname = await this.userRepository.findByNickname(
        nickname
      );
      if (checkByUserNickname.length > 0) {
        const error = new NicknameExist();
        throw error;
      }

      return await this.userRepository.updateUserNickname(id, nickname);
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (introduction)
  updateUserIntroduction = async (id, introduction) => {
    try {
      return await this.userRepository.updateUserIntroduction(id, introduction);
    } catch (error) {
      throw error;
    }
  };

  //* 회원 차단
  blockUser = async (id) => {
    try {
      return await this.userRepository.blockUser(id);
    } catch (error) {
      throw error;
    }
  };

  //* 회원 삭제
  deleteUser = async (id) => {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      throw error;
    }
  };

  //* 검사결과 저장
  test = async (id, testResult) => {
    try {
      const userInfo = await this.userRepository.loginUserInfo(id);
      if (userInfo.testResult) {
        throw error;
      }
      return await this.userRepository.test(id, testResult);
    } catch (error) {
      throw error;
    }
  };

  // * 유저조회,백오피스-회원조회
  getSearchUser = async (currentPage, perPage, pathUrl, sfl, stx) => {
    try {
      const start = (currentPage - 1) * perPage;
      const { count, rows } = await this.userRepository.getSearchUser(
        start,
        perPage,
        sfl,
        stx
      );

      const totalPages = Math.ceil(count / perPage);

      console.log('🚀  file: users.service.js:358  rows:', rows);
      if (pathUrl === '/members') {
        const users = rows.map(
          ({
            email,
            nickname,
            testResult,
            introduction,
            image,
            privateEmail,
          }) => ({
            email,
            nickname,
            testResult,
            introduction,
            image,
            privateEmail,
          })
        );

        return { users, totalPages, count };
      } else {
        const users = rows.map(
          ({
            id,
            email,
            nickname,
            authLevel,
            testResult,
            introduction,
            expiredAt,
          }) => {
            let authLevelName = '일반';
            switch (authLevel) {
              case 99:
                authLevelName = '관리자';
                break;
            }
            return {
              id,
              email,
              nickname,
              authLevel,
              authLevelName,
              testResult,
              introduction,
              expiredAt,
            };
          }
        );

        return { users, totalPages, count };
      }
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (image)
  updateUserImage = async (id, image) => {
    try {
      return await this.userRepository.updateUserImage(id, image);
    } catch (error) {
      throw error;
    }
  };

  //* 마이페이지 유저정보 렌더링
  userInfo = async (id) => {
    try {
      const userInfo = await this.userRepository.loginUserInfo(id);

      return userInfo;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserService;
