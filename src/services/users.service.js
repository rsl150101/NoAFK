const UserRepository = require('../repositories/users.repository');
const { User } = require('../models');

class UserService {
  userRepository = new UserRepository(User);

  findByEmail = async (email) => {
    try {
      const userByEmail = await this.userRepository.findByEmail(email);

      return userByEmail.map((user) => {
        return {
          id: user.id,
          email: user.email,
          password: user.password,
          nickname: user.nickname,
        };
      });
    } catch (error) {
      throw error;
    }
  };

  findByNickname = async (nickname) => {
    try {
      const userByNIckname = await this.userRepository.findByNickname(nickname);

      // 얘는 다 불러와 줄 필요는 없음
      return userByNIckname.map((user) => {
        return {
          id: user.id,
          email: user.email,
          password: user.password,
          nickname: user.nickname,
        };
      });
    } catch (error) {
      throw error;
    }
  };

  createUser = async (email, hashed, nickname) => {
    try {
      const createUserData = await this.userRepository.createUser(
        email,
        hashed,
        nickname
      );

      return {
        email: createUserData.email,
        nickname: createUserData.nickname,
      };
    } catch (error) {
      throw error;
    }
  };

  findAllUserInfo = async () => {
    try {
      const allUserInfo = await this.userRepository.allUserInfo();

      return allUserInfo.map((users) => {
        return {
          email: users.email,
          nickname: users.nickname,
          auth_level: users.auth_level,
          test_result: users.test_result,
          introduction: users.introduction,
          expired_at: users.expired_at,
        }
      })
    } catch (error) {
      throw error;
    }
  }

}

module.exports = UserService;
