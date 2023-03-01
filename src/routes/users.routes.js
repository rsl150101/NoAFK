const express = require('express');
const UserController = require('../controllers/users.controller');

const router = express.Router();
const userController = new UserController();

// 회원 전체 조회
router.get('/', userController.getAllUserInfo);


module.exports = router;
