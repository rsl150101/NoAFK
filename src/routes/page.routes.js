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
router.get('/projects', projectsController.renderProjectsPage);
router.get('/teams/:teamId', teamsController.renderTeamPage);
router.get('/login', checkLogin, apiController.renderLoginPage);
router.get('/join', checkLogin, apiController.renderJoinPage);
router.get('/test', checkToken, apiController.renderTestPage);
router.get('/mypage', checkToken, usersController.renderMypage);
router.get('/members', usersController.renderSearchUserPage);

router.get('/chat/:chatId/:memberId', chatsController.renderPrivateChatPage);
router.get('/chat/:chatId', chatsController.renderTeamChatPage);

module.exports = router;
