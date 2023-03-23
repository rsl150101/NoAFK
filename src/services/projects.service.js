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
      const projectById = await this.projectRepository.findProjectById(id);
      const ownerId = Number(projectById.owner);

      const NicknameById = await this.userRepository.findNicknameById(ownerId);
      projectById.nickname = NicknameById.nickname;

      return projectById;
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

  hardDeleteProject = (id) => {
    try {
      this.projectRepository.hardDeleteProject(id);
      return;
    } catch (error) {
      throw error;
    }
  };

  //* 오프셋 기반 전체 프로젝트 조회 및 페이지네이션
  getOffsetBasedProjects = async (page, search) => {
    if (!page) {
      page = 1;
    }
    if (!search) {
      search = '';
    }

    try {
      const limit = 10;
      //+ 프로젝트 총 갯수 가져오기
      const total = await this.projectRepository.findAllProjectCount(search);
      const totalPage = Math.ceil(total / limit);
      //+ 현재 페이지가 총 페이지 수보다 높을 때 예외 처리
      if (page > totalPage && totalPage !== 0) {
        page = totalPage;
      }
      const pageLimit = 10;
      const currentPageGroup = Math.ceil(page / pageLimit);
      const firstPage = (currentPageGroup - 1) * pageLimit + 1;
      let lastPage = currentPageGroup * pageLimit;
      let prevPage =
        page > pageLimit ? Math.floor(page / pageLimit) * 10 : null;
      let nextPage = Math.ceil(page / pageLimit) * 10 + 1;
      const pageArr = [];

      if (nextPage > totalPage) {
        nextPage = null;
      }

      if (totalPage <= pageLimit) {
        prevPage = null;
      }

      //+ 마지막 페이지가 총 페이지 수보다 높을 때 예외 처리
      if (lastPage > totalPage) {
        lastPage = totalPage;
      }

      for (let i = firstPage; i <= lastPage; i++) {
        pageArr.push(i);
      }

      const offset = (page - 1) * limit;

      //+ 해당 offset 부터 limit 갯수만큼 프로젝트들 조회
      const projects = await this.projectRepository.findAllOffsetBasedProjects(
        offset,
        limit,
        search
      );

      const pageInfo = {
        curPage: page,
        pageArr,
        prevPage,
        nextPage,
        totalPage,
      };

      return { pageInfo, projects };
    } catch (error) {
      throw error;
    }
  };

  //* 페이지별 커서 기반 전체 프로젝트 조회 및 페이지네이션
  getCursorBasedProjects = async (page, cursor, search) => {
    try {
      if (!page) {
        throw new Error('url이 올바르지 않습니다.');
      }

      if (!cursor) {
        cursor = 0;
      }

      if (!search) {
        search = '';
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
      } else if (page === 'projects') {
        projects =
          await this.projectRepository.findAllCursorBasedProjectsByStatus(
            cursor,
            search
          );
      } else if (page === 'home') {
        const allProjects = await this.projectRepository.findAllProjectByStatus(
          0
        );
        let end = 0;
        const randomProjects = [];
        while (end !== 12) {
          if (allProjects.length === 0) {
            break;
          }
          const randomNum = Math.floor(Math.random() * allProjects.length);
          randomProjects.push(allProjects[randomNum]);
          allProjects.splice(randomNum, 1);
          end += 1;
        }

        projects = randomProjects;
      } else {
        throw new Error('url이 올바르지 않습니다.');
      }

      const nextCursor = projects.length === limit ? projects.at(-1).id : null;
      const pageTitle = page.replace(/^[a-z]/, (char) => char.toUpperCase());
      return { nextCursor, page, projects, pageTitle };
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

  //* 해당 유저의 프로젝트 보기
  findProjectByUser = async (id) => {
    try {
      const allProjectInfoByUser = await this.teamRepository.projectByUser(id);

      return allProjectInfoByUser;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProjectService;
