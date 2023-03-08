const ProjectRepository = require('../repositories/projects.repository');
const CommentRepository = require('../repositories/comments.repository');
const UserRepository = require('../repositories/users.repository');
const TeamRepository = require('../repositories/teams.repository');
const { Project, ProjectUser, Comment, User } = require('../models');

class ProjectService {
  projectRepository = new ProjectRepository(Project);
  teamRepository = new TeamRepository(ProjectUser);
  commentsRepository = new CommentRepository(Comment);
  userRepository = new UserRepository(User);

  findProjectById = async (id) => {
    try {
      return await this.projectRepository.findProjectById(id);
    } catch (error) {
      throw error;
    }
  };

  updateProject = async (id, projectInfo) => {
    try {
      return await this.projectRepository.updateProject(id, projectInfo);
    } catch (error) {
      throw error;
    }
  };

  deleteProject = async (id) => {
    try {
      return await this.projectRepository.deleteProject(id);
    } catch (error) {
      throw error;
    }
  };

  //* 오프셋 기반 전체 프로젝트 조회 및 페이지네이션
  getOffsetBasedProjects = async (page) => {
    if (!page) {
      page = 1;
    }
    try {
      const limit = 10;

      //todo <김우중> <2023.03.05> : 추후에 홈페이지에서 get 요청 올시 가져오는 데이터 수정 필요, 페이지네이션 이전, 다음 버튼 서버에서 처리 필요

      //+ 프로젝트 총 갯수 가져오기
      const total = await this.projectRepository.findAllProjectCount();

      const totalPage = Math.ceil(total / limit);

      //+ 현재 페이지가 총 페이지 수보다 높을 때 예외 처리
      if (page > totalPage) {
        page = totalPage;
      }

      const pageLimit = 10;
      const currentPageGroup = Math.ceil(page / pageLimit);
      const firstPage = (currentPageGroup - 1) * pageLimit + 1;
      let lastPage = currentPageGroup * pageLimit;
      const pageArr = [];

      //+ 마지막 페이지가 총 페이지 수보다 높을 때 예외 처리
      if (lastPage > totalPage) {
        lastPage = totalPage;
      }

      for (let i = firstPage; i <= lastPage; i++) {
        pageArr.push(i);
      }

      const offset = (page - 1) * limit;

      //+ 해당 status 와 limit 갯수만큼 프로젝트들 조회
      const projects = await this.projectRepository.findAllOffsetBasedProjects(
        offset,
        limit
      );

      const pageInfo = { pageArr, totalPage };

      return { pageInfo, projects };
    } catch (error) {
      throw error;
    }
  };

  //* 페이지별 커서 기반 전체 프로젝트 조회 및 페이지네이션
  getCursorBasedProjects = async (page, cursor) => {
    try {
      if (!page) {
        throw new Error('url이 올바르지 않습니다.');
      }

      if (!cursor) {
        cursor = 0;
      }

      if (page === '/') {
        page = 'home';
      }

      page = page.replace('/', '');

      let limit = 3;

      cursor = Number(cursor);
      let projects;
      if (page === 'portfolios') {
        const status = 5;
        limit = 6;
        projects =
          await this.projectRepository.findAllCursorBasedProjectsByStatus(
            cursor,
            status,
            limit
          );
      } else if (page === 'home' || page === 'projects') {
        projects =
          await this.projectRepository.findAllCursorBasedProjectsByStatus(
            cursor
          );
      } else {
        throw new Error('url이 올바르지 않습니다.');
      }
      const nextCursor = projects.length === limit ? projects.at(-1).id : null;
      return { nextCursor, page, projects };
    } catch (error) {
      throw error;
    }
  };

  //* 프로젝트 생성
  createProject = async (projectInfo) => {
    try {
      await this.projectRepository.createProject(projectInfo);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectService;
