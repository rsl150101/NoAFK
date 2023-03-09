const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class ProjectRepository {
  constructor(ProjectModel) {
    this.projectModel = ProjectModel;
  }

  findProjectById = async (id) => {
    try {
      return await this.projectModel.findOne({ where: { id } });
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

  //* 오프셋 기반 전체 프로젝트 조회
  findAllOffsetBasedProjects = async (offset, limit) => {
    try {
      const projects = await this.projectModel.findAll({
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

  //* 커서 기반 상태별 프로젝트 조회
  findAllCursorBasedProjectsByStatus = async (
    cursor,
    status = 0,
    limit = 3
  ) => {
    try {
      const projects = await this.projectModel.findAll({
        where: {
          [Op.and]: {
            id: { [Op.gt]: cursor },
            status,
            deletedAt: { [Op.eq]: null },
          },
        },
        raw: true,
        limit,
      });
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 프로젝트 총 갯수
  findAllProjectCount = async () => {
    try {
      const count = await this.projectModel.count();
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
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // 팀 서비스에서 사용
  findTeamNameAndStatusByTeamId = async (teamId) => {
    try {
      return await this.projectModel.findOne({
        attributes: ['teamName', 'status'],
        where: { id: teamId },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // 팀 서비스에서 사용
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
      const isSoftDeletedProject = status === 5;
      if (isSoftDeletedProject) {
        return { status: 200, message: '팀 삭제 성공!' };
      }
      return { status: 200, message: '프로젝트 진행 상태 수정 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = ProjectRepository;
