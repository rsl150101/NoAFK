const express = require('express');
const ProjectsController = require('../controllers/projects.controller');

const router = express.Router();
const projectsController = new ProjectsController();

router.get('/projects', projectsController.getOffsetBasedProjects);
router.delete('/projects/:id', projectsController.hardDeleteProject);

module.exports = router;
