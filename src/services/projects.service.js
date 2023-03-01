const ProjectRepository = require('../repositories/projects.repository');
const { Project } = require('../models');

class ProjectService {
  projectRepository = new ProjectRepository(Project);
}

module.exports = ProjectService;
