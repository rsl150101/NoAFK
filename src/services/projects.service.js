const ProjectRepository = require('../repositories/projects.repository');
const { Project } = require('../models');

class ProjectService {
  projectRepository = new ProjectRepository(Project);

  createProject = async (projectInfo) => {
    try {
      await this.projectRepository.createProject(projectInfo);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectService;
