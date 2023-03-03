const express = require('express');
const ProjectsController = require('../controllers/projects.controller');

const router = express.Router();
const projectsController = new ProjectsController();

router.post('/', projectsController.createProject);

module.exports = router;
