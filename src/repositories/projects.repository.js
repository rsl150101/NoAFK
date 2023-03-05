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
      return { status: 200, message: '프로젝트 진행 상태 수정 성공!' };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectRepository;
