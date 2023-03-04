class ProjectRepository {
  constructor(ProjectModel) {
    this.projectModel = ProjectModel;
  }

  findProjectById = async (projectId) => {
    try {
      return await this.projectModel.findAll({ where: { id: projectId } });
    } catch (error) {
      throw error;
    }
  };

  updateProject = async (projectId, projectInfo) => {
    try {
      await this.projectModel.update(projectInfo, { where: { id: projectId } });
      return { message: '공고 수정 성공!' };
    } catch (error) {
      throw error;
    }
  };

  deleteProject = async (projectId) => {
    try {
      await this.projectModel.destroy({ where: { id: projectId } });
      return { message: '공고 삭제 성공!' };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectRepository;
