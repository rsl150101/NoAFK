const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// customError
const { emailExist, nicknameExist } = require('../static/js/customError');

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
}

module.exports = UserService;
