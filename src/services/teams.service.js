const TeamRepository = require('../repositories/teams.repository');
const ProjectRepository = require('../repositories/projects.repository');
const UserRepository = require('../repositories/users.repository');
const { Project, ProjectUser, User } = require('../models');
const { AlreadyApply, AlreadyWorkPass } = require('../utility/customError');

class TeamService {
  teamRepository = new TeamRepository(ProjectUser);
  projectRepository = new ProjectRepository(Project);
  userRepository = new UserRepository(User);

  findAllTeam = async (cursor) => {
    try {
      if (!cursor) {
        const lastTeam = await this.projectRepository.findLastTeam();

        if (!lastTeam) {
          cursor = null;
        } else {
          cursor = lastTeam.id + 0.1;
        }
      }

      const limit = 10;
      let teams;
      cursor = Number(cursor);

      teams = await this.projectRepository.findTeamsWithNickname(cursor, limit);

      const nextCursor = teams.length === limit ? teams.at(-1).id : null;

      let existNextTeams = await this.projectRepository.findNextTeams(
        nextCursor
      );

      if (existNextTeams === 0) {
        existNextTeams = false;
      } else {
        existNextTeams = true;
      }

      return { teams, nextCursor, existNextTeams };
    } catch (error) {
      throw error;
    }
  };

  findAllTeamByUserId = async (userId) => {
    try {
      const allTeamByUserId = await this.teamRepository.findByTeamMemberId(
        userId
      );

      return await Promise.all(
        allTeamByUserId.map(async (team) => {
          const projectId = team.projectId;
          return await this.projectRepository.findProjectById(projectId);
        })
      );
    } catch (error) {
      throw error;
    }
  };

  findApplyTeam = async (userId) => {
    try {
      const applyTeamList = await this.teamRepository.findApplyTeam(userId);
      return await Promise.all(
        applyTeamList.map(async (team) => {
          const projectId = team.projectId;
          return await this.projectRepository.findProjectWithNicknameById(
            projectId
          );
        })
      );
    } catch (error) {
      throw error;
    }
  };

  findHostTeam = async (userId) => {
    try {
      const hostTeamList = await this.teamRepository.findHostTeam(userId);
      return await Promise.all(
        hostTeamList.map(async (team) => {
          const projectId = team.projectId;
          return await this.projectRepository.findProjectWithNicknameById(
            projectId
          );
        })
      );
    } catch (error) {
      throw error;
    }
  };

  findMostRecentTeamByUserId = async (userId) => {
    try {
      return await this.projectRepository.findMostRecentIdByUserId(userId);
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

  findInvitedUserByTeamId = async (teamId) => {
    try {
      return await this.teamRepository.findInvitedUserByTeamId(teamId);
    } catch (error) {
      throw error;
    }
  };

  findMemberIdByUserIdAndTeamId = async (userId, teamId) => {
    try {
      return await this.teamRepository.findMemberIdByUserIdAndTeamId(
        userId,
        teamId
      );
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

  verifyNickname = async (nickname) => {
    try {
      if (!nickname) {
        return false;
      }
      const UserInfo = await this.userRepository.findIdByNickname(nickname);

      if (!UserInfo) {
        return false;
      } else {
        return UserInfo.id;
      }
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

  inviteNewUser = async (userId, teamId) => {
    try {
      const invitationPosition = 4;
      return await this.teamRepository.createTeamMember(
        invitationPosition,
        userId,
        teamId
      );
    } catch (error) {
      throw error;
    }
  };

  updateStatus = async (teamId, status) => {
    try {
      const resultByTeamId =
        await this.projectRepository.findTeamNameAndStatusByTeamId(teamId);

      const dbStatus = resultByTeamId.status;

      if (status < dbStatus) {
        const error = new AlreadyWorkPass();
        throw error;
      }

      return await this.projectRepository.updateStatus(teamId, status);
    } catch (error) {
      throw error;
    }
  };

  deleteTeam = async (teamId) => {
    try {
      await this.projectRepository.deleteProject(teamId);
      return await this.teamRepository.deleteTeam(teamId);
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

  // 공고 신청 취소
  cancelApply = async (projectId, userId) => {
    try {
      return await this.teamRepository.cancelApply(projectId, userId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TeamService;
