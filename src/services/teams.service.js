const TeamRepository = require('../repositories/teams.repository');
const ProjectRepository = require('../repositories/projects.repository');
const UserRepository = require('../repositories/users.repository');
const { Project, ProjectUser, User } = require('../models');
const { AlreadyApply } = require('../utility/customError');

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

  // 모집공고 참가 신청
  apply = async (projectId, userId) => {
    try {
      const applyUser = await this.teamRepository.checkNoApply(
        projectId,
        userId
      );

      if (applyUser.length !== 0) {
        const error = new AlreadyApply();
        throw error;
      }

      await this.teamRepository.apply(projectId, userId);
    } catch (error) {
      throw error;
    }
  };

  // 모집공고 신청 수락
  acceptApply = async (projectId, userId) => {
    try {
      return await this.teamRepository.acceptApply(projectId, userId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TeamService;
