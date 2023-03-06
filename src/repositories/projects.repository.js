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

  //* 전체 프로젝트 조회
  findAllProject = async () => {
    try {
      const projects = await this.projectModel.findAll();
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 상태에 따른 페이지별 전체 프로젝트 조회
  findAllByProjectStatus = async (offset, limit, status) => {
    try {
      const projects = await this.projectModel.findAll({
        where: { status },
        raw: true,
        offset,
        limit,
      });
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 프로젝트 총 갯수
  findAllProjectCount = async (status) => {
    try {
      const count = await this.projectModel.count({
        where: {
          status,
        },
      });
      return count;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 프로젝트 생성
  createProject = async (projectInfo) => {
    try {
      await this.projectModel.create({
        ...projectInfo,
        status: 0,
        recommendLevel: 0,
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = ProjectRepository;
