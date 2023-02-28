const UserRepository = require('../repositories/users.repository');
const { User } = require('../../models');

class UserService {
  userRepository = new UserRepository(User);
}

module.exports = UserService;
