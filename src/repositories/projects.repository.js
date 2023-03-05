class ProjectRepository {
  constructor(ProjectModel) {
    this.projectModel = ProjectModel;
  }

  findProjectById = async (id) => {
    try {
      return await this.projectModel.findAll({ where: { id } });
    } catch (error) {
      throw error;
    }
  };

  updateProject = async (id, projectInfo) => {
    try {
      await this.projectModel.update(projectInfo, { where: { id } });
      return { message: '공고 수정 성공!' };
    } catch (error) {
      throw error;
    }
  };

  deleteProject = async (id) => {
    try {
      return await this.projectModel.destroy({ where: { id } });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectRepository;
