const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamController = require('../controllers/teams.controller');
const ProjectController = require('../controllers/projects.controller');

const router = express.Router();
const userController = new UserController();
const teamController = new TeamController();
const projectController = new ProjectController();

router.get('/');
router.get('/users');
router.get('/projects');
router.get('/teams');

module.exports = router;
