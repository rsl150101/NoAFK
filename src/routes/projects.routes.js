const express = require('express');
const ProjectController = require('../controllers/projects.controller');

const router = express.Router();
const projectController = new ProjectController();

module.exports = router;
