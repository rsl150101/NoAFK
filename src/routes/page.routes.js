const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamsController = require('../controllers/teams.controller');
const ProjectsController = require('../controllers/projects.controller');
const { notLogin } = require('../middlewares/auth');
const { AlreayLogin } = require('../utility/customError');

const router = express.Router();
const usersController = new UserController();
const teamsController = new TeamsController();
const projectsController = new ProjectsController();

router.get('/');
router.get('/users');
router.get('/projects', projectsController.renderProjectsPage);
router.get('/teams');
router.get('/adminUser', usersController.renderAdminUserPage);
router.get('/teams/:teamid', (req, res, next) => {
  // 추후 auth 미들웨어로 추가
  return res.render('myteam');
});
router.get('/login', notLogin, (req, res) => {
  if (res.locals.user) {
    const error = new AlreayLogin();
    return res.status(403).json({ message: error.message });
  }
  res.render('login.html');
});
router.get('/join', notLogin, (req, res) => {
  if (res.locals.user) {
    const error = new AlreayLogin();
    return res.status(403).json({ message: error.message });
  }
  res.render('join.html');
});
router.get('/project', (req, res) => {
  res.render('projectDetail.html');
});

module.exports = router;
