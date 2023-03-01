const express = require('express');
const ProjectController = require('../controllers/projects.controller');

const router = express.Router();
const projectController = new ProjectController();

router.post('/', projectController.createProject);

module.exports = router;
