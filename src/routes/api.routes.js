const express = require('express');
const ApiController = require('../controllers/api.controller');
const ProjectsController = require('../controllers/projects.controller');

const router = express.Router();
const apiController = new ApiController();
const projectsController = new ProjectsController();

router.post('/auth/join', apiController.join);
router.post('/auth/login', apiController.login);
router.get('/auth/logout', apiController.logout);
router.get('/projects', projectsController.getProjects);

module.exports = router;
