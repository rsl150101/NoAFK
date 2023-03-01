const UserService = require('../services/users.service');

class UserController {
  userService = new UserService();
}

module.exports = UserController;
