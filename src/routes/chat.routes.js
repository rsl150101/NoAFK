const express = require('express');
const ChatsController = require('../controllers/chats.controller');

const router = express.Router();
const chatsController = new ChatsController();

router.post('/:chatId', chatsController.postTeamMessage);

router.post('/:teamId/:memberId', chatsController.postPrivateMessage);

module.exports = router;
