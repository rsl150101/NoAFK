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

  // 프로젝트 공고 신청자 조회 - 닉네임, 아이디값만
  findApplysByProjectId = async (id) => {
    try {
      const Applys = await this.teamRepository.findApplysByProjectId(id);
      const applyUsersNickname = await Promise.all(
        Applys.map(async (apply) => {
          const userId = apply.userId;
          const user = await this.userRepository.findUserInfoByUserId(userId);

          return { id: user[0].id, nickname: user[0].nickname };
        })
      );

      return applyUsersNickname;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TeamService;
