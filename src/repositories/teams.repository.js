class TeamRepository {
  constructor(TeamModel) {
    this.teamModel = TeamModel;
  }

  // TeamModel == ProjectUser_DB 라고 하면 TeamID는 각 팀 멤버의 고유ID값으로 생각하게된다.
  // 하지만 직관적으로 TeamId라고 할 수 있는 것은 외래키로 연결된 ProjectModel의 아이디값이다.
  // URL의 team/:teamId 도 projectID로 사용되는 것이 코드가 더 간단화 될 것.

  findByTeamMemberId = async (teamMemberId) => {
    // TeamModel의 PK인 teamMemberId == projectUser의 PK인 projectUserId
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
        where: { teamId },
      });
      return allByTeamId;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createTeamMember = async (userId, projectId) => {
    try {
      const newTeamMember = await this.teamModel.create({
        userId,
        projectId,
        position: 1, // 0 == 신청자
      });
      console.log(newTeamMember);
      return newTeamMember;
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
