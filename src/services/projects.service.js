const ProjectRepository = require('../repositories/projects.repository');
const CommentRepository = require('../repositories/comments.repository');
const UserRepository = require('../repositories/users.repository');
const TeamRepository = require('../repositories/teams.repository');
const { Project, ProjectUser, Comment, User } = require('../models');

class ProjectService {
  projectRepository = new ProjectRepository(Project);
  teamRepository = new TeamRepository(ProjectUser);
  commentsRepository = new CommentRepository(Comment);
  userRepository = new UserRepository(User);

  findProjectById = async (id) => {
    try {
      return await this.projectRepository.findProjectById(id);
    } catch (error) {
      throw error;
    }
  };

  updateProject = async (id, projectInfo) => {
    try {
      return await this.projectRepository.updateProject(id, projectInfo);
    } catch (error) {
      throw error;
    }
  };

  deleteProject = async (id) => {
    try {
      return await this.projectRepository.deleteProject(id);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectService;
