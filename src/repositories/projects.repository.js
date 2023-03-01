class ProjectRepository {
  constructor(ProjectModel) {
    this.projectModel = ProjectModel;
  }

  findAllProject = async () => {
    try {
      const projects = await this.projectModel.findAll({ raw: true });
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createProject = async (projectInfo) => {
    try {
      await this.projectModel.create({
        title: projectInfo.title,
        content: projectInfo.content,
        person: projectInfo.person,
        team_name: projectInfo.teamName,
        recruit_deadline: projectInfo.recruitDeadline,
        project_start: projectInfo.projectStart,
        project_end: projectInfo.projectEnd,
        tech_stack: projectInfo.techStack,
        status: 0,
        recommend_level: 0,
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = ProjectRepository;
