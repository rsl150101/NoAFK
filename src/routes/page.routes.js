const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamsController = require('../controllers/teams.controller');
const ProjectsController = require('../controllers/projects.controller');

const router = express.Router();
const userController = new UserController();
const teamsController = new TeamsController();
const projectsController = new ProjectsController();

router.get('/');
router.get('/users');
router.get('/projects', projectsController.renderProjectsPage);
router.get('/teams/:teamid', (req, res, next) => {
  // 추후 auth 미들웨어로 추가
  return res.render('myteam');
});

module.exports = router;
