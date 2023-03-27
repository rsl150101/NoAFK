const express = require('express');
const ChatsController = require('../controllers/chats.controller');
const { checkToken } = require('../middlewares/auth');

const router = express.Router();
const chatsController = new ChatsController();

router.post('/:chatId', checkToken, chatsController.postTeamMessage);

router.post(
  '/:teamId/:nickname/:memberNickname',
  checkToken,
  chatsController.postPrivateMessage
);

module.exports = router;
