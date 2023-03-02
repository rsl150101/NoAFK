const UserService = require('../services/users.service');

class UserController {
  userService = new UserService();

  //* 회원 전체 조회 (email, nickname, auth_level, test_result, introduction, expired_at)
  getAllUserInfo = async (req, res) => {
    try {
      const findAllUserInfo = await this.userService.findAllUserInfo();

      res.status(200).json(findAllUserInfo);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '회원 전체 조회 실패.' });
    }
  };
}

module.exports = UserController;
