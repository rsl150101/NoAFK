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

  findProjectById = async (projectId) => {
    try {
      return await this.projectRepository.findProjectById(projectId);
    } catch (error) {
      throw error;
    }
  };

  updateProject = async (projectId, projectInfo) => {
    try {
      return await this.projectRepository.updateProject(projectId, projectInfo);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectService;
