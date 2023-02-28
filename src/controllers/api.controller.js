const UserService = require('../services/users.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class ApiController {
  userService = new UserService();
}

module.exports = ApiController;
