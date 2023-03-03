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
      return await this.teamRepository.findAllByTeamId(teamId);
    } catch (error) {
      throw error;
    }
  };

  addNewMember = async (position, userId, teamId) => {
    try {
      console.log(
        `position, userId, teamId: ${position}, ${userId}, ${teamId}`
      );
      return await this.teamRepository.createTeamMember(
        position,
        userId,
        teamId
      );
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
