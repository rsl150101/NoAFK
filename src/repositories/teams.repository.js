const { User, Project } = require('../models');

class TeamRepository {
  constructor(TeamModel) {
    this.teamModel = TeamModel;
  }

  // TeamModel == ProjectUser 👉 TeamId == ProjectUserId 이 되는 것이 일반적이지만,
  // 실제 코드에서 TeamId == ProjectId (Not PK, but FK) 라는 것을 유의❗
  // Therefore, In TeamRouter, URL: /team/:teamId 👉 TeamId == ProjectId
  // And, In this repository, "ProjectUserId" is used as "TeamMemberId".

  findByTeamMemberId = async (userId) => {
    try {
      return await this.teamModel.findAll({
        where: { userId },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findAllByTeamId = async (teamId) => {
    try {
      return await this.teamModel.findAll({
        where: { projectId: teamId },
        include: [
          {
            model: User,
            attributes: ['nickname'],
          },
        ],
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findMemberIdByUserIdAndTeamId = async (userId, teamId) => {
    try {
      return await this.teamModel.findOne({
        attributes: ['id'],
        where: { userId, projectId: teamId },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createTeamMember = async (position, userId, teamId) => {
    try {
      await this.teamModel.create({
        position, // 0 == 신청자, 1 == 팀페이지에서 바로 추가
        userId,
        projectId: teamId,
      });

      if (position === 0) {
        return { status: 201, message: '팀 합류 신청 성공!' };
      }
      return { status: 201, message: '팀원 추가 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // 팀원 정보 수정 성공
  updateTeamMember = async (memberId, position, task) => {
    try {
      await this.teamModel.update(
        {
          position,
          task,
        },
        {
          where: { id: memberId },
        }
      );
      return { status: 200, message: '팀원 정보 수정 성공!' };
    } catch (error) {
      throw error;
    }
  };

  // 팀원 삭제
  deleteTeamMember = async (memberId) => {
    try {
      await this.teamModel.destroy({
        where: { id: memberId },
      });

      return { status: 200, message: '팀원 삭제 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // 팀 삭제
  deleteTeam = async (teamId) => {
    try {
      await this.teamModel.destroy({
        where: { projectId: teamId },
      });

      return { status: 200, message: '팀 삭제 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // 프로젝트 공고 신청자 조회
  findApplysByProjectId = async (id) => {
    try {
      return await this.teamModel.findAll({
        where: { projectId: id, position: 0 },
      });
    } catch (error) {
      throw error;
    }
  };

  // 모집공고 참가 신청했는지 확인
  checkNoApply = async (projectId, userId) => {
    try {
      return await this.teamModel.findAll({
        where: { projectId, userId },
      });
    } catch (error) {
      throw error;
    }
  };

  // 모집공고 참가 신청
  apply = async (projectId, userId) => {
    try {
      await this.teamModel.create({
        position: 0,
        task: '담당업무를 정해주세요.',
        projectId,
        userId,
      });
      return { message: '신청 수락 성공!' };
    } catch (error) {
      throw error;
    }
  };

  // 모집공고 신청 수락
  acceptApply = async (projectId, userId) => {
    try {
      await this.teamModel.update(
        { position: 1 },
        {
          where: { projectId, userId },
        }
      );
      return { message: '신청 수락 성공!' };
    } catch (error) {
      throw error;
    }
  };

  projectByUser = async (id) => {
    try {
      return await this.teamModel.findAll({
        attributes: ['task'],
        where: { user_id: id },
        include: [
          {
            model: Project,
            attributes: [
              'id',
              'title',
              'content',
              'teamName',
              'owner',
              'person',
              'projectEnd',
            ],
            include: [
              {
                model: User,
                attributes: ['nickname'],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };

  // 공고 마감 후 팀 리더생성
  addLeader = async (projectId, userId) => {
    try {
      return await this.teamModel.create({
        position: 3,
        task: '담당업무를 정해주세요.',
        projectId,
        userId,
      });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = TeamRepository;
