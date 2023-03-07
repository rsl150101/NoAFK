const TeamRepository = require('../repositories/teams.repository');
const ProjectRepository = require('../repositories/projects.repository');
const UserRepository = require('../repositories/users.repository');
const { Project, ProjectUser, User } = require('../models');

class TeamService {
  teamRepository = new TeamRepository(ProjectUser);
  projectRepository = new ProjectRepository(Project);
  userRepository = new UserRepository(User);

  findAllByTeamId = async (teamId) => {
    try {
      return await this.teamRepository.findAllByTeamId(teamId);
    } catch (error) {
      throw error;
    }
  };

  findTeamNameAndStatusByTeamId = async (teamId) => {
    try {
      return await this.projectRepository.findTeamNameAndStatusByTeamId(teamId);
    } catch (error) {
      throw error;
    }
  };

  findUserById = async (userId) => {
    try {
      return await this.userRepository.findNicknameById(userId);
    } catch (error) {
      throw error;
    }
  };

  findUserByNickname = async (nickname) => {
    try {
      return await this.userRepository.findIdByNickname(nickname);
    } catch (error) {
      throw error;
    }
  };

  addNewMember = async (position, userId, teamId) => {
    try {
      return await this.teamRepository.createTeamMember(
        position,
        userId,
        teamId
      );
    } catch (error) {
      throw error;
    }
  };

  updateStatus = async (teamId, status) => {
    try {
      return await this.projectRepository.updateStatus(teamId, status);
    } catch (error) {
      throw error;
    }
  };

  updateMember = async (memberId, position, task) => {
    try {
      return await this.teamRepository.updateTeamMember(
        memberId,
        position,
        task
      );
    } catch (error) {
      throw error;
    }
  };

  deleteMember = async (memberId) => {
    try {
      return await this.teamRepository.deleteTeamMember(memberId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TeamService;
