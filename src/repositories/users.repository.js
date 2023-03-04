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
        ...userInfo,
      });

      return { status: 200, message: '회원가입에 성공하였습니다.' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  getAllUserInfo = async () => {
    try {
      const users = await this.userModel.findAll({});

      return users;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 회원 차단
  blockUser = async (userId) => {
    try {
      return await this.userModel.update(
        { auth_level: 2 }, //* 2 = 차단
        { where: { id: userId } }
      );
    } catch (error) {
      throw error;
    }
  };

  //* 회원 삭제
  deleteUser = async (userId) => {
    try {
      return await this.userModel.destroy({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserRepository;
