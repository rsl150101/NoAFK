class ProjectRepository {
  constructor(ProjectModel) {
    this.projectModel = ProjectModel;
  }

  updateStatus = async (teamId, status) => {
    try {
      await this.projectModel.update(
        {
          status,
        },
        {
          where: { id: teamId },
        }
      );
      if (status == 5) {
        return { status: 200, message: '팀 삭제 성공!' };
      }
      return { status: 200, message: '프로젝트 진행 상태 수정 성공!' };
    } catch (error) {
      throw error;
    }
  };

  findTeamNameAndStatusByTeamId = async (teamId) => {
    try {
      return await this.projectModel.findOne({
        attributes: ['team_name', 'status'],
        where: { id: teamId },
      });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectRepository;
