const { userInfo } = require('os');

class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findByEmail = async (email) => {
    try {
      return await this.userModel.findAll({
        where: { email },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findByNickname = async (nickname) => {
    try {
      return await this.userModel.findAll({
        where: { nickname },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createUser = async (userInfo) => {
    try {
      await this.userModel.create({
        email: userInfo.email,
        password: userInfo.password,
        nickname: userInfo.nickname,
      });

      return { status: 200, message: '회원가입에 성공하였습니다.' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = UserRepository;
