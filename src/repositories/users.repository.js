class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findByEmail = async (email) => {
    try {
      const userByEmail = await this.userModel.findAll({
        where: { email },
      });
      return userByEmail;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findByNickname = async (nickname) => {
    try {
      const userByNickname = await this.userModel.findAll({
        where: { nickname },
      });
      return userByNickname;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createUser = async (email, hashed, nickname) => {
    try {
      const userData = await this.userModel.create({
        email,
        password: hashed,
        nickname,
      });

      console.log(userData);

      return userData;
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
