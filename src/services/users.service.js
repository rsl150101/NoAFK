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
} = require('../utility/customError');

class UserService {
  userRepository = new UserRepository(User);

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

      const { id, email, nickname, password } = userByEmail[0];

      // 비밀번호 체크
      const checkPassword = await bcrypt.compare(userInfo.password, password);

      if (!checkPassword) {
        const error = new IncorrectPassword();
        throw error;
      }

      // access token
      const accessToken = jwt.sign(
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

      // refresh token
      const refreshToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
        expiresIn: '14d',
      });

      await this.userRepository.refreshToken(id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  socialLogin = async (id, email, nickname) => {
    try {
      // access token
      const accessToken = jwt.sign(
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

      // refresh token
      const refreshToken = jwt.sign({ id }, process.env.KAKAO_SECRET, {
        expiresIn: '14d',
      });

      await this.userRepository.refreshToken(id, refreshToken);

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

      if (pathUrl === '/members') {
        const users = rows.map(
          ({ email, nickname, testResult, introduction, image }) => ({
            email,
            nickname,
            testResult,
            introduction,
            image,
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
          }) => ({
            id,
            email,
            nickname,
            authLevel,
            testResult,
            introduction,
            expiredAt,
          })
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
