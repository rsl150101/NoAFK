const UserService = require('../services/users.service');

class UsersController {
  userService = new UserService();

  //* 회원 전체 조회 (email, nickname, auth_level, test_result, introduction, expired_at)
  getAllUserInfo = async (req, res) => {
    try {
      const findAllUserInfo = await this.userService.findAllUserInfo();

      res.status(200).json(findAllUserInfo);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = UsersController;
