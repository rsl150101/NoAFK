const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// customError
const {
  emailExist,
  nicknameExist,
  userNotFound,
  incorrectPassword,
} = require('../static/js/customError');

class UserService {
  userRepository = new UserRepository(User);

  createUser = async (userInfo) => {
    try {
      // 동일한 닉네임, Email 체크
      const userByEmail = await this.userRepository.findByEmail(userInfo.email);

      if (userByEmail.length > 0) {
        const error = new emailExist();
        throw error;
      }

      const userByNickname = await this.userRepository.findByNickname(
        userInfo.nickname
      );

      if (userByNickname.length > 0) {
        const error = new nicknameExist();
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
        const error = new userNotFound();
        throw error;
      }

      // 비밀번호 체크
      const checkPassword = await bcrypt.compare(
        userInfo.password,
        userByEmail[0].password
      );

      if (!checkPassword) {
        const error = new incorrectPassword();
        throw error;
      }

      // access token
      const accessToken = jwt.sign(
        {
          id: userByEmail.id,
          email: userByEmail.email,
          nickname: userByEmail.nickname,
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
          auth_level,
          test_result,
          introduction,
          expired_at,
        }) => {
          return {
            id,
            email,
            nickname,
            auth_level,
            test_result,
            introduction,
            expired_at,
          };
        }
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserService;
