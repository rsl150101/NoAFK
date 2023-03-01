const ProjectService = require('../services/projects.service');

class ProjectController {
  projectService = new ProjectService();

  //+ 전체 프로젝트 페이지 렌더링
  getProjectsPage = (req, res) => {
    return res.status(200).render('projects');
  };

  //+ 전체 프로젝트 데이터 조회
  getProjects = async (req, res) => {
    return res.json();
  };

  //+ 프로젝트 생성
  createProject = async (req, res) => {
    try {
      await this.projectService.createProject(req.body);
      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = ProjectController;
