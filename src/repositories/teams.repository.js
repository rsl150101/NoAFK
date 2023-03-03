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
      const teamMemberById = await this.teamModel.findOne({
        where: { teamMemberId },
      });
      return teamMemberById;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findAllByTeamId = async (teamId) => {
    // teamId == projectId
    try {
      const allByTeamId = await this.teamModel.findAll({
        where: { project_id: teamId },
      });
      return allByTeamId;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createTeamMember = async (position, userId, teamId) => {
    try {
      const newTeamMember = await this.teamModel.create({
        position: position, // 0 == 신청자, 1 == 팀페이지에서 바로 추가
        task: '팀원',
        user_id: userId,
        project_id: teamId,
      });
      console.log('createTeamMember => position:', position);
      if (position === 0) {
        return { status: 201, message: '팀 합류 신청 성공!' };
      }
      return { status: 201, message: '팀원 추가 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  updateTeamMember = async (teamMemberId, position, task) => {
    try {
      const updatedTeamMember = await this.TeamModel.update(
        {
          position,
          task,
        },
        {
          where: { id: teamMemberId },
        }
      );
      return updatedTeamMember;
    } catch (error) {
      throw error;
    }
  };

  deleteTeamMember = async (teamMemberId) => {
    // teamMemberId == projectUserId(TeamModel's PK)
    try {
      const deletedTeamMember = await this.teamModel.destroy({
        where: {
          id: teamMemberId,
        },
      });
      console.log(deletedTeamMember);
      return deletedTeamMember;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = TeamRepository;
