const ProjectService = require('../services/projects.service');

class ProjectController {
  projectService = new ProjectService();
}

module.exports = ProjectController;
