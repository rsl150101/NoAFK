const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamController = require('../controllers/teams.controller');
const ProjectController = require('../controllers/projects.controller');
const { notLogin } = require('../middlewares/auth');
const { alreayLogin } = require('../static/js/customError');

const router = express.Router();
const userController = new UserController();
const teamController = new TeamController();
const projectController = new ProjectController();

router.get('/');
router.get('/users');
router.get('/projects');
router.get('/teams');

router.get('/login', notLogin, (req, res) => {
  if (res.locals.user) {
    const error = new alreayLogin();
    return res.status(403).json({ message: error.message });
  }
  res.render('login.html');
});
router.get('/join', notLogin, (req, res) => {
  if (res.locals.user) {
    const error = new alreayLogin();
    return res.status(403).json({ message: error.message });
  }
  res.render('join.html');
});

module.exports = router;
