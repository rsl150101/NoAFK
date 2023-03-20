const express = require('express');
const UserController = require('../controllers/users.controller');
const uploads = require('../middlewares/uploads');

const router = express.Router();
const usersController = new UserController();

//* 회원 전체 조회
// ! 회원 정보 조회와 endpoint가 겹쳐 주석처리함
// router.get('/', usersController.getAllUserInfo);

//* 회원 정보 조회
// ! 페이지 렌더링에서 유저정보 불러오기 때문에 주석처리함.
// router.get('/:id', usersController.getUserInfo);

//* 회원 정보 수정 (password)
router.patch('/:id/password', usersController.updateUserPassword);

//* 회원 정보 수정 (nickname)
router.patch('/:id/nickname', usersController.updateUserNickname);

//* 회원 정보 수정 (introduction)
router.patch('/:id/introduction', usersController.updateUserIntroduction);

//* 회원 정보 수정 (profileImage)
router.patch('/:id/image', usersController.updateUserImage);

//* 회원 차단
router.patch('/:userId', usersController.blockUser);

//* 회원 삭제
router.delete('/:userId', usersController.deleteUser);

// ! 유저조회,백오피스-회원조회 (페이지네이션) 임시구현
router.get('/', usersController.getSearchUser);

// 이미지 업로드
router.post('/image', uploads.single('file'), usersController.uploadImage)
module.exports = router;
