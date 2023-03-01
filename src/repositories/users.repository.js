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
}

module.exports = UserRepository;
