const express = require('express');
const UserController = require('../controllers/users.controller');

const router = express.Router();
const usersController = new UserController();

//* 회원 전체 조회
router.get('/', usersController.getAllUserInfo);

//* 회원 차단
router.patch('/:userId', usersController.blockUser);

module.exports = router;
