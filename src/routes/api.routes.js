const express = require('express');
const ApiController = require('../controllers/api.controller');
const ProjectController = require('../controllers/projects.controller');

const router = express.Router();
const apiController = new ApiController();
const projectController = new ProjectController();

router.post('/auth/join', apiController.join);
router.post('/auth/login', apiController.login);
router.get('/auth/logout', apiController.logout);
router.get('/projects', projectController.getProjects);

module.exports = router;
