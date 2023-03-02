const ProjectRepository = require('../repositories/projects.repository');
const { Project } = require('../models');

class ProjectService {
  projectRepository = new ProjectRepository(Project);

  //* 전체 프로젝트 조회 및 페이지별 페이지네이션
  getProjects = async (page, site) => {
    if (!page || !site) {
      throw new Error('page 또는 site 가 정의되지 않았습니다.');
    }
    try {
      let limit;
      let status = 0;
      switch (site) {
        case 'home':
          limit = 6;
          break;

        case 'notices':
          limit = 3;
          break;

        case 'projects':
          limit = 5;
          status = 5;
          break;

        case 'admin':
          limit = 10;
          break;
      }

      //+ 상태에 따른 프로젝트 총 갯수 가져오기
      const total = await this.projectRepository.findAllProjectCount(status);

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
      const projects = await this.projectRepository.findAllByProjectStatus(
        offset,
        limit,
        status
      );

      return { pageArr, projects };
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
