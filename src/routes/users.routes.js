const express = require('express');
const UserController = require('../controllers/users.controller');

const router = express.Router();
const usersController = new UserController();

//* 회원 전체 조회
router.get('/', usersController.getAllUserInfo);

//* 회원 차단
router.patch('/:userId', usersController.blockUser);

//* 회원 삭제
router.delete('/:userId', usersController.deleteUser);

// ! 전체 회원 조회 (페이지네이션) 임시구현
router.get('/page', usersController.getUserList);

module.exports = router;
