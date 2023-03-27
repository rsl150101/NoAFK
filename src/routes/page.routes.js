const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamsController = require('../controllers/teams.controller');
const ProjectsController = require('../controllers/projects.controller');
const ApiController = require('../controllers/api.controller');
const ChatsController = require('../controllers/chats.controller');
const { checkToken, checkLogin } = require('../middlewares/auth');

const router = express.Router();
const apiController = new ApiController();
const usersController = new UserController();
const teamsController = new TeamsController();
const projectsController = new ProjectsController();
const chatsController = new ChatsController();

router.get('/', checkToken, projectsController.renderProjectsPage);
router.get('/users');
router.get('/projects', checkToken, projectsController.renderProjectsPage);
router.get('/teams/me', checkToken, teamsController.renderMyTeamListPage);
router.get('/teams/:teamId', checkToken, teamsController.renderTeamPage);
router.get('/login', checkLogin, apiController.renderLoginPage);
router.get('/join', checkLogin, apiController.renderJoinPage);
router.get('/test', checkToken, apiController.renderTestPage);
router.get('/mypage', checkToken, usersController.renderMypage);
router.get('/members', checkToken, usersController.renderSearchUserPage);

router.get(
  '/chat/:teamId/:nickname/:memberNickname',
  checkToken,
  chatsController.renderPrivateChatPage
);
router.get(
  '/chat/:chatId/:nickname',
  checkToken,
  chatsController.renderTeamChatPage
);

module.exports = router;
