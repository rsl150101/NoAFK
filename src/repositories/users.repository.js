class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findByEmail = async (email) => {
    try {
      console.log(email, 'email');
      const userByEmail = await this.userModel.findAll({
        where: { email },
      });
      console.log(userByEmail, 'userByEmail');
      return userByEmail;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findByNickname = async (nickname) => {
    try {
      console.log(nickname, 'nickname');
      const userByNickname = await this.userModel.findAll({
        where: { nickname },
      });
      console.log(userByNickname, 'userByNickname');
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

      return userData;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = UserRepository;
