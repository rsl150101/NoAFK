const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamsController = require('../controllers/teams.controller');
const ProjectsController = require('../controllers/projects.controller');
const ApiController = require('../controllers/api.controller');
const { checkToken } = require('../middlewares/auth');

const router = express.Router();
const apiController = new ApiController();
const usersController = new UserController();
const teamsController = new TeamsController();
const projectsController = new ProjectsController();

router.get('/');
router.get('/users');
router.get('/projects', projectsController.renderProjectsPage);
router.get('/teams/:teamId', teamsController.renderTeamPage);
router.get('/adminUser', usersController.renderAdminUserPage);
router.get('/login', checkToken, apiController.renderLoginPage);
router.get('/join', checkToken, apiController.renderJoinPage);

module.exports = router;
