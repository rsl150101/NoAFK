const express = require('express');
const UserController = require('../controllers/users.controller');
const TeamController = require('../controllers/teams.controller');
const ProjectsController = require('../controllers/projects.controller');

const router = express.Router();
const userController = new UserController();
const teamController = new TeamController();
const projectsController = new ProjectsController();

router.get('/');
router.get('/users');
router.get('/projects', projectsController.renderProjectsPage);
router.get('/teams');

module.exports = router;
