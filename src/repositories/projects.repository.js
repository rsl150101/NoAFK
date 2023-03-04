class ProjectRepository {
  constructor(ProjectModel) {
    this.projectModel = ProjectModel;
  }

  findProjectById = async (projectId) => {
    try {
      return await this.projectModel.findAll({ where: { id: projectId } });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  updateProject = async (projectId, projectInfo) => {
    try {
      await this.projectModel.update(projectInfo, { where: { id: projectId } });
      return { status: 200, message: '공고 수정 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = ProjectRepository;
