const TeamRepository = require('../repositories/teams.repository');
const ProjectRepository = require('../repositories/projects.repository');
const UserRepository = require('../repositories/users.repository');
const { Project, ProjectUser, User } = require('../models');

class TeamService {
  teamRepository = new TeamRepository(ProjectUser);
  projectRepository = new ProjectRepository(Project);
  userRepository = new UserRepository(User);

  findByTeamMemberId = async (teamMemberId) => {
    try {
      const teamMemberById = await this.teamRepository.findByTeamMemberId(
        teamMemberId
      );

      const teamMemberInfo = teamMemberById.map((teamMember) => {
        return {
          id: teamMember.id,
          position: teamMember.position,
          task: teamMember.task,
          createdAt: teamMember.createdAt,
        };
      });

      return teamMemberInfo;
    } catch (error) {
      throw error;
    }
  };

  findAllByTeamId = async (teamId) => {
    try {
      const AllByTeamId = await this.teamRepository.findAllByTeamId(teamId);

      const allInfo = AllByTeamId.map((all) => {
        return {
          id: all.teamMember.id,
          position: all.teamMember.position,
          task: all.teamMember.task,
          createdAt: all.teamMember.createdAt,
        };
      });

      return allInfo;
    } catch (error) {
      throw error;
    }
  };

  createTeamMember = async (userId, projectId) => {
    try {
      const newTeamMember = await this.teamRepository.createTeamMember(
        userId,
        projectId
      );

      const newTeamMemberInfo = newTeamMember.map((newMember) => {
        return {
          userId: newMember.userId,
          projectId: newMember.projectId,
          position: newMember.position,
        };
      });

      return newTeamMemberInfo;
    } catch (error) {
      throw error;
    }
  };

  updateTeamMember = async (teamMemberInfo) => {
    try {
      const updatedTeamMember = await this.teamRepository.updateTeamMember(
        teamMemberInfo
      );

      const updatedTeamMemberInfo = updatedTeamMember.map((updatedMember) => {
        return {
          position: updatedMember.position,
          task: updatedMember.task,
        };
      });

      return updatedTeamMemberInfo;
    } catch (error) {
      throw error;
    }
  };

  deleteTeamMember = async (teamMemberId) => {
    try {
      const deletedTeamMember = await this.teamRepository.deleteTeamMember(
        teamMemberId
      );

      return deletedTeamMember;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TeamService;
