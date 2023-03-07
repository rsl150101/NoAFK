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
          expiresIn: '1d',
        }
      );

      return { status: 200, accessToken };
    } catch (error) {
      throw error;
    }
  };

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

  //* 회원 차단
  blockUser = async (userId) => {
    try {
      return await this.userRepository.blockUser(userId);
    } catch (error) {
      throw error;
    }
  };

  //* 회원 삭제
  deleteUser = async (userId) => {
    try {
      return await this.userRepository.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  };

  getUsers = async (currentPage, perPage) => {
    try {
      const start = (currentPage - 1) * perPage;
      const { count, rows } = await this.userRepository.getUsers(
        start,
        perPage
      );

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

      const totalPages = Math.ceil(count / perPage);

      return { users, totalPages };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserService;
