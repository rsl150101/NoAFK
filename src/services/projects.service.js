const ProjectRepository = require('../repositories/projects.repository');
const { Project } = require('../models');

class ProjectService {
  projectRepository = new ProjectRepository(Project);

  getProjects = async () => {
    try {
      let projects = await this.projectRepository.findAllProject();
      console.log('serv', projects);
    } catch (error) {
      throw error;
    }
  };

  createProject = async (projectInfo) => {
    try {
      await this.projectRepository.createProject(projectInfo);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectService;
