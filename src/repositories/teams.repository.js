class TeamRepository {
  constructor(TeamModel) {
    this.teamModel = TeamModel;
  }

  // TeamModel == ProjectUser 👉 TeamId == ProjectUserId 이 되는 것이 일반적이지만,
  // 실제 코드에서 TeamId == ProjectId (Not PK, but FK) 라는 것을 유의❗
  // Therefore, In TeamRouter, URL: /team/:teamId 👉 TeamId == ProjectId
  // And, In this repository, "ProjectUserId" is used as "TeamMemberId".

  findByTeamMemberId = async (teamMemberId) => {
    try {
      return await this.teamModel.findOne({
        where: { teamMemberId },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findAllByTeamId = async (teamId) => {
    try {
      return await this.teamModel.findAll({
        where: { project_id: teamId },
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
        task: '',
        user_id: userId,
        project_id: teamId,
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

  deleteTeamMember = async (memberId) => {
    try {
      await this.teamModel.destroy({
        where: {
          id: memberId,
        },
      });

      return { status: 200, message: '팀원 삭제 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = TeamRepository;
