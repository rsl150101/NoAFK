const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User } = require('../models');

class ProjectRepository {
  constructor(ProjectModel, ProjectLikeModel) {
    this.projectModel = ProjectModel;
    this.projectLikeModel = ProjectLikeModel;
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

  endProjectApply = async (id) => {
    try {
      return await this.projectModel.update({ status: 1 }, { where: { id } });
    } catch (error) {
      throw error;
    }
  };

  //* 프로젝트 하드 삭제
  hardDeleteProject = (id) => {
    try {
      this.projectModel.destroy({ where: { id }, force: true });
      return;
    } catch (error) {
      throw error;
    }
  };

  //* 전체 프로젝트 조회
  findAllProject = async () => {
    try {
      const projects = await this.projectModel.findAll({ raw: true });
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // 전체 팀(status===0)인 것들 중 마지막 프로젝트
  findLastTeam = async () => {
    try {
      return await this.projectModel.findOne({
        where: { status: { [Op.ne]: 0 } },
        order: [['id', 'desc']],
      });
    } catch (error) {
      throw error;
    }
  };

  findNextTeams = async (cursor) => {
    try {
      return await this.projectModel.count({
        where: {
          status: { [Op.ne]: 0 },
          id: { [Op.lt]: cursor },
        },
        order: [['id', 'desc']],
      });
    } catch (error) {
      throw error;
    }
  };

  findTeamsWithNickname = async (cursor, limit) => {
    try {
      return await this.projectModel.findAll({
        where: {
          status: { [Op.ne]: 0 },
          id: { [Op.lt]: cursor },
        },
        include: [
          {
            model: User,
            attributes: ['nickname'],
          },
        ],
        limit,
        order: [['id', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  };

  findProjectWithNicknameById = async (id) => {
    try {
      return await this.projectModel.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ['nickname'],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };

  findAllProjectsByUserId = async (owner) => {
    try {
      return await this.projectModel.findAll({
        attributes: ['id', 'teamName', 'status', 'techStack', 'createdAt'],
        where: { owner },
        order: [['id', 'DESC']],
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findMostRecentIdByUserId = async (owner) => {
    try {
      return await this.projectModel.max('id', {
        where: { owner },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findAllProjectByStatus = async (status) => {
    try {
      const projects = await this.projectModel.findAll({
        where: { status },
        raw: true,
      });
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 오프셋 기반 전체 프로젝트 조회
  findAllOffsetBasedProjects = async (offset, limit, search) => {
    try {
      const projects = await this.projectModel.findAll({
        where: {
          [Op.or]: {
            title: { [Op.like]: `%${search}%` },
            owner: { [Op.like]: `%${search}%` },
          },
        },
        attributes: { exclude: ['owner'] },
        include: [{ model: User, attributes: ['nickname'] }],
        raw: true,
        offset,
        limit,
        paranoid: false,
      });
      return projects;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 프로젝트 테이블 마지막 row id 조회
  findOneLastProject = async () => {
    try {
      const project = await this.projectModel.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
      });

      return project;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 커서 기반 상태별 프로젝트 조회
  findAllCursorBasedProjectsByStatus = async (
    cursor,
    search,
    status = 0,
    limit = 3
  ) => {
    try {
      const projects = await this.projectModel.findAll({
        where: {
          [Op.and]: {
            id: { [Op.lt]: cursor },
            status,
            [Op.or]: {
              title: { [Op.like]: `%${search}%` },
              owner: { [Op.like]: `%${search}%` },
            },
          },
        },
        order: [['id', 'DESC']],
        attributes: { exclude: ['owner'] },
        include: [
          { model: User, attributes: ['nickname'] },
          { model: this.projectLikeModel, attributes: ['userId', 'projectId'] },
        ],
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
  findAllProjectCount = async (search = '') => {
    try {
      const count = await this.projectModel.count({
        where: {
          [Op.or]: {
            title: { [Op.like]: `%${search}%` },
            owner: { [Op.like]: `%${search}%` },
          },
        },
      });
      return count;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 모집 중인 프로젝트 총 갯수
  findAllRecruitProjectCount = async (search = '') => {
    try {
      const count = await this.projectModel.count({
        where: {
          [Op.and]: {
            status: 0,
            [Op.or]: {
              title: { [Op.like]: `%${search}%` },
              owner: { [Op.like]: `%${search}%` },
            },
          },
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
      return { status: 200, message: '프로젝트 진행 상태 수정 성공!' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 프로젝트 좋아요 검사
  verifyProjectLike = async (userId, projectId) => {
    try {
      return await this.projectLikeModel.findOne({
        where: { [Op.and]: { userId, projectId } },
      });
    } catch (error) {}
  };

  //* 프로젝트 좋아요
  postProjectLike = (userId, projectId) => {
    try {
      this.projectLikeModel.create({ userId, projectId });
      return;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 프로젝트 좋아요 해제
  deleteProjectLike = (userId, projectId) => {
    try {
      this.projectLikeModel.destroy({
        where: { [Op.and]: { userId, projectId } },
      });
      return;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };
}

module.exports = ProjectRepository;
