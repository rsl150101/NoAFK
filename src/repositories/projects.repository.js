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
}

module.exports = ProjectRepository;
